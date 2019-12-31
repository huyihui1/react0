import React, {Component, Fragment} from 'react';
import {Input, Select, DatePicker, Button, Message, Dialog, Tag, Icon, Radio} from '@alifd/next';
import IceContainer from '@icedesign/container';
import {connect} from 'react-redux';
import IceLabel from '@icedesign/label';
import {bindActionCreators} from 'redux';
import {FormBinderWrapper, FormBinder, FormError} from '@icedesign/form-binder';

import AdvancedSearch from '../../../common/AdvancedSearch';

import {renameLabel, formatFormData} from '../../../../utils/utils';
import {formatAdvancedSearch} from '../../../../utils/panelSearch';
import {actions} from '../../../../stores/SearchStore/index';
import {actions as pbStatActions} from '../../../../stores/pbStat/index';
import {actions as connectionActions} from '../../../../stores/connections';
import {actions as labelPNActions} from '../../../../stores/labelPN';
import NumberSelector from '../../../common/SearchBox/NumberSelector';

import '../../connections.css';
import {POSITIVE_NUM} from '../../../../fieldConstraints'
import PageTitle from '../../../common/PageTitle/index';


const {Option} = Select;

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
        show_peer_num: 1,
        top_n: 20,
        call_limit: 2
      },
      initValues: {
        ciFmt: '16进制',
        lacFmt: '16进制',
        owner_loc_type: '包含',
        peer_loc_type: '包含',
        owner_lac_type: '包含',
        owner_ci_type: '包含',
        owner_ct_code_type: '包含',
        show_peer_num: 1,
        top_n: 20,
        call_limit: 2
      },
      advancedSearch: null,
      visible: false,
      searchName: null,
      isShow: true,
      labelPNs: [],
      initMySearchs: [],
      mySearchs: []
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
    this.onMessageClose = this.onMessageClose.bind(this);
    this.onArrowClick = this.onArrowClick.bind(this);
    this.getAlyzDayData = this.getAlyzDayData.bind(this);
    this.ownerNumRender = this.ownerNumRender.bind(this);
  }

  showAdvancedSearch() {
    this.setState({
      advanced: !this.state.advanced,
    });
  }

  resetSearch(value) {
    this.setState({
      values: Object.assign({}, this.state.initValues),
    }, () => {
      this.onFormChange(this.state.values)
    });
    this.props.actions.clearCriteriaSearch();
    this.props.clearMyChart.myChart.clear();
    this.props.clearMyChart.renderMyChart();
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
          arr = [];
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

  async fetchData() {
    const {caseId} = this.props;
    const {getOwnerNumSearch, fetchMySearchSearch, fetchLabelPNs} = this.props.actions;
    getOwnerNumSearch({case_id: caseId});
    fetchMySearchSearch({case_id: caseId});
    const res = await fetchLabelPNs({caseId});
    if (res) {
      this.setState({
        labelPNs: res.body.data,
      });
    }
  }

  onFormChange(values) {
    if (POSITIVE_NUM.test(values.top_n)) {
      this.state.values.top_n = values.top_n;
      this.setState({values: this.state.values});
    } else {
      this.state.values.top_n = '';
      this.setState({values: this.state.values});
    }
    if (POSITIVE_NUM.test(values.call_limit)) {
      this.state.values.call_limit = values.call_limit;
      this.setState({values: this.state.values});
    } else {
      this.state.values.call_limit = '';
      this.setState({values: this.state.values});
    }
    //call_limit

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
    this.addConditions(renameLabel({...values}), values);
  }

  validateFields = (bool = true) => {
    const {validateAll} = this.refs.form;
    const {setNoFormatCriteriaSearch, clearPBStatStoreChart, setSearchConnection} = this.props.actions;
    let v = null
    validateAll((errors, values) => {
      // if (Object.keys(values).length === 0) {
      //   return false;
      // }
      let data = {
        criteria: {},
        view: {},
        adhoc: {},
        case_id: this.props.caseId
      }
      const val = {...values};
      console.log(values);
      const top_n = val.top_n * 1;
      const call_limit = val.call_limit * 1;
      const show_peer_num = val.show_peer_num;
      if (val.alyz_day) {
        let newArr = [];
        val.alyz_day.forEach(item => {
          newArr = [...newArr, ...item.split('~')];
        });
        val.alyz_day = newArr;
      }
      if (val.started_day) {
        let newArr = [];
        val.started_day.forEach(item => {
          newArr = [...newArr, ...item.split('~')];
        });
        val.started_day = newArr;
      }
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
      if (bool) {
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
        delete val.lacFmt;
        delete val.ciFmt;
        delete val.top_n;
        delete val.call_limit;
        delete val.show_peer_num;
        data.criteria = val
        data.adhoc = {top_n, call_limit, show_peer_num}
        clearPBStatStoreChart();
        setNoFormatCriteriaSearch(data);
      } else {
        if (!val.owner_ci || val.owner_ci && val.owner_ci.length === 0) {
          delete val.ciFmt;
        }
        if (!val.owner_lac || val.owner_lac && val.owner_lac.length === 0) {
          delete val.lacFmt;
        }
        data.criteria = val
        data.adhoc = {top_n, call_limit, show_peer_num}
        v = data
      }

      // setSearchConnection({ criteria: { ...val }, adhoc: { top_n, call_limit, show_peer_num } });
    });
    return v;
  };

  onSearchNameChange(name) {
    this.setState({
      searchName: name,
    });
  }

  saveSearch() {
    if (this.state.searchName) {
      let data = this.validateFields(false)
      let val = formatFormData(data.criteria, true);
      let res = {criteria: val, adhoc: data.adhoc}
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
    let {initValues, values} = this.state;
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
      values: Object.assign({}, initValues, values, val),
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
      isShow: this.props.isShow || true,
    });
  }

  onMessageClose(key, index) {
    const keyMap = {
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
    for (const k in keyMap) {
      if (key === keyMap[k]) {
        key = k;
      }
    }
    const {values} = this.state;
    for (const k in values) {
      if (key === k) {
        delete values[k];
      }
    }
    this.setState({
      values,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.mySearchs && JSON.stringify(nextProps.search.mySearchs) !== JSON.stringify(this.state.initMySearchs)) {
      let mySearchs = formatAdvancedSearch(nextProps.search.mySearchs, 'connections');
      this.setState({
        mySearchs,
        initMySearchs: nextProps.search.mySearchs
      })
    }
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
    const {search} = this.props;
    const button = <Button style={{marginRight: '15px'}} component="a"
                           href={`/#/cases/${this.props.caseId}/pb_filesimport`}>文件导入</Button>;

    const showAdvancedCondition = this.state.conditions.map((cond, index) => {
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
                }}>{cond[0].indexOf('日期') !== -1 || cond[0] === '时间' || cond[0] === '时长' ? cond[1] : cond[1].replace(/(\d+)-/ig, '')}</span>
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
          {/*<div style={{ ...styles.nav, marginBottom: '10px' }}>*/}
          {/*<h2 style={styles.breadcrumb}>*/}
          {/*{this.props.title}*/}
          {/*</h2>*/}
          {/*<div />*/}
          {/*<div>*/}
          {/*{*/}
          {/*this.props.showBtn ? <Button style={{ marginRight: '15px' }} component="a" href={`/#/cases/${this.props.caseId}/pb_filesimport`}>文件导入</Button> : null*/}
          {/*}*/}
          {/*</div>*/}
          {/*</div>*/}
          <PageTitle title={this.props.title} tour={{page: "connections"}}/>
          <IceContainer style={styles.container}>
            <div style={styles.row}>
              <div style={styles.left}>
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
                            <NumberSelector name="owner_num" dataSource={search.ownerNums} values={this.state.values}
                                            onFormChange={this.onFormChange} isLabel={this.state.labelPNs}/>
                          </FormBinder>
                        </label>
                      </span>
                      <br/>
                      <span style={styles.caseNumber}>
                        <label style={styles.label}>
                          <FormBinder name="show_peer_num">
                            <Radio.Group
                              shape={this.state.shape}
                              itemDirection={this.state.itemDirection}
                            >
                                <Radio value={1}>
                                  <span className={"shortInput"} style={{fontSize: '14px', verticalAlign: 'middle'}}>
                                    显示对方联系人
                                    <span>&nbsp;(通话次数排在前面</span>
                                        <FormBinder name="top_n">
                                          <Input size="small" style={{...styles.shortInput}}/>
                                        </FormBinder>
                                    <span>位的关系人)</span>
                                  </span>
                                </Radio>
                              <Radio value={0}><span style={{fontSize: '14px', verticalAlign: 'middle'}}>不显示对方联系人</span></Radio>
                            </Radio.Group>
                          </FormBinder>
                        </label>
                      </span>
                      <br/>
                      <span className="shortInput" style={styles.caseNumber}>
                        <label>
                          <span>至少通话次数在</span>
                          <FormBinder name="call_limit">
                            <Input size="small" style={{...styles.shortInput}}/>
                          </FormBinder>
                          <span>次以上可认为相互有联系.</span>
                        </label>
                      </span>
                      <br/>
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
              <div className="mySearch" style={styles.right}>
                <h3 style={{
                  marginTop: 0,
                  borderBottom: '1px solid #2375fa',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>我的筛选模板</h3>
                {
                  this.state.mySearchs.map((item, index) => {
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
            <PageTitle title={this.props.title} tour={{page: "connections"}} collapsed={true}/>
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
{/*<div style={{ display: 'inline-block',*/
}
{/*padding: 0,*/
}
{/*position: 'absolute',*/
}
{/*width: '100%',*/
}
{/*textAlign: 'center',*/
}
{/*bottom: '2px' }}*/
}
{/*>*/
}
{/*<Icon type="prompt" size="small" style={{ color: '#5485f7', marginRight: '5px' }} />*/
}
{/*点击下拉展开搜索选项*/
}
{/*</div>*/
}
{/*<div>*/
}
{/*{*/
}
{/*this.props.showBtn ? <Button style={{ marginRight: '15px' }} component="a" href={`/#/cases/${this.props.caseId}/pb_filesimport`}>文件导入</Button> : null*/
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
    clearMyChart: state.connections.clearMyChart
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions, ...connectionActions, ...pbStatActions, ...labelPNActions}, dispatch),
  }),
)(SearchBar);
