import React, {Component} from 'react';
import {Input, Button, Message} from '@alifd/next';
import {FormBinderWrapper, FormBinder, FormError} from '@icedesign/form-binder';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../../../stores/labelCell';
import {CN_PHONE_NUM_VAGUE_RULE} from "../../../../fieldConstraints";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      tips: ''
    };
  }

  validateFields = () => {
    const {validateFields} = this.refs.form;
    const {caseId, actions} = this.props;
    validateFields((errors, values) => {
      // console.log({ errors });

      if (!errors) {
        const v = {...values};
        for (const key in v) {
          if (v[key]) {
            v[key] = ['FUZZY', v[key]];
          } else {
            delete v[key];
          }
        }
        this.props.actions.searchCtLabelsLabelCell({caseId: this.props.caseId, ...v})
      }
    });
  };

  checkCtCode = (rule, values, callback) => {
    if (!values && !this.state.values.label) {
      this.setState({tips: '请输入查询条件'})
    } else {
      callback();
      this.setState({tips: ''})
    }
  };

  checkLabel = (rule, values, callback) => {
    if (!values && !this.state.values.ct_code) {
      this.setState({tips: '请输入查询条件'})
    } else {
      callback();
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
              基站编码:
              <FormBinder name="ct_code" validator={this.checkCtCode}>
                <Input
                  style={{...styles.input}}
                  trim
                />
              </FormBinder>
            </label>
            <label>
              标注:
              <FormBinder name="label" validator={this.checkLabel}>
                <Input
                  style={{...styles.input}}
                  trim
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
        <div style={{
          position: 'absolute',
          left: '630px',
          top: '8px',
          color: '#f76048',
          width: '250px'
        }}>{this.state.tips}</div>
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
  // mapStateToProps
  state => ({
    state,
    caseId: state.cases.case.id
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(SearchBar);
