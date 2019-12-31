import React, { Component, Fragment } from 'react';
import { Input, Select, DatePicker, Button, Message, Dialog, Tag, Icon } from '@alifd/next';
import IceContainer from '@icedesign/container';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IceLabel from '@icedesign/label';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';
import PageTitle from '../../../common/PageTitle';
import AdvancedSearch from '../../../common/AdvancedSearch';
import SelectTag from '../../../common/AdvancedSearch/SelectTag';
import AccountNumberSelector from '../../../common/SearchBox/OwnerAccountNumberSelector';
import PeerAccountNumberSelector from '../../../common/SearchBox/PeerAccountNumberSelector';
import BBNamesSelector from '../../../common/SearchBox/BBNamesSelector';
import MultipleDateSelect from '../../../common/AdvancedSearch/MultipleDateSelect'
import { actions as bbBalanceActions } from '../../../../../bbStores/bbBalance';
import { actions as bbSearchStoreActions } from '../../../../../bbStores/bbSearchStore';
// import {formatAdvancedSearch} from "../../../../utils/panelSearch";
import { moreScreenData, formatFormData } from '../../../../../utils/bbillsUtils';
import BBconfig from '../../../common/globel';


const { Option } = Select;

const initValues = {
  ...BBconfig.searchInitValues,
  'group-by': 'month',
};

const selectDataSource = [
  {
    label: '人民币',
    value: 'cny',
  },
  {
    label: '美元',
    value: 'usd',
  },
  {
    label: '欧元',
    value: 'eur',
  },
];

const trxAmtClassSource = [
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

  onOwnerCardRef = (e) => {
    this.ownerCard = e
  }

  onPeerCardRef = (e) => {
    this.peerCard = e
  }

  resetSearch(value) {
    this.setState({
      values: Object.assign({}, initValues),
    }, () => {
      this.onFormChange(this.state.values);
    });
    this.onChartInptRef && this.onChartInptRef.clearVal();
    this.ownerCard && this.ownerCard.clearValue();
    this.peerCard && this.peerCard.clearValue();
    this.props.actions.clearParamsBbSearch();
  }

  getChartInptRef = (e) => {
    this.onChartInptRef = e;
  }

  onArrowClick() {
    this.setState({
      isShow: !this.state.isShow,
    }, () => {
      // setTimeout(() => {
      //   this.props.windowScroller && this.props.windowScroller.updatePosition();
      // }, 200);
    });
  }

  // formatFormData = (data) => {
  //   let v = data;
  //   for (let key in v) {
  //     if (key === 'trx_class' || key === 'trx_direction' || key === 'trx_amt' || key === 'trx_amt_class' || key === 'trx_day' || key === 'trx_time'
  //       || key === 'weekday' || key === 'eml_month' || key === 'trx_time_l1_class' || key === 'trx_hour_class' || key === 'time_class' || key === 'started_time' || key === 'currency' || key === 'bls'
  //       || key === 'trx_channel' || key === 'same_branch' || key === 'same_city' || key === 'same_ppl' || key === 'trx_branch_num' || key === 'dealer_code'
  //     ) {
  //       v[key] = ['IN', v[key]]
  //     }
  //     if (key === 'peer_branch' || key === '对方银行归属地' || key === 'digest' || key === 'memo' || key === 'trx_branch') {
  //       v[key] = ['FUZZY', v[key]]
  //     }
  //
  //   }
  //   return v
  // };

  addConditions(values) {
    for (const key in values) {
      if (!values[key] && values[key] !== 0 || values[key].length === 0) {
        delete values[key];
      }
    }
    const conditions = moreScreenData(values);
    this.setState({ conditions, values: { ...values } });
  }

  async fetchData() {
    this.props.actions.fetchMySearchBbSearch({ case_id: this.props.caseId, subject: 'bbill' });
  }

  onFormChange(values) {
    this.addConditions(values);
  }


  formatAdvancedSearch = (data) => {
    const res = [];
    data.forEach(item => {
      const value = JSON.parse(item.value);
      const values = {};
      if (value.criteria) {
        for (const key in value.criteria) {
          if (Array.isArray(value.criteria[key])) {
            values[key] = value.criteria[key][1];
          } else {
            values[key] = value.criteria[key];
          }
        }
      }
      if (value.view && value.view['order-by']) {
        values['order-by'] = value.view['order-by'];
      }
      item.value = values;
      res.push(item);
    });
    return res;
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

  validateFields = (bool = true) => {
    const { validateAll } = this.refs.form;
    let v = null;
    const { actions, title } = this.props;
    validateAll((errors, values) => {
      v = values;
      if (bool) {
        console.log(values);
        actions.setParamsBbBalance(values);
      }
    });
    return { ...v };
  };
  query = (bool = true) => {
    const {values} = this.state;

    if (!values.owner_card_num && !values.owner_bank_acct && !values.peer_card_num && !values.peer_bank_acct && !values['owner_name'] && !values['peer_name']) {
      this.popupCustomIcon();
    } else {
      this.validateFields()
    }
  };

  onSearchNameChange(name) {
    this.setState({
      searchName: name,
    });
  }

  saveSearch() {
    if (this.state.searchName) {
      const res = formatFormData(this.validateFields(false));
      const params = {
        name: this.state.searchName,
        value: JSON.stringify(res),
      };
      this.props.actions.createMyBbSearch({ case_id: this.props.caseId, subject: 'bbill', ...params }).then(res => {
        this.props.actions.fetchMySearchBbSearch({ case_id: this.props.caseId, subject: 'bbill' });
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
    this.props.actions.removeMyBbSearch({ case_id: this.props.caseId, subject: 'bbill', id }).then(res => {
      this.props.actions.fetchMySearchBbSearch({ case_id: this.props.caseId, subject: 'bbill' });
    });
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
    const { values } = this.state;
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
    this.addConditions(this.state.values);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.mySearchs && JSON.stringify(nextProps.search.mySearchs) !== JSON.stringify(this.state.initMySearchs)) {
      const mySearchs = this.formatAdvancedSearch(JSON.parse(JSON.stringify(nextProps.search.mySearchs)));
      this.setState({
        mySearchs,
        initMySearchs: nextProps.search.mySearchs,
      });
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
      this.setState({ values: { ...this.state.values, ...theRequest } }, () => {
        this.onFormChange(this.state.values);
      });
    } else {
      this.onFormChange(this.state.values);
    }
    return theRequest;
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
    const { search, page, caseId } = this.props;
    const showAdvancedCondition = this.state.conditions.map((cond, index) => {
      return (
        <Message key={cond[0]} shape="toast" style={{ display: 'inline-block', marginTop: '2px' }}>
          <span
            style={{ fontSize: '12px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <span style={{ marginBottom: '5px' }}>{`${cond[0]}:`}</span>
            {
              <span style={{
                fontSize: '12px',
                marginRight: '10px',
                marginBottom: '5px',
              }}
              >{cond[1]}
              </span>
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
              <PageTitle title={this.props.title}
                tour={this.props.tour}
                buttons={this.props.buttons(this.props.caseId)}
              />
            ) : (
              <PageTitle title={this.props.title} tour={this.props.tour} />
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
                            <FormBinder name="对方户名">
                             <BBNamesSelector name="peer_name"
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
                            <FormBinder name="trx_amt">
                              <SelectTag
                                name='trx_amt'
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
                                  trxAmtClassSource.map(item => {
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
                      <div style={styles.label}>
                        <span style={{ ...styles.caseNumber }}>
                          <label style={styles.label}>
                            <span style={{ whiteSpace: 'nowrap', ...styles.lableValue }}>时间粒度:</span>
                            <FormBinder name="group-by">
                              <Select
                                style={{ ...styles.input }}
                                placeholder="请选择时间粒度"
                              >
                                <Option value="trx_day">按天</Option>
                                <Option value="week">按周</Option>
                                <Option value="eml_month">按旬</Option>
                                <Option value="month">按月</Option>
                                <Option value="quarter">按季</Option>
                                <Option value="year">按年</Option>
                              </Select>
                            </FormBinder>
                          </label>
                        </span>
                      </div>
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
                      <Tag.Closeable key={item.name + index}
                        status="info"
                        onClick={() => {
                        this.onMysearchClick(item.value);
                      }}
                        onClose={() => {
                        this.onMysearchClose(item.id);
                      }}
                      >{item.name}
                      </Tag.Closeable>
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
                      搜索名称: <Input trim onChange={this.onSearchNameChange} />
                </Dialog>
              </span>
            </div>
          </IceContainer>
        </div>
        {
          this.state.isShow ? null : this.state.conditions.length > 0 ? (
            <div style={{ background: '#fff', padding: '10px' }}>
              {
                showAdvancedCondition
              }
            </div>
          ) : (
            this.props.button ? (
              <PageTitle title={this.props.title} tour={this.props.tour} collapsed button={this.props.button} />
            ) : (
              <PageTitle title={this.props.title} tour={this.props.tour} collapsed />
            )
          )
        }
        <div className="arrow1">
          <Icon type={this.state.isShow ? 'arrow-up' : 'arrow-down'} size="small" onClick={this.onArrowClick} />
        </div>
      </div>
    );
  }
}

{ /* <div style={styles.nav}> */
}
{ /* <h2 style={styles.breadcrumb}> */
}
{ /* {this.props.title} */
}
{ /* </h2> */
}
{ /* <div style={{ */
}
{ /* display: 'inline-block', */
}
{ /* padding: 0, */
}
{ /* position: 'absolute', */
}
{ /* width: '100%', */
}
{ /* textAlign: 'center', */
}
{ /* bottom: '2px', */
}
{ /* }} */
}
{ /* > */
}
{ /* <Icon type="prompt" size="small" style={{color: '#5485f7', marginRight: '5px'}}/> */
}
{ /* 点击下拉展开搜索选项 */
}
{ /* </div> */
}
{ /* <div> */
}
{ /* { */
}
{ /* this.props.showBtn ? <Button style={{marginRight: '15px'}} component="a" */
}
{ /* href={`/#/cases/${this.props.caseId}/pb_filesimport`}>文件导入</Button> : null */
}
{ /* } */
}
{ /* </div> */
}
{ /* </div> */
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
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...bbBalanceActions, ...bbSearchStoreActions }, dispatch),
  }),
)(SearchBar);
