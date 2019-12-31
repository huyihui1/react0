import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';

const hostUrl = ajax.baseUrl;
let pnumLabels = [];
let meta = {};

Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isLoading: true, pageSize: appConfig.pageSize, globalItem: {}, accountItem: {}});

export const {types, actions, rootReducer} = createResource({
  name: 'CasesImport',
  url: `${hostUrl}/cases/`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
          console.log(body);
          state.items = action.body.data;
          meta = body.meta
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }
        return {
          ...state,
          meta
        };
      },
    },
    create: {
      method: 'GET',
      url: `${hostUrl}/cases/:cases_id/pbills/`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    },
    delete: {},
    update: {},
    getPnumLabels: {
      method: 'GET',
      url: `${hostUrl}/cases/:caseId/pnum_labels`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
          console.log(body);
          pnumLabels = body.data
        }
        return {
          ...state,
          pnumLabels
        };
      },
    },
    imports: {
      method: 'POST',
      url: `${hostUrl}/cases/:id/pbills/records/copy`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    },
    searchOwnerNum: {
      method: 'POST',
      url: `${hostUrl}/cases/:caseId/pbills/search-with-cases`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    }
  },
});
