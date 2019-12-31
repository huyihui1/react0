import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
// import myFetch from '../../helpers/fetch';

const hostUrl = ajax.baseUrl;

// let items = [];
// let meta = {};

// Object.assign(reduxRestResourceGlobals, { fetch: myFetch });
Object.assign(initialState, {isLoading: true, pageSize: appConfig.pageSize,missedCtRequestsIsLoading:true});

export const {types, actions, rootReducer} = createResource({
  name: 'SystemDatas',
  url: `${hostUrl}/admin/backups`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }
        return {
          ...state,
        };
      },
    },
    export: {
      method: 'GET',
      url: `${hostUrl}/admin/backups/export`,
      reduce: (state, action) => {
        state.isLoading = true;
        const {context, body, status} = action;
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }
        return {
          ...state,
        };
      },
    },
    restore: {
      method: 'POST',
      url: `${hostUrl}/admin/backups/restore`,
      reduce: (state, action) => {
        state.isLoading = true;
        const {context, body, status} = action;
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }
        return {
          ...state,
        };
      },
    },
    getmissedCtRequestsList: {
      method: 'GET',
      url: `${hostUrl}/admin/missed-ct-requests?page=:page`,
      reduce: (state, action) => {
        state.missedCtRequestsIsLoading = true;
        const {context, body, status} = action;
        if (status === 'resolved') {
          state.missedCtRequestsIsLoading = false;
        } else {
          state.missedCtRequestsIsLoading = true;
        }
        return {
          ...state,
        };
      },
    }
  },
});
