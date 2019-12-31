import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import _ from 'lodash'
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';

const hostUrl = appConfig.rootUrl;
Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {zIndex: 501});

let binsList = [];
let meta = null;
let isSearch = false;

export const {types, actions, rootReducer} = createResource({
  name: 'globalLabel',
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
    addZindex: {
      isPure: true,
      reduce: (state, action) => {
        const {context} = action;

        return {
          ...state,
          zIndex: context,
        };
      },
    },
  },
});
