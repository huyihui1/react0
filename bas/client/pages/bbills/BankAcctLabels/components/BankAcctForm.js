import React, {Component} from 'react';
import {connect} from 'react-redux';
import IceContainer from '@icedesign/container';
import IceLabel from '@icedesign/label';
import {bindActionCreators} from 'redux';
import {
  Dialog,
  Input,
  Button,
  Message,
  Select,
} from '@alifd/next';
import {CirclePicker} from 'react-color';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import moment from 'moment';
import {actions} from '../../../../bbStores/bankAcctLabels';
import labelColorsConfig from '../../../../labelColorsConfig';
import {CN_PHONE_NUM_RULE} from "../../../../fieldConstraints";

const currentDate = moment();
const colors = labelColorsConfig.colors;

class BankAcctForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        label_bg_color: colors[0],
        label_txt_color: '#fff',
        color_order: 1,
      },
      label: '户名标注'
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

      if (values.id) {
        Message.loading({
          title: '修改中...',
          duration: 0,
        });
        values.ptags = JSON.stringify(values.ptags);
        actions.updateBankAcct({ ...values, caseId, itemId: values.id })
          .then(res => {
            if (res.status === 'resolved' && res.body.meta && res.body.meta.success) {
              Message.success('修改成功...');
              actions.setBankAcct(res.body.data);
              this.props.bankAcctLables.items.forEach((item, index) => {
                if (item.id === res.body.data.id) {
                  console.log(res.body.data.ptags);
                  // res.body.data.ptags = JSON.stringify(res.body.data.ptags);
                  this.props.bankAcctLables.items[index] = res.body.data;
                  actions.setItemsBankAcct(this.props.bankAcctLables.items);
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
        actions.createBankAcct({ ...values, caseId })
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
      onClose && onClose();
    });
  };

  changeColor(color) {
    const values = this.state.values;
    values.label_bg_color = color.hex;
    values.color_order = colors.indexOf(color.hex) + 1;
    this.setState({
      values,
    });
  }



  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (this.props.isEdit && this.props.isEdit !== prevProps.isEdit) {
      this.setState({
        values: {...this.state.values, ...this.props.bankAcctLable}
      })
    } else if (!this.props.isEdit && this.state.values.id) {
      this.setState({
        values: {
          label_bg_color: colors[0],
          label_txt_color: '#fff',
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
          title={`${this.props.isEdit ? '编辑' : '添加'}账户标注`}
        >
          <IceContainer style={styles.container}>
            <IceFormBinderWrapper
                        value={this.state.values}
                        onChange={this.formChange}
                        ref="form"
                      >
              <div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>账号</div>
                  <IceFormBinder
                    name="bank_acct"
                    // triggerType="onBlur"
                  >
                    <Input
                      name="bank_acct"
                      style={{ width: '100%' }}
                    />
                  </IceFormBinder>
                  {/* <IceFormError name="started_at" style={styles.formError} /> */}
                </div>
                <div style={styles.formItem}>
                  <div style={{ ...styles.formLabel}}>卡号</div>
                  <IceFormBinder
                    name="card_num"
                    // triggerType="onBlur"
                  >
                    <Input
                      name="card_num"
                      style={{ width: '100%' }}
                    />
                  </IceFormBinder>
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>户名标注</div>
                  <IceFormBinder
                    name="label"
                    getFieldValue={(data) => {
                      this.setState({
                        label: data
                      })
                      return data
                    }}
                    // triggerType="onBlur"
                  >
                    <Input />
                  </IceFormBinder>
                  <IceLabel
                    style={{
                      fontSize: '14px',
                      marginLeft: '10px',
                      backgroundColor: this.state.values.label_bg_color,
                      color: '#fff',
                    }}
                  >
                    {this.state.label || '户名标注'}
                  </IceLabel>
                  {/* <IceFormError name="started_at" style={styles.formError} /> */}
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>标注背景</div>
                  <IceFormBinder
                    name="label_bg_color"
                    triggerType="onBlur"
                    message="标注背景色不能为空"
                  >
                    <CirclePicker
                      width="340px"
                      colors={colors}
                      circleSize={24}
                      color={this.state.values.label_bg_color}
                      onChangeComplete={(color) => {
                        this.changeColor(color);
                      }}
                    />
                  </IceFormBinder>
                  {/* <IceFormError name="color" style={styles.formError} /> */}
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
                <div style={{ ...styles.formItem }}>
                  <div style={styles.formLabel}>备注</div>
                  <IceFormBinder
                    name="memo"
                    // triggerType="onBlur"
                  >
                    <Input.TextArea
                      rows={5}
                      style={{ width: '100%' }}
                    />
                  </IceFormBinder>
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
    position: 'relative'
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
    bankAcctLables: state.bankAcctLables,
    bankAcctLable: state.bankAcctLables.item,
    caseId: state.cases.case.id,
    login: state.login
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(BankAcctForm);
