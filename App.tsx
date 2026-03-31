import React from 'react';
import { Provider } from 'react-redux';

import MainApp from './src/app/App';
import { store } from './src/store';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}

export default App;
