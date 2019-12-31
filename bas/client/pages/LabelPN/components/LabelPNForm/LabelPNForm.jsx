/* eslint react/no-string-refs:0 */
import React, {Component} from 'react';
import IceContainer from '@icedesign/container';
import IceLabel from '@icedesign/label';
import {CirclePicker} from 'react-color';
import {
  Input,
  Button,
  Message,
  Select,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../../../stores/labelPN';
import labelColorsConfig from '../../../../labelColorsConfig';
import ajaxs from '../../../../utils/ajax';
import appConfig from '../../../../appConfig'

import './style.css';
import {CN_ANY_NUM_RULE} from "../../../../fieldConstraints";

const colors = labelColorsConfig.colors;
const {Option} = Select;

class LabelPNForm extends Component {
  static displayName = 'LabelPNForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        label_bg_color: colors[0],
        label_txt_color: '#fff',
        color_order: 1
      },
      labelGroup: [],
    };
    this.changeColor = this.changeColor.bind(this);
    this.fetchLabelGroup = this.fetchLabelGroup.bind(this);
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
        values.ptags = JSON.stringify(values.ptags);
        actions.updateLabelPN({...values, caseId, itemId: values.id})
          .then(res => {
            if (res.status === 'resolved' && res.body.meta && res.body.meta.success) {
              Message.success('修改成功...');
              actions.setLabelPN(res.body.data);
              this.props.labelPNs.items.forEach((item, index) => {
                if (item.id === res.body.data.id) {
                  // res.body.data.ptags = JSON.stringify(res.body.data.ptags);
                  this.props.labelPNs.items[index] = res.body.data;
                  actions.setItemsLabelPN(this.props.labelPNs.items)
                }
              })
              actions.fetchLabelPNs({caseId}, {
                query: {
                  page: this.props.current,
                  pagesize: appConfig.pageSize,
                },
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
        actions.createLabelPN({...values, caseId})
          .then(res => {
            if (res.status === 'resolved' && res.res.body.meta.success) {
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
    const value = this.state.value;
    value.label_bg_color = color.hex;
    value.color_order = colors.indexOf(color.hex) + 1;
    this.setState({
      value,
    });
  }

  fetchLabelGroup() {
    ajaxs.get(`/cases/${this.props.caseId}/pnum_labels/label-group`).then(res => {
      this.setState({
        labelGroup: res.data,
      });
    }).catch(err => {
      console.log(err);
    });
  }

  componentDidMount() {
    this.fetchLabelGroup();
    if (this.props.labelPN && this.props.labelPN.label_groups) {
      const label = [];
      this.props.labelPN.label_groups.forEach(item => {
        label.push(item);
      });
      this.props.labelPN.label_group_names = label;
    }
  }


  checkNum = (rule, values, callback) => {
    if (!values) {
      callback('标注号码不能为空')
    } else if (!CN_ANY_NUM_RULE.test(values)) {
      callback('请输入正确的格式')
    } else {
      callback()
    }
  };

  render() {
    return (
      <IceContainer style={styles.container}>
        <IceFormBinderWrapper
          value={this.props.isEdit && this.props.labelPN ? this.props.labelPN : this.state.value}
          onChange={this.formChange}
          ref="form"
        >
          <div style={styles.formContent}>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>标注号码</div>
              <IceFormBinder
                name="num"
                required
                // triggerType="onBlur"
                validator={this.checkNum}
              >
                <Input
                  placeholder="请输入标注号码"
                  name="num"
                  style={{width: '400px'}}
                />
              </IceFormBinder>
              <IceFormError name="num" style={styles.formError}/>
            </div>
            {/* <div style={styles.formItem}> */}
            {/* <div style={styles.formLabel}>短号</div> */}
            {/* <IceFormBinder */}
            {/* name="short_num" */}
            {/* required */}
            {/* triggerType="onBlur" */}
            {/* message="短号不能为空" */}
            {/* > */}
            {/* <Input */}
            {/* placeholder="请输入短号" */}
            {/* name="short_num" */}
            {/* style={{ width: '400px' }} */}
            {/* /> */}
            {/* </IceFormBinder> */}
            {/* <IceFormError name="short_num" style={styles.formError} /> */}
            {/* </div> */}
            <div style={styles.formItem}>
              <div style={styles.formLabel}>使用人员</div>
              <IceFormBinder
                name="label"
                required
                // triggerType="onBlur"
                message="使用人员不能为空"
              >
                <Input
                  placeholder="请输入标注名称"
                  name="label"
                  style={{width: '300px'}}
                />
              </IceFormBinder>
              <IceLabel
                style={{
                  fontSize: '14px',
                  marginLeft: '10px',
                  backgroundColor: this.props.isEdit && this.props.labelPN ? this.props.labelPN.label_bg_color : this.state.value.label_bg_color,
                  color: '#fff'
                }}
              >
                {this.props.isEdit && this.props.labelPN ? this.props.labelPN.label : this.state.value.label || '使用人员'}
              </IceLabel>
              <IceFormError name="label" style={styles.formError}/>
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>标注背景</div>
              <IceFormBinder
                name="color"
              >
                <CirclePicker
                  width="340px"
                  circleSize={24}
                  colors={colors}
                  color={this.props.isEdit && this.props.labelPN ? this.props.labelPN.label_bg_color : this.state.value.label_bg_color}
                  onChangeComplete={this.changeColor}
                />
              </IceFormBinder>
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>分类标签</div>
              <IceFormBinder
                name="label_group_names"
              >
                <Select mode="tag" showSearch style={{width: '400px'}}>
                  {
                    this.state.labelGroup.map(item => {
                      return (
                        <Option key={item.name + item.id} value={item.name}>{item.name}</Option>
                      );
                    })
                  }
                </Select>
              </IceFormBinder>
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>个性标签</div>
              <IceFormBinder
                name="ptags"
              >
                {/*<Input*/}
                {/*placeholder="请输入个性标签"*/}
                {/*name="ptags"*/}
                {/*style={{ width: '400px' }}*/}
                {/*/>*/}
                <Select mode="tag" showSearch style={{width: '400px'}} visible={false} hasArrow={false}
                        placeholder="请输入个性标签">

                </Select>
              </IceFormBinder>
              {/*<IceFormError name="ptags" style={styles.formError}/>*/}
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>备注</div>
              <IceFormBinder
                name="memo"
                triggerType="onBlur"
                message="备注不能为空"
              >
                <Input.TextArea
                  placeholder="请输入备注"
                  name="memo"
                  rows={7}
                  style={{width: '400px'}}
                />
              </IceFormBinder>
              <IceFormError name="memo" style={styles.formError}/>
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
    labelPNs: state.labelPNs,
    labelPN: Object.assign({}, state.labelPNs.item),
    caseId: state.labelPNs.caseId,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(LabelPNForm);
