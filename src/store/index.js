import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import * as reducers from './reducers';

const createRootReducer = ({ history }) => {
  const reducer = combineReducers({
    router: connectRouter(history),
    ...reducers,
  });
  return reducer;
};

const configureMiddleware = ({ history, ...thunkExtraArgument }) => {
  const middlewares = [
    routerMiddleware(history),
    thunkMiddleware.withExtraArgument(thunkExtraArgument),
  ];
  if (process.env.NODE_ENV === 'development') {
    const loggerMiddleware = createLogger();
    middlewares.push(loggerMiddleware);
  }
  return middlewares;
};

export const configureStore = config => preloadedState => {
  const rootReducer = createRootReducer(config);
  const middlewares = configureMiddleware(config);
  const composeEnhancers = composeWithDevTools;

  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middlewares)),
  );
  return store;
};
