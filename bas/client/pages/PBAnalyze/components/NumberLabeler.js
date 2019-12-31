import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Dialog, Select, Input, Balloon, Button, Tab, Icon, Message} from '@alifd/next';
import IceContainer from '@icedesign/container';
import IceLabel from '@icedesign/label';
import {CirclePicker} from 'react-color';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';

import labelColorsConfig from '../../../labelColorsConfig';
import DailyCallChart from './DailyCallChart';
import DistributionOfCallsChart from './DistributionOfCallsChart';
import HeatMapChart from './HeatMapChart';
import {actions} from '../../../stores/labelPN';


const Option = Select.Option;

const colors = labelColorsConfig.colors;


class NumberLabeler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        num: '',
        label_bg_color: colors[0],
        label_txt_color: '#fff',
        color_order: 1
      },
      color: colors[0],
      dailyCntData: null,
    };
    this.onClose = this.onClose.bind(this);
    this.getDailyCntData = this.getDailyCntData.bind(this);
  }

  changeColor(color) {
    const values = this.state.values;
    values.label_bg_color = color.hex;
    values.color_order = colors.indexOf(color.hex) + 1
    this.setState({
      color: color.hex,
      values,
    });
  }

  getDailyCntData(data) {
    this.setState({
      dailyCntData: data,
    });
  }

  formChange = (values) => {
    console.log('value', values);
    this.setState({
      values,
    });
  };

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      const {actions, caseId, labelPNs, config} = this.props;
      // if (errors) {
      //   console.log({ errors });
      //   Message.error('提交失败');
      //   return;
      // }
      console.log(values);

      if (this.formatLabelPNsDataKey(labelPNs.items, 'num', config.num)) {
        let newvalues = JSON.parse(JSON.stringify(values));
        newvalues.ptags = JSON.stringify(newvalues.ptags);
        actions.updateLabelPN({...newvalues, caseId, itemId: newvalues.id})
          .then(res => {
            console.log(res);
            if (res.status === 'resolved' && res.body.meta && res.body.meta.success) {
              Message.success('修改成功...');
              this.props.updateLabelGroup(caseId);
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
        let newvalues = JSON.parse(JSON.stringify(values));
        newvalues.ptags = JSON.stringify(newvalues.ptags);
        actions.createLabelPN({...newvalues, caseId})
          .then(res => {
            if (res.status === 'resolved' && res.res.body.meta && res.res.body.meta.success) {
              Message.success('添加成功...');
              const label = [];
              res.body.label_groups.forEach(item => {
                label.push(item.label_group_name);
              });
              res.body.label_group_names = label;
              res.body.ptags = JSON.parse(res.body.ptags);
              this.setState({
                values: res.body,
              });
              this.props.updateLabelGroup(caseId)
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

  handleChange(key) {
    console.log(key);
  }

  formatLabelPNsDataKey(arr, key, value) {
    let labelPn = null;
    arr.forEach(item => {
      if (item[key] === value) {
        labelPn = item;
      }
    });
    if (labelPn) {
      return labelPn;
    }
    return null;
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.config && nextProps.config.num && nextProps.config.num !== this.state.values.num) {
      let t = this.state.values;
      let color = colors[0];
      const label = [];

      const res = this.formatLabelPNsDataKey(nextProps.labelPNs.items, 'num', nextProps.config.num);
      console.log(res);
      if (res) {
        t = res;
        if (Array.isArray(t.label_groups)) {
          t.label_groups.forEach(item => {
            label.push(item.label_group_name);
          });
        }
        t.label_group_names = label;
        color = res.label_bg_color;
      } else {
        t = {
          num: '',
          label_bg_color: colors[0],
          label_txt_color: '#fff',
        };
        t.num = nextProps.config.num;
        t.label_bg_color = colors[0];
        color = colors[0];
      }
      if (t.ptags) {
        t.ptags = JSON.parse(t.ptags);
      } else {
        t.ptags = []
      }
      console.log(t);
      this.setState({
        values: t,
        color,
      });
    }
  }

  onClose() {
    this.props.onClose();
  }

  render() {
    return (
      <div className={`numberLabeler ${this.props.config && this.props.config.visible ? 'show' : null}`}>
        <div className="numberLabeler-close">
          <Icon type="close" onClick={this.onClose}/>
        </div>
        <div style={{display: 'flex'}}>
          <IceContainer style={styles.left}>
            <IceFormBinderWrapper
              value={this.state.values}
              onChange={this.formChange}
              ref="form"
            >
              <div style={styles.formContent}>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>标注号码</div>
                  <IceFormBinder
                    name="num"
                    // triggerType="onBlur"
                  >
                    <Input
                      name="num"
                    />
                  </IceFormBinder>
                  {/* <IceFormError name="started_at" style={styles.formError} /> */}
                  {/* <div style={{marginLeft: '10px'}}> */}
                  {/* <a href={"https://www.baidu.com/s?&wd=" + this.state.values.num} target="_blank">百度搜索</a> */}
                  {/* <a href={"https://www.google.com.hk/search?q=" + this.state.values.num} target="_blank" style={{marginLeft: '10px'}}>谷歌搜索</a> */}
                  {/* </div> */}
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>使用人员</div>
                  <IceFormBinder
                    name="label"
                    // triggerType="onBlur"
                  >
                    <Input/>
                  </IceFormBinder>
                  <IceLabel
                    style={{
                      fontSize: '14px',
                      marginLeft: '10px',
                      backgroundColor: this.state.color,
                      color: '#fff'
                    }}
                  >
                    {this.state.values.label || '使用人员'}
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
                      color={this.state.color}
                      onChangeComplete={(color) => {
                        this.changeColor(color);
                      }}
                    />
                  </IceFormBinder>
                  {/* <IceFormError name="color" style={styles.formError} /> */}
                </div>
                <div style={{...styles.formItem}}>
                  <div style={styles.formLabel}>单位职务</div>
                  <IceFormBinder
                    name="单位职务"
                    // triggerType="onBlur"
                  >
                    <Input
                      style={{width: '100%'}}
                    />
                  </IceFormBinder>
                  {/* <IceFormError name="started_at" style={styles.formError} /> */}
                </div>
                <div style={{...styles.formItem}}>
                  <div style={styles.formLabel}>个性标签</div>
                  <IceFormBinder
                    name="ptags"
                    // triggerType="onBlur"
                  >
                    {/*<Input*/}
                    {/*maxLength={30}*/}
                    {/*hasLimitHint*/}
                    {/*style={{ width: '100%' }}*/}
                    {/*/>*/}
                    <Select aria-label="tag mode" mode="tag" style={{width: '100%'}} hasArrow={false} visible={false}/>
                  </IceFormBinder>
                  {/* <IceFormError name="started_at" style={styles.formError} /> */}
                </div>
                <div style={{...styles.formItem}}>
                  <div style={styles.formLabel}>分类标签</div>
                  <IceFormBinder
                    name="label_group_names"
                    // triggerType="onBlur"
                  >
                    <Select mode="tag" showSearch style={{width: '100%'}}>
                      {
                        this.props.labelGroup && this.props.labelGroup.map(item => {
                          return (
                            <Option key={item.name + item.id} value={item.name}>{item.name}</Option>
                          );
                        })
                      }
                    </Select>
                  </IceFormBinder>
                  {/* <IceFormError name="started_at" style={styles.formError} /> */}
                </div>
                <div style={{...styles.formItem}}>
                  <div style={styles.formLabel}>备注</div>
                  <IceFormBinder
                    name="memo"
                    // triggerType="onBlur"
                  >
                    <Input.TextArea
                      rows={5}
                      style={{width: '100%'}}
                    />
                  </IceFormBinder>
                </div>
                <div style={{textAlign: 'center'}}>
                  <Button
                    type="primary"
                    style={styles.submitButton}
                    onClick={this.validateAllFormField}
                  >
                    更新标注
                  </Button>
                  <Button type="secondary" style={{marginLeft: '10px'}}>保存到人员库</Button>
                </div>
                <div className="chartCard">
                  <DailyCallChart config={this.props.config} summaryDate={this.props.summaryDate}
                                  getDailyCntData={this.getDailyCntData}/>
                </div>
                <div className="chartCard">
                  <DistributionOfCallsChart config={this.props.config}/>
                </div>
                {/*<div className="chartCard">*/}
                {/*<HeatMapChart config={this.props.config} dailyCntData={this.state.dailyCntData} />*/}
                {/*</div>*/}
              </div>
            </IceFormBinderWrapper>
          </IceContainer>
        </div>
        {/* <IceContainer style={styles.bottom} /> */}
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
  bottom: {
    display: 'inline-block',
    width: '100%',
    height: '100%',
  },
  formContent: {},
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
    labelPNs: state.labelPNs,
    caseId: state.labelPNs.caseId,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(NumberLabeler);
