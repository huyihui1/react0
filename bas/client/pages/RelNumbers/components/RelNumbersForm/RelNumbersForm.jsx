/* eslint react/no-string-refs:0 */
import React, {Component} from 'react';
import IceContainer from '@icedesign/container';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  Input,
  Button,
  Select,
  Message,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';

import {actions} from '../../../../stores/RelNumbers';
import {actions as PbillsActions} from "../../../../stores/Pbills";


import './style.css';
import {CN_MOBILE_NUM_RULE, CN_REL_NUM_RULE} from "../../../../fieldConstraints";

export class AddVENNumberForm extends Component {
  static displayName = 'AddVENNumberForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {},
    };
  }


  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };

  validateAllFormField = (fieldnames = []) => {
    const {caseId, isEdit, actions, onClose} = this.props;

    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log({ errors });
        // Message.error('提交失败');
        return;
      }
      if (isEdit) {
        Message.loading({
          title: '修改中...',
          duration: 0,
        });
        actions.updateRelNumber({...values, caseId, itemId: values.id})
          .then(res => {
            if (res.status === 'resolved') {
              Message.success('修改成功...');
            }
          })
          .catch(err => {
            Message.error('修改失败...');
            console.log(err);
          });
      } else {
        Message.loading({
          title: '添加中...',
          duration: 0,
        });
        actions.createRelNumber({...values, caseId})
          .then(res => {
            if (res.status === 'resolved') {
              Message.success('添加成功...');
            }
            console.log(res);
          })
          .catch(err => {
            Message.error('添加失败...');
            console.log(err);
          });
      }
      onClose && onClose();
    });
  };

  componentDidMount() {
    this.props.actions.getRelNumBersPbills({caseId: this.props.caseId})
  }


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
    } else if (!CN_REL_NUM_RULE.test(values)) {
      callback('请输入正确的格式')
    } else {
      callback()
    }
  };



  render() {
    return (
      <IceContainer style={styles.container}>
        <IceFormBinderWrapper
          value={this.props.isEdit && this.props.relNumber ? this.props.relNumber : this.state.value}
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
              <div style={styles.formLabel}>亲情网名称</div>
              <IceFormBinder
                name="network"
                required
                triggerType="onBlur"
                message="亲情网名称不能为空"
              >
                <Select.AutoComplete dataSource={this.props.relNumBersPb} style={{width: '400px'}}/>
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
  container: {
    marginBottom: 0,
  },
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

export default connect(
  // mapStateToProps
  state => ({
    pathname: state.route.location.pathname,
    relNumbers: state.relNumbers,
    relNumber: Object.assign({}, state.relNumbers.item),
    caseId: state.relNumbers.caseId,
    relNumBersPb: state.pbills.relNumBers,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions, ...PbillsActions}, dispatch),
  }),
)(AddVENNumberForm);
