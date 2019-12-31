import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';

const hostUrl = ajax.baseUrl;

// let items = [];
let meta = [];

Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isLoading: true, pageSize: appConfig.pageSize, meta: '', items: {}});

export const {types, actions, rootReducer} = createResource({
  name: 'superLicenses',
  url: `${hostUrl}/admin/licenses`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
          // caseId: context.caseId,
        };
      },
    },
    remove: {
      method: 'DELETE',
      url: `${hostUrl}/admin/licenses/:id`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
          // caseId: context.caseId,
        };
      },
    },
    create: {
      method: 'POST',
      url: `${hostUrl}/admin/licenses`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    },
    upgrade: {
      method: 'POST',
      url: `${hostUrl}/admin/licenses/:license_id/upgrade`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        return {
          ...state,
        };
      },
    },
    setEstablishStatus:{
      isPure:true,
      reduce: (state, action) => {
        const { context } = action;
        return {
          ...state,
          item: context,
        };
      },
    },
    setLicensesFormData:{
      isPure:true,
      reduce: (state, action) => {
        const { context } = action;
        return {
          ...state,
          items: context,
        };
      },
    }
  },
});
