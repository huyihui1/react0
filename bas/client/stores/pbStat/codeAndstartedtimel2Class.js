import {createResource, defaultGlobals, initialState} from 'redux-rest-resource';
import moment from 'moment';

import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';

const hostUrl = appConfig.rootUrl;

let codeandstartedtimel2classItems = null;
let codeandstartedtimel2classList = null;
let codeandstartedtimel2classHotMap = null;

Object.assign(defaultGlobals, {fetch: myFetch});

export const {types, actions, rootReducer} = createResource({
  name: 'codeandstartedtimel2class',
  url: `${hostUrl}/cases/:case_id/pbills/overview`,
  actions: {
    //  基站vs通话时段(详细)
    fetch: {
      method: 'POST',
      url: './group-by-codeandstartedtimel2class',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          codeandstartedtimel2classItems = body.data;
          let res = formatCodeandstartedtimel2class(codeandstartedtimel2classItems);
          codeandstartedtimel2classList = res.data;
          codeandstartedtimel2classHotMap = res.points;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          codeandstartedtimel2classItems,
          codeandstartedtimel2classList,
          codeandstartedtimel2classHotMap
        };
      },
    },
    clear: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          codeandstartedtimel2classItems: null,
          codeandstartedtimel2classList: null,
          codeandstartedtimel2classHotMap: null
        };
      },
    },
  }
});



export function formatCodeandstartedtimel2class(data) {
  const arr = [],
    points = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array();
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    arr.push(ai);
    if (ai.coord && ai.coord[0] && ai.coord[1]) {
      let obj = {
        lng: ai.coord[0],
        lat: ai.coord[1],
        count: ai.total,
        ct_code: ai.owner_ct_code
      };
      points.push(obj)
    }
  }
  return {
    data: arr,
    points
  };
}

