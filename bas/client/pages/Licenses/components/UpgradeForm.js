import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Dialog, Input, Button, Message, Upload, Select, DatePicker} from '@alifd/next';
import moment from 'moment';
import {actions as LicensesActions} from '../../../stores/Licenses';
import './Licenses.css'
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import {Tab} from "@alifd/next/lib/tab";
import {saveAs} from 'file-saver';
import ajax from '../../../utils/ajax';
const currentDate = moment();



const Option = Select.Option;

const disabledDate = function (date, view) {
  switch (view) {
    case 'date':
      return date.valueOf() <= currentDate.valueOf();
    case 'year':
      return date.year() < currentDate.year();
    case 'month':
      return date.year() * 100 + date.month() < currentDate.year() * 100 + currentDate.month();
    default: return false;
  }
};

class UpgradeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onClose = this.onClose.bind(this)
  }

  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };


  onChange(value) {
    this.setState({acctLimit: value})
  }


  onClose() {
    this.props.onClose();
  }


  validateFields = () => {
    const {validateAll} = this.refs.form;
    const {actions} = this.props;

    validateAll((errors, values) => {

      const val = {...values};
      let obj = {
        expired_at: moment(val.expired_at).format('YYYY-MM-DD'),
        acct_limit: val.acct_limit,
        plan: val.plan,
        features: val.features
      };
      actions.upgradeSuperLicenses({license_id: val.id, ...obj}).then(res => {
        if (res.body.meta.code == '200') {
          Message.success('升级成功!');
          this.props.fetchData();
        } else {
          Message.error('升级失败!');
        }
        this.props.onClose();
      }).catch(err => {
        console.log(err);
        Message.error('升级失败!');
      });

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
        title={'升级许可证'}
      >
        <IceFormBinderWrapper ref="form" value={JSON.parse(JSON.stringify(this.props.formData))}>
          <div style={styles.formItem}>
            <div style={styles.formLabel}>机器编码</div>
            <IceFormBinder
              name="host_id"
              required
            >
              <Input
                style={{width: '310px'}}
                readOnly
              />
            </IceFormBinder>
            {/* <IceFormError name="num" style={styles.formError}/> */}
          </div>
          <div style={styles.formItem}>
            <div style={styles.formLabel}>客户名称</div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '80%'
            }}
            >
              <IceFormBinder
                name="cust_name"
              >
                <Input
                  name="country"
                  style={{width: '310px'}}
                  readOnly
                />
              </IceFormBinder>
            </div>
            {/* <IceFormError name="num" style={styles.formError}/> */}
          </div>
          <div style={styles.formItem}>
            <div style={styles.formLabel}>客户地址</div>
            <IceFormBinder
              name="客户地址"
              required
              triggerType="onBlur"
              message="客户地址不能为空"
            >
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '80%'
              }}
              >
                <IceFormBinder
                  name="country"
                >
                  <Select
                    placeholder="国家"
                  />
                </IceFormBinder>
                <IceFormBinder
                  name="state"
                >
                  <Select
                    placeholder="省"
                  />
                </IceFormBinder>
                <IceFormBinder
                  name="city"
                >
                  <Select
                    placeholder="市"
                  />
                </IceFormBinder>
              </div>
            </IceFormBinder>
            {/* <IceFormError name="num" style={styles.formError}/> */}
          </div>
          <div style={styles.formItem}>
            <div style={styles.formLabel}>购买计划</div>
            <IceFormBinder
              name="plan"
              required
            >
              <Select
                placeholder=""
                style={{width: '310px'}}
                // value={this.state.plan}
              >
                <Option value="Trival">试用版</Option>
                <Option value="Personal">个人版</Option>
                <Option value="Pro">专业版</Option>
                <Option value="Enterprise">企业版</Option>
              </Select>
            </IceFormBinder>
            {/* <IceFormError name="short_num" style={styles.formError}/> */}
          </div>
          <div style={styles.formItem}>
            <div style={styles.formLabel}>可用功能</div>
            <IceFormBinder
              name="features"
              required
            >
              <Select
                placeholder=""
                mode="multiple"
                style={{width: '310px'}}
              >
                <Option value="pbills">话单系统</Option>
                <Option value="bbills">账单系统</Option>
              </Select>
            </IceFormBinder>
            {/* <IceFormError name="short_num" style={styles.formError}/> */}
          </div>
          <div style={styles.formItem}>
            <div style={styles.formLabel}>账号数目</div>
            <IceFormBinder
              name="acct_limit"
              required
            >
              <Input
                placeholder="请输入数目"
                style={{width: '310px'}}
                // onChange={this.onChange}
                htmlType='number'
              />
            </IceFormBinder>
            {/* <IceFormError name="num" style={styles.formError}/> */}
          </div>

          <div style={styles.formItem}>
            <div style={styles.formLabel}>到期日期</div>
            <IceFormBinder
              name="expired_at"
              required
            >
              {/*<DatePicker onChange={this.dataOnChange} style={{width: '310px'}}/>*/}
              <DatePicker style={{width: '310px'}} disabledDate={disabledDate}/>
            </IceFormBinder>
          </div>
          <div style={{padding: '20px'}}>
            <div style={{textAlign: 'right'}}>
              <Button
                type="primary"
                style={styles.submitButton}
                onClick={this.validateFields}
              >
                升级许可证
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
      </Dialog>
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
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  formLabel: {
    width: '70px',
    marginRight: '15px',
    textAlign: 'right',
  },
  formError: {
    marginLeft: '10px',
    // width: '96px'
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
    caseId: state.caseEvents.caseId,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...LicensesActions}, dispatch),
  }),
)(UpgradeForm);
