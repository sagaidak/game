import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/app';
import { Provider } from 'react-redux';
import ErrorBoundry from './components/error-boundry/error-boundry';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundry>
      <App />
    </ErrorBoundry>
  </Provider>,
  document.getElementById('root')
);
