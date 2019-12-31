import React, { Component, Fragment } from 'react';
import { Select } from '@alifd/next';
import { connect } from 'react-redux';
import IceLabel from '@icedesign/label';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { actions } from '../../../../bbStores/bbSearchStore';
// import { actions as labelPNActions } from '../../../../stores/labelPN/index';
import ajaxs from '../../../../utils/ajax';
import appConfig from '../../../../appConfig';

import customStyles from './index.module.scss';
import BankCardSimple from '../../common/BankCardSimple';
import { formatCardTypeFull } from '../../../../utils/bbillsUtils';
import _ from 'lodash';


const { Option, OptionGroup } = Select;

const initValue = {
  value: [],
  selectNumArr: [],
  activeIndex: 0,
  cardNums: [],
  initCardNums: [],
  initBankAccts: [],
  bankAccts: [],
}

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

const PEER_CUST_NUM = 'peer_cust_num';

class PeerAccountNumberSelector extends Component {
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
    const peer_card_num = [];
    const peer_bank_acct = [];
    value.forEach(item => {
      if (typeof item === 'string') {
        peer_card_num.push(item);
      }
      if (item.peer_card_num) {
        peer_card_num.push(item.peer_card_num);
      } else if (item.peer_bank_acct) {
        peer_bank_acct.push(item.peer_bank_acct);
      }
    });
    values.peer_bank_acct = peer_bank_acct;
    values.peer_card_num = peer_card_num;
    onFormChange(values);
    this.setState({
      value,
    }, () => {
      actions.setPeerAccountNumbersBbSearch(this.state)
    });
    this.handleSearchValue('');
  }

  formatSelectData(data) {
    const newData = [];
    data.map(item => {
      const value = item.peer_card_num || item.peer_bank_acct || item.value;
      newData.push({ label: item, value });
    });
    return newData;
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.bbSearchs.peerAccountVal && JSON.stringify(nextProps.bbSearchs.peerAccountVal.value) != JSON.stringify(this.state.value)) {
      const {values, onFormChange} = this.props;
      this.setState({...nextProps.bbSearchs.peerAccountVal}, () => {
        const peer_card_num = [];
        const peer_bank_acct = [];
        this.state.value.forEach(item => {
          if (typeof item === 'string') {
            peer_card_num.push(item);
          } else if (item.peer_card_num) {
            peer_card_num.push(item.peer_card_num);
          } else if (item.peer_bank_acct) {
            peer_bank_acct.push(item.peer_bank_acct);
          }
        });
        values.peer_bank_acct = peer_bank_acct;
        values.peer_card_num = peer_card_num;
        onFormChange(values);
      })
    }
  }

  componentDidMount() {
    this.fetchData();
    this.props.onRef && this.props.onRef(this);
  }


  fetchData() {
    const { actions, name, caseId } = this.props;
    if (name === PEER_CUST_NUM) {

    }
  }


  findOwnerCardNum = (x, item) => {
    return x.peer_card_num === item.peer_card_num
  }

  findOwnerBankAccts = (x, item) => {
    return !x.peer_card_num && x.peer_bank_acct === item.peer_bank_acct
  }

  async onClick(item, activeText) {
    this.setState({ tips: '' });
    let { value, selectNumArr} = this.state;
    const { values, name, onFormChange, caseId, actions } = this.props;
    if (activeText === 'cardNum') {
      let idx = selectNumArr.findIndex((x) => this.findOwnerCardNum(x, item));
      if (idx === -1) {
        selectNumArr.push(item);
      } else {
        selectNumArr.splice(idx, 1);
      }
    } else if (activeText === 'acct') {
      let idx = selectNumArr.findIndex((x) => this.findOwnerBankAccts(x, item));
      if (idx === -1) {
        selectNumArr.push(item);
      } else {
        selectNumArr.splice(idx, 1);
      }
    } else if (activeText === '无账户') {
      let idx = selectNumArr.indexOf('无账户');
      if (idx === -1) {
        selectNumArr.push(item);
      } else {
        selectNumArr.splice(idx, 1);
      }
    }
    value = [...selectNumArr]
    if (name === PEER_CUST_NUM) {
      const peer_card_num = [];
      const peer_bank_acct = [];
      value.forEach(item => {
        if (typeof item === 'string') {
          peer_card_num.push(item);
        }
        if (item.peer_card_num) {
          if (item.peer_card_num === '无账户') {
            peer_card_num.push('');
          } else {
            peer_card_num.push(item.peer_card_num);
          }
        }
        if (item.peer_bank_acct) {
          if (item.peer_bank_acct === '无账户') {
            peer_bank_acct.push('');
          } else {
            peer_bank_acct.push(item.peer_bank_acct);
          }
        }
      });
      values.peer_bank_acct = peer_bank_acct;
      values.peer_card_num = peer_card_num;
      onFormChange(values);
    }
    this.setState({
      value,
      selectNumArr,
      cardNums: this.state.initCardNums,
      bankAccts: this.state.initBankAccts
    }, () => {
      actions.setPeerAccountNumbersBbSearch(this.state)
    });
    this.handleSearchValue('');
  }

  itemCardNumRender(item, index) {
    const { LargItems, hideLabel, dataSource } = this.props;
    const {selectNumArr} = this.state;
    // if (Array.isArray(LargItems) && Array.isArray(dataSource)) {
    //   const result = LargItems.find((x) => {
    //     return x.num === item;
    //   });
    //   const ownerName = dataSource.find((x) => {
    //     return x.owner_name && x.owner_num === item;
    //   });
    //   if (result) {
    //     return (
    //       <li className="next-menu-item" style={{ ...styles.li, flex: hideLabel ? '0 0 33.33%' : '0 0 50%', overflow: 'hidden' }} onClick={() => { this.onClick(item); }} key={item + index} title={`${result.num} ${result.label}`}>
    //         <div className="next-menu-item-inner">
    //           {
    //             this.state.selectNumArr.indexOf(item) > -1 ? (
    //               <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
    //             ) : null
    //           }
    //           <span>
    //             {result.num}
    //           </span>
    //           <IceLabel inverse={false} style={{ fontSize: '12px', marginLeft: '5px', backgroundColor: result.label_bg_color, color: result.label_txt_color, padding: '2px' }}>{result.label}</IceLabel>
    //         </div>
    //       </li>
    //     );
    //   } else if (!result && ownerName) {
    //     return (
    //       <li className="next-menu-item" style={{ ...styles.li, flex: hideLabel ? '0 0 33.33%' : '0 0 50%', overflow: 'hidden' }} onClick={() => { this.onClick(item); }} key={item + index} title={`${ownerName.owner_num} ${ownerName.owner_name}`}>
    //         <div className="next-menu-item-inner">
    //           {
    //             this.state.selectNumArr.indexOf(item) > -1 ? (
    //               <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
    //             ) : null
    //           }
    //           <span>
    //             {ownerName.owner_num}
    //           </span>
    //           <IceLabel inverse={false} style={{ fontSize: '12px', marginLeft: '5px', padding: '2px' }}>{ownerName.owner_name}</IceLabel>
    //         </div>
    //       </li>
    //     );
    //   }
    // }
    return (
      <div className="next-menu-item"
          style={{ ...styles.li, flex: hideLabel ? '0 0 33.33%' : '0 0 50%' }}
          onClick={() => { this.onClick(item, 'cardNum'); }}
          key={item.peer_card_num + index}
          title={`${item.peer_bank_name} ${formatCardTypeFull(item.peer_card_type)} ${item.peer_card_num} ${item.peer_name}`}
      >
        <div className="next-menu-item-inner" style={{ lineHeight: '32px' }}>
          {
            selectNumArr.findIndex((x) => this.findOwnerCardNum(x, item)) > -1 ? (
              <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
            ) : null
          }
          <span className="next-menu-item-text">
            <BankCardSimple card={item.peer_card_num} name={item.peer_name} card_type={item.peer_card_type} bankCode={item.peer_bank_code} />
          </span>
        </div>
      </div>
    );
  }

  itemBankAcctsRender(item, index) {
    const { LargItems, hideLabel, dataSource } = this.props;
    const {selectNumArr} = this.state;
    // if (Array.isArray(LargItems) && Array.isArray(dataSource)) {
    //   const result = LargItems.find((x) => {
    //     return x.num === item;
    //   });
    //   const ownerName = dataSource.find((x) => {
    //     return x.owner_name && x.owner_num === item;
    //   });
    //   if (result) {
    //     return (
    //       <li className="next-menu-item" style={{ ...styles.li, flex: hideLabel ? '0 0 33.33%' : '0 0 50%', overflow: 'hidden' }} onClick={() => { this.onClick(item); }} key={item + index} title={`${result.num} ${result.label}`}>
    //         <div className="next-menu-item-inner">
    //           {
    //             this.state.selectNumArr.indexOf(item) > -1 ? (
    //               <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
    //             ) : null
    //           }
    //           <span>
    //             {result.num}
    //           </span>
    //           <IceLabel inverse={false} style={{ fontSize: '12px', marginLeft: '5px', backgroundColor: result.label_bg_color, color: result.label_txt_color, padding: '2px' }}>{result.label}</IceLabel>
    //         </div>
    //       </li>
    //     );
    //   } else if (!result && ownerName) {
    //     return (
    //       <li className="next-menu-item" style={{ ...styles.li, flex: hideLabel ? '0 0 33.33%' : '0 0 50%', overflow: 'hidden' }} onClick={() => { this.onClick(item); }} key={item + index} title={`${ownerName.owner_num} ${ownerName.owner_name}`}>
    //         <div className="next-menu-item-inner">
    //           {
    //             this.state.selectNumArr.indexOf(item) > -1 ? (
    //               <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
    //             ) : null
    //           }
    //           <span>
    //             {ownerName.owner_num}
    //           </span>
    //           <IceLabel inverse={false} style={{ fontSize: '12px', marginLeft: '5px', padding: '2px' }}>{ownerName.owner_name}</IceLabel>
    //         </div>
    //       </li>
    //     );
    //   }
    // }
    return (
      <div className="next-menu-item"
          style={{ ...styles.li, flex: hideLabel ? '0 0 33.33%' : '0 0 50%' }}
          onClick={() => { this.onClick(item, 'acct'); }}
          key={item.peer_bank_acct + index}
          title={`${item.peer_bank_name} ${item.peer_bank_acct} ${item.peer_name}`}
      >
        <div className="next-menu-item-inner" style={{ lineHeight: '32px' }}>
          {
            selectNumArr.findIndex((x) => this.findOwnerBankAccts(x, item)) > -1 ? (
              <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
            ) : null
          }
          <BankCardSimple card={item.peer_bank_acct} bankCode={item.peer_bank_code} name={item.peer_name} />
        </div>
      </div>
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
          bankAccts: initBankAccts
        })
        return
      }
      axios.post(`${appConfig.rootUrl}/cases/${this.props.caseId}/bbills/suggest-peer-bank-accts-and-nums`, { q: val }, { cancelToken: new CancelToken(((c) => {
          that.source = c;
        })) }).then(response => {
        const res = response.data;
        if (res.meta && res.meta.success) {
          let selectData = res.data;
          if (val) {
            cardNums = selectData.nums
            bankAccts = selectData.accts
          }
          this.setState({
            cardNums,
            bankAccts
          })
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
    let { selectNumArr } = this.state;
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
    const { activeIndex } = this.state;
    // const { LargItems, dataSource } = this.props;
    // const result = LargItems.find((x) => {
    //   return x.num === v.value;
    // });
    // const ownerName = dataSource.find((x) => {
    //   return x.owner_name && x.owner_num === v.value;
    // });
    // if (result) {
    //   return (
    //     <span>
    //       {result.num}
    //       <IceLabel inverse={false} style={{ fontSize: '12px', marginLeft: '5px', backgroundColor: result.label_bg_color, color: result.label_txt_color, padding: '2px' }}>{result.label}</IceLabel>
    //     </span>
    //   );
    // } else if (ownerName) {
    //   return (
    //     <span>
    //       {ownerName.owner_num}
    //       <IceLabel inverse={false} style={{ fontSize: '12px', marginLeft: '5px', padding: '2px' }}>{ownerName.owner_name}</IceLabel>
    //     </span>
    //   );
    // }
    if (typeof v.label === 'object') {
      const item = v.label;
      if (item.peer_card_num === '无账户') {
        return '无账户'
      }
      return <BankCardSimple card={item.peer_card_num || item.peer_bank_acct} name={item.peer_name}  card_type={item.peer_card_type} bankCode={item.peer_bank_code} />;
    }
    return v.value || v.label;
  }

  handleClick = (text) => {
    this.setState({
      activeIndex: text,
    });
  }

  componentWillUnmount() {
    const {actions, noClear} = this.props;
    if (noClear) {

    } else {
      actions.clearPeerAccountNumbersBbSearch()
    }
    this.setState = (state, callback) => {

    };
  }

  setValue = (val) => {
    let t = [];
    val.forEach(item => {
      let res = _.find(this.state.initCardNums, (d) => {
        return d.peer_card_num === item
      })
      let res2 = _.find(this.state.initBankAccts, (d) => {
        return d.peer_bank_acct === item
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
      this.props.actions.setPeerAccountNumbersBbSearch(this.state);
    });
  }

  clearValue = () => {
    this.setState({
      value: [],
      selectNumArr: [],
      bankAccts: [...this.state.initBankAccts],
      cardNums: [...this.state.initCardNums]
    }, () => {
      this.props.actions.setPeerAccountNumbersBbSearch(this.state);
    });
    this.searchVal = [];
  }


  render() {
    const { selectData, cardNums, bankAccts, selectNumArr, hideLabel, searchValue, activeIndex } = this.state;

    const popupContent =
      (
        <div style={styles.selectOptions} >
          <div style={{ position: 'absolute', color: 'red', top: '4px', zIndex: 99, left: '20px', fontSize: '12px' }}>
            {this.state.tips}
          </div>
          <div className="next-menu" style={{ ...styles.left }}>
            <div className="next-menu-item"
                style={{ ...styles.li, flex: hideLabel ? '0 0 33.33%' : '0 0 50%' }}
                onClick={() => { this.onClick({peer_card_num: '无账户', peer_bank_acct: '无账户'}, '无账户'); }}
                title={`无账户`}
            >
              <div className="next-menu-item-inner" style={{ lineHeight: '32px' }}>
                {
                  selectNumArr.indexOf('无账户') > -1 ? (
                    <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
                  ) : null
                }
                <span className="next-menu-item-text">
                        <span className="cardBox">
                          无账户
                        </span>
                      </span>
              </div>
            </div>
            <div style={{width: '100%'}}>
              {
                cardNums.length > 0 ? (
                  <div>
                    <h3 className={customStyles.filterTitle}>对方卡号</h3>
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
                    <h3 className={customStyles.filterTitle}>对方账号</h3>
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
          </div>
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
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    border: 'none',
    height: 'fit-content',
  },
  li: {
    flex: 1,
    padding: '0 20px',
    height: '32px',
    lineHeight: '32px',
    fontSize: '12px',
  },
  right: {
    flex: '0 0 33.33%',
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
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(PeerAccountNumberSelector);
