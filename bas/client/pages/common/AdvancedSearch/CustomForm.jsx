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
import moment from 'moment';
import MultipleDateSelect from '../../common/SearchBox/MultipleDateSelect';
import CtCodeSelect from '../../common/SearchBox/CtCodeSelect';
import TimeSelect from '../../common/AdvancedSearch/TimeSelect';

import {renameLabel} from '../../../utils/utils';

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
    this.props.formChange({});
  }

  handleSubmit = (e) => {
    // e.preventDefault();
    this.refs.form.validateAll((errors, values) => {
      this.props.onClose && this.props.onClose();
      if (values.started_time) {
        let newArr = [];
        values.started_time.forEach(item => {
          if (item.split('-').length !== 2) {
            item = `${item}-${item}`;
          }
          newArr = [...newArr, item];
        });
        values.started_time = newArr;
      }
      if (values.duration) {
        let newArr = [];
        values.duration.forEach(item => {
          if (item.split('-').length !== 2) {
            item = `${item}-${item}`;
          }
          newArr = [...newArr, item];
        });
        values.duration = newArr;
      }
      console.log(values);
      this.props.addConditions(renameLabel({...values}), values);
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
    if (item.label === 'CI' || item.label === 'LAC') {
      return (
        <Col l={item.l || 12} key={item.label}>
          <div style={item.l ? styles.formItem2 : styles.formItem}>
            <span style={styles.formLabel}>{item.label}：</span>
            <IceFormBinder name={item.label === 'CI' ? 'owner_ci_type' : 'owner_lac_type'}>
              <Select style={{width: '5%', minWidth: '70px'}}>
                <Option value="包含">
                  包含
                </Option>
                <Option value="排除">
                  排除
                </Option>
              </Select>
            </IceFormBinder>
            <IceFormBinder {...item.formBinderProps}>
              {/*<Select {...item.componentProps} style={{width: '95%'}} hasClear onKeyDown={this.onKeyDown}>*/}
              {/*{*/}
              {/*Array.isArray(item.dataSource) && item.dataSource.map((data, index) => {*/}
              {/*return (*/}
              {/*<Option value={`${data.value}-${data.label}`} key={data.label + index}>*/}
              {/*{data.label}*/}
              {/*</Option>*/}
              {/*);*/}
              {/*})*/}
              {/*}*/}
              {/*</Select>*/}
              <TimeSelect name={item.formBinderProps.name}
                          values={this.props.value}
                          onFormChange={this.formChange}
                          onChangeTipc={this.onChangeTipc}
                          placeholder={item.componentProps.placeholder}
              />
            </IceFormBinder>
            <IceFormBinder {...item.formBinderProps1}>
              <Select style={{width: '5%', minWidth: '85px'}}>
                <Option value="10进制">
                  10进制
                </Option>
                <Option value="16进制">
                  16进制
                </Option>
              </Select>
            </IceFormBinder>
          </div>
        </Col>
      );
    }
    if (item.label === '基站') {
      return (
        <Col l={item.l || 12} key={item.label}>
          <div style={item.l ? styles.formItem2 : styles.formItem}>
            <span style={styles.formLabel}>{item.label}：</span>
            <IceFormBinder name={"owner_ct_code_type"}>
              <Select style={{width: '5%', minWidth: '70px'}}>
                <Option value="包含">
                  包含
                </Option>
                <Option value="排除">
                  排除
                </Option>
              </Select>
            </IceFormBinder>
            <IceFormBinder {...item.formBinderProps}>
              <CtCodeSelect name={item.formBinderProps.name}
                            values={this.props.value}
                            onFormChange={this.formChange}/>
            </IceFormBinder>
          </div>
        </Col>
      )
    }
    if (item.label === '本方通话地') {
      return (
        <Col l={item.l || 12} key={item.label}>
          <div style={item.l ? styles.formItem2 : styles.formItem}>
            <span style={styles.formLabel}>{item.label}：</span>
            <IceFormBinder name={"owner_loc_type"}>
              <Select style={{width: '5%', minWidth: '70px'}}>
                <Option value="包含">
                  包含
                </Option>
                <Option value="排除">
                  排除
                </Option>
              </Select>
            </IceFormBinder>
            <IceFormBinder {...item.formBinderProps}>
              <Select {...item.componentProps} style={{width: '90%'}} hasClear>
                {
                  Array.isArray(item.dataSource) && item.dataSource.map((data, index) => {
                    return (
                      <Option value={`${data.value}-${data.label}`} key={data.label + index}>
                        {data.label}
                      </Option>
                    );
                  })
                }
              </Select>
            </IceFormBinder>
          </div>
        </Col>
      );
    }
    if (item.label === '对方通话地') {
      return (
        <Col l={item.l || 12} key={item.label}>
          <div style={item.l ? styles.formItem2 : styles.formItem}>
            <span style={styles.formLabel}>{item.label}：</span>
            <IceFormBinder name="peer_loc_type">
              <Select style={{width: '5%', minWidth: '70px'}}>
                <Option value="包含">
                  包含
                </Option>
                <Option value="排除">
                  排除
                </Option>
              </Select>
            </IceFormBinder>
            <IceFormBinder {...item.formBinderProps}>
              <Select {...item.componentProps} style={{width: '90%'}} hasClear>
                {
                  Array.isArray(item.dataSource) && item.dataSource.map((data, index) => {
                    return (
                      <Option value={`${data.value}-${data.label}`} key={data.label + index}>
                        {data.label}
                      </Option>
                    );
                  })
                }
              </Select>
            </IceFormBinder>
          </div>
        </Col>
      );
    }
    if (item.label === '时长' || item.label === '时间') {
      return (
        <Col l={item.l || 12} key={item.label}>
          <div style={item.l ? styles.formItem : styles.formItem}>
            <span style={styles.formLabel}>{item.label}：</span>
            <IceFormBinder {...item.formBinderProps}>
              <TimeSelect name={item.formBinderProps.name}
                          values={this.props.value}
                          onFormChange={this.formChange}
                          onChangeTipc={this.onChangeTipc}
                          placeholder={item.componentProps.placeholder}
              />
            </IceFormBinder>
          </div>
        </Col>
      )
    }
    return (
      <Col l={item.l || 12} key={item.label}>
        <div style={item.l ? styles.formItem : styles.formItem}>
          <span style={styles.formLabel}>{item.label}：</span>
          <IceFormBinder {...item.formBinderProps}>
            {/* <Select {...item.componentProps} style={{ width: '100%' }} hasClear onSearch={(val) => { this.onSelectChange(val, item.formBinderProps.name); }}> */}
            <Select {...item.componentProps} style={{width: '100%'}} hasClear>
              {
                Array.isArray(item.dataSource) && item.dataSource.map((data, index) => {
                  if (item.label === '本方号码' || item.label === '对方号码') {
                    return (
                      <Option value={data} key={data + index}>
                        {data}
                      </Option>
                    );
                  }
                  return (
                    <Option value={`${data.value}-${data.label}`} key={data.label + index}>
                      {data.label}
                    </Option>
                  );
                })
              }
            </Select>
          </IceFormBinder>
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
  }

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
                <MultipleDateSelect values={this.props.value} mode={item.mode} name={item.formBinderProps.name}
                                    getAlyzDayData={this.getAlyzDayData}/>
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
    top: '32px',
    color: '#f76048',
    width: '200px',
    left: '140px',
  },
};

export default CustomForm;
