/* eslint react/no-string-refs:0 */
import React, {Component} from 'react';
import IceContainer from '@icedesign/container';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  Input,
  Button,
  Select,
  Message,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';

import {actions} from '../../../../../bbStores/CurrencyPairs/index';


const { Option } = Select;

class CurrencyPairsForm extends Component {
  static displayName = 'BinForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {},
    };
  }


  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };

  validateAllFormField = (fieldnames = []) => {
    const {caseId, isEdit, actions, onClose} = this.props;
   //const {validateAllFormField} = this.refs.form
      this.refs.form.validateAll((errors, valuess) => {
      if (errors) {
        console.log(valuess)
        console.log({ errors});
        //console.log(valuess)
        // Message.error('提交失败');
        return;      }
      if (isEdit) {
        Message.loading({
          title: '修改中...',
          duration: 0,
        });
        actions.updateListBins({...values, case_id: caseId})
          .then(res => {
            if (res.status === 'resolved') {
              Message.success('修改成功...');
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
        actions.createCurrencyPairs({...valuess, case_id: caseId})
          .then(res => {
            //console.log(res)
            if (res.status === 'resolved') {
              Message.success('添加成功...');
              actions.fetchCurrencyPairs({case_id: caseId}, {
                query: {
                  page: 1,
                  pagesize: this.props.currencyPairs.pageSize
                }
              });
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
    if (this.props.isEdit && this.props.currencyPairs.item) {
      if (this.state.value.id !== this.props.currencyPairs.item.id) {
        this.setState({
          value: JSON.parse(JSON.stringify(this.props.currencyPairs.item))
        })
      }
    }
  }


  checkNum = (rule, values, callback) => {
    if (!values) {
      callback('外币不能为空')
    }
    else {
      callback()
    }
  };

  checkShortNum = (rule, values, callback) => {
    if (!values) {
      callback('本币不能为空')
    } else {
      callback()
    }
  };



  render() {
    const {currencyPairs} = this.props;
    return (
      <IceContainer style={styles.container}>
        <IceFormBinderWrapper
          value={this.state.value}
          onChange={this.formChange}
          ref="form"
        >
          <div style={styles.formContent}>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>外币</div>
              <IceFormBinder
                name="base_name"
                required
                triggerType="onBlur"
                validator={this.checkNum}
              >
                <Input
                  placeholder="请输入外币"
                  name="base_name"
                  style={{width: '250px'}}
                />
              </IceFormBinder>
              <IceFormBinder
                name="base_symbol"
                required
                //triggerType="onBlur"
                validator={this.checkNum}
              >
                <Input
                  placeholder="请输入外币符号"
                  name="base_symbol"
                  style={{width: '120px', display: 'inline-block', marginLeft: '30px'}}
                />
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="base_name" style={{color: '#f76048'}}/>
              </div>
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>本币</div>
              <IceFormBinder
                name="settle_name"
                required
                triggerType="onBlur"
                validator={this.checkShortNum}
              >
                <Input
                  placeholder="请输入本币"
                  name="value"
                  style={{width: '250px'}}
                />
              </IceFormBinder>
              <IceFormBinder
                name="settle_symbol"
                required
                triggerType="onBlur"
                validator={this.checkShortNum}
              >
                <Input
                  placeholder="请输入本币符号"
                  name="base_symbol"
                  style={{width: '120px', display: 'inline-block', marginLeft: '30px'}}
                />
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="settle_name" style={{color: '#f76048'}}/>
              </div>
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>汇率</div>
              <IceFormBinder
                name="rate"
                required
                triggerType="onBlur"
                 message="汇率不能为空"
              >
                <Input
                  placeholder="请输入汇率"
                  name="rate"
                  style={{width: '400px'}}
                />
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="rate" style={{color: '#f76048'}}/>
              </div>
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
  container: {
    marginBottom: 0,
  },
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
    caseId: state.cases.case.id,
    currencyPairs: state.currencyPairs
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(CurrencyPairsForm);
