import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';
import {searchCode} from "../PBAnalyze/actions";

const hostUrl = ajax.baseUrl;

let items = [];
let meta = {};
let normalizeCTList = [];

Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isLoading: true, pageSize: appConfig.pageSize, showLoading: false});

export const {types, actions, rootReducer} = createResource({
  name: 'normalizeCT',
  url: `${hostUrl}/cases/:caseId/pbills/cell-towers/malformed`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const {context, body, status} = action;
        state.showLoading = true;

        if (body) {
          normalizeCTList = body.data;
          meta = body.meta
        }
        if (status === 'resolved') {
          state.showLoading = false;
        }
        return {
          ...state,
          normalizeCTList,
          meta
        };
      },
    },
    getSuggestData: {
      method: 'POST',
      url: `${hostUrl}/cases/:caseId/pbills/cell-towers/suggest`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
        }
        return {
          ...state,
        };
      },
    },
    completeData: {
      method: 'POST',
      url: `${hostUrl}/cases/:caseId/pbills/cell-towers/fix-malformed`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
        }
        return {
          ...state,
        };
      },
    },
    fixMlformed: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/pbills/cell-towers/fix-malformed`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
        }
        return {
          ...state,
        };
      },
    },
    searchCode: {
      method: 'POST',
      url: `${hostUrl}/cell-towers/loc/transform`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
        }
        return {
          ...state,
        };
      },
    },
    search:{
      method: 'POST',
      url: `${hostUrl}/cases/:caseId/pbills/cell-towers/malformed/search`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
          normalizeCTList = body.data;
          meta = body.meta
        }
        return {
          ...state,
          normalizeCTList,
          meta
        };
      },
    }
  },
});
