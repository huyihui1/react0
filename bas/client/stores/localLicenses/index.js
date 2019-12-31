import { createResource, defaultGlobals as reduxRestResourceGlobals, initialState } from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';

const hostUrl = ajax.baseUrl;

let items = [];
let meta = {};

Object.assign(reduxRestResourceGlobals, { fetch: myFetch });
Object.assign(initialState, { isLoading: true, pageSize: appConfig.pageSize });

export const { types, actions, rootReducer } = createResource({
  name: 'license',
  url: `${hostUrl}/licenses/:id`,
  actions: {
    fetch: {
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
          caseId: context.caseId,
        };
      },
    },
    create: {
      transformResponse: res => {
        return { res, body: res.body.data };
      },
      reduce: (state, action) => {
        const { status, body } = action;
        if (status === 'resolved') {
          state.items.unshift(body);
        }
        return {
          ...state,
        };
      },
    },
    get: {
      method: 'POST',
      url: `${hostUrl}/admin/accounts/search`,
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
    delete: {
      reduce: (state, action) => {
        const { status, context: { id } } = action;
        if (id && status === 'resolved') {
          state.items.forEach(((item, index) => {
            if (item.id === id) {
              state.items.splice(index, 1);
            }
          }));
        }
        return {
          ...state,
        };
      },
    },
    update: {
      method: 'PUT',
    },
    set: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;

        return {
          ...state,
          item: context,
        };
      },
    },
    getState:{
      method: 'GET',
      url: `${hostUrl}/utils/provinces`,
      reduce: (state, action) => {
        const { context, body, status } = action;
        return {
          ...state,
        };
      },
    },
    getCity:{
      method: 'GET',
      url: `${hostUrl}/utils/provinces/:provinceCode/cities`,
      reduce: (state, action) => {
        const { context, body, status } = action;
        return {
          ...state,
        };
      },
    }
  },
});
