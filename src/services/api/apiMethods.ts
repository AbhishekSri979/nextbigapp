import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const StatusCodes = {
  Success: 1,
  Failure: 0,
  Unauthenticate: 2,
} as const;

const DEFAULT_ERROR_MESSAGE = 'Something went wrong.';
const SUCCESS_STATUS_MIN = 200;
const SUCCESS_STATUS_MAX = 400;
const UNAUTHORIZED_STATUS_CODES = new Set([401, 403]);
const SERVICE_UNAVAILABLE_STATUS = 503;

type Headers = Record<string, string>;
type ApiClient = Pick<AxiosInstance, 'post' | 'put' | 'delete' | 'get'>;
type ApiStatus = (typeof StatusCodes)[keyof typeof StatusCodes] | 503;

interface ErrorEnvelope {
  message?: string;
  errorMessage?: string;
  error?: string | { message?: string };
}

export interface ApiMethodResponse<T = unknown> {
  status: ApiStatus;
  result: T | { msg: string | null };
  _endpoint: string;
}

const extractMessage = (payload: unknown): string | null => {
  if (typeof payload === 'string') {
    return payload;
  }

  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const errorPayload = payload as ErrorEnvelope;

  if (typeof errorPayload.message === 'string') {
    return errorPayload.message;
  }

  if (typeof errorPayload.errorMessage === 'string') {
    return errorPayload.errorMessage;
  }

  if (typeof errorPayload.error === 'string') {
    return errorPayload.error;
  }

  if (
    errorPayload.error &&
    typeof errorPayload.error === 'object' &&
    typeof errorPayload.error.message === 'string'
  ) {
    return errorPayload.error.message;
  }

  return null;
};

const createSuccessResponse = <T>(
  url: string,
  response: AxiosResponse<T>,
): ApiMethodResponse<T> => ({
  status: StatusCodes.Success,
  result: response.data,
  _endpoint: url,
});

const createFailureResponse = (
  url: string,
  status: ApiStatus,
  message: string | null = DEFAULT_ERROR_MESSAGE,
): ApiMethodResponse<{ msg: string | null }> => ({
  status,
  result: { msg: message ?? DEFAULT_ERROR_MESSAGE },
  _endpoint: url,
});

const isSuccessfulResponse = (response: AxiosResponse<unknown> | undefined) =>
  Boolean(
    response &&
      response.status >= SUCCESS_STATUS_MIN &&
      response.status < SUCCESS_STATUS_MAX,
  );

const handleResolvedResponse = <T>(
  url: string,
  response?: AxiosResponse<T>,
): ApiMethodResponse<T | { msg: string | null }> => {
  if (!response) {
    return createFailureResponse(url, StatusCodes.Failure);
  }

  if (isSuccessfulResponse(response)) {
    return createSuccessResponse(url, response);
  }

  return createFailureResponse(
    url,
    StatusCodes.Failure,
    extractMessage(response.data),
  );
};

const handleRejectedResponse = (
  url: string,
  error: unknown,
): ApiMethodResponse<{ msg: string | null }> => {
  const axiosError = error as AxiosError<ErrorEnvelope>;
  const response = axiosError.response;
  const status = response?.status;

  if (status && UNAUTHORIZED_STATUS_CODES.has(status)) {
    return createFailureResponse(url, StatusCodes.Unauthenticate, response?.data?.detail || 'Unauthorized');
  }

  if (status === SERVICE_UNAVAILABLE_STATUS) {
    return createFailureResponse(
      url,
      SERVICE_UNAVAILABLE_STATUS,
      extractMessage(response?.data),
    );
  }

  return createFailureResponse(
    url,
    StatusCodes.Failure,
    extractMessage(response?.data),
  );
};

export const Method = {
  POST<TResponse = unknown, TBody = unknown>(
    url: string,
    axiosApiKit: ApiClient,
    body: TBody,
    header: Headers = {},
  ): Promise<ApiMethodResponse<TResponse | { msg: string | null }>> {
    return axiosApiKit
      .post<TResponse>(url, body, { headers: header })
      .then(response => handleResolvedResponse(url, response))
      .catch(error => handleRejectedResponse(url, error));
  },

  PUT<TResponse = unknown, TBody = unknown>(
    url: string,
    axiosApiKit: ApiClient,
    body: TBody,
    header: Headers = {},
  ): Promise<ApiMethodResponse<TResponse | { msg: string | null }>> {
    return axiosApiKit
      .put<TResponse>(url, body, { headers: header })
      .then(response => handleResolvedResponse(url, response))
      .catch(error => handleRejectedResponse(url, error));
  },

  DELETE<TResponse = unknown, TBody = unknown>(
    url: string,
    axiosApiKit: ApiClient,
    body?: TBody,
  ): Promise<ApiMethodResponse<TResponse | { msg: string | null }>> {
    return axiosApiKit
      .delete<TResponse>(url, { data: body })
      .then(response => handleResolvedResponse(url, response))
      .catch(error => handleRejectedResponse(url, error));
  },

  GET<TResponse = unknown>(
    url: string,
    axiosApiKit: ApiClient,
    header: Headers = {},
  ): Promise<ApiMethodResponse<TResponse | { msg: string | null }>> {
    return axiosApiKit
      .get<TResponse>(url, { headers: header })
      .then(response => handleResolvedResponse(url, response))
      .catch(error => handleRejectedResponse(url, error));
  },
};
