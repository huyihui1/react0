import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Balloon, Loading, Affix, Input, Select, Message, Checkbox } from '@alifd/next';
import IceLabel from '@icedesign/label';
import moment from 'moment';
import Hotkeys from 'react-hot-keys';
import randomColor from 'randomcolor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faMapMarkerAlt, faChartBar } from '@fortawesome/free-solid-svg-icons';

import { actions as calltrackActions } from '../../../stores/calltrack';
import { actions as SearchStoreActions } from '../../../stores/SearchStore/index';
import appConfig from '../../../appConfig';
import labelColorsConfig from '../../../labelColorsConfig';
import ajaxs from '../../../utils/ajax';
import { installExternalLibs } from '../../../utils/utils';
import { shortSCNHumanizer } from '../../../utils/hotRenders';
import { coordOffsetDecrypt } from '../../../utils/basCoord';
import meetSvg from '../../../meet.svg';

const Option = Select.Option;
const { Group: CheckboxGroup } = Checkbox;
const colors = appConfig.callrackColors

const list = [
  {
    label: '当前点闪烁',
    value: '弹跳动画',
  },
  {
    label: '显示基站信息窗口',
    value: 'infoWindow',
  },
];
const tuDing = '<svg t="1566466654748" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2344" width="200" height="200"><path d="M448 981.333333a64 42.666667 0 1 0 128 0 64 42.666667 0 1 0-128 0Z" fill="#A93529" p-id="2345"></path><path d="M554.666667 593.941333V970.666667a10.666667 10.666667 0 0 1-10.666667 10.666666h-64a10.666667 10.666667 0 0 1-10.666667-10.666666V593.941333C324.650667 573.184 213.333333 449.088 213.333333 298.666667 213.333333 133.717333 347.050667 0 512 0s298.666667 133.717333 298.666667 298.666667c0 150.421333-111.317333 274.517333-256 295.274666z" fill="#F0493E" p-id="2346"></path><path d="M512 298.666667m-85.333333 0a85.333333 85.333333 0 1 0 170.666666 0 85.333333 85.333333 0 1 0-170.666666 0Z" fill="#FFFFFF" p-id="2347"></path></svg>';

// fa-play-circle

// 谷歌坐标
const x = 116.404;
const y = 39.915;

// 选中坐标的前一个坐标, 后一个坐标
const before = null;
let after = null;
let activeIndex = -1;
let scrollIndex = 0;

class MeetanalyzeMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      criteria: null,
      nummberArr: [],
      currentDate: null,
      ct_code: {},
      dailyPRs: {},
      dailyNums: {},
      daySet: [],
      allDays: [],
      currentPr: [],
      calltrackListTitleIndex: null,
      calltrackList: [],
      zoom: 13,
      bdPoint: null,
      isSyncTime: true,
      syncTimeVal: null,
      isAutoPlay: false,
      owner_nums: [],
      checkBoxVal: ['弹跳动画'],
      exts: {},
      pb_city: null,
      isListLoading: false,
    };
    this.firstCode = true;
    this.markers = {};
    this.renderMap = this.renderMap.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onLoadChildren = this.onLoadChildren.bind(this);
    this.formatCalltracksChildrenData = this.formatCalltracksChildrenData.bind(this);
    this.onChildrenClick = this.onChildrenClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.automatic = this.automatic.bind(this);
    this.onCheckBoxClick = this.onCheckBoxClick.bind(this);
    this.handleMarker = this.handleMarker.bind(this);
    this.changeColor = this.changeColor.bind(this);
  }


  formatCalltracksData(data) {
    const { caseEvents } = this.props;
    const newData = [];
    if (data && data.length > 0) {
      const allDays = [];
      data.forEach(item => {
        allDays.push(moment(item.alyz_day).format('YYYY-MM-DD'));
        if (caseEvents.items.length > 0) {
          caseEvents.items.forEach(i => {
            if (moment(i.started_at).format('YYYY-MM-DD') === moment(item.alyz_day).format('YYYY-MM-DD')) {
              item.label = `${item.alyz_day}`;
              item.key = item.alyz_day;
              item.iconType = 'add';
              if (item.event) {
                item.event = [...item.event, i];
              } else {
                item.event = [i];
              }
            } else if (moment(i.started_at).format('YYYY-MM-DD') <= moment(item.alyz_day).format('YYYY-MM-DD') && moment(i.ended_at).format('YYYY-MM-DD') >= moment(item.started_day).format('YYYY-MM-DD')) {
              item.label = `${item.alyz_day}`;
              item.key = item.alyz_day;
              item.iconType = 'add';
              if (item.event) {
                item.event = [...item.event, i];
              } else {
                item.event = [i];
              }
            } else {
              if (item.label) return;
              item.label = `${item.alyz_day}`;
              item.key = item.alyz_day;
              item.iconType = 'add';
            }
          });
        } else {
          item.label = `${item.alyz_day}`;
          item.key = item.alyz_day;
          item.iconType = 'add';
        }
      });
      this.setState({ allDays });
    }
    return data;
  }
  formatNoGroupCalltracksChildrenData = async (data, startDate, checkedKey) => {
    const children = [];
    const { ct_code, dailyPRs, dailyNums } = this.state;
    const { labelCells } = this.props;
    if (data) {
      const codes = [];
      dailyNums[startDate] = {};
      data.forEach((item) => {
        const t = {};
        labelCells.items.forEach(code => {
          if (item.owner_ct_code === code.ct_code) {
            item.codeLabel = code;
          }
        });
        codes.push(item.owner_ct_code);
        this.state.nummberArr.forEach(async (i, index) => {
          if (i.ownerNum === item.owner_num) {
            if (i.label) {
              item.numLabel = i;
            }
            dailyNums[startDate][item.owner_num] = true;
          }
        });
      });
      ct_code[startDate] = {
        isShow: true,
        children: data,
        codes,
        points: [],
      };
      console.log(checkedKey);
      for (let i = 0; i < checkedKey.length; i++) {
        const item = checkedKey[i];
        const numOpt = ct_code[item];
        const point = numOpt.codes;
        const res = await ajaxs.post('/cell-towers/loc/transform', { coord: '2', fmt: 16, ct_codes: point });
        if (res) {
          for (const key in res.data) {
            if (res.data[key][0]) {
              res.data[key][0] = coordOffsetDecrypt(res.data[key][0][0], res.data[key][0][1]);
            }
            data.forEach(i => {
              if (i[key]) {
                i[key].forEach(j => {
                  if (j.owner_ct_code === key && res.data[key].length > 0) {
                    if (res.data[key][1].started_at) {
                      res.data[key][1].started_at = `${res.data[key][1].started_at}/${moment(j.started_at).format('HH:mm:ss')}`;
                    } else {
                      res.data[key][1].started_at = j.started_at;
                    }
                    res.data[key][1].duration = j.duration;
                    res.data[key][1].peer_num = j.peer_num;
                  }
                });
              }
            });
          }
          ct_code[item].points = res.data;
        }
        this.handleMarker(numOpt, {}, 0, item);
      }
      if (this.firstCode) {
        this.firstCode = false;
        this.setState({
          currentPr: [
            { day: startDate },
          ],
        }, () => {
          this.onKeyDown();
        });
      }
      this.setState({
        ct_code,
        dailyNums,
      });
    } else {
      this.map.clearOverlays();
      checkedKey.forEach(item => {
        for (const k in ct_code[item]) {
          const numOpt = ct_code[item];
          if (numOpt.isShow) {
            this.handleMarker(numOpt, {}, 0, item);
          }
        }
      });
    }
  }
  async formatCalltracksChildrenData(data, startDate, checkedKey) {
    const newData = this.state.data;
    const children = [];
    const { ct_code, dailyPRs, dailyNums } = this.state;
    const { labelCells } = this.props;
    if (data) {
      ct_code[startDate] = {};
      dailyPRs[startDate] = {};
      dailyNums[startDate] = {};
      data.forEach((item) => {
        const result = [];
        const codes = [];
        const t = {};
        for (const k in item) {
          item[k].forEach(j => {
            if (j) {
              labelCells.items.forEach(code => {
                if (j.owner_ct_code === code.ct_code) {
                  j.codeLabel = code;
                }
              });
              this.state.nummberArr.forEach((i, index) => {
                if (i.ownerNum === k) {
                  if (i.label) {
                    j.numLabel = i;
                  }
                }
              });
              result.push(j);
              codes.push(j.owner_ct_code);
            }
          });
        }
        dailyPRs[startDate] = { ...dailyPRs[startDate], ...item };
        dailyNums[startDate][Object.keys(item)[0]] = true;
        ct_code[startDate][Object.keys(item)[0]] = {
          isShow: true,
          children: result,
          codes,
          points: [],
        };
      });
      // .forEach(async (item, dateIndex) => {
      for (let i = 0; i < checkedKey.length; i++) {
        const item = checkedKey[i];
        const dateIndex = i;
        for (const k in ct_code[item]) {
          // for (let j=0; j< ct_code[item].length; j++) {
          //   let k = ct_code[item][j];
          const numOpt = ct_code[item][k];
          const point = numOpt.codes;
          for (let i = 0; i < this.state.nummberArr.length; i++) {
            const x = this.state.nummberArr[i];
            if (x.ownerNum === k && item === startDate) {
              if (x.label) {
                ct_code[item][k].labelInfo = x;
              }
              const res = await ajaxs.post('/cell-towers/loc/transform', { coord: '2', fmt: 16, ct_codes: point });
              if (res) {
                for (const key in res.data) {
                  if (res.data[key][0]) {
                    res.data[key][0] = coordOffsetDecrypt(res.data[key][0][0], res.data[key][0][1]);
                  }
                  data.forEach(i => {
                    if (i[k]) {
                      i[k].forEach(j => {
                        if (j.owner_ct_code === key && res.data[key].length > 0) {
                          if (res.data[key][1].started_at) {
                            res.data[key][1].started_at = `${res.data[key][1].started_at}/${moment(j.started_at).format('HH:mm:ss')}`;
                          } else {
                            res.data[key][1].started_at = j.started_at;
                          }
                          res.data[key][1].duration = j.duration;
                          res.data[key][1].peer_num = j.peer_num;
                        }
                      });
                    }
                  });
                }
                ct_code[item][k].points = res.data;
              }
              this.handleMarker(ct_code[item][k], x, i, item);
            }
          }
        }
      }
      if (this.firstCode) {
        this.firstCode = false;
        this.setState({
          currentPr: [
            { day: startDate },
          ],
        }, () => {
          this.onKeyDown();
        });
      }
      this.setState({
        data: newData,
        ct_code,
        dailyPRs,
      });
    } else {
      this.map.clearOverlays();
      checkedKey.forEach(item => {
        for (const k in ct_code[item]) {
          const numOpt = ct_code[item][k];
          if (numOpt.isShow) {
            this.state.nummberArr.forEach((i, index) => {
              if (i.ownerNum === k) {
                this.handleMarker(numOpt, i, index, item);
              }
            });
          }
        }
      });
    }
  }

  //  初始化百度地图
  renderMap() {
    const { login: { summary } } = this.props;
    const { pb_city } = this.state;
    const top_right_navigation = new window.BMap.NavigationControl({
      anchor: BMAP_ANCHOR_TOP_RIGHT,
      type: BMAP_NAVIGATION_CONTROL_ZOOM,
    });
    const mapType1 = new window.BMap.MapTypeControl(
      {
        mapTypes: [BMAP_NORMAL_MAP],
        anchor: BMAP_ANCHOR_TOP_LEFT,
      }
    );

    const ggPoint = new window.BMap.Point(x, y);
    this.map = new window.BMap.Map('calltrackMap', { enableMapClick: false });
    this.map.addControl(mapType1);
    this.map.addControl(top_right_navigation);
    // this.map.enableScrollWheelZoom(); // 允许鼠标缩放
    this.map.addEventListener('zoomend', () => {
      this.setState({
        zoom: this.map.getZoom(),
      });
      this.state.bdPoint && this.map.setCenter(this.state.bdPoint);
      this.map.setZoom(this.map.getZoom());
    });
    if (pb_city) {
      this.map.centerAndZoom(pb_city, appConfig.bigMapZoom);
    } else {
      this.map.centerAndZoom(ggPoint, 10);
    }
  }

  trans_comm_direction(value) {
    const comm_direction = value;
    if (comm_direction == 0) {
      return '未知';
    } else if (comm_direction == 11) {
      return '主叫';
    } else if (comm_direction == 12) {
      return '<---';
    } else if (comm_direction == 13) {
      return '呼转';
    } else if (comm_direction == 21) {
      return '主短';
    } else if (comm_direction == 22) {
      return '被短';
    } else if (comm_direction == 31) {
      return '主彩';
    } else if (comm_direction == 32) {
      return '被彩';
    }
    return '';
  }

  // 显示覆盖物
  handleMarker(params, obj, index, date) {
    const polylineArr = [];
    const t = {};
    const { values } = this.props;
    const { exts, isSyncTime } = this.state;
    for (const k in params.codes) {
      const param = params.points[params.codes[k]];
      if (param && param.length != 0) {
        const point = new window.BMap.Point(param[0][0], param[0][1]);
        polylineArr.push(point);
        if (!t[params.codes[k]]) {
          let markerOpt = {
            // 指定Marker的icon属性为Symbol
            icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
              scale: 0.8, // 图标缩放大小
              fillColor: params.children[k].numLabel ? params.children[k].numLabel.color : 'red', // 填充颜色
              fillOpacity: 0.8, // 填充透明度
            }),
          };
          if (isSyncTime) {
            markerOpt = {
              // 指定Marker的icon属性为Symbol
              icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
                scale: 0.8, // 图标缩放大小
                fillColor: obj.color, // 填充颜色
                fillOpacity: 0.8, // 填充透明度
              }),
            };
          }
          if (exts[date]) {
            if (values.loc_rule === 'same_lac' && exts[date].indexOf(params.codes[k].split(':')[0]) !== -1 || values.loc_rule === 'same_ci' && exts[date].indexOf(params.codes[k].split(':')[1]) !== -1) {
              markerOpt = {
                // 指定Marker的icon属性为Symbol
                icon: new window.BMap.Symbol(tuDing, {
                  scale: 0.02, // 图标缩放大小
                  fillColor: 'green', // 填充颜色
                  fillOpacity: 0.8, // 填充透明度
                  anchor: new window.BMap.Size(550, 1000),
                }),
              };
            }
            if (values.loc_rule === 'scope_ct') {
              for (let i = 0; i < exts[date].length; i++) {
                const extArr = exts[date][i];
                if (extArr.indexOf(params.codes[k]) !== -1) {
                  markerOpt = {
                    // 指定Marker的icon属性为Symbol
                    icon: new window.BMap.Symbol(tuDing, {
                      scale: 0.02, // 图标缩放大小
                      fillColor: 'green', // 填充颜色
                      fillOpacity: 0.8, // 填充透明度
                      anchor: new window.BMap.Size(550, 1000),
                    }),
                  };
                  break;
                }
              }
            }
          }
          const marker = new window.BMap.Marker(point, markerOpt); // 创建标注
          this.map.addOverlay(marker);
          marker.addEventListener('click', async () => {
            const { daySet, owner_nums } = this.state;
            console.log(this.props.criteria);
            const c = JSON.parse(JSON.stringify(this.props.criteria));
            delete c.peer_num;
            const criteria = {
              ...c,
              owner_ct_code: params.codes[k],
              started_day: ['IN', daySet],
              owner_num: ['IN', owner_nums],
            };

            const res = await ajaxs.post(`/cases/${this.props.caseId}/pbills/cell-towers/pbill-records`, { criteria });
            if (res.meta && res.meta.success) {
              let li = '';
              let numLabel = null;
              res.data.forEach(code => {
                for (let i = 0; i < this.state.nummberArr.length; i++) {
                  const nummber = this.state.nummberArr[i];
                  if (nummber.ownerNum === code.owner_num && nummber.label) {
                    numLabel = nummber;
                    break;
                  }
                }

                li += `<li style="font-size: 13px;">
                          <span style="margin-right: 5px">${moment(code.started_at).format('YYYY-MM-DD')}</span>
                          <span style="font-size: 12px; display: inline-block; margin-right: 5px;">${moment(code.started_at).format('HH:mm:ss')}</span> 
                          <span style="margin-right: 5px;">${code.owner_num}</span> 
                          <span style="display: ${numLabel ? 'inline-block' : 'none'}; background: ${numLabel ? numLabel.color || '#666' : null}; margin-left: -2px; color: ${numLabel ? '#fff' : null}">${numLabel ? numLabel.label || code.owner_cname : null}</span> 
                          <span>${this.trans_comm_direction(code.comm_direction)}</span> <span>${code.peer_num || code.peer_short_num}</span> 
                          <span style="font-style: italic">${shortSCNHumanizer(parseInt(code.duration) * 1000, { spacer: '', delimiter: '', units: ['h', 'm', 's'] })}</span>
                       </li>`;
              });
              const liElement = `<div style="max-width: 500px">
                              <ul style="max-height: 80px; overflow-y: auto;">
                                ${li}
                              </ul>
                              <div style="font-size: 12px; margin-top: 10px;">基站: <span>${params.codes[k]}</span></div>
                              <div style="font-size: 12px; color: #666; margin-top: 10px;">地址: ${param[1].address}</div>
                           </div>`;

              const opts = {
                offset: new window.BMap.Size(0, -15),
              };
              const infoWindow = new window.BMap.InfoWindow(liElement, opts);
              this.map.openInfoWindow(infoWindow, point);
            }
          });
          this.markers[params.codes[k]] = marker;
          t[params.codes[k]] = params.codes[k];
        }
      }
    }
    const polyline = new window.BMap.Polyline(polylineArr, { strokeColor: this.getColor(date), strokeWeight: 8, strokeOpacity: 1 }); // 创建折线
    let polyline2 = new window.BMap.Polyline(polylineArr, { strokeColor: '#000', strokeWeight: 2, strokeOpacity: 1 }); // 创建折线
    if (isSyncTime) {
      polyline2 = new window.BMap.Polyline(polylineArr, { strokeColor: obj.color, strokeWeight: 2, strokeOpacity: 1 }); // 创建折线
    }
    this.map.addOverlay(polyline); // 增加折线
    this.map.addOverlay(polyline2); // 增加折线
    this.setState({
      bdPoint: polylineArr[0],
    });
  }

  fetchData(data = { ...this.state.criteria }) {
    const { labelPNItems, ownerNums, values } = this.props;
    data = JSON.parse(JSON.stringify(data));
    if (data.owner_num && data.peer_num) {
      const numA = data.owner_num[1][0];
      const numB = data.peer_num[1][0];
      delete data.owner_num;
      delete data.peer_num;
      const params = { criteria: data, adhoc: { numA, numB, loc_rule: values.loc_rule, mutual_call: values.mutual_call * 1 } };
      if (values.loc_rule === 'scope_ct') {
        params.adhoc.radius = values.radius * 1;
      }
      this.setState({
        isListLoading: true,
      });
      ajaxs.post(`/cases/${this.props.caseId}/pbills/analyze/meets/days`, params).then(res => {
        if (res.meta.success) {
          const nummberArr = [];
          const ownerNumArr = [numA, numB];

          labelPNItems.forEach((i, index) => {
            if (ownerNumArr.indexOf(i.num) !== -1) {
              ownerNumArr[ownerNumArr.indexOf(i.num)] = {
                ownerNum: i.num,
                color: i.label_bg_color,
                label: i.label,
              };
            }
          });
          ownerNumArr.forEach(item => {
            if (!item.ownerNum) {
              nummberArr.push({
                ownerNum: item,
                color: 'red',
              });
            } else {
              nummberArr.push(item);
            }
          });
          nummberArr.forEach(num => {
            ownerNums.forEach(item => {
              if (num.ownerNum === item.owner_num && !num.label) {
                num.label = item.owner_name;
                num.color = null;
              }
            });
          });
          this.setState({
            data: this.formatCalltracksData(res.data),
            nummberArr,
            daySet: [],
            ct_code: {},
            currentPr: [],
            owner_nums: [numA, numB],
            isListLoading: false,
          }, () => {
            const cl = document.querySelector('.calltrack-list');

            cl.addEventListener('scroll', (e) => {
              // 获取所有列表的高度
              const arr = [];
              const clt = document.querySelectorAll('.calltrack-list-title');

              clt.forEach(item => {
                arr.push(item.offsetHeight);
              });
              const scrollT = cl.scrollTop;
              const t = [];
              for (let i = 0; i < arr.length; i++) {
                let x = 0;
                for (let j = 0; j < arr.length; j++) {
                  if (j <= i) {
                    x += arr[j];
                    t[i] = x;
                  } else {
                    break;
                  }
                }
              }
              // console.log(scrollT);
              // console.log(t);
              t.forEach((item, index) => {
                if (index === 0 && scrollT <= item || scrollT > t[index - 1] && scrollT <= item) {
                  scrollIndex = index;
                }
              });
            });
          });
        }
      });
    }
    if (this.map) {
      this.map.clearOverlays();
    }
    const input = document.querySelectorAll('.checkboxInput');
    input.forEach(item => {
      item.checked = false;
    });
    this.setState({
      currentDate: null,
    });
  }

  onLoadChildren(checked, items, checkedKey) {
    const { isSyncTime, criteria } = this.state;
    const { values } = this.props;
    const data = JSON.parse(JSON.stringify(criteria));
    if (checked) {
      if (data.owner_num && data.peer_num) {
        const numA = data.owner_num[1][0];
        const numB = data.peer_num[1][0];
        delete data.owner_num;
        delete data.peer_num;
        ajaxs.post(`/cases/${this.props.caseId}/pbills/analyze/meets/days/${items.key}`, { criteria: data, adhoc: { numA, numB, loc_rule: values.loc_rule, mutual_call: values.mutual_call * 1, radius: values.radius } }).then(res => {
          if (res.meta && res.meta.success) {
            if (isSyncTime) {
              this.formatCalltracksChildrenData(res.data, items.key, checkedKey);
            } else {
              this.formatNoGroupCalltracksChildrenData(res.data, items.key, checkedKey);
            }
            if (res.ext.length > 0) {
              const { exts } = this.state;
              exts[items.key] = res.ext;
              this.setState({
                exts,
              });
            }
          }
        });
      }
    } else if (isSyncTime) {
      this.formatCalltracksChildrenData(null, items.key, checkedKey);
    } else {
      this.formatNoGroupCalltracksChildrenData(null, items.key, checkedKey);
    }
  }

  onChildrenClick(e, item, indexs, points) {
    // e.target.scrollIntoView({ block: 'center' });
    let { currentDate, ct_code, isSyncTime, exts, nummberArr, daySet, currentPr, checkBoxVal } = this.state;
    const { criteria, values } = this.props;
    const date = moment(item.started_at).format('YYYYMMDD');
    const day = moment(item.started_at).format('YYYY-MM-DD');
    const time = moment(item.started_at).valueOf();
    const codes = ct_code[moment(item.started_at).format('YYYY-MM-DD')];
    const viewport = [];
    if (currentDate !== date) {
      this.setState({ currentDate: date });
    }
    currentPr = [];
    currentPr.push({
      num: points.num,
      day,
      index: indexs,
    });
    this.setState({ currentPr });
    activeIndex = indexs;

    this.map.clearOverlays();
    daySet.forEach(item => {
      if (isSyncTime) {
        for (const k in ct_code[item]) {
          const numOpt = ct_code[item][k];
          if (numOpt.isShow) {
            this.state.nummberArr.forEach((i, index) => {
              if (i.ownerNum === k) {
                this.handleMarker(numOpt, i, index, item);
              }
            });
          }
        }
      } else {
        const numOpt = ct_code[item];
        this.handleMarker(numOpt, {}, 0, item);
      }
    });

    if (points.after && points.current) {
      const current = new window.BMap.Point(points.current[0][0], points.current[0][1]);
      viewport.push(current);
      const opts = {
        width: 280, // 信息窗口宽度
        height: 80, // 信息窗口高度
        title: `<span style="font-size: 13px; display: inline-block; margin-bottom: 10px;">${moment(item.started_at).format('YYYYMMDD HH:mm:ss')} -> ${item.peer_num} ${item.duration}秒</span>`, // 信息窗口标题
        enableMessage: true, // 设置允许信息窗发送短息
        offset: new window.BMap.Size(0, -15),
      };
      const infoWindow = new window.BMap.InfoWindow(`<span style="font-size: 13px; color: #666;">地址: ${points.current[1].address}</span>`, opts);
      const polylineArr = [
        current,
        new window.BMap.Point(points.after[0][0], points.after[0][1]),
      ];
      this.map.removeOverlay(after);
      const sy = new window.BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
        scale: 0.6, // 图标缩放大小
        strokeColor: '#fff', // 设置矢量图标的线填充颜色
        strokeWeight: '2', // 设置线宽
      });
      const icons = new window.BMap.IconSequence(sy, '10', '30');

      const polyline = new window.BMap.Polyline(polylineArr, { strokeColor: this.getColor(day), strokeWeight: 8, strokeOpacity: 1 }); // 创建折线
      const mark = this.markers[item.owner_ct_code];
      if (mark && checkBoxVal.indexOf('弹跳动画') !== -1) {
        mark.setAnimation(BMAP_ANIMATION_BOUNCE);
      }
      if (isSyncTime) {
        if (mark) {
          let markerOpt = {
            // 指定Marker的icon属性为Symbol
            icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
              scale: 1.2, // 图标缩放大小
              fillColor: mark.getIcon().style.fillColor, // 填充颜色
              fillOpacity: 0.8, // 填充透明度
            }),
          };
          if (exts[day]) {
            if (values.loc_rule === 'same_lac' && exts[day].indexOf(item.owner_ct_code.split(':')[0]) !== -1 || values.loc_rule === 'same_ci' && exts[day].indexOf(item.owner_ct_code.split(':')[1]) !== -1) {
              markerOpt = {
                // 指定Marker的icon属性为Symbol
                icon: new window.BMap.Symbol(tuDing, {
                  scale: 0.02, // 图标缩放大小
                  fillColor: 'green', // 填充颜色
                  fillOpacity: 0.8, // 填充透明度
                  anchor: new window.BMap.Size(550, 1000),
                }),
              };
            }
            if (values.loc_rule === 'scope_ct') {
              for (let i = 0; i < exts[day].length; i++) {
                const extArr = exts[day][i];
                if (extArr.indexOf(item.owner_ct_code) !== -1) {
                  markerOpt = {
                    // 指定Marker的icon属性为Symbol
                    icon: new window.BMap.Symbol(tuDing, {
                      scale: 0.02, // 图标缩放大小
                      fillColor: 'green', // 填充颜色
                      fillOpacity: 0.8, // 填充透明度
                      anchor: new window.BMap.Size(550, 1000),
                    }),
                  };
                  break;
                }
              }
            }
          }
          mark.setIcon(markerOpt);
          mark.addEventListener('click', function () {
            this.map.openInfoWindow(infoWindow, current);
          });
          if (checkBoxVal.indexOf('infoWindow') !== -1) {
            this.map.openInfoWindow(infoWindow, current);
          }
        }
      }

      after = polyline;
      this.map.addOverlay(polyline); // 增加折线
      this.map.setCenter(current);
      this.map.setZoom(this.state.zoom);
      this.setState({
        bdPoint: current,
      });
    } else {
      if (after) {
        this.map.removeOverlay(after);
      }
      if (points.current) {
        const current = new window.BMap.Point(points.current[0][0], points.current[0][1]);
        viewport.push(current);
        this.map.setCenter(current);
        const opts = {
          width: 280, // 信息窗口宽度
          height: 80, // 信息窗口高度
          title: `<span style="font-size: 13px; display: inline-block; margin-bottom: 10px;">${moment(item.started_at).format('YYYYMMDD HH:mm:ss')} -> ${item.peer_num} ${item.duration}秒</span>`, // 信息窗口标题
          enableMessage: true, // 设置允许信息窗发送短息
          offset: new window.BMap.Size(0, -15),
        };
        const infoWindow = new window.BMap.InfoWindow(`<span style="font-size: 13px; color: #666;">地址: ${points.current[1].address}</span>`, opts);
        this.map.setZoom(this.state.zoom);
        const mark = this.markers[item.owner_ct_code];
        if (mark && checkBoxVal.indexOf('弹跳动画') !== -1) {
          mark.setAnimation(BMAP_ANIMATION_BOUNCE);
        }
        if (isSyncTime) {
          if (mark) {
            mark.setIcon(new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
              scale: 1.2, // 图标缩放大小
              fillColor: mark.getIcon().style.fillColor, // 填充颜色
              fillOpacity: 0.8, // 填充透明度
            }));
            mark.addEventListener('click', function () {
              this.map.openInfoWindow(infoWindow, current);
            });
            if (checkBoxVal.indexOf('infoWindow') !== -1) {
              this.map.openInfoWindow(infoWindow, current);
            }
          }
        } else if (checkBoxVal.indexOf('infoWindow') !== -1) {
          this.map.openInfoWindow(infoWindow, current);
        }
        this.setState({
          bdPoint: current,
        });
      } else {
        this.map.closeInfoWindow();
        Message.warning('暂无此基站信息.');
      }
    }


    e && e.stopPropagation();
    const li = document.querySelectorAll('.calltrack-list-body li');
    li.forEach(dom => {
      dom.classList.remove('active');
    });
    if (e.target.nodeName === 'SPAN') {
      e.target.parentNode.classList.add('active');
    } else {
      e.target.classList.add('active');
    }
    const resultNum = criteria.owner_num[1].filter(num => {
      return num !== points.num;
    });
  }

  isExtsData = (code) => {
    const day = moment(code.started_at).format('YYYY-MM-DD');
    const { exts } = this.state;
    const { values } = this.props;
    let flag = false
    if (values.loc_rule === 'same_lac' && exts[day].indexOf(code.owner_ct_code.split(':')[0]) !== -1 || values.loc_rule === 'same_ci' && exts[day].indexOf(code.owner_ct_code.split(':')[1]) !== -1) {
      flag = true
    }
    if (values.loc_rule === 'scope_ct') {
      for (let i = 0; i < exts[day].length; i++) {
        const extArr = exts[day][i];
        if (extArr.indexOf(code.owner_ct_code) !== -1) {
          flag = true;
        }
      }
    }
    return flag
  }

  componentDidMount() {
    this.props.onRef(this);
    const map = document.querySelector('#map');
    const calltrackList = document.querySelector('.calltrack-list');
    const header = document.querySelector('.ice-layout-header.ice-layout-header-normal.ice-design-layout-header');
    // map.style.minHeight = `${document.documentElement.offsetHeight - (header.offsetHeight + 20 + 102)}px`;
    map.style.height = `${document.documentElement.offsetHeight - 50}px`;
    calltrackList.style.maxHeight = `${document.documentElement.offsetHeight - 50}px`;
    if (window.BMap) {
      this.renderMap();
    } else {
      installExternalLibs(document.body, this.renderMap);
    }
  }

  // onKeyDown(keyName, e, handle) {
  //   const { calltrackListTitleIndex } = this.state;
  //   const clt = document.querySelectorAll('.calltrack-list-title')[calltrackListTitleIndex];
  //   const lis = clt.querySelectorAll('.lis');
  //   console.log(lis);
  //   if (lis.length !== 0) {
  //     activeIndex += 1;
  //     if (activeIndex === lis.length) {
  //       Message.info('到达该组的最后一个基站。');
  //       clt.querySelector('.checkboxInput').click();
  //       this.setState({
  //         calltrackListTitleIndex: calltrackListTitleIndex + 1,
  //       }, () => {
  //         const afterClt = document.querySelectorAll('.calltrack-list-title')[this.state.calltrackListTitleIndex];
  //         afterClt.querySelector('.checkboxInput').click();
  //       });
  //     } else {
  //       console.log(activeIndex);
  //       for (let i = 0; i < lis.length; i++) {
  //         if (i === activeIndex) {
  //           console.log(i);
  //           lis[activeIndex].classList.add('active');
  //           lis[activeIndex].click();
  //         } else {
  //           lis[i].classList.remove('active');
  //         }
  //       }
  //     }
  //   }
  // }
  onKeyDown() {
    let { currentPr, daySet, dailyPRs, dailyNums, allDays, isSyncTime, owner_nums, ct_code } = this.state;
    const dayArr = daySet;
    if (isSyncTime) {
      if (!currentPr[0].num) {
        const num = owner_nums[0];
        currentPr = [{
          ...currentPr[0],
          num,
          index: 0,
        }];
        this.setState({
          currentPr,
        }, () => {
          const liActive = document.querySelector('.lis.current.active');
          if (liActive) {
            liActive.click();
          }
        });
      } else {
        const c = [];
        const activeIndex = 0;
        for (let i = 0; i < currentPr.length; i++) {
          const currentPrElement = currentPr[i];
          const prs = dailyPRs[currentPrElement.day] && dailyPRs[currentPrElement.day][currentPrElement.num] || [];
          let num = currentPrElement.num;
          let day = currentPrElement.day;
          let index = currentPrElement.index + 1;
          if (prs && prs.length === index) {
            let moveNextDay = true;
            const numEnableFlags = dailyNums[currentPrElement.day];

            if (this.state.owner_nums.indexOf(num) !== this.state.owner_nums.length - 1) {
              for (let j = 0; j < this.state.owner_nums.length; j++) {
                const n = this.state.owner_nums[j];
                if (j > 0 && numEnableFlags[n] && n !== currentPrElement.num) {
                  num = n;
                  index = 0;
                  moveNextDay = false;
                  break;
                }
              }
            }
            if (moveNextDay) {
              const { calltrackListTitleIndex, allDays } = this.state;
              num = Object.keys(numEnableFlags)[0];
              index = 0;
              day = dayArr[dayArr.indexOf(currentPrElement.day) + 1] || undefined;
              if (!day) {
                const i = allDays.indexOf(currentPrElement.day);
                day = allDays[i + 1];
                // const clt = document.querySelectorAll('.calltrack-list-title')[calltrackListTitleIndex];
                // clt.querySelector('.checkboxInput').click();
                this.setState({
                  calltrackListTitleIndex: i + 1,
                }, () => {
                  const afterClt = document.querySelectorAll('.calltrack-list-title')[this.state.calltrackListTitleIndex];
                  afterClt.querySelector('.checkboxInput').click();
                });
              }
            }
            c.push({
              num,
              day,
              index,
            });
          } else {
            c.push({
              num,
              day,
              index,
            });
          }
        }
        this.setState({ currentPr: c }, () => {
          const liActive = document.querySelector('.lis.active.current');
          if (liActive) {
            liActive.click();
          }
        });
      }
    } else if (!currentPr[0].num) {
      const num = owner_nums[0];
      currentPr = [{
        ...currentPr[0],
        num,
        index: 0,
      }];
      this.setState({
        currentPr,
      }, () => {
        const liActive = document.querySelectorAll('.lis.active')[0];
        if (liActive) {
          liActive.click();
        }
      });
    } else {
      const c = [];
      for (let i = 0; i < currentPr.length; i++) {
        const currentPrElement = currentPr[i];
        const prs = (ct_code[currentPrElement.day] || {}).children;
        let num = currentPrElement.num;
        let day = currentPrElement.day;
        let index = currentPrElement.index + 1;
        if (prs.length === index) {
          const moveNextDay = true;
          const numEnableFlags = dailyNums[currentPrElement.day];
          const flagsKeys = Object.keys(numEnableFlags);
          const flagsValues = Object.values(numEnableFlags);
          if (moveNextDay) {
            const { calltrackListTitleIndex, allDays } = this.state;
            num = Object.keys(numEnableFlags)[0];
            index = 0;
            day = dayArr[dayArr.indexOf(currentPrElement.day) + 1] || undefined;
            if (!day) {
              const i = allDays.indexOf(currentPrElement.day);
              day = allDays[i + 1];
              // const clt = document.querySelectorAll('.calltrack-list-title')[calltrackListTitleIndex];
              // clt.querySelector('.checkboxInput').click();
              this.setState({
                calltrackListTitleIndex: i + 1,
              }, () => {
                const afterClt = document.querySelectorAll('.calltrack-list-title')[this.state.calltrackListTitleIndex];
                afterClt.querySelector('.checkboxInput').click();
              });
            }
          }
          c.push({
            num,
            day,
            index,
          });
        } else {
          c.push({
            num,
            day,
            index,
          });
        }
      }
      this.setState({ currentPr: c }, () => {
        const liActive = document.querySelectorAll('.lis.active')[0];
        if (liActive) {
          liActive.click();
        }
      });
    }
  }

  automatic() {
    const { calltrackListTitleIndex, isAutoPlay } = this.state;
    const clt = document.querySelectorAll('.calltrack-list-title')[calltrackListTitleIndex];
    if (!clt) return;
    const lis = clt.querySelectorAll('.lis');
    if (isAutoPlay) {
      clearInterval(this.timer);
    } else {
      this.onKeyDown();
      this.timer = setInterval(() => {
        this.onKeyDown();
        if (activeIndex == lis.length - 1) {
          clearInterval(this.timer);
        }
      }, 3000);
    }
    this.setState({
      isAutoPlay: !isAutoPlay,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.criteria && Object.keys(nextProps.criteria).length !== 0 && this.state.criteria !== nextProps.criteria) {
      this.fetchData(nextProps.criteria);
      this.setState({
        criteria: nextProps.criteria,
      });
    }
    if (nextProps.login && nextProps.login.summary && nextProps.login.summary.pb_city && this.state.pb_city !== nextProps.login.summary.pb_city) {
      const pb_city = nextProps.login.summary.pb_city;
      if (this.map) {
        if (pb_city) {
          this.map.centerAndZoom(pb_city, appConfig.bigMapZoom);
        }
      }
      this.setState({
        pb_city,
      });
    }
  }
  componentWillUnmount() {
    const after = null;
    const activeIndex = -1;
    const scrollIndex = 0;
  }

  changeColor(color, index) {
    const nummberArr = [...this.state.nummberArr];
    nummberArr[index].color = color.hex;
    this.setState({
      nummberArr,
    }, () => {
      this.state.daySet.forEach(item => {
        for (const k in this.state.ct_code[item]) {
          const point = this.state.ct_code[item][k];
          this.state.nummberArr.forEach(i => {
            if (i.ownerNum === k) {
              this.handleMarker(point, i);
              // convertor.translate(point, 3, 5, this.translateCallback.bind(this, i.color));
            }
          });
        }
      });
    });
  }
  onCheckBoxClick(items, index, e) {
    this.firstCode = e.target.checked;
    let { data, daySet, currentDate, dailyPRs, dailyNums } = this.state;
    const type = items.iconType === 'add' ? 'minus' : 'add';
    data[index].iconType = type;
    if (daySet.indexOf(e.target.value) === -1) {
      daySet.push(e.target.value);
    } else {
      daySet.splice(daySet.indexOf(e.target.value), 1);
    }
    if (dailyPRs[e.target.value]) {
      delete dailyPRs[e.target.value];
    }
    if (dailyNums[e.target.value]) {
      delete dailyNums[e.target.value];
    }
    daySet = daySet.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    this.onLoadChildren(e.target.checked, items, daySet);
    if (currentDate === moment(e.target.value).format('YYYYMMDD') && !e.target.checked) {
      currentDate = null;
    }
    this.setState({
      daySet,
      dailyPRs,
      dailyNums,
      calltrackListTitleIndex: index,
      data,
      currentDate,
    });
  }
  onNumCheckBoxClick = (date, num) => {
    console.log(date, num);
    const { ct_code, daySet } = this.state;
    ct_code[date][num].isShow = !ct_code[date][num].isShow;
    if (ct_code[date][num].isShow) {
      this.formatCalltracksChildrenData(null, date, daySet);
    } else {
      this.formatCalltracksChildrenData(null, date, daySet);
    }
    this.setState({
      ct_code,
    });
  }

  _containerRefHandler(ref) {
    this.container = ref;
  }


  synchronizingTime = (e) => {
    this.firstCode = true;
    this.setState({
      isSyncTime: e.target.checked,
      currentPr: [],
    }, () => {
      if (this.state.criteria) {
        this.fetchData(this.state.criteria);
      }
    });
  }
  onSyncTimeChange = (value) => {
    this.setState({
      syncTimeVal: value,
    });
  }
  isActive = (num, day, idx, code) => {
    const { currentPr, dailyNums, isSyncTime } = this.state;
    let b = 'lis';
    day = moment(day).format('YYYY-MM-DD');
    for (let i = 0; i < currentPr.length; i++) {
      const currentPrElement = currentPr[i];
      if (isSyncTime) {
        if (currentPrElement.index === idx && currentPrElement.num === num && currentPrElement.day === day && (dailyNums[day] || {})[num]) {
          b = 'lis active current';
          break;
        }
      } else if (currentPrElement.index === idx && currentPrElement.day === day && (dailyNums[day] || {})[num]) {
        b = 'lis active';
        break;
      }
    }
    b = this.isExtsData(code) ? b + ' highlight' : b
    return b;
  }

  onChenkBoxChange = (value) => {
    console.log(value);
    const liActive = document.querySelector('.lis.active');
    this.setState({
      checkBoxVal: value,
    }, () => {
      if (liActive) {
        liActive.click();
      }
    });
  }

  getColor = (date) => {
    if (this.state.daySet.length === 0) return;
    let idx = this.state.daySet.indexOf(date);
    idx = idx >= 10 ? idx - 10 : idx;
    return colors[idx];
  }

  onSelectChange = async (value) => {
    const { criteria, ct_code, daySet, data } = this.state;
    criteria.owner_num[1] = value;
    if (value.length > 0) {
      this.setState({
        owner_nums: value,
        criteria,
      }, () => {
        const { currentPr } = this.state;
        if (currentPr.length > 0) {
          if (this.map) {
            this.map.clearOverlays();
          }
          this.onLoadChildren(true, { key: currentPr[0].day }, daySet);
        }
      });
    } else {
      const checkBox = document.querySelectorAll('.checkboxInput');
      checkBox.forEach(dom => {
        if (dom.checked) {
          dom.click();
        }
      });
      this.setState({
        owner_nums: value,
        currentPr: [],
        ct_code: {},
        daySet: [],
        dailyNums: {},
      }, () => {
        this.onLoadChildren(false, data[0].started_day, daySet);
      });
    }
  }

  render() {
    const { ct_code, currentPr, owner_nums, isSyncTime } = this.state;
    return (
      <Hotkeys
        keyName="Enter"
        onKeyDown={this.onKeyDown}
      >
        <div className="calltrack-body" style={{ padding: 0, height: '30px', lineHeight: 'normal' }}>
          <div style={{ display: 'flex', flex: '0 0 75%', justifyContent: 'flex-end' }}>
            <CheckboxGroup value={this.state.checkBoxVal} dataSource={list} onChange={this.onChenkBoxChange} />
          </div>
        </div>
        <div className="calltrack-box" id="map">
          <div className="calltrack-map">
            {/* <div onClick={this.automatic} className="automatic"><FontAwesomeIcon icon={faPlayCircle} /></div> */}
            {this.state.currentDate ? <div className="current">当前日期: {this.state.currentDate}</div> : null}
            <div id="calltrackMap" />
            {
              this.state.calltrackList.map((item, index) => {
                return (
                  <div className="calltrack-list" key={item + index} style={{ top: `${index * 50}%` }}>
                    <div id={item} style={{ height: '100%' }} />
                  </div>
                );
              })
            }
          </div>
          <div className="calltrack-list" ref={this._containerRefHandler.bind(this)}>
            <Loading tip={appConfig.LOADING_TEXT} visible={this.state.isListLoading} style={{ width: '100%', height: '100%' }}>
              {
                this.state.data.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    {appConfig.NO_DATA_TEXT}
                  </div>
                ) : (
                  this.state.data.map((items, index) => {
                    return (
                      <div key={items.key + index} className="calltrack-list-title">
                        <Affix container={() => this.container} offsetTop={0} useAbsolute style={{ zIndex: 15 }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', backgroundColor: '#eee', position: 'relative' }}>
                            <input className="checkboxInput" type="checkbox" value={items.key} onClick={(e) => { this.onCheckBoxClick(items, index, e); }} />
                            <span style={{ marginLeft: '5px', verticalAlign: 'middle', backgroundColor: this.getColor(items.key) }}>
                              {items.label}
                            </span>
                            <div style={{ marginLeft: '5px', width: '100%', padding: '0 10px', display: 'inline-flex', flexDirection: 'row', float: 'right', position: 'absolute', left: 0, bottom: 0, height: '2px', overflow: 'hidden' }}>
                              {items.event && items.event.map((item, idx) => {
                                return (
                                  <Balloon key={item.label + idx.toString()} trigger={<span style={{ backgroundColor: item.color, color: '#fff', flex: 1, display: items.key === moment(item.started_at).format('YYYY-MM-DD') || index === scrollIndex ? 'block' : 'none' }}>{moment(item.started_at).format('MMDD')}-{moment(item.ended_at).format('MMDD')}</span>} align="lt" style={{ width: 350 }}>
                                    <div>
                                      {
                                        items.event && [...items.event].reverse().map(i => {
                                          return (
                                            <p style={{ marginLeft: '5px' }} key={item.started_at + i.name}>{moment(i.started_at).format('YYYYMMDD')}-{moment(i.ended_at).format('YYYYMMDD')}: {i.name}</p>
                                          );
                                        })
                                      }
                                    </div>
                                  </Balloon>
                                );
                              })
                              }
                            </div>
                          </div>
                        </Affix>

                        <div className={items.iconType === 'minus' ? 'calltrack-list-body' : 'calltrack-list-body hide'} style={{ padding: '0 10px' }}>
                          {
                            owner_nums.map((num, indexs) => {
                              const item = ct_code[items.key] && ct_code[items.key][num] || {};
                              const n = num.substring(num.length - 2);
                              return (
                                <div id={items.key + num} key={items.key + indexs}>
                                  <div style={{ margin: '5px 0' }}>
                                    {/* <input className="checkboxInput" type="checkbox" checked={item.isShow} value={items.key} onClick={(e) => { this.onNumCheckBoxClick(items.key, num); }} /> */}
                                    {
                                      item.labelInfo ? (
                                        <Fragment>
                                          <span style={{ verticalAlign: 'middle', marginLeft: '5px' }}>{item.labelInfo.ownerNum}</span>
                                          <IceLabel style={{ backgroundColor: item.labelInfo.color, color: '#fff', marginLeft: '10px' }}>{item.labelInfo.label}</IceLabel>
                                        </Fragment>
                                      ) : (
                                        <span style={{ verticalAlign: 'middle', marginLeft: '5px' }}>{num}</span>
                                      )
                                    }
                                  </div>
                                  <ul style={{ display: item.isShow ? 'block' : 'none' }}>
                                    {
                                      item.children && item.children.map((code, idx) => {
                                        const c = code.owner_ct_code.split(':');
                                        return (
                                          <li key={code.peer_num + idx}
                                              ref={e => this.li = e}
                                              onClick={(e) => {
                                                  this.onChildrenClick(e, code, idx, {
                                                    current: item.points[code.owner_ct_code] && item.points[code.owner_ct_code].length > 0 ? item.points[code.owner_ct_code] : null,
                                                    after: item.children[idx + 1] && (item.points[item.children[idx + 1].owner_ct_code] || []).length > 0 ? item.points[item.children[idx + 1].owner_ct_code] : null,
                                                    num,
                                                  });
                                              }}
                                            className={this.isActive(num, code.started_at, idx, code)}
                                          >
                                            <span className="cmTime" style={{ color: 'red', marginRight: '5px' }}>{moment(code.started_at).format('HH:mm')}</span>
                                            <span style={{ marginRight: '5px' }}>
                                              {
                                          item.labelInfo ? (
                                            <Balloon
                                              trigger={
                                                <div style={{ display: 'inline-block', backgroundColor: item.labelInfo.color || '#666' }}>
                                                  <span style={{ color: '#fff' }}>{n}</span>
                                                </div>
                                              }
                                              align="t"
                                            >
                                              <span>{item.labelInfo.ownerNum}</span>
                                              <IceLabel style={{ backgroundColor: item.labelInfo.color, color: '#fff', marginLeft: '10px' }}>{item.labelInfo.label}</IceLabel>
                                            </Balloon>
                                          ) : (
                                            <span style={{ color: 'blue' }}>{n}</span>
                                          )
                                        }
                                            </span>
                                            <span style={{ color: '#000' }}>{c[0]}</span>:<span style={{ color: '#D1832F' }}>{c[1]}</span>
                                            <span style={{ marginLeft: '5px' }}>
                                              {
                                          code.codeLabel ? (
                                            <Balloon
                                              trigger={
                                                <span>
                                                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: code.codeLabel.marker_color }} />
                                                </span>
                                              }
                                              align="t"
                                            >
                                              {/* { */}
                                              {/* item.labelInfo ? ( */}
                                              {/* <div> */}
                                              {/* <span>{item.labelInfo.ownerNum}</span> */}
                                              {/* <IceLabel style={{ backgroundColor: item.labelInfo.color, color: '#fff', marginLeft: '10px' }}>{item.labelInfo.label}</IceLabel> */}
                                              {/* </div> */}
                                              {/* ) : ( */}
                                              {/* <div> */}
                                              {/* <span>{num}</span> */}
                                              {/* </div> */}
                                              {/* ) */}
                                              {/* } */}
                                              <div style={{ marginTop: '10px' }}>
                                                <span>{code.codeLabel.ct_code}</span>
                                                <IceLabel style={{ backgroundColor: code.codeLabel.marker_color, color: '#fff', marginLeft: '10px' }}>{code.codeLabel.label}</IceLabel>
                                              </div>
                                            </Balloon>
                                          ) : null
                                        }
                                            </span>
                                            <div style={{ display: 'inline-block', float: 'right' }}>
                                              <span style={{ color: '#ccc', marginRight: '5px' }}>{code.count}</span>
                                              <span style={{ fontSize: '12px', transform: 'scale(.8)', display: 'inline-block' }}>{code.owner_ct_dist || code.owner_ct_town}</span>
                                            </div>
                                          </li>
                                        );
                                      })
                                    }
                                  </ul>
                                </div>
                              );
                            })
                          }
                        </div>
                      </div>
                    );
                  })
                )
              }
            </Loading>
          </div>
        </div>
      </Hotkeys>
    );
  }
}

export default connect(
  state => ({
    criteria: state.search.criteria,
    cellTowers: state.cellTowers,
    caseId: state.cases.case.id,
    labelPNItems: state.labelPNs.items,
    caseEvents: state.caseEvents,
    ownerNums: state.search.ownerNums,
    labelCells: state.labelCells,
    login: state.login,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...calltrackActions, ...SearchStoreActions }, dispatch),
  }),
)(MeetanalyzeMap);
