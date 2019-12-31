import React, {Component} from 'react';
import {connect} from 'react-redux';
import IceContainer from '@icedesign/container';
import {bindActionCreators} from 'redux';
import {
  Dialog,
  Input,
  Button,
  Message,
  DatePicker,
} from '@alifd/next';
import {CirclePicker} from 'react-color';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import moment from 'moment';
import {actions} from '../../../stores/caseEvent';
import labelColorsConfig from '../../../labelColorsConfig';
import {CN_PHONE_NUM_RULE} from "../../../fieldConstraints";

const currentDate = moment();
const colors = labelColorsConfig.colors;

class CaseEventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        color: colors[0],
        color_order: 1,
      },
      startDay: null,
    };
    this.changeColor = this.changeColor.bind(this);
  }

  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };
  validateAllFormField = () => {
    const {caseId, isEdit, actions, onClose} = this.props;

    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log({errors});
        // Message.error('提交失败');
        return;
      }


      if (isEdit) {
        Message.loading({
          title: '修改中...',
          duration: 0,
        });
        actions.updateCaseEvent({...values, caseId, itemId: values.id})
          .then(res => {
            if (res.status === 'resolved') {
              Message.success('修改成功...');
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
        values.started_at = moment(values.started_at).format('YYYY-MM-DD');
        values.ended_at = values.ended_at ? moment(values.ended_at).format('YYYY-MM-DD') : null;
        actions.createCaseEvent({...values, caseId})
          .then(res => {
            if (res.status === 'resolved') {
              Message.success('添加成功...');
              this.setState({
                value: {}
              })
            }
            console.log(res);
          })
          .catch(err => {
            Message.error('添加失败...');
            console.log(err);
          });
      }
      onClose && onClose();
    });
  };

  changeColor(color) {
    const value = this.state.value;
    value.color = color.hex;
    value.color_order = colors.indexOf(color.hex) + 1;
    this.setState({
      value,
    });
  }

  // disabledDate(date) {
  //   return date.valueOf() <= currentDate.valueOf() - 8.64e7;
  // };


  componentWillReceiveProps(nextProps) {
    if (nextProps.login && nextProps.login.summary) {
      this.setState({startDay: nextProps.login.summary.pb_started_at})
    }
    if (nextProps.isEdit && nextProps.caseEvent && JSON.stringify(nextProps.caseEvent) !== JSON.stringify(this.state.value)) {
      this.setState({
        value: Object.assign({}, nextProps.caseEvent)
      })
    } else {
      this.setState({
        value: {
          color: colors[0],
          color_order: 1,
        }
      })
    }
  }


  checkStartedAt = (rule, values, callback) => {
    let d = new Date(moment(values).format('YYYY-MM-DD'));
    let d1 = new Date(moment(this.state.value.ended_at).format('YYYY-MM-DD'));

    let t = d.getTime();
    let t1 = d1.getTime();


    if (!values) {
      callback('开始日期不能为空')
    } else if (d && d1 && t > t1) {
      callback('开始日期必须早于结束日期')
    } else {
      callback()
    }

  };

  checkEndedAt = (rule, values, callback) => {
    let d = new Date(moment(values).format('YYYY-MM-DD'));
    let d1 = new Date(moment(this.state.value.started_at).format('YYYY-MM-DD'));

    let t = d.getTime();
    let t1 = d1.getTime();


    if (!values) {
      callback('结束日期不能为空')
    } else if (d && d1 && t < t1) {
      callback('结束日期必须晚于开始日期')
    } else {
      callback()
    }
  };


  render() {
    return (
      <span>
        <Dialog
          visible={this.props.visible}
          onOk={this.props.onClose}
          closeable="esc,mask,close"
          onCancel={this.props.onClose}
          onClose={this.props.onClose}
          footer={false}
          title={`${this.props.isEdit ? '编辑' : '添加'}事件标注`}
        >
          <IceContainer style={styles.container}>
            <IceFormBinderWrapper
              value={this.state.value}
              onChange={this.formChange}
              ref="form"
            >
              <div style={styles.formContent}>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>开始日期</div>
                  <IceFormBinder
                    name="started_at"
                    required
                    // triggerType="onBlur"
                    validator={this.checkStartedAt}
                  >
                    <DatePicker name="started_at" placeholder="请选择开始日期"
                                defaultVisibleMonth={this.state.startDay ? () => moment(this.state.startDay, "YYYY-MM") : () => moment(new Date(), "YYYY-MM")}/>
                  </IceFormBinder>
                  <IceFormError name="started_at" style={styles.formError}/>
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>结束日期</div>
                  <IceFormBinder
                    name="ended_at"
                    required
                    // triggerType="onBlur"
                    validator={this.checkEndedAt}
                  >
                    <DatePicker name="ended_at" placeholder="请输入结束日期"
                                defaultVisibleMonth={this.state.startDay ? () => moment(this.state.startDay, "YYYY-MM") : () => moment(new Date(), "YYYY-MM")}/>
                  </IceFormBinder>
                  <IceFormError name="ended_at" style={styles.formError}/>
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
                      style={{width: '400px'}}
                    />
                  </IceFormBinder>
                  <IceFormError name="name" style={styles.formError}/>
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>标注</div>
                  <IceFormBinder
                    name="color"
                  >
                     <CirclePicker width="340px" circleSize={24} colors={colors} color={this.state.value.color}
                                   onChangeComplete={this.changeColor}></CirclePicker>
                  </IceFormBinder>
                  {/*<IceFormError name="color" style={styles.formError} />*/}
                </div>
                <div style={{textAlign: 'right'}}>
                  <Button
                    type="primary"
                    style={styles.submitButton}
                    onClick={this.validateAllFormField}
                  >
                    提 交
                  </Button>
                  <Button
                    type="secondary"
                    style={styles.submitButton2}
                    onClick={this.props.onClose}
                  >
                    退 出
                  </Button>
                </div>
              </div>
            </IceFormBinderWrapper>
          </IceContainer>
        </Dialog>
      </span>
    );
  }
}

const styles = {
  container: {
    marginBottom: 0,
  },
  formContent: {
    marginLeft: '30px',
  },
  formItem: {
    marginBottom: '25px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  formLabel: {
    width: '70px',
    marginRight: '15px',
    textAlign: 'right',
  },
  formError: {
    position: 'absolute',
    top: '35px',
    left: '95px',
    color: '#f76048'
  },
  submitButton: {
    marginLeft: '85px',
  },
  submitButton2: {
    marginLeft: '15px',
  },
};

export default connect(
  // mapStateToProps
  state => ({
    caseEvents: state.caseEvents,
    caseEvent: state.caseEvents.item,
    caseId: state.caseEvents.caseId,
    login: state.login
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(CaseEventForm);
