import {createResource, defaultGlobals, initialState} from 'redux-rest-resource';
import moment from 'moment';

import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';

const hostUrl = appConfig.rootUrl;

let ownernumItems = null;
let ownernumList = null;

Object.assign(defaultGlobals, {fetch: myFetch});

export const {types, actions, rootReducer} = createResource({
  name: 'ownernum',
  url: `${hostUrl}/cases/:case_id/pbills/overview`,
  actions: {
    // 本方号码
    fetch: {
      method: 'POST',
      url: './group-by-ownernum',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          ownernumItems = body.data;
          ownernumList = formatOwnernum(ownernumItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          ownernumItems,
          ownernumList,
        };
      },
    },
  }
});

function formatOwnernum(data) {
  const map = {},
    arr2 = [];
  for (let i = 0; i < data.length; i++) {
    const tempArr = new Array();
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    arr2.push(ai);
  }
  return arr2;
}
