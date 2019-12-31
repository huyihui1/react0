import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';

const hostUrl = ajax.baseUrl;

let items = [];
let meta = {};
let activePages = [];

Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isLoading: true, pageSize: appConfig.pageSize});

export const {types, actions, rootReducer} = createResource({
  name: 'caseOverview',
  url: `${hostUrl}/cases/:case_id/summary`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const {context, body, status} = action;
        console.log(body);
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
        };
      },
    },
    getGeoDist: {
      url: `${hostUrl}/cases/:case_id/pbills/geo-dist`,
      method: 'GET',
      reduce: (state, action) => {
        const {status, body} = action;
        if (typeof body === 'object' && body.meta.success) {
          state.mapItems = body.data;
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
    getMenusAll: {
      method: 'GET',
      url: `${hostUrl}/user/menus`,

      reduce: (state, action) => {
        return {
          ...state
        }
      }
    },
    setMenus: {
      method: 'POST',
      url: `${hostUrl}/user/menus`,
      reduce: (state, action) => {
        return {
          ...state
        }
      }
    },
    findAbnormalNums:{
      method:'POST',
      url: `${hostUrl}/cases/:case_id/find-outlier-nums`,
      reduce: (state, action) => {
        return {
          ...state
        }
      }
    },
    getProgress:{
      method:'GET',
      url: `${hostUrl}/cases/:case_id/background_tasks/:job_id/progress`,
      reduce: (state, action) => {
        return {
          ...state
        }
      }
    },
    ///cases/5/pbills/only-outliers?page=1&pagesize=100
    getOutlierNums:{
      method:'GET',
      url: `${hostUrl}/cases/:case_id/pbills/only-outliers`,
      reduce: (state, action) => {
        const {status, body} = action;
        if (body){
          activePages = body.data
        }
        return {
          ...state,
          activePages
        }
      }
    },
    clearOutlierNums: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          activePages: [],
        };
      },
    }
  },
});
