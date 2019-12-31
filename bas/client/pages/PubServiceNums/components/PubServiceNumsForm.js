import React, {Component} from 'react';
import {connect} from 'react-redux';
import IceContainer from '@icedesign/container';
import {bindActionCreators} from 'redux';
import {
  Dialog,
  Input,
  Button,
  Message,
  DatePicker,
} from '@alifd/next';
import {CirclePicker} from 'react-color';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import moment from 'moment';
import {actions as PubServiceNumsActions} from '../../../stores/PubServiceNums';

import labelColorsConfig from '../../../labelColorsConfig';
import {CN_PHONE_NUM_VAGUE_RULE} from "../../../fieldConstraints";

const currentDate = moment();
const colors = labelColorsConfig.colors;

class CaseBreakpointForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        // color: colors[0],
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
    const {caseId, isEdit, actions, onClose} = this.props;

    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log({errors});
        // Message.error('提交失败');
        return;
      }

      if (isEdit) {
        Message.loading({
          title: '修改中...',
          duration: 0,
        });
        let newValues = {
          num: values.num,
          memo: values.memo,
          grup: values.grup
        };

        actions.editPubServiceNums({...newValues, id: values.id})
          .then(res => {
            if (res.body.meta.success) {
              Message.success('修改成功...');
              this.setState({
                value: {}
              });
              this.props.caseThis.state.rowSelection.selectedRowKeys = [];
              this.props.onClose();
              this.props.actions.fetchPubServiceNums({caseId: this.props.caseId}, {
                query: {
                  page: this.props.current,
                  pagesize: this.props.pageSize
                }
              });
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

        actions.addPubServiceNums({...values})
          .then(res => {
            if (res.body.meta.success) {
              Message.success('添加成功...');
              this.props.actions.fetchPubServiceNums({caseId: this.props.caseId}, {
                query: {
                  page: this.props.current,
                  pagesize: this.props.pageSize
                }
              });
              this.setState({
                value: {}
              });
              this.props.onClose()
            }
          })
          .catch(err => {
            Message.error('添加失败...');
            console.log(err);
          });
      }
    });
  };

  checkNum = (rule, values, callback) => {
    if (!values) {
      callback('号码不能为空');
    } else if (values && !CN_PHONE_NUM_VAGUE_RULE.test(values)) {
      callback('请输入正确的格式');
    } else {
      callback();
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isEdit && nextProps.caseEvent && JSON.stringify(nextProps.caseEvent) !== JSON.stringify(this.state.value)) {
      this.setState({
        value: Object.assign({}, nextProps.caseEvent)
      })
    } else {
      this.setState({
        value: {}
      })
    }
  }

  render() {
    return (
      <span>
        <Dialog
          visible={this.props.visible}
          onOk={this.props.onClose}
          closeable="esc,mask,close"
          onCancel={this.props.onClose}
          onClose={this.props.onClose}
          footer={false}
          title={`${this.props.isEdit ? '编辑' : '添加'}特殊号码`}
        >
          <IceContainer style={styles.container}>
            <IceFormBinderWrapper
              value={this.state.value}
              onChange={this.formChange}
              ref="form"
            >
              <div style={styles.formContent}>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>号码</div>
                  <IceFormBinder
                    name="num"
                    required
                    validator={this.checkNum}
                  >
                    <Input
                      placeholder=""
                      name='num'
                      hasLimitHint
                      aria-label="input max length 100" style={{width: '400px'}}/>
                  </IceFormBinder>
                  <IceFormError name="num" style={{...styles.formError}}/>
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>说明</div>
                  <IceFormBinder
                    name="memo"
                    required
                    message="说明不能为空"
                  >
                        <Input
                          placeholder=""
                          name='memo'
                          hasLimitHint
                          aria-label="input max length 100" style={{width: '400px'}}/>
                  </IceFormBinder>
                  <IceFormError name="memo" style={{...styles.formError}}/>
                </div>
                  <div style={styles.formItem}>
                  <div style={styles.formLabel}>分组</div>
                  <IceFormBinder
                    name="grup"
                    required
                    message="分组不能为空"
                  >
                        <Input
                          placeholder=""
                          name='grup'
                          hasLimitHint
                          style={{width: '400px'}}/>
                  </IceFormBinder>
                    <IceFormError name="grup" style={{...styles.formError}}/>
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
        </Dialog>
      </span>
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
    marginRight: '15px',
    textAlign: 'right',
  },
  formError: {
    position: 'absolute',
    top: '35px',
    left: '48px',
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
    // caseBreakpoints: state.caseBreakpoints,
    // caseEvent: state.caseBreakpoints.item,
    // caseId: state.caseBreakpoints.caseId,
    caseEvent: state.pubServiceNums.item,
    pageSize: state.pubServiceNums.pageSize,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...PubServiceNumsActions}, dispatch),
  }),
)(CaseBreakpointForm);
