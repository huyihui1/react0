import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';
const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});

let tellerandhourList = null;

export const {types, actions, rootReducer} = createResource({
  name: 'tellerandhour',
  url: `${hostUrl}/cases/:case_id/bbills/branch/group-by-tellerandhour`,
  actions: {
    //B3-机构号vs交易时段
    getGroupBy: {
      method: 'POST',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (action.body) {
          tellerandhourList = formatGroupByBranchNumAndHour(action.body.data);
        }
        if (status === 'resolved') {
          state.showLoading = false;
        } else {
          state.showLoading = true;
        }
        return {
          ...state,
          tellerandhourList
        };
      },
    },
    clear:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          tellerandhourList:null
        };
      },
    }
  },
});

function formatGroupByBranchNumAndHour(data) {
  const arr = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    arr.push(ai)
  }
  return arr;
}

