import { createResource, defaultGlobals as reduxRestResourceGlobals, initialState } from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';

const hostUrl = ajax.baseUrl;



Object.assign(reduxRestResourceGlobals, { fetch: myFetch });
Object.assign(initialState, { isLoading: false, pageSize: appConfig.pageSize });

export const { types, actions, rootReducer } = createResource({
  name: 'calcOnSets',
  url: `${hostUrl}/cases/:case_id/pbills/records/calc-on-sets`,
  actions: {
    fetch: {
      method: 'POST',
      reduce: (state, action) => {
        let items = [];
        let meta = {};
        const { context, body, status } = action;
        if (body) {
          items = body.data;
          meta = body.meta;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          items,
          meta,
        };
      },
    },
    clear: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          items: []
        };
      },
    }
  },
});
