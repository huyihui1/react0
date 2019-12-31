import {createResource, defaultGlobals, initialState} from 'redux-rest-resource';
import moment from 'moment';

import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';

const hostUrl = appConfig.rootUrl;

let relatedItems = null;
let relatedList = null;

Object.assign(defaultGlobals, {fetch: myFetch});

export const {types, actions, rootReducer} = createResource({
  name: 'related',
  url: `${hostUrl}/cases/:case_id/pbills/overview`,
  actions: {
    fetch: {
      method: 'GET',
      url: `${hostUrl}/cases/:case_id/pbills/:num/related`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          relatedItems = body.data;
          relatedList = formatRelated(relatedItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          relatedItems,
          relatedList,
        };
      },
    },
  }
});

function formatRelated(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = [];
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }

    if (!map[ai.owner_num]) {
      tempArr[0] = ai.owner_num;
      tempArr[1] = ai.owner_cname;
      tempArr[2] = ai['标签'];
      tempArr[3] = ai['职务'];
      tempArr[4] = ai.num_connection;
      tempArr[5] = ai.call_count;
      tempArr[6] = ai.online_days;
      tempArr[7] = ai.sms_count;
      tempArr[8] = ai['主叫'];
      tempArr[9] = ai['<--'];
      tempArr[10] = ai['呼转'];
      tempArr[11] = ai.private_time_count;
      tempArr[12] = ai.work_time_count;
      tempArr[13] = ai.more_than_5_count;
      tempArr[14] = ai.after_21_count;
      tempArr[15] = `${Math.floor(ai.total_duration / 60)}分`;
      tempArr[16] = ai['平均时长'];
      tempArr[17] = ai['时间分割'];
      tempArr[18] = ai.first_day;
      tempArr[19] = ai.last_day;
      arr2.push(tempArr);
      map[ai.owner_num] = ai;
    } else {

    }
  }
  if (data.length > 0 && arr2.length < 15) {
    let l = 15 - arr2.length;
    for (let j = 0; j < l; j++) {
      arr2.push([]);
    }
  }
  return arr2;
}


