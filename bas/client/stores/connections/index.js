import { createResource, defaultGlobals as reduxRestResourceGlobals, initialState } from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';

const hostUrl = ajax.baseUrl;

let items = [];
let meta = {};
let clearMyChart = {};

Object.assign(reduxRestResourceGlobals, { fetch: myFetch });
Object.assign(initialState, { isLoading: true, pageSize: appConfig.pageSize });

export const { types, actions, rootReducer } = createResource({
  name: 'connection',
  url: `${hostUrl}/cases/:case_id/pbills/analyze/connections`,
  actions: {
    fetch: {
      method: 'POST',
      reduce: (state, action) => {
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
    setSearch: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action
        return {
          ...state,
          searchs: context,
        };
      },
    },
    setMyChart: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;
        return {
          ...state,
          clearMyChart: context,
        };
      },
    }
  },
});
