import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';
const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});

let groupByTellerList = null;

export const {types, actions, rootReducer} = createResource({
  name: 'tellers',
  url: `${hostUrl}/cases/:case_id/bbills/branch/group-by-teller`,
  actions: {
    //B2-柜员号
    getGroupBy: {
      method: 'POST',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (action.body) {
          groupByTellerList = action.body.data;
        }
        if (status === 'resolved') {
          state.showLoading = false;
        } else {
          state.showLoading = true;
        }
        return {
          ...state,
          groupByTellerList
        };
      },
    },
    clear:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          groupByTellerList:null
        };
      },
    }
  },
});

