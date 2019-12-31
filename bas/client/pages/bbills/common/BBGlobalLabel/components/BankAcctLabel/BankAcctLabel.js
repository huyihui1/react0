/* eslint react/no-string-refs:0 */
import React, { Component, Fragment } from 'react';
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

import {actions} from '../../../../../../bbStores/bankAcctLabels/index';

import labelColorsConfig from '../../../../../../labelColorsConfig';
import appConfig from '../../../../../../appConfig';
import ajaxs from '../../../../../../utils/ajax';

import RelatedOwners from './components/RelatedOwners'
import GroupByPeers from './components/GroupByPeers'
import Tellerandtimel1 from './components/Tellerandtimel1'
import DigestChart from './components/DigestChart'
import TrxclassChart from './components/TrxclassChart'
import Trxhourclass from './components/Trxhourclass'
import TrxdayChart from './components/TrxdayChart'
import BankAcctNumSummary from './components/BankAcctNumSummary'

// import './style.css';

const colors = labelColorsConfig.colors;
const { Option } = Select;

class BankAcctLabel extends Component {
  static displayName = 'BankAcctLabel';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      values: {
        label_bg_color: colors[0],
        label_txt_color: '#fff',
        color_order: 1,
        ptags: []
      },
      label: '户名标注',
      activeCitizensKey: 0,
      activeTabKey: 0,
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
        values.ptags = JSON.stringify(values.ptags);
        actions.createBankAcct({ ...values, caseId })
          .then(res => {
            if (res.res.body.meta.success) {
              values.id = res.body.id;
              values.ptags = JSON.parse(res.body.ptags)
              this.setState({
                values,
              })
              Message.success('添加成功...');
            } else {
              Message.error('添加失败...');
            }
          })
          .catch(err => {
            Message.error('添加失败...');
            console.log(err);
          });
      }
      // onClose && onClose();
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

  fetchData = () => {
    const {bank_acct, card_num} = this.props.activeItem
    let t = {
      bank_acct,
      card_num
    }
    ajaxs.post(`/cases/${this.props.caseId}/bank_acct_labels/show`, {...t}).then(res => {
      if (res.meta.success) {
        let values = {...this.state.values, ...this.props.activeItem}
        if (res.data.id) {
          res.data.ptags = JSON.parse(res.data.ptags)
          values = {...this.state.values, ...res.data}
        }
        this.setState({
          values,
        })
      }
    }).catch(err => {
      console.log(err);
    })
  }



  componentDidMount() {
    this.fetchData()
    this.props.actions.fetchLargeBankAcct({caseId: this.props.caseId})
  }

  componentDidUpdate(prevProps) {

  }

  componentWillUnmount() {

  }

  onCitizensChange = (activeKey) => {
    this.setState({ activeCitizensKey: activeKey });
  }

  onTabChange = (key) => {
    this.setState({ activeTabKey: key });
  }

  render() {
    const { labelGroup,  activeCitizensKey, activeTabKey} = this.state;
    const  {activeItem} = this.props;
    const title = `${activeItem.card_num ? '卡 ' + activeItem.card_num : ''} ${activeItem.bank_acct && activeItem.card_num ? '/' : ''} ${activeItem.bank_acct ? '账 ' + activeItem.bank_acct : ''}`;
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
                <Tab activeKey={activeCitizensKey} onChange={this.onCitizensChange}>
                  <Tab.Item title="概览" key={0}>
                    <BankAcctNumSummary activeItem={this.props.activeItem} />
                  </Tab.Item>
                  <Tab.Item title="分布特征" key={1}>
                    <div style={{display: 'inline-block',width: '50%'}}>
                      <DigestChart caseId={this.props.caseId} activeItem={this.props.activeItem} />
                    </div>
                    <div style={{display: 'inline-block',width: '50%'}}>
                      <TrxclassChart caseId={this.props.caseId} activeItem={this.props.activeItem} />
                    </div>
                    <div>
                      <Trxhourclass caseId={this.props.caseId} activeItem={this.props.activeItem} />
                    </div>
                  </Tab.Item>
                  <Tab.Item title="每日交易" key={2}>
                    <div>
                      <TrxdayChart caseId={this.props.caseId} activeItem={this.props.activeItem} />
                    </div>
                  </Tab.Item>
                </Tab>
              </div>
              <div className="item-flex-4 chartCard" style={{ ...styles.formContent, marginTop: '36px' }}>
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
                      if (this.label) {
                        this.label.innerText = data || '户名标注'
                      }
                      return data
                    }}
                    setFieldValue={(data) => {
                      if (this.label) {
                        this.label.innerText = data || '户名标注'
                      }
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
                    <span ref={(x) => this.label = x} id={'label-desc'}>户名标注</span>
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
            </div>
            <div style={{ marginTop: '20px' }}>
              <Tab shape="wrapped" unmountInactiveTabs activeKey={activeTabKey} onChange={this.onTabChange}>
                <Tab.Item title="与其他账户联系" key={0}>
                  <div style={{ height: '500px' }}>
                    <RelatedOwners styles={{height: '90%'}} title={`${title}在所有调取的话单里出现的情况`} activeItem={this.props.activeItem} />
                  </div>
                </Tab.Item>
                <Tab.Item title="密切联系账户" key={1}>
                  <div style={{ height: '500px' }}>
                    <GroupByPeers styles={{height: '90%'}} title={`${title}密切联系账户`} activeItem={this.props.activeItem} />
                  </div>
                </Tab.Item>
                <Tab.Item title="常出现网点" key={2}>
                  <div style={{ height: '500px' }}>
                    <Tellerandtimel1 styles={{height: '90%'}} title={`常出现网点`} activeItem={this.props.activeItem} />
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
    bankAcctLables: state.bankAcctLables,
    // bankAcctLable: state.bankAcctLables.LargItems,
    caseId: state.cases.case.id,
    // citizens: state.citizens,
    login: state.login,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions}, dispatch),
  }),
)(BankAcctLabel);
