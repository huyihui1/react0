import React, {Component} from 'react';
import {Select} from '@alifd/next';
import {connect} from 'react-redux';
import IceLabel from '@icedesign/label';
import {bindActionCreators} from 'redux';
import {actions} from '../../../stores/labelCell';
import ajaxs from '../../../utils/ajax';
import appConfig from '../../../appConfig';


const {Option, OptionGroup} = Select;


class CtCodeSelect extends Component {
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
      isLabel: null,
      peerLabelNum: [],
      peerNumDataSource: [],
      tips: ''
    };
    this.searchVal = [];
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
    const {values, name, onFormChange} = this.props;
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
      newData.push({label: item.ct_code ? item.ct_code : item, value: item.ct_code ? item.ct_code : item});
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
    if (nextProps.labelCell) {
      this.setState({
        selectData: nextProps.labelCell,
        peerNumDataSource: nextProps.labelCell,
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
  }


  fetchLabelGroup() {
    const {actions} = this.props;

    actions.fetchLabelCells({caseId: this.props.caseId}, {query: { page: 1, pagesize: appConfig.largePageSize, }})
    actions.fetchLabelGroupLabelCell({caseId: this.props.caseId}).then(res => {
      if (res.body.meta && res.body.meta.success) {
        this.setState({
          labelGroup: res.body.data,
        });
      }
    }).catch(err => {
      console.log(err);
    });
  }

  async getSuggestOwnerNums(input) {
    const res = await ajaxs.post(`/cases/${this.props.caseId}/pbills/suggest-owner-nums`, {input});
    if (res.meta && res.meta.success) {
      return res.data;
    }
    return false;
  }

  async onClick(item, bool = false) {
    this.setState({tips: ''});

    let {value, selectLabel, lableArr, selectNumArr, selectData} = this.state;
    const {values, name, onFormChange, caseId, labelCell} = this.props;
    if (bool) {
      const res = await ajaxs.post(`/cases/${caseId}/label_groups/cell-towers`, {label_group: item});
      if (res.meta && res.meta.success) {
        if (selectLabel.indexOf(item) === -1) {
          selectLabel.push(item);
          if (res.data.codes) {
            lableArr = Array.from(new Set([...lableArr, ...res.data.codes]));
          }
        } else {
          selectLabel.splice(selectLabel.indexOf(item), 1);
          if (res.data.codes) {
            const v = lableArr.filter((i => {
              return res.data.codes.indexOf(i) === -1;
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
    value = Array.from(new Set([...selectNumArr, ...lableArr]));
    values[name] = value;
    onFormChange(values);
    selectData = labelCell;

    this.setState({
      value,
      selectNumArr,
      selectData,
    });
    this.handleSearchValue('');
  }

  itemRender(item, index) {
    const {hideLabel} = this.props;
    return (
      <li className="next-menu-item"
          style={{...styles.li, flex: hideLabel ? '0 0 33.33%' : '0 0 50%', overflow: 'hidden'}} onClick={() => {
        this.onClick(item.ct_code);
      }} key={item + index} title={`${item.ct_code} ${item.label}`}>
        <div className="next-menu-item-inner">
          {
            this.state.selectNumArr.indexOf(item.ct_code) > -1 ? (
              <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{color: '#3080fe'}}/>
            ) : null
          }
          <span>
            {item.ct_code}
          </span>
          <IceLabel inverse={false} style={{
            fontSize: '12px',
            marginLeft: '5px',
            backgroundColor: item.marker_color,
            color: '#fff',
            padding: '2px'
          }}>{item.label}</IceLabel>
        </div>
      </li>
    );
  }

  onScroll(t) {
    let {endIndex, isRequest} = this.state;
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
    if (reg.test(val)) {
      return true;
    }
    return false;
  }

  async onSearch(val) {
    this.handleSearchValue(val);
  }

  onKeyDown(e) {
    const {labelCell, name} = this.props;
    let {searchValue, selectData, peerLabelNum, peerNumDataSource} = this.state;
    if (e.keyCode === 13 && searchValue) {
      if (this.checkChinese(searchValue)) {
        this.setState({tips: '格式不正确'})
      } else {
        this.onClick(searchValue);
        selectData = labelCell;
        this.setState({tips: ''});
        this.setState({
          selectData,
        });
      }
    }
  }

  onRemove(item) {
    const {name, labelCell} = this.props;
    let {selectNumArr, lableArr, peerNumDataSource, peerLabelNum, selectData} = this.state;
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
    selectData = labelCell;

    this.setState({
      selectData,
    });
  }

  onVisibleChange(visible) {
    this.setState({tips: ''});
    let {selectData, peerLabelNum, peerNumDataSource} = this.state;
    const {labelCell, name} = this.props;
    if (!visible) {
      selectData = labelCell;

      this.setState({
        selectData,
      });
      this.handleSearchValue('');
    }
  }

  render() {
    const {selectData, endIndex, hideLabel, searchValue} = this.state;

    const popupContent =
      (<div style={styles.selectOptions} onScroll={this.onScroll}>
        <div style={{position: 'absolute', color: 'red', top: '5px', zIndex: 99, left: '20px', fontSize: '12px'}}>
          {this.state.tips}
        </div>
        <ul className="next-menu" style={{...styles.left, flex: hideLabel ? 1 : '0 0 66.66%'}}>
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
                this.props.labelGroup && this.props.labelGroup.map((item, index) => {
                  return (
                    <li className="next-menu-item" style={{...styles.li, flex: 'initial'}} onClick={() => {
                      this.onClick(item.name, true);
                    }} key={item.name + index}>
                      <div className="next-menu-item-inner">
                        {
                          this.state.selectLabel.indexOf(item.name) > -1 ? (
                            <i className="next-icon next-icon-select next-medium next-menu-icon-selected"
                               style={{color: '#3080fe'}}/>
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
            </ul>
          )
        }
      </div>);

    return (
      <Select
        mode="tag"
        // mode={hideLabel ? 'single' : 'multiple'}
        popupContent={popupContent}
        style={{...styles.input, ...styles.longInput}}
        value={this.formatSelectData(this.state.value)}
        searchValue={searchValue}
        onChange={this.onSelectChange}
        onSearch={this.onSearch}
        onKeyDown={this.onKeyDown}
        onRemove={this.onRemove}
        filterLocal={false}
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
    width: '79%',
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
    labelCells: state.labelCells,
    labelCell: state.labelCells.items,
    labelGroup: state.labelCells.labelGroup,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(CtCodeSelect);
