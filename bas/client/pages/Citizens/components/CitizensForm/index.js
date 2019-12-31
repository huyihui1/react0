import React, { Component } from 'react';
import { connect } from 'react-redux';
import IceContainer from '@icedesign/container';
import { bindActionCreators } from 'redux';
import {
  Dialog,
  Input,
  Button,
  Message,
  Radio,
  Grid,
  Select,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { actions } from '../../../../stores/citizens';

const { Row, Col } = Grid;
const Option = Select.Option;

const keyMap = [
  '办电',
  '手机',
  '短号',
  '宅电',
  '手机3',
  '办电2',
  '区县',
  '区号',
  'ven_name',
  'formater',
  'scan'
];

class CitizensForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        scan: '',
        category: 'g',
        formater: 0,
        citizen_phones: [],
        citizen_addresses: [],
      },
      activeIndex: 0,
    };
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };
  validateAllFormField = () => {
    const { caseId, isEdit, actions, onClose } = this.props;

    this.refs.form.validateAll((errors, values) => {
      // if (errors) {
      //   console.log({ errors });
      //   Message.error('提交失败');
      //   return;
      // }
      if (isEdit) {
        // Message.loading({
        //   title: '修改中...',
        //   duration: 0,
        // });
        // actions.updateCaseEvent({ ...values, caseId, itemId: values.id })
        //   .then(res => {
        //     if (res.status === 'resolved') {
        //       Message.success('修改成功...');
        //     }
        //   })
        //   .catch(err => {
        //     Message.error('修改失败...');
        //     console.log(err);
        //   });
      } else {
        Message.loading({
          title: '添加中...',
          duration: 0,
        });
        if (values.区县 || values.company) {
          values.citizen_addresses.push({
            loc: (values.区县 || '') + (values.company || ''),
            area_code: values.区号 || '',
            memo: '单位地址'
          })
        }
        if (values['办电']) {
          values.citizen_phones.push({
            num: values['办电'],
            memo: '办电',
          });
        }
        if (values['宅电']) {
          values.citizen_phones.push({
            num: values['宅电'],
            memo: '宅电',
          });
        }
        if (values['手机']) {
          values.citizen_phones.push({
            num: values['手机'],
            memo: '手机',
          });
        }
        if (values['手机3']) {
          values.citizen_phones.push({
            num: values['手机3'],
            memo: '手机3',
          });
        }
        if (values['短号']) {
          values.citizen_phones.push({
            num: values['短号'],
            ven_name: null,
            memo: '短号',
          });
        }
        if (values.ven_name) {
          if (values.短号) {
            for (let i = 0; i < values.citizen_phones.length; i++) {
              const citizen_phones = values.citizen_phones[i];
              if (citizen_phones.memo === '短号') {
                citizen_phones.ven_name = values.ven_name;
                break;
              }
            }
          } else {
            for (let i = 0; i < values.citizen_phones.length; i++) {
              const citizen_phones = values.citizen_phones[i];
              if (citizen_phones.memo === '短号') {
                values.citizen_phones.splice(i, 1);
              }
            }
          }
        } else {
          for (let i = 0; i < values.citizen_phones.length; i++) {
            const citizen_phones = values.citizen_phones[i];
            if (citizen_phones.memo === '短号') {
              values.citizen_phones.splice(i, 1);
            }
          }
        }
        let params = this.formatValues(values)
        console.log(params);
        actions.createManinputCitizen(params)
          .then(res => {
            if (res.body.meta.success) {
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

  formatValues = (val) => {
    let newVal = {};
    for (const k in val) {
      if (keyMap.indexOf(k) === -1) {
        newVal[k] = val[k];
      }
    }
    return newVal
  };

  onKeyUp(e) {
    let { value, activeIndex } = this.state;
    if (e.keyCode === 13) {
      const inputVal = value.scan.replace(/(^\s*)|(\s*$)/g, '').replace(/\s+/g, ' ').split(' ');
      value = { ...value, citizen_phones: [], 办电: '', 宅电: '', 手机: '', 手机3: '', 短号: '', 办电2: '' };
      value.name = inputVal[0];
      if (inputVal.length >= 2) {
        if (inputVal[1]) {
          // 职务汉字纠错
          value.position = this.formatZhiWu(inputVal[1]);
        }
      }
      this.handleFormater(value, inputVal);
      // value[arr[activeIndex]] = value.scan;
    }
  }
  formatZhiWu = (value) => {
    let hz = value.replace(/[^（）()、\u4e00-\u9fa5]/gi, '');
    hz = hz.replace(/丰任$/, '主任');
    return hz;
  }
  handleFormater = (value, inputVal) => {
    let result = null;
    const digit_reg = /\d+/;
    let value1 = inputVal.join(' ').replace(/['‘.。 -]/g, '');
    value1 = value1.replace(/^、/, '');
    const digits_result = value1.match(digit_reg);
    let digits = '';
    if (digits_result) {
      digits = digits_result[0];
    }

    if (digits != '') {
      if (value.formater === 0) {
        const myReg1 = /^([2-9]\d{7})?([2-9]\d{7})?(1[3458]\d{9})?([56]\d{5})?$/;
        const myReg2 = /^([2-9]\d{7})?(1[3458]\d{9})?(1[3458]\d{9})?([56]\d{5})?$/;
        result = digits.match(myReg1);
        if (result) {
          if (result[1] != undefined) {
            value['办电'] = result[1];

          } else {
            value['办电'] = '';
          }
          if (result[2] != undefined) {
            value['宅电'] = result[2];

          } else {
            value['宅电'] = '';
          }
          if (result[3] != undefined) {
            value['手机'] = result[3];
          } else {
            value['手机'] = '';
          }
          if (result[4] != undefined) {
            value['短号'] = result[4];
          } else {
            value['短号'] = '';
          }
        } else {
          result = digits.match(myReg2);
          if (result) {
            if (result[1] != undefined) {
              value['办电'] = result[1];
              value.citizen_phones.push({
                num: result[1],
                memo: '办电',
              });
            } else {
              value['办电'] = '';
            }
            if (result[2] != undefined) {
              value['手机3'] = result[2];
            } else {
              value['手机3'] = '';
            }
            if (result[3] != undefined) {
              value['手机'] = result[3];
              value.citizen_phones.push({
                num: result[3],
                memo: '手机',
              });
            } else {
              value['手机'] = '';
            }
            if (result[4] != undefined) {
              value['短号'] = result[4];
            } else {
              value['短号'] = '';
            }
          } else {
            Message.warning('无法解析数字串');
          }
        }
      } else if (value.formater === 1) {
        const myReg1 = /^([2-9]\d{7})?([2-9]\d{4})?([2-9]\d{7})?(1[3458]\d{9})?([56]\d{5})?$/;
        result = digits.match(myReg1);
        if(result) {
          if (result[1] != undefined) {
            value['办电'] = result[1];
          } else {
            value['办电'] = '';
          }
          if (result[3] != undefined) {
            value['宅电'] = result[3];
          } else {
            value['宅电'] = '';
          }
          if (result[4] != undefined) {
            value['手机'] = result[4];
          } else {
            value['手机'] = '';
          }
          if (result[5] != undefined) {
            value['短号'] = result[5];
          } else {
            value['短号'] = '';
          }
        } else {
          Message.warning('无法解析数字串');
        }
      } else if (value.formater === 2) {
        var myReg2 = /^([2-9]\d{7})?(1[3458]\d{9})?([56]\d{5})?$/;
        result = digits.match(myReg2);
        if(result) {
          if (result[1] != undefined) {
            value['宅电'] = result[1];
          } else {
            value['宅电'] = '';
          }
          if (result[2] != undefined) {
            value['手机'] = result[2];
          } else {
            value['手机'] = '';
          }
          if (result[3] != undefined) {
            value['短号'] = result[3];
          } else {
            value['短号'] = '';
          }
        } else {
          Message.warning('无法解析数字串');
        }
      }
    }
    value.scan = '';
    this.setState({
      value,
      // activeIndex: activeIndex + 1 > 12 ? 12 : activeIndex + 1
    });
  }

  onFocus(index) {
    this.setState({
      activeIndex: index + 1,
    });
  }
  render() {
    return (
      <Dialog
        className="citizensForm"
        visible={this.props.visible}
        onOk={this.props.onClose}
        closeable="esc,mask,close"
        onCancel={this.props.onClose}
        onClose={this.props.onClose}
        afterClose={() => {
          this.setState({
            value: {
              scan: '',
              category: 'g',
              formater: 0,
              citizen_phones: [],
              citizen_addresses: [],
            },
          });
        }}
        footer={false}
        title={`${this.props.isEdit ? '编辑' : '添加'}人员信息`}
      >
        <IceContainer style={styles.container}>
          <IceFormBinderWrapper
            value={this.props.isEdit && this.props.caseEvent ? this.props.caseEvent : this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formContent}>
              <div style={styles.formItem}>
                <IceFormBinder
                  name="scan"
                      // triggerType="onBlur"
                  message=""
                >
                  <Input
                    name="scan"
                    style={{ width: '100%' }}
                    onKeyUp={this.onKeyUp}
                    autoFocus

                  />
                </IceFormBinder>
                {/* <IceFormError name="started_at" style={styles.formError} /> */}
              </div>
              <div style={styles.formItem}>
                <IceFormBinder
                  name="formater"
                      // triggerType="onBlur"
                  message="不能为空"
                >
                  <Radio.Group
                    name="radio"
                    itemDirection={this.state.itemDirection}
                  >
                    <Radio value={0}>办公室+(宅电)+手机+(虚拟网)</Radio>
                    <Radio value={1}>办公室+(5位内线)+(宅电)+手机+(虚拟网)</Radio>
                    <Radio value={2}>宅电+手机+(虚拟网)</Radio>
                  </Radio.Group>
                </IceFormBinder>
                {/* <IceFormError name="ended_at" style={styles.formError} /> */}
              </div>
              <Row wrap gutter={40}>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>姓名</div>
                    <IceFormBinder
                      name="name"
                      required
                      triggerType="onBlur"
                      message="事件名称不能为空"
                    >
                      <Input
                        placeholder=""
                        name="name"
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>职务</div>
                    <IceFormBinder
                      name="position"
                      required
                      triggerType="onBlur"
                      message="职务不能为空"
                    >
                      <Input
                        placeholder=""
                        name="position"
                        onFocus={() => { this.onFocus(1); }}
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
              </Row>
              <Row wrap gutter={40}>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>办电</div>
                    <IceFormBinder
                      name="办电"
                      required
                      triggerType="onBlur"
                      message="事件名称不能为空"
                    >
                      <Input
                        name="办电"
                        onFocus={() => { this.onFocus(2); }}
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>手机</div>
                    <IceFormBinder
                      name="手机"
                      required
                      triggerType="onBlur"
                      message="职务不能为空"
                    >
                      <Input
                        name="手机"
                        onFocus={() => { this.onFocus(3); }}
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
              </Row>
              <Row wrap gutter={40}>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>短号</div>
                    <IceFormBinder
                      name="短号"
                      required
                      triggerType="onBlur"
                      message="事件名称不能为空"
                    >
                      <Input
                        name="短号"
                        onFocus={() => { this.onFocus(4); }}
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>宅电</div>
                    <IceFormBinder
                      name="宅电"
                      required
                      triggerType="onBlur"
                      message="职务不能为空"
                    >
                      <Input
                        name="宅电"
                        onFocus={() => { this.onFocus(5); }}
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
              </Row>
              <Row wrap gutter={40}>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>手机3</div>
                    <IceFormBinder
                      name="手机3"
                      required
                      triggerType="onBlur"
                      message="事件名称不能为空"
                    >
                      <Input
                        name="手机3"
                        onFocus={() => { this.onFocus(6); }}
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>办电2</div>
                    <IceFormBinder
                      name="办电2"
                      required
                      triggerType="onBlur"
                      message="职务不能为空"
                    >
                      <Input
                        name="办电2"
                        onFocus={() => { this.onFocus(7); }}
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
              </Row>
              <Row wrap gutter={40}>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>单位</div>
                    <IceFormBinder
                      name="company"
                      required
                      triggerType="onBlur"
                      message="事件名称不能为空"
                    >
                      <Input
                        name="单位"
                        onFocus={() => { this.onFocus(8); }}
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>人员类型</div>
                    <IceFormBinder
                      name="category"
                      required
                      triggerType="onBlur"
                      message="职务不能为空"
                    >
                      <Select style={{ width: '198px' }} name="category">
                        <Option value="g">g-国家公务人员</Option>
                        <Option value="b">b-企业人员</Option>
                        <Option value="j">j-国企人员</Option>
                        <Option value="z">z-一般人员</Option>
                      </Select>
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
              </Row>
              <Row wrap gutter={40}>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>区县</div>
                    <IceFormBinder
                      name="区县"
                      required
                      triggerType="onBlur"
                      message="事件名称不能为空"
                    >
                      <Input
                        name="区县"
                        onFocus={() => { this.onFocus(9); }}
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>区号</div>
                    <IceFormBinder
                      name="区号"
                      required
                      triggerType="onBlur"
                      message="职务不能为空"
                    >
                      <Input
                        name="区号"
                        onFocus={() => { this.onFocus(10); }}
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
              </Row>
              <Row wrap gutter={40}>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>版本号</div>
                    <IceFormBinder
                      name="version"
                      required
                      triggerType="onBlur"
                      message="事件名称不能为空"
                    >
                      <Input
                        name="版本号"
                        onFocus={() => { this.onFocus(11); }}
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
                <Col l="12">
                  <div style={styles.formItem}>
                    <div style={styles.formLabel}>虚拟网名</div>
                    <IceFormBinder
                      name="ven_name"
                      required
                      triggerType="onBlur"
                      message="虚拟网名不能为空"
                    >
                      <Input
                        name="虚拟网名"
                        onFocus={() => { this.onFocus(12); }}
                      />
                    </IceFormBinder>
                    {/* <IceFormError name="name" style={styles.formError} /> */}
                  </div>
                </Col>
              </Row>
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
    caseEvents: state.caseEvents,
    caseEvent: state.caseEvents.item,
    caseId: state.caseEvents.caseId,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(CitizensForm);
