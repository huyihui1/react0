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
  Tab,
  DatePicker,
  Form,
  Upload,
  Field,
  Range
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import moment from 'moment';
import {saveAs} from 'file-saver';
import {faUpload} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {actions} from '../../../stores/localLicenses';
import ajax from '../../../utils/ajax';

const Option = Select.Option;
const FormItem = Form.Item;

// const provinceData = [];
// const cityData = {
//   Zhejiang: ['1', '2', '3'],
//   Hubei: ['4', '5', '6'],
//   Jiangsu: ['7', '8', '9'],
// };

export class LocalLicenseList extends Component {
  field = new Field(this, {
    onChange: async (name, val) => {
      console.log(name, val);
      if (!val[0].response.meta.success) {
        this.field.reset();
        Message.error('提交失败, 请重试.');
        this.setState({
          showList: false,
        });
      } else {
        this.getLicense();
      }
    },
  });
  static displayName = 'LocalLicenseList';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value1: {
        plan: 'Trival',
        // country: '中国',
        // state: '浙江省',
        // city: '杭州市'
      },
      value: {},
      data: [],
      province: null,
      city: '',
      showList: false,
      provinceData: ['中国'],
      stateData: [],
      cityData: []
    };
    this.handleProvinceChange = this.handleProvinceChange.bind(this);
    // this.handleCityChange = this.handleCityChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.saveUploaderRef = this.saveUploaderRef.bind(this);
    this.getLicense = this.getLicense.bind(this);
    this.showProfile = this.showProfile.bind(this);
    this.unloadingLicenses = this.unloadingLicenses.bind(this);
    this.getStateList = this.getStateList.bind(this);
    this.getCityList = this.getCityList.bind(this)
  }

  async getLicense() {
    const res = await ajax.get('/license/installed').catch(err => {
      console.log(err);
    });
    console.log(res);
    res.data.not_after = moment(res.data.not_after).format('YYYY-MM-DD');
    if (!res.meta.success) {
      this.setState({
        showList: false,
      });
      return
    }

    let country = '', state = '', city = '';
    if (res.data.holder || '') {
      res.data.holder.split(',').forEach(item => {
        let arr = item.trim().split('=');
        if (arr[0] == 'C') {
          country = arr[1]
        } else if (arr[0] == 'ST') {
          state = arr[1]
        } else if (arr[0] == 'L') {
          city = arr[1]
        }
      })
    }

    res.data.country = country;
    res.data.state = state;
    res.data.city = city;

    this.setState({
      showList: true,
      value: res.data,
    });
  }

  onSuccess(info) {
    this.showProfile();
    this.getLicense();
    console.log(info);
    if (!info.error) {
      Message.success('导入许可证成功!');
    }
  }

  onError(file) {
    this.showProfile();
    this.getLicense();
    Message.error('导入许可证失败!');
    console.log('onError callback : ', file);
  }

  handleProvinceChange(value) {
    const data = cityData[value];
    this.setState({data, province: value, city: '', disabled: !data});
  }

  handleStateChange(value, actionType, item) {
    // console.log(value);
    // console.log(item);
    this.getCityList(item.code)
  }

  saveUploaderRef = (ref) => {
    console.log(123);
    this.uploaderRef = ref;
  };

  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };
  formChange1 = (value) => {
    console.log('value', value);
    this.setState({
      value1: value,
    });
  };

  validateAllFormField = () => {
    const {caseId, isEdit, actions, onClose} = this.props;

    this.refs.downloadProfile.validateAll((errors, values) => {
      // if (errors) {
      //   console.log({ errors });
      //   Message.error('提交失败');
      //   return;
      // }

      let val = {...values}

      delete val.host_id;
      // delete val.country;
      // delete val.state;
      // delete val.city;
      ajax.post(`/admin/license/download-profile`, val, {responseType: 'blob'}, true).then(res => {
        saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
        this.showProfile()
      })
    });
  };

  showProfile() {
    ajax.get('/license/show-profile').then(res => {
      const {value1} = this.state;
      if (Object.keys(res.data).length === 1) {
        value1.host_id = res.data.host_id;
        value1.plan = 'Trival';
        delete value1.customer;
      } else {
        let country = '', state = '', city = '';
        res.data.holder.split(',').forEach(item => {
          let arr = item.trim().split('=');
          if (arr[0] == 'C') {
            country = arr[1]
          } else if (arr[0] == 'ST') {
            state = arr[1]
          } else if (arr[0] == 'L') {
            city = arr[1]
          }
        })
        value1.customer = res.data.subject;
        value1.plan = res.data.plan;
        value1.host_id = res.data.host_id;
        value1.country = country;
        value1.state = state;
        value1.city = city;
      }
      this.setState({value1: value1});
    })
  }


  unloadingLicenses() {
    ajax.get('/license/uninstall').then(res => {

      if (res.meta.success === true && res.meta.code == '200') {
        Message.success('卸载许可证成功!');

      } else {
        Message.error('卸载许可证失败!');
      }
      this.showProfile();
      this.getLicense();
    }).catch(err => {
      console.log(err);
      Message.error('卸载许可证失败!');
      this.showProfile();
      this.getLicense();
    })
  }

  getStateList() {
    this.props.actions.getStateLicense().then(res => {
      let arr = res.body.data[0];
      let stateData = [];
      let obj = {};
      for (let key in arr) {
        obj = {
          label: key,
          value: key,
          code: arr[key]
        }
        stateData.push(obj)
      }
      this.setState({stateData})
    })
  }

  getCityList(provinceCode) {
    this.props.actions.getCityLicense({provinceCode}).then(res => {
      const {value1} = this.state;
      let arr = res.body.data[0]
      let cityData = [];
      let obj = {};
      for (let key in arr) {
        obj = {
          label: key,
          value: key
        }
        cityData.push(obj)
      }
      value1.city = cityData[0].value;
      this.setState({cityData, value1})
    })
  }


  componentDidMount() {
    this.getLicense();
    this.showProfile();
    this.getStateList();
  }

  render() {
    const {data, disabled, province, city, showList} = this.state;
    return (
      <Tab style={{marginTop: '20px'}}>
        <Tab.Item title="导出参数" key="1">
          <IceContainer style={styles.container}>
            <IceFormBinderWrapper
              value={this.state.value1}
              onChange={this.formChange1}
              ref="downloadProfile"
            >
              <div style={styles.formContent}>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>客户名称</div>
                  <IceFormBinder
                    name="customer"
                    required
                    triggerType="onBlur"
                    message="客户名称不能为空"
                  >
                    <Input
                      placeholder="请输入客户名称"
                      name="num"
                      style={{width: '400px'}}
                    />
                  </IceFormBinder>
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
                          dataSource={this.state.provinceData}
                          style={{width: '130px'}}
                        />
                      </IceFormBinder>
                      <IceFormBinder
                        name="state"
                      >
                        <Select
                          placeholder="省"
                          dataSource={this.state.stateData}
                          onChange={this.handleStateChange}
                          style={{width: '130px'}}
                        />
                      </IceFormBinder>
                      <IceFormBinder
                        name="city"
                      >
                        <Select
                          placeholder="市"
                          dataSource={this.state.cityData}
                          style={{width: '130px'}}
                          // dataSource={data}
                          // value={city}
                          // onChange={this.handleCityChange}
                          // disabled
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
                    triggerType="onBlur"
                    message="购买计划不能为空"
                  >
                    <Select
                      placeholder=""
                      style={{width: '400px'}}
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
                  <div style={styles.formLabel}>机器编码</div>
                  <IceFormBinder
                    name="host_id"
                    required
                    triggerType="onBlur"
                    message="机器编码不能为空"
                  >
                    <Input
                      placeholder="请输入机器编码"
                      name="short_num"
                      style={{width: '400px'}}
                      readOnly
                    />
                  </IceFormBinder>
                  {/* <IceFormError name="short_num" style={styles.formError}/> */}
                </div>
                <div style={{...styles.formItem, visibility: 'hidden'}}>
                  <div style={styles.formLabel}>到期时间</div>
                  <IceFormBinder
                    name="到期时间"
                    required
                    triggerType="onBlur"
                    message="到期时间"
                  >
                    <DatePicker
                      style={{width: '400px'}}
                    />
                  </IceFormBinder>
                  {/* <IceFormError name="network" style={styles.formError}/> */}
                </div>
                <div style={{textAlign: 'right', marginRight: '10px'}}>
                  <Button
                    type="primary"
                    style={styles.submitButton}
                    onClick={this.validateAllFormField}
                  >
                    导出许可证参数
                  </Button>
                  <Button
                    type="secondary"
                    style={styles.submitButton2}
                    onClick={this.props.onClose}
                  >
                    重置
                  </Button>
                </div>
              </div>
            </IceFormBinderWrapper>
          </IceContainer>
        </Tab.Item>
        <Tab.Item title="导入许可证" key="2">
          <div style={{
            textAlign: 'center',
            minHeight: '350px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {
              showList ? (
                <IceContainer style={styles.container}>
                  <IceFormBinderWrapper
                    value={this.state.value}
                    onChange={this.formChange}
                    ref="form"
                  >
                    <div style={styles.formContent}>
                      <div style={styles.formItem}>
                        <div style={styles.formLabel}>客户名称</div>
                        <IceFormBinder
                          name="subject"
                          required
                          triggerType="onBlur"
                          message=""
                        >
                          <Input
                            placeholder='请输入客户名称'
                            style={{width: '400px'}}
                            readOnly
                          />
                        </IceFormBinder>
                        {/* <IceFormError name="num" style={styles.formError}/> */}
                      </div>
                      <div style={styles.formItem}>
                        <div style={styles.formLabel}>客户地址</div>
                        <IceFormBinder
                          name="客户地址"
                          required
                          triggerType="onBlur"
                          message="长号不能为空"
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
                                style={{width: '130px'}}
                              />
                            </IceFormBinder>
                            <IceFormBinder
                              name="state"
                            >
                              <Select
                                placeholder="省"
                                style={{width: '130px'}}
                              />
                            </IceFormBinder>
                            <IceFormBinder
                              name="city"
                            >
                              <Select
                                placeholder="市"
                                style={{width: '130px'}}
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
                          triggerType="onBlur"
                          message="短号不能为空"
                          readOnly
                        >
                          <Select
                            placeholder=""
                            style={{width: '400px'}}
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
                          style={{width: '400px', textAlign: 'left'}}
                          value={this.state.value.features}
                          readOnly
                        >
                          <Option value="pbills">话单系统</Option>
                          <Option value="bbills">账单系统</Option>
                        </Select>
                        {/* <IceFormError name="short_num" style={styles.formError}/> */}
                      </div>
                      <div style={styles.formItem}>
                        <div style={styles.formLabel}>机器编码</div>
                        <IceFormBinder
                          name="host_id"
                          required
                          triggerType="onBlur"
                          message="短号不能为空"
                        >
                          <Input
                            placeholder="请输入机器编码"
                            style={{width: '400px'}}
                            readOnly
                          />
                        </IceFormBinder>
                        {/* <IceFormError name="short_num" style={styles.formError}/> */}
                      </div>
                      <div style={styles.formItem}>
                        <div style={styles.formLabel}>已用数目</div>
                        {/*<IceFormBinder*/}
                        {/*name="consumer_amount"*/}
                        {/*required*/}
                        {/*>*/}
                        {/*<Input*/}
                        {/*// placeholder="请输入数目"*/}
                        {/*style={{width: '400px'}}*/}
                        {/*// onChange={this.onChange}*/}
                        {/*/>*/}
                        {/*</IceFormBinder>*/}
                        <Range tooltipVisible defaultValue={this.state.value.acct_consumed} max={this.state.value.acct_limit}
                               disabled marks={1} style={{width: '400px'}}/>
                        {/* <IceFormError name="num" style={styles.formError}/> */}
                      </div>
                      <div style={styles.formItem}>
                        <div style={styles.formLabel}>到期时间</div>
                        <IceFormBinder
                          name="not_after"
                          required
                          triggerType="onBlur"
                          message="到期时间"
                        >
                          <Input
                            style={{width: '400px'}}
                            readOnly
                          />
                        </IceFormBinder>
                        {/* <IceFormError name="network" style={styles.formError}/> */}
                      </div>
                      <div style={{
                        textAlign: 'right',
                        marginRight: '10px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                      }}>
                        <Upload
                          name="upload"
                          action={`${ajax.baseUrl}/admin/license/install`}
                          accept=".xls, .xlsx, .csv, .txt, .zip, .dat"
                          listType="text"
                          limit={1}
                          headers={{'X-Requested-With': null}}
                          onSuccess={this.onSuccess}
                          onError={this.onError}
                          withCredentials
                          style={{display: 'inline-block'}}
                        >
                          <Button
                            type="primary"
                            style={styles.submitButton}
                            disabled={this.state.showList}
                          >
                            导入许可证
                          </Button>
                        </Upload>
                        <Button
                          type="primary"
                          style={styles.submitButton}
                          onClick={this.unloadingLicenses}
                        >
                          卸载许可证
                        </Button>
                        <Button
                          type="secondary"
                          style={styles.submitButton2}
                          onClick={this.props.onClose}
                        >
                          升级购买计划
                        </Button>
                      </div>
                    </div>
                  </IceFormBinderWrapper>
                </IceContainer>
              ) : (
                <div style={{marginTop: '20px'}}>
                  <Form field={this.field}>
                    <FormItem style={{marginBottom: 0}}>
                      <Upload.Dragger
                        name="upload"
                        action={`${ajax.baseUrl}/admin/license/install`}
                        accept=".bin"
                        listType="text"
                        limit={1}
                        headers={{'X-Requested-With': null}}
                        onSuccess={this.onSuccess}
                        onError={this.onError}
                        withCredentials
                      >
                        <div className="next-upload-drag" style={{
                          width: '500px',
                          height: '250px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center'
                        }}>
                          <p className="next-upload-drag-icon">
                            <FontAwesomeIcon icon={faUpload} size="4x"/>
                          </p>
                          <p className="next-upload-drag-text">点击或者拖动文件到虚线框内上传</p>
                          <p className="next-upload-drag-hint">
                            仅支持.bin
                          </p>
                        </div>
                        <Button type="primary" style={{marginTop: '20px'}}>上传</Button>
                      </Upload.Dragger>
                    </FormItem>
                  </Form>
                </div>
              )
            }

          </div>
        </Tab.Item>
      </Tab>
    );
  }
}

const styles = {
  container: {
    marginBottom: 0,
    width: '100%',
  },
  formContent: {
    maxWidth: '500px',
    margin: '10px auto',
  },
  formItem: {
    marginBottom: '25px',
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
    marginLeft: '10px',
  },
  submitButton2: {
    marginLeft: '15px',
  },
};

export default connect(
  // mapStateToProps
  state => ({
    licenses: state.licenses,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(LocalLicenseList);
