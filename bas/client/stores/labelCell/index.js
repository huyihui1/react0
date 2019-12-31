import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';
import {searchCode} from "../PBAnalyze/actions";

const hostUrl = ajax.baseUrl;

let items = [];
let labelGroup = [];
let LargItems = null;
let meta = {};

Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isLoading: true, pageSize: appConfig.pageSize, LargItems});

export const {types, actions, rootReducer} = createResource({
  name: 'labelCell',
  url: `${hostUrl}/cases/:caseId/ct_labels/:id`,
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
    fetchLargItems: {
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
          LargItems
        };
      },
    },
    create: {
      transformResponse: res => {
        return {res, body: res.body.data};
      },
      reduce: (state, action) => {
        const {status, body} = action;
        // if (status === 'resolved') {
        //   state.items.unshift(body);
        // }
        return {
          ...state,
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
    },
    fetchLabelGroup: {
      method: 'GET',
      url: './label-group',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.meta && body.meta.success) {
          labelGroup = body.data;
        }
        return {
          ...state,
          labelGroup
        };
      },
    },
    searchCode: {
      method: 'POST',
      url: `${hostUrl}/cell-towers/loc/transform`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
        }
        return {
          ...state,
        };
      },
    },
    searchCtLabels: {
      method: 'POST',
      url: `${hostUrl}/cases/:caseId/ct_labels/search`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
          items = body.data
        }
        return {
          ...state,
          items
        };
      },
    }
  },
});
