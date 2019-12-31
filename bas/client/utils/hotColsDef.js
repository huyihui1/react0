import { peerAcctTagRenders } from './hotRenders';

const peernumAndstartedtimel1class = [
  {
    data: 'peer_num',
  },
  {
    data: 'peer_cname',
    renderer: 'peerNumLabelRender',
  },
  {
    data: 'tag',
    // renderer: 'peerNumTagRender',
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4:30~7:30',
    renderer: 'strikingValueRenderer',
  },
  {
    data: '7:31~11:15',
    renderer: 'strikingValueRenderer',
  },
  {
    data: '11:16~13:30',
    renderer: 'strikingValueRenderer',
  },
  {
    data: '13:31~17:15',
    renderer: 'strikingValueRenderer',
  },
  {
    data: '17:16~19:00',
    renderer: 'strikingValueRenderer',
  },
  {
    data: '19:01~20:50',
    renderer: 'strikingValueRenderer',
  }, {
    data: '20:51~23:59',
    renderer: 'strikingValueRenderer',
  }, {
    data: '0:00~4:29',
    renderer: 'strikingValueRenderer',
  },
];

const ownernum = [
  {
    data: 'owner_num',
  },
  {
    data: 'owner_cname',
    renderer: 'ownerNumLabelRender',
  },
  {
    data: 'tag',
    // renderer: 'ownerNumTagRender',
  },
  {
    data: 'num_connection',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'peer_nums_cnt'
  },
  {
    data: 'count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '主叫',
    renderer: 'drillDownRenderer'
  },
  {
    data: '<--',
    renderer: 'drillDownRenderer'
  },
  {
    data: '呼转',
    renderer: 'drillDownRenderer'
  },
  {
    data: '主短',
    renderer: 'drillDownRenderer'
  },
  {
    data: '被短',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_duration',
    renderer: 'humanizeDurationRenderer'
  },
  {
    data: 'first_day'
  },
  {
    data: 'last_day'
  },
  {
    data: 'inter_days'
  },
  {
    data: 'online_days',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'offline_days'
  }
];

const ownernumAndstartedtimel1class = [
  {
    data: 'owner_num',
  },
  {
    data: 'owner_cname',
    renderer: 'ownerNumLabelRender',
  },
  {
    data: 'tag',
    // renderer: 'ownerNumTagRender',
  },
  {
    data: '4:30~7:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7:31~11:15',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11:16~13:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13:31~17:15',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17:16~19:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '19:01~20:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20:51~23:59',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '0:00~4:29',
    renderer: 'strikingValueRenderer'
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  }
];

const ownernumAnddurationclass = [
  {
    data: 'owner_num',
  },
  {
    data: 'owner_cname',
    renderer: 'ownerNumLabelRender',
  },
  {
    data: 'tag',
    // renderer: 'ownerNumTagRender',
  },
  {
    data: '其他',
    renderer: 'drillDownRenderer'
  },
  {
    data: '1~15秒',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16~90秒',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '1.5~3分',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '3~5分',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '5~10分',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '>10分',
    renderer: 'strikingValueRenderer'
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  }
];
const ownernumAndstartedtimel2class = [
  {
    data: 'owner_num',
  },
  {
    data: 'owner_cname',
    renderer: 'ownerNumLabelRender',
  },
  {
    data: 'tag',
    // renderer: 'ownerNumTagRender',
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4:30~6:20',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '6:21~7:10',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7:11~7:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7:51~8:25',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '8:26~11:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11:01~11:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11:31~12:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '12:31~13:20',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13:21~14:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '14:01~16:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16:51~17:40',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17:41~18:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '18:51~20:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20:01~21:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '21:51~23:59',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '0:00~4:29',
    renderer: 'strikingValueRenderer'
  },
];
const ownernumAndstartedhourclass = [
  {
    data: 'owner_num',
  },
  {
    data: 'owner_cname',
    renderer: 'ownerNumLabelRender',
  },
  {
    data: 'tag',
    // renderer: 'ownerNumTagRender',
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '5时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '6时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '8时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '9时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '10时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '12时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '14时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '15时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '18时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '19时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '21时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '22时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '23时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '0时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '1时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '2时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '3时',
    renderer: 'strikingValueRenderer'
  },
];
const ownerctcode = [
  {
    data: 'owner_ct_code'
  },
  {
    data: '基站标注',
    renderer: 'codeLabelRender'
  },
  {
    data: 'owner_ct_addr'
  },
  {
    data: 'owner_lac'
  },
  {
    data: 'owner_ci'
  },
  {
    data: 'contact_times',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'online_days',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'offline_days'
  },
  {
    data: 'first_started_day',
    renderer: 'hoursAndMinutesStyleRender'
  },
  {
    data: 'ended_day',
    renderer: 'hoursAndMinutesStyleRender'
  }
];
const codeAndstartedtimel1class = [
  {
    data: 'owner_ct_code'
  },
  {
    data: '基站标注',
    renderer: 'codeLabelRender'
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'owner_ct_addr'
  },
  {
    data: 'owner_lac'
  },
  {
    data: 'owner_ci'
  },
  {
    data: '4:30~7:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7:31~11:15',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11:16~13:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13:31~17:15',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17:16~19:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '19:01~20:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20:51~23:59',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '0:00~4:29',
    renderer: 'strikingValueRenderer'
  },
];
const codeAndstartedtimel2class = [
  {
    data: 'owner_ct_code'
  },
  {
    data: '基站标注',
    renderer: 'codeLabelRender'
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'owner_ct_addr'
  },
  {
    data: 'owner_lac'
  },
  {
    data: 'owner_ci'
  },
  {
    data: '4:30~6:20',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '6:21~7:10',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7:11~7:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7:51~8:25',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '8:26~11:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11:01~11:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11:31~12:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '12:31~13:20',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13:21~14:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '14:01~16:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16:51~17:40',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17:41~18:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '18:51~20:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20:01~21:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '21:51~23:59',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '0:00~4:29',
    renderer: 'strikingValueRenderer'
  },
];
const codeAndstartedhourclass = [
  {
    data: 'owner_ct_code'
  },
  {
    data: '基站标注',
    renderer: 'codeLabelRender'
  },
  {
    data: 'online_days',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'owner_ct_addr'
  },
  {
    data: 'distributionMap',
    columnSorting: {
      headerAction: false,
    },
  },
  {
    data: '4时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '5时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '6时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '8时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '9时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '10时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '12时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '14时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '15时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '18时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '19时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '21时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '22时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '23时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '0时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '1时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '2时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '3时',
    renderer: 'strikingValueRenderer'
  },
];
const codeAndstartedhourclass2 = [
  {
    data: 'owner_ct_code'
  },
  {
    data: '基站标注',
    renderer: 'codeLabelRender'
  },
  {
    data: 'online_days',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'owner_ct_addr'
  },
  {
    data: 'distributionMap',
    columnSorting: {
      headerAction: false,
    },
  },
  {
    data: '4时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '5时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '6时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '8时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '9时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '10时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '12时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '14时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '15时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '18时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '19时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '21时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '22时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '23时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '0时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '1时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '2时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '3时',
    renderer: 'strikingValueRenderer'
  },
];
const Peernum = [
  {
    data: 'peer_num',
  },
  {
    data: 'peer_cname',
    renderer: 'peerNumLabelRender',
    columnSorting: {
      headerAction: false,
    },
  },
  {
    data: 'tag',
    // renderer: 'peerNumTagRender',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'peer_citizen_id',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'first_day'
  },
  {
    data: 'last_day'
  },
  {
    data: 'peer_num_attr'
  },
  {
    data: 'peer_num_isp'
  },
  {
    data: 'num_connection',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'call_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'online_days',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'sms_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '主叫',
    renderer: 'drillDownRenderer'
  },
  {
    data: '<--',
    renderer: 'drillDownRenderer'
  },
  {
    data: '呼转',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'work_time_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'private_time_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'more_than_5_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'after_21_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_duration',
    renderer: 'humanizeDurationRenderer'
  },
  // {
  //   data: 'total_duration',
  // },
  {
    data: '平均时长',
    renderer: 'avgCallTimeRender',
    columnSorting: {
      headerAction: false,
    },
  },
  {
    data: 'breakpoints',
    // renderer: 'caseBreakpointsRender',
    columnSorting: {
      headerAction: false,
    }
  },

];
const codeAndstarteddurationclass = [
  {
    data: 'owner_ct_code'
  },
  {
    data: '基站标注',
    renderer: 'codeLabelRender'
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'owner_ct_addr'
  },
  {
    data: 'owner_lac'
  },
  {
    data: 'owner_ci'
  },
  {
    data: '其他',
    renderer: 'drillDownRenderer'
  },
  {
    data: '1~15秒',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16~90秒',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '1.5~3分',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '3~5分',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '5~10分',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '>10分',
    renderer: 'strikingValueRenderer'
  },
];
const ownernumAndctandstartedhourclass = [
  {
    data: 'owner_ct_code'
  },
  {
    data: '出现频率'
  },
  {
    data: '基站标注',
    renderer: 'codeLabelRender'
  },
  {
    data: 'owner_num'
  },
  {
    data: 'owner_cname',
    renderer: 'ownerNumLabelRender',
  },
  {
    data: 'tag'
  },
  {
    data: 'online_days',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '5时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '6时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '8时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '9时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '10时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '12时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '14时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '15时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '18时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '19时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '21时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '22时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '23时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '0时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '1时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '2时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '3时',
    renderer: 'strikingValueRenderer'
  },
];
const OwnerLac = [
  {
    data: 'owner_lac'
  },
  {
    data: 'count',
    renderer: 'drillDownRenderer'
  }
];

const peernumAnddurationclass = [
  {
    data: 'peer_num',
  },
  {
    data: 'peer_cname',
    renderer: 'peerNumLabelRender',
  },
  {
    data: 'tag',
    // renderer: 'peerNumTagRender',
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: '其他',
    renderer: 'drillDownRenderer'
  },
  {
    data: '1~15秒',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16~90秒',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '1.5~3分',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '3~5分',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '5~10分',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '>10分',
    renderer: 'strikingValueRenderer'
  },
];
const peernumAndstartedtimel2class = [
  {
    data: 'peer_num',
  },
  {
    data: 'peer_cname',
    renderer: 'peerNumLabelRender',
  },
  {
    data: 'tag',
    // renderer: 'peerNumTagRender',
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4:30~6:20',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '6:21~7:10',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7:11~7:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7:51~8:25',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '8:26~11:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11:01~11:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11:31~12:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '12:31~13:20',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13:21~14:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '14:01~16:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16:51~17:40',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17:41~18:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '18:51~20:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20:01~21:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '21:51~23:59',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '0:00~4:29',
    renderer: 'strikingValueRenderer'
  },
];
const peernumAndstartedhourclass = [
  {
    data: 'peer_num',
  },
  {
    data: 'peer_cname',
    renderer: 'peerNumLabelRender',
  },
  {
    data: 'tag',
    // renderer: 'peerNumTagRender',
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '5时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '6时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '8时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '9时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '10时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '12时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '14时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '15时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '18时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '19时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '21时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '22时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '23时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '0时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '1时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '2时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '3时',
    renderer: 'strikingValueRenderer'
  },
];
const durationclassAndstartedtimel2class = [
  {
    data: 'duration_class'
  },
  {
    data: '0',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '1',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '2',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '3',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '4',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '5',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '6',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '8',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '9',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '10',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '12',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '14',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '15',
    renderer: 'strikingValueRenderer'
  },
];
const starteddayAndstartedtimel1class = [
  {
    data: 'started_day'
  },
  {
    data: 'label'
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'first_started_at',
    renderer: 'hoursAndMinutesStyleRender'
  },
  {
    data: 'ended_started_at',
    renderer: 'hoursAndMinutesStyleRender'
  },
  {
    data: '4:30~7:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7:31~11:15',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11:16~13:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13:31~17:15',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17:16~19:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '19:01~20:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20:51~23:59',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '0:00~4:29',
    renderer: 'strikingValueRenderer'
  },
];
const starteddayAndstartedtimel2class = [
  {
    data: 'started_day'
  },
  {
    data: 'label'
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'first_started_at',
    renderer: 'hoursAndMinutesStyleRender'
  },
  {
    data: 'ended_started_at',
    renderer: 'hoursAndMinutesStyleRender'
  },
  {
    data: '4:30~6:20',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '6:21~7:10',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7:11~7:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7:51~8:25',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '8:26~11:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11:01~11:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11:31~12:30',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '12:31~13:20',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13:21~14:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '14:01~16:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16:51~17:40',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17:41~18:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '18:51~20:00',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20:01~21:50',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '21:51~23:59',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '0:00~4:29',
    renderer: 'strikingValueRenderer'
  },
];
const related = [
  {
    data: 'owner_num'
  },
  {
    data: 'owner_cname',
    renderer: 'ownerNumLabelRender',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'tag',
    renderer: 'ownerNumTagRender',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'owner_citizen_id',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'num_connection',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'call_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'online_days',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'sms_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '主叫',
    renderer: 'drillDownRenderer'
  },
  {
    data: '<--',
    renderer: 'drillDownRenderer'
  },
  {
    data: '呼转',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'private_time_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'work_time_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'more_than_5_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'after_21_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_duration',
    renderer: 'humanizeDurationRenderer',
  },
  {
    data: '平均时长',
    renderer: 'avgCallTimeRender',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'breakpoints',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'first_day'
  },
  {
    data: 'last_day'
  },
];
const relatedWithLabel = [
  {
    data: 'owner_num'
  },
  {
    data: 'owner_cname',
    renderer: 'ownerNumLabelRender',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'tag',
    renderer: 'ownerNumTagRender',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'owner_citizen_id',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'num_connection',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'call_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'online_days',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'sms_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '主叫',
    renderer: 'drillDownRenderer'
  },
  {
    data: '<--',
    renderer: 'drillDownRenderer'
  },
  {
    data: '呼转',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'private_time_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'work_time_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'more_than_5_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'after_21_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_duration',
    renderer: 'humanizeDurationRenderer',
  },
  {
    data: '平均时长',
    renderer: 'avgCallTimeRender',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'breakpoints',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'first_day'
  },
  {
    data: 'last_day'
  },
];
const peerNumExclusionCondition = [
  {
    data: 'owner_num',
  },
  {
    data: 'peer_num'
  },
  {
    data: 'peer_cname',
    renderer: 'peerNumLabelRender',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'tag',
    renderer: 'peerNumTagRender',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'peer_citizen_id',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'peer_num_attr'
  },
  {
    data: 'num_connection',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'call_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'online_days',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'sms_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '主叫',
    renderer: 'drillDownRenderer'
  },
  {
    data: '<--',
    renderer: 'drillDownRenderer'
  },
  {
    data: '呼转',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'private_time_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'work_time_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'more_than_5_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'after_21_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_duration',
    renderer: 'humanizeDurationRenderer',
  },
  {
    data: '平均时长',
    renderer: 'avgCallTimeRender',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'breakpoints',
    columnSorting: {
      headerAction: false,
    }
  },
  {
    data: 'first_day'
  },
  {
    data: 'last_day'
  },
];
const WeekdayChart = [
  {
    data: 'weekday'
  },
  {
    data: 'count',
    renderer: 'drillDownRenderer'
  }
];
const Startedday = [
  {
    data: 'started_day'
  },
  {
    data: 'tag',
    renderer: 'eventLabelRender'
  },
  {
    data: 'count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'lunarCalendar',
    renderer: 'lunarCalendarStyleRender'
  },
  {
    data: 'weekday',
    renderer: 'weekdayStyleRender'
  },
];
const JifeileixingChart = [
  {
    data: 'bill_type'
  },
  {
    data: 'count',
    renderer: 'drillDownRenderer'
  }
];
const LianXiLeiXingChart = [
  {
    data: 'comm_direction'
  },
  {
    data: 'count',
    renderer: 'drillDownRenderer'
  }
];
const TonghuaChart = [
  {
    data: 'owner_num_status'
  },
  {
    data: 'count',
    renderer: 'drillDownRenderer'
  }
];
const Ownercommloc = [
  {
    data: 'owner_comm_loc'
  },
  {
    data: 'count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'day_count',
    renderer: 'drillDownRenderer'
  }
];
const PeercommlocChart = [
  {
    data: 'peer_comm_loc'
  },
  {
    data: 'count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'peer_num_count'
  }
];
const DurationclassChart = [
  {
    data: 'duration_class'
  },
  {
    data: 'count',
    renderer: 'drillDownRenderer'
  }
];
const Startedtimel1classChart = [
  {
    data: 'started_time_l1_class',
  },
  {
    data: 'count',
    renderer: 'drillDownRenderer'
  }
];
const Startedtimel2classChart = [
  {
    data: 'started_time_l2_class',
  },
  {
    data: 'count',
    renderer: 'drillDownRenderer'
  }
];
const StartedhourclassChart = [
  {
    data: 'started_hour_class',
  },
  {
    data: 'count',
    renderer: 'drillDownRenderer'
  }
];
const DurationclassAndstartedtimel1class = [
  {
    data: 'duration_class'
  },
  {
    data: '0',
    renderer: 'drillDownRenderer'
  },
  {
    data: '1',
    renderer: 'drillDownRenderer'
  }, {
    data: '2',
    renderer: 'drillDownRenderer'
  }, {
    data: '3',
    renderer: 'drillDownRenderer'
  }, {
    data: '4',
    renderer: 'drillDownRenderer'
  }, {
    data: '5',
    renderer: 'drillDownRenderer'
  }, {
    data: '6',
    renderer: 'drillDownRenderer'
  }, {
    data: '7',
    renderer: 'drillDownRenderer'
  },
];
const StarteddayAndandpeernum = [
  {
    data: 'started_day'
  },
  {
    data: 'owner_num',
  },
  {
    data: 'owner_cname',
    renderer: 'ownerNumLabelRender',
  },
  {
    data: 'tag'
  },
  {
    data: 'peer_num'
  },
  {
    data: 'peer_cname',
    renderer: 'peerNumLabelRender',
  },
  {
    data: 'tag',
  },
  {
    data: 'contact_times',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'memo',
    renderer: function (instance, td, row, col, prop, value, cellProperties) {
      td.innerHTML = `${value}`;
      return td
    }
  }
];
const StarteddayAndctcode = [
  {
    data: 'started_day'
  },
  {
    data: 'owner_num',
  },
  {
    data: 'owner_cname',
    renderer: 'ownerNumLabelRender',
  },
  {
    data: 'tag'
  },
  {
    data: 'owner_ct_code'
  },
  {
    data: '基站标注',
    renderer: 'codeLabelRender'
  },
  {
    data: 'contact_times',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'memo',
    renderer: function (instance, td, row, col, prop, value, cellProperties) {
      td.innerHTML = `${value}`;
      return td
    }
  }
];
const ctLableForOwnernumAndstartedhourclass = [
  {
    data: 'owner_num',
  },
  {
    data: 'owner_cname',
    renderer: 'ownerNumLabelRender',
  },
  {
    data: 'tag',
    // renderer: 'ownerNumTagRender',
  },
  {
    data: 'total',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'online_days',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'first_day'
  },
  {
    data: 'last_day'
  },
  {
    data: '4时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '5时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '6时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '8时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '9时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '10时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '12时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '14时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '15时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '18时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '19时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '21时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '22时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '23时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '0时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '1时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '2时',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '3时',
    renderer: 'strikingValueRenderer'
  },
];

//账单报表
const groupByPeeracct = [
  {
    data: 'peer_card_num'
  },
  {
    data: 'peer_bank_acct'
  },
  {
    data: 'peer_name'
  },
  {
    data: 'peer_branch_num'
  },
  {
    data: 'peer_branch'
  },
  {
    data: 'total_trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'rank_count',
  },
  {
    data: 'total_trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'amtRenderer'
  },
  {
    data: 'rank_amt'
  },
  {
    data: 'cash_in_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'cash_out_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_cash_in',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'amtRenderer'
  },
  {
    data: 'total_cash_out',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
        renderer: 'amtRenderer'
  },
  {
    data: 'private_time_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'work_time_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'amt_gt_50k_count'
  },
  {
    data: 'first_trx_datetime',
  },
  {
    data: 'last_trx_datetime',
  },
];

const groupByPeeracctandtrxamtclass = [
  {
    data: 'peer_card_num'
  },
  {
    data: 'peer_bank_acct'
  },
  {
    data: 'peer_name'
  },
  {
    data: 'peer_branch_num'
  },
  {
    data: 'peer_branch'
  },
  {
    data: 'total_trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '< 200(含)元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '200~1000元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '1000(含)~4500元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4500(含)~9000元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '9000(含)~5万元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '5万(含)~9万元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '9万(含)~50万元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '50万(含)~100万元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '>100万(含)元',
    renderer: 'drillDownRenderer'
  }
];
const groupByPeeracctandtrxtimel1class = [
  {
    data: 'peer_card_num'
  },
  {
    data: 'peer_bank_acct'
  },
  {
    data: 'peer_name'
  },
  {
    data: 'total_trx_count',
     renderer: 'drillDownRenderer'
  },
  {
    data: 'peer_branch_num'
  },
  {
    data: 'peer_branch'
  },
  {
    data: '4:30~6:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4:30~6:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '7:00~8:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '7:00~8:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '8:30-11:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '8:30-11:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '11:30~13:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '11:30~13:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '14:00~16:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '14:00~16:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '17:00~18:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '17:00~18:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '18:30~20:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '18:30~20:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '21:00~23:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '21:00~23:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '0:00~4:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '0:00~4:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  }
];

const groupByPeeracctandtrxtimel1classandhour = [
  {
    data: 'peer_card_num'
  },
  {
    data: 'peer_bank_acct'
  },
  {
    data: 'peer_name'
  },
  {
    data: 'peer_branch_num',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'peer_branch'
  },

  {
    data: '4时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '5时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '5时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '6时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '6时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '7时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '7时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '8时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '8时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '9时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '9时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '10时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '10时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '11时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '11时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '12时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '12时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '13时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '13时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '14时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '14时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '15时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '15时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '16时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '16时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '17时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '17时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '18时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '18时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '19时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '19时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '20时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '20时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '21时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '21时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '22时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '22时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '23时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '23时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '0时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '0时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '1时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '1时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '2时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '2时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '3时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '3时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
];

const groupByOwneracct = [
  {
    data: 'owner_card_num'
  },
  {
    data: 'owner_bank_acct',
  },
  {
    data: 'owner_name'
  },
  {
    data: 'trx_branch_num'
  },
  {
    data: 'trx_branch'
  },
  {
    data: 'first_trx_datetime',
  },
  {
    data: 'last_trx_datetime',
  },
  {
    data: 'inter_days'
  },
  {
    data: 'peer_acct_count'
  },
  {
    data: 'total_trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'cash_in_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'cash_out_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_cash_in',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_cash_out',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  }
];

const groupByOwneracctandtrxamtclass = [
  {
    data: 'owner_card_num'
  },
  {
    data: 'owner_bank_acct',
  },
  {
    data: 'owner_name'
  },
  {
    data: 'total_trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'trx_branch_num'
  },
  {
    data: 'trx_branch'
  },
  {
    data: '< 200(含)元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '200~1000元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '1000(含)~4500元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4500(含)~9000元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '9000(含)~5万元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '5万(含)~9万元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '9万(含)~50万元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '50万(含)~100万元',
    renderer: 'drillDownRenderer'
  },
  {
    data: '>100万(含)元',
    renderer: 'drillDownRenderer'
  }
];

const groupByOwneracctandtrxtimel1class = [
  {
    data: 'owner_card_num'
  },
  {
    data: 'owner_bank_acct',
  },
  {
    data: 'owner_name'
  },
  {
    data: 'total_trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'trx_branch_num'
  },
  {
    data: 'trx_branch'
  },

  {
    data: '4:30~6:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4:30~6:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '7:00~8:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '7:00~8:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '8:30-11:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '8:30-11:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '11:30~13:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '11:30~13:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '14:00~16:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '14:00~16:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '17:00~18:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '17:00~18:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '18:30~20:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '18:30~20:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '21:00~23:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '21:00~23:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '0:00~4:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '0:00~4:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  }
];

const groupByDigest = [
  {
    data: 'digest',
  },
  {
    data: 'cash_in_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'cash_out_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'

  }
]

const groupByBranchnum = [
  {
    data: 'trx_branch_num'
  },
  {
    data: 'trx_branch'
  },
  {
    data: 'total_trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'amtRenderer'
  },
  {
    data: 'cash_in_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'cash_out_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_cash_in',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'amtRenderer'

  },
  {
    data: 'total_cash_out',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'amtRenderer'

  },
  {
    data: 'first_trx_datetime'
  },
  {
    data: 'last_trx_datetime'
  },
]

const groupByTeller = [
  {
    data: 'teller_code'
  },
  {
    data: 'trx_branch_num'
  },
  {
    data: 'trx_branch'
  },
  {
    data: 'total_trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'amtRenderer'
  },
  {
    data: 'cash_in_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'cash_out_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_cash_in',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_cash_out',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: 'first_trx_datetime'
  },
  {
    data: 'last_trx_datetime'
  },
]

const groupByBranchNumAndHour = [
  {
    data: 'trx_branch_num'
  },
  {
    data: 'trx_branch'
  },
  {
    data: 'total_trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'amtRenderer'
  },
  {
    data: '4时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '5时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '5时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '6时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '6时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '7时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '7时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '8时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '8时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '9时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '9时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '10时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '10时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '11时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '11时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'

    // renderer: 'strikingValueRenderer'
  },
  {
    data: '12时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '12时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'

    // renderer: 'strikingValueRenderer'
  },
  {
    data: '13时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '13时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '14时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '14时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '15时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '15时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '16时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '16时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '17时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '17时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '18时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '18时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '19时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '19时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '20时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '20时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '21时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '21时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '22时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '22时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '23时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '23时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '0时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '0时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '1时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '1时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '2时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '2时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '3时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '3时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
]

const branchNumAndTimeL1 = [
  {
    data: 'trx_branch_num'
  },
  {
    data: 'trx_branch'
  },
  {
    data: 'total_trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'amtRenderer'
  },
  {
    data: '4:30~6:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4:30~6:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '7:00~8:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '7:00~8:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '8:30-11:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '8:30-11:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '11:30~13:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '11:30~13:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '14:00~16:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '14:00~16:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '17:00~18:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '17:00~18:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '18:30~20:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '18:30~20:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '21:00~23:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '21:00~23:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '0:00~4:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '0:00~4:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  }
]

const tellerandtimel1 = [
  {
    data: 'teller_code'
  },
  {
    data: 'trx_branch_num'
  },
  {
    data: 'trx_branch'
  },
  {
    data: 'total_trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'amtRenderer'
  },
  {
    data: 'cash_in_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'cash_out_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_cash_in',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_cash_out',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '4:30~6:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4:30~6:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '7:00~8:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '7:00~8:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '8:30-11:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '8:30-11:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '11:30~13:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '11:30~13:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '14:00~16:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '14:00~16:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '17:00~18:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '17:00~18:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '18:30~20:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '18:30~20:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '21:00~23:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '21:00~23:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '0:00~4:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '0:00~4:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  }
]

const tellerandhour = [
  {
    data: 'teller_code'
  },
  {
    data: 'trx_branch_num'
  },
  {
    data: 'trx_branch'
  },
  {
    data: 'total_trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'amtRenderer'
  },
  {
    data: 'cash_in_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'cash_out_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_cash_in',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_cash_out',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '4时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '5时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '5时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '6时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '6时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '7时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '7时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '8时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '8时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '9时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '9时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '10时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '10时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '11时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '11时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'

    // renderer: 'strikingValueRenderer'
  },
  {
    data: '12时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '12时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'

    // renderer: 'strikingValueRenderer'
  },
  {
    data: '13时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '13时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '14时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '14时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '15时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '15时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '16时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '16时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '17时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '17时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '18时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '18时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '19时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '19时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '20时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '20时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '21时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '21时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '22时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '22时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '23时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '23时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '0时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '0时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '1时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '1时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '2时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '2时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
  {
    data: '3时#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '3时#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
    // renderer: 'strikingValueRenderer'
  },
]

const groupByTrxTimeL1Class = [
  {
    data: 'ttl1',
  },
  {
    data: 'trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_tax_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'amtRenderer'
  },
]

const trxHourClass = [
  {
    data: 'thc',
  },
  {
    data: 'trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_tax_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'amtRenderer'
  },
]

const trxday = [
  {
    data: 'trx_day'
  },
  {
    data: 'trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: 'weekday',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'weekday',
    renderer: 'lunarCalendarStyleRender'
  },
]

const groupByTrxDayAndTimeL1 = [
  {
    data: 'trx_day'
  },
  {
    data: 'total_trx_count'
  },
  {
    data: 'total_trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '4:30~6:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4:30~6:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '7:00~8:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '7:00~8:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '8:30-11:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '8:30-11:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '11:30~13:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '11:30~13:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '14:00~16:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '14:00~16:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '17:00~18:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '17:00~18:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '18:30~20:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '18:30~20:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '21:00~23:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '21:00~23:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '0:00~4:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '0:00~4:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  }
]

const trxamtclassandtrxtimel1class = [
  {
    data: 'duration_class',
  },
  {
    data: '4:30~6:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '4:30~6:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '7:00~8:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '7:00~8:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '8:30-11:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '8:30-11:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '11:30~13:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '11:30~13:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '14:00~16:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '14:00~16:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '17:00~18:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '17:00~18:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '18:30~20:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '18:30~20:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '21:00~23:59#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '21:00~23:59#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  },
  {
    data: '0:00~4:29#trx_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '0:00~4:29#trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'drillDownRenderer'
  }
]

const groupByWeekday = [
  {
    data: 'weekday',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'trx_count'
  },
  {
    data: 'total_trx_amt',
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00'
    },
    allowEmpty: false,
    renderer: 'amtRenderer'
  },
]

const relatedOwners = [
  {
    data: 'owner_bank_acct',
  },
  {
    data: 'label',
    renderer: 'ownerAcctLabelRender'
  },
  {
    data: 'ptags',
    renderer: 'ownerAcctTagRenders'
  },
  {
    data: 'cash_in_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'cash_out_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: '现存',
    renderer: 'drillDownRenderer'
  },
  {
    data: '现取',
    renderer: 'drillDownRenderer'
  },
  {
    data: '转存',
    renderer: 'drillDownRenderer'
  },
  {
    data: '转取',
    renderer: 'drillDownRenderer'
  },
  {
    data: '其他',
    renderer: 'drillDownRenderer'
  },
  {
    data: '现场',
    renderer: 'drillDownRenderer'
  },
  {
    data: '网络',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'mint_threshold_cash_in_count',
  },
  {
    data: 'total_mint_threshold_cash_in',
  },
  {
    data: 'mint_threshold_cash_out_count',
  },
  {
    data: 'total_mint_threshold_cash_out',
  },
  {
    data: 'first_trx_datetime',
  },
  {
    data: 'last_trx_datetime',
  },
]
const peers = [
  {
    data: 'peer_bank_acct',
  },
  {
    data: 'peer_card_num',
  },
  {
    data: 'label',
    renderer: 'peerAcctLabelRender'
  },
  {
    data: 'ptags',
    renderer: 'peerAcctTagRenders'
  },
  {
    data: 'cash_in_count',
  },
  {
    data: 'cash_out_count',
  },
  {
    data: '现存',
    renderer: 'drillDownRenderer'
  },
  {
    data: '现取',
    renderer: 'drillDownRenderer'
  },
  {
    data: '转存',
    renderer: 'drillDownRenderer'
  },
  {
    data: '转取',
    renderer: 'drillDownRenderer'
  },
  {
    data: '其他',
    renderer: 'drillDownRenderer'
  },
  {
    data: '现场',
    renderer: 'drillDownRenderer'
  },
  {
    data: '网络',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'mint_threshold_cash_in_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_mint_threshold_cash_in',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'mint_threshold_cash_out_count',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'total_mint_threshold_cash_out',
    renderer: 'drillDownRenderer'
  },
  {
    data: 'first_trx_datetime',
  },
  {
    data: 'last_trx_datetime',
  },
]

const tellerandtimel1Label = [
  {
    data: 'trx_branch_num',
  },
  {
    data: 'teller_code',
  },
  {
    data: 'trx_branch',
  },
  {
    data: '24小时分布图',
  },
  {
    data: '0时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '1时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '2时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '3时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '4时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '5时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '6时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '7时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '8时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '9时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '10时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '11时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '12时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '13时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '14时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '15时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '16时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '17时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '18时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '19时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '20时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '21时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '22时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  {
    data: '23时#trx_amt',
    renderer: 'strikingValueRenderer'
  },
  
]


const columns = {
  peernumAndstartedtimel1class,
  ownernum,
  ownernumAndstartedtimel1class,
  ownernumAnddurationclass,
  ownernumAndstartedtimel2class,
  ownernumAndstartedhourclass,
  ownerctcode,
  OwnerLac,
  codeAndstartedtimel1class,
  codeAndstartedtimel2class,
  codeAndstartedhourclass,
  codeAndstartedhourclass2,
  codeAndstarteddurationclass,
  ownernumAndctandstartedhourclass,
  Peernum,
  peernumAnddurationclass,
  peernumAndstartedtimel2class,
  peernumAndstartedhourclass,
  durationclassAndstartedtimel2class,
  starteddayAndstartedtimel1class,
  starteddayAndstartedtimel2class,
  related,
  relatedWithLabel,
  peerNumExclusionCondition,
  WeekdayChart,
  Startedday,
  JifeileixingChart,
  LianXiLeiXingChart,
  TonghuaChart,
  Ownercommloc,
  PeercommlocChart,
  DurationclassChart,
  Startedtimel1classChart,
  Startedtimel2classChart,
  StartedhourclassChart,
  DurationclassAndstartedtimel1class,
  StarteddayAndandpeernum,
  StarteddayAndctcode,
  ctLableForOwnernumAndstartedhourclass,

  //账单报表
  groupByPeeracct,
  groupByPeeracctandtrxamtclass,
  groupByPeeracctandtrxtimel1class,

  groupByPeeracctandtrxtimel1classandhour,

  groupByOwneracct,
  groupByOwneracctandtrxamtclass,
  groupByOwneracctandtrxtimel1class,
  groupByDigest,
  groupByBranchnum,
  groupByTeller,
  groupByBranchNumAndHour,
  groupByTrxTimeL1Class,
  trxHourClass,
  branchNumAndTimeL1,
  tellerandtimel1,
  tellerandhour,
  trxday,
  groupByTrxDayAndTimeL1,
  trxamtclassandtrxtimel1class,
  groupByWeekday,
  relatedOwners,
  peers,
  tellerandtimel1Label
};

export default columns
