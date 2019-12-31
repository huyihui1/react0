import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import moment from 'moment'
import _ from 'lodash';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';


const hostUrl = ajax.baseUrl;

let items = [];
let meta = {};

Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, isLoading: false, items});

export const {types, actions, rootReducer} = createResource({
  name: 'bbills',
  url: `${hostUrl}/cases/:caseId/bbills`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          body.data.forEach(item => {
            if (item.started_at) {
              item.started_at = moment(item.started_at).format('YYYY-MM-DD');
            }
            if (item.ended_at) {
              item.ended_at = moment(item.ended_at).format('YYYY-MM-DD');
            }
            if (item.created_at) {
              item.created_at = moment(item.created_at).format('YYYY-MM-DD');
            }
            if (item.updated_at) {
              item.updated_at = moment(item.updated_at).format('YYYY-MM-DD');
            }
          });

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
    getAcctsAndCards: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/accts-and-cards`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
        }
        return {
          ...state,
        };
      },
    },
    search: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/search`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.meta.success) {
          items = body.data;
          meta = body.meta;
        }
        return {
          ...state,
          items,
          meta,
        };
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
    updateList: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/:id/set-owner`,
      reduce: (state, action) => {
        const {status, body, context} = action;
        if (body && body.meta && body.meta.success) {
          const {fromBbill, toBbill} = body.data
          _.find(state.items, (x, index) => {
            if (x.id === fromBbill.id) {
              state.items[index] = fromBbill;
            }
            return x.id === fromBbill.id
          });
          if (fromBbill.id !== toBbill.id) {
            let idx = _.find(state.items, (x, index) => {
              if (x.id === toBbill.id) {
                state.items[index] = toBbill;
              }
              return x.id === toBbill.id
            });
            if (!idx) {
              state.items.push(toBbill);
            }
          }
        }
        return {
          ...state,
        };
      },
    },
    // clear: {
    //   isPure: true,
    //   reduce: (state, action) => {
    //     const { context } = action;
    //     return {
    //       ...state,
    //       items: [],
    //       meta: {}
    //     };
    //   },
    // }
  },
});
