/* eslint react/no-string-refs:0 */
import React, {Component} from 'react';
import IceContainer from '@icedesign/container';
import {
  Dialog,
  Input,
  Button,
  Select,
  DatePicker,
  Radio,
  Message,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import {connect} from 'react-redux';
import {compose} from 'redux';
import moment from 'moment';

import {addCases, updateCase, removeCase, getCasesList,activeCase, clearCases} from '../../../stores/case/actions';
import {clearCaseName} from '../../UserLogin/actions';
import CasesReducer from '../../../stores/case/reducer';
import injectReducer from '../../../utils/injectReducer';

const {Option} = Select;
const {Group: RadioGroup} = Radio;
moment.locale('zh-cn');

class DonationForm extends Component {
  static displayName = 'DonationForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        status: '1'
      },
    };
    this.popupAlert = this.popupAlert.bind(this);
  }

  formChange = (value) => {
    console.log('value', value);
  };

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log({errors});
        // Message.error('提交失败');
        return;
      }
      if (Object.keys(this.props.values).length === 1) {
        this.props.addCases(values);
      } else {
        this.props.updateCase(values);
      }
      this.props.onClose && this.props.onClose();
    });
  };


  popupAlert() {
    const dialog = Dialog.show({
      title: '警告',
      content: <div style={{width: '300px',lineHeight:'23px'}}>确定要删除案件[{this.props.values.name}]吗?<br/><span style={{color:'red'}}>请注意:   这将会删除本案件中的所有话单以及所有标注，虚拟网，亲情网等辅助数据!</span></div>,
      footer: (
        <div style={{width: '300px'}}>
          <Button type="primary" warning onClick={() => {
            this.props.removeCase(this.props.values).then(res => {
              console.log(res);
              if (res.meta.success) {
                const {cases, clearCases, clearCaseName} = this.props;
                if (cases.case.id === res.data.id) {
                  clearCases();
                  clearCaseName();
                }
                this.props.activeCase({
                  page: 1,
                  pagesize: this.props.pageSize,
                });
              }
            });

            dialog.hide();
            this.props.onClose && this.props.onClose();
          }}>
            确认
          </Button>
          <Button type="secondary" onClick={() => dialog.hide()} style={{marginLeft: '15px'}}>
            取消
          </Button>
        </div>
      )
    });
  };


  render() {
    return (
      <Dialog
        visible={this.props.visible}
        onOk={this.props.onClose}
        closeable="esc,mask,close"
        onCancel={this.props.onClose}
        onClose={this.props.onClose}
        footer={false}
        title={Object.keys(this.props.values).length !== 1 ? '编辑案件' : '新增案件'}
      >
        <IceContainer style={styles.container}>
          <IceFormBinderWrapper
            value={{...this.props.values} || this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formContent}>
              <div style={styles.formItem}>
                <div style={styles.formLabel}>案件名称</div>
                <IceFormBinder
                  name="name"
                  required
                  triggerType="onBlur"
                  message="案件名称不能为空"
                >
                  <Input
                    placeholder="请输入案件名称"
                    name="name"
                    style={{width: '400px'}}
                  />
                </IceFormBinder>
                <div style={styles.formError}>
                  <IceFormError name="name" style={{color: '#f76048'}}/>
                </div>
              </div>
              <div style={styles.formItem}>
                <div style={styles.formLabel}>案号</div>
                <IceFormBinder
                  name="num"
                  required
                  triggerType="onBlur"
                  message="案号不能为空"
                >
                  <Input
                    placeholder="请输入案号"
                    name="num"
                    style={{width: '400px'}}
                  />
                </IceFormBinder>
                <div style={styles.formError}>
                  <IceFormError name="num" style={{color: '#f76048'}}/>
                </div>
              </div>
              {/*
              <div style={styles.formItem}>
                <div style={styles.formLabel}>案件类别</div>
                <IceFormBinder name="cate">
                  <Select
                    placeholder="请选择"
                    multiple
                    name="cate"

                    style={{ width: '400px' }}
                  >
                    <Option value="1">知识产权</Option>
                    <Option value="2">劳动纠纷</Option>
                    <Option value="3">交通事故</Option>
                    <Option value="other">其他</Option>
                  </Select>
                </IceFormBinder>
              </div>
              */}
              <div style={styles.formItem}>
                <div style={styles.formLabel}>经办人</div>
                <IceFormBinder
                  name="operator"
                >
                  <Input
                    placeholder="请输入经办人"
                    name="operator"
                    style={{width: '400px'}}
                  />
                </IceFormBinder>
              </div>
              <div style={styles.formItem}>
                <div style={styles.formLabel}>案件状态</div>
                <IceFormBinder
                  name="status"
                >
                  <Select
                    placeholder="请选择案件状态"
                    name="status"
                    style={{width: '400px'}}
                  >
                    <Option value={"1"}>在办</Option>
                    <Option value={"0"}>存档</Option>
                  </Select>
                </IceFormBinder>
              </div>
              <div style={styles.formItem}>
                <div style={styles.formLabel}>备注</div>
                <IceFormBinder
                  name="memo"
                  triggerType="onBlur"
                >
                  <Input.TextArea
                    multiple
                    placeholder="请输入备注"
                    name="memo"
                    style={{width: '400px'}}
                  />
                </IceFormBinder>
                <div style={styles.formError}>
                  <IceFormError name="donator" style={{color: '#f76048'}}/>
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                {
                  (Object.keys(this.props.values).length !== 1 ? <Button
                    type="primary"
                    style={styles.submitButton2}
                    warning
                    onClick={this.popupAlert}
                  >
                    删 除
                  </Button> : '')
                }
                <Button
                  type="primary"
                  style={styles.submitButton2}
                  onClick={this.validateAllFormField}
                >
                  提 交
                </Button>
                <Button
                  type="secondary"
                  style={styles.submitButton2}
                  onClick={() => {
                    this.props.onClose()
                  }}
                >
                  退 出
                </Button>
              </div>
            </div>
          </IceFormBinderWrapper>
        </IceContainer>
      </Dialog>
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
    // display: 'none',
    // marginLeft: '10px',
    // width: '96px',
    position: 'absolute',
    top: '35px',
    left: '95px',
    color: '#f76048'
  },
  submitButton2: {
    marginLeft: '15px',
  },
  submitButton: {
    marginLeft: '85px',
  },
};

const mapStateToProps = state => {
  return {
    cases: state.cases,
    pageSize: state.cases.pageSize,
  }
};
const mapDispatchToProps = {
  addCases,
  updateCase,
  removeCase,
  getCasesList,
  activeCase,
  clearCases,
  clearCaseName
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({key: 'cases', reducer: CasesReducer});
export default compose(
  withReducer,
  withConnect,
)(DonationForm);
