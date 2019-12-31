import React, {Component} from 'react';
import {Input, Select, Button, Message} from '@alifd/next';
import {FormBinderWrapper, FormBinder, FormError, FormError as IceFormError} from '@icedesign/form-binder';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../../../stores/RelNumbers';
import {CN_PHONE_NUM_VAGUE_RULE, CN_SHORT_NUM_VAGUE_RULE} from "../../../../fieldConstraints";


const {Option} = Select;

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      tips: ''
    };
    this.checkNum = this.checkNum.bind(this);
    this.checkShortNum = this.checkShortNum.bind(this);
    this.checkNetwork = this.checkNetwork.bind(this);
  }

  validateFields = () => {
    const {validateFields} = this.refs.form;
    const {caseId, actions} = this.props;
    validateFields((errors, values) => {
      console.log({errors});

      if (!errors) {
        const v = {...values};
        for (const key in v) {
          if (v[key]) {
            v[key] = ['FUZZY', v[key]];
          } else {
            delete v[key];
          }
        }
        actions.getRelNumber({...v, case_id: caseId});
      }
    });
  };


  checkNum = (rule, values, callback) => {
    if (!values && !this.state.values.short_num && !this.state.values.network) {
      callback('请输入查询条件');
      this.setState({tips: '请输入查询条件'})
    } else if (values && !CN_PHONE_NUM_VAGUE_RULE.test(values)) {
      callback('请输入正确的格式');
      this.setState({tips: '请输入正确的格式'})
    } else {
      callback();
      this.setState({tips: ''})
    }
  };
  checkShortNum = (rule, values, callback) => {
    if (!values && !this.state.values.num && !this.state.values.network) {
      callback('请输入查询条件');
      this.setState({tips: '请输入查询条件'})
    } else if (values && !CN_SHORT_NUM_VAGUE_RULE.test(values)) {
      console.log('111');
      callback('请输入正确的格式');
      this.setState({tips: '请输入正确的格式'})
    } else {
      callback();
      this.setState({tips: ''})
    }
  };

  checkNetwork = (rule, values, callback) => {
    if (!values && !this.state.values.num && !this.state.values.short_num) {
      callback('请输入查询条件');
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
              长号:
              <FormBinder name="num" validator={this.checkNum}>
                <Input
                  style={{...styles.input}}
                />
              </FormBinder>
              <IceFormError name="num" style={{...styles.formError, display: 'none'}}/>
            </label>
          </span>
          <span style={styles.caseNumber}>
            <label>
            亲情网短号:
            <FormBinder name="short_num" validator={this.checkShortNum}>
              <Input
                style={{...styles.input, ...styles.shortInput}}
              />
            </FormBinder>
              <IceFormError name="short_num" style={{...styles.formError, display: 'none'}}/>
          </label>
          </span>
          <span style={styles.caseNumber}>
            <label>
            亲情网名称:
            <FormBinder name="network" validator={this.checkNetwork}>
              <Input
                style={{...styles.input}}
              />
            </FormBinder>
              <IceFormError name="network" style={{...styles.formError, display: 'none'}}/>
          </label>
          </span>
          {/*<Select*/}
          {/*placeholder="亲情网名称"*/}
          {/*style={{ ...styles.select, ...styles.input }}*/}
          {/*>*/}
          {/*<Option value="small">浙江公安网</Option>*/}
          {/*<Option value="medium">温州市城建设计院</Option>*/}
          {/*<Option value="large">无</Option>*/}
          {/*</Select>*/}
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
        <div style={{position: 'absolute', left: '840px', top: '8px', color: '#f76048',width:'250px'}}>{this.state.tips}</div>
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
    position: 'relative'
  },
  date: {
    marginRight: '24px',
  },
  button: {
    margin: '0 4px',
    letterSpacing: '2px',
  },
  formError: {
    position: 'absolute',
    top: '2px',
    color: '#f76048',
    width: '200px'
  },
};

export default connect(
  state => ({
    caseId: state.relNumbers.caseId,
  }),
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(SearchBar);
