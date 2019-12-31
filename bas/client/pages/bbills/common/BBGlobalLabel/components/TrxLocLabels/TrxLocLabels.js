/* eslint react/no-string-refs:0 */
import React, { Component, Fragment } from 'react';
import IceContainer from '@icedesign/container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { CirclePicker } from 'react-color';
import {
  Input,
  Button,
  Message,
  Select,
  Tab,
  Loading,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import MapComponent from '../../../../../common/MapComponent'
import TellerList from './components/TellerList'
import TellerLabels from './components/TellerLabels'
import TellerCodesLabels from './components/TellerCodesLabels'


import labelColorsConfig from '../../../../../../labelColorsConfig';
import appConfig from '../../../../../../appConfig';
import ajaxs from '../../../../../../utils/ajax';
import {actions} from '../../../../../../bbStores/TrxLocLabels'
// import './style.css';

const colors = labelColorsConfig.colors;
const { Option } = Select;

class TrxLocLabels extends Component {
  static displayName = 'TrxLocLabels';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      values: {
        marker_color: colors[0],
        color_order: 1,
        ptags: []
      },
      activeTabKey: 0,
      banks: [],
      visible: true
    };

  }

  formChange = (values) => {
    // console.log('values', values);
    // this.setState({
    //   values,
    // });
  };





  validateAllFormField = () => {
    const { caseId, isEdit, actions, onClose } = this.props;

    this.refs.form.validateAll((errors, values) => {
      // if (errors) {
      //   console.log({ errors });
      //   Message.error('提交失败');
      //   return;
      // }
      values = Object.assign({}, values);
      delete values.network;
      delete values.short_num;
      if (values.bank_name) {
        let bank = values.bank_name.split(',')
        values.bank_name = bank[1];
        values.bank_code = bank[0];
      }
      if (values.id) {
        Message.loading({
          title: '修改中...',
          duration: 0,
        });
        values.ptags = JSON.stringify(values.ptags);
        actions.updateTrxLocLable({ ...values, caseId, itemId: values.id })
          .then(res => {
            if (res.status === 'resolved' && res.body.meta && res.body.meta.success) {
              Message.success('修改成功...');
              actions.setTrxLocLable(res.body.data);
              this.props.trxLocLables.items.forEach((item, index) => {
                if (item.id === res.body.data.id) {
                  // res.body.data.ptags = JSON.stringify(res.body.data.ptags);
                  this.props.trxLocLables.items[index] = res.body.data;
                  actions.setItemsTrxLocLable(this.props.trxLocLables.items);
                }
              });
            } else {
              Message.error('修改失败...');
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
        values.ptags = JSON.stringify(values.ptags);
        actions.createTrxLocLable({ ...values, caseId })
          .then(res => {
            if (res.status === 'resolved' && res.res.body.meta.success) {
              values.id = res.body.id;
              values.ptags = JSON.parse(values.ptags)
              this.setState({
                values,
              })
              Message.success('添加成功...');
            } else {
              Message.error('添加失败...');
            }
            console.log(res);
          })
          .catch(err => {
            Message.error('添加失败...');
            console.log(err);
          });
      }
      // onClose && onClose();
    });
  };

  changeColor = (color) => {
    const values = this.state.values;
    values.marker_color = color.hex;
    values.color_order = colors.indexOf(color.hex) + 1;
    this.setState({
      values,
    });
  }



  componentDidMount() {
    this.fetchBanks();
    this.fetchData();
  }

  componentDidUpdate(prevProps) {

  }

  componentWillUnmount() {

  }

  onTabChange = (key) => {
    this.setState({ activeTabKey: key });
  }

  fetchBanks = () => {
    ajaxs.get(`/utils/banks`).then(res => {
      if (res.meta.success) {
        this.setState({
          banks: res.data
        })
      }
    })
  }

  fetchData = () => {
    ajaxs.post(`/cases/${this.props.caseId}/trx_loc_labels/show`, {...this.props.activeItem}).then(res => {
      if (res.meta.success) {
        let values = {...this.state.values, ...this.props.activeItem}
        if (res.data.id) {
          res.data.ptags = JSON.parse(res.data.ptags)
          res.data.bank_name = res.data.bank_code + ',' + res.data.bank_name;
          values = {...this.state.values, ...res.data}
        }
        this.setState({
          values,
          visible: false
        })
      }
    }).catch(err => {
      console.log(err);
    })
  }


  render() {
    const { labelGroup, activeTabKey, visible  } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <IceContainer style={styles.left}>
            <IceFormBinderWrapper
              value={this.state.values}
              onChange={this.formChange}
              ref="form"
            >
              <div className="d-flex" style={{ justifyContent: 'space-between' }}>
                <div className="item-flex-6" style={{overflow: 'hidden', flex: 0.95}}>
                  <MapComponent code={''} ctLabel={{}} />
                </div>
                <div className="item-flex-4 chartCard" style={{ ...styles.formContent, marginTop: '0' }}>
                  <Loading visible={visible} style={{width: '100%'}}>
                    <div style={styles.formItem}>
                      <div style={styles.formLabel}>机构号</div>
                      <IceFormBinder
                        name="branch_num"
                        // triggerType="onBlur"
                      >
                        <Input
                          name="branch_num"
                          readOnly
                          style={{ width: '100%' }}
                        />
                      </IceFormBinder>
                      {/* <IceFormError name="started_at" style={styles.formError} /> */}
                    </div>
                    <div style={styles.formItem}>
                      <div style={{ ...styles.formLabel}}>柜员号</div>
                      <IceFormBinder
                        name="teller_code"
                        // triggerType="onBlur"
                      >
                        <Input
                          name="teller_code"
                          readOnly
                          style={{ width: '100%' }}
                        />
                      </IceFormBinder>
                    </div>
                    <div style={styles.formItem}>
                      <div style={{ ...styles.formLabel}}>银行</div>
                      <IceFormBinder
                        name="bank_name"
                        // triggerType="onBlur"
                      >
                        <Select
                          showSearch
                          useVirtual
                          style={{ width: '100%' }}
                        >
                          {
                            this.state.banks.map(bank => {
                              return (
                                <Option key={bank.bank_code} value={bank.bank_code + ',' + bank.bank_name}>{bank.bank_name}</Option>
                              )
                            })
                          }
                        </Select>
                      </IceFormBinder>
                    </div>
                    <div style={styles.formItem}>
                      <div style={styles.formLabel}>标注名称</div>
                      <IceFormBinder
                        name="label"
                        required
                        triggerType="onBlur"
                        message="标注名称不能为空"
                      >
                        <Input
                          placeholder="请输入标注名称"
                          name="label"
                          style={{ width: '400px' }}
                        />
                      </IceFormBinder>
                      <div style={styles.formError}>
                        <IceFormError name="label" />
                      </div>
                    </div>
                    <div style={{ ...styles.formItem }}>
                      <div style={styles.formLabel}>标签</div>
                      <IceFormBinder
                        name="ptags"
                        // triggerType="onBlur"
                      >
                        <Select aria-label="tag mode" mode="tag" style={{ width: '100%' }} hasArrow={false} visible={false} />
                      </IceFormBinder>
                      {/* <IceFormError name="started_at" style={styles.formError} /> */}
                    </div>
                    <div style={styles.formItem}>
                      <div style={styles.formLabel}>备注</div>
                      <IceFormBinder
                        name="memo"
                        triggerType="onBlur"
                      >
                        <Input.TextArea
                          placeholder="请输入备注"
                          name="memo"
                          rows={7}
                          style={{ width: '400px' }}
                        />
                      </IceFormBinder>
                      <div style={styles.formError}>
                        <IceFormError name="memo" />
                      </div>
                    </div>
                    <div style={styles.formItem}>
                      <div style={styles.formLabel}>图钉颜色</div>
                      <IceFormBinder
                        name="marker_color"
                        required
                        triggerType="onBlur"
                        message="图钉不能为空"
                      >
                        <CirclePicker
                          width="340px"
                          circleSize={24}
                          colors={colors}
                          color={this.state.values.marker_color}
                          onChangeComplete={this.changeColor}
                        />
                      </IceFormBinder>
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: this.state.values.marker_color, marginRight: '-10px' }} size="2x" />
                      <div style={styles.formError}>
                        <IceFormError name="label_icon" />
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Button
                        type="primary"
                        style={styles.submitButton}
                        onClick={this.validateAllFormField}
                      >
                        更新标注
                      </Button>
                      <Button type="secondary" style={{ marginLeft: '10px' }} onClick={() => { this.props.onClose(this.props.index); }}>关闭</Button>
                    </div>
                  </Loading>
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Tab shape="wrapped" unmountInactiveTabs activeKey={activeTabKey} onChange={this.onTabChange}>
                  <Tab.Item title="网点概况" key={0}>
                    <div style={{ height: '500px' }}>
                      <TellerList styles={{height: '90%'}} title={`网点概况`} activeItem={this.props.activeItem} />
                    </div>
                  </Tab.Item>
                  <Tab.Item title="机构标注" key={1}>
                    <div style={{ height: '500px' }}>
                      <TellerLabels styles={{height: '90%'}} title={`机构标注`} activeItem={this.props.activeItem} />
                    </div>
                  </Tab.Item>
                  <Tab.Item title="柜员标注" key={2}>
                    <div style={{ height: '500px' }}>
                      <TellerCodesLabels styles={{height: '90%'}} title={`柜员标注`} activeItem={this.props.activeItem} />
                    </div>
                  </Tab.Item>
                </Tab>
              </div>

            </IceFormBinderWrapper>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  left: {
    marginBottom: 0,
    paddingTop: 0,
    height: '100%',
    display: 'inline-block',
    width: '100%',
    padding: 0,
    overflow: 'initial',
  },
  table: {
    // margin: '10px 0 20px',
  },
  bottom: {
    display: 'inline-block',
    width: '100%',
    height: '100%',
  },
  formContent: {
    flex: '0 0 450px',
    width: '40%',
    padding: '10px',
  },
  formItem: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
  },
  formLabel: {
    width: '70px',
    flex: '0 0 70px',
    marginRight: '15px',
    textAlign: 'right',
  },
};


export default connect(
  // mapStateToProps
  state => ({
    trxLocLables: state.trxLocLables,
    labelPN: state.trxLocLables.LargItems,
    caseId: state.cases.case.id,
    // citizens: state.citizens,
    login: state.login,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions, }, dispatch),
  }),
)(TrxLocLabels);
