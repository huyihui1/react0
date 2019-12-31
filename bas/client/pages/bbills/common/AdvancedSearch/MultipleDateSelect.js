import React, {Component} from 'react';
import {Balloon, DatePicker, Select} from '@alifd/next';
import {TIME_RANGE_RULE, DURATION_RULE} from '../../../../fieldConstraints'

const {RangePicker} = DatePicker;
import moment from 'moment'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actions as caseEventActions} from "../../../../stores/caseEvent";


class MultipleDateSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      selectData: [],
      searchValue: '',
      selectNumArr: [],

      defaultTimeLineValue: [],
      defaultVisibleMonth:[],
      visibleFlag: false,
      pickerData: null
    };
    this.warning = '';
    this.onSelectChange = this.onSelectChange.bind(this);
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

  handleSearchValue(value) {
    if (this.state.searchValue === value) {

    } else {
      this.setState({
        searchValue: value,
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


  onVisibleChange = (visible, type) => {
    this.setState({defaultTimeLineValue: []});
    const {values, name, onFormChange, aaa} = this.props;
    const {value, pickerData} = this.state;
    if (!visible) {
      this.setState({visibleFlag: false})
    }
    if (!pickerData) return;

    if (value.indexOf(pickerData) === -1) {
      value.push(pickerData);
    } else {
      value.splice(value.indexOf(pickerData), 1);
    }
    values[name] = value;
    onFormChange(values);
    this.setState({value, pickerData: null})
  };

  selectOnVisibleChange = (visible, type) => {
    if (visible) {
      this.setState({visibleFlag: true});
    }
  };
  onChange = (value) => {
    this.setState({defaultTimeLineValue: [moment(value[0]).format(), moment(value[1]).format()]});
    if (value[0] && value[1]) {
      this.setState({pickerData: moment(value[0]).format('YYYY-MM-DD') + '~' + moment(value[1]).format('YYYY-MM-DD')}, () => {
        this.onVisibleChange()
      })
    } else {
      this.setState({pickerData: null})
    }

  };
  onChangeTime = (value) => {
    if (value[0] && value[1]) {
      this.setState({pickerData: moment(value[0]).format('YYYY-MM-DD hh:mm:ss') + '~' + moment(value[1]).format('YYYY-MM-DD hh:mm:ss')})
    } else {
      this.setState({pickerData: null})
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({value: JSON.parse(JSON.stringify(nextProps.value))});
    } else {
      this.setState({value: []})
    }

    if (nextProps.login&& nextProps.login.summary) {
      if (nextProps.login.summary.bb_started_at) {
        this.setState({defaultVisibleMonth:nextProps.login.summary.bb_started_at})
      }
    }

  }


  onTimeLineClick = (date) => {
    this.getDefaultValue(moment(date).format());
  };

  getDefaultValue(date = null) {
    if (typeof date === 'string' && date) {
      if (this.state.defaultTimeLineValue[0]) {
        this.setState({
          defaultTimeLineValue: [this.state.defaultTimeLineValue[0], date],
        }, () => {
          this.onChange(this.state.defaultTimeLineValue);
        });
      } else {
        this.setState({
          defaultTimeLineValue: [date],
        });
      }
    }
  }


  footerRender = () => {
    const {caseEvents} = this.props;
    let allDays = null;
    if (caseEvents.items && caseEvents.items.length > 0) {
      allDays = new Date(moment(caseEvents.items[0].started_at).format('YYYY-MM-DD')).getTime() - new Date(moment(caseEvents.items[caseEvents.items.length - 1].started_at).format('YYYY-MM-DD')).getTime();
      allDays = Math.abs(parseInt(allDays / (1000 * 60 * 60 * 24), 0));
    }
    return (
      <div className="custom-footer">
        <div className="customTimeline">
          <ul>
            {
              caseEvents.items && caseEvents.items.map((item, index) => {
                if (index > 0 && index < caseEvents.items.length - 1) {
                  let days = new Date(item.started_at).getTime() - new Date(caseEvents.items[0].started_at).getTime();
                  days = Math.abs(parseInt(days / (1000 * 60 * 60 * 24), 0));
                  return (
                    <Balloon align="t"
                             key={item.name + index}
                             closable={false}
                             trigger={
                               <li key={item.started_at}
                                   style={{left: `${days / allDays * 100}%`, background: item.color}} onClick={() => {
                                 this.onTimeLineClick(item.started_at)
                               }}/> //
                             }
                             triggerType="hover"
                    >
                      <span>{item.name}</span>
                    </Balloon>
                  );
                }
                return (
                  <Balloon align="t"
                           key={item.name + index}
                           closable={false}
                           trigger={
                             <li key={item.started_at} style={{background: item.color}} onClick={() => {
                               this.onTimeLineClick(item.started_at)
                             }}/>
                           }
                           triggerType="hover"
                  >
                    <span>{item.name}</span>
                  </Balloon>
                );
              })
            }
          </ul>
        </div>
      </div>
    );
  };
  dateCellRender = (val) => {
    const {caseEvents} = this.props;
    const res = (caseEvents.items || []).filter(item => {
      return moment(item.started_at).format('YYYY-MM-DD') === moment(val).format('YYYY-MM-DD')
    });

    if (res[0] && moment(res[0].started_at).format('YYYY-MM-DD') === moment(val).format('YYYY-MM-DD')) {
      return (
        <Balloon align="t"
                 closable={false}
                 trigger={
                   <div style={{background: res[0].color}}>
                     {moment(val).format('D')}
                   </div>
                 }
                 triggerType="hover"
        >
          {res[0].name}
        </Balloon>
      );
    } else {
      return moment(val).format('D');
    }
  }

  render() {
    const {selectData, hideLabel, searchValue} = this.state;
    const popupContent = <RangePicker visible={this.state.visibleFlag} onVisibleChange={this.onVisibleChange}
                                      onChange={this.onChange} footerRender={this.footerRender}
                                      dateCellRender={this.dateCellRender} value={this.state.defaultTimeLineValue}
                                      defaultVisibleMonth={() => moment(this.state.defaultVisibleMonth)}
    />;
    const defaultDate = <RangePicker visible={this.state.visibleFlag} onVisibleChange={this.onVisibleChange}
                                     defaultVisibleMonth={() => moment(this.state.defaultVisibleMonth)}
                                     onChange={this.onChangeTime} showTime={true}/>;

    return (
      <div style={{width: '100%'}}>
        <Select {...this.props.componentProps} style={this.props.styles}
                visible={this.state.visibleFlag}
                value={this.formatSelectData(this.state.value)}
                popupContent={this.props.name === 'trx_day' ? popupContent : defaultDate}
                onRemove={this.onRemove}
                onVisibleChange={this.selectOnVisibleChange}
        />
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
    position: 'relative',
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


export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    caseEvents: state.caseEvents,
    login: state.login
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...caseEventActions}, dispatch),
  }),
)(MultipleDateSelect);
