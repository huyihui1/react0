import React, { Component } from 'react';
import { connect } from 'react-redux';
import IceContainer from '@icedesign/container';
import { bindActionCreators } from 'redux';
import {
  Dialog,
  Input,
  Button,
  Message,
  Tab,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import moment from 'moment';
import ajaxs from '../../../../utils/ajax';


class CaseSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        'bb_mint_threshold': '',
      },
      bbillsKeys: {}
    };
  }

  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };
  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log({ errors });
        // Message.error('提交失败');
        return;
      }
      const {caseId, onClose} = this.props;
      const {bbillsKeys} = this.state;
      let t = []
      Object.keys(values).forEach(key => {
        let data = bbillsKeys[key];
        if (data) {
          t.push({...data, v: values[key]})
        }
      })

      ajaxs.put(`/cases/${caseId}/settings`, {
        case_id: caseId,
        settings: t
      }).then(res => {
        if (res.meta.success) {
          Message.success('修改成功')
        } else {
          Message.error('修改失败, 请重新提交')
        }
      }).catch(err => {
        Message.error('修改失败')
        console.log(err);
      })
      onClose && onClose()
    });
  };

  fetchData = (id) => {
    ajaxs.get(`/cases/${id}/settings`)
      .then(res => {
        if (res.meta.success) {
          const data = res.data.settings
          let bbillsVal = {}
          let bbillsKeys = {}
          data.forEach(item => {
            bbillsKeys[item.k] = item
            if (item.zcope === 'bbills') {
              bbillsVal[item.k] = item.v
            }
          })
          this.setState({
            values: bbillsVal,
            bbillsKeys
          })
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {

  }


  componentDidUpdate(prevProps) {
    if (this.props.caseId && this.props.caseId !== prevProps.caseId) {
      this.fetchData(this.props.caseId);
    }

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
          title={`案件分析参数`}
        >
          <Tab>
            <Tab.Item title="账单参数" key="1">
              <IceContainer style={styles.container}>
            <IceFormBinderWrapper
              value={this.state.values}
              onChange={this.formChange}
              ref="form"
            >
              <div style={styles.formContent}>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>大额金额阈值</div>
                  <IceFormBinder
                    name="bb_mint_threshold"
                    required
                    triggerType="onBlur"
                    message="大额金额阈值不能为空"
                  >
                    <Input
                      addonTextBefore={'>='}
                      placeholder="请输入大额金额阈值"
                      name="name"
                      style={{ width: '400px' }}
                    />
                  </IceFormBinder>
                  <IceFormError name="name" style={styles.formError}/>
                </div>
                {/*<div style={styles.formItem}>*/}
                {/*<div style={styles.formLabel}>突出显示</div>*/}
                {/*</div>*/}
                {/*<div style={styles.formItem}>*/}
                {/*<div style={styles.formLabel}>金额</div>*/}
                {/*<IceFormBinder*/}
                {/*name="金额"*/}
                {/*required*/}
                {/*triggerType="onBlur"*/}
                {/*message="金额不能为空"*/}
                {/*>*/}
                {/*<Input*/}
                {/*addonTextBefore={'>='}*/}
                {/*placeholder="请输入金额"*/}
                {/*name="金额"*/}
                {/*style={{width: '400px'}}*/}
                {/*/>*/}
                {/*</IceFormBinder>*/}
                {/*<IceFormError name="金额" style={styles.formError}/>*/}
                {/*</div>*/}
                {/*<div style={styles.formItem}>*/}
                {/*<div style={styles.formLabel}>次数</div>*/}
                {/*<IceFormBinder*/}
                {/*name="次数"*/}
                {/*required*/}
                {/*triggerType="onBlur"*/}
                {/*message="次数不能为空"*/}
                {/*>*/}
                {/*<Input*/}
                {/*addonTextBefore={'>='}*/}
                {/*placeholder="请输入次数"*/}
                {/*name="次数"*/}
                {/*style={{width: '400px'}}*/}
                {/*/>*/}
                {/*</IceFormBinder>*/}
                {/*<IceFormError name="次数" style={styles.formError}/>*/}
                {/*</div>*/}
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
            </Tab.Item>
            <Tab.Item title="话单参数" key="2">
              <IceContainer style={styles.container}>

              </IceContainer>
            </Tab.Item>
          </Tab>
        </Dialog>
      </span>
    );
  }
}

const styles = {
  container: {
    marginBottom: 0,
    minHeight: '150px'
  },
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
    width: '85px',
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
  state => ({}),
  // mapDispatchToProps
  dispatch => ({
    // actions: bindActionCreators({...actions}, dispatch),
  }),
)(CaseSetting);
