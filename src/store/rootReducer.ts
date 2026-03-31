import { combineReducers } from 'redux';

import productsReducer from './modules/products/reducer';
import usersReducer from './modules/users/reducer';

const rootReducer = combineReducers({
  users: usersReducer,
  products: productsReducer,
});

export default rootReducer;
