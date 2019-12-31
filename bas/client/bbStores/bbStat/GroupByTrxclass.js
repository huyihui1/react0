import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';
const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});

let groupByTrxclassList = null;

export const {types, actions, rootReducer} = createResource({
  name: 'trxclass',
  url: `${hostUrl}/cases/:caseId/bbills`,
  actions: {
    //F1交易类型
    getGroupBy: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/overview/group-by-trxclass`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (action.body) {
          let arr = [];
          for (let key in action.body.data[0]) {
            let obj = {
              trx_class: key,
              count: action.body.data[0][key]
            };
            arr.push(obj)
          }
          groupByTrxclassList = arr;
        }
        if (status === 'resolved') {
          state.showLoading = false;
        } else {
          state.showLoading = true;
        }
        return {
          ...state,
          groupByTrxclassList
        };
      },
    },
    clear:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          groupByTrxclassList:null
        };
      },
    }
  },
});
