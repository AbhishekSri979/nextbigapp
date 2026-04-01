/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-toast-message', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockToast = () => React.createElement(View, null);

  MockToast.show = jest.fn();
  MockToast.hide = jest.fn();

  return {
    __esModule: true,
    default: MockToast,
  };
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
