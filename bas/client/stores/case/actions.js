import {Message} from '@alifd/next';
import {
  FETCH_CASES,
  GET_CASE,
  CREATE_CASE,
  UPDATE_CASE,
  GET_ARCHIVED_CASES,
  GET_ACTIVE_CASES,
  SET_LOADING,
  TOGGLE_NAV,
  SET_CASE,
  REMOVE_CASE,
  CLEAR_CASE
} from './constants';

import ajax from '../../utils/ajax';


/**
 *
 * @param params
 * @param bool  是否清空case属性
 * @returns {Function}
 */

// 获取案件列表
export const getCasesList = (params, bool = false) => {
  return async (dispatch) => {
    dispatch(isLoading(true));
    const response = await ajax.get('/cases', params)
      .catch(err => {
        console.log(err);
        // Message.error('数据获取失败');
      });
    if (response) {
      if (bool) {
        response.case = {};
      }
      dispatch({
        type: FETCH_CASES,
        data: response,
      });
      dispatch(isLoading(false));
    }
    return response
  };
};

// 搜索案件
export const getCase = (data) => {
  return async (dispatch) => {
    dispatch(isLoading(true));
    const response = await ajax.post('/cases/search', {
      criteria: {...data},
      view: {},
    })
      .catch(err => {
        console.log(err);
        Message.error(`搜索失败 - ${err.message}`);
      });
    if (response && response.meta.success) {
      dispatch(isLoading(false));
      dispatch({
        type: GET_CASE,
        data: response,
      });
    }
  };
};

//  设置案件
export function setCase(caseInfo) {
  return function (dispatch) {
    dispatch({
      type: SET_CASE,
      data: caseInfo,
    });
  };
}


// 添加案件
export const addCases = (data) => {
  return async (dispatch, getState) => {
    Message.loading({
      title: '添加中...',
      duration: 0,
    });
    //  添加数据
    const response = await ajax.post('/cases', data)
      .catch(err => {
        console.log(err);
        Message.error('添加失败');
      });
    console.log(response);

    if (response && response.meta.success) {
      dispatch({
        type: CREATE_CASE,
        data: response.data,
      });
      Message.success('添加成功');
    } else if (response && response.meta.code === '1002') {
      Message.error('添加失败,该案件名或案件号已存在!');
    } else {
      Message.error('添加失败');
    }
  };
};

// 更新案件
export const updateCase = (data) => {
  return async (dispatch, getState) => {
    Message.loading({
      title: '添加中...',
      duration: 0,
    });
    //  添加数据
    const response = await ajax.put(`/cases/${data.id}`, data)
      .catch(err => {
        console.log(err);
        Message.error('添加失败');
      });
    if (response && response.meta.success) {
      dispatch({
        type: UPDATE_CASE,
        data: response.data,
      });
      Message.success('添加成功');
    } else if (response && response.meta.code === '1002') {
      Message.error('更新失败,该案件名或案件号已存在!');
    } else {
      Message.error('添加失败');
    }
  };
};

// 删除案件
export const removeCase = (data) => {
  return async (dispatch, getState) => {
    Message.loading({
      title: '删除中...',
      duration: 0,
    });
    //  添加数据
    const response = await ajax.remove(`/cases/${data.id}`)
      .catch(err => {
        Message.error('删除失败');
      });
    if (response && response.meta.success) {
      dispatch({
        type: REMOVE_CASE,
      });
      Message.success('删除成功');
      return response
    } else {
      Message.error('删除失败');
    }
  };
};


/* 过滤功能 */

// 存档
export const archivedCase = () => {
  return async (dispatch) => {
    dispatch(isLoading(true));
    //  添加数据
    const response = await ajax.get('/cases/filter/archived')
      .catch(err => {
        console.log(err);
        Message.error(err.message);
      });
    if (response && response.meta.success) {
      dispatch({
        type: GET_ARCHIVED_CASES,
        data: response,
      });
      dispatch(isLoading(false));
    }
  };
};


// 在办
export const activeCase = (params) => {
  return async (dispatch) => {
    dispatch(isLoading(true));
    //  添加数据
    const response = await ajax.get('/cases/filter/active',params)
      .catch(err => {
        console.log(err);
        Message.error(err.message);
      });
    if (response && response.meta.success) {
      dispatch({
        type: GET_ACTIVE_CASES,
        data: response,
      });
      dispatch(isLoading(false));
    }
  };
};

export const toggleNav = () => {
  return async (dispatch) => {
    dispatch({
      type: TOGGLE_NAV,
    });
  };
};
export const clearCases = () => {
  return async (dispatch) => {
    dispatch({
      type: CLEAR_CASE,
    });
  };
};

const isLoading = (bool) => {
  return {
    type: SET_LOADING,
    isLoading: bool,
  };
};

