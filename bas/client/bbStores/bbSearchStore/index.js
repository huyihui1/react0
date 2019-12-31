import { createResource, defaultGlobals as reduxRestResourceGlobals, initialState } from 'redux-rest-resource';
import ajax from '../../utils/ajax';
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';
import { formatFormData } from '../../utils/bbillsUtils';


const hostUrl = appConfig.rootUrl;

const view = {};
let ownerBankAccts = [];
let ownerCardNums = [];
const mySearchs = [];
const chartView = [];



Object.assign(reduxRestResourceGlobals, { fetch: myFetch });
Object.assign(initialState, { view, ownerBankAccts, ownerCardNums, mySearchs, chartView, isSearch: false, loc_rule: '' });

export const { types, actions, rootReducer } = createResource({
  name: 'bbSearch',
  url: `${hostUrl}/cases/:case_id/pbills`,
  actions: {
    fetchOwnerBankAcctsAndCardNums: {
      method: 'GET',
      url: `${hostUrl}/cases/:case_id/bbills/owner_bank_accts_and_nums`,
      reduce: (state, action) => {
        const { context, body, status } = action;
        if (typeof body === 'object' && body.meta.success) {
          return {
            ...state,
            ownerBankAccts: body.data.owner_bank_accts,
            ownerCardNums: body.data.owner_card_nums,
          };
        }
        return {
          ...state,
        };
      },
    },
    fetchMySearch: {
      method: 'GET',
      url: `${hostUrl}/cases/:case_id/bbill/searches`,
      reduce: (state, action) => {
        const { context, body, status } = action;
        if (typeof body === 'object' && body.meta.success) {
          return {
            ...state,
            mySearchs: body.data,
          };
        }
        return {
          ...state,
        };
      },
    },
    createMy: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bbill/searches`,
      reduce: (state, action) => {
        const { context, body, status } = action;
        // const newMySearchs = [...state.mySearchs];
        // if (body && body.meta.success) {
        //   const value = JSON.parse(body.data.value);
        //   for (const key in value) {
        //     if (Array.isArray(value[key]) && value[key].length > 1) {
        //       value[key].shift();
        //     }
        //   }
        //   body.data.value = value;
        //   newMySearchs.unshift(body.data);
        // }
        return {
          ...state,
          // mySearchs: newMySearchs,
        };
      },
    },
    removeMy: {
      method: 'DELETE',
      url: `${hostUrl}/cases/:case_id/bbill/searches/:id`,
    },
    setParams: {
      isPure: true,
      reduce: (state, action) => {
        let { context } = action;
        console.log(context);
        if (context) {
          context = formatFormData(context);
        }
        return {
          ...state,
          params: context,
          isSearch: true,
        };
      },
    },
    setNoFormatCriteria: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;
        context.criteria = formatFormData(context.criteria, true);
        console.log(context);
        return {
          ...state,
          criteria: context,
          isSearch: true,
        };
      },
    },
    setChartView: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;
        return {
          ...state,
          chartView: context,
          isSearch: false,
        };
      },
    },
    setIsSearchStatus: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;
        return {
          ...state,
          isSearch: context,
        };
      },
    },
    setLocRule: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;
        return {
          ...state,
          loc_rule: context,
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
    //  名义日期数据获取
    fetchAlyzDays: {
      method: 'GET',
      url: `${hostUrl}/cases/:case_id/pbills/alyz-days`,
      reduce: (state, action) => {
        const { context, body, status } = action;
        let alyzDays = null;
        if (typeof body === 'object' && body.meta.success) {
          alyzDays = body.data;
        }
        return {
          ...state,
          alyzDays,
        };
      },
    },
  //  本方账户数据
    setOwnerAccountNumbers: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;
        return {
          ...state,
          ownerAccountVal: context,
        };
      },
    },
    //  对方账户数据
    setPeerAccountNumbers: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;
        return {
          ...state,
          peerAccountVal: context,
        };
      },
    },
    clearOwnerAccountNumbers: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;
        return {
          ...state,
          ownerAccountVal: null,
        };
      },
    },
    clearPeerAccountNumbers: {
      isPure: true,
      reduce: (state, action) => {
        const { context } = action;
        return {
          ...state,
          peerAccountVal: context,
        };
      },
    },
  },
});


