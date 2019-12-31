/* eslint react/no-string-refs:0, array-callback-return:0, react/forbid-prop-types:0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Input,
  Button,
  Grid,
  Select,
  DatePicker,
  TimePicker,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import MultipleDateSelect from './MultipleDateSelect';
import SelectTag from './SelectTag'
import AccountNumberSelector from '../SearchBox/OwnerAccountNumberSelector';
import PeerAccountNumberSelector from '../SearchBox/PeerAccountNumberSelector';
import BBNamesSelector from '../SearchBox/BBNamesSelector';
import SingleSelect from './SingleSelect';


const {Row, Col} = Grid;
const {Option} = Select;
const {RangePicker} = DatePicker;

class CustomForm extends Component {
  static displayName = 'CustomForm';

  static propTypes = {
    value: PropTypes.object.isRequired,
    config: PropTypes.array.isRequired,
    handleSubmit: PropTypes.func,
    formChange: PropTypes.func,
    handleReset: PropTypes.func,
    extraContent: PropTypes.element,
  };

  static defaultProps = {
    extraContent: null,
    handleReset: () => {
    },
    handleSubmit: () => {
    },
    formChange: () => {
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      values: {},
    };
  }

  onKeyDown = (e) => {
    return
  };

  formChange = (value) => {
    this.props.formChange(value);
  };

  resetForm = () => {
    this.props.formChange({
      trx_direction: [1, 2],
      'order-by': 'trx_full_time',
    });
  };

  handleSubmit = (e) => {
    // e.preventDefault();
    this.refs.form.validateAll((errors, values) => {
      this.props.onClose && this.props.onClose();
      // if (values.trx_day) {
      //   let newArr = [];
      //   values.trx_day.forEach(item => {
      //     if (item.split('-').length !== 2) {
      //       item = `${item}-${item}`;
      //     }
      //     newArr = [...newArr, item];
      //   });
      //   values.trx_day = newArr;
      // }
      // if (values.duration) {
      //   let newArr = [];
      //   values.duration.forEach(item => {
      //     if (item.split('-').length !== 2) {
      //       item = `${item}-${item}`;
      //     }
      //     newArr = [...newArr, item];
      //   });
      //   values.duration = newArr;
      // }
      this.props.addConditions(JSON.parse(JSON.stringify(values)));
    });
  };

  // onKeyDown(e) {
  //   console.log(e.keyCode);
  // }

  onSelectChange(val, key) {
    const {values} = this.state;
    values[key] = values[key] ? values[key] : [];
    if (val.indexOf(',') > -1) {
      const temp = val.split(/[\n,]/g);
      for (let i = 0; i < temp.length; i += 1) {
        if (temp[i] === '') {
          temp.splice(i, 1);
          // 删除数组索引位置应保持不变
          i--;
        }
      }
      values[key] = [...values[key], ...temp];
      this.setState({
        values,
      });
    }
  }

  renderInput = (item) => {
    return (
      <Col l={item.l || 12} key={item.label}>
        <div style={item.l ? styles.formItem2 : styles.formItem}>
          <span style={styles.formLabel}>{item.label}：</span>
          <IceFormBinder {...item.formBinderProps}>
            <Input {...item.componentProps} style={{width: '100%'}}/>
          </IceFormBinder>
          <div style={styles.formError}>
            <IceFormError name={item.formBinderProps.name}/>
          </div>
        </div>
      </Col>
    );
  };

  renderCheckbox = (item) => {
    return (
      <Col l="8" key={item.label}>
        <div style={styles.formItem}>
          <IceFormBinder {...item.formBinderProps}>
            <Checkbox {...item.componentProps}>{item.label}</Checkbox>
          </IceFormBinder>
        </div>
      </Col>
    );
  };

  renderDatePicker = (item) => {
    return (
      <Col l={item.l || 12} key={item.label}>
        <div style={item.l ? styles.formItem2 : styles.formItem}>
          <span style={styles.formLabel}>{item.label}：</span>
          <IceFormBinder {...item.formBinderProps}>
            {
              item.mode ? <DatePicker.RangePicker {...item.componentProps} style={{width: '100%'}}/> :
                <DatePicker {...item.componentProps} style={{width: '100%'}}/>
            }
          </IceFormBinder>
        </div>
      </Col>
    );
  };


  renderSelect = (item) => {
    if (item.label === '时间' || item.label === '交易金额' || item.label === '余额') {
      return (
        <Col l={item.l || 12} key={item.label}>
          <div style={item.l ? styles.formItem : styles.formItem}>
            <span style={styles.formLabel}>{item.label}：</span>
            <IceFormBinder {...item.formBinderProps}>
              <SelectTag name={item.formBinderProps.name} componentProps={item.componentProps} values={this.props.value}
                         onFormChange={this.formChange}
              />
            </IceFormBinder>
          </div>
        </Col>
      );
    }

    if (item.label === '本方账户') {
      return (
        <Col l={item.l || 12} key={item.label}>
          <div style={item.l ? styles.formItem : styles.formItem}>
            <label style={styles.label}>
              <span style={styles.formLabel}>{item.label}：</span>
              <IceFormBinder {...item.formBinderProps}>
                <AccountNumberSelector name={item.formBinderProps.name} values={this.props.value}
                                       onFormChange={this.formChange} noClear={true}/>
              </IceFormBinder>
            </label>
          </div>
        </Col>
      );
    }

    if (item.label === '对方账户') {
      return (
        <Col l={item.l || 12} key={item.label}>
          <div style={item.l ? styles.formItem : styles.formItem}>
            <label style={styles.label}>
              <span style={styles.formLabel}>{item.label}：</span>
              <IceFormBinder {...item.formBinderProps}>
                <PeerAccountNumberSelector name={item.formBinderProps.name} values={this.props.value}
                                       onFormChange={this.formChange} noClear={true} />
              </IceFormBinder>
            </label>
          </div>
        </Col>
      );
    }

    if (item.label === '本方户名' || item.label === '对方户名') {
      return (
        <Col l={item.l || 12} key={item.label}>
          <div style={item.l ? styles.formItem : styles.formItem}>
            <label style={styles.label}>
              <span style={styles.formLabel}>{item.label}：</span>
              <IceFormBinder {...item.formBinderProps}>
                <BBNamesSelector {...item.componentProps}
                                 name={item.formBinderProps.name}
                                 values={this.props.value} onFormChange={this.formChange}
                                 styles={{...styles.input, width: '99%'}}/>
              </IceFormBinder>
            </label>
          </div>
        </Col>
      );
    }

    if (item.label === '交易额是否为整数') {
      return (
        <Col l={item.l || 12} key={item.label}>
          <div style={item.l ? styles.formItem : styles.formItem}>
            <label style={styles.label}>
              <span style={styles.formLabel}>{item.label}：</span>
              <IceFormBinder {...item.formBinderProps}>
                <SingleSelect componentProps={item.componentProps}
                              name={item.formBinderProps.name}
                              values={this.props.value}
                              onFormChange={this.formChange}
                              dataSource={item.dataSource}
                />
              </IceFormBinder>
            </label>
          </div>
        </Col>
      )
    }


    return (
      <Col l={item.l || 12} key={item.label}>
        <div style={item.l ? styles.formItem : styles.formItem}>
          <span style={styles.formLabel}>{item.label}：</span>
          <IceFormBinder {...item.formBinderProps}>
            <Select {...item.componentProps} style={{width: '100%', position: 'relative'}} hasClear>
              {
                Array.isArray(item.dataSource) && item.dataSource.map((data, index) => {
                  return (
                    <Option value={data.value} key={data.label + index}>
                      {data.label}
                    </Option>
                  );
                })
              }
            </Select>
          </IceFormBinder>
          {/*<IceFormError name={item.formBinderProps.name} style={styles.formError} />*/}
        </div>
      </Col>
    );
  };
  renderTitle = (item) => {
    return (
      <Col l="24" key={item.label}>
        <h3 style={item.l ? styles.formTitle2 : styles.formTitle}>{item.label}</h3>
      </Col>
    );
  }
  renderTimePicker = (item) => {
    return (
      <Col l={item.l || 12} key={item.label}>
        <div style={item.l ? styles.formItem2 : styles.formItem}>
          <span style={styles.formLabel}>{item.label}：</span>
          <IceFormBinder {...item.formBinderProps}>
            <TimePicker {...item.componentProps} style={{width: '100%'}}/>
          </IceFormBinder>
        </div>
      </Col>
    );
  };


  renderFromItem = (config) => {
    return config.map((item) => {
      if (item.component === 'Input') {
        return this.renderInput(item);
      } else if (item.component === 'Checkbox') {
        return this.renderCheckbox(item);
      } else if (item.component === 'Select') {
        return this.renderSelect(item);
      } else if (item.component === 'RangePicker') {
        return this.renderDatePicker(item);
      } else if (item.component === 'TimePicker') {
        return this.renderTimePicker(item);
      } else if (item.component === 'MultipleDateSelect') {
        return (
          <Col l={item.l || 12} key={item.label}>
            <div style={item.l ? styles.formItem2 : styles.formItem}>
              <span style={styles.formLabel}>{item.label}：</span>
              <IceFormBinder {...item.formBinderProps}>
                <MultipleDateSelect name={item.formBinderProps.name} componentProps={item.componentProps}
                                    values={this.props.value}
                                    onFormChange={this.formChange} styles={{width: '100%'}}/>
              </IceFormBinder>
            </div>
          </Col>
        );
      }
      return this.renderTitle(item);
    });
  };
  getAlyzDayData = (key, val) => {
    const {values} = this.state;
    values[key] = val;
    this.formChange(values);
    this.setState({
      values,
    });
  }

  componentWillReceiveProps(nextProps) {
    const {value} = nextProps;
    if (JSON.parse(JSON.stringify(nextProps.value)) !== JSON.parse(JSON.stringify(this.state.values))) {
      this.setState({
        values: {...nextProps.value},
      });
    }
  }

  componentDidMount() {
    this.setState({
      values: {...this.props.value},
    });
    this.props.onRef(this);
  }

  render() {
    const {config} = this.props;
    const {values} = this.state;

    return (
      <div style={styles.formContainer}>
        <IceFormBinderWrapper
          value={values}
          onChange={this.formChange}
          ref="form"
        >
          <div style={styles.formItems}>
            <Row wrap gutter={40}>
              {this.renderFromItem(config)}
            </Row>
            {/* <div style={{textAlign:"right"}}> */}
            {/* <Button */}
            {/* type="primary" */}
            {/*  */}
            {/* style={styles.submitButton} */}
            {/* onClick={this.handleSubmit} */}
            {/* > */}
            {/* 确 定 */}
            {/* </Button> */}
            {/* <Button */}
            {/* type="secondary" */}
            {/*  */}
            {/* style={styles.submitButton2} */}
            {/* onClick={this.resetForm} */}
            {/* > */}
            {/* 重 置 */}
            {/* </Button> */}
            {/* </div> */}
          </div>
        </IceFormBinderWrapper>
      </div>
    );
  }
}

const styles = {
  formContainer: {
    position: 'relative',
    background: '#fff',
  },
  formItem: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
    position: 'relative'
  },
  formItem2: {
    marginTop: '10px',
    flexDirection: 'column',
  },
  formLabel: {
    display: 'inline-block',
    minWidth: '130px',
    textAlign: 'right',
  },
  buttons: {
    margin: '10px 0 20px',
    textAlign: 'center',
  },
  submitButton: {
    marginLeft: '85px',
  },
  submitButton2: {
    marginLeft: '15px',
  },
  formTitle: {
    color: '#2077ff',
    margin: '0 0 20px',
    paddingBottom: '10px',
    fontSize: '14px',
    borderBottom: '1px solid #2077ff',
    fontWeight: 700,
  },
  formTitle2: {
    color: '#2077ff',
    margin: '10px 0',
    paddingBottom: '10px',
    fontSize: '14px',
    borderBottom: '1px solid #2077ff',
    fontWeight: 700,
  },
  formError: {
    position: 'absolute',
    top: '34px',
    color: '#f76048',
    width: '200px',
    left: '140px',
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    // whiteSpace: 'nowrap',
    alignItems: 'center',
    width:'100%'
  },
};

export default CustomForm;
