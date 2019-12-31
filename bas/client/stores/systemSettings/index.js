import { createResource, defaultGlobals as reduxRestResourceGlobals, initialState } from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';

const hostUrl = ajax.baseUrl;

let items = [];
let meta = {};

Object.assign(reduxRestResourceGlobals, { fetch: myFetch });
Object.assign(initialState, { isLoading: true, pageSize: appConfig.pageSize, globalItem: {}, accountItem: {} });

export const { types, actions, rootReducer } = createResource({
  name: 'systemSetting',
  url: `${hostUrl}/admin/settings/:type/:id`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const { context, body, status } = action;
        if (body) {
          if (context.type === 'global') {
            state.globalItems = body.data;
            state.globalMeta = body.meta;
          } else {
            state.accountItems = body.data;
            state.accountMeta = body.meta;
          }
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
          if (body.account_id === '0') {
            state.globalItems.unshift(body);
          } else {
            state.accountItems.unshift(body);
          }
        }
        return {
          ...state,
        };
      },
    },
    delete: {
      reduce: (state, action) => {
        const { status, context: { id, account_id } } = action;
        if (id && status === 'resolved') {
          if (account_id === '0') {
            state.globalItems.forEach(((item, index) => {
              if (item.id === id) {
                state.globalItems.splice(index, 1);
              }
            }));
          } else {
            state.accountItems.forEach(((item, index) => {
              if (item.id === id) {
                state.accountItems.splice(index, 1);
              }
            }));
          }
        }
        return {
          ...state,
        };
      },
    },
    update: {
      method: 'PUT',
      reduce: (state, action) => {
        const { status, context } = action;
        if (status === 'resolved') {
          if (context.account_id === '0') {
            state.globalItems[`${context.index}`] = context;
            return {
              ...state,
              globalItem: context,
            };
          } else {
            state.accountItems[`${context.index}`] = context;
            return {
              ...state,
              accountItem: context,
            };
          }
        }
        return {
          ...state,
        };
      },
    },
    set: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;
        console.log(context);
        if (context.account_id === '0') {
          return {
            ...state,
            globalItem: context,
          };
        } else {
          return {
            ...state,
            accountItem: context,
          };
        }
      },
    },
  },
});
