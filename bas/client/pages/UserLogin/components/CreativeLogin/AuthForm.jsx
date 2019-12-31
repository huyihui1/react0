/* eslint react/no-string-refs:0, array-callback-return:0, react/forbid-prop-types:0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Checkbox, Grid, Message} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAddressCard} from '@fortawesome/free-solid-svg-icons'
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';

import './authForm.css'

const {Row, Col} = Grid;

class AuthForm extends Component {
  static displayName = 'AuthForm';

  static propTypes = {
    config: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    links: PropTypes.array,
    handleSubmit: PropTypes.func,
    formChange: PropTypes.func,
  };

  static defaultProps = {
    links: [],
    handleSubmit: () => {
    },
    formChange: () => {
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.initFields,
      type: ''
    };
  }

  formChange = (value) => {
    this.setState(
      {
        value,
      },
      () => {
        this.props.formChange(value);
      }
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.refs.form.validateAll((errors, values) => {
      this.props.handleSubmit(errors, values);
    });
  };
  renderButton = (item) => {
    return (
      <Row
        style={{...styles.formItem, ...styles.submitButton}}
        key={item.label}
      >
        <CustomButton
          {...item.componentProps}
          style={{border: 0}}
          onClick={this.handleSubmit}
        >
          {item.label}
        </CustomButton>
      </Row>
    );
  };

  renderInput = (item) => {
    return (
      <Row style={styles.formItem} key={item.label}>
        <Col style={styles.formItemCol}>
          <IceFormBinder {...item.formBinderProps}>
            <CustomInput {...item.componentProps} />
          </IceFormBinder>
        </Col>
        <Col>
          <IceFormError name={item.formBinderProps.name} style={styles.error}/>
        </Col>
      </Row>
    );
  };

  renderCheckbox = (item) => {
    return (
      <Row style={styles.formItem} key={item.label}>
        <Col>
          <IceFormBinder {...item.formBinderProps}>
            <Checkbox {...item.componentProps}>{item.label}</Checkbox>
          </IceFormBinder>
        </Col>
      </Row>
    );
  };

  renderFromItem = (config) => {
    return config.map((item) => {
      if (item.component === 'Input') {
        return this.renderInput(item);
      } else if (item.component === 'Checkbox') {
        return this.renderCheckbox(item);
      } else if (item.component === 'Button') {
        return this.renderButton(item);
      }
    });
  };

  getType = (value) => {
    if (value === 'Trival') {
      return '试用版'
    } else if (value === 'Personal') {
      return '个人版'
    } else if (value === 'Pro') {
      return '专业版'
    } else if (value === 'Enterprise') {
      return '企业版'
    } else {
      return '未知'
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.license && nextProps.license.data) {
      let type = this.getType(nextProps.license.data.plan)
      this.setState({type})
    }
  }

  render() {
    const {title, config, links, showLock} = this.props;
    const {value, type} = this.state;
    const license = this.props.license && this.props.license.data;
    const version = this.props.license && this.props.license.ext[0]['git.build.version'];
    const abbrev = this.props.license && this.props.license.ext[0]['git.commit.id.abbrev'];
    return (
      <div style={styles.formContainer}>
        <h4 style={styles.formTitle}>{title}</h4>
        {
          showLock ? this.props.license && this.props.license.meta.code === '4011' ? (
            <div className={["translateX-200", this.props.openMessage ? "translateX-0" : ' '].join(' ')}>
              <Message visible={this.props.openMessage} onClose={this.props.handleMessage}
                       title={<span>许可证未安装, 请联系<a href='/'>客服</a></span>} type="error"
                       style={{marginBottom: '20px', height: '100%'}}>
                {/*<p style={{marginTop: '25px'}}>机器编码: <span>{license && license.host_id}</span></p>*/}
                {/*<p>*/}
                {/*客户名称: <span>{license && license.subject}</span>*/}
                {/*</p>*/}
                {/*<p>版&emsp;&emsp;本: <span>{license && license.plan === 'Trival' ? '试用版' : '未知'}</span></p>*/}
                {/*<p>到期时间: <span style={{fontWeight: 'bold'}}>{license && license && license.not_after}</span></p>*/}
              </Message>
            </div>
          ) : (
            <div className={["translateX-200", this.props.openMessage ? "translateX-0" : ' '].join(' ')}>
              <Message visible={this.props.openMessage} onClose={this.props.handleMessage}
                       title={<span>许可证已失效, 请联系<a href='/'>客服</a></span>} type="error"
                       style={{marginBottom: '20px', height: '100%'}}>
                <p style={{marginTop: '25px'}}>机器编码: <span>{license && license.host_id}</span></p>
                <p>
                  客户名称: <span>{license && license.subject}</span>
                </p>
                <p>版&emsp;&emsp;本: <span>{license && license.plan === 'Trival' ? '试用版' : '未知'}</span></p>
                <p>到期时间: <span style={{fontWeight: 'bold'}}>{license && license && license.not_after}</span></p>
              </Message>
            </div>
          ) : (
            <div className={["translateX-200", this.props.openMessage ? "translateX-0" : ' '].join(' ')}>
              <Message visible={this.props.openMessage} onClose={this.props.handleMessage} title={<span>许可证信息</span>}
                       closeable type="success" style={styles.message}>
                <p style={{marginTop: '60px'}}>机器编码: <span>{license && license.host_id}</span></p>
                <p>
                  客户名称: <span>{license && license.subject}</span>
                </p>
                <p>购买计划: <span>{type}</span></p>
                <p>账号数目: <span>{license && license && license.acct_limit}</span></p>
                <p>到期时间: <span style={{fontWeight: 'bold'}}>{license && license && license.not_after}</span></p>
                <p>软件版本: <span>{'V' + version + '  Build  ' + abbrev}</span></p>
              </Message>
            </div>
          )
        }
        <IceFormBinderWrapper
          value={value}
          onChange={this.formChange}
          ref="form"
        >
          <div style={styles.formItems}>
            {this.renderFromItem(config)}

            {Array.isArray(links) && links.length ? (
              <Row style={styles.footer}>
                {links.map((item, index) => {
                  return (
                    item.text === '许可证' ? (
                      <span key={index} style={{...styles.link, marginRight: '2px'}} onClick={this.props.handleMessage}>
                      {item.text}
                    </span>
                    ) : (
                      <span key={index} style={styles.link}>
                      {item.text}
                    </span>
                    )
                  );
                })}
                {/*<label onClick={this.props.handleMessage}>{links[0].text}</label>*/}
                <span title={"许可证信息"} style={{cursor: 'pointer', marginTop: '-2px', color: showLock ? 'red' : 'green'}}
                      onClick={this.props.handleMessage}><FontAwesomeIcon icon={faAddressCard}/></span>
              </Row>
            ) : null}
            <span>
            </span>
          </div>
        </IceFormBinderWrapper>
      </div>
    );
  }
}

const styles = {
  formContainer: {
    position: 'relative',
  },
  message: {
    height: '100%',
  },
  formTitle: {
    marginBottom: '40px',
    fontWeight: '500',
    fontSize: '22px',
    textAlign: 'center',
    letterSpacing: '4px',
  },
  formItem: {
    marginBottom: '20px',
    position: 'relative',
  },
  submitButton: {
    justifyContent: 'center',
  },
  checkbox: {
    color: '#999',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    margin: '0 5px',
    color: '#999',
  },
  link: {
    color: '#999',
    fontSize: '12px',
    margin: '0 5px',
  },
  error: {
    position: 'absolute',
    width: '35px',
    right: '-8px',
    top: '3px'
  }
};

export default AuthForm;
