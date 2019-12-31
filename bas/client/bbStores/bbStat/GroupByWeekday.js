import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';
const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});

let weekdayList = null;

export const {types, actions, rootReducer} = createResource({
  name: 'weekday',
  url: `${hostUrl}/cases/:caseId/bbills`,
  actions: {
    getGroupBy: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/datetime/group-by-weekday`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (action.body) {
          weekdayList = action.body.data;
        }
        if (status === 'resolved') {
          state.showLoading = false;
        } else {
          state.showLoading = true;
        }
        return {
          ...state,
          weekdayList
        };
      },
    },
    clear:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          weekdayList:null
        };
      },
    }
  },
});
