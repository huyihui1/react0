import {createResource, defaultGlobals as reduxRestResourceGlobals, initialState} from 'redux-rest-resource';
import _ from 'lodash'
import appConfig from '../../appConfig';
import myFetch from '../../helpers/fetch';


const hostUrl = appConfig.rootUrl;
Object.assign(reduxRestResourceGlobals, {fetch: myFetch});
Object.assign(initialState, {pageSize: appConfig.pageSize, showLoading: false});

let currencyPairsList = [];
let meta = null;
let isSearch = false;
let pageFirst ;
let dataMeta = [];

export const {types, actions, rootReducer} = createResource({
  name: 'currencyPairs',
  url: `${hostUrl}/cases/:case_id/bbills/currency_pairs`,
  actions: {
    fetch: {
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          console.log(body)
          currencyPairsList = body.data;
           meta = body.meta;
           isSearch = false;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }
        return {
          ...state,
          currencyPairsList,
          meta,
          isSearch
        };
      },
    },
    search: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/bins/search`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          currencyPairsList = body.data;
          meta = body.meta;
          isSearch = true
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }
        return {
          ...state,
          currencyPairsList,
          meta,
          isSearch
        };
      },
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
    updateList: {
      method: 'PUT',
      url: `${hostUrl}/cases/:case_id/bbills/currency_pairs/:id`,
      reduce: (state, action) => {
     
        const {status, body, context} = action;
        console.log(body)
        if (body && body.meta.success) {
          // console.log(body)
          let idx = _.find(state.currencyPairsList, (x, index) => {
            //console.log(x,index)
            if (x.id === body.data.id) {
              state.currencyPairsList[index] = body.data;
              state.item = body.data
              //state.item ={}
            } 
            return x.id === body.data.id
          });
          console.log(idx)
        }
        return {
          ...state,
          
        };
      },
    },
    create: {
      method: 'POST',
      reduce: (state, action) => {
        //console.log(state)
        // const {status, body,context:{base_name, base_symbol, settle_name, settle_symbol, rate}} = action;
        // console.log(base_name, base_symbol, settle_name, settle_symbol, rate)
        // const temp = state.currencyPairsList.concat({base_name, base_symbol, settle_name, settle_symbol, rate})
        // state.currencyPairsList = temp
        return {
          ...state,
          pageFirst
        };
      },
    },
    remove:{
      method:'DELETE',
      //url:`${hostUrl}/cases/:case_id/bbills/currency_pairs/:id`,
      url: `${hostUrl}/cases/:case_id/bbills/currency_pairs/:id`,
      reduce:(state , action) => {
        const {status , body, context:{id} }= action;
        if( id&&status =='resolved'){
           state.currencyPairsList.forEach((item, index) =>{
               if(item.id === id){
               state.currencyPairsList.splice(index,1)
             }
           })      
        }
        pageFirst =1
        console.log(state.currencyPairsList)

        return {
          ...state,
          pageFirst
        }
      }
    },
    look: {
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          console.log(body)
          currencyPairsList = body.data;
           meta = body.meta;
           isSearch = false;
           pageFirst = 1;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }
        return {
          ...state,
          currencyPairsList,
          meta,
          isSearch,
          pageFirst
        };
      },
    },
    seek: {
      method:'GET',
      url: `${hostUrl}/cases/:case_id/bbills/currencies`,
      reduce:(state, action) =>{
        const {context, body, status} = action;
        if(body && body.data){
          //console.log(body.data);
          dataMeta = body.data;
        }
        return {
          ...state,
          dataMeta
        }
      }
    }
  }

});
