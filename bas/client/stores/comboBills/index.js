import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';

const hostUrl = ajax.baseUrl;

Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isLoading: false});

export const {types, actions, rootReducer} = createResource({
  name: 'comboBills',
  url: `${hostUrl}/cases/:case_id/combo/search`,
  actions: {
    get: {
      method: 'POST',
      reduce: (state, action) => {
        const {context, body, status} = action;
        console.log(body);
        let items = [];
        let meta = null;
        let last_combo_day = ''
        if (body && body.meta.success) {
          items = body.data;
          meta = body.meta;
          last_combo_day = items.slice(-1)[0].started_day;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }
        console.log(items.slice(-1));
        return {
          ...state,
          items,
          meta,
          last_combo_day
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
          let last_combo_day = items.slice(-1)[0].started_day;
          return {
            ...state,
            items,
            meta,
            last_combo_day
          };
        } else {
          return {
            ...state
          }
        }
      },
    },
    setSearch: {
      isPure: true,
      reduce: (state, action) => {
        const {context} = action;

        return {
          ...state,
          params: context,
        };
      },
    },
    clearSearch: {
      isPure: true,
      reduce: (state, action) => {
        const {context} = action;
        return {
          ...state,
          items: [],
          params: null,
        };
      },
    },
  },
});
