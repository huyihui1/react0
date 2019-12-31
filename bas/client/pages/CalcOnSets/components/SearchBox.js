import React, {Component, Fragment} from 'react';
import {Input, Select, DatePicker, Button, Message, Dialog, Tag, Icon} from '@alifd/next';
import IceContainer from '@icedesign/container';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import IceLabel from '@icedesign/label';
import {FormBinderWrapper, FormBinder, FormError} from '@icedesign/form-binder';

import AdvancedSearch from '../../common/AdvancedSearch/index';
import {renameLabel, formatFormData} from '../../../utils/utils';
import {actions} from '../../../stores/SearchStore/index';
import {actions as pbStatActions} from '../../../stores/pbStat/index';
import {actions as labelPNActions} from '../../../stores/labelPN';
import {actions as labelCellActions} from '../../../stores/labelCell';
import AllChartTitle from '../../common/SearchBox/AllChartTitle';
import MultipleDateSelect from '../../common/SearchBox/MultipleDateSelect';
import NumberSelector from '../../common/SearchBox/NumberSelector';
import appConfig from '../../../appConfig';
import {formatAdvancedSearch} from '../../../utils/panelSearch';


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
        bill_type: ['1-通话'],
      },
      initValues: {
        ciFmt: '16进制',
        lacFmt: '16进制',
        owner_loc_type: '包含',
        peer_loc_type: '包含',
        owner_lac_type: '包含',
        owner_ci_type: '包含',
        owner_ct_code_type: '包含',
        bill_type: ['1-通话'],
      },
      advancedSearch: null,
      visible: false,
      searchName: null,
      isShow: true,
      labelPNs: [],
      tips: '',
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
      if (key === '本方号码' || key === '对方号码') {
        let arr;
        if (v[key]) {
          arr = v[key].split(', ');
        } else {
          arr = [];
        }
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < this.props.largItems.length; j++) {
            const labelPNs = this.props.largItems[j];
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
    const {getOwnerNumSearch, fetchMySearchSearch, fetchLabelPNs, fetchLabelCells} = this.props.actions;
    getOwnerNumSearch({case_id: caseId});
    fetchMySearchSearch({case_id: caseId});
    fetchLabelCells({caseId}, {query: { page: 1, pagesize: appConfig.largePageSize, }})
    const res = await fetchLabelPNs({caseId}, {
      query: {
        page: 1,
        pagesize: appConfig.largePageSize,
      },
    });
    if (res) {
      this.setState({
        labelPNs: res.body.data,
      });
    }
  }

  onFormChange(values) {
    console.log(values);
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
          tempObj[newKey] = values[key].join(',')
            .replace(/,/ig, ', ');
        } else {
          tempObj[newKey] = values[key];
        }
      }
    }
    this.addConditions(renameLabel({...values}), values);
  }

  validateFields = (bool = true) => {
    const {validateAll} = this.refs.form;
    const {setCriteriaSearch, clearPBStatStoreChart} = this.props.actions;
    let v = null
    validateAll((errors, values) => {
      // if (Object.keys(values).length === 0) {
      //   return false;
      // }
      const val = {...values};
      // console.log(values);
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

      if (this.props.title === '话单统计') {
        delete val['order-by'];
        delete val['daily_rec'];
      }
      if (bool) {
        // if (values.owner_num && values.owner_num.length !== 0 || values.peer_num && values.peer_num.length !== 0){
        //   clearPBStatStoreChart();
        //   setCriteriaSearch({...val});
        //   this.setState({tips: ''})
        // } else {
        //   this.setState({tips: '请选择本方号码或对方号码'})
        // }
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
        // clearPBStatStoreChart();
        // setCriteriaSearch({...val});
        v = val;
      } else {
        if (!val.owner_ci || val.owner_ci && val.owner_ci.length === 0) {
          delete val.ciFmt;
        }
        if (!val.owner_lac || val.owner_lac && val.owner_lac.length === 0) {
          delete val.lacFmt;
        }
        v = val;
      }
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
      const daily_rec = values.daily_rec;
      const orderBy = values['order-by'];
      delete values.daily_rec;
      delete values['order-by'];
      // values = formatAdvancedSearch(values);
      let res = {criteria: {...values}, view: {'order-by': orderBy}, adhoc: { daily_rec}};
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
  };

  onMysearchClose(id) {
    this.props.actions.removeMySearch({case_id: this.props.caseId, id}).then(res => {
      this.props.actions.fetchMySearchSearch({case_id: this.props.caseId});
    })
  }

  onMysearchClick(val) {
    let { values, initValues } = this.state;
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
      isShow: this.props.isShow || this.state.isShow,
    });
    console.log(this.props.route);
    this.getRequest(this.props.route.location.search);
    this.props.onRefs(this, this.props.title)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.mySearchs && JSON.stringify(nextProps.search.mySearchs) !== JSON.stringify(this.state.initMySearchs)) {
      let mySearchs = formatAdvancedSearch(nextProps.search.mySearchs, this.props.isHide ? 'pbAnalyze' : 'pbStat');
      this.setState({
        mySearchs,
        initMySearchs: nextProps.search.mySearchs
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
      const res = renameLabel(theRequest);
      if (Object.keys(res).length > 0) {
        document.title = '';
        for (const k in res) {
          document.title = `${document.title} ${k}: ${res[k]}`;
        }
      }
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
    // document.title = '话单分析系统';
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
            padding: '2px',
          }}>{result.label}</IceLabel>
        </div>
      );
    }
    return item.value;
  }

  render() {
    const {search, page} = this.props;
    const showAdvancedCondition = this.state.conditions.map((cond, index) => {
      return (
        <Message key={cond[0]} shape="toast" style={{display: 'inline-block'}}>
          <span style={{fontSize: '12px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>
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
                            style={{fontSize: '12px', marginRight: '10px', marginBottom: '5px'}}><span>{item.num}</span><IceLabel style={{
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
      <fieldset>
        <legend>{this.props.title}</legend>
        <div>
          <div className={this.state.isShow ? 'PBSearch show' : 'PBSearch'}>
            {/*<div style={{...styles.nav, marginBottom: '10px'}} data-tut="reactour__search">*/}
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
            <IceContainer style={styles.container}>
              <div style={styles.row}>
                <div style={styles.left}>
                  <FormBinderWrapper
                    ref="form"
                    value={this.state.values}
                    onChange={this.onFormChange}
                  >
                    <div style={styles.container2}>
                      <div style={{
                        position: 'absolute',
                        left: '73px',
                        bottom: '-20px',
                        color: 'red'
                      }}>{this.state.tips}</div>
                      <div>
                      <span style={styles.caseNumber}>
                        <label style={styles.label}>
                          <span style={{whiteSpace: 'nowrap'}}>本方号码:</span>
                          <FormBinder name="owner_num">
                            {/* 自定义封装号码选择器 */}
                            <NumberSelector name="owner_num" labelGroup={this.props.labelGroup}
                                            dataSource={search.ownerNums} values={this.state.values}
                                            onFormChange={this.onFormChange} isLabel={this.state.labelPNs}/>
                          </FormBinder>
                        </label>
                      </span>
                        {/* <span style={styles.caseNumber}> */}
                        {/* <label style={styles.label}> */}
                        {/* <span style={{ whiteSpace: 'nowrap' }}>本方号码:</span> */}
                        {/* <FormBinder name="owner_num"> */}
                        {/* <Select mode="tag" showSearch style={{ ...styles.input, ...styles.longInput }} popupClassName="owner-num" popupStyle={{ display: 'flex', flexWrap: 'wrap' }} itemRender={this.ownerNumRender}> */}
                        {/* { */}
                        {/* search.ownerNums && search.ownerNums.map((item, index) => { */}
                        {/* return <Option value={item} key={item + index}>{item}</Option>; */}
                        {/* }) */}
                        {/* } */}
                        {/* </Select> */}
                        {/* </FormBinder> */}
                        {/* </label> */}
                        {/* </span> */}
                        <br/>
                        <span style={styles.caseNumber}>
                        <label style={styles.label}>
                          <span style={{whiteSpace: 'nowrap'}}>对方号码:</span>
                          <FormBinder name="peer_num">
                            <NumberSelector name="peer_num" labelGroup={this.props.labelGroup}
                                            dataSource={search.ownerNums} values={this.state.values}
                                            onFormChange={this.onFormChange} isLabel={this.state.labelPNs}/>
                          </FormBinder>
                        </label>
                      </span>
                        <br/>
                        <span style={styles.caseNumber}>
                        <label style={styles.label}>
                          <span style={{whiteSpace: 'nowrap'}}>名义日期:</span>
                          <div style={{width: '100%', margin: '0 4px'}}>
                            <MultipleDateSelect values={this.state.values} name="alyz_day"
                                                getAlyzDayData={this.getAlyzDayData}/>
                          </div>
                        </label>
                      </span>
                        <div style={styles.label}>
                        <span style={this.props.isHide ? styles.caseNumber : styles.caseNumber2}>
                          <label style={styles.label}>
                            <span style={{whiteSpace: 'nowrap'}}>计费类型:</span>
                            <FormBinder name="bill_type">
                              <Select
                                placeholder="计费类型"
                                style={{...styles.input}}
                                mode="multiple"
                              >
                                <Option value="1-通话">通话</Option>
                                <Option value="2-短信">短信</Option>
                                <Option value="3-彩信">彩信</Option>
                              </Select>
                            </FormBinder>
                          </label>
                        </span>
                        </div>
                        <div style={styles.label}>
                          {
                            this.props.isHide ? (
                              <Fragment>
                              <span className="mr-5" style={styles.caseNumber}>
                                <label style={styles.label}>
                                  <span style={{whiteSpace: 'nowrap'}}>排序依据:</span>
                                  <FormBinder name="order-by">
                                    <Select
                                      placeholder="请选择"
                                      style={{...styles.input}}
                                    >
                                      <Option value="started_at">日期时间</Option>
                                      <Option value="alyz_day,peer_num,started_at">日期_对方号码</Option>
                                      <Option value="alyz_day,owner_ct_code,started_at">日期_基站</Option>
                                      <Option value="alyz_day,comm_direction,started_at">日期_通话类型</Option>
                                      <Option value="alyz_day,owner_num,started_at">日期_本方号码</Option>
                                      <Option value="started_time,started_at">时间</Option>
                                      <Option value="weekday,started_at">周几</Option>
                                      <Option value="started_time_l1_class,started_at">开始时间类型</Option>
                                      <Option value="peer_num,started_at">对方号码</Option>
                                      <Option value="peer_num_type,started_at">对方号码类型</Option>
                                      <Option value="owner_num,started_at">本方号码</Option>
                                      <Option value="duration desc,started_at">通话时长</Option>
                                      <Option value="duration_class desc,started_at">时长类型</Option>
                                      <Option value="owner_num_status,started_at">通话状态</Option>
                                      <Option value="comm_direction,started_at">联系类型</Option>
                                      <Option value="owner_comm_loc,started_at">己方通话地</Option>
                                      <Option value="peer_comm_loc,started_at">对方通话地</Option>
                                      <Option value="owner_lac,started_at">LAC</Option>
                                      <Option value="owner_ci,started_at">CI</Option>
                                      <Option value="bill_type,started_at">计费类型</Option>
                                    </Select>
                                  </FormBinder>
                                </label>
                              </span>
                                <span className="mr-5" style={styles.caseNumber}>
                                <label style={styles.label}>
                                  <span style={{whiteSpace: 'nowrap'}}>每日显示:</span>
                                  <FormBinder name="daily_rec">
                                    <Select
                                      placeholder="请选择"
                                      style={{...styles.input, marginRight: 0}}
                                    >
                                      <Option value="all">全部</Option>
                                      <Option value="min">每日最早一条</Option>
                                      <Option value="max">每日最晚一条</Option>
                                      <Option value="min_max">每日最早最晚两条</Option>
                                    </Select>
                                  </FormBinder>
                                </label>
                              </span>
                              </Fragment>

                            ) : null
                          }
                        </div>
                        {
                          this.props.isHide ? null : <AllChartTitle/>
                        }
                        <br/>
                      </div>

                      <AdvancedSearch visible={this.state.advanced}
                                      onClose={this.showAdvancedSearch}
                                      addConditions={this.addConditions}
                                      values={this.state.values}
                                      resetSearch={this.resetSearch}
                                      dataSource={search}
                                      getAlyzDayData={this.getAlyzDayData}
                                      onFormChange={this.onFormChange}
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
                    textAlign: 'center',
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
              {/*<span>*/}
                {/*<Button*/}
                  {/*type="primary"*/}
                  {/*style={styles.button}*/}
                  {/*onClick={this.validateFields}*/}
                {/*>*/}
                    {/*查询*/}
                {/*</Button>*/}
              {/*</span>*/}
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
            ) : null
          }
          <div className="arrow1">
            <Icon type={this.state.isShow ? 'arrow-up' : 'arrow-down'} size="small" onClick={this.onArrowClick}/>
          </div>
        </div>
      </fieldset>
    );
  }
}

{/*<div style={styles.nav}>*/}
{/*<h2 style={styles.breadcrumb}>*/}
{/*{this.props.title}*/}
{/*</h2>*/}
{/*<div style={{*/}
{/*display: 'inline-block',*/}
{/*padding: 0,*/}
{/*position: 'absolute',*/}
{/*width: '100%',*/}
{/*textAlign: 'center',*/}
{/*bottom: '2px',*/}
{/*}}*/}
{/*>*/}
{/*<Icon type="prompt" size="small" style={{color: '#5485f7', marginRight: '5px'}}/>*/}
{/*点击下拉展开搜索选项*/}
{/*</div>*/}
{/*<div>*/}
{/*{*/}
{/*this.props.showBtn ? <Button style={{marginRight: '15px'}} component="a"*/}
{/*href={`/#/cases/${this.props.caseId}/pb_filesimport`}>文件导入</Button> : null*/}
{/*}*/}
{/*</div>*/}
{/*</div>*/}

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
    position: 'relative'
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
    width: '115px',
  },
  longInput: {
    // width: '825px',
  },
  caseNumber: {
    marginTop: '10px',
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
    route: state.route,
    largItems: state.labelPNs.LargItems,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions, ...pbStatActions, ...labelPNActions, ...labelCellActions}, dispatch),
  }),
)(SearchBar);
