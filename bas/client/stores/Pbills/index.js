import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';

const hostUrl = ajax.baseUrl;

Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {pageSize: appConfig.pageSize, showLoading: false});

let pbillsList = [];
let venNumBers = [];
let relNumBers = [];
let meta = {};
let labelGroupList = [];


export const {types, actions, rootReducer} = createResource({
  name: 'pbills',
  url: `${hostUrl}/cases/:caseId/pbills`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const {context, body, status} = action;
        state.showLoading = true;

        if (body) {
          pbillsList = body.data;
          meta = body.meta;
        }
        if (status === 'resolved') {
          state.showLoading = false;
        }
        return {
          ...state,
          pbillsList,
          meta
        };
      },
    },
    create: {},
    remove: {
      method: 'POST',
      url: `${hostUrl}/cases/:caseId/pbills`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    },
    search: {
      method: 'POST',
      url: `${hostUrl}/cases/:caseId/pbills/search`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
          pbillsList = body.data
        }
        return {
          ...state,
          pbillsList
        };
      },
    },
    setNetwork: {
      method: 'POST',
      url: `${hostUrl}/cases/:caseId/pbills/set-ven`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    },
    setFanily: {
      method: 'POST',
      url: `${hostUrl}/cases/:caseId/pbills/set-rel-network`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    },
    setCity: {
      method: 'POST',
      url: `${hostUrl}/cases/:caseId/pbills/set-residence`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    },
    getAbnormalData: {
      method: 'GET',
      url: `${hostUrl}/cases/:caseId/pbills/only-outliers`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
          pbillsList = body.data;
          meta = body.meta;
        }
        return {
          ...state,
          meta,
          pbillsList
        };
      },
    },
    shortNumChange: {
      method: 'GET',
      url: `${hostUrl}/cases/:caseId/pbills/records/conv-short-nums`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {

        }
        return {
          ...state,
        };
      },
    },
    getVenNumBers: {
      method: 'GET',
      url: `${hostUrl}/cases/:caseId/ven_numbers/networks`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
          venNumBers = body.data;
        }
        return {
          ...state,
          venNumBers
        };
      },
    },
    getRelNumBers: {
      method: 'GET',
      url: `${hostUrl}/cases/:caseId/rel_numbers/networks`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
          relNumBers = body.data;
        }
        return {
          ...state,
          relNumBers
        };
      },
    },
    getLabelGroup: {
      method: 'GET',
      url: `${hostUrl}/cases/:caseId/pnum_labels/label-group`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
          labelGroupList = body.data
        }
        return {
          ...state,
          labelGroupList
        };
      },
    }
  },
});
