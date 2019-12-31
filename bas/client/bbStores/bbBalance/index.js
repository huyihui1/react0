import { createResource, defaultGlobals as reduxRestResourceGlobals, initialState } from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';
import { formatFormData } from '../../utils/bbillsUtils';


const hostUrl = appConfig.rootUrl;





Object.assign(reduxRestResourceGlobals, { fetch: myFetch });
Object.assign(initialState);

export const { types, actions, rootReducer } = createResource({
  name: 'bbBalance',
  url: `${hostUrl}/cases/:case_id/pbills`,
  actions: {
    setParams: {
      isPure: true,
      reduce: (state, action) => {
        let { context } = action;
        let params = Object.assign({}, context);
        if (params) {
          let adhoc = {};
          if (params['group-by']) {
            adhoc = {
              'group-by': params['group-by'],
            }
            delete params['group-by'];
          }
          params = formatFormData(params, {view: {}, adhoc});
        }
        return {
          ...state,
          params,
          isSearch: true,
        };
      },
    },
    clearParams: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          params: null,
          isSearch: false,
        };
      },
    },
  },
});


