import React, { Component } from 'react';
import { connect } from 'react-redux';
import IceContainer from '@icedesign/container';
import { bindActionCreators } from 'redux';
import {
  Dialog,
  Input,
  Button,
  Message,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { actions } from '../../../stores/systemSettings';

class GlobalSettingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
    };
  }

  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };
  validateAllFormField = () => {
    const { caseId, isEdit, actions, onClose } = this.props;

    this.refs.form.validateAll((errors, values) => {
      // if (errors) {
      //   console.log({ errors });
      //   Message.error('提交失败');
      //   return;
      // }
      if (isEdit) {
        Message.loading({
          title: '修改中...',
          duration: 0,
        });
        actions.updateSystemSetting({ ...values })
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
        actions.createSystemSetting({ ...values, account_id: '0' })
          .then(res => {
            if (res.status === 'resolved') {
              Message.success('添加成功...');
              this.setState({
                value: {},
              });
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
          title={`${this.props.isEdit ? '编辑' : '添加'}时间描述`}
        >
          <IceContainer style={styles.container}>
            <IceFormBinderWrapper
              value={this.props.isEdit && this.props.systemSetting ? this.props.systemSetting : this.state.value}
              onChange={this.formChange}
              ref="form"
            >
              <div style={styles.formContent}>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>Key</div>
                  <IceFormBinder
                    name="k"
                    required
                    triggerType="onBlur"
                    message="Key不能为空"
                  >
                    <Input
                      placeholder="请输入Key"
                      name="k"
                      style={{ width: '400px' }}
                    />
                  </IceFormBinder>
                  {/*<IceFormError name="k" style={styles.formError}/>*/}
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>值</div>
                  <IceFormBinder
                    name="v"
                    required
                    triggerType="onBlur"
                    message="值不能为空"
                  >
                    <Input
                      placeholder="请输入值"
                      name="v"
                      style={{ width: '400px' }}
                    />
                  </IceFormBinder>
                  {/*<IceFormError name="v" style={styles.formError}/>*/}
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>描述</div>
                  <IceFormBinder
                    name="memo"
                    triggerType="onBlur"
                    message="描述不能为空"
                  >
                    <Input
                      placeholder="请输入描述"
                      name="memo"
                      style={{ width: '400px' }}
                    />
                  </IceFormBinder>
                  {/*<IceFormError name="memo" style={styles.formError}/>*/}
                </div>
                <div style={{ textAlign: 'right' }}>
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
  },
  formLabel: {
    width: '70px',
    marginRight: '15px',
    textAlign: 'right',
  },
  formError: {
    marginLeft: '10px',
    // width: '96px'
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
    systemSettings: state.systemSettings,
    systemSetting: state.systemSettings.globalItem,
    caseId: state.systemSettings.caseId,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(GlobalSettingForm);
