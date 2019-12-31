import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FormBinderWrapper, FormBinder, FormError, FormError as IceFormError} from '@icedesign/form-binder';
import {Input, Select, Button, Message} from '@alifd/next';
import {getVENnumber} from '../../../../stores/venNumbers/actions';
import {getCase} from '../../../../stores/case/actions';
import {CN_PHONE_NUM_VAGUE_RULE, CN_SHORT_NUM_VAGUE_RULE} from "../../../../fieldConstraints";

const {Option} = Select;

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      tips: ''
    };
  }

  handleClick = () => {

  };

  validateFields = () => {
    const {validateFields} = this.refs.form;
    const {state} = this.props;
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

        this.props.getVENnumber(state.cases.case.id, {criteria: v});
      }
    });
  };

  checkNum = (rule, values, callback) => {
    if (!values && !this.state.values.short_num && !this.state.values.network) {
      callback('请输入长号/短号/虚拟网名称');
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
          <span>
            <label style={styles.caseNumber}>
             长号:
              <FormBinder name="num" validator={this.checkNum}>
                <Input style={{...styles.input}}/>
              </FormBinder>
              <IceFormError name="num" style={{...styles.formError, display: 'none'}}/>
            </label>
            <label>
              虚拟网短号:
              <FormBinder name="short_num" validator={this.checkShortNum}>
                <Input
                  style={{...styles.input, ...styles.shortInput}}
                />
              </FormBinder>
              <IceFormError name="short_num" style={{...styles.formError, display: 'none'}}/>
            </label>
            <label>
              虚拟网名称:
              <FormBinder name="network" validator={this.checkNetwork}>
                <Input
                  style={{...styles.input}}
                />
              </FormBinder>
              <IceFormError name="network" style={{...styles.formError, display: 'none'}}/>
            </label>
            {/* <FormBinder name="network" message="请输入短号"> */}
            {/* <Select */}
            {/* placeholder="虚拟网名称" */}
            {/* style={{ ...styles.select, ...styles.input }} */}
            {/* > */}
            {/* <Option value="浙江公安网">浙江公安网</Option> */}
            {/* <Option value="温州市城建设计院">温州市城建设计院</Option> */}
            {/* <Option value="无">无</Option> */}
            {/* </Select> */}
            {/* </FormBinder> */}
          </span>
          <span>
            <Button
              type="primary"
              style={styles.button}
              onClick={this.validateFields}
            >
            查询
            </Button>
          </span>
        </FormBinderWrapper>
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
    margin: '0 10px  0 5px',
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
    top: '0',
    color: '#f76048',
    width: '120px'
  },
};

const mapStateToProps = (state) => {
  return {state};
};

const mapDispatchToProps = {
  getVENnumber,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchBar);
