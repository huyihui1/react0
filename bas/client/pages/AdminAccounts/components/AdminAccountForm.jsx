import React, { Component } from 'react';
import { connect } from 'react-redux';
import IceContainer from '@icedesign/container';
import { bindActionCreators } from 'redux';
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
import { actions } from '../../../stores/adminAccounts';
import { CN_MOBILE_NUM_RULE } from '../../../fieldConstraints';
import ajax from '../../../utils/ajax';

const Option = Select.Option;
const StepItem = Step.Item;

class AdminAccountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        role: 'user',
      },
      currentStep: 0,
      subSystems: [],
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
    const { caseId, isEdit, actions, onClose } = this.props;
    const { currentStep } = this.state;
    // if (currentStep === 0) {
    //   this.setState({ currentStep: 1 });
    //   return;
    // }
    this.refs.form.validateAll((errors, values) => {
      // if (errors) {
      //   console.log({ errors });
      //   Message.error('提交失败');
      //   return;
      // }

      if (errors) {
        // Message.error('提交失败');
        return;
      }
      if (isEdit) {
        Message.loading({
          title: '修改中...',
          duration: 0,
        });
        actions.updateUserAdmin({ ...values, id: values.id })
          .then(res => {
            if (res.status === 'resolved') {
              Message.success('修改成功...');
              this.props.actions.fetchUserAdmins({ caseId: this.props.id }, {
                query: {
                  page: this.props.current,
                  pagesize: this.props.pageSize,
                },
              });
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
        actions.createUserAdmin({ ...values, caseId })
          .then(res => {
            if (res.res.body.meta.success) {
              Message.success('添加成功...');
              this.setState({
                value: {
                  role: 'user',
                },
              });

              this.props.actions.fetchUserAdmins({ caseId: this.props.id }, {
                query: {
                  page: this.props.current,
                  pagesize: this.props.pageSize,
                },
              });
            } else {
              Message.error(res.res.body.meta.message);
              this.setState({
                value: {
                  role: 'user',
                },
              });
            }
            console.log(res);
          })
          .catch(err => {
            Message.error('添加失败...');
            console.log(err);
            this.setState({
              value: {
                role: 'user',
              },
            });
          });
      }
      onClose && onClose();
    });
  };

  onClick(currentStep) {
    this.setState({ currentStep });
  }

  componentDidMount() {
    this.fetchSubSystems();
  }
  fetchSubSystems = () => {
    ajax.get('/user/settings/sub-systems').then(res => {
      if (res.meta.success) {
        console.log(res.data);
        this.setState({
          subSystems: res.data,
        });
      }
    });
  }


  checkUsername = (rule, values, callback) => {
    if (!values) {
      callback('帐号不能为空');
    } else {
      callback();
    }
  };

  checkPassword = (rule, values, callback) => {
    if (!values) {
      callback('密码不能为空');
    } else {
      callback();
    }
  };

  checkConfirmedPassword = (rule, values, callback) => {
    if (!values) {
      callback('重复密码不能为空');
    } else {
      callback();
    }
  };

  checkSubSystems = (rule, values, callback) => {
    if (!values) {
      callback('可用系统不能为空');
    } else {
      callback();
    }
  }

  checkName = (rule, values, callback) => {
    if (!values) {
      callback('使用人员不能为空');
    } else {
      callback();
    }
  };

  componentWillUnmount() {
    this.setState = (state, callback) => {

    };
  }

  render() {
    const { subSystems } = this.state;
    return (
      <span>
        <Dialog
          visible={this.props.visible}
          onOk={this.props.onClose}
          closeable="esc,mask,close"
          onCancel={this.props.onClose}
          onClose={this.props.onClose}
          footer={false}
          title={`${this.props.isEdit ? '编辑' : '添加'}用户`}
        >
          <IceContainer style={styles.container}>
            <IceFormBinderWrapper
              value={this.props.isEdit && this.props.userAdmin ? JSON.parse(JSON.stringify(this.props.userAdmin)) : this.state.value}
              onChange={this.formChange}
              ref="form"
            >
              <div style={styles.formContent}>
                <div style={styles.formBox}>
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>帐号</div>
                    <IceFormBinder
                      name="account"
                      required
                        // triggerType="onBlur"
                      validator={this.checkUsername}
                    >
                      <Input
                        placeholder="请输入帐号"
                        name="account"
                        style={{ width: '400px' }}
                        disabled={this.props.isEdit}
                      />
                    </IceFormBinder>
                    <IceFormError name="account" style={styles.formError} />
                    {/* <IceFormError name="username" style={styles.formError} /> */}
                  </div>
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>姓名</div>
                    <IceFormBinder
                      name="name"
                      required
                      validator={this.checkName}
                    >
                      <Input
                        placeholder="请输入姓名"
                        name="name"
                        style={{ width: '400px' }}
                      />
                    </IceFormBinder>
                    <IceFormError name="name" style={styles.formError} />
                    {/* <IceFormError name="owner" style={styles.formError} /> */}
                  </div>
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>单位</div>
                    <IceFormBinder
                      name="org"
                    >
                      <Input
                        placeholder="请输入单位名称"
                        name="org"
                        style={{ width: '400px' }}
                      />
                    </IceFormBinder>
                    <IceFormError name="org" style={styles.formError} />
                    {/* <IceFormError name="owner" style={styles.formError} /> */}
                  </div>
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>角色</div>
                    <IceFormBinder
                      name="role"
                      required
                      triggerType="onBlur"
                      message="角色不能为空"
                    >
                      <Select showSearch style={{ width: '400px' }}>
                        <Option value="super">超级账号</Option>
                        <Option value="admin">系统管理员</Option>
                        <Option value="user">一般用户</Option>
                      </Select>
                    </IceFormBinder>
                    {/* <IceFormError name="owner" style={styles.formError} /> */}
                  </div>

                  {
                      !this.props.isEdit ?

                        (
                          <div>
                            <div style={styles.formItem}>
                              <div style={styles.formLabel}>密码</div>
                              <IceFormBinder
                                name="password"
                                required
                                validator={this.checkPassword}
                              >
                                {
                                 this.props.isEdit ? (
                                   <Button
                                     type="primary"
                                   >
                                     重 置
                                   </Button>
                                 ) : (
                                   <Input
                                     htmlType="password"
                                     placeholder="请输入密码"
                                     name="password"
                                     style={{ width: '400px' }}
                                   />
                                 )
                               }
                              </IceFormBinder>
                              <IceFormError name="password" style={styles.formError} />
                              {/* <IceFormError name="password" style={styles.formError} /> */}
                            </div>
                            <div style={styles.formItem}>
                              <div style={styles.formLabel}>重复密码</div>
                              <IceFormBinder
                                name="confirmed_password"
                                required
                                validator={this.checkConfirmedPassword}
                              >
                                <Input
                                  htmlType="password"
                                  placeholder="请再次输入密码"
                                  name="confirmed_password"
                                  style={{ width: '400px' }}
                                />
                              </IceFormBinder>
                              <IceFormError name="confirmed_password" style={styles.formError} />
                              {/* <IceFormError name="password" style={styles.formError} /> */}
                            </div>
                          </div>
                        ) : ''
                    }
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>可用系统</div>
                    <IceFormBinder
                      name="sub_systems"
                      required
                      triggerType="onBlur"
                      message="可用系统不能为空"
                      validator={this.checkSubSystems}
                    >
                      <Select
                        placeholder=""
                        mode="multiple"
                        style={{ width: '400px' }}
                      >
                        {
                                   subSystems.indexOf('bbills') != -1 ? <Option value="bbills">账单系统</Option> : null
                                 }
                        {
                                   subSystems.indexOf('pbills') != -1 ? <Option value="pbills">话单系统</Option> : null
                                 }
                      </Select>
                    </IceFormBinder>
                    <IceFormError name="sub_systems" style={styles.formError} />
                  </div>
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>备注</div>
                    <IceFormBinder
                      name="memo"
                      triggerType="onBlur"
                    >
                      <Input.TextArea
                        placeholder="请输入使用人员信息备注"
                        name="memo"
                        style={{ width: '400px' }}
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="owner" style={styles.formError} /> */}
                  </div>
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
    padding: '0 20px',
    // height: '425px',
  },
  formContent: {
    marginLeft: '30px',
  },
  formItem: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  formLabel: {
    width: '70px',
    marginRight: '15px',
    textAlign: 'center',
  },
  formError: {
    // marginLeft: '10px',
    // width: '96px'
    position: 'absolute',
    top: '35px',
    left: '95px',
    color: '#f76048',
  },
  submitButton: {
    marginLeft: '85px',
  },
  submitButton2: {
    marginLeft: '15px',
  },
  formBox: {
    // marginTop: '15px',
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
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(AdminAccountForm);
