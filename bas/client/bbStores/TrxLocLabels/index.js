import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';

const hostUrl = ajax.baseUrl;

let items = [];
let LargItems = [];
let meta = {};

Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isLoading: true, pageSize: appConfig.pageSize});

export const {types, actions, rootReducer} = createResource({
  name: 'trxLocLable',
  url: `${hostUrl}/cases/:caseId/trx_loc_labels/:id`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const {context, body, status} = action;
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
    fetchLarge: {
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
          LargItems = body.data;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }
        return {
          ...state,
          LargItems,
          caseId: context.caseId,
        };
      },
    },
    create: {
      transformResponse: res => {
        return {res, body: res.body.data};
      },
      reduce: (state, action) => {
        const {status, body, res} = action;
        if (status === 'resolved' && res.body.meta.success) {
          state.items.unshift(body);
        }
        return {
          ...state,
        };
      },
    },
    get: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/pnum_labels/search`,
      reduce: (state, action) => {
        const {context, body, status} = action;
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
        const {status, context: {id}} = action;
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
      reduce: (state, action) => {
        const {context, body} = action;
        if (typeof body === 'object') {
          if (body.meta && body.meta.success) {
            return {
              ...state,
              item: body.meta.data,
            };
          }
        } else {
          return {
            ...state,
          };
        }
      },
    },
    set: {
      isPure: true,
      reduce: (state, action) => {
        const {context} = action;
        if (context.ptags) {
          context.ptags = JSON.parse(context.ptags);
        } else {
          context.ptags = [];
        }
        return {
          ...state,
          item: context,
        };
      },
    },
    setItems: {
      isPure: true,
      reduce: (state, action) => {
        const {context} = action;
        return {
          ...state,
          items: context,
        };
      },
    }
  },
});
