/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment/moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import AuthForm from './AuthForm';
import { userLogin } from '../../actions';
import injectReducer from '../../../../utils/injectReducer';
import reducer from '../../reducer';
import ajax from '../../../../utils/ajax';

class LoginFrom extends Component {
  static displayName = 'LoginFrom';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      showLock: true,
      openMessage: false,
      license: null,
      config: [
        {
          label: '用户名',
          component: 'Input',
          componentProps: {
            placeholder: '用户名',
            maxLength: 20,
          },
          formBinderProps: {
            name: 'account',
            required: true,
            message: '必填',
          },
        },
        {
          label: '密码',
          component: 'Input',
          componentProps: {
            placeholder: '密码',
            htmlType: 'password',
          },
          formBinderProps: {
            name: 'password',
            required: true,
            message: '必填',
          },
        },
        {
          label: '记住账号',
          component: 'Checkbox',
          componentProps: {},
          formBinderProps: {
            name: 'checkbox',
          },
        },
        {
          label: '登录',
          component: 'Button',
          componentProps: {
            type: 'primary',
          },
          formBinderProps: {},
        },
      ],
    };
    this.handleMessage = this.handleMessage.bind(this);
  }

  formChange = (value) => {
    if (value.checkbox) {
      window.localStorage.setItem('account', value.account)
    } else {
      if (window.localStorage.getItem('account')) {
        window.localStorage.removeItem('account')
      }
    }
  };

  handleSubmit = (errors, values) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }
    console.log('values:', values);
    // 登录成功后做对应的逻辑处理
    this.props.userLogin(values);
  };

   getLicense = async () => {
     let showLock = false;
     const res = await ajax.get('/license/installed').catch(err => {
       console.log(err);
     });
     if (res && res.meta.success) {
       res.data.not_after = moment(res.data.not_after).format('YYYY-MM-DD');
       if (res.meta.code === '4011') {
         showLock = true;
         this.handleMessage()
       }
       this.setState({
         showLock,
         license: res,
       });
     } else {
       this.setState({
         showLock: true
       })
     }
   }
   handleMessage() {
     this.setState({
       openMessage: !this.state.openMessage,
     });
   }
   componentDidMount() {
     this.getLicense();
   }

   render() {
     const config = [
       {
         label: '用户名',
         component: 'Input',
         componentProps: {
           placeholder: '用户名',
           maxLength: 20,
         },
         formBinderProps: {
           name: 'account',
           required: true,
           message: '必填',
         },
       },
       {
         label: '密码',
         component: 'Input',
         componentProps: {
           placeholder: '密码',
           htmlType: 'password',
         },
         formBinderProps: {
           name: 'password',
           required: true,
           message: '必填',
         },
       },
       {
         label: '记住账号',
         component: 'Checkbox',
         componentProps: {},
         formBinderProps: {
           name: 'checkbox',
           valuePropName: "checked"
         },
       },
       {
         label: '登录',
         component: 'Button',
         componentProps: {
           type: 'primary',
         },
         formBinderProps: {},
       },
     ];
     const { devMode } = this.props;
     if (this.state.showLock && !devMode) {
       config[0].componentProps.disabled = true;
       config[0].componentProps.innerAfter = (
         <div style={{paddingLeft: '8px'}}>
           <FontAwesomeIcon icon={faLock} />
         </div>
       );
       config[1].componentProps.disabled = true;
       config[1].componentProps.innerAfter = (
         <div style={{paddingLeft: '8px'}}>
           <FontAwesomeIcon icon={faLock} />
         </div>
       );
       config[2].componentProps.disabled = true;
       config[3].componentProps.disabled = true;
     }
     const account = window.localStorage.getItem('account');
     const initFields = {
       account: account || '',
       password: '',
       checkbox: account ? true : false,
     };
     const links = [
       { text: '联系我们' },
       { text: '许可证' },
     ];

     return (
       <AuthForm
         title="登录"
         config={config}
         initFields={initFields}
         formChange={this.formChange}
         handleSubmit={this.handleSubmit}
         links={links}
         showLock={this.state.showLock}
         openMessage={this.state.openMessage}
         license={this.state.license}
         handleMessage={this.handleMessage}
       />
     );
   }
}

const mapDispatchToProps = {
  userLogin,
};

const mapStateToProps = (state) => {
  return { loginResult: state.login, route: state.route };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'login', reducer });

export default compose(
  withReducer,
  withConnect
)(LoginFrom);
