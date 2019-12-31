import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createHashHistory } from 'history';
import config from 'react-global-configuration';
import appConfig from './appConfig';
import {installExternalLibs} from './utils/utils';

// 载入默认全局样式 normalize 、.clearfix 和一些 mixin 方法等
import '@alifd/next/reset.scss';

import App from './router';
import configureStore from './configureStore';

config.set(appConfig);
installExternalLibs('#app')
// Create redux stores with history
const initialState = {};
export const history = createHashHistory();
export const store = configureStore(initialState, history);
const ICE_CONTAINER = document.getElementById('ice-container');

if (!ICE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="ice-container"></div> 节点.');
}
String.prototype.paddingLeft = function (paddingValue) {
  return String(paddingValue + this).slice(-paddingValue.length);
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}><App store={store}></App></ConnectedRouter>
  </Provider>,
  ICE_CONTAINER
);

