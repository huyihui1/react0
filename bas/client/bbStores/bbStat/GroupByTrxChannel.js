import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';
const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});

let groupByTrxchannelList = null;
let groupByTrxchannelclassList = null;

export const {types, actions, rootReducer} = createResource({
  name: 'trxchannel',
  url: `${hostUrl}/cases/:caseId/bbills`,
  actions: {
    //F4交易渠道
    getGroupBy: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/overview/group-by-trxchannel`,
      reduce: (state, action) => {
        state.showLoading = true;
        if (action.body) {
          state.showLoading = false;
          let arr = [];
          for (let key in action.body.data[0]) {
            let obj = {
              trx_channel: key,
              count: action.body.data[0][key]
            };
            arr.push(obj)
          }
          groupByTrxchannelList = arr;
        }
        return {
          ...state,
          groupByTrxchannelList
        };
      },
    },
    get: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/overview/group-by-trxchannelclass`,
      reduce: (state, action) => {
        state.showLoading = true;
        if (action.body) {
          state.showLoading = false;
          let arr = [];
          for (let key in action.body.data[0]) {
            let obj = {
              trx_channel_class: key,
              count: action.body.data[0][key]
            };
            arr.push(obj)
          }
          groupByTrxchannelclassList = arr;
        }
        return {
          ...state,
          groupByTrxchannelclassList
        };
      },
    },
    clear:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          groupByTrxchannelList:null
        };
      },
    },
    clearClass:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          groupByTrxchannelclassList:null
        };
      },
    }
  },
});
