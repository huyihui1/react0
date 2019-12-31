import { createResource, defaultGlobals as reduxRestResourceGlobals, initialState } from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';
import { formatFormData } from '../../utils/bbillsUtils';

const hostUrl = appConfig.rootUrl;


Object.assign(initialState, {drilldownList: []});
Object.assign(reduxRestResourceGlobals, { fetch: myFetch });

export const { types, actions, rootReducer } = createResource({
  name: 'analyzes',
  url: `${hostUrl}/cases/:case_id/bbills/records/search`,
  actions: {
    search: {
      method: 'POST',
      reduce: (state, action) => {
        const { context, body, status } = action;
        if (typeof body === 'object' && body.meta.success) {
          return {
            ...state,
            items: body.data,
          };
        }
        return {
          ...state,
        };
      },
    },
    fetchDrillDown: {
      method: 'POST',
      reduce: (state, action) => {
        const { context, body, status } = action;
        if (typeof body === 'object' && body.meta.success) {
          return {
            ...state,
            drilldownList: body.data,
          };
        }
        return {
          ...state,
        };
      },
    },
    getPaging: {
      method: 'POST',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.meta.success) {
          let items = [...state.items, ...body.data]
          let meta = body.meta;
          return {
            ...state,
            items,
            meta,
          };
        } else {
          return {
            ...state
          }
        }
      },
    },
    getDrillDownPaging: {
      method: 'POST',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.meta.success) {
          let drilldownList = [...state.drilldownList, ...body.data]
          let meta = body.meta;
          return {
            ...state,
            drilldownList,
            meta,
          };
        } else {
          return {
            ...state
          }
        }
      },
    },
    fetchMySearch: {
      method: 'GET',
      url: `${hostUrl}/cases/:case_id/searches`,
      reduce: (state, action) => {
        const { context, body, status } = action;
        if (typeof body === 'object' && body.meta.success) {
          return {
            ...state,
            mySearchs: body.data,
          };
        }
        return {
          ...state,
        };
      },
    },
    createMy: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/searches`,
      reduce: (state, action) => {
        const { context, body, status } = action;
        const newMySearchs = [...state.mySearchs];
        if (body && body.meta.success) {
          const value = JSON.parse(body.data.value);
          for (const key in value) {
            if (Array.isArray(value[key]) && value[key].length > 1) {
              value[key].shift();
            }
          }
          body.data.value = value;
          newMySearchs.unshift(body.data);
        }
        return {
          ...state,
          mySearchs: newMySearchs,
        };
      },
    },
    removeMy: {
      method: 'DELETE',
      url: `${hostUrl}/cases/:case_id/searches/:id`,
    },
    clear: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          items: [],
        };
      },
    },
    clearDrilldown: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          drilldownList: [],
        };
      },
    },
  },
});
