import React, { Component } from 'react';
import { Input, Select, Button, Message } from '@alifd/next';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { actions } from '../../../../stores/RelNumbers';

const { Option } = Select;

class EasySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
    };
  }
  validateFields = () => {
    const { validateFields } = this.refs.form;
    const { caseId, actions } = this.props;
    validateFields((errors, values) => {
      console.log({ errors });

      if (!errors) {
        // actions.getRelNumber({ ...values, case_id: caseId });
        console.log(values);
      }
    });
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
              帐号:
              <FormBinder name="username" message="请输入帐号">
                <Input
                  style={{ ...styles.input }}
                />
              </FormBinder>
            </label>
            <label>
              使用者:
              <FormBinder name="owner" message="请输入使用者">
                <Input
                  style={{ ...styles.input, ...styles.shortInput }}
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
      </div>

    );
  }
}

const styles = {
  container: {
    margin: '20px',
    letterSpacing: '2px',
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
  // state => ({
  //   caseId: state.relNumbers.caseId,
  // }),
  // dispatch => ({
  //   actions: bindActionCreators({ ...actions }, dispatch),
  // }),
)(EasySearch);
