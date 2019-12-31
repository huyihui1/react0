import React, {Component} from 'react';
import {Select} from '@alifd/next';
import {TIME_RANGE_RULE, DURATION_RULE} from '../../../../fieldConstraints'
import {formatMoney} from '../../../../utils/bbillsUtils';


class SelectTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      selectData: [],
      searchValue: '',
      selectNumArr: [],
    };
    this.warning = '';
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
    if (!TIME_RANGE_RULE.test(item) && this.props.name === 'trx_time'){
      this.warning = '请输入正确的时间格式!';
      return
    } else if (this.props.name !== 'trx_time') {
      let t = item.split('-');
      for (let i = 0; i < t.length; i++) {
        const tElement = t[i];
        if (!/^(>|>=)?[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0.\d{1,2}$/.test(tElement)) {
          this.warning = '请输入正确的金额格式!';
          return
        }
      }
    }

    this.warning = '';
    let {value, selectNumArr, selectData} = this.state;
    const {values, name, onFormChange} = this.props;
    if (name === 'trx_time') {
      item = item.split('-');
      item.forEach((i, index) => {
        let l = i.split(":")[0].toString().paddingLeft("00");
        let r = i.split(":")[1].toString().paddingLeft("00");
        item[index] = `${l}:${r}`
      })
      if (item.length > 0) {
        item = item.join('-')
      }
    } else {
      item = item.split('-');
      item.forEach((i, index) => {
        item[index] = i.replace(/,|\.00/g, '')
      })
      if (item.length > 0) {
        item = item.join('-')
      }
    }
    if (value.indexOf(item) === -1) {
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

  async onSearch(val) {
    this.setState({
      selectData: [val],
    });
    this.handleSearchValue(val);
  }

  onKeyDown(e) {
    let {searchValue, selectData} = this.state;
    if (e.keyCode === 13 && searchValue) {
      this.onClick(searchValue);
      selectData = [];
      this.setState({
        selectData,
      });
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
    let {selectData} = this.state;
    if (!visible) {
      selectData = [];

      this.setState({
        selectData,
      });
      this.handleSearchValue('');
    }
  }

  valueRender = (v) => {
    if (this.props.name !== 'trx_time') {
      let t = v.label.split('-')
      t.forEach((n, idx) => {
        t[idx] = formatMoney(n)
      })
      return t.join('-')
    }
    return v.label
  }

  render() {
    const {selectData, hideLabel, searchValue} = this.state;
    return (
      <div style={{width:'100%'}}>
        <Select
          style={{...styles.input, ...styles.longInput}}
          value={this.formatSelectData(this.state.value)}
          searchValue={searchValue}
          // onChange={this.onSelectChange}
          onSearch={this.onSearch}
          onKeyDown={this.onKeyDown}
          onRemove={this.onRemove}
          filterLocal={false}
          onVisibleChange={this.onVisibleChange}
          valueRender = {this.valueRender}
          {...this.props.componentProps}
        />
        <div style={{color:'red',position:'absolute',bottom:'-18px',left:'140px'}}>{this.warning}</div>
      </div>
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
    letterSpacing: 0,
    position:'relative',
    // position:'absolute',
    // bottom:0,
    // left:0
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


export default SelectTag;
