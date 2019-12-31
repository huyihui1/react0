/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import IceLabel from '@icedesign/label';
import { CirclePicker } from 'react-color';
import {
  Input,
  Button,
  Message,
  Select,
  Tab,
  Table,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import MapComponent from '../../MapComponent'
import Ownernumandstartedhorclass from '../../../PBStat/components/Ownernumandstartedhorclass'

import { actions } from '../../../../stores/labelCell';
import { actions as labelPNActions } from '../../../../stores/labelPN';
import labelColorsConfig from '../../../../labelColorsConfig';
import appConfig from '../../../../appConfig';
import ajaxs from '../../../../utils/ajax';

// import './style.css';

const colors = labelColorsConfig.colors;
const { Option } = Select;

class LabelctLabel extends Component {
  static displayName = 'LabelctLabel';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      values: {
        marker_color: colors[0],
        color_order: 1,
      },
      labelGroup: [],
      labelCells: [],
      criteria: null,
      codeCriteria: null,
      caseId: null,
      summaryDate: null,
      summary: null,
    };
    this.changeColor = this.changeColor.bind(this);
    this.fetchLabelGroup = this.fetchLabelGroup.bind(this);
    this.findActiveItem = this.findActiveItem.bind(this);
    this.handleSummary = this.handleSummary.bind(this);
  }

  formChange = (values) => {
    console.log('values', values);
    // if (values.ct_code !== this.state.activeItem) {
    //   this.props.handleActiveItem(values.ct_code);
    // } else {
    this.setState({
      values,
    });
    // }
  };


  validateAllFormField = () => {
    const { caseId, isEdit, actions } = this.props;

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
        actions.updateLabelCell({ ...values, caseId, itemId: values.id })
          .then(res => {
            if (res.status === 'resolved' && res.body.meta && res.body.meta.success) {
              Message.success('修改成功...');
              actions.setLabelCell(res.body.data);
              this.props.labelCells.items.forEach((item, index) => {
                if (item.id === res.body.data.id) {
                  this.props.labelCells.items[index] = res.body.data;
                  actions.setItemsLabelCell(this.props.labelCells.items);
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
        actions.createLabelCell({ ...values, caseId })
          .then(res => {
            if (res.status === 'resolved' && res.res.body.meta.success) {
              values.id = res.body.id;
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

  fetchLabelGroup() {
    const { actions } = this.props;
    actions.fetchLabelGroupLabelCell({ caseId: this.props.caseId }).then(res => {
      if (res.body.meta && res.body.meta.success) {
        this.setState({
          labelGroup: res.body.data,
        });
      }
    }).catch(err => {
      console.log(err);
    });
  }
  findActiveItem(item) {
    ajaxs.get(`/cases/${this.props.caseId}/ct_labels/${item}`).then(res => {
      if (res.meta && res.meta.success) {
        if (res.data.label_groups) {
          res.data.label_group_names = res.data.label_groups;
        }
        this.setState({
          values: res.data,
          activeItem: item,
        });
      } else {
        const values = {
          marker_color: colors[0],
          color_order: 1,
        };
        values.ct_code = item;
        this.setState({
          values,
          activeItem: item,
        });
      }
    }).catch(err => {
      console.log(err);
    });

    this.setState({
      criteria: {
        owner_num: ['IN', [item]],
      },
      codeCriteria: {
        owner_ct_code: item,
      },
    });
  }


  handleSummary(summary) {
    const startDate = moment(summary.pb_started_at).format('YYYY-MM-DD');
    const endDate = moment(summary.pb_ended_at).format('YYYY-MM-DD');
    this.setState({
      summaryDate: {
        startDate,
        endDate,
      },
      summary,
    });
  }

  componentDidMount() {
    if (this.props.activeItem && this.props.type === 'code' && this.props.activeItem !== this.state.activeItem) {
      this.findActiveItem(this.props.activeItem);
      this.setState({
        activeItem: this.props.activeItem,
      });
    }
    if (this.props.caseId && this.props.caseId !== this.state.caseId) {
      this.fetchLabelGroup();
      this.props.actions.fetchLargItemsLabelCell({ caseId: this.props.caseId }, {
        query: {
          page: 1,
          pagesize: appConfig.largePageSize,
        },
      });
      this.props.actions.fetchLargeLabelPN({ caseId: this.props.caseId  }, {
        query: {
          page: 1,
          pagesize: appConfig.largePageSize,
        },
      })
      this.setState({
        caseId: this.props.caseId,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeItem && nextProps.type === 'code' && nextProps.activeItem !== this.state.activeItem) {
      this.findActiveItem(nextProps.activeItem);
      this.setState({
        activeItem: nextProps.activeItem,
        config: {
          num: nextProps.activeItem,
          caseId: nextProps.caseId,
        },
      });
    }
    if (nextProps.caseId && nextProps.caseId !== this.state.caseId) {
      this.fetchLabelGroup();
      // if (!this.props.labelCells.LargItems) {
        this.props.actions.fetchLargItemsLabelCell({ caseId: this.props.caseId }, {
          query: {
            page: 1,
            pagesize: appConfig.largePageSize,
          },
        });
      // }
      // if (!this.props.labelPN) {
        this.props.actions.fetchLargeLabelPN({ caseId: this.props.caseId  }, {
          query: {
            page: 1,
            pagesize: appConfig.largePageSize,
          },
        })
      // }
      this.setState({
        caseId: nextProps.caseId,
      });
    }

    if (nextProps.login && nextProps.login.summary && JSON.stringify(nextProps.login.summary) !== JSON.stringify(this.state.summary)) {
      this.handleSummary(nextProps.login.summary);
    }
  }

  render() {
    const { activeItem, labelCells } = this.props;
    const { labelGroup } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <IceContainer style={styles.left}>
          <IceFormBinderWrapper
            value={this.state.values}
            onChange={this.formChange}
            ref="form"
          >
            <div className="d-flex" style={{ justifyContent: 'space-between' }}>
              <div className="item-flex-6">
                <MapComponent code={activeItem} ctLabel={labelCells.LargItems} />
              </div>
              <div className="item-flex-4 chartCard" style={styles.formContent}>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>基站代码</div>
                  <IceFormBinder
                    name="ct_code"
                    required
                    triggerType="onBlur"
                    message="基站代码不能为空"
                  >
                    <Input
                      placeholder="请输入基站代码，格式为LAC:CI:MNC"
                      name="ct_code"
                      style={{ width: '400px' }}
                      readOnly
                    />
                  </IceFormBinder>
                  <div style={styles.formError}>
                    <IceFormError name="ct_code" />
                  </div>
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
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>标签</div>
                  <IceFormBinder
                    name="label_group_names"
                    required
                    triggerType="onBlur"
                    message="标签不能为空"
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
                  <IceFormError name="标签" style={styles.formError} />
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
                <div style={{ textAlign: 'center' }}>
                  <Button
                    type="primary"
                    onClick={this.validateAllFormField}
                  >
                    提 交
                  </Button>
                  <Button type="secondary" style={{ marginLeft: '10px' }} onClick={() => { this.props.onClose(this.props.index); }}>关闭</Button>
                </div>
              </div>
            </div>
            <div style={{marginTop: '20px'}}>
              <Tab shape="wrapped" unmountInactiveTabs>
                <Tab.Item title="基站标注" key={0}>
                  <div style={{ height: '500px' }}>
                    <Ownernumandstartedhorclass styles={{height: '90%'}} title={`基站${activeItem}在话单中的出现情况`} criteria={this.state.codeCriteria} />
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
    margin: '10px 0 20px',
  },
  bottom: {
    display: 'inline-block',
    width: '100%',
    height: '100%',
  },
  formContent: {
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
    labelCells: state.labelCells,
    labelCell: state.labelCells.item,
    caseId: state.cases.case.id,
    login: state.login,
    labelPN: state.labelPNs.LargItems,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions, ...labelPNActions }, dispatch),
  }),
)(LabelctLabel);
