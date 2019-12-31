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
import appConfig from '../../../appConfig';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";
const currentDate = moment();

const baseUrl = appConfig.rootUrl;


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

class LicensesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
      subSystems: []
    };
    this.onSuccess = this.onSuccess.bind(this);
    this.onChange = this.onChange.bind(this);
    this.dataOnChange = this.dataOnChange.bind(this);
    this.createLicense = this.createLicense.bind(this);
    this.emptyList = this.emptyList.bind(this);
    this.download = this.download.bind(this);
    this.onClose = this.onClose.bind(this)
  }

  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };


  onSuccess(info) {
    if (info.response.data.length === 0 ) {
      Message.error('许可证已存在!');
      this.props.onClose();
      this.props.fetchData();
      return
    }

    this.props.actions.setEstablishStatusSuperLicenses(false);
    this.props.actions.setLicensesFormDataSuperLicenses(info.response.data);


  }

  onChange(value) {
    this.setState({acctLimit: value})
  }

  dataOnChange(value) {
    this.setState({expiredAt: moment(value).format('YYYY-MM-DD')})
  }

  componentDidMount() {
    const {setThis} = this.props;
    setThis(this)
    this.setState({isEstablish: this.props.isEstablish})
  }

  createLicense() {
    // const {actions} = this.props;
    const {licenseId, expiredAt, acctLimit} = this.state;
    this.refs.form.validateAll((errors, values) => {
      let obj = {
        license_id: values.id,
        expired_at: values.expired_at,
        acct_limit: values.acct_limit,
        features: values.features
      };


      this.props.actions.createSuperLicenses(obj).then(res => {
        if (res.status === 'resolved') {
          Message.success('创建成功');
          this.props.onClose();
          this.props.fetchData()
        }
      }).catch(err => {
        console.log(err);
        Message.error('创建失败');
      });

      onClose && onClose();
    });


  }


  emptyList() {
    this.setState({hostId: '', plan: '', licenseId: '', state: '', city: '', custName: ''})
  }

  download() {
    const a = document.createElement('a');
    a.href = baseUrl + '/admin/licenses/' + this.props.formData.id + '/download';
    a.click();
  }

  onClose() {
    this.props.onClose()
  }

  render() {
    return (
      <Dialog
        visible={this.props.visible}
        onOk={this.props.onClose}
        closeable="esc,mask,close"
        onCancel={this.props.onClose}
        onClose={this.props.onClose}
        footer={false}
        title={`${this.props.isEdit ? '创建' : '下载'}许可证`}
      >
        {
          this.props.isEdit ? (
            <IceFormBinderWrapper ref="form" onChange={this.formChange} value={this.props.items}>
              <div style={{padding: '20px'}}>
                <div className="licenses_header">
                  <div className="licenses_left">
                    <Upload.Dragger
                      listType="text"
                      action={`${ajax.baseUrl}/admin/licenses/upload-profile`}
                      accept=".profile"
                      onSuccess={this.onSuccess}
                      method='post'
                      withCredentials={true}
                      headers={{'X-Requested-With': null}}
                      limit={1}
                    >
                      <div className="next-upload-drag" style={{
                        width: '300px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <p className="next-upload-drag-icon">
                          <FontAwesomeIcon icon={faUpload} size="4x"/>
                        </p>
                        <p className="next-upload-drag-text">点击或者拖动文件到虚线框内上传</p>
                        <p className="next-upload-drag-hint">
                          仅支持.profile
                        </p>
                      </div>
                    </Upload.Dragger>
                  </div>
                  <div className="licenses_rigth">
                    <div style={styles.formItem}>
                      <div style={styles.formLabel}>机器编码</div>
                      <IceFormBinder
                        name="host_id"
                        readOnly
                      >
                        <Input
                          // placeholder=""
                          // name="num"
                          style={{width: '310px'}}
                          // readOnly
                          // value={this.state.hostId}
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
                        width: '100%%'
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
                          readOnly
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
                          // value={this.state.plan}
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
                        <DatePicker style={{width: '310px'}}  disabledDate={disabledDate}/>
                      </IceFormBinder>
                    </div>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <Button
                    type="primary"
                    style={styles.submitButton}
                    onClick={this.createLicense}
                    disabled={this.props.item}
                  >
                    生成许可证
                  </Button>
                  <Button
                    type="secondary"
                    style={styles.submitButton2}
                    onClick={this.onClose}
                  >
                    退 出
                  </Button>
                </div>
              </div>
            </IceFormBinderWrapper>
          ) : (
            <IceFormBinderWrapper ref="form" value={JSON.parse(JSON.stringify(this.props.formData))}>
              <div style={styles.formItem}>
                <div style={styles.formLabel}>机器编码</div>
                <IceFormBinder
                  name="host_id"
                  required
                >
                  <Input
                    // placeholder=""
                    // name="num"
                    style={{width: '310px'}}
                    readOnly
                    // readOnly
                    // value={this.state.hostId}
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
                  width: '100%%'
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
                    readOnly
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
                <Select
                  placeholder=""
                  mode="multiple"
                  style={{width: '310px'}}
                  value={this.props.formData.features}
                  readOnly
                >
                  <Option value="pbills">话单系统</Option>
                  <Option value="bbills">账单系统</Option>
                </Select>
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
                    readOnly
                    // onChange={this.onChange}
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
                  {/*<DatePicker style={{width: '310px'}}/>*/}
                  <Input
                    placeholder="请输入数目"
                    style={{width: '310px'}}
                    readOnly
                    // onChange={this.onChange}
                  />
                </IceFormBinder>
              </div>
              <div style={{padding: '20px'}}>
                <div style={{textAlign: 'right'}}>
                  <Button
                    type="primary"
                    style={styles.submitButton}
                    onClick={this.download}
                  >
                    下载许可证
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
          )
        }

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
    item: state.superLicenses.item,
    items: state.superLicenses.items,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...LicensesActions}, dispatch),
  }),
)(LicensesForm);
