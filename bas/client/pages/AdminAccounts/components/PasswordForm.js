import React, {Component} from 'react';
import {connect} from 'react-redux';
import IceContainer from '@icedesign/container';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {
  Dialog,
  Step,
  Input,
  Button,
  Select,
  Message,
  Radio,
  DatePicker,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import {actions} from '../../../stores/adminAccounts';
import {CN_MOBILE_NUM_RULE} from "../../../fieldConstraints";
import ReactPasswordStrength from 'react-password-strength';
import './index.css'

const Option = Select.Option;
const StepItem = Step.Item;

class AdminAccountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
      currentStep: 0,
      score: {},
      passWord: ''
    };
    this.onClick = this.onClick.bind(this);
  }

  formChange = (value) => {
    console.log('value', value);
    // this.setState({
    //   value,
    // });
  };
  validateAllFormField = () => {
    const {userAdmins, actions, onClose} = this.props;
    const { score } = this.state;
    this.refs.form.validateAll((errors, values) => {
      if (!score.password || score.password && score.password.length === 0) {
        this.setState({passWord: '密码不能为空'})
      } else if (!this.state.score.isValid) {
        this.setState({passWord: '密码强度弱'})
      } else {
        this.setState({passWord: ''})
      }


      if (errors || !this.state.score.isValid) {
        return;
      }

      actions.resetPasswdUserAdmin({id: userAdmins.item.account.id,password:score.password,repeat_password:values.repeat_password}).then().then(res => {
        if (res.body.meta.success) {
          Message.success('修改成功!')
        } else {
          Message.error('修改失败!')
        }
      })
      onClose && onClose();
    });
  };

  onClick(currentStep) {
    this.setState({currentStep});
  }

  checkConfirmedPassword = (rule, values, callback) => {
    if (!values) {
      callback('重复密码不能为空')
    } else if (values !== this.state.score.password) {
      callback('2次密码不一致!')
    } else {
      callback()
    }
  };


  foo = (score, password, isValid) => {
    this.setState({passWord: ''});
    this.setState({score})
  };

  componentDidMount() {
    this.props.setThis(this)
  }

  claerPassWordMessage  = () => {
    this.setState({passWord:''})
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
          title={'重置密码'}
        >
          <IceContainer style={styles.container}>
            <IceFormBinderWrapper
              value={this.props.clearPassword}
              onChange={this.formChange}
              ref="form"
            >
              <div style={styles.formContent}>
                {/*<Step current={this.state.currentStep}>*/}
                {/*<StepItem title="一般信息" onClick={this.onClick} />*/}
                {/*<StepItem title="软件许可证" onClick={this.onClick} />*/}
                {/*</Step>*/}
                {
                  // this.state.currentStep === 0 ? (
                  <div style={styles.formBox}>
                    <div>
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
                        <div style={styles.formLabel}>重复密码</div>
                        <IceFormBinder
                          name="repeat_password"
                          required
                          validator={this.checkConfirmedPassword}
                        >
                          <Input
                            htmlType="password"
                            placeholder="请再次输入密码"
                            name="password"
                            style={{width: '400px'}}
                          />
                        </IceFormBinder>
                        <IceFormError name="repeat_password" style={styles.formError}/>
                        {/* <IceFormError name="password" style={styles.formError} /> */}
                      </div>
                    </div>
                  </div>
                }
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
    paddingTop: 0,
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
    textAlign: 'center',
    position: 'relative'
  },
  formError: {
    // marginLeft: '10px',
    // width: '96px'
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
  formBox: {
    marginTop: '15px',
    marginBottom: '20px',
  },
  title: {
    color: 'rgb(32, 119, 255)',
    margin: '0px 0px 20px',
    paddingBottom: '10px',
    fontSize: '14px',
    borderBottom: '1px solid rgb(32, 119, 255)',
    fontWeight: 700,
  },
};

export default connect(
  // mapStateToProps
  state => ({
    userAdmins: state.userAdmins,
    userAdmin: state.userAdmins.item,
    caseId: state.userAdmins.caseId,
    pageSize: state.userAdmins.pageSize,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(AdminAccountForm);
