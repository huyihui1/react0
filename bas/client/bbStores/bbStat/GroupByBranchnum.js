import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';
const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});

let groupByBranchnumList = null;

export const {types, actions, rootReducer} = createResource({
  name: 'branchnums',
  url: `${hostUrl}/cases/:case_id/bbills/branch/group-by-branchnum`,
  actions: {
    //B1-机构号
    getGroupBy: {
      method: 'POST',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (action.body) {
          groupByBranchnumList = action.body.data;
        }
        if (status === 'resolved') {
          state.showLoading = false;
        } else {
          state.showLoading = true;
        }
        return {
          ...state,
          groupByBranchnumList
        };
      },
    },
    clear:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          groupByBranchnumList:null
        };
      },
    }
  },
});

