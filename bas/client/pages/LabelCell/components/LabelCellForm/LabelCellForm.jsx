/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import {
  Input,
  Button,
  Select,
  Radio,
  Message,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CirclePicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import { actions } from '../../../../stores/labelCell';
import labelColorsConfig from '../../../../labelColorsConfig';

import icon1 from './img/icon1.png';
import icon2 from './img/icon2.png';
import icon3 from './img/icon3.png';

import './style.css';
import ajaxs from '../../../../utils/ajax';
import { CN_CT_CODE_RULE } from '../../../../fieldConstraints';

const { Group: RadioGroup } = Radio;
const colors = labelColorsConfig.colors;
const { Option } = Select;

class LabelCellForm extends Component {
  static displayName = 'LabelCellForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        marker_color: colors[0],
        color_order: 1,
      },
      labelGroup: [],
    };
    this.changeColor = this.changeColor.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onNestChange = this.onNestChange.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  onNestChange(value) {
    this.setState({
      value2: value,
    });
  }

  handleChange(tags) {
    this.setState({ tags });
  }


  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };

  changeColor(color) {
    const value = this.state.value;
    value.marker_color = color.hex;
    value.color_order = colors.indexOf(color.hex) + 1;
    this.setState({
      value,
    });
  }

  fetchData() {
    ajaxs.get(`/cases/${this.props.caseId}/ct_labels/label-group`).then(res => {
      this.setState({
        labelGroup: res.data,
      });
    }).catch(err => {
      console.log(err);
    });
  }

  validateAllFormField = () => {
    const { caseId, isEdit, actions, onClose } = this.props;

    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log({ errors });
        // Message.error('提交失败');
        return;
      }

      if (isEdit) {
        Message.loading({
          title: '修改中...',
          duration: 0,
        });
        actions.updateLabelCell({ ...values, caseId, itemId: values.id })
          .then(res => {
            if (res.status === 'resolved' && res.body.meta.code === '200') {
              Message.success('修改成功...');
              actions.fetchLabelCells({ caseId }, {
                query: {
                  page: this.props.current,
                  pagesize: this.props.pageSize,
                },
              });
              // actions.setLabelCell(res.body.data);
              // this.props.labelCells.items.forEach((item, index) => {
              //   if (item.id === res.body.data.id) {
              //     this.props.labelCells.items[index] = res.body.data;
              //     actions.setItemsLabelCell(this.props.labelCells.items)
              //   }
              // })
            } else if (res.status === 'resolved' && res.body.meta.code === '1002') {
              Message.error('修改失败，该基站已存在...');
            }
            console.log(res);
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
        actions.createLabelCell({ ...values, caseId })
          .then(res => {
            if (res.status === 'resolved' && res.res.body.meta.code === '200') {
              Message.success('添加成功...');
              actions.fetchLabelCells({ caseId }, {
                query: {
                  page: this.props.current,
                  pagesize: this.props.pageSize,
                },
              });
            } else if (res.status === 'resolved' && res.res.body.meta.code === '1002') {
              Message.error('添加失败，该基站已存在...');
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

  componentDidMount() {
    this.fetchData();
    if (this.props.labelCell) {
      const label = [];
      if (this.props.labelCell.label_groups) {
        this.props.labelCell.label_groups.forEach(item => {
          label.push(item);
        });
      }
      this.props.labelCell.label_group_names = label;
    }
  }


  checkCtCode = (rule, values, callback) => {
    if (!values) {
      callback('基站代码不能为空');
    } else if (!CN_CT_CODE_RULE.test(values)) {
      callback('请输入正确的格式');
    } else {
      callback();
    }
  };

  render() {
    return (
      <IceContainer style={styles.container}>
        <IceFormBinderWrapper
          value={this.props.isEdit && this.props.labelCell ? this.props.labelCell : this.state.value}
          onChange={this.formChange}
          ref="form"
        >
          <div style={styles.formContent}>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>基站代码</div>
              <IceFormBinder
                name="ct_code"
                required
                // triggerType="onBlur"
                validator={this.checkCtCode}
              >
                <Input
                  placeholder="请输入基站代码，格式为LAC:CI:MNC"
                  name="ct_code"
                  style={{ width: '400px' }}
                />
              </IceFormBinder>
              <IceFormError name="ct_code" style={styles.formError} />
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
              <IceFormError name="label" style={styles.formError} />
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>标签</div>
              <IceFormBinder
                name="label_group_names"
              >
                <Select mode="tag" showSearch style={{ width: '400px' }}>
                  {
                    this.state.labelGroup.map(item => {
                      return (
                        <Option key={item.name + item.id} value={item.name}>{item.name}</Option>
                      );
                    })
                  }
                </Select>
              </IceFormBinder>
              {/* <IceFormError name="标签" style={styles.formError}/> */}
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>备注</div>
              <IceFormBinder
                name="memo"
              >
                <Input.TextArea
                  placeholder="请输入备注"
                  name="memo"
                  rows={7}
                  style={{ width: '400px' }}
                />
              </IceFormBinder>
              {/* <IceFormError name="memo" style={styles.formError}/> */}
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>图钉颜色</div>
              <IceFormBinder
                name="marker_color"
              >
                <CirclePicker
                  width="340px"
                  circleSize={24}
                  colors={colors}
                  color={this.props.isEdit && this.props.labelCell ? this.props.labelCell.marker_color : this.state.value.marker_color}
                  onChangeComplete={this.changeColor}
                />
              </IceFormBinder>
              <FontAwesomeIcon icon={faMapMarkerAlt}
                style={{
                color: this.props.isEdit && this.props.labelCell ? this.props.labelCell.marker_color : this.state.value.marker_color,
                marginLeft: '10%',
              }}
                size="2x"
              />
              {/* <IceFormError name="label_icon" style={styles.formError}/> */}
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
    position: 'relative',
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
    labelCells: state.labelCells,
    labelCell: Object.assign({}, state.labelCells.item),
    caseId: state.labelCells.caseId,
    pageSize: state.labelCells.pageSize,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(LabelCellForm);
