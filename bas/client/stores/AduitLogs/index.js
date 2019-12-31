import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
// import appConfig from '../../appConfig';
// import myFetch from '../../helpers/fetch';

const hostUrl = ajax.baseUrl;

// let items = [];
// let meta = {};

// Object.assign(reduxRestResourceGlobals, { fetch: myFetch });
// Object.assign(initialState, { isLoading: true, pageSize: appConfig.pageSize });

export const {types, actions, rootReducer} = createResource({
  name: 'aduitLogs',
  url: `${hostUrl}/admin/audit-logs`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    },
    create: {
      method: 'POST',
      url: `${hostUrl}/admin/audit-logs/search`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    },
    get: {},
    delete: {},
    update: {},
    set: {},
  },
});
