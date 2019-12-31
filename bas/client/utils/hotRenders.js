import Handsontable from 'handsontable';
import humanizeDuration from 'humanize-duration';
import React, {Component, Fragment} from 'react';
import ReactDOMServer from 'react-dom/server';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import {Balloon, Timeline} from '@alifd/next';
import moment from 'moment';
import _ from 'lodash';
import {store} from '../index';
import ajaxs from '../utils/ajax';
import MapComponent from '../pages/common/MapComponent';
import SingleLocMap from '../pages/common/MapComponent/SingleLocMap';
import solarLunar from "solarlunar";
import {formatMoney} from './bbillsUtils';


const TimelineItem = Timeline.Item;

export const shortSCNHumanizer = humanizeDuration.humanizer({
  language: 'shortCn',
  languages: {
    shortCn: {
      y: () => '年',
      mo: () => '月',
      w: () => '周',
      d: () => '天',
      h: () => '时',
      m: () => '分',
      s: () => '秒',
      ms: () => '毫秒',
    }
  }
});

//将日期转化为 HH:mm格式
function hoursAndMinutesStyleRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.style.textAlign = 'center';
  if (value) {
    td.innerHTML = moment(value).format('HH:mm');
  }
  return td;
}
//将日期转化为 YYYY-MM-DD
function yearMonthDayStyleRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.style.textAlign = 'center';
  if (value) {
    td.innerHTML = moment(value).format('YYYY-MM-DD');
  }
  return td;
}

function strikingValueRenderer(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.className += ' htMiddle';
  // if row contains negative number
  if (parseFloat(value, 10) > 99) {
    // add class "make-me-red"
    td.className = 'make-me-red';
  }

  if (!value || value === '') {
    // td.style.background = '#EEE';
  } else {
    td.style.textAlign = 'center';
    td.innerHTML = `<span class="drilldown">${value}</span>`;
  }
  return td;
}

function humanizeDurationRenderer(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  if (parseInt(value, 10) >= 0) {
    let v = shortSCNHumanizer(parseInt(value) * 1000, {spacer: '', delimiter: '', units: ['h', 'm', 's']});
    td.innerHTML = v;
    td.style.textAlign = 'right';
  }
  td.className += ' htMiddle';
  return td;
}

// 本方号码标注函数
function ownerNumLabelRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.className += ' htMiddle';
  const ownerNum = instance.getDataAtRowProp(row, 'owner_num');
  if (ownerNum) {
    const result = _formatNumLabel(store.getState().labelPNs.items, ownerNum);
    if (result.dom) {
      td.innerHTML = result.dom;
    } else if (value) {
      td.innerHTML = value;
    }
  } else if (value) {
    td.innerHTML = value;
  }
  td.style.textAlign = 'center';
}

// 对方号码标注函数
function peerNumLabelRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = ''
  td.className += ' htMiddle';
  const peerNum = instance.getDataAtRowProp(row, 'peer_num');
  if (peerNum) {
    const result = _formatNumLabel(store.getState().labelPNs.items, peerNum);
    if (result.dom) {
      td.innerHTML = result.dom;
    } else if (value) {
      td.innerHTML = value;
    }
  } else if (value) {
    td.innerHTML = value;
  }
  td.style.textAlign = 'center';
}

//基站标注函数
function codeLabelRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.className += ' htMiddle';
  const code = instance.getDataAtRowProp(row, 'owner_ct_code');
  if (code) {
    const result = _formaCodeLabel(store.getState().labelCells.items, code);
    if (result) {
      td.innerHTML = result;
    } else if (value) {
      td.innerHTML = value;
    }
  } else if (value) {
    td.innerHTML = value;
  }
  td.style.textAlign = 'center';
}

//事件标注函数
function eventLabelRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.className += ' htMiddle';
  const date = instance.getDataAtRowProp(row, 'started_day');
  if (date) {
    const result = _formaEventRender(store.getState().caseEvents.items, date);
    if (result) {
      td.innerHTML = result;
    } else if (value) {
      td.innerHTML = value;
    }
  } else if (value) {
    td.innerHTML = value;
  }
  td.style.textAlign = 'center';
}

// 本方号码标签函数
function ownerNumTagRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = ''
  td.className += ' htMiddle';
  const ownerNum = instance.getDataAtRowProp(row, 'owner_num');
  let newVal = [];
  const tags = _formatNumLabel(store.getState().labelPNs.items, ownerNum);
  if (tags.num) {
    if (tags.num.label_groups) {
      newVal = newVal.concat(tags.num.label_groups)
    }
    if (tags.num.ptags) {
      if (typeof tags.num.ptags === 'string') {
        newVal = newVal.concat(JSON.parse(tags.num.ptags));
      } else {
        newVal = newVal.concat(tags.num.ptags);
      }
    }
    if (newVal.length > 0) {
      td.innerHTML = `<div>${newVal.join(', ')}</div>`
    }
  } else if (value) {
    td.innerHTML = value;
  }
  td.style.textAlign = 'center';
}

//本方号码标签(新)
export const ownerNumTagRenders = (ownerNum) => {
  let newVal = [];
  const tags = _formatNumLabel(store.getState().labelPNs.items, ownerNum);
  if (tags.num) {
    if (tags.num.label_groups) {
      newVal = newVal.concat(tags.num.label_groups)
    }
    if (tags.num.ptags) {
      if (typeof tags.num.ptags === 'string') {
        newVal = newVal.concat(JSON.parse(tags.num.ptags));
      } else {
        newVal = newVal.concat(tags.num.ptags);
      }
    }
    if (newVal.length > 0) {
      return (
        <Balloon align="r"
                 trigger={<span style={styles.compress}>{newVal.join(', ')}</span>}
                 closable={false}
        >
          <div>{newVal.join(', ')}</div>
        </Balloon>
      )
    }
  }
};


// 对方号码标签函数
function peerNumTagRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = ''
  td.className += ' htMiddle';
  const peerNum = instance.getDataAtRowProp(row, 'peer_num');
  let newVal = [];
  const tags = _formatNumLabel(store.getState().labelPNs.items, peerNum);
  if (tags.num) {
    if (tags.num.label_groups) {
      newVal = newVal.concat(tags.num.label_groups)
    }
    if (tags.num.ptags) {
      if (typeof tags.num.ptags === 'string') {
        newVal = newVal.concat(JSON.parse(tags.num.ptags));
      } else {
        newVal = newVal.concat(tags.num.ptags);
      }
    }
    if (newVal.length > 0) {
      td.innerHTML = `<div>${newVal.join(', ')}</div>`
    }
  } else if (value) {
    td.innerHTML = value;
  }
  td.style.textAlign = 'center';
}

//对方号码标签(新)
export const peerNumTagRenders = (peerNum) => {
  let newVal = [];
  const tags = _formatNumLabel(store.getState().labelPNs.items, peerNum);
  if (tags.num) {
    if (tags.num.label_groups) {
      newVal = newVal.concat(tags.num.label_groups)
    }
    if (tags.num.ptags) {
      if (typeof tags.num.ptags === 'string') {
        newVal = newVal.concat(JSON.parse(tags.num.ptags));
      } else {
        newVal = newVal.concat(tags.num.ptags);
      }
    }
    if (newVal.length > 0) {
      return (
        <Balloon align="r"
                 trigger={<span style={styles.compress}>{newVal.join(', ')}</span>}
                 closable={false}
        >
          <div>{newVal.join(', ')}</div>
        </Balloon>
      )
    }
  }
};

const styles = {
  compress: {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
    textAlign: 'center',
  },
};


// 时间分割点函数
export const breakpoints = [];

function caseBreakpointsRender(instance, td, row, col, prop, value, cellProperties) {
  breakpoints[row] && ReactDOM.unmountComponentAtNode(breakpoints[row]);
  td.innerHTML = `<div style="background: #eee; width: 100%; height: 80%"></div>`
  const day = instance.getDataAtRowProp(row, 'first_day');
  if (day) {
    const dom = document.createElement('div');
    ajaxs.post(`/cases/${store.getState().cases.case.id}/pnums/comms-on-bps`, {
        "criteria": {},
        "view": {},
        "case_id": 5
      }
    ).then(res => {
      if (res.meta.success) {
        const counts = []
        res.data.forEach(item => {
          counts.push(item.count)
        })
        // const component = (
        //   <Balloon align="r"
        //            trigger={<span>{counts.join('●')}</span>}
        //            closable={false}
        //   >
        //     <div>
        //       test
        //     </div>
        //   </Balloon>
        // );
        // ReactDOM.render(component, dom);
        // td.innerHTML = '';
        // td.appendChild(dom);
        // breakpoints[row] = dom;
        td.innerHTML = `<span>${counts.join('●')}</span>`
      }
    })
  }
  td.className += ' htMiddle';
  td.style.textAlign = 'center';
}

//平均时长
function avgCallTimeRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.className += ' htMiddle';
  const totalDuration = instance.getDataAtRowProp(row, 'total_duration');
  const callCount = instance.getDataAtRowProp(row, 'call_count');
  if (callCount > 0) {
    td.innerHTML = parseInt((totalDuration || 0) / callCount);
    td.style.textAlign = 'center';
  }

}

function _formatNumLabel(arr, num) {
  let dom = null;
  let n = null;
  Array.isArray(arr) && arr.forEach(item => {
    if (item.num === num) {
      dom = `<div style="background: ${item.label_bg_color}; color: #fff; text-align: center">${item.label}</div>`;
      n = item;
    }
  });
  return {
    dom,
    num: n,
  };
}


function _formaCodeLabel(arr, code) {
  let dom = null;
  Array.isArray(arr) && arr.forEach(item => {
    if (item.ct_code === code) {
      dom = `<div style="background: ${item.marker_color}; color: #fff; text-align: center">${item.label}</div>`;
    }
  });
  return dom;
}

function _formaEventRender(arr, date) {
  let dom = null
  Array.isArray(arr) && arr.forEach(item => {
    if (moment(item.started_at).format("YYYY-MM-DD") === date) {
      dom = `<div style="background: ${item.color}; color: #fff; text-align: center">${item.name}</div>`
    }
  })
  return dom
}

function _trxBranchNum(arr, num) {
  let dom = null;
  let n = null;
  Array.isArray(arr) && arr.forEach(item => {
    if (item.branch_num === num) {
      dom = `<div style="background: ${item.marker_color}; color: #fff; text-align: center">${item.label}</div>`;
      n = item;
    }
  });
  return {
    dom,
    num: n,
  };
}


// 基站地图组件
export const codeMap = (code, styles = {width: '600px', height: '600px'}) => {
  return (
    <Provider store={store}>
      <Balloon align="r"
               shouldUpdatePosition
               autoFocus={false}
               // triggerType={'click'}
               trigger={<span>{code}</span>}
               closable={false}
      >
        <div>
          {/*<MapComponent code={code} ctLabel={store.getState().labelCells.items}/>*/}
          <SingleLocMap code={code} ctLabel={store.getState().labelCells.items}/>
        </div>
      </Balloon>
    </Provider>
  )
}
// 地址组件
export const addrComponent = (value, styles) => {
  if ( value !== null || value !== ''){
  return (
    <Balloon align="r"
             trigger={<span style={styles.compress} >{value}</span>}
             triggerType = 'hover'
             closable={false}
    >
      <div>{value}</div>
    </Balloon>
  )
  }
  else {
    return  false
  }
}

// 时间分割组件
export const caseBreakpoints = async (id, criteria, row, domId) => {
  let res = await ajaxs.post(`/cases/${id}/pbills/peer-num/calls-on-breakpoints`, {criteria})
  if (res.meta.success) {
    const myTd = document.getElementById(`${domId + row + 'breakpoints'}`);
    const counts = [];
    const styles = {
      num: {
        color: 'blue',
        fontSize: '18px',
        fontWeight: 'bold'
      },
      name: {
        position: 'relative',
        top: '-5px',
      }
    }
    let timelineDom = Array.isArray(res.data) && res.data.map((item, index) => {
      counts.push(item.count);
      if (index === 0) {
        return (
           <TimelineItem key={index} title={item.ended_at} time={<div>
             <div style={styles.name}>{item.event_name}</div>
             <div className='customTimeLineCount' style={styles.num}>{item.count}</div>
           </div>}/>
        )
      } else if (index === res.data.length - 1) {
        return (
          <TimelineItem key={index} title={''} time={
            <div>
              {/*<div style={styles.name}>{item.event_name}</div>*/}
              <div className='customTimeLineCount' style={styles.num}>{item.count}</div>
            </div>
          }/>
        )
      } else {
        return (
          <TimelineItem key={index} title={item.ended_at} time={
            <div>
              <div style={styles.name}>{item.event_name}</div>
              <div className='customTimeLineCount' style={styles.num}>{item.count}</div>
            </div>
          }/>
        )
      }

    })
    if (myTd) {
      myTd.style.background = '#fff';
      myTd.className += ' col-center'
      const component = (
        <Balloon needAdjust
                 // triggerType={'click'}
                 autoFocus={false}
                 align="lt"
                 trigger={<span>{counts.join(' ● ')}</span>}
                 closable={false}
        >
          <Timeline style={{maxHeight: '300px', overflowY: 'auto'}} className={'caseBreakpointsTimeLine'}>
            <TimelineItem title={<div style={{visibility: 'hidden'}}>起点</div>} time={<div style={{height: '15px'}}>

            </div>}/>
            {timelineDom}
          </Timeline>
        </Balloon>
      )
      const divDom = document.createElement('div');
      ReactDOM.render(component, divDom);
      myTd.innerHTML = '';
      myTd.appendChild(divDom);
      return divDom
    }
  }
  return false
}

export const drillDownRenderer = (instance, td, row, col, prop, value, cellProperties) => {
 // console.log(value)
  if (!value || value === '' || value == null || value == 0) {
    td.innerHTML = '';
    return
  }
  if (prop === 'total_cash_in' || prop === 'total_cash_out' || prop === 'total_trx_amt' || prop.indexOf('#trx_amt') !== -1) {
    value = formatMoney(value);
    td.style.textAlign = 'right';
  } else {
    td.style.textAlign = 'center';
  }
  td.innerHTML = `<span class="drilldown">${value}</span>`;
  //td.className += ' htMiddle';
};

//将日期转化为农历
function lunarCalendarStyleRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.style.textAlign = 'center';
  td.className += ' htMiddle';
  if (value) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const solar2lunarData = solarLunar.solar2lunar(year, month, day);
    td.innerHTML = `<span>${solar2lunarData.monthCn}${solar2lunarData.dayCn}</span>`
  }
  return td
}
//将日期转化为周几
function weekdayStyleRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.style.textAlign = 'center';
  td.className += ' htMiddle';
  if (value) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const solar2lunarData = solarLunar.solar2lunar(year, month, day);
    td.innerHTML = `<span>${solar2lunarData.ncWeek}</span>`
  }
  return td
}

// 机构号标注函数
function trxBranchNumRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.className += ' htMiddle';
  const branchNum = instance.getDataAtRowProp(row, 'trx_branch_num');
  const color = instance.getDataAtRowProp(row, 'marker_color');
  if (branchNum) {
    //store.getState().labelPNs.items
    const result = _trxBranchNum([], branchNum);
    if (result.dom) {
      td.innerHTML = result.dom;
    } else if (value) {
      td.innerHTML = `<div style="background: ${color}; color: #fff; text-align: center">${value}</div>`;
    }
  } else if (value) {
    td.innerHTML = value;
  }
  td.style.textAlign = 'center';
}

//  柜员号标注函数
function tellerCodeRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.className += ' htMiddle';
  const code = instance.getDataAtRowProp(row, 'teller_code');
  const color = instance.getDataAtRowProp(row, 'marker_color');
  if (code) {
    //store.getState().labelPNs.items
    const result = _trxBranchNum([], code);
    if (result.dom) {
      td.innerHTML = result.dom;
    } else if (value) {
      td.innerHTML = `<div style="background: ${color}; color: #fff; text-align: center">${value}</div>`;
    }
  } else if (value) {
    td.innerHTML = value;
  }
  td.style.textAlign = 'center';
}

// 金额下钻样式
export const amtRenderer = (instance, td, row, col, prop, value, cellProperties) => {
  if (!value || value === '' || value == null || value == 0) {
    td.innerHTML = '';
    return
  }
  value = formatMoney(value)
  td.innerHTML = `<span>${value}</span>`;
  td.style.textAlign = 'right';
  td.className += ' htMiddle';
};

// 本方账户标注函数
function ownerAcctLabelRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.className += ' htMiddle';
  const owner_bank_acct = instance.getDataAtRowProp(row, 'owner_bank_acct');
  const owner_card_num = instance.getDataAtRowProp(row, 'owner_card_num');
  const res = _.find(store.getState().bankAcctLables.LargItems, (x) => {
    return x.bank_acct === owner_bank_acct && x.card_num === owner_card_num
  })
  if (res) {
    td.innerHTML = `<div style="background: ${res.label_bg_color}; color: #fff; text-align: center">${res.label}</div>`
  } else if (value) {
    td.innerHTML = value;
  }
  td.style.textAlign = 'center';
}
// 本方账户标签
export const ownerAcctTagRenders = (owner_bank_acct, owner_card_num) => {
  const res = _.find(store.getState().bankAcctLables.LargItems, (x) => {
    return x.bank_acct === owner_bank_acct && x.card_num === owner_card_num
  })
  if (res) {
    let tags = JSON.parse(res.ptags)
    if (tags.length > 0) {
      return (
        <Balloon align="r"
                 trigger={<span style={styles.compress}>{tags.join(', ')}</span>}
                 closable={false}
        >
          <div>{tags.join(', ')}</div>
        </Balloon>
      )
    }
  }
}

// 对方账户标签
export const peerAcctTagRenders = (peer_bank_acct, peer_card_num) => {
  const res = _.find(store.getState().bankAcctLables.LargItems, (x) => {
    return x.bank_acct === peer_bank_acct && x.card_num === peer_card_num
  })
  if (res) {
    let tags = JSON.parse(res.ptags)
    if (tags.length > 0) {
      return (
        <Balloon align="r"
                 trigger={<span style={styles.compress}>{tags.join(', ')}</span>}
                 closable={false}
        >
          <div>{tags.join(', ')}</div>
        </Balloon>
      )
    }
  }
}

// 对方账户标注函数
function peerAcctLabelRender(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.className += ' htMiddle';
  const peer_bank_acct = instance.getDataAtRowProp(row, 'peer_bank_acct');
  const peer_card_num = instance.getDataAtRowProp(row, 'peer_card_num');
  const res = _.find(store.getState().bankAcctLables.LargItems, (x) => {
    return x.bank_acct === peer_bank_acct && x.card_num === peer_card_num
  })
  if (res) {
    td.innerHTML = `<div style="background: ${res.label_bg_color}; color: #fff; text-align: center">${res.label}</div>`
  } else if (value) {
    td.innerHTML = value;
  }
  td.style.textAlign = 'center';
}


Handsontable.renderers.registerRenderer('strikingValueRenderer', strikingValueRenderer);
Handsontable.renderers.registerRenderer('humanizeDurationRenderer', humanizeDurationRenderer);
Handsontable.renderers.registerRenderer('codeLabelRender', codeLabelRender);
Handsontable.renderers.registerRenderer('peerNumLabelRender', peerNumLabelRender);
Handsontable.renderers.registerRenderer('ownerNumLabelRender', ownerNumLabelRender);
Handsontable.renderers.registerRenderer('ownerNumTagRender', ownerNumTagRender);
Handsontable.renderers.registerRenderer('peerNumTagRender', peerNumTagRender);
Handsontable.renderers.registerRenderer('caseBreakpointsRender', caseBreakpointsRender);
Handsontable.renderers.registerRenderer('avgCallTimeRender', avgCallTimeRender);
Handsontable.renderers.registerRenderer('drillDownRenderer', drillDownRenderer);
Handsontable.renderers.registerRenderer('hoursAndMinutesStyleRender', hoursAndMinutesStyleRender);
Handsontable.renderers.registerRenderer('eventLabelRender', eventLabelRender);
Handsontable.renderers.registerRenderer('lunarCalendarStyleRender', lunarCalendarStyleRender);
Handsontable.renderers.registerRenderer('weekdayStyleRender', weekdayStyleRender);
Handsontable.renderers.registerRenderer('yearMonthDayStyleRender', yearMonthDayStyleRender);
Handsontable.renderers.registerRenderer('trxBranchNumRender', trxBranchNumRender);
Handsontable.renderers.registerRenderer('tellerCodeRender', tellerCodeRender);
Handsontable.renderers.registerRenderer('amtRenderer', amtRenderer);
Handsontable.renderers.registerRenderer('ownerAcctLabelRender', ownerAcctLabelRender);
Handsontable.renderers.registerRenderer('ownerAcctTagRenders', ownerAcctTagRenders);
Handsontable.renderers.registerRenderer('peerAcctLabelRender', peerAcctLabelRender);
Handsontable.renderers.registerRenderer('peerAcctTagRenders', peerAcctTagRenders);
