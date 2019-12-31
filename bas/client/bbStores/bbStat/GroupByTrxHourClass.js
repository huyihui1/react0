import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';
const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});

let trxHourClassList = null;

export const {types, actions, rootReducer} = createResource({
  name: 'trxHourClass',
  url: `${hostUrl}/cases/:caseId/bbills`,
  actions: {
    //A1对方账号
    getGroupBy: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/trx_hour/group-by-trxhourclass`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (action.body) {
          trxHourClassList = action.body.data;
        }
        if (status === 'resolved') {
          state.showLoading = false;
        } else {
          state.showLoading = true;
        }
        return {
          ...state,
          trxHourClassList
        };
      },
    },
    clear:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          trxHourClassList:null
        };
      },
    }
  },
});
