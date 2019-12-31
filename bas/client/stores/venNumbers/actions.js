import ajax from '../../utils/ajax';
import {Message} from '@alifd/next';
import moment from 'moment';

import {
  FETCH_VENNUMS,
  GET_VENNUM,
  CREATE_VENNUM,
  SET_VENNUM,
  DELETE_VENNUM,
  UPDATE_VENNUM,
  SET_LOADING,
  CHANGE_SHORNUM,
  GET_PNUMLABELS,
  GET_VENNUMBERS
} from './constants';


export const fetchVENnumbers = (id, params = null) => {
  return async (dispatch) => {
    dispatch(isLoading(true));
    const response = await ajax.get(`/cases/${id}/ven_numbers`, params)
      .catch(err => {
        Message.error('数据获取失败 - ' + err.message);
      });
    if (response && response.meta.success) {
      dispatch({
        type: FETCH_VENNUMS,
        payload: response,
      });
      dispatch(isLoading(false));
    }
  };
};

export const getVENnumber = (id, params = null) => {
  return async (dispatch) => {
    dispatch(isLoading(true));
    const response = await ajax.post(`/cases/${id}/ven_numbers/search?page=1&pagesize=10`, params)
      .catch(err => {
        Message.error('数据获取失败 - ' + err.message);
      });
    if (response && response.meta.success) {
      dispatch({
        type: GET_VENNUM,
        payload: response,
      });
      dispatch(isLoading(false));
    }
  };
}

export const createVENnumber = (data) => {
  return async (dispatch, getState) => {
    Message.loading({
      title: '添加中...',
      duration: 0,
    });
    const id = getState()
      .route
      .location
      .pathname
      .match(/[0-9]/i)[0];
    console.log(data);
    //  添加数据
    const response = await ajax.post(`/cases/${id}/ven_numbers`, data)
      .catch(err => {
        console.log(err);
        Message.error('添加失败');
      });
    console.log(response);
    if (response && response.meta.success) {
      data.updated_at = moment()
        .format('YYYY-MM-DD hh:mm');
      data.id = response.data.id;
      data.pbills = response.data.pbills
      dispatch({
        type: CREATE_VENNUM,
        data,
      });
      Message.success('添加成功');
    } else if (response && response.meta.code === '1002') {
      Message.error('添加失败,该虚拟网号码已存在!');
    }
  };
};

export const setVENnumber = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_VENNUM,
      data,
    });
  };
};

export const updateVENnumber = (data) => {
  return async (dispatch, getState) => {
    Message.loading({
      title: '修改中...',
      duration: 0,
    });
    const casesId = getState()
      .route
      .location
      .pathname
      .match(/[0-9]/i)[0];
    console.log(data);
    //  添加数据
    const response = await ajax.put(`/cases/${casesId}/ven_numbers/${data.id}`, data)
      .catch(err => {
        console.log(err);
        Message.error('修改失败');
      });
    console.log(response);
    if (response && response.meta.success) {
      dispatch({
        type: UPDATE_VENNUM,
        data,
      });
      Message.success('修改成功');
    }
  };
};

export const deleteVENnumber = (activeId, casesId, id) => {
  return async (dispatch) => {
    Message.loading({
      title: '删除中...',
      duration: 0,
    });
    const response = await ajax.remove(`/cases/${casesId}/ven_numbers/${id}`)
      .catch(err => {
        console.log(err);
        Message.error('删除失败');
      });
    if (response && response.meta.message) {
      dispatch({
        type: DELETE_VENNUM,
        activeId,
      });
      Message.success('删除成功');
    }
  };
};


export const shortnumChange = (casesId) => {
  return async (dispatch) => {
    Message.loading({
      title: '转换中...',
      duration: 0,
    });
    const response = await ajax.get(`/cases/${casesId}/pbills/records/conv-ven-nums`)
      .catch(err => {
        console.log(err);
        Message.error('转换删除失败');
      });
    if (response && response.meta.success) {
      dispatch({
        type: CHANGE_SHORNUM,
      });
      Message.success('转化成功');
    }
  };
};

export const getPnumLabels = (casesId) => {
  return async (dispatch) => {
    const response = await ajax.get(`/cases/${casesId}/pnum_labels?page=1&pagesize=10`)
      .catch(err => {
        console.log(err);
      });
    if (response && response.meta.success) {
      dispatch({
        type: GET_PNUMLABELS,
        payload: response,
      });
    }
  };
};

export const getVenNumbers = (casesId) => {
  return async (dispatch) => {
    const response = await ajax.get(`/cases/${casesId}/ven_numbers/networks`)
      .catch(err => {
        console.log(err);
      });
    if (response && response.meta.success) {
      dispatch({
        type: GET_VENNUMBERS,
        payload: response,
      });
    }
  };
};


const isLoading = (bool) => {
  return {
    type: SET_LOADING,
    isLoading: bool,
  };
};

