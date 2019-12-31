// import d3 from 'd3-time';
// import _ from 'lodash';
const d3 = require('d3-time');
const _ = require('lodash');
const moment = require('moment');

/**
 *
 * @param data 需要的填充数据
 * @param range 日期范围 , {start: Date, end: Date}
 * @param opt 需要对比的数据属性 {key: String, value: String}
 * @returns {{dateArr: Array, values: *}} // dateArr 范围内日期天数数组, values 数据填充完的数组
 */
export function dayMissingAsZero(data, range, opt) {
  data = JSON.parse(JSON.stringify(data));
  const _range = d3.utcDays(moment(range.start), moment(range.end).add(1, 'days'), 1);
  const dateArr = [];
  const newData = _range.map((dayIdx) => {
    const day = moment(dayIdx).format('YYYY-MM-DD');
    dateArr.push(day);
    const res = _.find(data, (d) => {
      d.value = d[opt.value];
      return d[opt.key] === day;
    });
    if (res) {
      return res;
    }
    return {
      date: moment(dayIdx).format('YYYY-MM-DD'),
      value: 0,
    };
  });
  return {
    dateArr,
    values: newData,
  };
}

export function quarterMissingAsZero(data, range, opt, bool = false) {
  data = JSON.parse(JSON.stringify(data));
  const _range = d3.utcYears(moment(`${range.start}`), moment(`${range.end}`).add(1, 'years'), 1);
  const dateArr = [];
  let preval = 0;
  _range.forEach(y => {
    for (let j = 0; j < 4; j++) {
      dateArr.push(`${moment(y).format('YYYY')}/${j + 1}季`);
    }
  });
  const newData = dateArr.map((dayIdx) => {
    const res = _.find(data, (d) => {
      d.value = d[opt.value];
      return `${d[opt.key[0]]}/${d[opt.key[1]]}季` === dayIdx;
    });
    if (res) {
      if (bool) {
        preval = res.value;
      }
      return res;
    }
    return {
      date: dayIdx,
      value: preval,
    };
  });
  return {
    dateArr,
    values: newData,
  };
}

export function monthMissingAsZero(data, range, opt, bool = false) {
  data = JSON.parse(JSON.stringify(data));
  const _range = d3.timeMonths(moment(range.start), moment(range.end).add(1, 'months'), 1);
  const dateArr = [];
  let preval = 0;
  const newData = _range.map((dayIdx) => {
    const month = moment(dayIdx).format('YYYY-MM');
    dateArr.push(month);
    const res = _.find(data, (d) => {
      d.value = d[opt.value];
      return moment(`${d[opt.key[0]]}-${d[opt.key[1]]}`).format('YYYY-MM') === month;
    });
    if (res) {
      if (bool) {
        preval = res.value;
      }
      return res;
    }
    return {
      date: moment(dayIdx).format('YYYY-MM'),
      value: preval,
    };
  });
  return {
    dateArr,
    values: newData,
  };
}
// 旬数据补充函数
export function tenDaysMissingAsZero(data, range, opt, bool = false) {
  data = JSON.parse(JSON.stringify(data));
  const _range = d3.timeMonths(moment(range.start), moment(range.end).add(1, 'months'), 1);
  const dateArr = [];
  let preval = 0;
  _range.forEach((dayIdx) => {
    const month = moment(dayIdx)
      .format('YYYY-MM');
    for (let i = 1; i <= 3; i++) {
      let temp = '上旬';
      if (i === 2) {
        temp = '中旬'
      } else if (i === 3) {
        temp = '下旬'
      }
      dateArr.push(`${month}-${temp}`);
    }
  })
  const newData = dateArr.map((dayIdx) => {
    const res = _.find(data, (d) => {
      d.value = d[opt.value];
      let temp = '上旬';
      if (d[opt.key[2]] === 2) {
        temp = '中旬'
      } else if (d[opt.key[2]] === 3) {
        temp = '下旬'
      }
      return `${d[opt.key[0]]}-${d[opt.key[1]] < 10 ? '0' + d[opt.key[1]] : d[opt.key[1]]}-${temp}` === dayIdx;
    });
    if (res) {
      if (bool) {
        preval = res.value;
      }
      return res;
    }
    return {
      date: dayIdx,
      value: preval,
    };
  });
  return {
    dateArr,
    values: newData,
  };
}

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
    let d = new Date(year, month, day--);
    week = getWeekNumber(d)[1];
  } while (week == 1);

  return week;
}


 function getWeeks(start, end) {
  const dateArry = [];
  for (let i = start * 1; i <= end * 1; i++) {
    let weekCount = weeksInYear(i)
    for (let j = 1; j <= weekCount; j++) {
      dateArry.push(`${i}/${j}周`);
    }
  }
  return dateArry;
}

export function weekMissingAsZero(data, range, opt, bool = false) {
  data = JSON.parse(JSON.stringify(data));
  const _range = getWeeks(range.start, range.end)
  const dateArr = [];
  let preval = 0;
  const newData = _range.map((dayIdx) => {
    const week = dayIdx
    dateArr.push(dayIdx);
    const res = _.find(data, (d) => {
      d.value = d[opt.value];
      return `${d[opt.key[0]]}/${d[opt.key[1]]}周` === week;
    });
    if (res) {
      if (bool) {
        preval = res.value;
      }
      return res;
    }
    return {
      date: week,
      value: preval,
    };
  });
  return {
    dateArr,
    values: newData,
  };
}

export function yearMissingAsZero(data, range, opt, bool = false) {
  data = JSON.parse(JSON.stringify(data));
  const _range = d3.utcYears(moment(`${range.start}`), moment(`${range.end}`).add(1, 'years'), 1);
  const dateArr = [];
  let preval = 0;
  const newData = _range.map((dayIdx) => {
    const year = moment(dayIdx).format('YYYY');
    dateArr.push(year);
    const res = _.find(data, (d) => {
      d.value = d[opt.value];
      return d[opt.key] == year;
    });
    if (res) {
      if (bool) {
        preval = res.value
      }
      return res;
    }
    return {
      date: moment(dayIdx).format('YYYY'),
      value: preval,
    };
  });
  return {
    dateArr,
    values: newData,
  };
}

export function accSumMissing(data, range, opt) {
  data = JSON.parse(JSON.stringify(data));
  const _range = d3.utcDays(moment(range.start), moment(range.end).add(1, 'days'), 1);
  const dateArr = [];
  let preval = 0;
  const newData = _range.map((dayIdx) => {
    const day = moment(dayIdx).format('YYYY-MM-DD');
    dateArr.push(day);
    const res = _.find(data, (d) => {
      d.value = d[opt.value];
      return d[opt.key] === day;
    });
    if (res) {
      preval = res.value;
      return res;
    }
    return {
      date: moment(dayIdx).format('YYYY-MM-DD'),
      value: preval,
    };
  });

  return {
    dateArr,
    values: newData,
  };
}

export function ochlMissing(data, range, opt) {
  data = JSON.parse(JSON.stringify(data));
  const _range = d3.utcDays(moment(range.start), moment(range.end).add(1, 'days'), 1);
  const dateArr = [];
  let preval = [];
  const newData = _range.map((dayIdx, index) => {
    const day = moment(dayIdx).format('YYYY-MM-DD');
    dateArr.push(day);
    const res = _.find(data, (d) => {
      return d[opt.key] === day;
    });
    if (res) {
      const t = [res.open, res.close, res.low, res.high];
      preval = [res.close, res.close, res.close, res.close];
      return t;
    }
    return preval;
  });
  return {
    dateArr,
    values: newData,
  };
}

export function ochlMonthMissing(data, range, opt) {
  data = JSON.parse(JSON.stringify(data));
  const _range = d3.timeMonths(moment(range.start), moment(range.end).add(1, 'months'), 1);
  const dateArr = [];
  let preval = 0;
  const newData = _range.map((dayIdx) => {
    const month = moment(dayIdx).format('YYYY-MM');
    dateArr.push(month);
    const res = _.find(data, (d) => {
      return moment(`${d[opt.key[0]]}-${d[opt.key[1]]}`).format('YYYY-MM') === month;
    });
    if (res) {
      const t = [res.open, res.close, res.low, res.high];
      preval = [res.close, res.close, res.close, res.close];
      return t;
    }
    return preval;
  });
  return {
    dateArr,
    values: newData,
  };
}

export function ochlQuarterMissing(data, range, opt) {
  data = JSON.parse(JSON.stringify(data));
  const _range = d3.utcYears(moment(`${range.start}`), moment(`${range.end}`).add(1, 'years'), 1);
  const dateArr = [];
  let preval = 0;
  _range.forEach(y => {
    for (let j = 0; j < 4; j++) {
      dateArr.push(`${moment(y).format('YYYY')}/${j + 1}季`);
    }
  });
  const newData = dateArr.map((dayIdx) => {
    const res = _.find(data, (d) => {
      return `${d[opt.key[0]]}/${d[opt.key[1]]}季` === dayIdx;
    });
    if (res) {
      const t = [res.open, res.close, res.low, res.high];
      preval = [res.close, res.close, res.close, res.close];
      return t;
    }
    return preval;
  });
  return {
    dateArr,
    values: newData,
  };
}
export function ochlWeekMissing(data, range, opt) {
  data = JSON.parse(JSON.stringify(data));
  const _range = getWeeks(range.start, range.end)
  const dateArr = [];
  let preval = 0;
  const newData = _range.map((dayIdx) => {
    const week = dayIdx
    dateArr.push(dayIdx);
    const res = _.find(data, (d) => {
      d.value = d[opt.value];
      return `${d[opt.key[0]]}/${d[opt.key[1]]}周` === week;
    });
    if (res) {
      const t = [res.open, res.close, res.low, res.high];
      preval = [res.close, res.close, res.close, res.close];
      return t;
    }
    return {
      date: week,
      value: preval,
    };
  });
  return {
    dateArr,
    values: newData,
  };
}

export function ochlYearMissing(data, range, opt) {
  data = JSON.parse(JSON.stringify(data));
  const _range = d3.utcYears(moment(`${range.start}`), moment(`${range.end}`).add(1, 'years'), 1);
  const dateArr = [];
  let preval = 0;
  const newData = _range.map((dayIdx) => {
    const year = moment(dayIdx).format('YYYY');
    dateArr.push(year);
    const res = _.find(data, (d) => {
      d.value = d[opt.value];
      return d[opt.key] == year;
    });
    if (res) {
      const t = [res.open, res.close, res.low, res.high];
      preval = [res.close, res.close, res.close, res.close];
      return t;
    }
    return preval;
  });
  return {
    dateArr,
    values: newData,
  };
}

export const ochlTenDaysMissing = (data, range, opt) => {
  data = JSON.parse(JSON.stringify(data));
  const _range = d3.timeMonths(moment(range.start), moment(range.end).add(1, 'months'), 1);
  const dateArr = [];
  let preval = 0;
  _range.forEach((dayIdx) => {
    const month = moment(dayIdx)
      .format('YYYY-MM');
    for (let i = 1; i <= 3; i++) {
      let temp = '上旬';
      if (i === 2) {
        temp = '中旬'
      } else if (i === 3) {
        temp = '下旬'
      }
      dateArr.push(`${month}-${temp}`);
    }
  })
  const newData = dateArr.map((dayIdx) => {
    const res = _.find(data, (d) => {
      d.value = d[opt.value];
      let temp = '上旬';
      if (d[opt.key[2]] === 2) {
        temp = '中旬'
      } else if (d[opt.key[2]] === 3) {
        temp = '下旬'
      }
      return `${d[opt.key[0]]}-${d[opt.key[1]] < 10 ? '0' + d[opt.key[1]] : d[opt.key[1]]}-${temp}` === dayIdx;
    });
    if (res) {
      const t = [res.open, res.close, res.low, res.high];
      preval = [res.close, res.close, res.close, res.close];
      return t;
    }
    return preval
  });
  return {
    dateArr,
    values: newData,
  };
}

