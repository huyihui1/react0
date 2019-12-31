import { createResource, defaultGlobals as reduxRestResourceGlobals, initialState } from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';

const hostUrl = ajax.baseUrl;

let items = [];
let meta = {};

Object.assign(reduxRestResourceGlobals, { fetch: myFetch });
Object.assign(initialState, { isImport: false, pageSize: appConfig.pageSize, showLoading: false});

export const { types, actions, rootReducer } = createResource({
  name: 'citizen',
  url: `${hostUrl}/cases/:case_id/citizens/search`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const { context, body, status } = action;
        if (typeof body === 'object' && body.meta.success) {
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
      url: `${hostUrl}/cases/:caseId/pbills/do-import/:import_id`,
      reduce: (state, action) => {
        state.uploadField.reset();
        return {
          ...state,
          isImport: true,
          import_id: null,
        };
      },
    },
    createManinput: {
      method: 'POST',
      url: `${hostUrl}/citizens/maninput`,
      reduce: (state, action) => {
        return {
          ...state,
        };
      },
    },
    search: {
      method: 'POST',
      reduce: (state, action) => {
        const { body } = action;
        state.showLoading = true;
        if (typeof body === 'object' && body.meta.success) {
          state.items = body.data;
          state.showLoading = false;
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
