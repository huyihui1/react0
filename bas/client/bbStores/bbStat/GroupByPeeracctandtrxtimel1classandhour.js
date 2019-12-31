import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';
const hostUrl = ajax.baseUrl;


Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {isImport: false, pageSize: appConfig.pageSize, showLoading: false});

let groupByPeeracctandtrxtimel1classandhourList = null;

export const {types, actions, rootReducer} = createResource({
  name: 'xxx',
  url: `${hostUrl}/cases/:case_id/bbills/peer_acct/group-by-peeracctandtrxhourclass`,
  actions: {
    //A4
    getGroupBy: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbills/peer_acct/group-by-peeracctandtrxhourclass`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body) {
          groupByPeeracctandtrxtimel1classandhourList = formatPeeracctandtrxtimel1class(body.data);
          console.log(groupByPeeracctandtrxtimel1classandhourList)
        }
        if (status === 'resolved') {
          state.showLoading = false;
        } else {
          state.showLoading = true;
        }
        return {
          ...state,
          groupByPeeracctandtrxtimel1classandhourList
        };
      },
    },
    clear:{
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          groupByPeeracctandtrxtimel1classandhourList:null
        };
      },
    }
  },
});

function formatPeeracctandtrxtimel1class(data) {
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
