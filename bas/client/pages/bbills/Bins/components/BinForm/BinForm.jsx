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

import {actions} from '../../../../../bbStores/Bins';


import {CN_MOBILE_NUM_RULE, CN_REL_NUM_RULE} from "../../../../../fieldConstraints";
const { Option } = Select;

export class BinForm extends Component {
  static displayName = 'BinForm';

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
        actions.updateListBins({...values, case_id: caseId})
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
        actions.createBins({...values, case_id: caseId})
          .then(res => {
            if (res.status === 'resolved') {
              Message.success('添加成功...');
              actions.fetchBins({case_id: caseId}, {
                query: {
                  page: 1,
                  pagesize: this.props.bins.pageSize
                }
              });
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
    if (this.props.isEdit && this.props.bins.item) {
      if (this.state.value.id !== this.props.bins.item.id) {
        this.setState({
          value: JSON.parse(JSON.stringify(this.props.bins.item))
        })
      }
    }
  }


  checkNum = (rule, values, callback) => {
    if (!values) {
      callback('卡名不能为空')
    }
    // else if (!CN_MOBILE_NUM_RULE.test(values)) {
    //   callback('请输入正确的格式')
    // }
    else {
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
    const {bins} = this.props;
    return (
      <IceContainer style={styles.container}>
        <IceFormBinderWrapper
          value={this.state.value}
          onChange={this.formChange}
          ref="form"
        >
          <div style={styles.formContent}>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>卡名</div>
              <IceFormBinder
                name="card_name"
                required
                triggerType="onBlur"
                validator={this.checkNum}
              >
                <Input
                  placeholder="请输入卡名"
                  name="card_name"
                  style={{width: '400px'}}
                />
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="card_name" style={{color: '#f76048'}}/>
              </div>
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>标识符</div>
              <IceFormBinder
                name="value"
                // required
                // triggerType="onBlur"
                // validator={this.checkShortNum}
              >
                <Input
                  placeholder="请输入标识符"
                  name="value"
                  style={{width: '400px'}}
                />
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="value" style={{color: '#f76048'}}/>
              </div>
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>卡号长度</div>
              <IceFormBinder
                name="card_len"
                // required
                // triggerType="onBlur"
                // message="卡号长度不能为空"
              >
                <Input
                  placeholder="请输入卡号长度"
                  name="card_len"
                  style={{width: '400px'}}
                />
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="card_len" style={{color: '#f76048'}}/>
              </div>
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>类型</div>
              <IceFormBinder
                name="card_type"
                // required
                // validator={this.checkNum}
              >
                <Select
                  style={{...styles.input}}
                  placeholder="请选择交易类型"
                >
                  <Option value={1}>借记卡</Option>
                  <Option value={2}>贷记卡</Option>
                  <Option value={3}>准贷记卡</Option>
                  <Option value={4}>预付费卡</Option>
                </Select>
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="card_type" style={{color: '#f76048'}}/>
              </div>
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>银行名称</div>
              <IceFormBinder
                name="bank_name"
                // validator={this.checkNum}
              >
                <Input
                  placeholder="请输入银行名称"
                  name="bank_name"
                  style={{width: '400px'}}
                />
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="bank_name" style={{color: '#f76048'}}/>
              </div>
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>银行编码</div>
              <IceFormBinder
                name="bank_id"
                // validator={this.checkNum}
              >
                <Input
                  placeholder="请输入银行编码"
                  name="bank_id"
                  style={{width: '400px'}}
                />
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="bank_id" style={{color: '#f76048'}}/>
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
    caseId: state.cases.case.id,
    bins: state.bins
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(BinForm);
