import React, { Component } from 'react';
import { Select } from '@alifd/next';
import { connect } from 'react-redux';
import IceLabel from '@icedesign/label';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { actions } from '../../../stores/SearchStore/index';
import { actions as labelPNActions } from '../../../stores/labelPN/index';
import ajaxs from '../../../utils/ajax';
import appConfig from '../../../appConfig';


const { Option, OptionGroup } = Select;


class NumberSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      lableArr: [],
      selectNumArr: [],
      labelGroup: [],
      selectData: [],
      isRequest: true,
      endIndex: 200,
      hideLabel: false,
      searchValue: '',
      selectLabel: [],
      LargItems: null,
      peerLabelNum: [],
      peerNumDataSource: [],
      initDataSource: [],
      tips:'',
      allNum: false
    };
    this.searchVal = [];
    this.source;
    this.onSelectChange = this.onSelectChange.bind(this);
    this.itemRender = this.itemRender.bind(this);
    this.fetchLabelGroup = this.fetchLabelGroup.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.getSuggestOwnerNums = this.getSuggestOwnerNums.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.handleSearchValue = this.handleSearchValue.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
  }

  onSelectChange(value, bool = true) {
    const { values, name, onFormChange } = this.props;
    const t = [];
    if (bool) {
      value.map(item => {
        t.push(item.value);
      });
      values[name] = t;
    } else {
      values[name] = value;
    }
    onFormChange(values);
    this.setState({
      value,
    });
    this.handleSearchValue('');
  }

  formatSelectData(data) {
    const newData = [];
    data.map(item => {
      newData.push({ label: item, value: item });
    });
    return newData;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.values[nextProps.name] && nextProps.values[nextProps.name].toString() !== this.state.value.toString()) {
      this.setState({
        value: nextProps.values[nextProps.name],
        selectNumArr: nextProps.values[nextProps.name],
      });
    } else if (!nextProps.values[nextProps.name]) {
      this.setState({
        value: [],
        selectNumArr: [],
      });
    }

    if (nextProps.dataSource && nextProps.dataSource.toString() !== this.state.selectData.toString()) {
      if (nextProps.name != 'peer_num') {
        const selectData = [];
        nextProps.dataSource.forEach(item => {
          selectData.push(item.owner_num);
        });
        this.setState({
          selectData,
          initDataSource: selectData,
        });
      }
    }

    if (nextProps.LargItems && nextProps.dataSource && JSON.stringify(nextProps.LargItems) !== JSON.stringify(this.state.LargItems)) {
      if (nextProps.name === 'peer_num') {
        const dataSource = [];
        const peerLabelNum = [];
        nextProps.dataSource.forEach(item => {
          dataSource.push(item.owner_num);
        });
        nextProps.LargItems.forEach(item => {
          peerLabelNum.push(item.num);
          if (dataSource.indexOf(item.num) != -1) {
            dataSource.splice(dataSource.indexOf(item.num), 1);
          }
        });
        this.setState({
          peerLabelNum,
          peerNumDataSource: dataSource,
          selectData: [...peerLabelNum, ...dataSource],
        });
      }

      this.setState({
        LargItems: nextProps.LargItems,
      });
    }

    if (nextProps.hideLabel) {
      this.setState({
        hideLabel: nextProps.hideLabel,
      });
    }
  }

  componentDidMount() {
    this.fetchLabelGroup();
    this.fetchLargePBLabel();
  }

  fetchLargePBLabel = () => {
    const { fetchLargeLabelPN } = this.props.actions;
    fetchLargeLabelPN({ caseId: this.props.caseId }, {
      query: {
        page: 1,
        pagesize: appConfig.largePageSize,
      },
    })
  }

  fetchLabelGroup() {
    ajaxs.get(`/cases/${this.props.caseId}/pnum_labels/label-group`).then(res => {
      this.setState({
        labelGroup: res.data,
      });
    }).catch(err => {
      console.log(err);
    });
  }

  async getSuggestOwnerNums(input) {
    const res = await ajaxs.post(`/cases/${this.props.caseId}/pbills/suggest-owner-nums`, { input });
    if (res.meta && res.meta.success) {
      return res.data;
    }
    return false;
  }

  async onClick(item, bool = false) {
    this.setState({tips:''});
    let { value, selectLabel, lableArr, selectNumArr, selectData, peerLabelNum, peerNumDataSource, initDataSource, allNum } = this.state;
    const { values, name, onFormChange, caseId } = this.props;
    if (bool) {
      const res = await ajaxs.post(`/cases/${caseId}/label_groups/nums`, { label_group: item });
      if (res.meta && res.meta.success) {
        if (selectLabel.indexOf(item) === -1) {
          selectLabel.push(item);
          if (res.data.nums) {
            lableArr = Array.from(new Set([...lableArr, ...res.data.nums]));
          }
        } else {
          selectLabel.splice(selectLabel.indexOf(item), 1);
          if (res.data.nums) {
            const v = lableArr.filter((i => {
              return res.data.nums.indexOf(i) === -1;
            }));
            lableArr = v;
          }
        }
        this.setState({
          lableArr,
          selectLabel,
        });
      }
    } else if (selectNumArr.indexOf(item) === -1) {
      // value.push(item);
      selectNumArr.push(item);
    } else {
      // value.splice(value.indexOf(item), 1);
      selectNumArr.splice(selectNumArr.indexOf(item), 1);
    }
    selectData.forEach(item => {
      if (selectNumArr.indexOf(item) !== -1) {
        allNum = true
      } else {
        allNum = false
      }
    })
    value = Array.from(new Set([...selectNumArr, ...lableArr]));
    values[name] = value;
    onFormChange(values);
    if (name === 'peer_num') {
      selectData = [...peerLabelNum, ...peerNumDataSource];
    } else {
      selectData = initDataSource;
    }
    this.setState({
      value,
      selectNumArr,
      selectData,
      allNum
    });
    this.handleSearchValue('');
  }

  itemRender(item, index) {
    const { LargItems, hideLabel, dataSource } = this.props;
    if (Array.isArray(LargItems) && Array.isArray(dataSource)) {
      const result = LargItems.find((x) => {
        return x.num === item;
      });
      const ownerName = dataSource.find((x) => {
        return x.owner_name && x.owner_num === item
      })
      if (result) {
        return (
          <li className="next-menu-item" style={{ ...styles.li, flex: hideLabel ? '0 0 33.33%' : '0 0 50%', overflow: 'hidden' }} onClick={() => { this.onClick(item); }} key={item + index} title={`${result.num} ${result.label}`}>
            <div className="next-menu-item-inner">
              {
                this.state.selectNumArr.indexOf(item) > -1 ? (
                  <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
                ) : null
              }
              <span>
                {result.num}
              </span>
              <IceLabel inverse={false} style={{ fontSize: '12px', marginLeft: '5px', backgroundColor: result.label_bg_color, color: result.label_txt_color, padding: '2px' }}>{result.label}</IceLabel>
            </div>
          </li>
        );
      } else if (!result && ownerName) {
        return (
          <li className="next-menu-item" style={{ ...styles.li, flex: hideLabel ? '0 0 33.33%' : '0 0 50%', overflow: 'hidden' }} onClick={() => { this.onClick(item); }} key={item + index} title={`${ownerName.owner_num} ${ownerName.owner_name}`}>
            <div className="next-menu-item-inner">
              {
                this.state.selectNumArr.indexOf(item) > -1 ? (
                  <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
                ) : null
              }
              <span>
                {ownerName.owner_num}
              </span>
              <IceLabel inverse={false} style={{ fontSize: '12px', marginLeft: '5px',  padding: '2px' }}>{ownerName.owner_name}</IceLabel>
            </div>
          </li>
        )
      }
    }
    return (
      <li className="next-menu-item" style={{ ...styles.li, flex: hideLabel ? '0 0 33.33%' : '0 0 50%' }} onClick={() => { this.onClick(item); }} key={item + index} title={item}>
        <div className="next-menu-item-inner" style={{ lineHeight: '32px' }}>
          {
            this.state.selectNumArr.indexOf(item) > -1 ? (
              <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
            ) : null
          }
          <span className="next-menu-item-text">{item}</span>
        </div>
      </li>
    );
  }

  onScroll(t) {
    let { endIndex, isRequest } = this.state;
    const domH = t.target.scrollHeight;
    const scrollTop = t.target.scrollTop;
    if (this.state.selectData.length >= endIndex) {
      if (scrollTop > domH / 2 && isRequest) {
        this.setState({
          isRequest: false,
        });
        console.log('请求数据');

        if (this.state.selectData.length < endIndex + 200) {
          endIndex = this.state.selectData.length - endIndex;
          isRequest = false;
        } else {
          endIndex += 200;
        }

        this.setState({
          endIndex,
          isRequest,
        });
      }
    }
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
    if(typeof this.source ==='function'){
      this.source('终止请求')
    }
  }

  async onSearch(val) {
    this.handleSearchValue(val);
    const { peerLabelNum, peerNumDataSource, initDataSource } = this.state;
    const { name } = this.props;
    if (this.checkChinese(val) || !isNaN(val * 1)) {
      const CancelToken = axios.CancelToken
      const that = this;

      // 取消上一次请求
      this.cancelRequest();

      this.searchVal[0] = val;
      axios.post(`${appConfig.rootUrl}/cases/${this.props.caseId}/pbills/suggest-owner-nums`, { input: val }, {cancelToken: new CancelToken(function executor(c) {
        that.source = c;
      })}).then(response => {
        const res = response.data;
        if (res.meta && res.meta.success) {
          let selectData = res.data;
          if (val) {
            if (name === 'peer_num') {
              if (selectData.indexOf(val) === -1) {
                selectData = [...this.searchVal, ...selectData];
              }
            } else if (selectData.indexOf(val) === -1) {
              selectData = this.searchVal.concat(selectData);
            }
          } else {
            this.searchVal[0] = '';
            selectData.shift();
            if (name === 'peer_num') {
              selectData = [...peerLabelNum, ...peerNumDataSource];
            } else {
              selectData = initDataSource;
            }
          }
          this.setState({
            selectData,
          });
        }
      }).catch((err) => {
        if (axios.isCancel(err)) {
          //请求如果被取消，这里是返回取消的message
        } else {
          //handle error
          console.log(err);
        }
      })
      this.setState({
        selectData: [val],
      });
    }
  }
  onKeyDown(e) {
    const { name } = this.props;
    let { searchValue, selectData, peerLabelNum, peerNumDataSource, initDataSource } = this.state;
    if (e.keyCode === 13 && searchValue) {
      if (this.checkChinese(searchValue) && this.props.name === 'owner_num'){
        this.setState({tips:'本方号码格式错误'})
      } else if (this.checkChinese(searchValue) && this.props.name === 'peer_num'){
        this.setState({tips:'对方号码格式错误'})
      } else {
        this.setState({tips:''});

        this.onClick(searchValue);
        if (name === 'peer_num') {
          selectData = [...peerLabelNum, ...peerNumDataSource];
        } else {
          selectData = initDataSource;
        }
        this.setState({
          selectData,
        });
      }
    }
  }
  onRemove(item) {
    const { name  } = this.props;
    let { selectNumArr, lableArr, peerNumDataSource, peerLabelNum, selectData, initDataSource, allNum } = this.state;
    if (selectNumArr.indexOf(item.value) !== -1) {
      selectNumArr.splice(selectNumArr.indexOf(item.value), 1);
      this.onSelectChange(selectNumArr, false);
      console.log(selectNumArr);
      this.setState({
        selectNumArr,
      });
    }
    if (lableArr.indexOf(item.value) !== -1) {
      lableArr.splice(lableArr.indexOf(item.value), 1);
      if (lableArr.length === 0) {
        this.setState({
          lableArr,
          selectLabel: [],
        });
      } else {
        this.setState({
          lableArr,
        });
      }
    }
    if (selectData.indexOf(item.value) !== -1) {
      allNum = false
    }
    if (name === 'peer_num') {
      selectData = [...peerLabelNum, ...peerNumDataSource];
    } else {
      selectData = initDataSource;
    }
    this.setState({
      selectData,
      allNum
    });
  }
  onVisibleChange(visible) {
    this.setState({tips:''});
    let { selectData, peerLabelNum, peerNumDataSource, initDataSource } = this.state;
    const { name } = this.props;
    if (!visible) {
      if (name === 'peer_num') {
        selectData = [...peerLabelNum, ...peerNumDataSource];
      } else {
        selectData = initDataSource;
      }
      this.setState({
        selectData,
      });
      this.handleSearchValue('');
    }
  }
  onAllNum = () => {
    let { selectNumArr, lableArr, value, selectData, allNum } = this.state;
    const { values, name, onFormChange } = this.props;
    if (!allNum) {
      selectNumArr = selectData
    } else {
      selectNumArr = []
    }
    value = Array.from(new Set([...selectNumArr, ...lableArr]));
    values[name] = value;
    onFormChange(values);
    this.setState({
      value,
      selectNumArr,
      allNum: !this.state.allNum
    })
  }

  valueRender = (v) => {
    const { LargItems, dataSource } = this.props;
    const result = LargItems.find((x) => {
      return x.num === v.value;
    });
    const ownerName = dataSource.find((x) => {
      return x.owner_name && x.owner_num === v.value
    })
    if (result) {
      return (
        <span>
          {result.num}
            <IceLabel inverse={false} style={{ fontSize: '12px', marginLeft: '5px', backgroundColor: result.label_bg_color, color: result.label_txt_color, padding: '2px' }}>{result.label}</IceLabel>
        </span>
      )
    } else if (ownerName) {
      return (
        <span>
          {ownerName.owner_num}
          <IceLabel inverse={false} style={{ fontSize: '12px', marginLeft: '5px',  padding: '2px' }}>{ownerName.owner_name}</IceLabel>
        </span>
      )
    }
    else {
      return v.value
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {

    };
  }


  render() {
    const { selectData, endIndex, hideLabel, searchValue } = this.state;

    const popupContent =
      (<div style={styles.selectOptions} onScroll={this.onScroll}>
        <div style={{position: 'absolute', color: 'red', top: '4px', zIndex: 99, left: '20px', fontSize: '12px'}}>
          {this.state.tips}
        </div>
        <ul className="next-menu" style={{ ...styles.left, flex: hideLabel ? 1 : '0 0 66.66%' }}>
          {
            selectData && selectData.slice(0, endIndex).map((item, index) => {
              return this.itemRender(item, index);
            })
          }
        </ul>
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
              {
                this.props.name !== 'peer_num' ? (
                  <li className="next-menu-item" style={{ ...styles.li, flex: 'initial' }} onClick={() => { this.onAllNum(); }} key={'全选'}>
                    <div className="next-menu-item-inner">
                      {
                        this.state.allNum ? (
                          <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
                        ) : null
                      }
                      <span>全选</span>
                    </div>
                  </li>
                ) : null
              }
            </ul>
          )
        }
      </div>);

    return (
      <Select
        mode="tag"
        // mode={hideLabel ? 'single' : 'multiple'}
        popupContent={popupContent}
        style={{ ...styles.input, ...styles.longInput }}
        value={this.formatSelectData(this.state.value)}
        searchValue={searchValue}
        onChange={this.onSelectChange}
        onSearch={this.onSearch}
        onKeyDown={this.onKeyDown}
        onRemove={this.onRemove}
        filterLocal={false}
        valueRender={this.valueRender}
        onVisibleChange={this.onVisibleChange}
      />
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
    flex: '0 0 66.66%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    border: 'none',
    height: 'fit-content',
  },
  li: {
    flex: '0 0 50%',
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
    search: state.search,
    LargItems: state.labelPNs.LargItems,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions, ...labelPNActions }, dispatch),
  }),
)(NumberSelector);
