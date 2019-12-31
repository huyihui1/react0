import { createResource, defaultGlobals as reduxRestResourceGlobals, initialState } from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';
import { formatFormData } from '../../utils/utils';

const hostUrl = appConfig.rootUrl;

let items = [];
let meta = null;
let showLoading = false

Object.assign(reduxRestResourceGlobals, { fetch: myFetch });
Object.assign(initialState, { isSearch: false, showLoading });

export const { types, actions, rootReducer } = createResource({
  name: 'matrix',
  url: `${hostUrl}/cases/:case_id/pbills/analyze/matrix`,
  actions: {
    fetch: {
      method: 'POST',
      reduce: (state, action) => {
        const { context, body, status } = action;
        if (status === 'resolved') {
          if (body.meta && body.meta.success) {
            items = body.data;
            meta = body.meta;
          }
          state.showLoading = false;
        } else {
          state.showLoading = true;
        }

        return {
          ...state,
          items,
          meta,
          showLoading
        };
      },
    },
  },
});
