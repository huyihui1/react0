/**
 *  gitlab #445 相关定义
 *
 */
const advancedSearchKeys = {
  peer_num_type: '对方号码类型',
  peer_num_attr: '号码归属地',
  alyz_day: '名义日期',
  started_at: '日期时间',
  weekday: '周几',
  started_day: '实际日期',
  started_time: '时间',
  owner_lac: '位置区号',
  owner_ci: '小区号',
  started_time_l1_class: '时间类别',
  started_time_l2_class: '时间类别（详细）',
  started_hour_class: '时间类别（小时）',
  time_class: '时间性质',
  bill_type: '计费类型',
  duration: '时长',
  duration_class: '时长类别',
  comm_direction: '联系类型',
  long_dist: '长途标志',
  ven: '虚拟标志',
  owner_num_status: '通话状态',
  owner_comm_loc: '本方通话地',
  peer_comm_loc: '对方通话地',
  owner_ct_code: '本方基站',
  ciFmt: '进制',
  lacFmt: '进制',
  owner_ct_code_type: true,
  owner_ci_type: true,
  owner_lac_type: true,
  owner_loc_type: true,
  peer_loc_type: true
};
const panelSearchFields = {
  pbAnalyze: ['owner_num', 'peer_num', 'daily_rec', 'order-by'],
  connections: ['owner_num', 'show_peer_num', 'top_n', 'call_limit'],
  pbStat: ['owner_num', 'peer_num',],
  matrix: ['x_nums', 'y_nums'],
  incommons: ['owner_num', 'target_in_sets', 'rule1_num_cnt', 'rule1_ts', 'rule2_num_cnt', 'rule2_ts', 'rule3_num_cnt', 'rule3_ts', 'rule1_checkbox', 'rule2_checkbox', 'rule3_checkbox', 'offline_days'],
  calltrack: ['owner_num', 'peer_num'],
  meets: ['loc_rule', 'mutual_call', 'numA', 'numB', 'radius'],
  backupNums: ['owner_num', 'interval', 'radius', 'loc_rule'],
  mutual: ['owner_num', 'peer_num',],
  overlap: ['owner_num', 'peer_num']
};
const formConfig = [
  {
    label: '号码过滤',
  },
  {
    label: '对方号码类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择对方号码类型',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'peer_num_type',
      required: false,
      message: '请输入正确的号码类型',
    },
    dataSource: [
      {
        label: '其他',
        value: 0,
      },
      {
        label: '移动手机',
        value: 11,
      },
      {
        label: '电信手机',
        value: 21,
      },
      {
        label: '联通手机',
        value: 31,
      },
      {
        label: '固话',
        value: 61,
      },
    ],
  },
  {
    label: '号码归属地',
    component: 'Select',
    componentProps: {
      placeholder: '请输入号码归属地',
      mode: 'tag',
    },
    formBinderProps: {
      name: 'peer_num_attr',
      required: false,
      message: '请输入正确的号码归属地',
    },
    dataSource: [],
  },
  {
    label: '时间过滤',
  },
  {
    label: '名义日期',
    component: 'MultipleDateSelect',
    componentProps: {
      placeholder: '请输入名义日期',
      disabledDate: null,
      disabled: true,
    },
    formBinderProps: {
      name: 'alyz_day',
      required: false,
      message: '请输入正确的名义日期',
    },
    mode: 'RangePicker',
  },
  {
    label: '日期时间', // ???
    component: 'MultipleDateSelect',
    componentProps: {
      placeholder: '请输入日期时间',
      showTime: true,
    },
    formBinderProps: {
      name: 'started_at',
      required: false,
      message: '请输入正确的日期时间',
    },
    mode: {
      placeholder: '请输入日期时间',
      showTime: true,
    },
  },
  {
    label: '实际日期', // ???
    component: 'MultipleDateSelect',
    componentProps: {
      placeholder: '请输入实际日期',
    },
    formBinderProps: {
      name: 'started_day',
      required: false,
      message: '请输入正确的实际日期',
    },
    mode: {
      placeholder: '请输入实际日期',
      showTime: false,
    },
  },
  {
    label: '周几', // ???
    component: 'Select',
    componentProps: {
      placeholder: '请选择周几',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'weekday',
      required: false,
      message: '请输入正确的周几',
    },
    dataSource: [
      {
        label: '一',
        value: 1,
      },
      {
        label: '二',
        value: 2,
      },
      {
        label: '三',
        value: 3,
      },
      {
        label: '四',
        value: 4,
      },
      {
        label: '五',
        value: 5,
      },
      {
        label: '六',
        value: 6,
      },
      {
        label: '日',
        value: 7,
      },
    ],
  },
  {
    label: '时间', // ???
    component: 'Select',
    componentProps: {
      placeholder: '请输入时间, 例如09:00或09:00-11:30',
      mode: 'tag',
      // visible: false,
    },
    formBinderProps: {
      name: 'started_time',
      required: false,
      message: '请输入正确的时间',
    },
    dataSource: [],
  },
  {
    label: '时间类别',
    component: 'Select',
    componentProps: {
      placeholder: '请输入时间类别',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'started_time_l1_class',
      required: false,
      message: '请输入正确的时间类别',
    },
    dataSource: [
      {
        label: '早晨',
        value: 0,
      },
      {
        label: '上午',
        value: 1,
      },
      {
        label: '中午',
        value: 2,
      },
      {
        label: '下午',
        value: 3,
      },
      {
        label: '傍晚',
        value: 4,
      },
      {
        label: '晚上',
        value: 5,
      },
      {
        label: '深夜',
        value: 6,
      },
      {
        label: '凌晨',
        value: 7,
      },

    ],
  },
  {
    label: '时间类别（详细）',
    component: 'Select',
    componentProps: {
      placeholder: '请输入时间类别',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'started_time_l2_class',
      required: false,
      message: '请输入正确的时间类别',
    },
    dataSource: [
      {
        label: '4:30~6:20',
        value: 0,
      },
      {
        label: '6:21~7:10',
        value: 1,
      },
      {
        label: '7:11~7:50',
        value: 2,
      },
      {
        label: '7:51~8:25',
        value: 3,
      },
      {
        label: '8:26~11:00',
        value: 4,
      },
      {
        label: '11:01~11:30',
        value: 5,
      },
      {
        label: '11:31~12:30',
        value: 6,
      },
      {
        label: '12:31~13:20',
        value: 7,
      },
      {
        label: '13:21~14:00',
        value: 8,
      },
      {
        label: '14:01~16:50',
        value: 9,
      },
      {
        label: '16:51~17:40',
        value: 10,
      },
      {
        label: '17:41~18:50',
        value: 11,
      },
      {
        label: '18:51~20:00',
        value: 12,
      },
      {
        label: '20:01~21:50',
        value: 13,
      },
      {
        label: '21:51~23:59',
        value: 14,
      },
      {
        label: '0点~4:29',
        value: 15,
      },
    ],
  },
  {
    label: '时间类别（小时）',
    component: 'Select',
    componentProps: {
      placeholder: '请输入时间类别',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'started_hour_class',
      required: false,
      message: '请输入正确的时间类别',
    },
    dataSource: [
      {
        label: '4时',
        value: 0,
      },
      {
        label: '5时',
        value: 1,
      },
      {
        label: '6时',
        value: 2,
      },
      {
        label: '7时',
        value: 3,
      },
      {
        label: '8时',
        value: 4,
      },
      {
        label: '9时',
        value: 5,
      },
      {
        label: '10时',
        value: 6,
      },
      {
        label: '11时',
        value: 7,
      },
      {
        label: '12时',
        value: 8,
      },
      {
        label: '13时',
        value: 9,
      },
      {
        label: '14时',
        value: 10,
      },
      {
        label: '15时',
        value: 11,
      },
      {
        label: '16时',
        value: 12,
      },
      {
        label: '17时',
        value: 13,
      },
      {
        label: '18时',
        value: 14,
      },
      {
        label: '19时',
        value: 15,
      },
      {
        label: '20时',
        value: 16,
      },
      {
        label: '21时',
        value: 17,
      },
      {
        label: '22时',
        value: 18,
      },
      {
        label: '23时',
        value: 19,
      },
      {
        label: '0时',
        value: 20,
      },
      {
        label: '1时',
        value: 21,
      },
      {
        label: '2时',
        value: 22,
      },
      {
        label: '3时',
        value: 23,
      },
    ],
  },
  {
    label: '时间性质',
    component: 'Select',
    componentProps: {
      placeholder: '请选择时间性质',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'time_class',
      required: false,
      message: '请输入正确的时间性质',
    },
    dataSource: [
      {
        label: '私人时间',
        value: 0,
      },
      {
        label: '工作时间',
        value: 1,
      },
    ],
  },
  {
    label: '通话过滤',
  },
  {
    label: '计费类型',
    component: 'Select',
    componentProps: {
      placeholder: '请输入计费类型',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'bill_type',
      required: false,
      message: '请输入计费类型',
    },
    dataSource: [
      {
        label: '通话',
        value: 1,
      },
      {
        label: '短信',
        value: 2,
      },
      {
        label: '彩信',
        value: 3,
      },
    ],
  },
  {
    label: '时长',
    component: 'Select',
    componentProps: {
      placeholder: '请输入时长, 例如120或300-500',
      mode: 'tag',
    },
    formBinderProps: {
      name: 'duration',
      required: false,
      message: '请输入正确的时长',
    },
    dataSource: [],
  },
  {
    label: '时长类别',
    component: 'Select',
    componentProps: {
      placeholder: '请输入时长类别',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'duration_class',
      required: false,
      message: '请输入正确的时长类别',
    },
    dataSource: [
      {
        label: '其他',
        value: 0,
      },
      {
        label: '1~15秒',
        value: 1,
      },
      {
        label: '16~90秒',
        value: 2,
      },
      {
        label: '1.5~3分',
        value: 3,
      },
      {
        label: '3~5分',
        value: 4,
      },
      {
        label: '5~10分',
        value: 5,
      },
      {
        label: '>10分',
        value: 6,
      },
    ],
  },
  {
    label: '联系类型',
    component: 'Select',
    componentProps: {
      placeholder: '请输入联系类型',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'comm_direction',
      required: false,
      message: '请输入正确的联系类型',
    },
    dataSource: [
      {
        label: '未知',
        value: 0,
      },
      {
        label: '主叫',
        value: 11,
      },
      {
        label: '<---',
        value: 12,
      },
      {
        label: '呼转',
        value: 13,
      },
      {
        label: '主短',
        value: 21,
      },
      {
        label: '被短',
        value: 22,
      },
      {
        label: '主彩',
        value: 31,
      },
      {
        label: '被彩',
        value: 32,
      },
    ],
  },
  {
    label: '长途标志',
    component: 'Select',
    componentProps: {
      placeholder: '请选择长途标志',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'long_dist',
      required: false,
      message: '请输入正确的长途标志',
    },
    dataSource: [
      {
        label: '否',
        value: 0,
      },
      {
        label: '是',
        value: 1,
      },
    ],
  },
  {
    label: '虚拟标志',
    component: 'Select',
    componentProps: {
      placeholder: '请选择虚拟标志',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'ven',
      required: false,
      message: '请输入正确的虚拟标志',
    },
    dataSource: [
      {
        label: '否',
        value: 0,
      },
      {
        label: '是',
        value: 1,
      },
    ],
  },
  {
    label: '通话状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择通话状态',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'owner_num_status',
      required: false,
      message: '请输入正确的通话状态',
    },
    dataSource: [
      {
        label: '其他',
        value: 0,
      },
      {
        label: '本地',
        value: 1,
      },
      {
        label: '漫游',
        value: 2,
      },
    ],
  },
  {
    label: '位置过滤',
  },
  {
    label: '基站',
    component: 'Select',
    l: 24,
    componentProps: {
      placeholder: '请输入基站',
      mode: 'tag',
    },
    formBinderProps: {
      name: 'owner_ct_code',
      required: false,
      message: '请输入正确的基站',
    },
    dataSource: [],
  },
  {
    label: 'LAC', // ???
    component: 'Select',
    componentProps: {
      placeholder: '请输入位置区号',
      mode: 'tag',
    },
    formBinderProps1: {
      name: 'lacFmt',
    },
    formBinderProps: {
      name: 'owner_lac',
      required: false,
      message: '请输入正确的位置区号',
    },
    dataSource: [],
  },
  {
    label: 'CI', // ???
    component: 'Select',
    componentProps: {
      placeholder: '请输入小区号',
      mode: 'tag',
    },
    formBinderProps1: {
      name: 'ciFmt',
    },
    formBinderProps: {
      name: 'owner_ci',
      required: false,
      message: '请输入正确的小区号',
    },
    dataSource: [],
  },
  {
    label: '本方通话地',
    component: 'Select',
    componentProps: {
      placeholder: '请输入本方通话地',
      mode: 'tag',
    },
    formBinderProps: {
      name: 'owner_comm_loc',
      required: false,
      message: '请输入正确的本方通话地',
    },
    dataSource: [],
  },
  {
    label: '对方通话地',
    component: 'Select',
    componentProps: {
      placeholder: '请输入对方通话地',
      mode: 'tag',
    },
    formBinderProps: {
      name: 'peer_comm_loc',
      required: false,
      message: '请输入正确的对方通话地',
    },
    dataSource: [],
  },
];

/**
 *  返回需要回填搜索数据函数
 * @param searchConds 返回的搜索模板数据
 * @param name 需要回填的组件名称
 */
export function formatAdvancedSearch(searchConds, name) {
  const res = [];
  for (let i = 0; i < searchConds.length; i++) {
    let item = searchConds[i];
    if (typeof item.value === 'string') {
      const values = JSON.parse(item.value);
      const value = values.criteria;
      for (const key in value) {
        if (Array.isArray(value[key]) && value[key].length > 1) {
          if (value[key][0] === 'IN' || value[key][0] === 'BETWEEN' || value[key][0] === 'FUZZY' || value[key][0] === 'NOT_CONTAIN' || value[key][0] === 'NOT_IN' || value[key][0] === '=') {
            if (key === 'owner_ct_code' || key === 'owner_ci' || key === 'owner_lac') {
              if (value[key][0] === 'NOT_IN') {
                value[`${key}_type`] = '排除';
              } else {
                value[`${key}_type`] = '包含';
              }
            } else {
              value.owner_ct_code_type = '包含';
              value.owner_ci_type = '包含';
              value.owner_lac_type = '包含';
            }
            if (key === 'owner_comm_loc' || key === 'peer_comm_loc') {
              if (key === 'owner_comm_loc') {
                if (value[key][0] === 'NOT_CONTAIN') {
                  value.owner_loc_type = '排除';
                } else {
                  value.owner_loc_type = '包含';
                }
              } else if (key === 'peer_comm_loc') {
                if (value[key][0] === 'NOT_CONTAIN') {
                  value.peer_loc_type = '排除';
                } else {
                  value.peer_loc_type = '包含';
                }
              }
            } else {
              value.owner_loc_type = '包含';
              value.peer_loc_type = '包含';
            }

            value[key].shift();
            if (key === 'started_time' || key === 'duration' || key === 'alyz_day' || key === 'started_at' || key === 'started_day') {
              const temp = [];
              for (let i = 0; i < value[key][0].length; i++) {
                if ((i + 1) % 2 === 0) {
                  if (key === 'started_time' || key === 'duration') {
                    temp.push(`${value[key][0][i - 1]}-${value[key][0][i]}`);
                  } else {
                    temp.push(`${value[key][0][i - 1]}~${value[key][0][i]}`);
                  }
                }
              }
              value[key] = temp;
            } else {
              value[key] = value[key][0];
            }
          }
          formConfig.forEach(j => {
            if (j.formBinderProps && key === j.formBinderProps.name && j.dataSource) {
              if (Array.isArray(value[key])) {
                value[key].forEach((a, index) => {
                  j.dataSource.forEach(k => {
                    if (a == k.value) {
                      value[key][index] = `${k.value}-${k.label}`;
                    }
                  });
                });
              }
            }
          });
          if (value.owner_ci && !value.ciFmt) {
            value.ciFmt = '10进制';
          }
          if (value.owner_lac && !value.lacFmt) {
            value.lacFmt = '10进制';
          }
          // value.ciFmt = '16进制';
          // value.lacFmt = '16进制';
        }
      }
      if (values.view && values.view['order-by']) {
        value['order-by'] = values.view['order-by'];
      }
      if (values.adhoc) {
        for (const k in values.adhoc) {
          value[k] = values.adhoc[k];
        }
      }
      const panlSearch = {};
      for (const field in value) {
        if (advancedSearchKeys[field] || panelSearchFields[name].indexOf(field) !== -1) {
          panlSearch[field] = value[field];
        }
      }
      item.value = panlSearch;
    }
    res.push(item);
  }
  return res;
}
