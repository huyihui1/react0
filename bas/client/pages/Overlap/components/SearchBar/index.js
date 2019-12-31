import React, { Component } from 'react';
import { Input, Select, DatePicker, Button, Message, Dialog, Tag, Icon, Radio } from '@alifd/next';
import IceContainer from '@icedesign/container';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';
import IceLabel from '@icedesign/label';

import AdvancedSearch from '../../../common/AdvancedSearch/index';
import { renameLabel, formatFormData } from '../../../../utils/utils';
import {formatAdvancedSearch} from '../../../../utils/panelSearch';
import { actions } from '../../../../stores/SearchStore/index';
import { actions as pbStatActions } from '../../../../stores/pbStat/index';
import MultipleDateSelect from '../../../common/SearchBox/MultipleDateSelect';
import { actions as labelPNActions } from '../../../../stores/labelPN';
import SingleNumberSelector from '../../../common/SearchBox/SingleNumberSelector';
import appConfig from '../../../../appConfig';
import {POSITIVE_NUM} from '../../../../fieldConstraints'
import PageTitle from '../../../common/PageTitle/index';
import { clearItems, } from '../../../../stores/PBAnalyze/actions';




const { Option } = Select;

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advanced: false,
      conditions: [],
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
      advancedSearch: null,
      visible: false,
      searchName: null,
      isShow: true,
      labelPNs: [],
      mySearchs: [],
      initMySearchs: []
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
  }

  showAdvancedSearch() {
    this.setState({
      advanced: !this.state.advanced,
    });
  }

  resetSearch(value) {
    this.setState({
      values: Object.assign({}, this.state.initValues),
    },() => {
      this.onFormChange(this.state.values)
    });
    this.props.actions.clearCriteriaSearch();
    this.props.actions.clearItems()
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
      if (key === '甲方话单' || key === '乙方话单') {
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
              break;
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
                };
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
    const { caseId } = this.props;
    const { getOwnerNumSearch, fetchMySearchSearch, fetchLabelPNs } = this.props.actions;
    getOwnerNumSearch({ case_id: caseId });
    fetchMySearchSearch({ case_id: caseId });
    const res = await fetchLabelPNs({ caseId }, {
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
      numA: '甲方话单',
      numB: '乙方话单',
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
    this.addConditions(renameLabel({ ...values }), values);
  }

  validateFields = (bool = true) => {
    const { validateAll } = this.refs.form;
    const { setNoFormatCriteriaSearch, setLocRuleSearch } = this.props.actions;
    let v = null;

    validateAll((errors, values) => {
      // if (Object.keys(values).length === 0) {
      //   return false;
      // }
      const data = {
        criteria: {},
        view: {},
        adhoc: {},
        case_id: this.props.caseId,
      };
      const val = { ...values };
      console.log(values);
      if (val.numA) {
        if (Array.isArray(val.numA)) {
          data.adhoc.numA = val.numA[0];
        } else {
          data.adhoc.numA = val.numA;
        }
      }
      if (val.numB) {
        if (Array.isArray(val.numB)) {
          data.adhoc.numB = val.numB[0];
        } else {
          data.adhoc.numB = val.numB;
        }
      }
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
      delete val.numA;
      delete val.numB;
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
        data.criteria = val;
        if (data.adhoc.numA && data.adhoc.numB){
          setNoFormatCriteriaSearch(data);
        }
      } else {
        if (!val.owner_ci || val.owner_ci && val.owner_ci.length === 0) {
          delete val.ciFmt;
        }
        if (!val.owner_lac || val.owner_lac && val.owner_lac.length === 0) {
          delete val.lacFmt;
        }
        data.criteria = val;
        v = data;
      }
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
      let res = { criteria: val, adhoc: data.adhoc }
      const params = {
        name: this.state.searchName,
        subject: 'pbill',
        value: JSON.stringify(res),
      };
      this.props.actions.createMySearch({ case_id: this.props.caseId, ...params })
        .then(res => {
          if (res.body.meta && res.body.meta.success) {
            this.props.actions.fetchMySearchSearch({ case_id: this.props.caseId });
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
    this.props.actions.removeMySearch({ case_id: this.props.caseId, id },);
  }

  onMysearchClick(val) {
    const { values, initValues } = this.state;
    if (this.oldSearchVal) {
      for (const k in this.oldSearchVal) {
        if (values[k] && values[k] === this.oldSearchVal[k]) {
          delete values[k];
        }
      }
    }
    this.oldSearchVal = val;
    val = { ...val };
    this.setState({
      values: Object.assign({}, initValues, values, val),
    }, () => {
      this.addConditions(renameLabel({ ...this.state.values }), {});
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
    this.onFormChange(this.state.values)
    this.fetchData();
    this.setState({
      isShow: this.props.isShow || false,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.mySearchs && JSON.stringify(nextProps.search.mySearchs) !== JSON.stringify(this.state.initMySearchs)) {
      let mySearchs = formatAdvancedSearch(nextProps.search.mySearchs, 'overlap');
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
    const result = this.state.labelPNs && this.state.labelPNs.find((x) => {
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

  render() {
    const { search } = this.props;
    const button = <Button style={{ marginRight: '15px' }} component="a" href={`/#/cases/${this.props.caseId}/pb_filesimport`}>文件导入</Button>;
    const showAdvancedCondition = this.state.conditions.map((cond, index) => {
      return (
        <Message key={cond[0]} shape="toast" style={{ display: 'inline-block' }}>
          <span style={{ fontSize: '12px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>{`${cond[0]}:`}
            {
              !Array.isArray(cond[1]) ? (
                <span style={{
                  fontSize: '12px',
                  marginRight: '10px',
                }}
                >{cond[0].indexOf('日期') !== -1 || cond[0] === '时间' || cond[0] === '时长' ? cond[1] : cond[1].replace(/(\d+)-/ig, '')}
                </span>
              ) : (
                cond[1].map(item => {
                  if (typeof item === 'object') {
                    return (
                      <span key={item.num}
                            style={{ fontSize: '12px', marginRight: '10px' }}
                      ><span>{item.num}</span><IceLabel style={{
                        backgroundColor: item.label_bg_color,
                        marginLeft: '5px',
                      }}
                      >{item.label}
                                              </IceLabel>
                      </span>
                    );
                  }
                  return (
                    <span key={item} style={{ fontSize: '12px', marginRight: '10px' }}>{item},</span>
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
          <PageTitle title={this.props.title} tour={{page: "meetanalyze"}}/>
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
                          <span style={{ whiteSpace: 'nowrap' }}>甲方话单:</span>
                          <FormBinder name="numA">
                            <SingleNumberSelector name="numA"
                                                  hideLabel
                                                  dataSource={search.ownerNums}
                                                  values={this.state.values}
                                                  onFormChange={this.onFormChange}
                                                  isLabel={this.state.labelPNs}
                            />
                          </FormBinder>
                        </label>
                      </span>
                      <br />
                      <span style={styles.caseNumber}>
                        <label style={styles.label}>
                          <span style={{ whiteSpace: 'nowrap' }}>乙方话单:</span>
                          <FormBinder name="numB">
                            <SingleNumberSelector name="numB"
                                                  hideLabel
                                                  dataSource={search.ownerNums}
                                                  values={this.state.values}
                                                  onFormChange={this.onFormChange}
                                                  isLabel={this.state.labelPNs}
                            />
                          </FormBinder>
                        </label>
                      </span>
                      <br />
                      <span style={styles.caseNumber}>
                        <label style={styles.label}>
                          <span style={{ whiteSpace: 'nowrap' }}>名义日期:</span>
                          <div style={{ width: '100%', margin: '0 4px' }}>
                            <MultipleDateSelect values={this.state.values}
                                                name="alyz_day"
                                                getAlyzDayData={this.getAlyzDayData}
                            />
                          </div>
                        </label>
                      </span>
                      <br />
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <span style={{ ...styles.caseNumber, width: 'initial', marginRight: '5px' }}>
                          <label style={styles.label}>
                            <span style={{ whiteSpace: 'nowrap' }}>计费类型:</span>
                            <FormBinder name="bill_type">
                              <Select
                                placeholder="计费类型"
                                style={{ ...styles.shortInput, width: '212px' }}
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
            <PageTitle title={this.props.title} tour={{page: "meetanalyze"}} collapsed={true}/>
          )
        }
        <div className="arrow1">
          <Icon type={this.state.isShow ? 'arrow-up' : 'arrow-down'} size="small" onClick={this.onArrowClick} />
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
    width: '115px',
    margin: '0 4px',
  },
  longInput: {
    // width: '825px',
  },
  caseNumber: {
    marginTop: '10px',
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
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions, ...pbStatActions, ...labelPNActions,clearItems}, dispatch),
  }),
)(SearchBar);
