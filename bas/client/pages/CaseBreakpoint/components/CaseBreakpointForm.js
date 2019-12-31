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
import {actions} from '../../../stores/caseBreakpoint';
import labelColorsConfig from '../../../labelColorsConfig';

const currentDate = moment();
const colors = labelColorsConfig.colors;

class CaseBreakpointForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        // color: colors[0],
      },
      startDay: null,
      endDay: null
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
        actions.updateCaseBreakpoint({...values, caseId, itemId: values.id})
          .then(res => {
            if (res.status === 'resolved') {
              Message.success('修改成功...');
              this.setState({
                value: {}
              });
              this.props.caseThis.state.rowSelection.selectedRowKeys = []
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
        values.started_at = moment(values.started_at).format('YYYY-MM-DD HH:mm:ss');
        values.ended_at = values.ended_at ? values.ended_at.format('YYYY-MM-DD HH:mm:ss') : null;
        actions.createCaseBreakpoint({...values, caseId})
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
        value: {}
      })
    }
  }


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
          title={`${this.props.isEdit ? '编辑' : '添加'}时间分割点`}
        >
          <IceContainer style={styles.container}>
            <IceFormBinderWrapper
              value={this.state.value}
              onChange={this.formChange}
              ref="form"
            >
              <div style={styles.formContent}>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>时间分割点</div>
                  <IceFormBinder
                    name="started_at"
                    required
                    triggerType="onBlur"
                    message="日期不能为空"
                  >
                    <DatePicker name="started_at" showTime placeholder="请选择日期" style={{width: '400px'}}
                                defaultVisibleMonth={this.state.startDay ? () => moment(this.state.startDay, "YYYY-MM") : () => moment(new Date(), "YYYY-MM")}/>
                  </IceFormBinder>
                  <IceFormError name="started_at" style={styles.formError}/>
                </div>
                {/*<div style={styles.formItem}>*/}
                {/*<div style={styles.formLabel}>结束日期</div>*/}
                {/*<IceFormBinder*/}
                {/*name="ended_at"*/}
                {/*required*/}
                {/*// triggerType="onBlur"*/}
                {/*message="结束日期不能为空"*/}
                {/*>*/}
                {/*<DatePicker name="ended_at" showTime placeholder="请输入结束日期" />*/}
                {/*</IceFormBinder>*/}
                {/*/!*<IceFormError name="ended_at" style={styles.formError} />*!/*/}
                {/*</div>*/}
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>时间分割点说明</div>
                  <IceFormBinder
                    name="name"
                    required
                    triggerType="onBlur"
                    message="时间分割点说明不能为空"
                  >
                        <Input.TextArea
                          placeholder=""
                          name='name'
                          hasLimitHint
                          aria-label="input max length 100" style={{width: '400px'}}/>
                  </IceFormBinder>
                  <IceFormError name="name" style={{...styles.formError,top:'66px'}}/>
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
    width: '100px',
    marginRight: '15px',
    textAlign: 'right',
  },
  formError: {
    position: 'absolute',
    top: '35px',
    left: '125px',
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
    caseBreakpoints: state.caseBreakpoints,
    caseEvent: state.caseBreakpoints.item,
    caseId: state.caseBreakpoints.caseId,
    login: state.login
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(CaseBreakpointForm);
