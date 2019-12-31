import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';
const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});

let groupByPeeracctandtrxtimel1classList = null;

export const {types, actions, rootReducer} = createResource({
  name: 'peeracctandtrxtimel1class',
  url: `${hostUrl}/cases/:caseId/bbills`,
  actions: {
    //A3-对方账号vs交易时段
    getGroupBy: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/peer_acct/group-by-peeracctandtrxtimel1class`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (action.body) {
          console.log(action.body)
          groupByPeeracctandtrxtimel1classList = formatPeeracctandtrxtimel1class(action.body.data);
        }
        if (status === 'resolved') {
          state.showLoading = false;
        } else {
          state.showLoading = true;
        }
        return {
          ...state,
          groupByPeeracctandtrxtimel1classList
        };
      },
    },
    clear:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          groupByPeeracctandtrxtimel1classList:null
        };
      },
    }
  },
});

function formatPeeracctandtrxtimel1class(data) {//把数组转换为对象
  const arr = [];
  for (let i = 0; i < data.length; i++) {
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    arr.push(ai)

  }
  console.log(arr)
  return arr;
}
