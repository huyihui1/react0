import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';
const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});

let groupByowneracctList = null;

export const {types, actions, rootReducer} = createResource({
  name: 'owneracct',
  url: `${hostUrl}/cases/:caseId/bbills`,
  actions: {
    //C1本方卡号
    getGroupBy: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/owner_acct/group-by-owneracct`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (action.body) {
          groupByowneracctList = action.body.data;
        }
        if (status === 'resolved') {
          state.showLoading = false;
        } else {
          state.showLoading = true;
        }
        return {
          ...state,
          groupByowneracctList
        };
      },
    },
    clear:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          groupByowneracctList:null
        };
      },
    }
  },
});
