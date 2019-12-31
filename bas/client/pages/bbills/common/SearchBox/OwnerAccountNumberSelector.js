import React, { Component, Fragment } from 'react';
import { Select } from '@alifd/next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import _ from 'lodash'
import { actions } from '../../../../bbStores/bbSearchStore';
import ajaxs from '../../../../utils/ajax';
import appConfig from '../../../../appConfig';

import customStyles from './index.module.scss';
import BankCardSimple from '../../common/BankCardSimple';
import { formatCardTypeFull } from '../../../../utils/bbillsUtils';


const { Option, OptionGroup } = Select;

const initValue = {
  value: [],
  selectNumArr: [],
  activeIndex: 0,
  cardNums: [],
  initCardNums: [],
  initBankAccts: [],
  bankAccts: [],
};

const data = [
  {
    label: '卡',
    value: 0,
  },
  {
    label: '账',
    value: 1,
  },
];

const OWNER_CUST_NUM = 'owner_cust_num';
const PEER_CUST_NUM = 'peer_cust_num';

class OwnerAccountNumberSelector extends Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(JSON.stringify(initValue));
    this.searchVal = [];
    this.source;
    this.onSelectChange = this.onSelectChange.bind(this);
    this.itemCardNumRender = this.itemCardNumRender.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.handleSearchValue = this.handleSearchValue.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
  }

  onSelectChange(value) {
    const { values, name, onFormChange, actions } = this.props;
    const owner_card_num = [];
    const owner_bank_acct = [];
    value.forEach(item => {
      if (typeof item === 'string') {
        owner_card_num.push(item);
      }
      if (item.owner_card_num) {
        owner_card_num.push(item.owner_card_num);
      } else if (item.owner_bank_acct) {
        owner_bank_acct.push(item.owner_bank_acct);
      }
    });
    values.owner_bank_acct = owner_bank_acct;
    values.owner_card_num = owner_card_num;
    onFormChange(values);
    this.setState({
      value,
    }, () => {
      actions.setOwnerAccountNumbersBbSearch(this.state);
    });
    this.handleSearchValue('');
  }

  formatSelectData(data) {
    const newData = [];
    data.map(item => {
      const value = item.owner_card_num || item.owner_bank_acct || item.value;
      newData.push({ label: item, value });
    });
    return newData;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bbSearchs.ownerAccountVal && JSON.stringify(nextProps.bbSearchs.ownerAccountVal.value) != JSON.stringify(this.state.value)) {
      const { values, onFormChange } = this.props;
      this.setState({ ...nextProps.bbSearchs.ownerAccountVal }, () => {
        const owner_card_num = [];
        const owner_bank_acct = [];
        this.state.value.forEach(item => {
          if (typeof item === 'string') {
            owner_card_num.push(item);
          } else if (item.owner_card_num) {
            owner_card_num.push(item.owner_card_num);
          } else if (item.owner_bank_acct) {
            owner_bank_acct.push(item.owner_bank_acct);
          }
        });
        values.owner_bank_acct = owner_bank_acct;
        values.owner_card_num = owner_card_num;
        onFormChange(values);
      });
    }
  }

  componentDidMount() {
    this.fetchData();
    this.props.onRef && this.props.onRef(this);
  }

  fetchData() {
    const { actions, name, caseId } = this.props;
    if (name === OWNER_CUST_NUM) {
      actions.fetchOwnerBankAcctsAndCardNumsBbSearch({ case_id: caseId }).then(res => {
        if (res.body.meta.success) {
          const data = res.body.data;
          this.setState({
            bankAccts: data.owner_bank_accts,
            initBankAccts: [...data.owner_bank_accts],
            cardNums: data.owner_card_nums,
            initCardNums: [...data.owner_card_nums],
          });
        }
      });
    }
  }


  findOwnerCardNum = (x, item) => {
    return x.owner_card_num && x.owner_card_num === item.owner_card_num;
  }

  findOwnerBankAccts = (x, item) => {
    return !x.owner_card_num && x.owner_bank_acct === item.owner_bank_acct;
  }

  async onClick(item, bool = true) {
    this.setState({ tips: '' });
    let { value, selectNumArr, activeIndex } = this.state;
    const { values, name, onFormChange, caseId, actions } = this.props;
    if (bool) {
      const idx = selectNumArr.findIndex((x) => this.findOwnerCardNum(x, item));
      if (idx === -1) {
        selectNumArr.push(item);
      } else {
        selectNumArr.splice(idx, 1);
      }
    } else if (bool === false) {
      const idx = selectNumArr.findIndex((x) => this.findOwnerBankAccts(x, item));
      if (idx === -1) {
        selectNumArr.push(item);
      } else {
        selectNumArr.splice(idx, 1);
      }
    }
    value = [...selectNumArr];
    if (name === OWNER_CUST_NUM) {
      const owner_card_num = [];
      const owner_bank_acct = [];
      value.forEach(item => {
        if (typeof item === 'string') {
          owner_card_num.push(item);
        } else if (item.owner_card_num) {
          owner_card_num.push(item.owner_card_num);
        } else if (item.owner_bank_acct) {
          owner_bank_acct.push(item.owner_bank_acct);
        }
      });
      values.owner_bank_acct = owner_bank_acct;
      values.owner_card_num = owner_card_num;
      onFormChange(values);
    }
    this.setState({
      value,
      selectNumArr,
      cardNums: this.state.initCardNums,
      bankAccts: this.state.initBankAccts,
    }, () => {
      actions.setOwnerAccountNumbersBbSearch(this.state);
    });
    this.handleSearchValue('');
  }

  itemCardNumRender(item, index) {
    const { LargItems, hideLabel } = this.props;
    const { selectNumArr } = this.state;
    if (Array.isArray(LargItems)) {
      const result = LargItems.find((x) => {
        return x.bank_acct === item.owner_bank_acct && x.card_num === item.owner_card_num;
      });
      if (result) {
        item.bankAcctLable = result
      }
    }
    return (
      <li className="next-menu-item"
        style={{ ...styles.li, flex: hideLabel ? '0 0 33.33%' : '0 0 50%' }}
        onClick={() => { this.onClick(item); }}
        key={item.owner_card_num + index}
        title={`${item.owner_bank_name} ${formatCardTypeFull(item.owner_card_type)} ${item.owner_card_num} ${item.owner_name}`}
      >
        <div className="next-menu-item-inner" style={{ lineHeight: '32px' }}>
          {
            selectNumArr.findIndex((x) => this.findOwnerCardNum(x, item)) > -1 ? (
              <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
            ) : null
          }
          <span className="next-menu-item-text">
            <BankCardSimple card={item.owner_card_num} name={item.bankAcctLable || item.owner_name} card_type={item.owner_card_type} bankCode={item.owner_bank_code} />
          </span>
        </div>
      </li>
    );
  }

  itemBankAcctsRender(item, index) {
    const { LargItems, hideLabel } = this.props;
    const { selectNumArr } = this.state;
    if (Array.isArray(LargItems)) {
      const result = LargItems.find((x) => {
        return x.bank_acct === item.owner_bank_acct
      });
      if (result) {
        item.bankAcctLable = result
      }
    }
    return (
      <li className="next-menu-item"
        style={{ ...styles.li, flex: hideLabel ? '0 0 33.33%' : '0 0 50%' }}
        onClick={() => { this.onClick(item, false); }}
        key={item.owner_bank_acct + index}
        title={`${item.owner_bank_name} ${item.owner_bank_acct} ${item.owner_name}`}
      >
        <div className="next-menu-item-inner" style={{ lineHeight: '32px' }}>
          {
            selectNumArr.findIndex((x) => this.findOwnerBankAccts(x, item)) > -1 ? (
              <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
            ) : null
          }
          <BankCardSimple card={item.owner_bank_acct} bankCode={item.owner_bank_code} name={item.bankAcctLable || item.owner_name} />
        </div>
      </li>
    );
  }


  handleSearchValue(value) {
    if (this.state.searchValue === value) {

    } else {
      this.setState({
        searchValue: value,
      });
    }
  }

  checkChinese(val) {
    const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
    if (reg.test(val)) { return true; }
    return false;
  }

  cancelRequest = () => {
    if (typeof this.source === 'function') {
      this.source('终止请求');
    }
  }

  async onSearch(val) {
    this.handleSearchValue(val);
    let { activeIndex, cardNums, bankAccts, initCardNums, initBankAccts } = this.state;
    const { name } = this.props;
    if (this.checkChinese(val) || !isNaN(val * 1)) {
      const CancelToken = axios.CancelToken;
      const that = this;

      // 取消上一次请求
      this.cancelRequest();

      this.searchVal[0] = val;
      if (val === '') {
        this.setState({
          cardNums: initCardNums,
        });
        return;
      }
      axios.post(`${appConfig.rootUrl}/cases/${this.props.caseId}/bbills/suggest-owner-bank-accts-and-nums`, { q: val }, { cancelToken: new CancelToken(((c) => {
          that.source = c;
        })) }).then(response => {
        const res = response.data;
        if (res.meta && res.meta.success) {
          const selectData = res.data;
          if (val) {
            cardNums = selectData.nums
            bankAccts = selectData.accts
          }
          this.setState({
            cardNums,
            bankAccts
          });
        }
      }).catch((err) => {
        if (axios.isCancel(err)) {
          // 请求如果被取消，这里是返回取消的message
        } else {
          // handle error
          console.log(err);
        }
      });
      this.setState({
        selectData: [val],
      });
    }
  }

  onRemove(item) {
    const { selectNumArr } = this.state;
    if (selectNumArr.indexOf(item.label) !== -1) {
      selectNumArr.splice(selectNumArr.indexOf(item.label), 1);
      this.onSelectChange(selectNumArr, false);
      console.log(selectNumArr);
      this.setState({
        selectNumArr,
      });
    }
  }
  onVisibleChange(visible) {
    this.setState({
      tips: '',
      bankAccts: [...this.state.initBankAccts],
      cardNums: [...this.state.initCardNums]
    });

    this.handleSearchValue('');
  }

  valueRender = (v) => {
    if (typeof v.label === 'object') {
      const item = v.label;
      return <BankCardSimple card={item.owner_card_num || item.owner_bank_acct} name={item.bankAcctLable || item.owner_name} card_type={item.owner_card_type} bankCode={item.owner_bank_code} />;
    }
    return v.value || v.label;
  }

  handleClick = (text) => {
    this.setState({
      activeIndex: text,
    });
  }

  componentWillUnmount() {
    const { actions, noClear } = this.props;
    if (noClear) {

    } else {
      actions.clearOwnerAccountNumbersBbSearch();
    }
    this.setState = (state, callback) => {

    };
  }

  setValue = (val) => {
    let t = [];
    val.forEach(item => {
      let res = _.find(this.state.initCardNums, (d) => {
        return d.owner_card_num === item
      })
      let res2 = _.find(this.state.initBankAccts, (d) => {
        return d.owner_bank_acct === item
      })
      if (res || res2) {
        t.push(res || res2)
      }
    })
    this.setState({
      value: t,
      selectNumArr: t,
      bankAccts: [...this.state.initBankAccts],
      cardNums: [...this.state.initCardNums]
    }, () => {
      this.props.actions.setOwnerAccountNumbersBbSearch(this.state);
    });
  }

  clearValue = () => {
    this.setState({
      value: [],
      selectNumArr: [],
      bankAccts: [...this.state.initBankAccts],
      cardNums: [...this.state.initCardNums]
    }, () => {
      this.props.actions.setOwnerAccountNumbersBbSearch(this.state);
    });
    this.searchVal = [];
  }


  render() {
    const { selectData, cardNums, bankAccts, endIndex, hideLabel, searchValue, activeIndex } = this.state;

    const popupContent =
      (
        <div style={styles.selectOptions} >
          <div style={{ position: 'absolute', color: 'red', top: '4px', zIndex: 99, left: '20px', fontSize: '12px' }}>
            {this.state.tips}
          </div>
          <div className="next-menu" style={{ ...styles.left, flex: hideLabel ? 1 : '0 0 80%' }}>
            {
              cardNums.length > 0 ? (
                <div>
                  <h3 className={customStyles.filterTitle}>本方卡号</h3>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {
                      cardNums.map((item, index) => {
                        return this.itemCardNumRender(item, index);
                      })
                    }
                  </div>
                </div>
              ) : null
            }
            {
              bankAccts.length > 0 ? (
                <div>
                  <h3 className={customStyles.filterTitle}>本方账号</h3>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {
                      bankAccts.map((item, index) => {
                        return this.itemBankAcctsRender(item, index);
                      })
                    }
                  </div>
                </div>
              ) : null
            }
          </div>
          {
            hideLabel ? null : (
              <ul className="next-menu" style={styles.right}>
                {
                  this.state.labelGroup && this.state.labelGroup.map((item, index) => {
                    return (
                      <li className="next-menu-item" style={{ ...styles.li, flex: 'initial' }} onClick={() => { this.onClick(item.name, true); }} key={item.name + index}>
                        <div className="next-menu-item-inner">
                          {
                            this.state.selectLabel.indexOf(item.name) > -1 ? (
                              <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
                            ) : null
                          }
                          <span>
                            {item.name}
                          </span>
                        </div>
                      </li>
                    );
                  })
                }
                {/* { */}
                {/* this.props.name !== 'peer_num' ? ( */}
                {/* <li className="next-menu-item" style={{ ...styles.li, flex: 'initial' }} onClick={() => { this.onAllNum(); }} key="全选"> */}
                {/* <div className="next-menu-item-inner"> */}
                {/* { */}
                {/* this.state.allNum ? ( */}
                {/* <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} /> */}
                {/* ) : null */}
                {/* } */}
                {/* <span>全选</span> */}
                {/* </div> */}
                {/* </li> */}
                {/* ) : null */}
                {/* } */}
              </ul>
            )
          }
        </div>
      );

    return (
      <Fragment>
        <Select
          mode="tag"
          // mode={hideLabel ? 'single' : 'multiple'}
          popupContent={popupContent}
          style={{ ...styles.input, ...styles.longInput }}
          value={this.formatSelectData(this.state.value)}
          searchValue={searchValue}
          onChange={this.onSelectChange}
          onSearch={this.onSearch}
          onRemove={this.onRemove}
          filterLocal={false}
          valueRender={this.valueRender}
          onVisibleChange={this.onVisibleChange}
        />
      </Fragment>
    );
  }
}

const styles = {
  caseNumber: {
    marginTop: '10px',
    marginRight: '16px',
    display: 'inline-block',
    width: '100%',
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    // whiteSpace: 'nowrap',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    margin: '0 4px',
    letterSpacing: 0,
  },
  selectOptions: {
    width: '100%',
    height: '260px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-around',
    background: '#fff',
    border: '1px solid #eee',
    padding: '8px 0',
    fontSize: '14px',
    position: 'relative',
  },
  left: {
    flex: '0 0 72%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    border: 'none',
    height: 'fit-content',
  },
  li: {
    flex: '0 0 50%',
    padding: '0 15px',
    height: '32px',
    lineHeight: '32px',
    fontSize: '12px',
    overflow: 'hidden'
  },
  right: {
    flex: '0 0 20%',
    display: 'flex',
    flexDirection: 'column',
    border: 'none',
    height: 'fit-content',
  },
};


export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    bbSearchs: state.bbSearchs,
    LargItems: state.bankAcctLables.LargItems,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(OwnerAccountNumberSelector);
