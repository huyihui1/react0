import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';

const hostUrl = ajax.baseUrl;

Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});
let findNewsData = [];
let correlation = '';

export const {types, actions, rootReducer} = createResource({
  name: 'FindNews',
  // url: `${hostUrl}/citizens/search`,
  actions: {
    fetch: {},
    create: {},
    search: {},
    get: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/pbills/analyze/find-new`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        state.showLoading = true;
        if (body) {
          body.data.shift();
          findNewsData = body.data;
        }
        if (status === 'resolved') {
          state.showLoading = false;
        }
        return {
          ...state,
          findNewsData,
        };
      },
    },
    setCorrelation: {
      isPure: true,
      reduce: (state, action) => {
        const {context} = action;
        // console.log(context);
        correlation = context.val;
        return {
          ...state,
          correlation,
          min_started_day: context.min_started_day,
          loc_type: context.loc_type
        };
      },
    },
    clearFindNewsData: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false})
      };
      },
    }
  },
});
