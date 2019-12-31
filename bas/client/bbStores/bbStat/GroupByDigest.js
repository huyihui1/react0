import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';
const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});

let groupByDigestList = null;

export const {types, actions, rootReducer} = createResource({
  name: 'digests',
  url: `${hostUrl}/cases/:caseId/bbills`,
  actions: {
    //  F3 交易摘要
    getGroupBy: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/overview/group-by-digest`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (action.body && body.meta.success) {
          groupByDigestList = body.data;
        }
        if (status === 'resolved') {
          state.showLoading = false;
        } else {
          state.showLoading = true;
        }
        return {
          ...state,
          groupByDigestList
        };
      },
    },
    clear:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          groupByDigestList:null
        };
      },
    }
  },
});
