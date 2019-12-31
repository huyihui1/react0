import React, {Component} from 'react';
import {Input, Select, DatePicker, Button, Message, Dialog, Tag, Icon} from '@alifd/next';
import IceContainer from '@icedesign/container';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import IceLabel from '@icedesign/label';
import {FormBinderWrapper, FormBinder, FormError} from '@icedesign/form-binder';

import AdvancedSearch from '../../../common/AdvancedSearch/index';
import TourAgent from '../../../common/TourAgent';
import {formatAdvancedSearch, formatFormData, keyMap, renameLabel} from '../../../../utils/utils';
// import SearchBarList from './SearchBarList';
import {actions} from '../../../../stores/SearchStore/index';
import {actions as pbStatActions} from '../../../../stores/pbStat/index';
import {actions as labelPNActions} from '../../../../stores/labelPN';
import {actions as FindNewsActions} from '../../../../stores/FindNews/index';

import AllChartTitle from './../../../common/SearchBox/AllChartTitle';
import MultipleDateSelect from './../../../common/SearchBox/MultipleDateSelect';
import NumberSelector from '../../../common/SearchBox/NumberSelector';
import PageTitle from '../../../common/PageTitle/index';


const {Option} = Select;

import moment from 'moment'
import {POSITIVE_NUM} from "../../../../fieldConstraints";


class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advanced: false,
      conditions: [],
      values: {
        ciFmt: '16进制',
        lacFmt: '16进制',
        owner_loc_type: '包含',
        peer_loc_type: '包含',
        owner_lac_type: '包含',
        owner_ci_type: '包含',
        owner_ct_code_type: '包含',
        min_started_day: '',
        loc_type: '包含',
        correlation: '2'
      },
      initValues: {
        ciFmt: '16进制',
        lacFmt: '16进制',
        owner_loc_type: '包含',
        peer_loc_type: '包含',
        owner_lac_type: '包含',
        owner_ci_type: '包含',
        owner_ct_code_type: '包含',
        min_started_day: '',
        loc_type: '包含',
        correlation: '2'
      },
      advancedSearch: null,
      visible: false,
      searchName: null,
      isShow: false,
      labelPNs: [],
      summary: null,
      startDay: null
    };
    this.oldSearchVal = null;
    this.showAdvancedSearch = this.showAdvancedSearch.bind(this);
    this.addConditions = this.addConditions.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.saveSearch = this.saveSearch.bind(this);
    this.onSearchNameChange = this.onSearchNameChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.onMysearchClose = this.onMysearchClose.bind(this);
    this.onMysearchClick = this.onMysearchClick.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.onArrowClick = this.onArrowClick.bind(this);
    this.getAlyzDayData = this.getAlyzDayData.bind(this);
    this.ownerNumRender = this.ownerNumRender.bind(this);
    this.getRequest = this.getRequest.bind(this);
  }

  showAdvancedSearch() {
    this.setState({
      advanced: !this.state.advanced,
    });
  }

  resetSearch(value) {
    this.setState({
      values: Object.assign({}, this.state.initValues),
      correlation: 2
    }, () => {
      this.onFormChange(this.state.values)
      this.props.actions.clearFindNewsDataFindNews()
    });
  }

  onArrowClick() {
    this.setState({
      isShow: !this.state.isShow,
    }, () => {
      setTimeout(() => {
        this.props.windowScroller && this.props.windowScroller.updatePosition();
      }, 200);
    });
  }

  addConditions(v, values) {
    const conditions = [];
    for (const key in v) {
      if (key === '本方号码') {
        let arr;
        if (v[key]) {
          arr = v[key].split(', ');
        } else {
          arr = []
        }
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < this.state.labelPNs.length; j++) {
            const labelPNs = this.state.labelPNs[j];
            if (arr[i] === labelPNs.num) {
              arr[i] = labelPNs;
              break
            }
          }
        }
        for (let i = 0; i < arr.length; i++) {
          if (typeof arr[i] === 'string') {
            for (let j = 0; j < this.props.search.ownerNums.length; j++) {
              const keyElement = this.props.search.ownerNums[j];
              if (arr[i] === keyElement.owner_num) {
                arr[i] = {
                  num: keyElement.owner_num,
                  label: keyElement.owner_name,
                }
              }
            }
          }
        }
        v[key] = arr.length > 0 ? arr : null;
      }
      v[key] && conditions.push([key, v[key]]);
    }
    this.setState({
      conditions,
      values: {
        ...this.state.values,
        ...values,
      },
      // advancedSearch: values,
    }, () => {
      this.props.windowScroller && this.props.windowScroller.updatePosition();
    });
  }

  renameLabel(values) {
    const keyMap = {
      min_started_day: '新号码最早出现时间',
      owner_num: '本方号码',
      peer_num: '对方号码',
      peer_num_type: '对方号码类型',
      started_at: '日期时间',
      started_day: '实际日期',
      started_time: '时间',
      weekday: '周几',
      owner_lac: '位置区号',
      owner_ci: '小区号',
      alyz_day: '名义日期',
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
      peer_num_attr: '号码归属地',
    };
    const tempObj = {};
    for (const key in values) {
      let newKey = keyMap[key];
      if (key === 'peer_num_attr' && values['loc_type'] === '排除') {
        newKey = `排除${keyMap[key]}`;
      }
      if (newKey) {
        if (Array.isArray(values[key])) {
          tempObj[newKey] = values[key].join(',').replace(/,/ig, ', ');
        } else {
          tempObj[newKey] = values[key];
        }
      }
    }
    return tempObj;
  }

  async fetchData() {
    const {caseId} = this.props;
    const {getOwnerNumSearch, getPeerNumsSearch, fetchMySearchSearch, fetchLabelPNs} = this.props.actions;
    getOwnerNumSearch({case_id: caseId});
    // getPeerNumsSearch({case_id: caseId});
    fetchMySearchSearch({case_id: caseId});
    const res = await fetchLabelPNs({caseId}, {
      query: {
        page: 1,
        pagesize: 100,
      },
    });
    if (res) {
      this.setState({
        labelPNs: res.body.data,
      });
    }
  }

  onFormChange(values) {
    if (values.min_started_day) {
      values.min_started_day = moment(values.min_started_day).format('YYYY-MM-DD');
    } else {
      delete values.min_started_day
    }

    const keyMap = {
      owner_num: '本方号码',
      peer_num: '对方号码',
      bill_type: '计费类型',
      alyz_day: '名义日期',
    };
    const tempObj = {};
    for (const key in values) {
      const newKey = keyMap[key];
      if (newKey) {
        if (Array.isArray(values[key])) {
          tempObj[newKey] = values[key].join(',').replace(/,/ig, ', ');
        } else {
          tempObj[newKey] = values[key];
        }
      }
    }
    this.addConditions(this.renameLabel({...values}), values);
  }

  // onChange(val) {
  //   // const { actions } = this.props;
  //   // actions.setCorrelationFindNews({val})
  //   if (POSITIVE_NUM.test(val)) {
  //     this.setState({correlation: val})
  //   } else {
  //     this.setState({correlation: ''})
  //   }
  //
  // }


  validateFields = () => {
    const {validateAll} = this.refs.form;
    const {setCriteriaSearch, clearPBStatStoreChart, setCorrelationFindNews} = this.props.actions;
    let v = null;
    validateAll((errors, values) => {
      // if (Object.keys(values).length === 0) {
      //   return false;
      // }
      const val = {...values};
      // console.log(values);
      setCorrelationFindNews({
        val: this.state.correlation,
        min_started_day: val.min_started_day,
        loc_type: val.loc_type
      });
      if (val.alyz_day) {
        let newArr = [];
        val.alyz_day.forEach(item => {
          newArr = [...newArr, ...item.split('~')];
        });
        val.alyz_day = newArr;
      }
      // if (val.started_day) {
      //   let newArr = [];
      //   val.started_day.forEach(item => {
      //     newArr = [...newArr, ...item.split('~')];
      //   });
      //   val.started_day = newArr;
      // }
      if (val.started_at) {
        let newArr = [];
        val.started_at.forEach(item => {
          newArr = [...newArr, ...item.split('~')];
        });
        val.started_at = newArr;
      }
      if (val.started_time) {
        let newArr = [];
        val.started_time.forEach(item => {
          newArr = [...newArr, ...item.split('-')];
        });
        val.started_time = newArr;
      }
      if (val.duration) {
        let newArr = [];
        val.duration.forEach(item => {
          newArr = [...newArr, ...item.split('-')];
        });
        val.duration = newArr;
      }

      if (val.owner_lac) {
        let newArr = [];
        if (val.lacFmt === '16进制') {
          val.owner_lac.forEach(item => {
            newArr.push(parseInt(item, 16));
          });
          val.owner_lac = newArr;
        } else {
          val.owner_lac.forEach(item => {
            if (isNaN(Number(item))) return;
            newArr = [...newArr, item * 1];
          });
          val.owner_lac = newArr;
        }
      }
      if (val.owner_ci) {
        let newArr = [];
        if (val.ciFmt === '16进制') {
          val.owner_ci.forEach(item => {
            newArr.push(parseInt(item, 16));
          });
          val.owner_ci = newArr;
        } else {
          val.owner_ci.forEach(item => {
            if (isNaN(Number(item))) return;
            newArr = [...newArr, item * 1];
          });
          val.owner_ci = newArr;
        }
      }

      if (!val.min_started_day) {
        delete val.min_started_day
      }


      delete val.lacFmt;
      delete val.ciFmt;
      clearPBStatStoreChart();
      setCriteriaSearch({...val});
      v = val
    });
    return v
  };

  onSearchNameChange(name) {
    this.setState({
      searchName: name,
    });
  }

  saveSearch() {
    if (this.state.searchName) {
      let values = formatFormData(this.validateFields(false), true);
      values = formatAdvancedSearch(values);
      let res = {criteria: {...values}};
      const params = {
        name: this.state.searchName,
        subject: 'pbill',
        value: JSON.stringify(res),
      };
      this.props.actions.createMySearch({case_id: this.props.caseId, ...params})
        .then(res => {
          if (res.body.meta && res.body.meta.success) {
            this.props.actions.fetchMySearchSearch({case_id: this.props.caseId});
          }
        });
      this.onClose();
    }
  }

  onOpen() {
    this.setState({
      visible: true,
    });
  }

  onClose() {
    this.setState({
      visible: false,
      searchName: null,
    });
  }

  disabledEndDate = (endValue) => {
    // const { startValue } = this.state;
    // if (!endValue || !startValue) {
    //   return false;
    // }
    // return endValue.valueOf() <= startValue.valueOf();
  }

  onMysearchClose(id) {
    this.props.actions.removeMySearch({case_id: this.props.caseId, id},);
  }

  onMysearchClick(val) {
    let {values} = this.state;
    if (this.oldSearchVal) {
      for (const k in this.oldSearchVal) {
        if (values[k] && values[k] === this.oldSearchVal[k]) {
          delete values[k]
        }
      }
    }
    this.oldSearchVal = val
    val = {...val};
    this.setState({
      values: Object.assign(values, val),
    }, () => {
      this.addConditions(renameLabel({...this.state.values}), {});
    });
  }

  getAlyzDayData(key, val) {
    const {values} = this.state;
    values[key] = val;
    this.onFormChange(values);
    this.setState({
      values,
    });
  }

  componentDidMount() {
    this.fetchData();
    this.setState({
      isShow: this.props.isShow || false,
    });
    console.log(this.props.route);
    this.getRequest(this.props.route.location.search);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login && nextProps.login.summary && JSON.stringify(nextProps.login.summary) !== JSON.stringify(this.state.summary)) {
      this.setState({
        summary: nextProps.login.summary,
        startDay: nextProps.login.summary.pb_started_at
      })
    }
  }

  getRequest(search) {
    const theRequest = {};
    if (search) {
      const str = search.substr(1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = [strs[i].split('=')[1]];
      }
      console.log(theRequest);
      if (theRequest.owner_lac && theRequest.owner_ci) {
        theRequest.ciFmt = '16进制';
        theRequest.lacFmt = '16进制';
      }
      this.setState({values: {...this.state.values, ...theRequest}}, () => {
        this.onFormChange(this.state.values);
      });
    }
    return theRequest;
  }


  componentWillUnmount() {
    this.props.actions.clearCriteriaSearch();
  }

  ownerNumRender(item) {
    const result = this.state.labelPNs.find((x) => {
      return x.num === item.value;
    });
    if (result) {
      return (
        <div>
          <span>
            {result.num}
          </span>
          <IceLabel inverse={false} style={{
            fontSize: '12px',
            marginLeft: '5px',
            backgroundColor: result.label_bg_color,
            color: result.label_txt_color,
            padding: '2px'
          }}>{result.label}</IceLabel>
        </div>
      );
    }
    return item.value;
  }

  render() {
    const {search, page} = this.props;
    const button = <Button style={{marginRight: '15px'}} component="a"
                           href={`/#/cases/${this.props.caseId}/pb_filesimport`}>文件导入</Button>;
    const startValue = moment('2017-11-20', 'YYYY-MM-DD', true);
    const showAdvancedCondition = this.state.conditions.map((cond, index) => {
      // console.log(cond);
      return (
        <Message key={cond[0]} shape="toast" style={{display: 'inline-block'}}>
          <span
            style={{fontSize: '12px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>
            <span style={{marginBottom: '5px'}}>{`${cond[0]}:`}</span>
            {
              !Array.isArray(cond[1]) ? (
                <span style={{
                  fontSize: '12px',
                  marginRight: '10px',
                  marginBottom: '5px'
                }}>{cond[0].indexOf('日期') !== -1 || cond[0] === '新号码最早出现时间' || cond[0] === '时间' || cond[0] === '时长' ? cond[1] : cond[1].replace(/(\d+)-/ig, '')}</span>
              ) : (
                cond[1].map(item => {
                  if (typeof item === 'object') {
                    return (
                      <span key={item.num}
                            style={{fontSize: '12px', marginRight: '10px', marginBottom: '5px'}}><span>{item.num}</span><IceLabel
                        style={{
                          backgroundColor: item.label_bg_color,
                          marginLeft: '5px',
                        }}>{item.label}</IceLabel></span>
                    );
                  }
                  return (
                    <span key={item} style={{fontSize: '12px', marginRight: '10px', marginBottom: '5px'}}>{item},</span>
                  );
                })
              )
            }
          </span>
        </Message>
      );
    });

    return (
      <div>
        <div className={this.state.isShow ? 'PBSearch show' : 'PBSearch'}>
          {/*<div style={{...styles.nav, marginBottom: '10px'}}>*/}
          {/*<h2 style={styles.breadcrumb}>*/}
          {/*{this.props.title}*/}
          {/*{page ? <TourAgent page={page}/> : null}*/}
          {/*</h2>*/}
          {/*<div/>*/}
          {/*<div>*/}
          {/*{*/}
          {/*this.props.showBtn ? this.props.showBtn(this.props.caseId) : null*/}
          {/*}*/}
          {/*</div>*/}
          {/*</div>*/}
          <PageTitle title={this.props.title} tour={{page: "newNums"}}/>
          <IceContainer style={styles.container}>
            <div style={styles.row}>
              <div style={styles.left} data-tut="reactour__search">
                <FormBinderWrapper
                  ref="form"
                  value={this.state.values}
                  onChange={this.onFormChange}
                >
                  <div style={styles.container2}>
                    <div>
                      <span style={styles.caseNumber}>
                        <label style={styles.label}>
                          <span style={{whiteSpace: 'nowrap'}}>本方号码:</span>
                           <FormBinder name="owner_num">
                              <NumberSelector name="owner_num" labelGroup={this.props.labelGroup}
                                              dataSource={search.ownerNums} values={this.state.values}
                                              onFormChange={this.onFormChange} isLabel={this.state.labelPNs}/>
                          </FormBinder>
                        </label>
                      </span>
                      <br/>
                      <span style={styles.caseNumberNew}>
                        <label style={styles.label}>
                          <span style={{whiteSpace: 'nowrap'}}>新号码至少与上面本方号码中:</span>
                          {/*<Input size="small" onChange={this.onChange} style={{...styles.shortInput}} value={this.state.correlation}/>*/}
                          <FormBinder name='correlation'>
                            <Input size="small" style={{...styles.shortInput}}/>
                          </FormBinder>
                            <span style={{whiteSpace: 'nowrap'}}>个号码有联系</span>
                        </label>
                      </span>
                      <br/>
                      <span style={styles.caseNumber}>
                        <label>
                          <span style={{whiteSpace: 'nowrap'}}>新号码最早出现时间:</span>
                          <FormBinder name="min_started_day" required>
                              {/*<DatePicker style={{ ...styles.shortInput, width: '90px', heigth:'20px' }} placeholder=" "/>*/}
                            <DatePicker name="min_started_day"
                                        defaultVisibleMonth={this.state.startDay ? () => moment(this.state.startDay, "YYYY-MM") : () => moment(new Date(), "YYYY-MM")}/>
                          </FormBinder>
                        </label>
                      </span>
                      <br/>
                      <span style={{...styles.caseNumberNew, width: '400px'}}>
                        <label style={styles.label}>
                          <span style={{whiteSpace: 'nowrap'}}>新号码归属地:</span>
                          <FormBinder name={'loc_type'}>
                            <Select style={{minWidth: '80px'}}>
                              <Option value="包含">
                                包含
                              </Option>
                              <Option value="排除">
                                排除
                              </Option>
                            </Select>
                          </FormBinder>
                          <FormBinder name="peer_num_attr">
                            <Select mode='tag' style={{width: '90%'}} placeholder="请输入新号码归属地" hasClear>

                            </Select>
                          </FormBinder>
                        </label>
                      </span>
                    </div>


                    <AdvancedSearch visible={this.state.advanced}
                                    onClose={this.showAdvancedSearch}
                                    addConditions={this.addConditions}
                                    values={this.state.values}
                                    resetSearch={this.resetSearch}
                                    dataSource={search}
                                    getAlyzDayData={this.getAlyzDayData}
                    />
                  </div>
                </FormBinderWrapper>
              </div>
              {/* 我的搜索 */}
              <div className="mySearch" style={styles.right} data-tut="reactour__mySearch">
                <h3 style={{
                  marginTop: 0,
                  borderBottom: '1px solid #2375fa',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>我的筛选模板</h3>
                {
                  search && search.mySearchs.map((item, index) => {
                    return (
                      <Tag.Closeable key={item.name + index} status="info" onClick={() => {
                        this.onMysearchClick(item.value);
                      }} onClose={() => {
                        this.onMysearchClose(item.id);
                      }}>{item.name}</Tag.Closeable>
                    );
                  })
                }
              </div>
            </div>
            {showAdvancedCondition}
            <div style={styles.search}>
              <span>
                <Button
                  type="primary"
                  style={styles.button}
                  onClick={this.validateFields}
                >
                    查询
                </Button>
              </span>
              <span>
                <Button
                  type="secondary"
                  style={styles.button}
                  onClick={this.resetSearch}
                >
                    清空
                </Button>
              </span>
              <span>
                <Button
                  type="secondary"
                  style={styles.buttonRight}
                  onClick={this.showAdvancedSearch}
                >
                    更多筛选条件
                </Button>
              </span>
              <span>
                <Button
                  type="secondary"
                  onClick={() => {
                    this.onOpen();
                  }}
                >
                      保存筛选条件为模板
                </Button>
                <Dialog
                  title="保存筛选条件为模板"
                  visible={this.state.visible}
                  onOk={() => {
                    this.saveSearch();
                  }}
                  onCancel={this.onClose.bind(this)}
                  onClose={this.onClose}
                >
                      搜索名称: <Input trim onChange={this.onSearchNameChange}/>
                </Dialog>
              </span>
            </div>
          </IceContainer>
        </div>
        {
          this.state.isShow ? null : this.state.conditions.length > 0 ? (
            <div style={{background: '#fff', padding: '10px'}}>
              {
                showAdvancedCondition
              }
            </div>
          ) : (
            <PageTitle title={this.props.title} tour={{page: "newNums"}} collapsed={true}/>
          )
        }
        <div className="arrow1">
          <Icon type={this.state.isShow ? 'arrow-up' : 'arrow-down'} size="small" onClick={this.onArrowClick}/>
        </div>
      </div>
    );
  }
}

{/*<div style={styles.nav}>*/
}
{/*<h2 style={styles.breadcrumb}>*/
}
{/*{this.props.title}*/
}
{/*</h2>*/
}
{/*<div style={{*/
}
{/*display: 'inline-block',*/
}
{/*padding: 0,*/
}
{/*position: 'absolute',*/
}
{/*width: '100%',*/
}
{/*textAlign: 'center',*/
}
{/*bottom: '2px'*/
}
{/*}}*/
}
{/*>*/
}
{/*<Icon type="prompt" size="small" style={{color: '#5485f7', marginRight: '5px'}}/>*/
}
{/*点击下拉展开搜索选项*/
}
{/*</div>*/
}
{/*<div>*/
}
{/*{*/
}
{/*this.props.showBtn ? <Button style={{marginRight: '15px'}} component="a"*/
}
{/*href={`/#/cases/${this.props.caseId}/pb_filesimport`}>文件导入</Button> : null*/
}
{/*}*/
}
{/*</div>*/
}
{/*</div>*/
}

const styles = {
  nav: {
    position: 'relative',
    background: 'white',
    height: '72px',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumb: {
    borderLeft: '5px solid #447eff',
    paddingLeft: '16px',
    margin: '0 0 0 20px',
  },
  container: {
    margin: '0 0 20px 0',
    letterSpacing: '2px',
    paddingBottom: 0,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  left: {
    flex: '0 0 60%',
  },
  right: {
    flex: '0 0 38%',
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    // whiteSpace: 'nowrap',
    alignItems: 'center',
  },
  container2: {
    margin: '0',
    letterSpacing: '2px',
  },
  other: {
    margin: '5px 0',
  },
  input: {
    width: '100%',
    margin: '0 4px',
  },
  select: {
    verticalAlign: 'middle',
    width: '100%',
  },
  selectSmall: {
    verticalAlign: 'middle',
    width: '80px',
  },
  selectSmallest: {
    verticalAlign: 'middle',
    minWidth: '40px',
  },
  shortInput: {
    width: '40px',
    margin: '0 4px',
    height: '20px',
    border: 'none',
    borderBottom: '1px solid #111',
    borderRadius: 0,
    textAlign: 'center',
  },
  longInput: {
    // width: '825px',
  },
  caseNumber: {
    marginTop: '15px',
    marginRight: '16px',
    display: 'inline-block',
    width: '100%',
  },
  caseNumberNew: {
    marginTop: '15px',
    marginRight: '6px',
    display: 'inline-block',
    width: '360px',
  },
  caseNumber2: {
    marginTop: '10px',
    display: 'inline-block',
    width: '100%',
  },
  date: {
    marginRight: '24px',
  },
  button: {
    margin: '0 4px',
    letterSpacing: '2px',
  },
  buttonRight: {
    margin: '0 4px',
    letterSpacing: '2px',
  },
  search: {
    textAlign: 'center',
    margin: '20px 0',
  },
};

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    search: state.search,
    route: state.route,
    login: state.login
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions, ...pbStatActions, ...labelPNActions, ...FindNewsActions}, dispatch),
  }),
)(SearchBar);
