import React, { Component } from 'react';
import { Input, Button, Message } from '@alifd/next';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../../../stores/citizens';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
    };
    this.validateFields = this.validateFields.bind(this)
  }

  validateFields = () => {
    const { validateFields } = this.refs.form;
    const { caseId, actions } = this.props;
    validateFields((errors, values) => {
      console.log({ errors });
      let param = ['FUZZY']
      // if (!errors) {
      //   console.log(values);
      // }
      param.push(values.text);
      this.props.actions.searchCitizen({
        criteria: {
          name: param,
          social_no: param,
        },
        case_id: caseId
      });
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
              搜索内容:
              <FormBinder name="text" message="请输入号码, 姓名及身份证">
                <Input
                  style={{ ...styles.input }}
                  placeholder="可输入号码, 姓名及身份证."
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
          <span style={{color: 'red', marginLeft: '5px', fontWeight: 'bold'}}>注意!您的搜索将会被记录,查询所得信息只能用于工作.</span>
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
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(SearchBar);
