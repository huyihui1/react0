/*
 * Login Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import { push } from 'react-router-redux';
import { Message } from '@alifd/next';
import ajax from '../../utils/ajax';
import { login } from '../../api/user';
import { setAuthority } from '../../utils/authority';
import { reloadAuthorized } from '../../utils/Authorized';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  GET_CASE_NAME,
  CLEAR_CASE_NAME
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
const userLoginRequest = () => {
  return {
    type: USER_LOGIN_REQUEST,
    isLoading: true,
  };
};

const userLoginSuccess = (payload) => {
  return {
    type: USER_LOGIN_SUCCESS,
    payload,
    isLoading: false,
  };
};

const userLoginFailure = (payload) => {
  return {
    type: USER_LOGIN_FAILURE,
    payload,
    isLoading: false,
  };
};

export const userLogin = (params) => {
  return async (dispatch) => {
    dispatch(userLoginRequest());
    try {
      const response = await ajax.post('/user/login', params);
      console.log(response);
      dispatch(userLoginSuccess(response.data));
      if (response.meta.success) {
        Message.success('登录成功');
        setAuthority(response.data.currentAuthority);
        reloadAuthorized();
        window.sessionStorage.setItem('token', 200);
        dispatch(push('/'));
      } else {
        Message.error(response.meta.message);
      }

      return response.data;
    } catch (error) {
      dispatch(userLoginFailure(error));
    }
  };
};

// 验证登录

export const VerifyLogin = () => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/user/session');
      console.log(response);
      if (response.meta.success) {
        dispatch(userLoginSuccess(response.data));
      }
    } catch (error) {
      dispatch(userLoginFailure(error));
    }
  };
}

//  获取案件名称

export const getCaseName = (caseId) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get(`/cases/${caseId}/summary`);
      console.log(response);
      if (response.meta.success) {
        dispatch({
          type: GET_CASE_NAME,
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export const clearCaseName = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: CLEAR_CASE_NAME,
      });
    } catch (error) {
      console.log(error);
    }
  };
}
