import { createResource, defaultGlobals as reduxRestResourceGlobals, initialState } from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';

const hostUrl = ajax.baseUrl;

let items = [];
let meta = {};

Object.assign(reduxRestResourceGlobals, { fetch: myFetch });
Object.assign(initialState, { isImport: false, pageSize: appConfig.pageSize, isLoading: false});

export const { types, actions, rootReducer } = createResource({
  name: 'bbFileImp',
  url: `${hostUrl}/cases/:caseId/bbills/preview/:import_id`,
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
      method: 'POST',
      url: `${hostUrl}/cases/:caseId/bbills/do-import/:import_id`,
      reduce: (state, action) => {
        state.uploadField.reset();
        return {
          ...state,
          isImport: true,
          import_id: null,
        };
      },
    },
    getPreviewFiles: {
      method: 'GET',
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
        state.isLoading = false;
        return {
          ...state,
          items: [...state.items, [...context.data.data]],
          meta: context.data.meta,
          uploadField: context.uploadField,
        };
      },
    },
    setImportId: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;
        return {
          ...state,
          import_id: context,
        };
      },
    },
    setLoading: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;
        return {
          ...state,
          isLoading: context,
        };
      },
    },
    remove: {
      method: 'POST',
      url: `${hostUrl}/cases/:caseId/bbills/abort-import/:import_id`,
      reduce: (state, action) => {
        state.uploadField.reset();
        return {
          ...state,
          items: [],
          meta: {},
          isImport: false,
          import_id: null,
        };
      },
    },
    clear: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;
        return {
          ...state,
          items: [],
          meta: {}
        };
      },
    }
  },
});
