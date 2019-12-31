/**
 * 定义应用路由
 */
import { Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';

import UserLayout from './layouts/UserLayout';
import BasicLayout from './layouts/BasicLayout';

// 按照 Layout 分组路由
// UserLayout 对应的路由：/user/xxx
// BasicLayout 对应的路由：/xxx
const router = (props) => {
  const { store } = props;
  return (
    <Switch>
      <Route path="/user" component={UserLayout} />
      {
        // store.getState().login && store.getState().login.loginResult || window.sessionStorage.getItem('token') == 200 ? <Route path="/" component={BasicLayout} /> : <Redirect to={'/user/login'} />
        <Route path="/" component={BasicLayout} />
      }
    </Switch>
  );
};

export default router;
