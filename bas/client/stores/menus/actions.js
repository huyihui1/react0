import {Message} from '@alifd/next';
import {
  GET_FAVORITESLIST,
  ADD_FAVORITES,
  DELETE_FAVORITES,
  CLEAR_FAVORITES
} from './constants';

import ajax from '../../utils/ajax';


/**
 *
 * @param params
 * @param bool  是否清空case属性
 * @returns {Function}
 */



//  获取收藏夹列表数据

export const getFavoritesList = (subject) => {
  return async (dispatch) => {
    const response = await ajax.get(`/${subject}/favorites`)
      .catch(err => {
        console.log(err);
        Message.error(err.message);
      });
    if (response && response.meta.success) {
      let arr = []
      response.data.forEach(item => {
        arr.push(item.mkey);
      })
      dispatch({
        type: GET_FAVORITESLIST,
        data: arr,
        dataId:response.data
      });
    }
  };
};

export const clearFavorites = () => {
  return async (dispatch) => {
    dispatch({
      type: CLEAR_FAVORITES
    })
  }
}

//添加收藏夹
export const addFavorites = (mkey, subject) => {
  return async (dispatch) => {
    const response = await ajax.post(`/${subject}/favorites`,{mkey:mkey})
      .catch(err => {
        console.log(err);
        Message.error(err.message);
      });
    if (response && response.meta.success) {
      console.log(response);
      dispatch({
        type: ADD_FAVORITES,
      });
    }
  };
};

//取消收藏夹
export const deleteFavorites = (id) => {
  return async (dispatch) => {
    const response = await ajax.remove('/favorites/'+id)
      .catch(err => {
        console.log(err);
        Message.error(err.message);
      });
    if (response && response.meta.success) {
      console.log(response);
      dispatch({
        type: DELETE_FAVORITES,
      });
    }
  };
};

