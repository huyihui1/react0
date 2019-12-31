/* eslint react/no-string-refs:0 */
import React, {Component} from 'react';
import {Dialog, Button} from '@alifd/next';
import IceContainer from '@icedesign/container';
import CustomForm from './CustomForm'
import { connect } from 'react-redux';
import ajaxs from '../../../../utils/ajax'




class AdvancedSearch extends Component {
  static displayName = 'AdvancedSearch';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {},
      formConfig: [
        {
          label: '账号过滤',
        },
        {
          label: '本方账户',
          component: 'Select',
          componentProps: {
            placeholder: '请选择本方卡号',
            mode: 'tag',
          },
          formBinderProps: {
            name: 'owner_cust_num',
            message: '请选择正确的卡号!',
          },
          dataSource: []
        },
        {
          label: '对方账户',
          component: 'Select',
          componentProps: {
            placeholder: '请选择对方卡号',
            mode: 'tag',
          },
          formBinderProps: {
            name: 'peer_cust_num',
            message: '请选择正确的卡号!',
          },
          dataSource: []
        },
        {
          label: '本方户名',
          component: 'Select',
          componentProps: {
            placeholder: '请选择本方户名',
            mode: 'tag',
          },
          formBinderProps: {
            name: 'owner_name',
            message: '请选择正确的本方户名!',
          },
          dataSource: []
        },
        {
          label: '对方户名',
          component: 'Select',
          componentProps: {
            placeholder: '请选择对方户名',
            mode: 'tag',
          },
          formBinderProps: {
            name: 'peer_name',
            message: '请选择正确的对方户名!',
          },
          dataSource: []
        },
        {
          label: '对方账号所属银行',
          component: 'Select',
          componentProps: {
            placeholder: '请输入对方账户所属银行',
            mode: 'tag',
            visible: false,  //当前弹层是否显示,
            hasArrow: false  //是否显示下拉箭头
          },
          formBinderProps: {
            name: 'peer_bank_name',
            required: false,
            message: '请输入正确的银行',
          },
          dataSource: [],
        },
        {
          label: '对方银行归属地',
          component: 'Select',
          componentProps: {
            placeholder: '请输入对方银行归属地',
            mode: 'tag',
            visible: false,  //当前弹层是否显示,
            hasArrow: false  //是否显示下拉箭头
          },
          formBinderProps: {
            name: 'peer_card_loc',
            message: '请输入正确的银行归属地',
          },
          dataSource: []
        },
        {
          label: '时间过滤'
        },
        {
          label: '交易日期',
          // component: 'MultipleDateSelect',
          component: 'MultipleDateSelect',
          componentProps: {
            placeholder: '请输入交易日期',
            mode: 'multiple',
            // visible: false,  //当前弹层是否显示,
            // hasArrow: true  //是否显示下拉箭头
          },
          formBinderProps: {
            name: 'trx_day',
            message: '请输入正确交易日期',
          },
          dataSource:[]
        },
        {
          label: '交易日期时间',
          component: 'MultipleDateSelect',
          componentProps: {
            placeholder: '请输入交易日期时间',
            mode: 'multiple',
          },
          formBinderProps: {
            name: 'trx_full_time',
            message: '请输入正确交易日期时间',
          },
        },
        {
          label: '周几',
          component: 'Select',
          componentProps: {
            placeholder: '请选择周几',
            mode: 'multiple',
            // visible:false,  //当前弹层是否显示,
            // hasArrow: true  //是否显示下拉箭头
          },
          formBinderProps: {
            name: 'weekday',
            required: false, //是否必选  默认false
            message: '请输入正确的银行',
          },
          dataSource: [
            {
              label: '一',
              value: 1,
            },
            {
              label: '二',
              value: 2,
            },
            {
              label: '三',
              value: 3,
            },
            {
              label: '四',
              value: 4,
            },
            {
              label: '五',
              value: 5,
            },
            {
              label: '六',
              value: 6,
            },
            {
              label: '日',
              value: 7,
            },
          ],
        },
        {
          label: '上中下旬',
          component: 'Select',
          componentProps: {
            placeholder: '请选择',
            mode: 'multiple',
          },
          formBinderProps: {
            name: 'eml_month',
            message: '请选择!',
          },
          dataSource: [
            {
              label: '上旬',
              value: 1,
            },
            {
              label: '中旬',
              value: 2,
            },
            {
              label: '下旬',
              value: 3,
            }
          ],
        },
        {
          label: '时间类别',
          component: 'Select',
          componentProps: {
            placeholder: '请选择时间类别',
            mode: 'multiple',
          },
          formBinderProps: {
            name: 'trx_time_l1_class',
            message: '请选择正确的时间类别!',
          },
          dataSource: [
            {
              label: '4:30~6:59',
              value: 0,
            },
            {
              label: '7:00~8:29',
              value: 1,
            },
            {
              label: '8:30-11:29',
              value: 2,
            },
            {
              label: '11:30~13:59',
              value: 3,
            },
            {
              label: '14:00~16:59',
              value: 4,
            },
            {
              label: '17:00~18:29',
              value: 5,
            },
            {
              label: '18:30~20:59',
              value: 6,
            },
            {
              label: '21:00~23:59',
              value: 7,
            },
            {
              label: '0:00~4:29',
              value: 8,
            }
          ],
        },
        {
          label: '时间类别(小时)',
          component: 'Select',
          componentProps: {
            placeholder: '请选择时间类别',
            mode: 'multiple',
          },
          formBinderProps: {
            name: 'trx_hour_class',
            message: '请选择正确的时间类别!',
          },
          dataSource: [
            {
              label: '4时',
              value: 0,
            },
            {
              label: '5时',
              value: 1,
            },
            {
              label: '6时',
              value: 2,
            },
            {
              label: '7时',
              value: 3,
            },
            {
              label: '8时',
              value: 4,
            },
            {
              label: '9时',
              value: 5,
            },
            {
              label: '10时',
              value: 6,
            },
            {
              label: '11时',
              value: 7,
            },
            {
              label: '12时',
              value: 8,
            },
            {
              label: '13时',
              value: 9,
            },
            {
              label: '14时',
              value: 10,
            },
            {
              label: '15时',
              value: 11,
            },
            {
              label: '16时',
              value: 12,
            },
            {
              label: '17时',
              value: 13,
            },
            {
              label: '18时',
              value: 14,
            },
            {
              label: '19时',
              value: 15,
            },
            {
              label: '20时',
              value: 16,
            },
            {
              label: '21时',
              value: 17,
            },
            {
              label: '22时',
              value: 18,
            },
            {
              label: '23时',
              value: 19,
            },
            {
              label: '0时',
              value: 20,
            },
            {
              label: '1时',
              value: 21,
            },
            {
              label: '2时',
              value: 22,
            },
            {
              label: '3时',
              value: 23,
            },
          ],
        },
        {
          label: '时间性质',
          component: 'Select',
          componentProps: {
            placeholder: '请选择时间性质',
            mode: 'multiple',
          },
          formBinderProps: {
            name: 'time_class',
            message: '请选择正确的时间性质!',
          },
          dataSource: [
            {
              label: '私人时间',
              value: 0,
            },
            {
              label: '工作时间',
              value: 1,
            }
          ],
        },
        {
          label: '时间',
          component: 'Select',
          componentProps: {
            placeholder: '请输入时间, 例如09:00或09:00-11:30',
            mode: 'tag',
            visible: false,  //当前弹层是否显示,
            hasArrow: false  //是否显示下拉箭头
          },
          formBinderProps: {
            name: 'trx_time',
            message: '请输入正确的格式!',
          },
          dataSource: []
        },
        {
          label:'金额过滤'
        },
        {
          label: '交易金额',
          component: 'Select',
          componentProps: {
            placeholder: '请输入交易金额 例如 100或100-900',
            mode: 'tag',
            visible: false,  //当前弹层是否显示,
            hasArrow: false  //是否显示下拉箭头
          },
          formBinderProps: {
            name: 'trx_amt_cny',
            message: '请输入正确的交易金额!',
          },
          dataSource: []
        },
        {
          label: '交易额是否为整数',
          component: 'Select',
          componentProps: {
            placeholder: '请选择',
            mode: 'multiple',
          },
          formBinderProps: {
            name: 'trx_amt_round',
            message: '请选择正确的格式!',
          },
          dataSource: [
            {
              label: '否',
              value: 0
            },
            {
              label: '是',
              value: 1
            }
          ]
        },
        {
          label: '交易币种',
          component: 'Select',
          componentProps: {
            placeholder: '请选择交易币种',
            mode: 'multiple',
            onRemove: (item) => {
              console.log(item);
            }
          },
          formBinderProps: {
            name: 'currency',
            message: '请选择正确的交易币种!',
          },
          dataSource: [
            {
              label: '人民币',
              value: 'cny'
            },
            {
              label: '欧元',
              value: 'eur'
            },
            {
              label: '美元',
              value: 'usd'
            }
          ]
        },
        {
          label: '交易额分类',
          component: 'Select',
          componentProps: {
            placeholder: '请选择交易额分类',
            mode: 'multiple',
          },
          formBinderProps: {
            name: 'trx_amt_class',
            message: '请选择正确的交易额分类!',
          },
          dataSource: [
            {
              label: '< 200(含)元',
              value: 1
            },
            {
              label: '200~1000元',
              value: 2
            },
            {
              label: '1000(含)~4500元',
              value: 3
            },
            {
              label: '4500(含)~9000元',
              value: 4
            },
            {
              label: '9000(含)~5万元',
              value: 5
            },
            {
              label: '5万(含)~9万元',
              value: 6
            },
            {
              label: '9万(含)~50万元',
              value: 7
            },
            {
              label: '50万(含)~100万元',
              value: 8
            },
            {
              label: '>100万元(含)',
              value: 9
            },
          ]
        },
        {
          label: '余额',
          component: 'Select',
          componentProps: {
            placeholder: '请输入余额 例如 100或100-900',
            mode: 'tag',
            visible: false,  //当前弹层是否显示,
            hasArrow: false  //是否显示下拉箭头
          },
          formBinderProps: {
            name: 'bls',
            message: '请输入正确的余额!',
          },
          dataSource: []
        },
        {
          label: '特征过滤'
        },
        {
          label: '存取',
          component: 'Select',
          componentProps: {
            placeholder: '请选择',
            mode: 'multiple',
            // visible: false,  //当前弹层是否显示,
            // hasArrow: false  //是否显示下拉箭头
          },
          formBinderProps: {
            name: 'trx_direction',
            message: '请选择正确的格式!',
          },
          dataSource: [
            {
              label: '存',
              value: 1
            },
            {
              label: '取',
              value: -1
            }
          ]
        },
        {
          label: '交易类型',
          component: 'Select',
          componentProps: {
            placeholder: '请选择交易类型',
            mode: 'multiple',
            // visible: false,  //当前弹层是否显示,
            // hasArrow: false  //是否显示下拉箭头
          },
          formBinderProps: {
            name: 'trx_class',
            message: '请选择正确交易类型!',
          },
          dataSource: [
            {
              label: '现存',
              value: 1
            },
            {
              label: '现取',
              value: 2
            },
            {
              label: '转存',
              value: 3
            },
            {
              label: '转取',
              value: 4
            },
            {
              label: '其他',
              value: 9
            }
          ]
        },
        {
          label: '摘要',
          component: 'Select',
          componentProps: {
            placeholder: '请选择摘要或输入摘要',
            mode: 'tag'
          },
          formBinderProps: {
            name: 'digest',
            message: '请选择摘要或输入正确的摘要!',
          },
          dataSource: []
        },
        {
          label: '备注',
          component: 'Select',
          componentProps: {
            placeholder: '请输入备注',
            mode: 'tag',
            visible: false,  //当前弹层是否显示,
            hasArrow: false  //是否显示下拉箭头
          },
          formBinderProps: {
            name: 'memo',
            message: '请输入正确的格式!',
          },
          dataSource: []
        },
        {
          label: '交易渠道',
          component: 'Select',
          componentProps: {
            placeholder: '请选择交易渠道',
            mode: 'multiple',
          },
          formBinderProps: {
            name: 'trx_channel',
            message: '请选择正确的交易渠道!',
          },
          dataSource: [
            {
              label:'现场',
              value:1
            },
            {
              label:'网络',
              value:2
            },
            {
              label:'未知',
              value:3
            }
          ]
        },
        {
          label: '是否跨行',
          component: 'Select',
          componentProps: {
            placeholder: '请选择是否跨行',
            mode: 'multiple',
          },
          formBinderProps: {
            name: 'same_branch',
            message: '请选择正确的格式!',
          },
          dataSource: [
            {
              label:'本行',
              value:1
            },
            {
              label:'跨行',
              value:2
            },
            {
              label:'未知',
              value:3
            }
          ]
        },
        {
          label: '交易区域',
          component: 'Select',
          componentProps: {
            placeholder: '请选择交易区域',
            mode: 'multiple',
          },
          formBinderProps: {
            name: 'same_city',
            message: '请选择正确的格式!',
          },
          dataSource: [
            {
              label:'本地',
              value:1
            },
            {
              label:'外地',
              value:2
            },
            {
              label:'未知',
              value:3
            }
          ]
        },
        {
          label: '交易对手',
          component: 'Select',
          componentProps: {
            placeholder: '请选择交易对手',
            mode: 'multiple',
          },
          formBinderProps: {
            name: 'same_ppl',
            message: '请选择正确的格式!',
          },
          dataSource: [
            {
              label:'本人',
              value:1
            },
            {
              label:'他人',
              value:2
            },
            {
              label:'未知',
              value:3
            }
          ]
        },
        {
          label:'网点过滤'
        },
        {
          label: '交易机构号',
          component: 'Select',
          componentProps: {
            placeholder: '请输入交易机构号',
            mode: 'tag',
            visible: false,  //当前弹层是否显示,
            hasArrow: false  //是否显示下拉箭头
          },
          formBinderProps: {
            name: 'trx_branch_num',
            message: '请输入正确的交易机构号!',
          },
          dataSource: []
        },
        {
          label: '交易机构名称',
          component: 'Select',
          componentProps: {
            placeholder: '请输入交易机构名称',
            mode: 'tag',
            visible: false,  //当前弹层是否显示,
            hasArrow: false  //是否显示下拉箭头
          },
          formBinderProps: {
            name: 'trx_branch',
            message: '请输入正确的交易机构名称!',
          },
          dataSource: []
        },
        {
          label: '交易柜员号',
          component: 'Select',
          componentProps: {
            placeholder: '请输入交易柜员号',
            mode: 'tag',
            visible: false,  //当前弹层是否显示,
            hasArrow: false  //是否显示下拉箭头
          },
          formBinderProps: {
            name: 'teller_code',
            message: '请输入正确的交易柜员号!',
          },
          dataSource: []
        },
      ]
    };
    this.onRef = this.onRef.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }


  formChange = (value) => {
    // console.log('value', value);
    console.log(value);
    this.setState({
      value,
    });
  };

  onRef(ref) {
    this.customForm = ref;
  }

  handleSubmit() {
    this.customForm.handleSubmit();
  }

  resetForm() {
    this.customForm.resetForm();
    this.props.resetSearch();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: Object.assign({}, nextProps.values),
    });
  }

  componentDidMount() {
    this.getCurrencies()
  }

  getCurrencies = () => {
    ajaxs.get(`/cases/${this.props.caseId}/bbills/currencies`).then(res => {
      if (res.meta && res.meta.success) {
        const {formConfig} = this.state;
        let data = [];
        const windowCurrencies = {}
        res.data.forEach(item => {
          windowCurrencies[item.symbol] = item.name;
          data.push({
            label: item.name,
            value: item.symbol
          })
        })
        window.currencies = windowCurrencies;
        _.find(formConfig, (x, index) => {
          if (x.label === '交易币种') {
            x.dataSource = data
          }
          return x.label === '交易币种'
        })

        this.setState({
          formConfig
        })

      }
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    const renderFooter = () => {
      return (
        <div>
          <Button
            type="primary"

            style={styles.submitButton}
            onClick={this.handleSubmit}
          >
            确 定
          </Button>
          <Button
            type="secondary"

            style={styles.submitButton2}
            onClick={this.resetForm}
          >
            重 置
          </Button>
          <Button
            type="normal"

            style={styles.submitButton2}
            onClick={() => {
              this.props.onClose();
            }}
          >
            取 消
          </Button>
        </div>
      )
    }
    return (
      <Dialog
        visible={this.props.visible}
        onOk={this.props.onClose}
        closeable="esc,mask,close"
        onCancel={this.props.onClose}
        onClose={this.props.onClose}
        footer={renderFooter()}
        title="更多筛选条件"
      >
        <IceContainer style={styles.container}>
          <CustomForm
            onRef={this.onRef}
            config={this.state.formConfig}
            value={this.state.value}
            formChange={this.formChange}
            onClose={this.props.onClose}
            addConditions={this.props.addConditions}
            getAlyzDayData={this.props.getAlyzDayData}
            onFormChange={this.props.onFormChange}
          />

        </IceContainer>
      </Dialog>

    );
  }
}

const styles = {
  container: {
    maxWidth: '1000px',
  },
  formContent: {
    marginLeft: '0',
  },
  formItem: {
    marginBottom: '25px',
    display: 'flex',
    alignItems: 'center',
  },
  formLabel: {
    width: '70px',
    marginRight: '15px',
    textAlign: 'right',
  },
  formError: {
    display: 'none',
    marginLeft: '10px',
    width: '96px',
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
  }),
  // mapDispatchToProps
  dispatch => ({
  }),
)(AdvancedSearch);
