import { GET_PBANALYZE, GET_OWNER_NUMS, GET_PEER_NUMS, FETCH_MYSEARCH, DELETE_MYSEARCH, CREATE_MYSEARCH, SET_LOADING, CREATE_TABITEM, DELETE_TABITEM, DELETE_EXT, TOGGLE_TABLE } from './constants';
import { Message } from '@alifd/next/lib/index';
import ajax from '../../utils/ajax';
import { formatFormData } from '../../utils/utils';

// const dateFormat = require('dateformat');

let ext = [];

export function _getPBAnalyze(PBAnalyze, ext=null, oldData=null) {
  const pbas = [];
  for (let i = 0; i < PBAnalyze.length; i++) {
    const p = PBAnalyze[i];
    let pba = {
      bill_type: trans_bill_type(p.bill_type),
      owner_num_status: trans_owner_num_st(p.owner_num_status),
      owner_comm_loc: p.owner_comm_loc,
      owner_num: p.owner_num,
      owner_cname: p.owner_cname,
      peer_cname: p.peer_cname,
      owner_label: p.owner_label,
      comm_direction: trans_comm_direction(p.comm_direction),
      peer_num: p.peer_num,
      peer_short_num: p.peer_short_num,
      peer_label: p.peer_label,
      attribution: p.attribution,
      peer_comm_loc: p.peer_comm_loc,
      long_dist: trans_long_dist(p.long_dist),
      ven: trans_ven(p.ven),
      started_day: p.started_day,
      started_time: p.started_time,
      // started_hour_class: dateFormat(p.started_time,"HH:MM"),
      started_time_l1_class: trans_started_time_state(p.started_time_l1_class),
      weekday: trans_started_time_week(p.weekday),
      time_class: trans_time_class(p.time_class),
      duration: p.duration,
      duration_class: trans_duration_class(p.duration_class),
      cell_tower: p.cell_tower,
      owner_ct_code: p.owner_ct_code,
      peer_ct_code: p.peer_ct_code,
      peer_num_attr: p.peer_num_attr,
      highlight: p.highlight,
      owner_ct_town: p.owner_ct_town,
      peer_ct_town: p.peer_ct_town,
      owner_ct_dist: p.owner_ct_dist,
      peer_ct_dist: p.peer_ct_dist
    };
    if (p.overlap_duration) {
      pba.overlap_duration = p.overlap_duration;
    }
    pbas.push(pba);
  }
  return {
    type: GET_PBANALYZE,
    state: oldData ? [...oldData, ...pbas] : pbas,
    last_alyz_day: PBAnalyze.length > 0 ? PBAnalyze[PBAnalyze.length - 1].alyz_day : null,
    ext
  };
}


export function getPBAnalyze(id) {
  return async (dispatch) => {
    dispatch(handleLoading(true));
    const response = await ajax.get(`/cases/${id}/pbills/records`)
      .catch(err => {
        Message.error(`数据获取失败 - ${err.message}`);
      });
    if (response && response.meta.success) {
      dispatch(_getPBAnalyze(response.data));
      dispatch(handleLoading(false));
    }
  };
}
function trans_bill_type(value) {
  const bill_type = value;
  if (bill_type == 1) {
    return '通话';
  } else if (bill_type == 2) {
    return '短信';
  } else if (bill_type == 3) {
    return '彩信';
  }
  return '';
}
function trans_owner_num_st(value) {
  const owner_num_st = value;
  if (owner_num_st == 0) {
    return '其它';
  } else if (owner_num_st == 1) {
    return '本地';
  } else if (owner_num_st == 2) {
    return '漫游';
  }
  return '';
}
function trans_comm_direction(value) {
  const comm_direction = value;
  if (comm_direction == 0) {
    return '未知';
  } else if (comm_direction == 11) {
    return '主叫';
  } else if (comm_direction == 12) {
    return '<---';
  } else if (comm_direction == 13) {
    return '呼转';
  } else if (comm_direction == 21) {
    return '主短';
  } else if (comm_direction == 22) {
    return '被短';
  } else if (comm_direction == 31) {
    return '主彩';
  } else if (comm_direction == 32) {
    return '被彩';
  }
  return '';
}
function trans_long_dist(value) {
  const long_dist = value;
  if (long_dist == 0) {
    return '';
  } else if (long_dist == 1) {
    return '长';
  }
  return '';
}
function trans_ven(value) {
  const ven = value;
  if (ven == 0) {
    return '';
  } else if (ven == 1) {
    return '虚';
  }
  return '';
}
function trans_started_time_state(value) {
  switch (value) {
    case 0:
      return '早晨';
    case 1:
      return '上午';
    case 2:
      return '中午';
    case 3:
      return '下午';
    case 4:
      return '傍晚';
    case 5:
      return '晚上';
    case 6:
      return '深夜';
    case 7:
      return '凌晨';
    default:
      return '';
  }
}
function trans_started_time_week(week) {
  // const started_time = value;
  // const week = dateFormat(started_time, 'ddd');
  if (week === 1) {
    return '一';
  } else if (week === 2) {
    return '二';
  } else if (week === 3) {
    return '三';
  } else if (week === 4) {
    return '四';
  } else if (week === 5) {
    return '五';
  } else if (week === 6) {
    return '六';
  } else if (week === 7) {
    return '日';
  }
}
function trans_time_class(value) {
  const time_class = value;
  if (time_class == 0) {
    return '私人';
  } else if (time_class == 1) {
    return 'Work';
  }
  return '';
}
function trans_duration_class(value) {
  const duration_class = value;
  if (duration_class == 0) {
    return '其它';
  } else if (duration_class == 1) {
    return '1~15秒';
  } else if (duration_class == 2) {
    return '16~90秒';
  } else if (duration_class == 3) {
    return '1.5~3分';
  } else if (duration_class == 4) {
    return '3~5分';
  } else if (duration_class == 5) {
    return '5~10分';
  } else if (duration_class == 6) {
    return '>10分';
  }
  return '';
}


export const getOwnerNum = (id) => {
  return async (dispatch) => {
    const response = await ajax.get(`/cases/${id}/pbills/owner_nums`)
      .catch(err => {
        Message.error(`数据获取失败 - ${err.message}`);
      });
    if (response && response.meta.success) {
      dispatch({
        type: GET_OWNER_NUMS,
        payload: response,
      });
    }
  };
};

export const getPeerNums = (id) => {
  return async (dispatch) => {
    const response = await ajax.get(`/cases/${id}/pbills/peer_nums`)
      .catch(err => {
        Message.error(`数据获取失败 - ${err.message}`);
      });
    if (response && response.meta.success) {
      dispatch({
        type: GET_PEER_NUMS,
        payload: response,
      });
    }
  };
};

export const searchPBAnalyze = (id, params, showLoading = true, url, isPaging=false) => {
  return async (dispatch, rootState) => {
    dispatch(handleLoading(showLoading));
    const daily_rec = params.daily_rec;
    const orderBy = params['order-by'];
    const page = params.page;
    delete params.daily_rec;
    delete params.page;
    delete params['order-by'];
    let values = {criteria: { ...params }, view: {'order-by': orderBy}, adhoc: {limit: 500, daily_rec, page }};
    if (Object.keys(values.criteria).length === 0) {
      return false;
    }
    if (url) {
      values = params
    }
    url = url ? url :  `/cases/${id}/pbills/records/search`;
    const response = await ajax.post(url, values)
      .catch(err => {
        Message.error(`数据获取失败 - ${err.message}`);
      });
    if (response && response.meta.success) {
      if (isPaging) {
        if (response.ext) {
          ext = {...ext, ...response.ext[0]}
        }
        dispatch(_getPBAnalyze(response.data, ext, rootState().PBAnalyze.items));
      } else {
        if (response.ext) {
          ext = response.ext[0]
        }
        dispatch(_getPBAnalyze(response.data, ext));
      }
      dispatch(handleLoading(false));
      return response
    }
    return response
  };
};

//  自定义搜索

export const fetchMySearch = (id) => {
  return async (dispatch) => {
    const response = await ajax.get(`/cases/${id}/searches`)
      .catch(err => {
        Message.error(`数据获取失败 - ${err.message}`);
      });
    if (response && response.meta.success) {
      if (response.data) {
        response.data.map((item) => {
          if (item.value) {
            const value = JSON.parse(item.value);
            for (const key in value) {
              if (Array.isArray(value[key]) && value[key].length > 1) {
                value[key].shift();
                value[key] = value[key][0];
              }
            }
            item.value = value;
          }
        });
      }
      dispatch({
        type: FETCH_MYSEARCH,
        payload: response,
      });
    }
  };
};

export const createMySearch = (caseId, params) => {
  return async (dispatch) => {
    const response = await ajax.post(`/cases/${caseId}/searches`, params)
      .catch(err => {
        Message.error(`创建失败 - ${err.message}`);
        return false;
      });
    if (response && response.meta.success) {
      if (response.data.value) {
        const value = JSON.parse(response.data.value);
        for (const key in value) {
          if (Array.isArray(value[key]) && value[key].length > 1) {
            value[key].shift();
          }
        }
        response.data.value = value;
      }
      dispatch({
        type: CREATE_MYSEARCH,
        payload: response.data,
      });
    }
  };
};

export const removeMySearch = (caseId, id) => {
  return async (dispatch) => {
    const response = await ajax.remove(`/cases/${caseId}/searches/${id}`)
      .catch(err => {
        Message.error(`数据获取失败 - ${err.message}`);
      });
    if (response && response.meta.success) {
      dispatch({
        type: DELETE_MYSEARCH,
        payload: id,
      });
    }
  };
};

export const searchCode = async (code, params) => {
  const response = await ajax.post(`/cell-towers/loc/transform`, { coord: '2', fmt: 16, ct_codes: [code]})
    .catch(err => {
      Message.error(`数据获取失败 - ${err.message}`);
    });
  return response;
}

export const clearItems = () => {
  return async (dispatch) => {
    dispatch(_getPBAnalyze([]));
  };
};

export const createTabItem = (data) => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_TABITEM,
      payload: data,
    });
  };
};
export const removeTabItem = (index) => {
  return async (dispatch) => {
    dispatch({
      type: DELETE_TABITEM,
      payload: index,
    });
  };
};
//  获取时间标注
export const fetchLabelPNs = async (caseId) => {
  const response = await ajax.get(`/cases/${caseId}/pnum_labels`)
    .catch(err => {
      Message.error(`数据获取失败 - ${err.message}`);
    });
  return response;
}

export const handleLoading = (bool) => {
  return {
    type: SET_LOADING,
    isLoading: bool,
  };
};

export const clearExt = () => {
  ext = []
  return async (dispatch) => {
    dispatch({
      type: DELETE_EXT,
      ext: []
    });
  };
}

export const toggleSimplePbillRecordList = (bool, params) => {
  return async (dispatch) => {
    dispatch({
      type: TOGGLE_TABLE,
      bool,
      params
    });
  };
};
