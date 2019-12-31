import { createResource, defaultGlobals as reduxRestResourceGlobals, initialState } from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';

const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, { fetch: myFetch });
Object.assign(initialState, { isImport: false, pageSize: appConfig.pageSize, showLoading: false });

let trxamtclassandtrxtimel1classList = null;

export const { types, actions, rootReducer } = createResource({
  name: 'trxamtclassandtrxtimel1class',
  url: `${hostUrl}/cases/:caseId/bbills`,
  actions: {
    getGroupBy: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/trx_hour/group-by-trxamtclassandtrxtimel1class`,
      reduce: (state, action) => {
        const { context, body, status } = action;
        if (action.body) {
          trxamtclassandtrxtimel1classList = formatTrxamtclassandtrxtimel1class(action.body.data);
        }
        if (status === 'resolved') {
          state.showLoading = false;
        } else {
          state.showLoading = true;
        }
        return {
          ...state,
          trxamtclassandtrxtimel1classList,
        };
      },
    },
    clear: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          trxamtclassandtrxtimel1classList: null,
        };
      },
    },
  },
});

function formatTrxamtclassandtrxtimel1class(data) {
  const map = {},
    arr = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array();
    for (const key in data[i]) {
      tempArr[0] = key;
      for (let j = 0; j < data[i][key].length; j++) {
        const a2 = data[i][key][j];
        ai = { ...ai, ...a2 };
      }
      const obj = {
        duration_class: key,
        ...ai
      };
      arr.push(obj);
    }
  }
  console.log(arr);
  return arr;
}
