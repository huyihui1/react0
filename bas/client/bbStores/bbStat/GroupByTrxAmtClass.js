import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';
const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});

let groupBytrxamtclassList = null;

export const {types, actions, rootReducer} = createResource({
  name: 'trxamtclass',
  url: `${hostUrl}/cases/:caseId/bbills`,
  actions: {
    //F2金额种类
    getGroupBy: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/overview/group-by-trxamtclass`,
      reduce: (state, action) => {
        state.showLoading = true;
        if (action.body) {
          state.showLoading = false;
          let arr = [];
          for (let key in action.body.data[0]) {
            let obj = {
              trx_amt_class: key,
              count: action.body.data[0][key]
            };
            arr.push(obj)
          }
          groupBytrxamtclassList = arr;
        }
        return {
          ...state,
          groupBytrxamtclassList
        };
      },
    },
    clear:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          groupBytrxamtclassList:null
        };
      },
    }
  },
});
