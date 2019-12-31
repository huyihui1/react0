import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';
const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});

let groupByOwneracctandtrxtimel1classList = null;

export const {types, actions, rootReducer} = createResource({
  name: 'owneracctandtrxtimel1class',
  url: `${hostUrl}/cases/:caseId/bbills`,
  actions: {
    //C3-本方方卡号vs交易时段
    getGroupBy: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/owner_acct/group-by-owneracctandtrxtimel1class`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (action.body) {
          groupByOwneracctandtrxtimel1classList = formatowneracctandtrxtimel1class(action.body.data);
        }
        if (status === 'resolved') {
          state.showLoading = false;
        } else {
          state.showLoading = true;
        }
        return {
          ...state,
          groupByOwneracctandtrxtimel1classList
        };
      },
    },
    clear:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          groupByOwneracctandtrxtimel1classList:null
        };
      },
    }
  },
});

function formatowneracctandtrxtimel1class(data) {
  const arr = [];
  for (let i = 0; i < data.length; i++) {
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    arr.push(ai)
  }
  return arr;
}
