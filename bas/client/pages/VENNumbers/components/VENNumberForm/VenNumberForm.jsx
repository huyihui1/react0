/* eslint react/no-string-refs:0 */
import React, {Component} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import IceContainer from '@icedesign/container';
import {
  Input,
  Button,
  Message,
  Select
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import {createVENnumber, setVENnumber, updateVENnumber} from '../../../../stores/venNumbers/actions';
import VENnumbersReducer from '../../../../stores/venNumbers/reducer';
import injectReducer from '../../../../utils/injectReducer';
import ErrorRenders from './ErrorRender';
import './style.css';

import {CN_MOBILE_NUM_RULE, CN_VEN_NUM_RULE} from '../../../../fieldConstraints'

// import {Select} from "@alifd/next/lib/select";


export class AddVENNumberForm extends Component {
  static displayName = 'AddVENNumberForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        // status: 'pending',
        // labcolor: "#ff6900"
      },
    };
  }

  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log({errors});
        // Message.error('提交失败');
        return;
      }
      if (this.props.isEdit) {
        this.props.updateVENnumber(values);
      } else {
        this.props.createVENnumber(values);
      }
      if (this.props.onClose) {
        this.props.onClose();
      }
      // console.log(values);
      // Message.success('提交成功');
    });
  };


  checkNum = (rule, values, callback) => {
    if (!values) {
      callback('长号不能为空')
    } else if (!CN_MOBILE_NUM_RULE.test(values)) {
      callback('请输入正确的格式')
    } else {
      callback()
    }
  };

  checkShortNum = (rule, values, callback) => {
    if (!values) {
      callback('短号不能为空')
    } else if (!CN_VEN_NUM_RULE.test(values)) {
      callback('请输入正确的格式')
    } else {
      callback()
    }
  };


  render() {
    return (
      <IceContainer style={styles.container}>
        <IceFormBinderWrapper
          value={this.props.isEdit && this.props.VENnumber ? this.props.VENnumber : this.state.value}
          onChange={this.formChange}
          ref="form"
        >
          <div style={styles.formContent}>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>长号</div>
              <IceFormBinder
                name="num"
                required
                // triggerType="onBlur"
                validator={this.checkNum}
              >
                <Input
                  placeholder="请输入长号"
                  name="num"
                  style={{width: '400px'}}
                />
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="num" style={{color: '#f76048'}}/>
              </div>
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>短号</div>
              <IceFormBinder
                name="short_num"
                required
                // triggerType="onBlur"
                validator={this.checkShortNum}
              >
                <Input
                  placeholder="请输入短号"
                  name="short_num"
                  style={{width: '400px'}}
                />
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="short_num" style={{color: '#f76048'}}/>
              </div>
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>虚拟网名称</div>
              <IceFormBinder
                name="network"
                required
                // triggerType="onBlur"
                message="虚拟网名称不能为空"
              >
                <Select.AutoComplete dataSource={this.props.venNumbersList} style={{width: '400px'}}/>
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="network" style={{color: '#f76048'}}/>
              </div>
            </div>
            <div style={{textAlign: 'right'}}>
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
    );
  }
}

const styles = {
  formContent: {
    marginLeft: '30px',
  },
  formItem: {
    marginBottom: '25px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  formLabel: {
    width: '70px',
    marginRight: '15px',
    textAlign: 'right',
  },
  formError: {
    position: 'absolute',
    top: '35px',
    left: '95px',
    color: '#f76048'
  },
  submitButton: {
    marginLeft: '85px',
  },
  submitButton2: {
    marginLeft: '15px',
  },

};

const mapStateToProps = state => {
  return {
    VENnumber: Object.assign({}, state.vennumbers.item),
    venNumbers: state.venNumbers,
    venNumbersList: state.vennumbers.venNumbers
  };
};
const mapDispatchToProps = {
  createVENnumber,
  setVENnumber,
  updateVENnumber,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withReducer = injectReducer({key: 'vennumbers', reducer: VENnumbersReducer});
export default compose(
  withReducer,
  withConnect,
)(AddVENNumberForm);
