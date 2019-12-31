import React, {Component} from 'react';
import {connect} from 'react-redux';
import IceContainer from '@icedesign/container';
import {bindActionCreators} from 'redux';
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
import {actions} from '../../../../stores/setting';
import ReactPasswordStrength from 'react-password-strength';
import './index.css'


class PasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
      passWord:'',
      score:{}
    };
  }

  formChange = (value) => {
    // console.log('value', value);
    // this.setState({
    //   value,
    // });
  };
  validateAllFormField = () => {
    const {caseId, isEdit, actions, onClose} = this.props;
    const { score } = this.state;

    this.refs.form.validateAll((errors, values) => {
      if (!score.password || score.password && score.password.length === 0) {
        this.setState({passWord: '新密码不能为空'})
      } else if (!this.state.score.isValid) {
        this.setState({passWord: '密码强度弱'})
      } else {
        this.setState({passWord: ''})
      }


      if (errors || !this.state.score.isValid) {
        return
      }

      let obj = {
        old_password: values.old_password,
        password: score.password,
        confirmed_password: values.confirmed_password,
      };
      actions.changePasswordSetting(obj).then(res => {
        if (res.body.meta.code == '200') {
          Message.success('修改成功!');
          this.props.onClose();
        } else {
          Message.error('修改失败!');
        }
      })
    });
  };

  componentDidMount() {
    this.props.setThis(this)
  }

  clearValue = () => {
    this.setState({value:{},score:{},passWord:''})
  };

  checkldPassword = (rule, values, callback) => {
    if (!values) {
      callback('旧密码不能为空')
    } else {
      callback()
    }
  };
  checkConfirmedPassword = (rule, values, callback) => {
    if (!values) {
      callback('确认密码不能为空')
    } else if (values !== this.state.score.password) {
      callback('两次密码不一致')
    } else {
      callback()
    }
  };

  foo = (score, password, isValid) => {
    this.setState({passWord: ''});
    this.setState({score})
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
          title='修改密码'
        >
          <IceContainer style={styles.container}>
            <IceFormBinderWrapper
              onChange={this.formChange}
              ref="form"
              value={this.state.value}
            >
              <div style={styles.formContent}>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>旧密码</div>
                  <IceFormBinder
                    name="old_password"
                    required
                    triggerType="onBlur"
                    // message="旧密码不能为空"
                    validator={this.checkldPassword}
                  >
                    <Input
                      placeholder="请输入旧密码"
                      htmlType="password"
                      name="k"
                      style={{width: '400px'}}
                    />
                  </IceFormBinder>
                  <IceFormError name="old_password" style={styles.formError}/>
                  {/*<IceFormError name="k" style={styles.formError}/>*/}
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>新密码</div>
                  <ReactPasswordStrength
                    className="customClass"
                    style={{display: 'block', width: '400px', height: '32px', borderRadius: '3px'}}
                    minLength={6}
                    minScore={3}
                    scoreWords={['非常弱', '弱', '一般', '强', '非常强']}
                    changeCallback={this.foo}
                    tooShortWord='少于6位'
                    placeholder="请输入密码"
                    inputProps={{name: "password", autoComplete: "off", placeholder: "请输入新密码"}}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '35px',
                    left: '95px',
                    fontSize: '12px',
                    color: 'rgb(247, 96, 72)'
                  }}>{this.state.passWord}</div>
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>确认密码</div>
                  <IceFormBinder
                    name="confirmed_password"
                    // triggerType="change"
                    validator={this.checkConfirmedPassword}
                  >
                    <Input
                      placeholder="请确认密码"
                      htmlType="password"
                      name="memo"
                      style={{width: '400px'}}
                    />
                  </IceFormBinder>
                  <IceFormError name="confirmed_password" style={styles.formError}/>
                  {/*<IceFormError name="memo" style={styles.formError} />*/}
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
    setting: state.setting,
    settings: state.setting.accountItem,
    caseId: state.setting.caseId,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(PasswordForm);
