import React, {Component, Fragment} from 'react';
import {Input, Select, DatePicker, Button, Message, Dialog, Tag, Icon} from '@alifd/next';
import IceContainer from '@icedesign/container';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import IceLabel from '@icedesign/label';
import {FormBinderWrapper, FormBinder, FormError} from '@icedesign/form-binder';
import PageTitle from '../../common/PageTitle';
import AdvancedSearch from '../../common/AdvancedSearch';
import SelectTag from '../../common/AdvancedSearch/SelectTag';
import BBAllChartTitle from './BBAllChartTitle'
import AccountNumberSelector from './OwnerAccountNumberSelector';
import PeerAccountNumberSelector from './PeerAccountNumberSelector';
import {actions as bbSearchActions} from '../../../../bbStores/bbSearchStore';
import {actions as bbAnalyzeActions} from '../../../../bbStores/bbAnalyze';
import { actions as bankAcctLabelsActions } from '../../../../bbStores/bankAcctLabels';
// import {formatAdvancedSearch} from "../../../../utils/panelSearch";
import {moreScreenData, formatFormData} from '../../../../utils/bbillsUtils';
import MultipleDateSelect from '../../common/AdvancedSearch/MultipleDateSelect'
import {actions as caseEventActions} from "../../../../stores/caseEvent";
import BBNamesSelector from '../../common/SearchBox/BBNamesSelector';
import BBconfig from '../globel'
import appConfig from '../../../../appConfig';


const {Option} = Select;

const initValues = {
  ...BBconfig.searchInitValues,
  'order-by': 'trx_full_time',
};

const selectDataSource = [
  {
    label: '< 200(含)元',
    value: 1,
  },
  {
    label: '200~1000元',
    value: 2,
  },
  {
    label: '1000(含)~4500元',
    value: 3,
  },
  {
    label: '4500(含)~9000元',
    value: 4,
  },
  {
    label: '9000(含)~5万元',
    value: 5,
  },
  {
    label: '5万(含)~9万元',
    value: 6,
  },
  {
    label: '9万(含)~50万元',
    value: 7,
  },
  {
    label: '50万(含)~100万元',
    value: 8,
  },
  {
    label: '>100万元(含)',
    value: 9,
  },
];

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advanced: false,
      conditions: [],
      values: Object.assign({}, initValues),
      initValues: Object.assign({}, initValues),
      advancedSearch: null,
      visible: false,
      searchName: null,
      isShow: true,
      labelPNs: [],
      tips: '',
      initMySearchs: [],
      mySearchs: [],
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
      values: Object.assign({}, initValues),
    }, () => {
      this.onFormChange(this.state.values);
    });
    this.onChartInptRef && this.onChartInptRef.clearVal();
    this.props.actions.setChartViewBbSearch([]);
    this.ownerCard && this.ownerCard.clearValue();
    this.peerCard && this.peerCard.clearValue();
    this.props.actions.clearAnalyzes()
    this.props.actions.clearParamsBbSearch();
  }

  getChartInptRef = (e) => {
    this.onChartInptRef = e;
  };

  onArrowClick() {
    this.setState({
      isShow: !this.state.isShow,
    }, () => {
      setTimeout(() => {
        this.props.windowScroller && this.props.windowScroller.updatePosition();
      }, 200);
    });
  }

  addConditions(values) {
    for (let key in values) {
      if (!values[key] && values[key] !== 0 || values[key].length === 0) {
        delete values[key]
      }
    }
    let conditions = moreScreenData(values);
    this.setState({conditions, values: {...values}})
  }

  async fetchData() {
    this.props.actions.fetchMySearchBbSearch({case_id: this.props.caseId, subject: 'bbill'});
    this.props.actions.fetchCaseEvents({caseId: this.props.caseId})
    this.props.actions.fetchLargeBankAcct({caseId: this.props.caseId}, {
      query: {
        page: 1,
        pagesize: appConfig.largePageSize,
      },
    });
  }

  onFormChange(values) {
    this.props.windowScroller && this.props.windowScroller.updatePosition();
    this.addConditions(values)
  }


  formatAdvancedSearch = (data) => {
    let res = [];
    data.forEach(item => {
      let value = JSON.parse(item.value);
      let values = {};
      if (value.criteria) {
        for (let key in value.criteria) {
          if (Array.isArray(value.criteria[key])) {
            values[key] = value.criteria[key][1]
          } else {
            values[key] = value.criteria[key]
          }
        }
      }
      if (value.view && value.view['order-by']) {
        values['order-by'] = value.view['order-by']
      }
      item.value = values;
      res.push(item)
    });
    return res;
  };


  query = (bool = true) => {
    const {values} = this.state;

    if (this.props.isHide && this.props.chartView.length === 0) {
      Message.warning("您还没有选择报表类型，故无法显示统计报表。");
      return;
    }


    if (!values.owner_card_num && !values.owner_bank_acct && !values.peer_card_num && !values.peer_bank_acct && !values['owner_name'] && !values['peer_name']) {
      this.popupCustomIcon();
    } else {
      this.validateFields()
    }
  };


  validateFields = (bool = true) => {
    const {validateAll} = this.refs.form;
    let v = null;
    const {actions, title} = this.props;
    validateAll((errors, values) => {
      v = values;
      if (bool) {
        console.log(values);
        actions.setParamsBbSearch(values)
      }
    });
    return {...v};
  };

  popupCustomIcon = () => {
    Dialog.confirm({
      title: '提示',
      content: <div style={{lineHeight: '20px', fontSize: '13px', color: '#F1C826'}}>本次查找没有指定本方卡号/户名或者对方卡号/户名，<br/>可能会导致结果数据过大从而导致响应时间较。确定<br/>继续查找吗?
      </div>,
      messageProps: {
        type: 'warning'
      },
      onOk: () => {
        this.validateFields()
      },
      onCancel: () => console.log('')
    });
  };


  onSearchNameChange(name) {
    this.setState({
      searchName: name,
    });
  }

  saveSearch() {
    if (this.state.searchName) {
      const res = formatFormData(this.validateFields(false), null, true);
      const params = {
        name: this.state.searchName,
        value: JSON.stringify(res),
      };
      this.props.actions.createMyBbSearch({case_id: this.props.caseId, subject: 'bbill', ...params}).then(res => {
        this.props.actions.fetchMySearchBbSearch({case_id: this.props.caseId, subject: 'bbill'})
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
    this.props.actions.removeMyBbSearch({case_id: this.props.caseId, subject: 'bbill', id}).then(res => {
      this.props.actions.fetchMySearchBbSearch({case_id: this.props.caseId, subject: 'bbill'})
    })
  }

  onMysearchClick(val) {
    val = Object.assign({}, val);
    if (val.owner_card_num && val.owner_bank_acct) {
      let t = [...val.owner_card_num, ...val.owner_bank_acct]
      this.ownerCard.setValue(t)
    } else if (val.owner_card_num) {
      this.ownerCard.setValue(val.owner_card_num)
    } else if (val.owner_bank_acct) {
      this.ownerCard.setValue(val.owner_bank_acct)
    }
    if (val.peer_card_num && val.peer_bank_acct) {
      let t = [...val.peer_card_num, ...val.peer_bank_acct]
      this.peerCard.setValue(t)
    } else if (val.peer_card_num) {
      this.peerCard.setValue(val.peer_card_num)
    } else if (val.peer_bank_acct) {
      this.peerCard.setValue(val.peer_bank_acct)
    }
    this.setState({
      values: Object.assign({}, val),
    }, () => {
      this.addConditions({...this.state.values});
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
    // this.getRequest(this.props.route.location.search);
    this.addConditions(this.state.values)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.mySearchs && JSON.stringify(nextProps.search.mySearchs) !== JSON.stringify(this.state.initMySearchs)) {
      let mySearchs = this.formatAdvancedSearch(JSON.parse(JSON.stringify(nextProps.search.mySearchs)));
      this.setState({
        mySearchs,
        initMySearchs: nextProps.search.mySearchs
      })
    }
  }

  componentWillUnmount() {
    this.props.actions.clearParamsBbSearch();
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
    } else {
      this.onFormChange(this.state.values);
    }
    return theRequest;
  }

  onOwnerCardRef = (e) => {
    this.ownerCard = e
  }

  onPeerCardRef = (e) => {
    this.peerCard = e
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
          <IceLabel inverse={false}
                    style={{
                      fontSize: '12px',
                      marginLeft: '5px',
                      backgroundColor: result.label_bg_color,
                      color: result.label_txt_color,
                      padding: '2px',
                    }}
          >{result.label}
          </IceLabel>
        </div>
      );
    }
    return item.value;
  }

  // onFormChange = (values) => {
  //   // console.log(values);
  // }

  render() {
    const {search, page} = this.props;
    const showAdvancedCondition = this.state.conditions.map((cond, index) => {
      return (
        <Message key={cond[0]} shape="toast" style={{display: 'inline-block', marginTop: '2px'}}>
          <span
            style={{fontSize: '12px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>
            <span style={{marginBottom: '5px'}}>{`${cond[0]}:`}</span>
            {
              <span style={{
                fontSize: '12px',
                marginRight: '10px',
                marginBottom: '5px',
              }}
              >{cond[1]}</span>
            }
          </span>
        </Message>
      );
    });

    return (
      <div>
        <div className={this.state.isShow ? 'PBSearch show' : 'PBSearch'}>
          {/* <div style={{...styles.nav, marginBottom: '10px'}} data-tut="reactour__search"> */}
          {/* <h2 style={styles.breadcrumb}> */}
          {/* {this.props.title} */}
          {/* {page ? <TourAgent page={page}/> : null} */}
          {/* </h2> */}
          {/* <div/> */}
          {/* <div> */}
          {/* { */}
          {/* this.props.showBtn ? this.props.showBtn(this.props.caseId) : null */}
          {/* } */}
          {/* </div> */}
          {/* </div> */}
          {
            this.props.buttons ? (
              <PageTitle title={this.props.title} tour={this.props.tour}
                         buttons={this.props.buttons(this.props.caseId)}/>
            ) : (
              <PageTitle title={this.props.title} tour={this.props.tour}/>
            )
          }
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
                      color: 'red',
                    }}
                    >{this.state.tips}
                    </div>
                    <div>
                      <span style={styles.caseNumber}>
                        <label style={styles.label}>
                          <span style={{whiteSpace: 'nowrap', ...styles.lableValue}}>本方账户:</span>
                          <FormBinder name="owner_cust_num">
                          <AccountNumberSelector name="owner_cust_num"
                                                 values={this.state.values}
                                                 onFormChange={this.onFormChange}
                                                 onRef={this.onOwnerCardRef}
                          />
                          </FormBinder>
                        </label>
                      </span>
                      <br/>
                      <span style={styles.caseNumber}>
                        <label style={styles.label}>
                          <span style={{whiteSpace: 'nowrap', ...styles.lableValue}}>对方账户:</span>
                          <FormBinder name="peer_cust_num">
                          <PeerAccountNumberSelector name="peer_cust_num"
                                                 values={this.state.values}
                                                 onFormChange={this.onFormChange}
                                                 onRef={this.onPeerCardRef}
                          />
                          </FormBinder>
                        </label>
                      </span>
                      <br/>
                      <div style={styles.label}>
                        <span style={{...styles.caseNumber}}>
                          <label style={styles.label}>
                            <span style={{whiteSpace: 'nowrap', ...styles.lableValue}}>本方户名:</span>
                            <FormBinder name="owner_name">
                              <BBNamesSelector url={`/cases/${this.props.caseId}/bbills/owner_names`}
                                               name="owner_name"
                                               componentProps={{placeholder: '请选择本方户名'}}
                                               values={this.state.values} onFormChange={this.onFormChange}
                                               styles={{...styles.input, width: '99%'}}/>
                            </FormBinder>
                          </label>
                        </span>
                        <span style={{...styles.caseNumber, width: '80%'}}>
                          <label style={styles.label}>
                            <span style={{whiteSpace: 'nowrap', ...styles.lableValue}}>对方户名:</span>
                            <FormBinder name="peer_name">
                              <BBNamesSelector url={`/cases/${this.props.caseId}/bbills/peer_names`}
                                               name="peer_name"
                                               componentProps={{placeholder: '请选择对方户名'}}
                                               values={this.state.values} onFormChange={this.onFormChange}
                                               styles={{...styles.input, width: '99%'}}/>
                            </FormBinder>
                          </label>
                        </span>
                      </div>
                      <div style={styles.label}>
                        <span style={{...styles.caseNumber}}>
                          <label style={styles.label}>
                            <span style={{whiteSpace: 'nowrap', ...styles.lableValue}}>交易类型:</span>
                            <FormBinder name="trx_class">
                              <Select
                                style={{...styles.input}}
                                mode="multiple"
                                placeholder="请选择交易类型"
                              >
                                <Option value={1}>现存</Option>
                                <Option value={2}>现取</Option>
                                <Option value={3}>转存</Option>
                                <Option value={4}>转取</Option>
                                <Option value={9}>其他</Option>
                              </Select>
                            </FormBinder>
                          </label>
                        </span>
                        <span style={{...styles.caseNumber, width: '80%'}}>
                          <label style={styles.label}>
                            <span style={{whiteSpace: 'nowrap', ...styles.lableValue}}>存取状态:</span>
                            <FormBinder name="trx_direction">
                              <Select
                                style={{...styles.input}}
                                mode="multiple"
                                placeholder="请选择存取状态"
                              >
                                <Option value={1}>存</Option>
                                <Option value={-1}>取</Option>
                              </Select>
                            </FormBinder>
                          </label>
                        </span>
                      </div>
                      <div style={styles.label}>
                        <span style={styles.caseNumber}>
                          <label style={styles.label}>
                            <span style={{whiteSpace: 'nowrap', ...styles.lableValue}}>交易金额:</span>
                            <FormBinder name="trx_amt_cny">
                              <SelectTag
                                name='trx_amt_cny'
                                componentProps={{
                                  placeholder: '请输入交易金额 例如 100或100-900',
                                  mode: 'tag',
                                  visible: false,
                                  hasArrow: false
                                }}
                                values={this.state.values}
                                onFormChange={this.onFormChange}
                              />
                            </FormBinder>
                          </label>
                        </span>
                        <span style={{...styles.caseNumber, width: '80%'}}>
                          <label style={styles.label}>
                            <span style={{whiteSpace: 'nowrap', ...styles.lableValue}}>金额分类:</span>
                            <FormBinder name="trx_amt_class">
                              <Select
                                style={{...styles.input}}
                                mode="multiple"
                                placeholder="请选择金额分类"
                              >
                                {
                                  selectDataSource.map(item => {
                                    return (
                                      <Option key={item.label} value={item.value}>{item.label}</Option>
                                    );
                                  })
                                }
                              </Select>
                            </FormBinder>
                          </label>
                        </span>
                      </div>
                      <span style={styles.caseNumber}>
                        <label style={styles.label}>
                          <span style={{whiteSpace: 'nowrap', ...styles.lableValue}}>交易日期:</span>
                          {/*<Input placeholder="请选择交易日期" style={{...styles.input}}/>*/}
                          {/*<MultipleDateSelect/>*/}
                          <FormBinder name='trx_day'>
                            <MultipleDateSelect name='trx_day'
                                                componentProps={{placeholder: '请输入交易日期', mode: 'multiple'}}
                                                values={this.state.values} onFormChange={this.onFormChange}
                                                styles={{...styles.input, width: '99%'}}/>
                          </FormBinder>
                        </label>
                      </span>
                      <br/>
                      {
                        this.props.title === '账单浏览' ? (
                          <span style={styles.caseNumber}>
                            <label style={styles.label}>
                              <span style={{whiteSpace: 'nowrap', ...styles.lableValue}}>排序依据:</span>
                              <FormBinder name="order-by">
                                <Select
                                  style={{...styles.input}}
                                >
                                  <Option value={'trx_full_time'}>日期时间</Option>
                                  <Option value={'trx_amt_cny desc,trx_full_time asc'}>交易额倒序</Option>
                                </Select>
                              </FormBinder>
                            </label>
                          </span>
                        ) : (
                          <BBAllChartTitle onChartInptRef={this.getChartInptRef}/>
                        )
                      }
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

                    {/* 高级搜索 */}
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
                }}
                >我的筛选模板
                </h3>
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
            <div>{showAdvancedCondition}</div>
            <div style={styles.search}>
              <span>
                <Button
                  type="primary"
                  style={styles.button}
                  onClick={this.query}
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
            this.props.button ? (
              <PageTitle title={this.props.title} tour={this.props.tour} collapsed button={this.props.button}/>
            ) : (
              <PageTitle title={this.props.title} tour={this.props.tour} collapsed/>
            )
          )
        }
        <div className="arrow1">
          <Icon type={this.state.isShow ? 'arrow-up' : 'arrow-down'} size="small" onClick={this.onArrowClick}/>
        </div>
      </div>
    );
  }
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
  lableValue: {
    flex: '0 0 85px',
    width: '85px',
    textAlign: 'right',
  },
  container2: {
    margin: '0',
    letterSpacing: '2px',
    position: 'relative',
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
    width: '180px',
    margin: '0 4px',
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
    search: state.bbSearchs,
    route: state.route,
    chartView: state.bbSearchs.chartView
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...bbSearchActions, ...caseEventActions, ...bbAnalyzeActions, ...bankAcctLabelsActions}, dispatch),
  }),
)(SearchBar);
