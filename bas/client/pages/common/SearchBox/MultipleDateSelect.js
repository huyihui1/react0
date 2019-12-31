import React, { Component } from 'react';
import { Select, DatePicker, Balloon, Step } from '@alifd/next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import _ from 'lodash';
import { actions } from '../../../stores/SearchStore/index';
import { actions as caseEventActions } from '../../../stores/caseEvent';

import './searchBox.css';

const { RangePicker } = DatePicker;

const StepItem = Step.Item;

class MultipleDateSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateVisible: false,
      values: [],

      isFocus: false,
      defaultTimeLineValue: [moment().format()],
      isTimeLineValue: false,
      defaultVisibleMonth: null,
      pickerData: null
    };
    this.onChange = this.onChange.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onRangePickerVisibleChange = this.onRangePickerVisibleChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onDatePickerChange = this.onDatePickerChange.bind(this);
    this.onOk = this.onOk.bind(this);
    this.disabledDate = this.disabledDate.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.footerRender = this.footerRender.bind(this);
    this.getDefaultValue = this.getDefaultValue.bind(this);
    this.dateCellRender = this.dateCellRender.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.values && nextProps.values[nextProps.name]) {
      const arr = [];
      if (Array.isArray(nextProps.values[nextProps.name])) {
        nextProps.values[nextProps.name].forEach(item => {
          arr.push({
            label: item,
            value: item,
          });
        });
        this.setState({
          values: arr,
        });
      }
    } else {
      this.setState({
        values: [],
      });
    }
    if (nextProps.login && nextProps.login.summary) {
      if (nextProps.login.summary.pb_started_at !== this.state.defaultVisibleMonth) {
        this.setState({defaultVisibleMonth:nextProps.login.summary.pb_started_at})
      }
    }
  }
  componentDidMount() {
    const { values, name } = this.props;
    if (values && values[name]) {
      const arr = [];
      values[name].forEach(item => {
        arr.push({
          label: item,
          value: item,
        });
      });
      this.setState({
        values: arr,
      });
    }
    this.props.actions.fetchAlyzDaysSearch({ case_id: this.props.caseId });
    this.fetchCaseEventData();
  }
  formatData(val) {
    const arr = [];
    val.forEach(item => {
      arr.push(item.value);
    });
    return arr;
  }
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

  onVisibleChange = (visible, type) => {
    this.setState({defaultTimeLineValue: []});
    const { getAlyzDayData} = this.props;
    const {values, pickerData} = this.state;
    if (!visible) {
      this.setState({dateVisible: false})
    }
    if (!pickerData) return;
    values.push({
      label: pickerData,
      value: pickerData
    });
    getAlyzDayData(this.props.name, this.formatData(values));
    this.setState({values, pickerData: null})
  };


  onDatePickerChange = (value) => {
    if (value[0] && value[1]) {
      this.setState({pickerData: moment(value[0]).format('YYYY-MM-DD HH:mm:ss') + '~' + moment(value[1]).format('YYYY-MM-DD HH:mm:ss')})
    } else {
      this.setState({pickerData: null})
    }
  };

  onOk(val) {
    this.setState({
      dateVisible: false,
      isShow: false,
    }, () => {
      this.onDatePickerChange(val);
    });
  }
  onSelectChange(val) {
    this.props.getAlyzDayData(this.props.name, this.formatData(val));
    this.setState({
      values: val,
    });
  }
  onRemove(item) {
    let values = JSON.parse(JSON.stringify(this.state.values));
     _.find(values, (x, index) => {
       if (x.value === item.value) {
         values.splice(index, 1);
         this.onSelectChange(values)
       }
      return x.value === item.value
    })
  }
  onFocus(e) {
    this.getDefaultValue();
    const { search } = this.props;
    setTimeout(() => {
      this.setState({
        dateVisible: true,
        isFocus: true,
        defaultTimeLineValue: search.alyzDays && search.alyzDays[0].pb_alyz_day_start ? [moment(search.alyzDays[0].pb_alyz_day_start).format()] : [moment().format()],
      });
    }, 300);
  }
  onBlur() {
    this.setState({
      isFocus: false,
    });
  }
  onRangePickerVisibleChange(visible, reason) {
    if (visible) {
      this.setState({
        dateVisible: visible,
      });
    }
  }
  disabledDate(date) {
    const { search } = this.props;
    if (search.alyzDays && search.alyzDays[0]) {
      if (search.alyzDays[0].pb_alyz_day_start && search.alyzDays[0].pb_alyz_day_end) {
        return moment(search.alyzDays[0].pb_alyz_day_start).valueOf() > date.valueOf() || date.valueOf() > moment(search.alyzDays[0].pb_alyz_day_end).valueOf();
      }
    }
  }
  dateCellRender(val) {
    const { caseEvents } = this.props;
    const res = (caseEvents.items || []).filter(item => {
      return moment(item.started_at).format('YYYY-MM-DD') === moment(val).format('YYYY-MM-DD')
    })
    if (res[0] && moment(res[0].started_at).format('YYYY-MM-DD') === moment(val).format('YYYY-MM-DD')) {
      return (
          <Balloon align="t"
                   closable={false}
                   trigger={
                     <div style={{ background: res[0].color }}>
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
  footerRender() {
    const { caseEvents } = this.props;
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
                        <li key={item.started_at} style={{ left: `${days / allDays * 100}%`, background: item.color }} onClick={() => { this.onTimeLineClick(item.started_at); }} />
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
                        <li key={item.started_at} style={{ background: item.color }} onClick={() => { this.onTimeLineClick(item.started_at); }} />
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
  }
  fetchCaseEventData(caseId = this.props.caseId) {
    this.props.actions.fetchCaseEvents({ caseId }, {
      query: {
        page: 1,
        pagesize: 10,
      },
    });
  }
  onTimeLineClick(date) {
    this.getDefaultValue(moment(date).format());
  }
  //  数组排序
  compare(property) {
    return function (a, b) {
      const value1 = a[property];
      const value2 = b[property];
      return value1 - value2;
    };
  }
  getDefaultValue(date = null) {
    if (typeof date === 'string' && date) {
      if (this.state.defaultTimeLineValue[0] && this.state.isTimeLineValue) {
        this.setState({
          defaultTimeLineValue: [this.state.defaultTimeLineValue[0], date],
        }, () => {
          this.onChange(this.state.defaultTimeLineValue);
        });
      } else {
        this.setState({
          defaultTimeLineValue: [date],
          isTimeLineValue: true,
        });
      }
    }
  }
  render() {
    const { dateVisible, values, defaultTimeLineValue } = this.state;
    const { mode, name, search } = this.props;
    const popupContent =
      (
        <div >
          <RangePicker
            visible={dateVisible}
            defaultVisibleMonth={() => moment(this.state.defaultVisibleMonth)}
            disabledDate={name === 'alyz_day' ? this.disabledDate : null}
            onChange={(mode || {}).showTime ? this.onDatePickerChange : this.onChange}
            onVisibleChange={this.onVisibleChange}
            dateCellRender={this.dateCellRender}
            footerRender={this.footerRender}
          />
        </div>
      );
    const defaultDate = (
      <div >
        {
          (mode || {}).showTime ? (
            <RangePicker
              visible={dateVisible}
              defaultVisibleMonth={() => moment(this.state.defaultVisibleMonth)}
              {...mode}
              onOk={this.onOk}
              onChange={(mode || {}).showTime ? this.onDatePickerChange : this.onChange}
              onVisibleChange={this.onVisibleChange}
            />
          ) : (
            <RangePicker
              visible={dateVisible}
              value={defaultTimeLineValue}
              {...mode}
              onOk={this.onOk}
              onChange={(mode || {}).showTime ? this.onDatePickerChange : this.onChange}
              onVisibleChange={this.onRangePickerVisibleChange}
              dateCellRender={this.dateCellRender}
              footerRender={this.footerRender}
            />
          )
        }
      </div>
    );
    const selectOnVisibleChange = (visible, type) => {
      if (visible) {
        this.setState({dateVisible: true});
      }
    };
    return (
      <Select
        visible={dateVisible}
        mode="multiple"
        popupContent={name === 'alyz_day' ? popupContent : defaultDate}
        style={{ ...styles.input }}
        value={values}
        // onChange={this.onSelectChange}
        onRemove={this.onRemove}
        // onFocus={this.onFocus}
        // onBlur={this.onBlur}
        onVisibleChange={this.onRangePickerVisibleChange}
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
    // margin: '0 4px',
  },
  selectOptions: {
    width: '100%',
    height: '250px',
    overflowY: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    background: '#fff',
    border: '1px solid #eee',
    padding: '8px 15px',
    fontSize: '14px',
  },
};


export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    search: state.search,
    caseEvents: state.caseEvents,
    login: state.login
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions, ...caseEventActions }, dispatch),
  }),
)(MultipleDateSelect);
