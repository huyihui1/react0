/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import IceLabel from '@icedesign/label';
import { CirclePicker } from 'react-color';
import HorizontalTimeline from 'react-horizontal-timeline';
import {
  Input,
  Button,
  Message,
  DatePicker,
  Table,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import { actions } from '../../../../stores/caseEvent';
import { actions as caseBreakpointActions } from '../../../../stores/caseBreakpoint';


import labelColorsConfig from '../../../../labelColorsConfig';
import ajaxs from '../../../../utils/ajax';
import solarLunar from 'solarlunar';

// import './style.css';

const colors = labelColorsConfig.colors;

class CaseEventLabel extends Component {
  static displayName = 'CaseEventLabel';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      values: {
        color: colors[0],
        color_order: 1,
      },
      startDay: null,
      endDay: null,
      activeItem: null,
      activeIndex: 0,
      caseBreakpointInfo: [],
      timeLineData: [],
    };
    this.changeColor = this.changeColor.bind(this);
    this.findActiveItem = this.findActiveItem.bind(this);
  }

  formChange = (values) => {
    console.log('values', values);
    // if (values.ct_code !== this.state.activeItem) {
    //   this.props.handleActiveItem(values.ct_code);
    // } else {
    values.started_at = moment(this.state.activeItem);
    this.setState({
      values,
    });
    // }
  };


  validateAllFormField = () => {
    const { caseId, isEdit, actions, onClose } = this.props;

    this.refs.form.validateAll((errors, values) => {
      // if (errors) {
      //   console.log({ errors });
      //   Message.error('提交失败');
      //   return;
      // }
      values = Object.assign({}, values);
      if (values.id) {
        Message.loading({
          title: '修改中...',
          duration: 0,
        });
        actions.updateCaseEvent({ ...values, caseId, itemId: values.id })
          .then(res => {
            if (res.status === 'resolved' && res.body.meta && res.body.meta.success) {
              Message.success('修改成功...');
            } else {
              Message.error('修改失败...');
            }
          })
          .catch(err => {
            Message.error('修改失败...');
            console.log(err);
          });
      } else {
        Message.loading({
          title: '添加中...',
          duration: 0,
        });
        values.started_at = values.started_at.format('YYYY-MM-DD');
        values.ended_at = values.ended_at ? values.ended_at.format('YYYY-MM-DD') : null;
        actions.createCaseEvent({ ...values, caseId })
          .then(res => {
            if (res.status === 'resolved' && res.res.body.meta.success) {
              Message.success('添加成功...');
            } else {
              Message.error('添加失败...');
            }
            console.log(res);
          })
          .catch(err => {
            Message.error('添加失败...');
            console.log(err);
          });
      }
    });
  };

  changeColor(color) {
    const values = this.state.values;
    values.color = color.hex;
    values.color_order = colors.indexOf(color.hex) + 1;
    this.setState({
      values,
    });
  }

  findActiveItem(item) {
    const { values } = this.state;
    values.started_at = moment(item);
    console.log(values);
    this.setState({
      values,
    });
  }


  componentDidMount() {
    if (this.props.activeItem && this.props.type === 'time' && this.props.activeItem !== this.state.activeItem) {
      this.setState({ activeItem: this.props.activeItem });
      this.findActiveItem(this.props.activeItem);
    }
    if (this.props.login && this.props.login.summary) {
      this.setState({ startDay: this.props.login.summary.pb_started_at, endDay: this.props.login.summary.pb_ended_at });
    }

    if (this.props.caseBreakpoints.items && JSON.stringify(this.props.caseBreakpoints.items) !== JSON.stringify(this.state.caseBreakpointInfo)) {
      const { startDay, endDay } = this.state;
      const t = this.state.startDay && this.state.endDay ? [
        {
          name: '',
          started_at: moment(startDay).format('YYYY-MM-DD'),
        },
        {
          name: '',
          started_at: moment(endDay).format('YYYY-MM-DD'),
        },
      ] : [];
      this.props.caseBreakpoints.items.forEach(item => {
        if (moment(startDay).format('YYYY-MM-DD') == moment(item.started_at).format('YYYY-MM-DD')) {
          t.forEach(i => {
            if (i.started_at === moment(item.started_at).format('YYYY-MM-DD')) {
              i.name = item.name;
            }
          });
        } else if (moment(endDay).format('YYYY-MM-DD') == moment(item.started_at).format('YYYY-MM-DD')) {
          t.forEach(i => {
            if (i.started_at === moment(item.started_at).format('YYYY-MM-DD')) {
              i.name = item.name;
            }
          });
        } else {
          t.push({
            name: item.name,
            started_at: moment(item.started_at).format('YYYY-MM-DD'),
          });
        }
      });
      t.sort((a, b) => {
        return a.started_at > b.started_at ? 1 : -1;
      });
      const time = t.map(item => {
        return item.started_at;
      });
      this.setState({
        timeLineData: time,
        caseBreakpointInfo: t,
      });
    } else {
      this.fetchData();
    }
  }

  fetchData = () => {
    const { actions, caseId } = this.props;
    const { startDay, endDay } = this.state;
    const t = this.state.startDay && this.state.endDay ? [
      {
        name: '',
        started_at: moment(startDay).format('YYYY-MM-DD'),
      },
      {
        name: '',
        started_at: moment(endDay).format('YYYY-MM-DD'),
      },
    ] : [];
    actions.fetchCaseBreakpoints({ caseId }).then(res => {
      res.body.data.forEach(item => {
        if (moment(startDay).format('YYYY-MM-DD') == moment(item.started_at).format('YYYY-MM-DD')) {
          t.forEach(i => {
            if (i.started_at === moment(item.started_at).format('YYYY-MM-DD')) {
              i.name = item.name;
            }
          });
        } else if (moment(endDay).format('YYYY-MM-DD') == moment(item.started_at).format('YYYY-MM-DD')) {
          t.forEach(i => {
            if (i.started_at === moment(item.started_at).format('YYYY-MM-DD')) {
              i.name = item.name;
            }
          });
        } else {
          t.push({
            name: item.name,
            started_at: moment(item.started_at).format('YYYY-MM-DD'),
          });
        }
      });
      t.sort((a, b) => {
        return a.started_at > b.started_at ? 1 : -1;
      });
      const time = t.map(item => {
        return item.started_at;
      });
      this.setState({
        timeLineData: time,
        caseBreakpointInfo: t,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeItem && nextProps.type === 'time' && nextProps.activeItem !== this.state.activeItem) {
      this.findActiveItem(nextProps.activeItem);
      this.setState({
        activeItem: nextProps.activeItem,
      });
    }
    if (nextProps.login && nextProps.login.summary) {
      this.setState({ startDay: nextProps.login.summary.pb_started_at, endDay: nextProps.login.summary.pb_ended_at });
    }
    if (nextProps.caseId && nextProps.caseId !== this.state.caseId) {
      // this.props.actions.fetchCaseEvents({ caseId: nextProps.caseId });
      this.setState({
        caseId: nextProps.caseId,
      });
    }
  }
  tableColumnRender(value, index, record) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const solar2lunarData = solarLunar.solar2lunar(year, month, day);
    return (
      <span>
        <span style={{ fontSize: '14px', borderBottom: `2px solid ${record.color}` }}>{moment(value).format('YYYY-MM-DD')}</span>
        <span style={{ marginLeft: '5px', fontSize: '12px' }}>{solar2lunarData.monthCn}{solar2lunarData.dayCn}</span>
      </span>
    );
  }
  tableColumnRenderEnd(value, index, record) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const solar2lunarData = solarLunar.solar2lunar(year, month, day);
    return (
      <span>
        <span style={{ fontSize: '14px', borderBottom: `2px solid ${record.color}` }}>{moment(value).format('YYYY-MM-DD')}</span>
        <span style={{ marginLeft: '5px', fontSize: '12px' }}>{solar2lunarData.monthCn}{solar2lunarData.dayCn}</span>
      </span>
    );
  }

  render() {
    const { caseEvents } = this.props;
    const { labelGroup, activeIndex, caseBreakpointInfo } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <IceContainer style={styles.left}>
          <IceFormBinderWrapper
            value={this.state.values}
            onChange={this.formChange}
            ref="form"
          >
            <div className="d-flex">
              <div className="item-flex-6">
                <Table
                  loading={this.props.isLoading}
                  dataSource={caseEvents.items}
                  rowSelection={this.state.rowSelection}
                  onRowClick={this.onRowClick}
                  primaryKey="name"
                  style={styles.table}
                >
                  <Table.Column align="center" title="开始日期" dataIndex="started_at" cell={this.tableColumnRender} width={230} />
                  <Table.Column align="center" title="结束日期" dataIndex="ended_at" cell={this.tableColumnRenderEnd} width={230} />
                  <Table.Column align="center" title="事件" dataIndex="name" />
                  {/* <Table.Column align="center" title="标注" dataIndex="color" cell={this.tableColumnRender} /> */}
                </Table>
              </div>
              <div className="item-flex-4 chartCard" style={styles.formContent}>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>开始日期</div>
                  <IceFormBinder
                    name="started_at"
                    required
                    // triggerType="onBlur"
                    message="开始日期不能为空"
                  >
                    <DatePicker name="started_at" placeholder="请选择开始日期" visible={false} hasClear={false} defaultVisibleMonth={() => moment(this.state.startDay, 'YYYY-MM')} />
                  </IceFormBinder>
                  {/* <IceFormError name="started_at" style={styles.formError} /> */}
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>结束日期</div>
                  <IceFormBinder
                    name="ended_at"
                    required
                    // triggerType="onBlur"
                    message="结束日期不能为空"
                  >
                    <DatePicker name="ended_at" placeholder="请输入结束日期" defaultVisibleMonth={() => moment(this.state.startDay, 'YYYY-MM')} />
                  </IceFormBinder>
                  {/* <IceFormError name="ended_at" style={styles.formError} /> */}
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>事件名称</div>
                  <IceFormBinder
                    name="name"
                    required
                    triggerType="onBlur"
                    message="事件名称不能为空"
                  >
                    <Input
                      placeholder="请输入事件名称"
                      name="name"
                      style={{ width: '400px' }}
                    />
                  </IceFormBinder>
                  {/* <IceFormError name="name" style={styles.formError} /> */}
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>标注</div>
                  <IceFormBinder
                    name="color"
                    required
                    triggerType="onBlur"
                    message="标注不能为空"
                  >
                    <CirclePicker width="340px" circleSize={24} colors={colors} color={this.state.values.color} onChangeComplete={this.changeColor} />
                  </IceFormBinder>
                  {/* <IceFormError name="color" style={styles.formError} /> */}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Button
                    type="primary"
                    style={styles.submitButton}
                    onClick={this.validateAllFormField}
                  >
                    提 交
                  </Button>
                  <Button type="secondary" style={{ marginLeft: '10px' }} onClick={() => { this.props.onClose(this.props.index); }}>关闭</Button>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '108px', marginBottom: '20px' }}>
              {caseBreakpointInfo[activeIndex] && caseBreakpointInfo[activeIndex].name || '没有时间分割点'}
            </div>
            <div style={{ minHeight: '120px', width: '800px', left: '50%', transform: 'translateX(-50%)' }}>
              <HorizontalTimeline
                values={this.state.timeLineData}
                indexClick={(index) => {
                  this.setState({
                    activeIndex: index,
                  });
                }}
                index={activeIndex}
                getLabel={(date) => {
                  return <span>{date}</span>;
                }}
              />
            </div>
          </IceFormBinderWrapper>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  left: {
    marginBottom: 0,
    paddingTop: 0,
    height: '100%',
    display: 'inline-block',
    width: '100%',
    padding: 0,
    overflow: 'initial',
  },
  table: {
    margin: '10px 10px 20px',
  },
  bottom: {
    display: 'inline-block',
    width: '100%',
    height: '100%',
  },
  formContent: {
    width: '40%',
    padding: '10px',
    marginTop: 0,
  },
  formItem: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
  },
  formLabel: {
    width: '70px',
    flex: '0 0 70px',
    marginRight: '15px',
    textAlign: 'right',
  },
};


export default connect(
  // mapStateToProps
  state => ({
    caseEvents: state.caseEvents,
    caseEvent: state.caseEvents.item,
    caseId: state.cases.case.id,
    login: state.login,
    caseBreakpoints: state.caseBreakpoints,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions, ...caseBreakpointActions }, dispatch),
  }),
)(CaseEventLabel);
