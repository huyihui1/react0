import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import _ from 'lodash'
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';

const hostUrl = appConfig.rootUrl;
Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {pageSize: appConfig.pageSize, showLoading: false});

let binsList = [];
let meta = null;
let isSearch = false;

export const {types, actions, rootReducer} = createResource({
  name: 'bins',
  url: `${hostUrl}/cases/:case_id/bins`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          binsList = body.data;
          meta = body.meta;
          isSearch = false;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }
        return {
          ...state,
          binsList,
          meta,
          isSearch
        };
      },
    },
    search: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bins/search`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          binsList = body.data;
          meta = body.meta;
          isSearch = true
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }
        return {
          ...state,
          binsList,
          meta,
          isSearch
        };
      },
    },
    set: {
      isPure: true,
      reduce: (state, action) => {
        const {context} = action;

        return {
          ...state,
          item: context,
        };
      },
    },
    updateList: {
      method: 'PUT',
      url: `${hostUrl}/cases/:case_id/bins/:id`,
      reduce: (state, action) => {
        const {status, body, context} = action;
        if (body && body.meta.success) {
          let idx = _.find(state.binsList, (x, index) => {
            if (x.id === body.data.id) {
              state.binsList[index] = body.data;
              state.item = body.data
            }
            return x.id === body.data.id
          });
        }
        return {
          ...state,
        };
      },
    },
    create: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bins`,
      reduce: (state, action) => {
        const {status, body} = action;
        return {
          ...state,
        };
      },
    }
  },
});
