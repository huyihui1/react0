/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Dialog } from '@alifd/next';
import IceContainer from '@icedesign/container';
import CustomForm from './CustomForm';

import {
  Input,
  Button,
  Select,
  DatePicker,
  Radio,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';

const { Option } = Select;
const { Group: RadioGroup } = Radio;
const formConfig = [
  {
    label: '号码过滤',
  },
  // {
  //   label: '本方号码',
  //   component: 'Select',
  //   componentProps: {
  //     placeholder: '请输入本方号码',
  //     showSearch: true,
  //     mode: 'tag',
  //   },
  //   formBinderProps: {
  //     name: 'owner_num',
  //     required: false,
  //   },
  //   dataSource: [],
  // },
  // {
  //   label: '对方号码',
  //   component: 'Select',
  //   componentProps: {
  //     placeholder: '请输入对方号码',
  //     showSearch: true,
  //     mode: 'tag',
  //     useVirtual: true,
  //   },
  //   formBinderProps: {
  //     name: 'peer_num',
  //     required: false,
  //   },
  //   dataSource: [],
  // },
  {
    label: '对方号码类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择对方号码类型',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'peer_num_type',
      required: false,
      message: '请输入正确的号码类型',
    },
    dataSource: [
      {
        label: '其他',
        value: 0,
      },
      {
        label: '移动手机',
        value: 11,
      },
      {
        label: '电信手机',
        value: 21,
      },
      {
        label: '联通手机',
        value: 31,
      },
      {
        label: '固话',
        value: 61,
      },
    ],
  },
  {
    label: '号码归属地',
    component: 'Select',
    componentProps: {
      placeholder: '请输入号码归属地',
      mode: 'tag',
    },
    formBinderProps: {
      name: 'peer_num_attr',
      required: false,
      message: '请输入正确的号码归属地',
    },
    dataSource: [],
  },
  {
    label: '时间过滤',
  },
  {
    label: '名义日期',
    component: 'MultipleDateSelect',
    componentProps: {
      placeholder: '请输入名义日期',
      disabledDate: null,
      disabled: true,
    },
    formBinderProps: {
      name: 'alyz_day',
      required: false,
      message: '请输入正确的名义日期',
    },
    mode: {},
  },
  {
    label: '日期时间',  // ???
    component: 'MultipleDateSelect',
    componentProps: {
      placeholder: '请输入日期时间',
      showTime: true
    },
    formBinderProps: {
      name: 'started_at',
      required: false,
      message: '请输入正确的日期时间',
    },
    mode: {
      placeholder: '请输入日期时间',
      showTime: true
    }
  },
  {
    label: '实际日期',  // ???
    component: 'MultipleDateSelect',
    componentProps: {
      placeholder: '请输入实际日期',
    },
    formBinderProps: {
      name: 'started_day',
      required: false,
      message: '请输入正确的实际日期',
    },
    mode: {
      placeholder: '请输入实际日期',
      showTime: false
    }
  },
  {
    label: '周几',  // ???
    component: 'Select',
    componentProps: {
      placeholder: '请选择周几',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'weekday',
      required: false,
      message: '请输入正确的周几',
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
    label: '时间', // ???
    component: 'Select',
    componentProps: {
      placeholder: '请输入时间, 例如09:00或09:00-11:30',
      mode: 'tag',
      // visible: false,
    },
    formBinderProps: {
      name: 'started_time',
      required: false,
      message: '请输入正确的时间',
    },
    dataSource: []
  },
  {
    label: '时间类别',
    component: 'Select',
    componentProps: {
      placeholder: '请输入时间类别',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'started_time_l1_class',
      required: false,
      message: '请输入正确的时间类别',
    },
    dataSource: [
      {
        label: '早晨',
        value: 0,
      },
      {
        label: '上午',
        value: 1,
      },
      {
        label: '中午',
        value: 2,
      },
      {
        label: '下午',
        value: 3,
      },
      {
        label: '傍晚',
        value: 4,
      },
      {
        label: '晚上',
        value: 5,
      },
      {
        label: '深夜',
        value: 6,
      },
      {
        label: '凌晨',
        value: 7,
      },

    ],
  },
  {
    label: '时间类别（详细）',
    component: 'Select',
    componentProps: {
      placeholder: '请输入时间类别',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'started_time_l2_class',
      required: false,
      message: '请输入正确的时间类别',
    },
    dataSource: [
      {
        label: '4:30~6:20',
        value: 0,
      },
      {
        label: '6:21~7:10',
        value: 1,
      },
      {
        label: '7:11~7:50',
        value: 2,
      },
      {
        label: '7:51~8:25',
        value: 3,
      },
      {
        label: '8:26~11:00',
        value: 4,
      },
      {
        label: '11:01~11:30',
        value: 5,
      },
      {
        label: '11:31~12:30',
        value: 6,
      },
      {
        label: '12:31~13:20',
        value: 7,
      },
      {
        label: '13:21~14:00',
        value: 8,
      },
      {
        label: '14:01~16:50',
        value: 9,
      },
      {
        label: '16:51~17:40',
        value: 10,
      },
      {
        label: '17:41~18:50',
        value: 11,
      },
      {
        label: '18:51~20:00',
        value: 12,
      },
      {
        label: '20:01~21:50',
        value: 13,
      },
      {
        label: '21:51~23:59',
        value: 14,
      },
      {
        label: '0点~4:29',
        value: 15,
      },
    ],
  },
  {
    label: '时间类别（小时）',
    component: 'Select',
    componentProps: {
      placeholder: '请输入时间类别',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'started_hour_class',
      required: false,
      message: '请输入正确的时间类别',
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
      required: false,
      message: '请输入正确的时间性质',
    },
    dataSource: [
      {
        label: '私人时间',
        value: 0,
      },
      {
        label: '工作时间',
        value: 1,
      },
    ],
  },
  {
    label: '通话过滤',
  },
  {
    label: '计费类型',
    component: 'Select',
    componentProps: {
      placeholder: '请输入计费类型',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'bill_type',
      required: false,
      message: '请输入计费类型',
    },
    dataSource: [
      {
        label: '通话',
        value: 1,
      },
      {
        label: '短信',
        value: 2,
      },
      {
        label: '彩信',
        value: 3,
      },
    ],
  },
  {
    label: '时长',
    component: 'Select',
    componentProps: {
      placeholder: '请输入时长, 例如120或300-500',
      mode: 'tag',
    },
    formBinderProps: {
      name: 'duration',
      required: false,
      message: '请输入正确的时长',
    },
    dataSource: [],
  },
  {
    label: '时长类别',
    component: 'Select',
    componentProps: {
      placeholder: '请输入时长类别',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'duration_class',
      required: false,
      message: '请输入正确的时长类别',
    },
    dataSource: [
      {
        label: '其他',
        value: 0,
      },
      {
        label: '1~15秒',
        value: 1,
      },
      {
        label: '16~90秒',
        value: 2,
      },
      {
        label: '1.5~3分',
        value: 3,
      },
      {
        label: '3~5分',
        value: 4,
      },
      {
        label: '5~10分',
        value: 5,
      },
      {
        label: '>10分',
        value: 6,
      },
    ],
  },
  {
    label: '联系类型',
    component: 'Select',
    componentProps: {
      placeholder: '请输入联系类型',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'comm_direction',
      required: false,
      message: '请输入正确的联系类型',
    },
    dataSource: [
      {
        label: '未知',
        value: 0,
      },
      {
        label: '主叫',
        value: 11,
      },
      {
        label: '<---',
        value: 12,
      },
      {
        label: '呼转',
        value: 13,
      },
      {
        label: '主短',
        value: 21,
      },
      {
        label: '被短',
        value: 22,
      },
      {
        label: '主彩',
        value: 31,
      },
      {
        label: '被彩',
        value: 32,
      },
    ],
  },
  {
    label: '长途标志',
    component: 'Select',
    componentProps: {
      placeholder: '请选择长途标志',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'long_dist',
      required: false,
      message: '请输入正确的长途标志',
    },
    dataSource: [
      {
        label: '否',
        value: 0,
      },
      {
        label: '是',
        value: 1,
      },
    ],
  },
  {
    label: '虚拟标志',
    component: 'Select',
    componentProps: {
      placeholder: '请选择虚拟标志',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'ven',
      required: false,
      message: '请输入正确的虚拟标志',
    },
    dataSource: [
      {
        label: '否',
        value: 0,
      },
      {
        label: '是',
        value: 1,
      },
    ],
  },
  {
    label: '通话状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择通话状态',
      mode: 'multiple',
    },
    formBinderProps: {
      name: 'owner_num_status',
      required: false,
      message: '请输入正确的通话状态',
    },
    dataSource: [
      {
        label: '其他',
        value: 0,
      },
      {
        label: '本地',
        value: 1,
      },
      {
        label: '漫游',
        value: 2,
      },
    ],
  },
  {
    label: '位置过滤',
  },
  {
    label: '基站',
    component: 'Select',
    l: 24,
    componentProps: {
      placeholder: '请输入基站',
      mode: 'tag',
    },
    formBinderProps: {
      name: 'owner_ct_code',
      required: false,
      message: '请输入正确的基站',
    },
    dataSource: [],
  },
  {
    label: 'LAC', // ???
    component: 'Select',
    componentProps: {
      placeholder: '请输入位置区号',
      mode: 'tag',
    },
    formBinderProps1: {
      name: 'lacFmt',
    },
    formBinderProps: {
      name: 'owner_lac',
      required: false,
      message: '请输入正确的位置区号',
    },
    dataSource: []
  },
  {
    label: 'CI', // ???
    component: 'Select',
    componentProps: {
      placeholder: '请输入小区号',
      mode: 'tag',
    },
    formBinderProps1: {
      name: 'ciFmt',
    },
    formBinderProps: {
      name: 'owner_ci',
      required: false,
      message: '请输入正确的小区号',
    },
    dataSource: []
  },
  {
    label: '本方通话地',
    component: 'Select',
    componentProps: {
      placeholder: '请输入本方通话地',
      mode: 'tag',
    },
    formBinderProps: {
      name: 'owner_comm_loc',
      required: false,
      message: '请输入正确的本方通话地',
    },
    dataSource: []
  },
  {
    label: '对方通话地',
    component: 'Select',
    componentProps: {
      placeholder: '请输入对方通话地',
      mode: 'tag',
    },
    formBinderProps: {
      name: 'peer_comm_loc',
      required: false,
      message: '请输入正确的对方通话地',
    },
    dataSource: [],
  },
];

export default class AdvancedSearch extends Component {
  static displayName = 'AdvancedSearch';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {},
    };
    this.onRef = this.onRef.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }


  formChange = (value) => {
    // console.log('value', value);
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
    // formConfig[1].dataSource = nextProps.dataSource.ownerNums;
    // formConfig[2].dataSource = nextProps.dataSource.ownerNums;
    this.setState({
      value: Object.assign({}, nextProps.values),
    });
  }

  render() {
    //value={this.state.value}
    //onChange={this.formChange}
    const config = formConfig;
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
            config={config}
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
