import { createResource, defaultGlobals as reduxRestResourceGlobals, initialState } from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';

const hostUrl = ajax.baseUrl;

let items = [];
let meta = {};
let owner_num = [];

Object.assign(reduxRestResourceGlobals, { fetch: myFetch });
Object.assign(initialState, { isLoading: true, pageSize: appConfig.pageSize });

export const { types, actions, rootReducer } = createResource({
  name: 'cellTower',
  url: `${hostUrl}/cases/:case_id/pbills/records/daily-cnt`,
  actions: {
    fetch: {
      method: 'POST',
      reduce: (state, action) => {
        const { context, body, status } = action;
        if (context.criteria.owner_num) {
          owner_num = context.criteria.owner_num[1];
        }
        if (body) {
          items = body.data;
          meta = body.meta;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }
        console.log(state);
        return {
          ...state,
          items,
          meta,
          owner_num,
        };
      },
    },
    getDrilldown: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/pbills/cell-towers/daily`,
      reduce: (state, action) => {
        let drilldowns = [];
        console.log(action.body);
        if (action.body) {
          drilldowns = action.body.data;
        }
        return {
          ...state,
          drilldowns,
        };
      },
    },
  },
});
