import {createResource, defaultGlobals, initialState} from 'redux-rest-resource';
import moment from 'moment';

import myFetch from '../../helpers/fetch';
import appConfig from '../../appConfig';

const hostUrl = appConfig.rootUrl;

let dailyCountList = [];
let dailyCountItems = [];

let hourDistItems = [];
let hourDistList = [];

let callsItems = [];
let callsList = [];

let weekDistList = [];
let weekDistItems = [];

let durationList = [];
let durationItems = [];

let meetList = [];
let meetItems = [];

let inCommonList = [];
let inCommonItems = [];

let startedtimel2classList = [];
let startedtimel2classItems = [];

let startedhourclassItems = [];
let startedhourclassList = [];

let starteddayAndstartedtimel1classItems = [];
let starteddayAndstartedtimel1classList = [];

let starteddayAndstartedtimel2classItems = [];
let starteddayAndstartedtimel2classList = [];

let durationclassAndstartedtimel1classItems = [];
let durationclassAndstartedtimel1classList = [];

let durationclassAndstartedtimel2classItems = [];
let durationclassAndstartedtimel2classList = [];

let weekdayItems = [];
let weekdayList = [];

let starteddayItems = [];
let starteddayList = [];

let ownernumItems = [];
let ownernumList = [];

let ownernumanddurationclassItems = [];
let ownernumanddurationclassList = [];

let ownernumandctandstartedhourclassItems = [];
let ownernumandctandstartedhourclassList = [];

let ownernumandstartedtimel1classItems = [];
let ownernumandstartedtimel1classList = [];

let ownernumandstartedtimel2classItems = [];
let ownernumandstartedtimel2classList = [];

let ownernumandstartedhourclassItems = [];
let ownernumandstartedhourclassList = [];

let peernumItems = [];
let peernumList = [];

let peernumanddurationclassItems = [];
let peernumanddurationclassList = [];

let peernumandstartedtimel1classItems = [];
let peernumandstartedtimel1classList = [];

let peernumandstartedtimel2classItems = [];
let peernumandstartedtimel2classList = [];

let peernumandstartedhourclassItems = [];
let peernumandstartedhourclassList = [];

let ownerctcodeItems = [];
let ownerctcodeList = [];

let codeandstartedtimel1classItems = [];
let codeandstartedtimel1classList = [];

let codeandstartedhourclassItems = [];
let codeandstartedhourclassList = [];

let ownerlacItems = [];
let ownerlacList = [];

let codeandstarteddurationclassItems = [];
let codeandstarteddurationclassList = [];

Object.assign(defaultGlobals, {fetch: myFetch});

export const {types, actions, rootReducer} = createResource({
  name: 'mutual',
  url: `${hostUrl}/cases/:case_id/pbills/mutual`,
  actions: {
    fetchDailyCount: {
      method: 'POST',
      url: './daily_count',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          console.log(body.data);
          dailyCountItems = body.data;
          // dailyCountList = formatListData(dailyCountItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          // dailyCountList,
          dailyCountItems,
        };
      },
    },
    fetchCountByWeekhour: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/pbills/records/count-by-weekhour`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          hourDistItems = body.data;
          // hourDistList = formatListData(hourDistItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          // hourDistList,
          hourDistItems,
        };
      },
    },
    fetchWeekDist: {
      method: 'POST',
      url: './week_dist',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          weekDistItems = body.data;
          // weekDistList = formatListData(weekDistItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          // weekDistList,
          weekDistItems,
        };
      },
    },

    fetchMutualTravel: {
      method: 'POST',
      url: `${hostUrl}/cases/:caseId/pbills/mutual/travel`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
        };
      },
    },

    //  本方通话地
    fetchDuration: {
      method: 'POST',
      url: './duration',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          durationItems = body.data;
          // durationList = formatListData(durationItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          // durationList,
          durationItems,
        };
      },
    },
    //  对方通话地
    fetchCalls: {
      method: 'POST',
      url: './calls',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          callsItems = body.data;
          // callsList = formatListData(callsItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          callsItems,
          // callsList,
        };
      },
    },
    //  时长段
    fetchMeet: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/pbills/analyze/meets`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          meetItems = body.data;
          // meetList = formatListData(meetItems);
        }
        if (status === 'resolved') {
          state.meetLoading = false;
        } else {
          state.meetLoading = true;
        }

        return {
          ...state,
          meetItems,
          meetList,
        };
      },
    },
    //  通话时段
    fetchInCommons: {
      method: 'POST',
      url: `${hostUrl}/cases/:case_id/pbills/mutual/in_commons`,
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          inCommonItems = body.data;
          // inCommonList = formatListData(inCommonItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          inCommonItems,
          // inCommonList,
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
          startedtimel2classList = formatListData(startedtimel2classItems);
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
          startedhourclassList = formatListData(startedhourclassItems);
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
          starteddayList = formatListData(starteddayItems);
        }
        if (status === 'resolved') {
          state.isLoading = false;
        } else {
          state.isLoading = true;
        }

        return {
          ...state,
          starteddayItems,
          starteddayList,
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

    // 本方号码
    fetchOwnernum: {
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
    // 日期vs常用基站
    fetchOwnernumAndctandstartedhourclass: {
      method: 'POST',
      url: './group-by-ownernumandctandstartedhourclass',
      reduce: (state, action) => {
        const {context, body, status} = action;
        if (body && body.data) {
          ownernumandctandstartedhourclassItems = body.data;
          ownernumandctandstartedhourclassList = formatOwnernumandctandstartedhourclass(ownernumandctandstartedhourclassItems);
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
          ownerctcodeList = formatOwnerctcode(ownerctcodeItems);
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
          codeandstartedtimel1classList = formatCodeandstartedtimel1class(codeandstartedtimel1classItems);
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
          codeandstartedhourclassList = formatCodeandstartedhourclass(codeandstartedhourclassItems);
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
    clearPBStatStore: {
      isPure: true,
      reduce: (state, action) => {
        return {
          state: initialState,
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
      data.push([j, arrData[i][j]]);
    }
  }
  console.log(data);
  return data;
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
    const tempArr = new Array(12);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }
    if (!map[ai.started_day]) {
      tempArr[0] = ai.started_day;
      tempArr[1] = ai['4:30~7:30'];
      tempArr[2] = ai['7:31~11:15'];
      tempArr[3] = ai['11:16~13:30'];
      tempArr[4] = ai['13:31~17:15'];
      tempArr[5] = ai['17:16~19:00'];
      tempArr[6] = ai['19:01~20:50'];
      tempArr[7] = ai['20:51~23:59'];
      tempArr[8] = ai['0:00~5:30'];
      tempArr[9] = ai.total;
      tempArr[10] = moment(ai.ended_started_at).format('HH:mm');
      tempArr[11] = moment(ai.first_started_at).format('HH:mm');
      arr2.push(tempArr);
      map[ai.started_day] = ai;
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

function formatStarteddayAndstartedtimel2class(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array(20);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }
    if (!map[ai.started_day]) {
      tempArr[0] = ai.started_day;
      tempArr[1] = ai['4:30~6:20'];
      tempArr[2] = ai['6:21~7:10'];
      tempArr[3] = ai['7:11~7:50'];
      tempArr[4] = ai['7:51~8:25'];
      tempArr[5] = ai['8:26~11:00'];
      tempArr[6] = ai['11:01~11:30'];
      tempArr[7] = ai['11:31~12:30'];
      tempArr[8] = ai['12:31~13:20'];
      tempArr[9] = ai['13:21~14:00'];
      tempArr[10] = ai['14:01~16:50'];
      tempArr[11] = ai['16:51~17:40'];
      tempArr[12] = ai['17:41~18:50'];
      tempArr[13] = ai['18:51~20:00'];
      tempArr[14] = ai['20:01~21:50'];
      tempArr[15] = ai['21:51~23:59'];
      tempArr[16] = ai['0:00~4:29'];
      tempArr[17] = ai.total;
      tempArr[18] = moment(ai.ended_started_at).format('HH:mm');
      tempArr[19] = moment(ai.first_started_at).format('HH:mm');
      // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
      arr2.push(tempArr);
      // arr.push({
      //   sd: ai.sd,
      //   stlc: [ai.stlc],
      //   c: ai.c,
      // });
      map[ai.started_day] = ai;
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

function formatDurationclassAndstartedtimel1class(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array(9);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }
    if (!map[ai.dc]) {
      tempArr[0] = ai.dc;
      tempArr[1] = ai['4:30~7:30'];
      tempArr[2] = ai['7:31~11:15'];
      tempArr[3] = ai['11:16~13:30'];
      tempArr[4] = ai['13:31~17:15'];
      tempArr[5] = ai['17:16~19:00'];
      tempArr[6] = ai['19:01~20:50'];
      tempArr[7] = ai['20:51~23:59'];
      tempArr[8] = ai['0:00~5:30'];
      // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
      arr2.push(tempArr);
      // arr.push({
      //   duration: ai.duration,
      //   stlc: [ai.stlc],
      //   c: ai.c,
      // });
      map[ai.dc] = ai;
    } else {
      for (let j = 0; j < arr.length; j++) {
        const arrItem = arr[j];
        const arrItem2 = arr2[j];
        if (arrItem.duration === ai.duration) {
          // arrItem.c = arrItem2[17] = (parseInt(arrItem.c, 0) + parseInt(ai.c, 0));
          arrItem.stlc.push(ai.stlc);
          // arrItem2[parseInt(ai.stlc, 0) + 1] = ai.c;
          break;
        }
      }
    }
  }
  // console.log(arr2);
  return arr2;
}

function formatDurationclassAndstartedtimel2class(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array(17);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }
    if (!map[ai.dc]) {
      tempArr[0] = ai.dc;
      tempArr[1] = ai['4:30~6:20'];
      tempArr[2] = ai['6:21~7:10'];
      tempArr[3] = ai['7:11~7:50'];
      tempArr[4] = ai['7:51~8:25 '];
      tempArr[5] = ai['8:26~11:00'];
      tempArr[6] = ai['11:01~11:30'];
      tempArr[7] = ai['11:31~12:30'];
      tempArr[8] = ai['12:31~13:20'];
      tempArr[9] = ai['13:21~14:00'];
      tempArr[10] = ai['14:01~16:50'];
      tempArr[11] = ai['16:51~17:40'];
      tempArr[12] = ai['17:41~18:50'];
      tempArr[13] = ai['18:51~20:00'];
      tempArr[14] = ai['20:01~21:50'];
      tempArr[15] = ai['21:51~23:59'];
      tempArr[16] = ai['0:00~4:29'];
      // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
      arr2.push(tempArr);
      // arr.push({
      //   dc: ai.dc,
      //   stlc: [ai.stlc],
      //   c: ai.c,
      // });
      map[ai.dc] = ai;
    } else {
      for (let j = 0; j < arr.length; j++) {
        const arrItem = arr[j];
        const arrItem2 = arr2[j];
        if (arrItem.dc === ai.dc) {
          // arrItem.c = arrItem2[17] = (parseInt(arrItem.c, 0) + parseInt(ai.c, 0));
          // arrItem.stlc.push(ai.stlc);
          // arrItem2[parseInt(ai.stlc, 0) + 1] = ai.c;
          break;
        }
      }
    }
  }
  // console.log(arr2);
  return arr2;
}

function formatOwnernum(data) {
  const map = {},
    arr2 = [];
  for (let i = 0; i < data.length; i++) {
    const tempArr = new Array(19);
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }

    if (!map[ai.owner_num]) {
      tempArr[0] = ai.owner_num;
      tempArr[1] = ai['号码级别'];
      tempArr[2] = ai['关联度'];
      tempArr[3] = ai['联系人个数'];
      tempArr[4] = ai['联系次数'];
      tempArr[5] = ai['主叫'];
      tempArr[6] = ai['被叫'];
      tempArr[7] = ai['呼转'];
      tempArr[8] = ai['主短'];
      tempArr[9] = ai['被短'];
      tempArr[10] = ai.total_duration;
      tempArr[11] = ai['通话时间'];
      tempArr[12] = moment(ai.min).format('YYYY-MM-DD');
      tempArr[13] = ai['末次'];
      tempArr[14] = ai['首末相距'];
      tempArr[15] = ai['使用天数'];
      tempArr[16] = ai['未使用天数'];
      tempArr[17] = ai['详单'];
      tempArr[18] = ai['可视化'];
      arr2.push(tempArr);
      map[ai.owner_num] = ai;
    }
  }
  return arr2;
}

function formatOwnernumAnddurationclass(data) {
  const map = {},
    arr2 = [];
  for (let i = 0; i < data.length; i++) {
    const tempArr = new Array(11);
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }

    if (!map[ai.owner_num]) {
      tempArr[0] = ai.owner_num;
      tempArr[1] = ai['号码级别'];
      tempArr[2] = ai.owner_cname;
      tempArr[3] = ai['其他'];
      tempArr[4] = ai['1~15秒'];
      tempArr[5] = ai['16-90秒'];
      tempArr[6] = ai['1.5~3分'];
      tempArr[7] = ai['3~5分'];
      tempArr[8] = ai['5~10分'];
      tempArr[9] = ai['>10分'];
      tempArr[10] = ai.total;
      arr2.push(tempArr);
      map[ai.owner_num] = ai;
    }
  }
  return arr2;
}

function formatOwnernumandstartedtimel1class(data) {
  const map = {},
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array(11);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }

    if (!map[ai.owner_num]) {
      tempArr[0] = ai.owner_num;
      tempArr[1] = ai['999'];
      tempArr[2] = ai['4:30~7:30'];
      tempArr[3] = ai['7:31~11:15'];
      tempArr[4] = ai['11:16~13:30'];
      tempArr[5] = ai['13:31~17:15'];
      tempArr[6] = ai['17:16~19:00'];
      tempArr[7] = ai['19:01~20:50'];
      tempArr[8] = ai['20:51~23:59'];
      tempArr[9] = ai['0:00~5:30'];
      tempArr[10] = ai.total;
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

function formatOwnernumandctandstartedhourclass(data) {
  const map = {},
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    const tempArr = new Array(33);
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }

    if (!map[ai.owner_ct_code]) {
      tempArr[0] = ai.owner_ct_code;
      tempArr[1] = ai['出现频率'];
      tempArr[2] = ai['地图'];
      tempArr[3] = ai['基站标注'];
      tempArr[4] = ai['类型'];
      tempArr[5] = ai['名称'];
      tempArr[6] = ai.owner_num;
      tempArr[7] = ai['号码标注'];
      tempArr[8] = ai.online_days;
      tempArr[9] = ai.total;
      tempArr[10] = ai['4时'];
      tempArr[11] = ai['5时'];
      tempArr[12] = ai['6时'];
      tempArr[13] = ai['7时'];
      tempArr[14] = ai['8时'];
      tempArr[15] = ai['9时'];
      tempArr[16] = ai['10时'];
      tempArr[17] = ai['11时'];
      tempArr[18] = ai['12时'];
      tempArr[19] = ai['13时'];
      tempArr[20] = ai['14时'];
      tempArr[21] = ai['15时'];
      tempArr[22] = ai['16时'];
      tempArr[23] = ai['17时'];
      tempArr[24] = ai['18时'];
      tempArr[25] = ai['19时'];
      tempArr[26] = ai['20时'];
      tempArr[27] = ai['21时'];
      tempArr[28] = ai['22时'];
      tempArr[29] = ai['23时'];
      tempArr[30] = ai['0时'];
      tempArr[31] = ai['1时'];
      tempArr[32] = ai['2时'];
      tempArr[33] = ai['3时'];
      arr2.push(tempArr);
      // map[ai.owner_ct_code] = ai;
    }
  }
  // console.log(arr2);
  return arr2;
}


function formatOwnernumandstartedtimel2class(data) {
  const map = {},
    arr1 = [];
  for (let i = 0; i < data.length; i++) {
    const tempArr = new Array(19);
    let ai = {};
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2};
    }
    if (!map[ai.owner_num]) {
      tempArr[0] = ai.owner_num;
      tempArr[1] = ai['号码级别'];
      tempArr[2] = ai['4:30~6:20'];
      tempArr[3] = ai['6:21~7:10'];
      tempArr[4] = ai['7:11~7:50'];
      tempArr[5] = ai['7:51~8:25'];
      tempArr[6] = ai['8:26~11:00'];
      tempArr[7] = ai['11:01~11:30'];
      tempArr[8] = ai['11:31~12:30'];
      tempArr[9] = ai['12:31~13:20'];
      tempArr[10] = ai['13:21~14:00'];
      tempArr[11] = ai['14:01~16:50'];
      tempArr[12] = ai['16:51~17:40'];
      tempArr[13] = ai['17:41~18:50'];
      tempArr[14] = ai['18:51~20:00'];
      tempArr[15] = ai['20:01~21:50'];
      tempArr[16] = ai['21:51~23:59'];
      tempArr[17] = ai['0:00~4:29'];
      tempArr[18] = ai.total;
      arr1.push(tempArr);
      map[ai.owner_num] = ai;
    }
  }
  // console.log(arr1);
  return arr1;
}

function formatOwnernumandstartedhourclass(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array(27);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }

    if (!map[ai.owner_num]) {
      tempArr[0] = ai.owner_num;
      tempArr[1] = ai['号码级别'];
      tempArr[2] = ai['4时'];
      tempArr[3] = ai['5时'];
      tempArr[4] = ai['6时'];
      tempArr[5] = ai['7时'];
      tempArr[6] = ai['8时'];
      tempArr[7] = ai['9时'];
      tempArr[8] = ai['10时'];
      tempArr[9] = ai['11时'];
      tempArr[10] = ai['12时'];
      tempArr[11] = ai['13时'];
      tempArr[12] = ai['14时'];
      tempArr[13] = ai['15时'];
      tempArr[14] = ai['16时'];
      tempArr[15] = ai['17时'];
      tempArr[16] = ai['18时'];
      tempArr[17] = ai['19时'];
      tempArr[18] = ai['20时'];
      tempArr[19] = ai['21时'];
      tempArr[20] = ai['22时'];
      tempArr[21] = ai['23时'];
      tempArr[22] = ai['0时'];
      tempArr[23] = ai['1时'];
      tempArr[24] = ai['2时'];
      tempArr[25] = ai['3时'];
      tempArr[26] = ai.total;
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
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array(24);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }

    if (!map[ai.peer_num]) {
      tempArr[0] = ai.peer_num;
      tempArr[1] = ai['号码级别'];
      tempArr[2] = ai.peer_cname;
      tempArr[3] = ai['标注'];
      tempArr[4] = ai.peer_num_attr;
      tempArr[5] = ai.peer_num_isp;
      tempArr[6] = ai['关联度'];
      tempArr[7] = ai.call_count;
      tempArr[8] = ai.online_days;
      tempArr[9] = ai['短信数'];
      tempArr[10] = ai['主叫'];
      tempArr[11] = ai['<--'];
      tempArr[12] = ai['呼转'];
      tempArr[13] = ai.work_time_count;
      tempArr[14] = ai.private_time_count;
      tempArr[15] = ai.more_than_5_count;
      tempArr[16] = ai.after_21_count;
      tempArr[17] = ai.total_duration;
      tempArr[18] = ai['合计时间'];
      tempArr[19] = ai['首次通话时间'];
      tempArr[20] = ai['最后通话时间'];
      tempArr[21] = ai['详单'];
      tempArr[22] = ai.total;
      tempArr[23] = ai['可视化'];
      // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
      arr2.push(tempArr);
      // arr.push({
      //   sd: ai.sd,
      //   stlc: [ai.stlc],
      //   c: ai.c,
      // });
      map[ai.peer_num] = ai;
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
  return arr2;
}

function formatPeernumanddurationclass2(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array(11);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }
    if (!map[ai.peer_num]) {
      tempArr[0] = ai.peer_num;
      tempArr[1] = ai['号码级别'];
      tempArr[2] = ai.peer_cname;
      tempArr[3] = ai['其他'];
      tempArr[4] = ai['1~15秒'];
      tempArr[5] = ai['16-90秒'];
      tempArr[6] = ai['1.5~3分'];
      tempArr[7] = ai['3~5分'];
      tempArr[8] = ai['5~10分'];
      tempArr[9] = ai['>10分'];
      tempArr[10] = ai.total;
      // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
      arr2.push(tempArr);
      // arr.push({
      //   sd: ai.sd,
      //   stlc: [ai.stlc],
      //   c: ai.c,
      // });
      map[ai.peer_num] = ai;
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
  return arr2;
}

function formatPeernumandstartedtimel1class(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array(12);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }
    if (!map[ai.peer_num]) {
      tempArr[0] = ai.peer_num;
      tempArr[1] = ai['号码级别'];
      tempArr[2] = ai.peer_cname;
      tempArr[3] = ai['4:30~7:30'];
      tempArr[4] = ai['7:31~11:15'];
      tempArr[5] = ai['11:16~13:30'];
      tempArr[6] = ai['13:31~17:15'];
      tempArr[7] = ai['17:16~19:00'];
      tempArr[8] = ai['19:01~20:50'];
      tempArr[9] = ai['20:51~23:59'];
      tempArr[10] = ai['0:00~5:30'];
      tempArr[11] = ai.total;
      arr2.push(tempArr);
      map[ai.peer_num] = ai;
    }
  }
  return arr2;
}

function formatPeernumAndstartedtimel2class(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array(20);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }
    if (!map[ai.peer_num]) {
      tempArr[0] = ai.peer_num;
      tempArr[1] = ai['号码级别'];
      tempArr[2] = ai.peer_cname;
      tempArr[3] = ai['4:30~6:20'];
      tempArr[4] = ai['6:21~7:10'];
      tempArr[5] = ai['7:11~7:50'];
      tempArr[6] = ai['7:51~8:25'];
      tempArr[7] = ai['8:26~11:00'];
      tempArr[8] = ai['11:01~11:30'];
      tempArr[9] = ai['11:31~12:30'];
      tempArr[10] = ai['12:31~13:20'];
      tempArr[11] = ai['13:21~14:00'];
      tempArr[12] = ai['14:01~16:50'];
      tempArr[13] = ai['16:51~17:40'];
      tempArr[14] = ai['17:41~18:50'];
      tempArr[15] = ai['18:51~20:00'];
      tempArr[16] = ai['20:01~21:50'];
      tempArr[17] = ai['21:51~23:59'];
      tempArr[18] = ai['0:00~4:29'];
      tempArr[19] = ai.total;
      // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
      arr2.push(tempArr);
      // arr.push({
      //   sd: ai.sd,
      //   stlc: [ai.stlc],
      //   c: ai.c,
      // });
      map[ai.peer_num] = ai;
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

function formatPeernumandstartedhourclass(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array(27);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }
    if (!map[ai.peer_num]) {
      tempArr[0] = ai.peer_num;
      tempArr[1] = ai['号码级别'];
      tempArr[2] = ai['4时'];
      tempArr[3] = ai['5时'];
      tempArr[4] = ai['6时'];
      tempArr[5] = ai['7时'];
      tempArr[6] = ai['8时'];
      tempArr[7] = ai['9时'];
      tempArr[8] = ai['10时'];
      tempArr[9] = ai['11时'];
      tempArr[10] = ai['12时'];
      tempArr[11] = ai['13时'];
      tempArr[12] = ai['14时'];
      tempArr[13] = ai['15时'];
      tempArr[14] = ai['16时'];
      tempArr[15] = ai['17时'];
      tempArr[16] = ai['18时'];
      tempArr[17] = ai['19时'];
      tempArr[18] = ai['20时'];
      tempArr[19] = ai['21时'];
      tempArr[20] = ai['22时'];
      tempArr[21] = ai['23时'];
      tempArr[22] = ai['0时'];
      tempArr[23] = ai['1时'];
      tempArr[24] = ai['2时'];
      tempArr[25] = ai['3时'];
      tempArr[26] = ai.total;
      // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
      arr2.push(tempArr);
      // arr.push({
      //   sd: ai.sd,
      //   stlc: [ai.stlc],
      //   c: ai.c,
      // });
      map[ai.peer_num] = ai;
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

function formatOwnerctcode(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = data[i];
    const tempArr = new Array(15);
    if (!map[ai.owner_ct_code]) {
      tempArr[0] = ai.owner_ct_code;
      tempArr[1] = ai['图'];
      tempArr[2] = ai.owner_lac;
      tempArr[3] = ai.owner_ci;
      tempArr[4] = ai['代码属性'];
      tempArr[5] = ai['类型'];
      tempArr[6] = ai['名称'];
      tempArr[7] = ai['地址'];
      tempArr[8] = ai.contact_times;
      tempArr[9] = ai.online_days;
      tempArr[10] = ai.offline_days;
      tempArr[11] = moment(ai.first_started_day).format('HH:mm');
      tempArr[12] = moment(ai.ended_day).format('HH:mm');
      tempArr[13] = ai['详单'];
      tempArr[14] = ai['可视化'];
      arr2.push(tempArr);
      map[ai.owner_ct_code] = ai;
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
  console.log(arr2);
  return arr2;
}

function formatCodeandstartedtimel1class(data) {
  console.log(data);
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array(15);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }
    if (!map[ai.owner_ct_code]) {
      tempArr[0] = ai.owner_ct_code;
      tempArr[1] = ai['图'];
      tempArr[2] = ai.owner_lac;
      tempArr[3] = ai.owner_ci;
      tempArr[4] = ai['代码属性'];
      tempArr[5] = ai['类型'];
      tempArr[6] = ai['名称'];
      tempArr[7] = ai['地址'];
      tempArr[8] = ai['4:30~7:30'];
      tempArr[9] = ai['7:31~11:15'];
      tempArr[10] = ai['11:16~13:30'];
      tempArr[11] = ai['13:31~17:15'];
      tempArr[12] = ai['17:16~19:00'];
      tempArr[13] = ai['19:01~20:50'];
      tempArr[14] = ai['20:51~23:59'];
      tempArr[15] = ai['0:00~5:30'];
      tempArr[16] = ai.total;
      // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
      arr2.push(tempArr);
      // arr.push({
      //   sd: ai.sd,
      //   stlc: [ai.stlc],
      //   c: ai.c,
      // });
      map[ai.owner_ct_code] = ai;
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

function formatCodeandstartedhourclass(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array(33);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }
    if (!map[ai.owner_ct_code]) {
      tempArr[0] = ai.owner_ct_code;
      tempArr[1] = ai['图'];
      tempArr[2] = ai.owner_lac;
      tempArr[3] = ai.owner_ci;
      tempArr[4] = ai['代码属性'];
      tempArr[5] = ai['类型'];
      tempArr[6] = ai['名称'];
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
      tempArr[31] = ai.online_days;
      tempArr[32] = ai.total;
      // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
      arr2.push(tempArr);
      // arr.push({
      //   sd: ai.sd,
      //   stlc: [ai.stlc],
      //   c: ai.c,
      // });
      map[ai.owner_ct_code] = ai;
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

function formatOwnerlac(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    const ai = data[i];
    const tempArr = new Array(3);
    if (!map[ai.owner_lac]) {
      tempArr[0] = ai.owner_lac;
      tempArr[1] = ai.count;
      tempArr[2] = ai['查看'];
      // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
      arr2.push(tempArr);
      // arr.push({
      //   sd: ai.sd,
      //   stlc: [ai.stlc],
      //   c: ai.c,
      // });
      map[ai.owner_lac] = ai;
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

function formatCodeandstarteddurationclass(data) {
  const map = {},
    arr = [],
    arr2 = [];

  for (let i = 0; i < data.length; i++) {
    let ai = {};
    const tempArr = new Array(16);
    for (let j = 0; j < data[i].length; j++) {
      const a2 = data[i][j];
      ai = {...ai, ...a2}
    }
    if (!map[ai.owner_ct_code]) {
      tempArr[0] = ai.owner_ct_code;
      tempArr[1] = ai['图'];
      tempArr[2] = ai.owner_lac;
      tempArr[3] = ai.owner_ci;
      tempArr[4] = ai['代理属性'];
      tempArr[5] = ai['类型'];
      tempArr[6] = ai['名称'];
      tempArr[7] = ai['地址'];
      tempArr[8] = ai['其他'];
      tempArr[9] = ai['1~15秒'];
      tempArr[10] = ai['16~90秒'];
      tempArr[11] = ai['1.5~3分'];
      tempArr[12] = ai['3~5分'];
      tempArr[13] = ai['5~10分'];
      tempArr[14] = ai['>10分'];
      tempArr[15] = ai.total;
      // tempArr[parseInt(ai.stlc, 0) + 1] = ai.c;
      arr2.push(tempArr);
      // arr.push({
      //   sd: ai.sd,
      //   stlc: [ai.stlc],
      //   c: ai.c,
      // });
      map[ai.owner_ct_code] = ai;
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
