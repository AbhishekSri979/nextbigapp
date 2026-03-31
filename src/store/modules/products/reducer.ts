interface ProductsState {
  data: unknown[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  data: [],
  loading: false,
  error: null,
};

function productsReducer(
  state: ProductsState = initialState,
): ProductsState {
  return state;
}

export default productsReducer;
