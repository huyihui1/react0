import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';

const hostUrl = ajax.baseUrl;

Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {pageSize: appConfig.pageSize, showLoading: false});

let PubServiceNumsList = [];
let meta = {};


export const {types, actions, rootReducer} = createResource({
  name: 'PubServiceNums',
  url: `${hostUrl}/pb/pub_service_nums`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const {context, body, status} = action;
        state.showLoading = true;

        if (body) {
          PubServiceNumsList = body.data;
          meta = body.meta;
        }
        if (status === 'resolved') {
          state.showLoading = false;
        }
        return {
          ...state,
          PubServiceNumsList,
          meta
        };
      },
    },
    create: {},
    // remove: {
    //   method: 'POST',
    //   url: `${hostUrl}/cases/:caseId/pbills`,
    //   reduce: (state, action) => {
    //     const {context, body, status} = action;
    //     return {
    //       ...state,
    //     };
    //   },
    // },

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

    add:{
      method: 'POST',
      url: `${hostUrl}/pb/pub_service_nums`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    },
    edit:{
      method: 'PUT',
      url: `${hostUrl}/pb/pub_service_nums/:id`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    },
    remove:{
      method: 'DELETE',
      url: `${hostUrl}/pb/pub_service_nums/:id`,
      reduce: (state, action) => {
        const {context: { id }, body, status} = action;
        if (id && status === 'resolved') {
          state.PubServiceNumsList.forEach(((item, index) => {
            if (item.id === id) {
              state.PubServiceNumsList.splice(index, 1);
            }
          }));
        }
        return {
          ...state,
        };
      },
    }
  },
});
