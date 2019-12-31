import React, { Component } from 'react';
import { connect } from 'react-redux';
import IceContainer from '@icedesign/container';
import IceLabel from '@icedesign/label';
import { bindActionCreators } from 'redux';
import {
  Dialog,
  Input,
  Button,
  Message,
  Select,
} from '@alifd/next';
import { CirclePicker } from 'react-color';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons/index';
import moment from 'moment';
import { actions } from '../../../../bbStores/TrxLocLabels';
import labelColorsConfig from '../../../../labelColorsConfig';
import { CN_PHONE_NUM_RULE } from '../../../../fieldConstraints';
import ajaxs from '../../../../utils/ajax';

const currentDate = moment();
const colors = labelColorsConfig.colors;

class TrxLocLabelsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        marker_color: colors[0],
        color_order: 1,
      },
      label: '户名标注',
      banks: []
    };
  }

  formChange = (values) => {
    // console.log('values', values);
    // this.setState({
    //   values,
    // });
  };

  fetchBanks = () => {
    ajaxs.get(`/utils/banks`).then(res => {
      if (res.meta.success) {
        this.setState({
          banks: res.data
        })
      }
    })
  }


  validateAllFormField = () => {
    const { caseId, isEdit, actions, onClose } = this.props;

    this.refs.form.validateAll((errors, values) => {
      // if (errors) {
      //   console.log({ errors });
      //   Message.error('提交失败');
      //   return;
      // }
      values = Object.assign({}, values);
      if (values.teller_code === '') {
        delete values.teller_code
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
                  res.body.data.ptags = JSON.stringify(res.body.data.ptags);
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
        if (values.ptags) {
          values.ptags = JSON.stringify(values.ptags);
        }
        actions.createTrxLocLable({ ...values, caseId })
          .then(res => {
            if (res.status === 'resolved' && res.res.body.meta.success) {
              values.id = res.body.id;
              if (values.ptags) {
                values.ptags = JSON.parse(values.ptags);
              }
              this.setState({
                values,
              });
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
      onClose && onClose();
    });
  };

  changeColor(color) {
    const values = this.state.values;
    values.marker_color = color.hex;
    values.color_order = colors.indexOf(color.hex) + 1;
    this.setState({
      values,
    });
  }


  componentDidMount() {
    this.fetchBanks();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isEdit && this.props.isEdit !== prevProps.isEdit) {
      this.setState({
        values: { ...this.state.values, ...this.props.trxLocLable },
      });
    } else if (!this.props.isEdit && this.state.values.id) {
      this.setState({
        values: {
          marker_color: colors[0],
          color_order: 1,
        },
      })
    }
  }

  componentWillUnmount() {

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
          title={`${this.props.isEdit ? '编辑' : '添加'}网点标注`}
        >
          <IceContainer style={styles.container}>
            <IceFormBinderWrapper
              value={this.state.values}
              onChange={this.formChange}
              ref="form"
            >
              <div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>机构号</div>
                  <IceFormBinder
                    name="branch_num"
                  >
                    <Input
                      name="branch_num"
                      style={{ width: '100%' }}
                    />
                  </IceFormBinder>
                  {/* <IceFormError name="started_at" style={styles.formError} /> */}
                </div>
                <div style={styles.formItem}>
                  <div style={{ ...styles.formLabel }}>柜员号</div>
                  <IceFormBinder
                    name="teller_code"
                  >
                    <Input
                      name="teller_code"
                      style={{ width: '100%' }}
                    />
                  </IceFormBinder>
                </div>
                <div style={styles.formItem}>
                  <div style={{ ...styles.formLabel }}>银行</div>
                  <IceFormBinder
                    name="bank_name"
                  >
                    <Select
                      showSearch
                      useVirtual
                      style={{ width: '100%' }}
                    >
                      {
                            this.state.banks.map(bank => {
                              return (
                                <Option key={bank.bank_code}
                                  value={`${bank.bank_code},${bank.bank_name}`}
                                >{bank.bank_name}
                                </Option>
                              );
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
                  >
                    <Select aria-label="tag mode"
                      mode="tag"
                      style={{ width: '100%' }}
                      hasArrow={false}
                      visible={false}
                    />
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
                      rows={5}
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
                  <FontAwesomeIcon icon={faMapMarkerAlt}
                    style={{ color: this.state.values.marker_color, marginRight: '-10px' }}
                    size="2x"
                  />
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
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  formLabel: {
    width: '70px',
    flex: '0 0 70px',
    marginRight: '15px',
    textAlign: 'right',
  },
  formError: {
    position: 'absolute',
    top: '35px',
    left: '95px',
    color: '#f76048',
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
    trxLocLables: state.trxLocLables,
    trxLocLable: state.trxLocLables.item,
    caseId: state.cases.case.id,
    login: state.login,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(TrxLocLabelsForm);
