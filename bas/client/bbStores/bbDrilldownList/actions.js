
import {
  TOGGLE_TABLE,
  SEARCH_STARTEDDA,
  REMOVE_PARAMETERS,
  ADD_PARAMETERS,
  SET_LOADING
} from './constants';





export const toggleBbDrilldownList= (bool, params,header) => {
  return async (dispatch, rootState) => {
    if (bool) {
      dispatch(addParameters(params));
      dispatch({
        type: TOGGLE_TABLE,
        bool,
        params,
        header
      });
    } else {
      dispatch({
        type: TOGGLE_TABLE,
        bool,
      });
      return dispatch(removeParameters(params))
    }

  };
};

const addParameters = (params) => {
  return async (dispatch) => {
    dispatch({
      type: ADD_PARAMETERS,
      params: params
    });
  };
};

const removeParameters = (params) => {
  return async (dispatch, rootState) => {
    let p = rootState().bbDrilldownList.parameters;
    p.pop();
    let criteria = p[p.length - 1];
    let opt = {criteria, view: {'order-by': "trx_full_time"}, adhoc: {limit: 500, page: 1 }};
    dispatch({
      type: REMOVE_PARAMETERS,
      params: p
    });
    if (p.length > 0) {
      return opt
    } else {
      return false
    }
  };
};



