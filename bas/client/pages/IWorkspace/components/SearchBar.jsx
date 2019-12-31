import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FormBinderWrapper, FormBinder, FormError, FormError as IceFormError} from '@icedesign/form-binder';
import {Input, Field, Button, Message} from '@alifd/next';
import IceContainer from '@icedesign/container';
import {getCase} from '../../../stores/case/actions';
import {searchFun} from '../../../fieldConstraints';


class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
      tips: ''
    };
    this.checkNum = this.checkNum.bind(this);
    this.checkName = this.checkName.bind(this);
  }

  validateFields = () => {
    const {validateFields} = this.refs.form;

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
        this.props.getCase(v);
      }
    });
  };


  checkNum = (rule, values, callback) => {
    if (!values && !this.state.value.name) {
      callback('请输入案号/名称');
      this.setState({tips: '请输入查询条件'})
    } else {
      callback();
      this.setState({tips: ''})
    }
  };

  checkName = (rule, values, callback) => {
    if (!values && !this.state.value.num) {
      callback('请输入案号/名称');
      this.setState({tips: '请输入查询条件'})
    } else {
      callback();
      this.setState({tips: ''})
    }
  };


  render() {
    return (
      <IceContainer style={styles.container}>
        <div style={styles.container}>
          <div>
            <FormBinderWrapper
              value={this.state.value}
              ref="form"
            >
              <span style={styles.caseNumber}>
                <label>
                  案号:
                  <FormBinder name="num" validator={this.checkNum}>
                    <Input
                      style={{...styles.input, ...styles.shortInput}}
                    />
                  </FormBinder>
                  {/*<div style={{...styles.formError, left: '509px'}}>*/}
                  {/*<IceFormError name="num" style={{color: '#f76048'}}/>*/}
                  {/*</div>*/}
                </label>
              </span>
              <span style={styles.caseNumber}>
                <label>
                  名称:
                  <FormBinder name="name" validator={this.checkName}>
                    <Input
                      style={{...styles.input}}
                    />
                  </FormBinder>
                  {/*<div style={{...styles.formError, left: '338px', display: 'none'}}>*/}
                  {/*<IceFormError name="name" style={{color: '#f76048'}}/>*/}
                  {/*</div>*/}
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
        </div>
        <div style={{
          position: 'absolute',
          left: '530px',
          top: '28px',
          color: '#f76048',
          width: '250px'
        }}>{this.state.tips}</div>
      </IceContainer>
    );
  }
}

const styles = {
  container: {
    margin: '0',
    letterSpacing: '2px',
    background: 'transparent',
    position: 'relative'
  },
  other: {
    margin: '5px 0',
  },
  input: {
    margin: '0 4px',
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
    position: 'relative'
  },
  date: {
    marginRight: '24px',
  },
  button: {
    margin: '0 4px',
    letterSpacing: '2px',
  },
  buttonRight: {
    margin: '0 4px',
    letterSpacing: '2px',
  },
  search: {
    textAlign: 'center',
    margin: '10px 0',
  },
  formError: {
    // display: 'none',
    // marginLeft: '10px',
    // width: '96px',
    position: 'absolute',
    top: '28px',
    color: '#f76048',
    width: '120px'
  },
};

const mapStateToProps = (state) => {
  return {state};
};

const mapDispatchToProps = {
  getCase,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchBar);

