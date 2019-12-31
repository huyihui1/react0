import ajaxs from './ajax';
import ICBC from '../pages/bbills/common/img/icbc.svg';
import CCB from '../pages/bbills/common/img/ccb.svg';
import ABC from '../pages/bbills/common/img/abc.svg';

/**
 *
 * @param val 需要转换的数据
 * @param opt 自定义请求参数
 * @returns {{criteria: {}, view: {'order-by': string}, adhoc: {limit: number, page: number}}}
 */
export function formatFormData(val, opt, bool = false) {
  console.log(val)
  const v = JSON.parse(JSON.stringify(val));
  let params = {
    criteria: {},
    view: {
      'order-by': 'trx_full_time',
    },
    adhoc: {
      limit: 500,
      page: 1,
    },

  };
  if (opt) {
    params = { ...params, ...opt };
  }
  for (const key in v) {
    if (key === 'order-by') {
      params.view['order-by'] = v[key];
    }
    if (Array.isArray(v[key])) {
      if (v[key].length > 0) {
        if (key === 'peer_bank_name' || key === 'peer_card_loc' || key === 'digest' || key === 'memo' || key === 'trx_branch') {
          v[key] = ['FUZZY', v[key]];
        } else if (key === 'trx_day' || key === 'trx_full_time') {
          if (bool) {
            v[key] = ['BETWEEN', v[key]];
          } else {
            const arr = [];
            v[key].forEach(item => {
              arr.push(item.split('~')[0]);
              arr.push(item.split('~')[1]);
            });
            v[key] = ['BETWEEN', arr];
          }
        } else if (key === 'trx_time' || key === 'trx_amt' || key === 'bls') {
          if (bool) {
            v[key] = ['BETWEEN', v[key]];
          } else {
            const arr = [];
            v[key].forEach(item => {
              if (item.split('-')[1]) {
                arr.push(item.split('-')[0]);
                arr.push(item.split('-')[1]);
              } else {
                if (key !== 'trx_time') {
                  if (item.indexOf('>=') !== -1) {
                    arr.push(item.replace(/>=|>/g, ''));
                    arr.push(null);
                    return;
                  } else if (item.indexOf('>') !== -1) {
                    arr.push(item.replace(/>=|>/g, '') * 1 + 0.01);
                    arr.push(null);
                    return;
                  }
                }
                arr.push(item.split('-')[0]);
                arr.push(item.split('-')[0]);
              }
            });
            v[key] = ['BETWEEN', arr];
          }
        } else if (key === 'trx_amt_round') {
          v[key] = ['IN', v[key]];
        } else {
          v[key] = ['IN', v[key]];
        }
      } else {
        delete v[key];
      }
    } else {

    }
  }
  delete v['order-by'];
  params.criteria = v;
  console.log(params);

  return params;
}

export function moreScreenData(values) {
  values = JSON.parse(JSON.stringify(values));
  const keyData = {
    trx_direction: '存取状态',
    trx_class: '交易类型',
    trx_amt: '交易金额',
    trx_amt_class: '金额分类',
    peer_bank_name: '对方账号所属银行',
    peer_card_loc: '对方银行归属地',
    trx_day: '交易日期',
    trx_full_time: '交易日期时间',
    weekday: '周几',
    eml_month: '上中下旬',
    trx_time_l1_class: '时间类别',
    trx_hour_class: '时间类别(小时)',
    time_class: '时间性质',
    trx_time: '时间',
    currency: '交易币种',
    bls: '余额',
    digest: '摘要',
    memo: '备注',
    trx_channel: '交易渠道',
    same_branch: '是否跨行',
    same_city: '交易区域',
    same_ppl: '交易对手',
    trx_branch_num: '交易机构号',
    trx_branch: '交易机构名称',
    dealer_code: '交易柜员号',
    trx_amt_round: '交易额是否为整数',
    owner_card_num: '本方卡号',
    owner_bank_acct: '本方账户',
    owner_name: '本方户名',
    peer_card_num: '对方卡号',
    peer_bank_acct: '对方账号',
    peer_name: '对方户名',
  };

  const valueData = {
    trx_direction: { 1: '存', '-1': '取' },
    trx_class: { 1: '现存', 2: '现取', 3: '转存', 4: '转取', 9: '其他' },
    trx_amt_class: {
      1: '< 200(含)元',
      2: '200~1000元',
      3: '1000(含)~4500元',
      4: '4500(含)~9000元',
      5: '9000(含)~5万元',
      6: '5万(含)~9万元',
      7: '9万(含)~50万元',
      8: '50万(含)~100万元',
      9: '>100万元(含)',
    },
    weekday: { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '日' },
    eml_month: { 1: '上旬', 2: '中旬', 3: '下旬' },
    trx_time_l1_class: {
      0: '4:30~6:59',
      1: '7:00~8:29',
      2: '8:30-11:29',
      3: '11:30~13:59',
      4: '14:00~16:59',
      5: '17:00~18:29',
      6: '18:30~20:59',
      7: '21:00~23:59',
      8: '0:00~4:29',
    },
    trx_hour_class: {
      0: '4时',
      1: '5时',
      2: '6时',
      3: '7时',
      4: '8时',
      5: '9时',
      6: '10时',
      7: '11时',
      8: '12时',
      9: '13时',
      10: '14时',
      11: '15时',
      12: '16时',
      13: '17时',
      14: '18时',
      15: '19时',
      16: '20时',
      17: '21时',
      18: '22时',
      19: '23时',
      20: '0时',
      21: '1时',
      22: '2时',
      23: '3时',
    },
    time_class: { 0: '私人时间', 1: '工作时间' },
    currency:  {},
    trx_channel: { 1: '现场', 2: '网络', 3: '未知' },
    same_branch: { 1: '本行', 2: '跨行', 3: '未知' },
    same_city: { 1: '本地', 2: '外地', 3: '未知' },
    same_ppl: { 1: '本人', 2: '他人', 3: '未知' },
    trx_amt_round: { 0: '否', 1: '是' },
  };


  const v = [];
  for (const key in values) {
    const arr = [];
    if (valueData[key] && keyData[key]) {
      arr[0] = keyData[key];
      const str = [];
      if (typeof values[key] === 'object') {
        values[key].forEach(items => {
          if (key === 'currency') {
            let k = window.currencies;
            if (k) {
              str.push(k[items])
            } else {
              str.push('人民币')
            }
          } else {
            str.push(valueData[key][items]);
          }
        });
        arr[1] = str.join(',  ');
      } else {
        if (key === 'currency') {
          arr[1] = '人民币'
        } else {
          arr[1] = valueData[key][values[key]];
        }
      }
      v.push(arr);
    } else if (keyData[key]) {
      if (key === 'trx_amt' || key === 'bls') {
        values[key].forEach((n, idx) => {
          const t = n.split('-');
          t.forEach((item, index) => {
            t[index] = formatMoney(item);
          });
          values[key][idx] = t.join('-');
        });
      }
      if (key === 'peer_card_num') {
        const idx = values[key].indexOf('');
        if (idx !== -1) {
          values[key][idx] = '无卡号';
        }
      }
      if (key === 'peer_bank_acct') {
        const idx = values[key].indexOf('');
        if (idx !== -1) {
          values[key][idx] = '无账号';
        }
      }
      arr[0] = keyData[key];
      arr[1] = values[key].join(',  ');
      v.push(arr);
    }
  }
  return v;
}


// 格式周几函数
export function formatWeekDay(week) {
  if (week === 1) {
    return '一';
  } else if (week === 2) {
    return '二';
  } else if (week === 3) {
    return '三';
  } else if (week === 4) {
    return '四';
  } else if (week === 5) {
    return '五';
  } else if (week === 6) {
    return '六';
  } else if (week === 7) {
    return '日';
  }
}

// 格式交易类型
export function formatTrxClass(val) {
  if (val === 1) {
    return '现存';
  } else if (val === 2) {
    return '现取';
  } else if (val === 3) {
    return '转存';
  } else if (val === 4) {
    return '转取';
  } else if (val === 9) {
    return '其他';
  }
  return '';
}

// 格式渠道函数

export function formattrxChannel(val) {
  if (val === 1) {
    return '现场';
  } else if (val === 2) {
    return '网络';
  } else if (val === 3) {
    return '未知';
  }
  return '';
}

// 格式交易区域函数

export function formatSameCity(val) {
  if (val === 1) {
    return '本地';
  } else if (val === 2) {
    return '外地';
  } else if (val === 3) {
    return '未知';
  }
  return '';
}

// 根据起始日期和结束日期生成中间所有日期函数

const formatTime = (time) => {
  let ymd = '';
  const mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : (`0${time.getMonth() + 1}`);
  const day = time.getDate() >= 10 ? time.getDate() : (`0${time.getDate()}`);
  ymd += `${time.getFullYear()}-`; // 获取年份。
  ymd += `${mouth}-`; // 获取月份。
  ymd += day; // 获取日。
  return ymd; // 返回日期。
};

export const getAllDate = (start, end) => {
  const dateArr = [];
  const startArr = start.split('-');
  const endArr = end.split('-');
  const db = new Date();
  db.setUTCFullYear(startArr[0], startArr[1] - 1, startArr[2]);
  const de = new Date();
  de.setUTCFullYear(endArr[0], endArr[1] - 1, endArr[2]);
  const unixDb = db.getTime();
  const unixDe = de.getTime();
  let stamp;
  const oneDay = 24 * 60 * 60 * 1000;
  for (stamp = unixDb; stamp <= unixDe;) {
    dateArr.push(formatTime(new Date(parseInt(stamp))));
    stamp += oneDay;
  }
  return dateArr;
};

// 获取起始日期结束日期中间所有月
export const getMonthAll = (begin, end) => {
  console.log(begin, end);
  const d1 = begin;
  const d2 = end;
  const dateArry = new Array();
  const s1 = d1.split('-');
  const s2 = d2.split('-');
  let mCount = 0;
  if (parseInt(s1[0]) < parseInt(s2[0])) {
    mCount = (parseInt(s2[0]) - parseInt(s1[0])) * 12 + parseInt(s2[1]) - parseInt(s1[1]) + 1;
  } else {
    mCount = parseInt(s2[1]) - parseInt(s1[1]) + 1;
  }
  if (mCount > 0) {
    let startM = parseInt(s1[1]);
    let startY = parseInt(s1[0]);
    for (let i = 0; i < mCount; i++) {
      if (startM < 12) {
        dateArry[i] = `${startY}-${startM > 9 ? startM : `0${startM}`}`;
        startM += 1;
      } else {
        dateArry[i] = `${startY}-${startM > 9 ? startM : `0${startM}`}`;
        startM = 1;
        startY += 1;
      }
    }
  }
  return dateArry;
};

// 获取起始日期结束日期中间所有季度

export const getQuarterAll = (begin, end) => {
  const dateArry = [];

  for (let i = begin * 1; i <= end * 1; i++) {
    for (let j = 0; j < 4; j++) {
      dateArry.push(`${i}/${j + 1}季`);
    }
  }
  return dateArry;
};
function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(+d);
  d.setHours(0, 0, 0);
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  // Get first day of year
  const yearStart = new Date(d.getFullYear(), 0, 1);
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  // Return array of year and week number
  return [d.getFullYear(), weekNo];
}

function weeksInYear(year) {
  let month = 11,
    day = 31,
    week;

  // Find week that 31 Dec is in. If is first week, reduce date until
  // get previous week.
  do {
    const d = new Date(year, month, day--);
    week = getWeekNumber(d)[1];
  } while (week == 1);

  return week;
}


export function getWeeks(start, end) {
  const dateArry = [];
  for (let i = start * 1; i <= end * 1; i++) {
    const weekCount = weeksInYear(i);
    for (let j = 1; j <= weekCount; j++) {
      dateArry.push(`${i}/${j}周`);
    }
  }
  return dateArry;
}

// 日期排序函数

export const formatDateSort = (arr) => {
  arr.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  return arr;
};

// 获取 户名 函数
export const getName = async (url) => {
  const res = await ajaxs.get(url);
  if (res.meta.success) {
    const result = [];
    res.data.forEach(name => {
      result.push({
        label: name.owner_name,
        value: name.owner_name,
      });
    });

    return result;
  }
  return false;
};

export const formatCardType = (type) => {
  type *= 1;
  switch (type) {
    case 1:
      return '借';
    case 2:
      return '贷';
    case 3:
      return '准';
    case 4:
      return '预';
    default:
      return '';
  }
};
export const formatCardTypeFull = (type) => {
  type *= 1;
  switch (type) {
    case 1:
      return '借记卡';
    case 2:
      return '贷记卡';
    case 3:
      return '准贷记卡';
    case 4:
      return '预付费卡';
    default:
      return '';
  }
};

export const formatBankName = (bankCode) => {
  bankCode = bankCode.toUpperCase()
  switch (bankCode) {
    case 'ICBC':
      return ICBC;
      break;
    case 'CCB':
      return CCB;
      break;
    case 'ABC':
      return ABC;
      break;
    default:
      return '';
  }
};

export const formatMoney = (num) => {
  let t = '';
  if (num || num == 0) {
    if ((`${num}`).indexOf('>=') !== -1) {
      num = num.replace(/^>=|>/g, '');
      t = '>=';
    } else if ((`${num}`).indexOf('>') !== -1) {
      num = num.replace(/^>=|>/g, '');
      t = '>';
    }
    if (isNaN(num)) {
      console.log('金额中含有不能识别的字符');
      return;
    }
    num = typeof num === 'string' ? parseFloat(num) : num;// 判断是否是字符串如果是字符串转成数字
    num = num.toFixed(2);// 保留两位
    num = parseFloat(num);// 转成数字
    num = num.toLocaleString();// 转成金额显示模式
    // 判断是否有小数
    if (num.indexOf('.') == -1) {
      num += '.00';
    } else {
      num = num.split('.')[1].length < 2 ? `${num}0` : num;
    }
    return t + num;
  }
  return num = null;
};
