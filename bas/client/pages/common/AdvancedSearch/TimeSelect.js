import React, {Component} from 'react';
import {Select} from '@alifd/next';
import {TIME_RANGE_RULE,DURATION_RULE} from '../../../fieldConstraints'


class TimeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      selectData: [],
      searchValue: '',
      selectNumArr: [],
      tips: ''
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.handleSearchValue = this.handleSearchValue.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
  }

  onSelectChange(value) {
    const {values, name, onFormChange} = this.props;
    const t = [];
    values[name] = value;
    onFormChange(values);
    this.setState({
      value,
    });
    this.handleSearchValue('');
  }

  formatSelectData(data) {
    if (data.length > 0) {
      const newData = [];
      data.map(item => {
        if (item.label) {
          newData.push(item)
        } else {
          newData.push({label: item, value: item});
        }
      });
      return newData;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.values[nextProps.name] && nextProps.values[nextProps.name].toString() !== this.state.value.toString()) {
      this.setState({
        value: nextProps.values[nextProps.name],
      });
    } else if (!nextProps.values[nextProps.name]) {
      this.setState({
        value: [],
      });
    }
  }

  componentDidMount() {

  }


  async onClick(item) {
    if (!TIME_RANGE_RULE.test(item) && this.props.name === 'started_time') {
      this.setState({tips: '时间格式不正确'});
      return
    } else if (!DURATION_RULE.test(item) && this.props.name === 'duration') {
      this.setState({tips: '时长格式不正确'});
      return
    } else if (this.checkChinese(item) && this.props.name === 'owner_lac') {
      this.setState({tips: 'LAC格式不正确'});
      return
    } else if (this.checkChinese(item) && this.props.name === 'owner_ci') {
      this.setState({tips: 'CI格式不正确'});
      return
    } else {
      this.setState({tips: ''});
    }
    let {value, selectNumArr, selectData} = this.state;
    const {values, name, onFormChange} = this.props;
    if (name === 'started_time') {
      item = item.split('-');
      item.forEach((i, index) => {
        let l = i.split(":")[0].toString().paddingLeft("00");
        let r = i.split(":")[1].toString().paddingLeft("00");
        item[index] = `${l}:${r}`
      })
      if (item.length > 0) {
        item = item.join('-')
      }
    }
    if (value.indexOf(item) === -1) {
      // value.push(item);
      value.push(item);
    } else {
      // value.splice(value.indexOf(item), 1);
      value.splice(value.indexOf(item), 1);
    }
    selectNumArr = Array.from(new Set([...value]));
    values[name] = value;
    onFormChange(values);
    selectData = [];
    this.setState({
      value,
      selectNumArr,
      selectData,
    });
    this.handleSearchValue('');
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
    this.setState({
      selectData: [val],
    });
    this.handleSearchValue(val);
  }

  onKeyDown(e) {
    let {searchValue, selectData} = this.state;
    if (e.keyCode === 13 && searchValue) {
      if (!TIME_RANGE_RULE.test(searchValue) && this.props.name === 'started_time') {
        this.setState({tips: '时间格式不正确'});
      } else if (!DURATION_RULE.test(searchValue) && this.props.name === 'duration') {
        this.setState({tips: '时长格式不正确'});
      } else if (this.checkChinese(searchValue) && this.props.name === 'owner_lac') {
        this.setState({tips: 'LAC格式不正确'});
      } else if (this.checkChinese(searchValue) && this.props.name === 'owner_ci') {
        this.setState({tips: 'CI格式不正确'});
      } else {
        this.onClick(searchValue);
        selectData = [];
        this.setState({tips: ''});

        this.setState({
          selectData,
        });
      }
    }
  }

  onRemove(item) {
    let value = JSON.parse(JSON.stringify(this.state.value));
    if (value.indexOf(item.value) !== -1) {
      value.splice(value.indexOf(item.value), 1);
      this.onSelectChange(value);
      console.log(value);
    }


    this.setState({
      value,
      selectNumArr: value
    });
  }

  onVisibleChange(visible) {
    this.setState({tips: ''});
    let {selectData} = this.state;
    if (!visible) {
      selectData = [];

      this.setState({
        selectData,
      });
      this.handleSearchValue('');
    }
  }

  render() {
    const {selectData, hideLabel, searchValue} = this.state;
    const popupContent =
      (<div style={styles.selectOptions}>
        <div style={{position: 'absolute', color: 'red', top: 0, zIndex: 99, left: '10px', fontSize: '12px'}}>
          {this.state.tips}
        </div>
        <ul className="next-menu" style={{...styles.left, flex: 1}}>
          {
            selectData.map((item, index) => {
              return (
                <li className="next-menu-item" onClick={() => {
                  this.onClick(item);
                }} key={item + index}>
                  <div className="next-menu-item-inner">
                    {
                      this.state.selectNumArr.indexOf(item) > -1 ? (
                        <i className="next-icon next-icon-select next-medium next-menu-icon-selected"
                           style={{color: '#3080fe'}}/>
                      ) : null
                    }
                    <span>
                      {
                        item
                      }
                    </span>
                  </div>
                </li>
              );
            })
          }
        </ul>

      </div>);

    return (
      <Select
        mode="tag"
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
        placeholder={this.props.placeholder}
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
    position: 'relative',
    width: '100%',
    height: '60px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-around',
    background: '#fff',
    border: '1px solid #eee',
    padding: '8px 0',
    fontSize: '14px',
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


export default TimeSelect;
