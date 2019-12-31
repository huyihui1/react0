import {createResource, defaultGlobals, initialState} from 'redux-rest-resource';
import moment from 'moment';

import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';

const hostUrl = appConfig.rootUrl;

let chargingList = null;
let chargingItems = null;

let commdirectionList = null;
let commdirectionItems = null;

let peercommlocItems = null;
let peercommlocList = null;

let ownernumstatusList = null;
let ownernumstatusItems = null;

let ownercommlocList = null;
let ownercommlocItems = null;

let durationclassList = null;
let durationclassItems = null;

let startedtimel1classList = null;
let startedtimel1classItems = null;

let startedtimel2classList = null;
let startedtimel2classItems = null;

let startedhourclassItems = null;
let startedhourclassList = null;

let starteddayAndstartedtimel1classItems = null;
let starteddayAndstartedtimel1classList = null;

let starteddayAndstartedtimel2classItems = null;
let starteddayAndstartedtimel2classList = null;

let starteddayandandpeernumItems = null;
let starteddayandandpeernumList = null;

let starteddayAndctcodeItems = null;
let starteddayAndctcodeList = null;

let durationclassAndstartedtimel1classItems = null;
let durationclassAndstartedtimel1classList = null;

let durationclassAndstartedtimel2classItems = null;
let durationclassAndstartedtimel2classList = null;

let ownernumandstartedhorclassItems = null;
let ownernumandstartedhorclassList = null;

let weekdayItems = null;
let weekdayList = null;

let starteddayItems = null;
let starteddayList = null;
let starteddayAllItems = null;


let ownernumanddurationclassItems = null;
let ownernumanddurationclassList = null;

let ownernumandctandstartedhourclassItems = null;
let ownernumandctandstartedhourclassList = null;
let ownernumandctandstartedhourclassHotMap = null;

let ownernumandstartedtimel1classItems = null;
let ownernumandstartedtimel1classList = null;

let ownernumandstartedtimel2classItems = null;
let ownernumandstartedtimel2classList = null;

let ownernumandstartedhourclassItems = null;
let ownernumandstartedhourclassList = null;

let peernumItems = null;
let peernumList = null;

let peernumanddurationclassItems = null;
let peernumanddurationclassList = null;

let peernumexclusionconditionItems = null;
let peernumexclusionconditionList = null;

let peernumandstartedtimel1classItems = null;
let peernumandstartedtimel1classList = null;

let peernumandstartedtimel2classItems = null;
let peernumandstartedtimel2classList = null;

let peernumandstartedhourclassItems = null;
let peernumandstartedhourclassList = null;

let ownerctcodeItems = null;
let ownerctcodeList = null;
let ownerctcodeHotMap = null;

let codeandstartedtimel1classItems = null;
let codeandstartedtimel1classList = null;
let codeandstartedtimel1classHotMap = null;

let codeandstartedtimel2classItems = null;
let codeandstartedtimel2classList = null;
let codeandstartedtimel2classHotMap = null;

let codeandstartedhourclassItems = null;
let codeandstartedhourclassList = null;
let codeandstartedhourclassHotMap = null;

let codeandstartedhour25classItems = null;
let codeandstartedhour25classList = null;

let ownerlacItems = null;
let ownerlacList = null;

let codeandstarteddurationclassItems = null;
let codeandstarteddurationclassList = null;

let relatedItems = null;
let relatedList = null;

Object.assign(defaultGlobals, {fetch: myFetch});

export const {types, actions, rootReducer} = createResource({
  name: 'chart',
  url: `${hostUrl}/cases/:case_id/pbills/overview`,
  actions: {
    //  计费类型
    fetchGroupByBillType: {
      method: 'POST',
      url: './group-by-billtype',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          chargingItems = body.data;
          let arr = [];
          for (let key in  chargingItems[0]) {
            let obj = {
              bill_type: key,
              count: chargingItems[0][key]
            };
            arr.push(obj)
          }
          chargingList = arr
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          chargingList,
          chargingItems,
        };
      },
    },
    //  联系类型
    fetchCommdirection: {
      method: 'POST',
      url: './group-by-commdirection',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          commdirectionItems = body.data;
          let arr = [];
          for (let key in  commdirectionItems[0]) {
            let obj = {
              comm_direction: key,
              count: commdirectionItems[0][key]
            };
            arr.push(obj)
          }
          commdirectionList = arr
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          commdirectionList,
          commdirectionItems,
        };
      },
    },
    //  通话状态
    fetchOwnernumstatus: {
      method: 'POST',
      url: './group-by-ownernumstatus',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          ownernumstatusItems = body.data;
          let arr = [];
          for (let key in  ownernumstatusItems[0]) {
            let obj = {
              owner_num_status: key,
              count: ownernumstatusItems[0][key]
            };
            arr.push(obj)
          }
          ownernumstatusList = arr;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          ownernumstatusList,
          ownernumstatusItems,
        };
      },
    },
    //  本方通话地
    fetchOwnercommloc: {
      method: 'POST',
      url: './group-by-ownercommloc',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          ownercommlocItems = body.data;
          ownercommlocList = formatOclListData(ownercommlocItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          ownercommlocList,
          ownercommlocItems,
        };
      },
    },
    //  对方通话地
    fetchPeercommloc: {
      method: 'POST',
      url: './group-by-peercommloc',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          peercommlocItems = body.data;
          peercommlocList = formatPclListData(peercommlocItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          peercommlocItems,
          peercommlocList,
        };
      },
    },
    //  时长段
    fetchDurationclass: {
      method: 'POST',
      url: './group-by-durationclass',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          durationclassItems = body.data;
          let arr = [];
          for (let key in durationclassItems[0]) {
            let obj = {
              duration_class: key,
              count: durationclassItems[0][key]
            };
            arr.push(obj)
          }
          durationclassList = arr;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          durationclassItems,
          durationclassList,
        };
      },
    },
    //  通话时段
    fetchStartedtimel1class: {
      method: 'POST',
      url: './group-by-startedtimel1class',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          startedtimel1classItems = body.data;
          let arr = [];
          for (let key in startedtimel1classItems[0]) {
            let obj = {
              started_time_l1_class: key,
              count: startedtimel1classItems[0][key]
            };
            arr.push(obj)
          }
          startedtimel1classList = arr;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          startedtimel1classItems,
          startedtimel1classList,
        };
      },
    },
    //  通话时段(详细)
    fetchStartedtimel2class: {
      method: 'POST',
      url: './group-by-startedtimel2class',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          startedtimel2classItems = body.data;
          let arr = [];
          for (let key in startedtimel2classItems[0]) {
            let obj = {
              started_time_l2_class: key,
              count: startedtimel2classItems[0][key]
            };
            arr.push(obj)
          }
          startedtimel2classList = arr;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          startedtimel2classItems,
          startedtimel2classList,
        };
      },
    },
    //  通话时段(小时)
    fetchStartedhourclass: {
      method: 'POST',
      url: './group-by-startedhourclass',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          startedhourclassItems = body.data;
          let arr = [];
          for (let key in startedhourclassItems[0]) {
            let obj = {
              started_hour_class: key,
              count: startedhourclassItems[0][key]
            };
            arr.push(obj)
          }
          startedhourclassList = arr;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          startedhourclassItems,
          startedhourclassList,
        };
      },
    },
    //  通话时长VS通话时段
    fetchDurationclassAndstartedtimel1class: {
      method: 'POST',
      url: './group-by-durationclassandstartedtimel1class',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          durationclassAndstartedtimel1classItems = body.data;
          durationclassAndstartedtimel1classList = formatDurationclassAndstartedtimel1class(durationclassAndstartedtimel1classItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          durationclassAndstartedtimel1classItems,
          durationclassAndstartedtimel1classList,
        };
      },
    },
    //  通话时长VS通话时段(详细)
    fetchDurationclassAndstartedtimel2class: {
      method: 'POST',
      url: './group-by-durationclassandstartedtimel2class',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          durationclassAndstartedtimel2classItems = body.data;
          durationclassAndstartedtimel2classList = formatDurationclassAndstartedtimel2class(durationclassAndstartedtimel2classItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          durationclassAndstartedtimel2classItems,
          durationclassAndstartedtimel2classList,
        };
      },
    },
    //  一周分布
    fetchWeekday: {
      method: 'POST',
      url: './group-by-weekday',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          weekdayItems = body.data;
          weekdayList = formatListData(weekdayItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          weekdayItems,
          weekdayList,
        };
      },
    },
    //  日期
    fetchStartedday: {
      method: 'POST',
      url: './group-by-startedday',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          starteddayItems = body.data;
          // starteddayList = formatListData(starteddayItems);

          const data = [];
          for (const i in starteddayItems) {
            for (const j in starteddayItems[i]) {
              let obj = {
                started_day: j,
                tag: '',
                count: starteddayItems[i][j],
                lunarCalendar: j,
                weekday: j
              };
              data.push(obj);
            }
          }
          starteddayList = data;
        }
        if (status === 'resolved') {
          state.isLoading = false;
          return {
            ...state,
            starteddayItems,
            starteddayList,
          };
        } else {
          state.isLoading = true;
          return {
            ...state,
          };
        }

      },
    },
    fetchAllStartedday: {
      method: 'POST',
      url: './group-by-startedday',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          starteddayAllItems = body.data;
        }

        return {
          ...state,
          starteddayAllItems
        };
      },
    },
    //  日期VS通话时间段
    fetchStarteddayAndstartedtimel1class: {
      method: 'POST',
      url: './group-by-starteddayandstartedtimel1class',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          starteddayAndstartedtimel1classItems = body.data;
          starteddayAndstartedtimel1classList = formatStarteddayAndstartedtimel1class(starteddayAndstartedtimel1classItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          starteddayAndstartedtimel1classItems,
          starteddayAndstartedtimel1classList,
        };
      },
    },
    //  日期VS通话时间段(详细)
    fetchStarteddayAndstartedtimel2class: {
      method: 'POST',
      url: './group-by-starteddayandstartedtimel2class',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          starteddayAndstartedtimel2classItems = body.data;
          starteddayAndstartedtimel2classList = formatStarteddayAndstartedtimel2class(starteddayAndstartedtimel2classItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          starteddayAndstartedtimel2classItems,
          starteddayAndstartedtimel2classList,
        };
      },
    },

    //  日期VS对方号码
    fetchStarteddayandandpeernum: {
      method: 'POST',
      url: './group-by-starteddayandandpeernum',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          starteddayandandpeernumItems = body.data;
          starteddayandandpeernumList = formatStarteddayandandpeernum(starteddayandandpeernumItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          starteddayandandpeernumItems,
          starteddayandandpeernumList,
        };
      },
    },
    clearStarteddayandandpeernum: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          starteddayandandpeernumItems: null,
          starteddayandandpeernumList: null,
        };
      },
    },


    //  日期VS基站
    fetchStarteddayandctcode: {
      method: 'POST',
      url: './group-by-starteddayandctcode',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          starteddayAndctcodeItems = body.data;
          starteddayAndctcodeList = formatStarteddayandctcode(starteddayAndctcodeItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          starteddayAndctcodeItems,
          starteddayAndctcodeList,
        };
      },
    },
    clearStarteddayandctcode: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          starteddayAndctcodeItems: null,
          starteddayAndctcodeList: null,
        };
      },
    },


    // 本方号码vs时长类型
    fetchOwnernumAnddurationclass: {
      method: 'POST',
      url: './group-by-ownernumanddurationclass',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          ownernumanddurationclassItems = body.data;
          ownernumanddurationclassList = formatOwnernumAnddurationclass(ownernumanddurationclassItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          ownernumanddurationclassItems,
          ownernumanddurationclassList,
        };
      },
    },
    //  日期VS通话时间段
    fetchOwnernumAndstartedtimel1class: {
      method: 'POST',
      url: './group-by-ownernumandstartedtimel1class',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          ownernumandstartedtimel1classItems = body.data;
          ownernumandstartedtimel1classList = formatOwnernumandstartedtimel1class(ownernumandstartedtimel1classItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          ownernumandstartedtimel1classItems,
          ownernumandstartedtimel1classList,
        };
      },
    },
    // 日期vs本方号码
    fetchOwnernumAndctandstartedhourclass: {
      method: 'POST',
      url: './group-by-ownernumandctandstartedhourclass',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          ownernumandctandstartedhourclassItems = body.data;
          let res = formatOwnernumandctandstartedhourclass(ownernumandctandstartedhourclassItems);
          ownernumandctandstartedhourclassList = res.data;
          ownernumandctandstartedhourclassHotMap = res.points;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          ownernumandctandstartedhourclassItems,
          ownernumandctandstartedhourclassList,
          ownernumandctandstartedhourclassHotMap,
        };
      },
    },
    clearOwnernumAndctandstartedhourclass: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          ownernumandctandstartedhourclassItems: null,
          ownernumandctandstartedhourclassList: null,
          ownernumandctandstartedhourclassHotMap: null
        };
      },
    },


    //  日期VS通话时间段(详细)
    fetchOwnernumAndstartedtimel2class: {
      method: 'POST',
      url: './group-by-ownernumandstartedtimel2class',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          ownernumandstartedtimel2classItems = body.data;
          ownernumandstartedtimel2classList = formatOwnernumandstartedtimel2class(ownernumandstartedtimel2classItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          ownernumandstartedtimel2classItems,
          ownernumandstartedtimel2classList,
        };
      },
    },
    //  日期VS通话时间段(小时)
    fetchOwnernumandstartedhourclass: {
      method: 'POST',
      url: './group-by-ownernumandstartedhourclass',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          ownernumandstartedhourclassItems = body.data;
          ownernumandstartedhourclassList = formatOwnernumandstartedhourclass(ownernumandstartedhourclassItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          ownernumandstartedhourclassItems,
          ownernumandstartedhourclassList,
        };
      },
    },

    // 基站标注
    fetchOwnernumandstartedhorclass: {
      method: 'POST',
      url: './group-by-ownernumandstartedhorclass',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          ownernumandstartedhorclassItems = body.data;
          ownernumandstartedhorclassList = formatOwnernumandstartedhorclass(ownernumandstartedhorclassItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          ownernumandstartedhorclassItems,
          ownernumandstartedhorclassList,
        };
      },
    },

    // 对方号码
    fetchPeernum: {
      method: 'POST',
      url: './group-by-peernum',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          peernumItems = body.data;
          peernumList = formatPeernum(peernumItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          peernumItems,
          peernumList,
        };
      },
    },
    clearPeernum: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          peernumItems: null,
          peernumList: null,
        };
      },
    },
    fetchRelatedItems: {
      method: 'GET',
      url: `${hostUrl}/cases/:case_id/pbills/:num/related`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          relatedItems = body.data;
          relatedList = formatRelated(relatedItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          relatedItems,
          relatedList,
        };
      },
    },
    fetchPeernumexclusioncondition: {
      method: 'POST',
      url: './group-by-peernumexclusioncondition',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          peernumexclusionconditionItems = body.data;
          peernumexclusionconditionList = formatPeernumexclusioncondition(peernumexclusionconditionItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          peernumexclusionconditionItems,
          peernumexclusionconditionList,
        };
      },
    },
    //  对方号码vs时长类型
    fetchPeernumanddurationclass: {
      method: 'POST',
      url: './group-by-peernumanddurationclass',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          peernumanddurationclassItems = body.data;
          peernumanddurationclassList = formatPeernumanddurationclass2(peernumanddurationclassItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          peernumanddurationclassItems,
          peernumanddurationclassList,
        };
      },
    },
    //  对方号码vs通话时段
    fetchPeernumandstartedtimel1class: {
      method: 'POST',
      url: './group-by-peernumandstartedtimel1class',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          peernumandstartedtimel1classItems = body.data;
          peernumandstartedtimel1classList = formatPeernumandstartedtimel1class(peernumandstartedtimel1classItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          peernumandstartedtimel1classItems,
          peernumandstartedtimel1classList,
        };
      },
    },
    //  对方号码VS通话时段(详细)
    fetchPeernumAndstartedtimel2class: {
      method: 'POST',
      url: './group-by-peernumandstartedtimel2class',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          peernumandstartedtimel2classItems = body.data;
          peernumandstartedtimel2classList = formatPeernumAndstartedtimel2class(peernumandstartedtimel2classItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          peernumandstartedtimel2classItems,
          peernumandstartedtimel2classList,
        };
      },
    },
    //  日期VS通话时间段(小时)
    fetchPeernumandstartedhourclass: {
      method: 'POST',
      url: './group-by-peernumandstartedhourclass',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          peernumandstartedhourclassItems = body.data;
          peernumandstartedhourclassList = formatPeernumandstartedhourclass(peernumandstartedhourclassItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          peernumandstartedhourclassItems,
          peernumandstartedhourclassList,
        };
      },
    },
    //  基站
    fetchOwnerctcode: {
      method: 'POST',
      url: './group-by-ownerctcode',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          ownerctcodeItems = body.data;
          let res = formatOwnerctcode(ownerctcodeItems);
          ownerctcodeList = res.data;
          ownerctcodeHotMap = res.points;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          ownerctcodeItems,
          ownerctcodeList,
          ownerctcodeHotMap
        };
      },
    },
    clearOwnerctcode: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          ownerctcodeItems: null,
          ownerctcodeList: null,
          ownerctcodeHotMap: null
        };
      },
    },
    //  基站vs通话时段
    fetchCodeandstartedtimel1class: {
      method: 'POST',
      url: './group-by-codeandstartedtimel1class',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          codeandstartedtimel1classItems = body.data;
          let res = formatCodeandstartedtimel1class(codeandstartedtimel1classItems);
          codeandstartedtimel1classList = res.data;
          codeandstartedtimel1classHotMap = res.points
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          codeandstartedtimel1classItems,
          codeandstartedtimel1classList,
          codeandstartedtimel1classHotMap
        };
      },
    },

    clearCodeandstartedtimel1class: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          codeandstartedtimel1classItems: null,
          codeandstartedtimel1classList: null,
          codeandstartedtimel1classHotMap: null
        };
      },
    },

    //  基站vs通话时段(详细)
    fetchCodeandstartedtimel2class: {
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

    //  基站vs通话时段(小时)
    fetchCodeandstartedhourclass: {
      method: 'POST',
      url: './group-by-codeandstartedhourclass',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          codeandstartedhourclassItems = body.data;
          let res = formatCodeandstartedhourclass(codeandstartedhourclassItems);
          codeandstartedhourclassList = res.data;
          codeandstartedhourclassHotMap = res.points;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          codeandstartedhourclassItems,
          codeandstartedhourclassList,
          codeandstartedhourclassHotMap
        };
      },
    },

    clearCodeandstartedhourclass: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          codeandstartedhourclassItems: null,
          codeandstartedhourclassList: null,
          codeandstartedhourclassHotMap: null
        };
      },
    },


    //  基站vs通话时段(小时) 全局标注
    fetchCodeandstartedhour25class: {
      method: 'POST',
      url: './group-by-codeandstartedhourclass',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          codeandstartedhour25classItems = body.data;
          let res = formatCodeandstartedhourclass(codeandstartedhour25classItems);
          codeandstartedhour25classList = res.data;
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          codeandstartedhour25classItems,
          codeandstartedhour25classList,
        };
      },
    },
    //  小区号lac
    fetchOwnerlac: {
      method: 'POST',
      url: './group-by-ownerlac',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          ownerlacItems = body.data;
          ownerlacList = formatOwnerlac(ownerlacItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          ownerlacItems,
          ownerlacList,
        };
      },
    },
    //  基站vs通话时长
    fetchCodeandstarteddurationclass: {
      method: 'POST',
      url: './group-by-codeandstarteddurationclass',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          codeandstarteddurationclassItems = body.data;
          codeandstarteddurationclassList = formatCodeandstarteddurationclass(codeandstarteddurationclassItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          codeandstarteddurationclassItems,
          codeandstarteddurationclassList,
        };
      },
    },
    clearCodeandstarteddurationclass: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...state,
          codeandstarteddurationclassItems: null,
          codeandstarteddurationclassList: null,
        };
      },
    },


    clearPBStatStore: {
      isPure: true,
      reduce: (state, action) => {
        return {
          ...initialState,
        };
      },
    },
  },
});


function formatListData(value) {
  const arrData = value;
  const data = [];
  for (const i in arrData) {
    for (const j in arrData[i]) {
      let obj = {
        weekday: j,
        count: arrData[i][j]
      };
      data.push(obj);
    }
  }
  return data;
}


function formatOclListData(value) {
  // const data = [];
  // for (let i = 0; i < value.length; i++) {
  //   let arr = [];
  //   arr[0] = value[i].ocl;
  //   arr[1] = value[i].count;
  //   arr[2] = value[i].day_count;
  //   data.push(arr)
  // }
  return JSON.parse(JSON.stringify(value).replace(/ocl/g, 'owner_comm_loc'));
}

function formatPclListData(value) {
  // const data = [];
  // for (let i = 0; i < value.length; i++) {
  //   let arr = [];
  //   arr[0] = value[i].pcl;
  //   arr[1] = value[i].count;
  //   arr[2] = value[i].peer_num_count;
  //   data.push(arr)
  // }
  return JSON.parse(JSON.stringify(value).replace(/pcl/g, 'peer_comm_loc'));
}


function formatChartData(value) {
  const arrData = value;
  const data = [];
  const head = [];
  for (const i in arrData) {
    const body = [];
    for (const j in arrData[i]) {
      // if (i === '0') {
      //   head.push(j);
      // }
      body.push(arrData[i][j]);
    }
    data.push(body);
  }
  // data.unshift(head);
  console.log(data);
  return data;
}

function formatStarteddayAndstartedtimel1class(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = [];
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    // if (!map[ai.started_day]) {
    //   tempArr[0] = ai.started_day;
    //   tempArr[1] = ai['标注'];
    //   tempArr[2] = ai.total;
    //   tempArr[3] = moment(ai.first_started_at).format('HH:mm');
    //   tempArr[4] = moment(ai.ended_started_at).format('HH:mm');
    //   tempArr[5] = ai['4:30~7:30'];
    //   tempArr[6] = ai['7:31~11:15'];
    //   tempArr[7] = ai['11:16~13:30'];
    //   tempArr[8] = ai['13:31~17:15'];
    //   tempArr[9] = ai['17:16~19:00'];
    //   tempArr[10] = ai['19:01~20:50'];
    //   tempArr[11] = ai['20:51~23:59'];
    //   tempArr[12] = ai['0:00~5:30'];
    //
    //   arr2.push(tempArr);
    //   map[ai.started_day] = ai;
    // } else {
    //   // for (let j = 0; j < arr.length; j++) {
    //   //   const arrItem = arr[j];
    //   //   const arrItem2 = arr2[j];
    //   //   if (arrItem.sd === ai.sd) {
    //   //     arrItem.c = arrItem2[17] = (parseInt(arrItem.c, 0) + parseInt(ai.c, 0));
    //   //     arrItem.stlc.push(ai.stlc);
    //   //     arrItem2[parseInt(ai.stlc, 0) + 1] = ai.c;
    //   //     break;
    //   //   }
    //   // }
    // }
    arr.push(ai)
  }
  // console.log(arr2);
  return arr;
}

function formatStarteddayAndstartedtimel2class(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array();
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    // if (!map[ai.started_day]) {
    //   tempArr[0] = ai.started_day;
    //   tempArr[1] = ai['标注'];
    //   tempArr[2] = ai.total;
    //   tempArr[3] = moment(ai.first_started_at).format('HH:mm');
    //   tempArr[4] = moment(ai.ended_started_at).format('HH:mm');
    //   tempArr[5] = ai['4:30~6:20'];
    //   tempArr[6] = ai['6:21~7:10'];
    //   tempArr[7] = ai['7:11~7:50'];
    //   tempArr[8] = ai['7:51~8:25'];
    //   tempArr[9] = ai['8:26~11:00'];
    //   tempArr[10] = ai['11:01~11:30'];
    //   tempArr[11] = ai['11:31~12:30'];
    //   tempArr[12] = ai['12:31~13:20'];
    //   tempArr[13] = ai['13:21~14:00'];
    //   tempArr[14] = ai['14:01~16:50'];
    //   tempArr[15] = ai['16:51~17:40'];
    //   tempArr[16] = ai['17:41~18:50'];
    //   tempArr[17] = ai['18:51~20:00'];
    //   tempArr[18] = ai['20:01~21:50'];
    //   tempArr[19] = ai['21:51~23:59'];
    //   tempArr[20] = ai['0:00~4:29'];
    //
    //   // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
    //   arr2.push(tempArr);
    //   // arr.push({
    //   //   sd: ai.sd,
    //   //   stlc: [ai.stlc],
    //   //   c: ai.c,
    //   // });
    //   map[ai.started_day] = ai;
    // } else {
    //   // for (let j = 0; j < arr.length; j++) {
    //   //   const arrItem = arr[j];
    //   //   const arrItem2 = arr2[j];
    //   //   if (arrItem.sd === ai.sd) {
    //   //     arrItem.c = arrItem2[17] = (parseInt(arrItem.c, 0) + parseInt(ai.c, 0));
    //   //     arrItem.stlc.push(ai.stlc);
    //   //     arrItem2[parseInt(ai.stlc, 0) + 1] = ai.c;
    //   //     break;
    //   //   }
    //   // }
    // }
    arr.push(ai)
  }
  // console.log(arr2);
  return arr;
}

function formatDurationclassAndstartedtimel1class(data) {
  const map = {}, arr = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array();
    for (let key in data[i]) {
      tempArr[0] = key;

      for (let j = 0; j < data[i][key].length; j++) {
        const a2 = data[i][key][j];
        ai = {...ai, ...a2}
      }
      // if (!map[ai.dc]) {
      //   tempArr[1] = ai['4:30~7:30'];
      //   tempArr[2] = ai['7:31~11:15'];
      //   tempArr[3] = ai['11:16~13:30'];
      //   tempArr[4] = ai['13:31~17:15'];
      //   tempArr[5] = ai['17:16~19:00'];
      //   tempArr[6] = ai['19:01~20:50'];
      //   tempArr[7] = ai['20:51~23:59'];
      //   tempArr[8] = ai['0:00~5:30'];
      // }
      // map[ai.dc] = ai
      // console.log(ai);
      let obj = {
        duration_class: key,
        '0': ai['4:30~7:30'],
        '1': ai['7:31~11:15'],
        '2': ai['11:16~13:30'],
        '3': ai['13:31~17:15'],
        '4': ai['17:16~19:00'],
        '5': ai['19:01~20:50'],
        '6': ai['20:51~23:59'],
        '7': ai['0:00~5:30'],
      };
      arr.push(obj)
    }
  }
  return arr;
}

function formatDurationclassAndstartedtimel2class(data) {
  const map = {}, arr = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array();
    for (let key in data[i]) {
      tempArr[0] = key;
      for (let j = 0; j < data[i][key].length; j++) {
        const a2 = data[i][key][j];
        ai = {...ai, ...a2}
      }
      // if (!map[ai.dc]) {
      //   tempArr[1] = ai['4:30~6:20'];
      //   tempArr[2] = ai['6:21~7:10'];
      //   tempArr[3] = ai['7:11~7:50'];
      //   tempArr[4] = ai['7:51~8:25 '];
      //   tempArr[5] = ai['8:26~11:00'];
      //   tempArr[6] = ai['11:01~11:30'];
      //   tempArr[7] = ai['11:31~12:30'];
      //   tempArr[8] = ai['12:31~13:20'];
      //   tempArr[9] = ai['13:21~14:00'];
      //   tempArr[10] = ai['14:01~16:50'];
      //   tempArr[11] = ai['16:51~17:40'];
      //   tempArr[12] = ai['17:41~18:50'];
      //   tempArr[13] = ai['18:51~20:00'];
      //   tempArr[14] = ai['20:01~21:50'];
      //   tempArr[15] = ai['21:51~23:59'];
      //   tempArr[16] = ai['0:00~4:29'];
      // }
      let obj = {
        duration_class: key,
        '0': ai['4:30~6:20'],
        '1': ai['6:21~7:10'],
        '2': ai['7:11~7:50'],
        '3': ai['7:51~8:25 '],
        '4': ai['8:26~11:00'],
        '5': ai['11:01~11:30'],
        '6': ai['11:31~12:30'],
        '7': ai['12:31~13:20'],
        '8': ai['13:21~14:00'],
        '9': ai['14:01~16:50'],
        '10': ai['16:51~17:40'],
        '11': ai['17:41~18:50'],
        '12': ai['18:51~20:00'],
        '13': ai['20:01~21:50'],
        '14': ai['21:51~23:59'],
        '15': ai['0:00~4:29'],
      };
      arr.push(obj)
    }
  }
  // console.log(arr);
  return arr;
}


function formatOwnernumAnddurationclass(data) {
  const map = {},
    arr = [];
  for (let i = 0; i < data.length; i++) {
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }

    // if (!map[ai.owner_num]) {
    //   tempArr[0] = ai.owner_num;
    //   tempArr[1] = ai.owner_cname;
    //   tempArr[2] = ai['标签'];
    //   tempArr[3] = ai['其他'];
    //   tempArr[4] = ai['1~15秒'];
    //   tempArr[5] = ai['16~90秒'];
    //   tempArr[6] = ai['1.5~3分'];
    //   tempArr[7] = ai['3~5分'];
    //   tempArr[8] = ai['5~10分'];
    //   tempArr[9] = ai['>10分'];
    //   tempArr[10] = ai.total;
    //   arr2.push(tempArr);
    //   map[ai.owner_num] = ai;
    // }

    arr.push(ai)
  }
  return arr;
}

function formatOwnernumandstartedtimel1class(data) {
  const map = {},
    arr = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array();
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    //
    // if (!map[ai.owner_num]) {
    //   tempArr[0] = ai.owner_num;
    //   tempArr[1] = ai.owner_cname;
    //   tempArr[2] = ai['标签'];
    //   tempArr[3] = ai['4:30~7:30'];
    //   tempArr[4] = ai['7:31~11:15'];
    //   tempArr[5] = ai['11:16~13:30'];
    //   tempArr[6] = ai['13:31~17:15'];
    //   tempArr[7] = ai['17:16~19:00'];
    //   tempArr[8] = ai['19:01~20:50'];
    //   tempArr[9] = ai['20:51~23:59'];
    //   tempArr[10] = ai['0:00~5:30'];
    //   tempArr[11] = ai.total;
    //   // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
    //   arr2.push(tempArr);
    //   // arr.push({
    //   //   sd: ai.sd,
    //   //   stlc: [ai.stlc],
    //   //   c: ai.c,
    //   // });
    //   map[ai.owner_num] = ai;
    // }
    arr.push(ai)

  }
  // console.log(arr2);
  return arr;
}

export function formatOwnernumandctandstartedhourclass(data) {
  const points = {},
    arr = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    // tempArr[0] = ai.owner_ct_code;
    // tempArr[1] = ai['出现频率'];
    // tempArr[2] = ai['基站标注'];
    // tempArr[3] = ai.owner_num;
    // tempArr[4] = ai.owner_cname;
    // tempArr[5] = ai['标签'];
    // tempArr[6] = ai.online_days;
    // tempArr[7] = ai.total;
    // tempArr[8] = ai['4时'];
    // tempArr[9] = ai['5时'];
    // tempArr[10] = ai['6时'];
    // tempArr[11] = ai['7时'];
    // tempArr[12] = ai['8时'];
    // tempArr[13] = ai['9时'];
    // tempArr[14] = ai['10时'];
    // tempArr[15] = ai['11时'];
    // tempArr[16] = ai['12时'];
    // tempArr[17] = ai['13时'];
    // tempArr[18] = ai['14时'];
    // tempArr[19] = ai['15时'];
    // tempArr[20] = ai['16时'];
    // tempArr[21] = ai['17时'];
    // tempArr[22] = ai['18时'];
    // tempArr[23] = ai['19时'];
    // tempArr[24] = ai['20时'];
    // tempArr[25] = ai['21时'];
    // tempArr[26] = ai['22时'];
    // tempArr[27] = ai['23时'];
    // tempArr[28] = ai['0时'];
    // tempArr[29] = ai['1时'];
    // tempArr[30] = ai['2时'];
    // tempArr[31] = ai['3时'];
    // arr2.push(tempArr);
    arr.push(ai)

    if (ai.coord) {
      if (points[ai.owner_num]) {
        points[ai.owner_num] = [...points[ai.owner_num], ...[{
          lng: ai.coord[0],
          lat: ai.coord[1],
          count: ai.total,
          ct_code: ai.owner_ct_code
        }]]
      } else {
        points[ai.owner_num] = [];
        points[ai.owner_num].push({
          lng: ai.coord[0],
          lat: ai.coord[1],
          count: ai.total,
          ct_code: ai.owner_ct_code
        })
      }
    }
  }

  arr.forEach(item => {
    let n = (JSON.stringify(arr).split(item.owner_ct_code)).length - 1;
    item['出现频率'] = n
  });
  return {
    data: arr,
    points
  };
}


function formatOwnernumandstartedtimel2class(data) {
  const map = {},
    arr = [];
  for (let i = 0; i < data.length; i++) {
    const tempArr = new Array();
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    // if (!map[ai.owner_num]) {
    //   tempArr[0] = ai.owner_num;
    //   tempArr[1] = ai.owner_cname;
    //   tempArr[2] = ai['标签'];
    //   tempArr[3] = ai.total;
    //   tempArr[4] = ai['4:30~6:20'];
    //   tempArr[5] = ai['6:21~7:10'];
    //   tempArr[6] = ai['7:11~7:50'];
    //   tempArr[7] = ai['7:51~8:25'];
    //   tempArr[8] = ai['8:26~11:00'];
    //   tempArr[9] = ai['11:01~11:30'];
    //   tempArr[10] = ai['11:31~12:30'];
    //   tempArr[11] = ai['12:31~13:20'];
    //   tempArr[12] = ai['13:21~14:00'];
    //   tempArr[13] = ai['14:01~16:50'];
    //   tempArr[14] = ai['16:51~17:40'];
    //   tempArr[15] = ai['17:41~18:50'];
    //   tempArr[16] = ai['18:51~20:00'];
    //   tempArr[17] = ai['20:01~21:50'];
    //   tempArr[18] = ai['21:51~23:59'];
    //   tempArr[19] = ai['0:00~4:29'];
    //   arr1.push(tempArr);
    //   map[ai.owner_num] = ai;
    // }
    arr.push(ai)
  }
  // console.log(arr1);
  return arr;
}

function formatOwnernumandstartedhourclass(data) {
  const map = {},
    arr = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }

    // if (!map[ai.owner_num]) {
    //   tempArr[0] = ai.owner_num;
    //   tempArr[1] = ai.owner_cname;
    //   tempArr[2] = ai['标签'];
    //   tempArr[3] = ai.total;
    //   tempArr[4] = ai['4时'];
    //   tempArr[5] = ai['5时'];
    //   tempArr[6] = ai['6时'];
    //   tempArr[7] = ai['7时'];
    //   tempArr[8] = ai['8时'];
    //   tempArr[9] = ai['9时'];
    //   tempArr[10] = ai['10时'];
    //   tempArr[11] = ai['11时'];
    //   tempArr[12] = ai['12时'];
    //   tempArr[13] = ai['13时'];
    //   tempArr[14] = ai['14时'];
    //   tempArr[15] = ai['15时'];
    //   tempArr[16] = ai['16时'];
    //   tempArr[17] = ai['17时'];
    //   tempArr[18] = ai['18时'];
    //   tempArr[19] = ai['19时'];
    //   tempArr[20] = ai['20时'];
    //   tempArr[21] = ai['21时'];
    //   tempArr[22] = ai['22时'];
    //   tempArr[23] = ai['23时'];
    //   tempArr[24] = ai['0时'];
    //   tempArr[25] = ai['1时'];
    //   tempArr[26] = ai['2时'];
    //   tempArr[27] = ai['3时'];
    //   // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
    //   arr2.push(tempArr);
    //   // arr.push({
    //   //   sd: ai.sd,
    //   //   stlc: [ai.stlc],
    //   //   c: ai.c,
    //   // });
    //   map[ai.owner_num] = ai;
    // } else {
    //   // for (let j = 0; j < arr.length; j++) {
    //   //   const arrItem = arr[j];
    //   //   const arrItem2 = arr2[j];
    //   //   if (arrItem.sd === ai.sd) {
    //   //     arrItem.c = arrItem2[17] = (parseInt(arrItem.c, 0) + parseInt(ai.c, 0));
    //   //     arrItem.stlc.push(ai.stlc);
    //   //     arrItem2[parseInt(ai.stlc, 0) + 1] = ai.c;
    //   //     break;
    //   //   }
    //   // }
    // }
    arr.push(ai)
  }
  // console.log(arr2);
  return arr;
}

function formatOwnernumandstartedhorclass(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = [];
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }

    if (!map[ai.owner_num]) {
      tempArr[0] = ai.owner_num;
      tempArr[1] = ai.owner_cname;
      tempArr[2] = ai['号码标签'];
      tempArr[3] = ai.total;
      tempArr[4] = ai.online_days;
      tempArr[5] = ai.first_day;
      tempArr[6] = ai.last_day;
      tempArr[7] = ai['4时'];
      tempArr[8] = ai['5时'];
      tempArr[9] = ai['6时'];
      tempArr[10] = ai['7时'];
      tempArr[11] = ai['8时'];
      tempArr[12] = ai['9时'];
      tempArr[13] = ai['10时'];
      tempArr[14] = ai['11时'];
      tempArr[15] = ai['12时'];
      tempArr[16] = ai['13时'];
      tempArr[17] = ai['14时'];
      tempArr[18] = ai['15时'];
      tempArr[19] = ai['16时'];
      tempArr[20] = ai['17时'];
      tempArr[21] = ai['18时'];
      tempArr[22] = ai['19时'];
      tempArr[23] = ai['20时'];
      tempArr[24] = ai['21时'];
      tempArr[25] = ai['22时'];
      tempArr[26] = ai['23时'];
      tempArr[27] = ai['0时'];
      tempArr[28] = ai['1时'];
      tempArr[29] = ai['2时'];
      tempArr[30] = ai['3时'];
      // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
      arr2.push(tempArr);
      // arr.push({
      //   sd: ai.sd,
      //   stlc: [ai.stlc],
      //   c: ai.c,
      // });
      map[ai.owner_num] = ai;
    } else {
      // for (let j = 0; j < arr.length; j++) {
      //   const arrItem = arr[j];
      //   const arrItem2 = arr2[j];
      //   if (arrItem.sd === ai.sd) {
      //     arrItem.c = arrItem2[17] = (parseInt(arrItem.c, 0) + parseInt(ai.c, 0));
      //     arrItem.stlc.push(ai.stlc);
      //     arrItem2[parseInt(ai.stlc, 0) + 1] = ai.c;
      //     break;
      //   }
      // }
    }
  }
  // console.log(arr2);
  return arr2;
}


function formatPeernum(data) {
  const map = {},
    arr = [];

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

function formatStarteddayandandpeernum(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = []
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    // if (!map[ai.peer_num]) {
    // tempArr[0] = ai.started_day;
    // tempArr[1] = ai.owner_num;
    // tempArr[2] = ai.owner_cname;
    // tempArr[3] = ai['标签'];
    // tempArr[4] = ai.peer_num;
    // tempArr[5] = ai.peer_cname;
    // tempArr[6] = ai['标签'];
    // tempArr[7] = ai.contact_times;
    // tempArr[8] = ai.memo;
    // arr2.push(tempArr);
    //   map[ai.peer_num] = ai;
    // }
    arr.push(ai)
  }
  return arr;
}

function formatStarteddayandctcode(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = []
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    // if (!map[ai.peer_num]) {
    // tempArr[0] = ai.started_day;
    // tempArr[1] = ai.owner_num;
    // tempArr[2] = ai.owner_cname;
    // tempArr[3] = ai['标签'];
    // tempArr[4] = ai.owner_ct_code;
    // tempArr[5] = ai['基站标注'];
    // tempArr[6] = ai.contact_times;
    // tempArr[7] = ai.memo;
    // arr2.push(tempArr);
    //   map[ai.peer_num] = ai;
    // }
    arr.push(ai)
  }
  return arr;
}

function formatRelated(data) {
  const map = {},
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = [];
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }

    if (!map[ai.first_day]) {
      tempArr[0] = ai.owner_num;
      tempArr[1] = ai['标注'];
      tempArr[2] = ai['标签'];
      tempArr[3] = ai.peer_num;
      tempArr[4] = ai.peer_cname;
      tempArr[5] = ai.call_count;
      tempArr[6] = ai.online_days;
      tempArr[7] = ai.sms_count;
      tempArr[8] = ai['主叫'];
      tempArr[9] = ai['<--'];
      tempArr[10] = ai['呼转'];
      tempArr[11] = ai.private_time_count;
      tempArr[12] = ai.work_time_count;
      tempArr[13] = ai.more_than_5_count;
      tempArr[14] = ai.after_21_count;
      tempArr[15] = ai.total_duration;
      tempArr[16] = `${Math.floor(ai.total_duration / 60)}分`;
      tempArr[17] = ai.first_day;
      tempArr[18] = ai.last_day;
      tempArr[19] = ai['详单'];
      tempArr[20] = ai.total;
      arr2.push(tempArr);
      map[ai.first_day] = ai;
    }
  }
  return arr2;
}

function formatPeernumexclusioncondition(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array();
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    arr2.push(ai);
  }
  return arr2;
}


function formatPeernumanddurationclass2(data) {
  const map = {}, arr = [];

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

function formatPeernumandstartedtimel1class(data) {
  const arr = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    let tempArr = {}
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    tempArr = {
      peer_num: ai.peer_num,
      peer_cname: ai.peer_cname,
      tag: null,
      total: ai.total,
      '4:30~7:30': ai['4:30~7:30'],
      '7:31~11:15': ai['7:31~11:15'],
      '11:16~13:30': ai['11:16~13:30'],
      '13:31~17:15': ai['13:31~17:15'],
      '17:16~19:00': ai['17:16~19:00'],
      '19:01~20:50': ai['19:01~20:50'],
      '20:51~23:59': ai['20:51~23:59'],
      '0:00~5:30': ai['0:00~5:30'],
    };
    arr.push(ai);

  }
  return arr;
}

function formatPeernumAndstartedtimel2class(data) {
  const map = {},
    arr = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    arr.push(ai)
  }
  // console.log(arr);
  return arr;
}

function formatPeernumandstartedhourclass(data) {
  const map = {},
    arr = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array();
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    arr.push(ai)
  }
  // console.log(arr);
  return arr;
}

export function formatOwnerctcode(data) {
  const points = [];
  for (let i = 0; i < data.length; i++) {
    const ai = data[i];
    if (ai.coord && ai.coord[0] && ai.coord[1]) {
      let obj = {
        lng: ai.coord[0],
        lat: ai.coord[1],
        count: ai.contact_times,
        ct_code: ai.owner_ct_code
      };
      points.push(obj)
    }
  }
  return {
    data: data,
    points
  };
}

export function formatCodeandstartedtimel1class(data) {
  const arr = [],
    points = [];
  for (let i = 0; i < data.length; i++) {
    let ai = {};
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

export function formatCodeandstartedtimel2class(data) {
  const map = {},
    arr = [],
    arr2 = [],
    points = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array();
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    if (!map[ai.owner_ct_code]) {
      tempArr[0] = ai.owner_ct_code;
      tempArr[1] = ai['标注'];
      tempArr[2] = ai.total;
      tempArr[3] = ai.owner_ct_addr;
      tempArr[4] = ai.owner_lac;
      tempArr[5] = ai.owner_ci;
      tempArr[6] = ai['4:30~6:20'];
      tempArr[7] = ai['6:21~7:10'];
      tempArr[8] = ai['7:11~7:50'];
      tempArr[9] = ai['7:51~8:25'];
      tempArr[10] = ai['8:26~11:00'];
      tempArr[11] = ai['11:01~11:30'];
      tempArr[12] = ai['11:31~12:30'];
      tempArr[13] = ai['12:31~13:20'];
      tempArr[14] = ai['13:21~14:00'];
      tempArr[15] = ai['14:01~16:50'];
      tempArr[16] = ai['16:51~17:40'];
      tempArr[17] = ai['17:41~18:50'];
      tempArr[18] = ai['18:51~20:00'];
      tempArr[19] = ai['20:01~21:50'];
      tempArr[20] = ai['21:51~23:59'];
      tempArr[21] = ai['0:00~4:29'];
      arr2.push(tempArr);
      map[ai.owner_ct_code] = ai;

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
  }
  // console.log(arr2);
  return {
    data: arr2,
    points
  };
}


export function formatCodeandstartedhourclass(data) {
  const arr = [],
    points = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
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

function formatOwnerlac(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    const ai = data[i];
    ai['操作'] = '';
    // const tempArr = new Array(3);
    // if (!map[ai.owner_lac]) {
    //   tempArr[0] = ai.owner_lac;
    //   tempArr[1] = ai.count;
    //   tempArr[2] = ai['查看'];
    //   // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
    //   arr2.push(tempArr);
    //   // arr.push({
    //   //   sd: ai.sd,
    //   //   stlc: [ai.stlc],
    //   //   c: ai.c,
    //   // });
    //   map[ai.owner_lac] = ai;
    // } else {
    //   // for (let j = 0; j < arr.length; j++) {
    //   //   const arrItem = arr[j];
    //   //   const arrItem2 = arr2[j];
    //   //   if (arrItem.sd === ai.sd) {
    //   //     arrItem.c = arrItem2[17] = (parseInt(arrItem.c, 0) + parseInt(ai.c, 0));
    //   //     arrItem.stlc.push(ai.stlc);
    //   //     arrItem2[parseInt(ai.stlc, 0) + 1] = ai.c;
    //   //     break;
    //   //   }
    //   // }
    // }
  }
  // console.log(arr2);
  return data;
}

function formatCodeandstarteddurationclass(data) {
  const arr = [];
  for (let i = 0; i < data.length; i++) {
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    arr.push(ai)
    // if (!map[ai.owner_ct_code]) {
    //   tempArr[0] = ai.owner_ct_code;
    //   tempArr[1] = ai['标注'];
    //   tempArr[2] = ai.total;
    //   tempArr[3] = ai.owner_ct_addr;
    //   tempArr[4] = ai.owner_lac;
    //   tempArr[5] = ai.owner_ci;
    //   tempArr[6] = ai['其他'];
    //   tempArr[7] = ai['1~15秒'];
    //   tempArr[8] = ai['16~90秒'];
    //   tempArr[9] = ai['1.5~3分'];
    //   tempArr[10] = ai['3~5分'];
    //   tempArr[11] = ai['5~10分'];
    //   tempArr[12] = ai['>10分'];
    //   // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
    //   arr2.push(tempArr);
    //   // arr.push({
    //   //   sd: ai.sd,
    //   //   stlc: [ai.stlc],
    //   //   c: ai.c,
    //   // });
    //   map[ai.owner_ct_code] = ai;
    // } else {
    //   // for (let j = 0; j < arr.length; j++) {
    //   //   const arrItem = arr[j];
    //   //   const arrItem2 = arr2[j];
    //   //   if (arrItem.sd === ai.sd) {
    //   //     arrItem.c = arrItem2[17] = (parseInt(arrItem.c, 0) + parseInt(ai.c, 0));
    //   //     arrItem.stlc.push(ai.stlc);
    //   //     arrItem2[parseInt(ai.stlc, 0) + 1] = ai.c;
    //   //     break;
    //   //   }
    //   // }
    // }
  }
  return arr;
}
