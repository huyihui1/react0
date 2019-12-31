import React, { Component } from 'react';
import { Input, Select, Button, Message } from '@alifd/next';
import {FormBinderWrapper, FormBinder, FormError, FormError as IceFormError} from '@icedesign/form-binder';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../../stores/adminAccounts';

const { Option } = Select;

class EasySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      tips:''
    };
  }
  validateFields = () => {
    const { validateFields } = this.refs.form;
    const { actions } = this.props;
    validateFields((errors, values) => {
      console.log({ errors });

      if (!errors) {
        actions.getUserAdmin({ ...values });
      }
    });
  };



  checkUsername = (rule, values, callback) => {
    if (!values && !this.state.values.query) {
      this.setState({tips: '请输入查询条件'})
    } else {
      callback()
      this.setState({tips: ''})
    }
  };
  checkOwner = (rule, values, callback) => {
    if (!values && !this.state.values.username) {
      this.setState({tips: '请输入查询条件'})
    } else {
      callback()
      this.setState({tips: ''})
    }
  };

  render() {
    return (
      <div style={styles.container}>
        <FormBinderWrapper
          value={this.state.values}
          ref="form"
        >
          <span style={styles.caseNumber}>
            <label>
              <FormBinder name="query" message="请输入帐号或用户" validator={this.checkUsername}>
                <Input trim
                       // hasClear
                       placeholder="请输入帐号或用户"
                  style={{ ...styles.input }}
                />
              </FormBinder>
            </label>
          </span>
        </FormBinderWrapper>
        <span>
          <Button
            type="primary"
            style={styles.button}
            onClick={this.validateFields}
          >
            查询
          </Button>
        </span>
        <div style={{position: 'absolute', left: '305px', top: '8px', color: '#f76048',width:'250px'}}>{this.state.tips}</div>
      </div>

    );
  }
}

const styles = {
  container: {
    margin: '20px',
    letterSpacing: '2px',
    position: 'relative'
  },
  input: {
    margin: '0 10px 0 5px',
  },
  select: {
    verticalAlign: 'middle',
    width: '200px',
  },
  shortInput: {
    width: '110px',
  },
  caseNumber: {
    marginRight: '16px',
  },
  date: {
    marginRight: '24px',
  },
  button: {
    margin: '0 4px',
    letterSpacing: '2px',
  },
};

export default connect(
  state => ({
    caseId: state.relNumbers.caseId,
  }),
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(EasySearch);
