import React, { Component, Fragment } from 'react';
import { Input, Select, Balloon, Button, Message, Dialog, Tag, Icon } from '@alifd/next';
import IceContainer from '@icedesign/container';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IceLabel from '@icedesign/label';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';
import AdvancedSearch from '../../../../bbills/common/AdvancedSearch/index';
import SelectTag from '../../../../bbills/common/AdvancedSearch/SelectTag';
import MultipleDateSelect from '../../../../bbills/common/AdvancedSearch/MultipleDateSelect';
import AccountNumberSelector from '../../../../bbills/common/SearchBox/OwnerAccountNumberSelector';
import PeerAccountNumberSelector from '../../../../bbills/common/SearchBox/PeerAccountNumberSelector';
import BBNamesSelector from '../../../../bbills/common/SearchBox/BBNamesSelector';
import { actions as bbSearchActions } from '../../../../../bbStores/bbSearchStore/index';

import { formatFormData, moreScreenData } from '../../../../../utils/bbillsUtils';
import BBconfig from '../../../../bbills/common/globel';


const { Option } = Select;

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
    this.ownerCard && this.ownerCard.clearValue();
    this.peerCard && this.peerCard.clearValue();
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

  addConditions(values) {
    for (const key in values) {
      if (!values[key] && values[key] !== 0 || values[key].length === 0) {
        delete values[key];
      }
    }
    const conditions = moreScreenData(values);
    this.props.onChangeBBForm(conditions);
    this.setState({ conditions, values: { ...values } });
  }

  async fetchData() {
    this.props.actions.fetchMySearchBbSearch({ case_id: this.props.caseId, subject: 'bbill' });
  }


  validateFields = (bool = true) => {
    const { validateAll } = this.refs.form;
    let v = null;
    const { actions, title } = this.props;
    validateAll((errors, values) => {
      v = formatFormData(values);
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

  formatAdvancedSearch = (data) => {
    const res = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const value = JSON.parse(item.value);
      const values = {};
      if (value.criteria) {
        for (const key in value.criteria) {
          values[key] = value.criteria[key][1];
        }
      }
      if (value.view && value.view['order-by']) {
        values['order-by'] = value.view['order-by'];
      }
      item.value = values;
      res.push(item);
    }
    return res;
  };

  componentDidMount() {
    this.fetchData();
    this.setState({
      isShow: this.props.isShow || false,
    });
    this.props.onRef && this.props.onRef(this);
    // this.getRequest(this.props.route.location.search);
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

  componentWillUnmount() {

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
  onFormChange = (values) => {
    console.log(values);
    this.addConditions(values);
  }

  onOwnerCardRef = (e) => {
    this.ownerCard = e
  }

  onPeerCardRef = (e) => {
    this.peerCard = e
  }

  render() {
    return (
      <div>
        <div className={this.state.isShow ? 'PBSearch show' : 'PBSearch'}>
          <div style={styles.row}>
            <div style={{ width: '100%' }}>
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
                        <span style={{ whiteSpace: 'nowrap', ...styles.lableValue }}>本方卡号:</span>
                        <AccountNumberSelector name="owner_cust_num"
                                               onRef={this.onOwnerCardRef}
                          values={this.state.values}
                          onFormChange={this.onFormChange}
                        />
                      </label>
                    </span>
                    <br />
                    <span style={styles.caseNumber}>
                      <label style={styles.label}>
                        <span style={{ whiteSpace: 'nowrap', ...styles.lableValue }}>对方卡号:</span>
                        <PeerAccountNumberSelector name="peer_cust_num"
                                               onRef={this.onPeerCardRef}
                                               values={this.state.values}
                                               onFormChange={this.onFormChange}
                        />
                      </label>
                    </span>
                    <br />
                    <div style={styles.label}>
                      <span style={{ ...styles.caseNumber }}>
                        <label style={styles.label}>
                          <span style={{ whiteSpace: 'nowrap', ...styles.lableValue }}>本方户名:</span>
                          <FormBinder name="owner_name">
                            <BBNamesSelector url={`/cases/${this.props.caseId}/bbills/owner_names`}
                              name="owner_name"
                              componentProps={{ placeholder: '请选择本方户名' }}
                              values={this.state.values}
                              onFormChange={this.onFormChange}
                              styles={{ ...styles.input }}
                            />
                          </FormBinder>
                        </label>
                      </span>
                      <span style={{ ...styles.caseNumber, width: '80%', minWidth: '248px' }}>
                        <label style={styles.label}>
                          <span style={{ whiteSpace: 'nowrap', ...styles.lableValue }}>对方户名:</span>
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
                      <span style={{ ...styles.caseNumber }}>
                        <label style={styles.label}>
                          <span style={{ whiteSpace: 'nowrap', ...styles.lableValue }}>交易类型:</span>
                          <FormBinder name="trx_class">
                            <Select
                              style={{ ...styles.input }}
                              mode="multiple"
                              placeholder="请选择交易类型"
                            >
                              <Option value={1}>现存</Option>
                              <Option value={2}>现取</Option>
                              <Option value={3}>转存</Option>
                              <Option value={4}>转取</Option>
                              <Option value={5}>其他</Option>
                            </Select>
                          </FormBinder>
                        </label>
                      </span>
                      <span style={{ ...styles.caseNumber, width: '80%', minWidth: '248px' }}>
                        <label style={styles.label}>
                          <span style={{ whiteSpace: 'nowrap', ...styles.lableValue }}>存取状态:</span>
                          <FormBinder name="trx_direction">
                            <Select
                              style={{ ...styles.input }}
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
                          <span style={{ whiteSpace: 'nowrap', ...styles.lableValue }}>交易金额:</span>
                          <FormBinder name="交易金额">
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
                      <span style={{ ...styles.caseNumber, width: '80%', minWidth: '248px' }}>
                        <label style={styles.label}>
                          <span style={{ whiteSpace: 'nowrap', ...styles.lableValue }}>金额分类:</span>
                          <FormBinder name="金额分类">
                            <Select
                              style={{ ...styles.input }}
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
                        <span style={{ whiteSpace: 'nowrap', ...styles.lableValue }}>交易日期:</span>
                        <FormBinder name="trx_day">
                          <MultipleDateSelect name="trx_day"
                            componentProps={{ placeholder: '请输入交易日期', mode: 'multiple' }}
                            values={this.state.values}
                            onFormChange={this.onFormChange}
                            styles={{ ...styles.input, width: '99%' }}
                          />
                        </FormBinder>
                      </label>
                    </span>
                    <br />
                  </div>

                  <AdvancedSearch visible={this.state.advanced}
                    onClose={this.showAdvancedSearch}
                    addConditions={this.addConditions}
                    values={this.state.values}
                    resetSearch={this.resetSearch}
                    dataSource={this.props.search}
                    getAlyzDayData={this.getAlyzDayData}
                    onFormChange={this.onFormChange}
                  />

                  {/* 高级搜索 */}
                </div>
                <br />
              </FormBinderWrapper>
              <div style={{ textAlign: 'center' }}>
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
                  <Balloon trigger={<Button>
                      我的筛选模板
                                    </Button>}
                    align="t"
                    alignEdge
                    style={{ width: 500 }}
                  >
                    {/* 我的搜索 */}
                    <div className="mySearch">
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
                  </Balloon>
                </span>
              </div>
            </div>
          </div>
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
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...bbSearchActions }, dispatch),
  }),
)(SearchBar);
