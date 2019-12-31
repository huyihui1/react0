import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';
import {getPnumLabels} from "../venNumbers/actions";

const hostUrl = ajax.baseUrl;

let items = [];
let meta = {};
let pnumLabels = [];

Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isLoading: true, pageSize: appConfig.pageSize});

export const {types, actions, rootReducer} = createResource({
  name: 'relNumber',
  url: `${hostUrl}/cases/:caseId/rel_numbers/:id`,
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
    get: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/rel_numbers/search`,
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
    create: {
      transformResponse: res => {
        return {res, body: res.body.data};
      },
      reduce: (state, action) => {
        const {status, body} = action;
        if (status === 'resolved') {
          state.items.unshift(body);
        }
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
    changeShortNum: {
      method: 'GET',
      url: `${hostUrl}/cases/:caseId/pbills/records/conv-rel-nums`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    },
    getPnumLabels: {
      method: 'GET',
      url: `${hostUrl}/cases/:caseId/pnum_labels`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
          pnumLabels = body.data
        }
        return {
          ...state,
          pnumLabels
        };
      },
    }
  },
});
