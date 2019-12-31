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

import { actions } from '../../../../../stores/labelPN/index';
import { actions as citizensActions } from '../../../../../stores/citizens/index';
import { actions as labelCellActions } from '../../../../../stores/labelCell/index';

import DailyCallChart from '../../../../PBAnalyze/components/DailyCallChart';
import DistributionOfCallsChart from '../../../../PBAnalyze/components/DistributionOfCallsChart';
import CodeAndstartedhourLimit25class from '../../../../PBStat/components/CodeAndstartedhourLimit25class';
import PeerNumExclusionCondition from '../../../../PBStat/components/PeerNumExclusionCondition';
import Related from '../../../../PBStat/components/Related';
import RelatedWithLabel from '../../../../PBStat/components/RelatedWithLabel';

import labelColorsConfig from '../../../../../labelColorsConfig';
import appConfig from '../../../../../appConfig';
import ajaxs from '../../../../../utils/ajax';

// import './style.css';

const colors = labelColorsConfig.colors;
const { Option } = Select;

class NumberLabel extends Component {
  static displayName = 'NumberLabel';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      values: {
        label_bg_color: colors[0],
        label_txt_color: '#fff',
        color_order: 1,
      },
      labelGroup: [],
      labelPNs: [],
      criteria: null,
      codeCriteria: null,
      caseId: null,
      summaryDate: null,
      summary: null,
      venNumbersList: [],
      activeCitizensKey: 0,
      activeChartKey: 0,
      sn: null,
      citizens: [],
      tableTitle: [],
      numsInfo: [],
      loc: '',
      numMemo: '',
      isCitizenLoading: true,
      numsInfoLoading: true
    };
    this.changeColor = this.changeColor.bind(this);
    this.fetchLabelGroup = this.fetchLabelGroup.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.findActiveItem = this.findActiveItem.bind(this);
    this.fetchCitizen = this.fetchCitizen.bind(this);
    this.handleSummary = this.handleSummary.bind(this);
    this.fetchVenNumbers = this.fetchVenNumbers.bind(this);
    this.fetchSmartLookup = this.fetchSmartLookup.bind(this);
    this.tableColumnRender = this.tableColumnRender.bind(this);
  }

  formChange = (values) => {
    // console.log('values', values);
    // this.setState({
    //   values,
    // });
  };

  onCitizensChange = (activeKey) => {
    this.setState({ activeCitizensKey: activeKey });
  }
  onChartChange = (activeKey) => {
    if (activeKey === '0') {

    }
    this.setState({ activeChartKey: activeKey });
  }

  fetchData(caseId = this.props.caseId) {
    const { actions, labelPN } = this.props;
    console.log(actions);
    if (!labelPN) {
      actions.fetchLargeLabelPN({ caseId }, {
        query: {
          page: 1,
          pagesize: appConfig.largePageSize,
        },
      }).then(res => {
        if (res.body.meta && res.body.meta.success) {
          this.setState({
            labelPNs: res.body.data,
          });
        } else {
          console.error(res.body);
        }
      }).catch(err => {
        console.log(err);
      });
    }

    actions.fetchLabelCells({ caseId }, {
      query: {
        page: 1,
        pagesize: appConfig.largePageSize
      },
    });
    this.setState({
      caseId,
    });
  }

  fetchVenNumbers(caseId) {
    ajaxs.get(`/cases/${caseId}/ven_numbers/networks`).then(res => {
      if (res.meta && res.meta.success) {
        this.setState({
          venNumbersList: res.data,
        });
      }
    }).catch(err => {
      console.log(err);
    });
  }

  onVenNumbersSubmit = () => {
    const { values } = this.state;
    if (values.short_num && values.num && values.network) {
      ajaxs.post(`/cases/${this.props.caseId}/ven_numbers`, {
        network: values.network,
        short_num: values.short_num,
        num: values.num,
      }).then(res => {
        if (res.meta && res.meta.success) {
          Message.success('添加成功');
        } else {
          Message.error('添加失败');
        }
      }).catch(err => {
        console.log(err);
        Message.error('添加失败');
      });
    } else {
      Message.error('长号、短号或虚拟网名称未填写');
    }
  }

  validateAllFormField = () => {
    const { caseId, isEdit, actions, onClose } = this.props;

    this.refs.form.validateAll((errors, values) => {
      // if (errors) {
      //   console.log({ errors });
      //   Message.error('提交失败');
      //   return;
      // }
      values = Object.assign({}, values);
      delete values.network;
      delete values.short_num;
      if (values.id) {
        Message.loading({
          title: '修改中...',
          duration: 0,
        });
        values.ptags = JSON.stringify(values.ptags);
        actions.updateLabelPN({ ...values, caseId, itemId: values.id })
          .then(res => {
            if (res.status === 'resolved' && res.body.meta && res.body.meta.success) {
              Message.success('修改成功...');
              actions.setLabelPN(res.body.data);
              this.props.labelPNs.items.forEach((item, index) => {
                if (item.id === res.body.data.id) {
                  // res.body.data.ptags = JSON.stringify(res.body.data.ptags);
                  this.props.labelPNs.items[index] = res.body.data;
                  actions.setItemsLabelPN(this.props.labelPNs.items);
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
        actions.createLabelPN({ ...values, caseId })
          .then(res => {
            if (res.status === 'resolved' && res.res.body.meta.success) {
              values.id = res.body.id;
              values.ptags = JSON.parse(values.ptags)
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

  fetchLabelGroup(caseId) {
    ajaxs.get(`/cases/${caseId}/pnum_labels/label-group`).then(res => {
      this.setState({
        labelGroup: res.data,
      });
    }).catch(err => {
      console.log(err);
    });
  }

  async fetchSmartLookup(params) {
    const res = await ajaxs.post(`/cases/${this.props.caseId}/pnum_labels/smart-lookup`, params);
    let d = {
      label_bg_color: colors[0],
      label_txt_color: '#fff',
      color_order: 1,
    }
    if (res.meta && res.meta.success) {
      if (res.data.pnum_label.color_order) {
        d = {...res.data.pnum_label, num: res.data.num, short_num: res.data.short_num, network: res.data.ven_network, position: res.data.company + res.data.position}
      } else {
        d = {...this.state.values, num: res.data.num, short_num: res.data.short_num, network: res.data.ven_network, position: res.data.company + res.data.position}
      }
      if (d.label_groups) {
        d.label_group_names = d.label_groups;
      }
      let ptags = []
      if (res.data.pnum_label.ptags) {
        ptags = JSON.parse(res.data.pnum_label.ptags);
      }
      d.ptags = ptags
      this.setState({
        values: d,
      });
    } else {
      if (params.short_num) {
        d.short_num = params.short_num;
      } else {
        d.num = params.owner_num;
      }
      this.setState({
        values: d,
      });
    }
    return res
  }

  async findActiveItem(item) {
    const values = {
      label_bg_color: colors[0],
      label_txt_color: '#fff',
      color_order: 1,
    };
    if (this.props.type === 'num') {
      this.fetchSmartLookup({owner_num: item});
      this.setState({
        criteria: {
          owner_num: ['IN', [item.num ? item.num : item]],
        },
        codeCriteria: {
          owner_num: ['IN', [item.num ? item.num : item]],
          owner_ci: ['>', 0],
          owner_lac: ['>', 0],
        },
      });
    } else if (this.props.type === 'shortNum') {
      if (typeof item === 'object') {
        values.short_num = item.sn;
        const res = await this.fetchSmartLookup({owner_num: item.num, short_num: item.sn});
        this.fetchCitizen(item.sn)
        console.log(res);
        values.num = res.data.num
        values.network = res.data.ven_network
        this.setState({
          values,
          criteria: {
            owner_num: ['IN', [res.data.num]],
          },
          codeCriteria: {
            owner_num: ['IN', [res.data.num]],
            owner_ci: ['>', 0],
            owner_lac: ['>', 0],
          },
        });
      } else {
        values.short_num = item;
        this.setState({
          values,
          criteria: {
            owner_num: ['IN', [item.num ? item.num : item]],
          },
          codeCriteria: {
            owner_num: ['IN', [item.num ? item.num : item]],
            owner_ci: ['>', 0],
            owner_lac: ['>', 0],
          },
        });
      }
    }
  }

  fetchCitizen(num) {
    const param = ['FUZZY'];
    param.push(num);
    this.setState({
      isCitizenLoading: true,
      numsInfoLoading: true
    })
    ajaxs.post(`/cases/${this.props.caseId}/citizens/search`, {criteria: {
        name: param,
        social_no: param,
      }}).then(res => {
      if (res.meta && res.meta.success) {
        console.log(res.data);
        let tableTitle = []
        res.data.forEach(item => {
          Object.keys(item).forEach(key => {
            if (tableTitle.indexOf(key) === -1 && !this.handleTitle(key)) {
              tableTitle.push(key)
            }
          })
        })
        this.setState({
          citizens: res.data,
          tableTitle,
          isCitizenLoading: false
        })
      }
    })
    ajaxs.post(`/cases/${this.props.caseId}/pnums/info`, {
      num
    }).then(res => {
      if (res.meta && res.meta.success) {
        this.setState({
          numsInfoLoading: false,
          numsInfo: res.data,
          loc: this.props.type != 'shortNum' ? res.data[0] && res.data[0].call_attribution : '',
          numMemo: res.data[0] && res.data[0].ps_num_memo || '',
        })
      }
    })
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
    if (this.props.activeItem && this.props.type === 'num' && this.props.activeItem !== this.state.activeItem) {
      this.setState({
        activeItem: this.props.activeItem,
        config: {
          num: this.props.activeItem,
          caseId: this.props.caseId,
        },
        activeCitizensKey: '0',
        activeChartKey: '0',
      }, () => {
        this.findActiveItem(this.props.activeItem);
        this.fetchCitizen(this.props.activeItem);
      });
    }
    if (this.props.activeItem && this.props.type === 'shortNum') {
      if (typeof this.props.activeItem === 'object') {
        this.setState({
          // activeItem: this.props.activeItem.num,
          sn: this.props.activeItem.sn,
          // config: {
          //   num: this.props.activeItem.num,
          //   caseId: this.props.caseId,
          // },
          activeCitizensKey: '0',
          activeChartKey: '0',
        }, () => {
          this.findActiveItem(this.props.activeItem);
          // this.fetchCitizen(this.props.activeItem.num);
        });
      } else {
        this.setState({
          activeItem: this.props.activeItem,
          config: {
            num: this.props.activeItem,
            caseId: this.props.caseId,
          },
          activeCitizensKey: '0',
          activeChartKey: '0',
        }, () => {
          this.findActiveItem(this.props.activeItem);
          this.fetchCitizen(this.props.activeItem);
        });
      }
    }
    this.fetchLabelGroup(this.props.caseId);
    this.fetchVenNumbers(this.props.caseId);
    if (!this.props.labelPN) {
      this.props.actions.fetchLargeLabelPN({ caseId: this.props.caseId  }, {
        query: {
          page: 1,
          pagesize: appConfig.largePageSize,
        },
      })
    }
    this.props.actions.fetchLabelCells({ caseId: this.props.caseId }, {
      query: {
        page: 1,
        pagesize: appConfig.largePageSize
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeItem && nextProps.type === 'num' && nextProps.activeItem !== this.state.activeItem) {
      this.setState({
        activeItem: nextProps.activeItem,
        config: {
          num: nextProps.activeItem,
          caseId: nextProps.caseId,
        },
        activeCitizensKey: '0',
        activeChartKey: '0',
      }, () => {
        this.findActiveItem(nextProps.activeItem);
        this.fetchCitizen(nextProps.activeItem);
      });
    }
    if (nextProps.activeItem && typeof nextProps.activeItem !== 'object' && nextProps.type === 'shortNum' && nextProps.activeItem !== this.state.activeItem) {
      this.setState({
        activeItem: nextProps.activeItem,
        config: {
          num: nextProps.activeItem,
          caseId: nextProps.caseId,
        },
        activeCitizensKey: '0',
        activeChartKey: '0',
      }, () => {
        this.findActiveItem(nextProps.activeItem);
        this.fetchCitizen(nextProps.activeItem);
      });
    } else if (nextProps.activeItem && typeof nextProps.activeItem === 'object' && nextProps.type === 'shortNum' && nextProps.activeItem.sn !== this.state.sn) {
      this.setState({
        // activeItem: nextProps.activeItem.num,
        sn: nextProps.activeItem.sn,
        // config: {
        //   num: nextProps.activeItem.num,
        //   caseId: nextProps.caseId,
        // },
        activeCitizensKey: '0',
        activeChartKey: '0',
      }, () => {
        this.findActiveItem(nextProps.activeItem);
        // this.fetchCitizen(nextProps.activeItem.num);
      });
    }
    // console.log(nextProps.caseId, nextProps.caseId !== this.state.caseId);
    // if (nextProps.caseId && nextProps.caseId !== this.state.caseId) {
    //   this.fetchData(nextProps.caseId);
    //   this.fetchLabelGroup(nextProps.caseId);
    //   this.fetchVenNumbers(nextProps.caseId);
    // }

    if (nextProps.login && nextProps.login.summary && JSON.stringify(nextProps.login.summary) !== JSON.stringify(this.state.summary)) {
      this.handleSummary(nextProps.login.summary);
    }
  }
  handleTitle(key) {
    if (key === 'cname') {
      return '姓名';
    } else if (key === 'position') {
      return '职务';
    } else if (key === 'social_no') {
      return '身份证';
    } else if (key === 'book_name') {
      return '通讯录'
    } else if (key === 'cb_id') {
      return true
    } else if (key === 'cid') {
      return true
    }
    return false;
  }
  tableColumnRender(value, index, record) {
    const { labelPN } = this.props;
    const res = labelPN.filter(item => {
      return item.num === record.owner_num
    })
    if (res.length > 0) {
      return (
        <IceLabel inverse={false} style={{
          fontSize: '14px',
          backgroundColor: res[0].label_bg_color,
          color: res[0].label_txt_color
        }}>{res[0].label}</IceLabel>
      );
    } else {
      return value
    }
  }
  createManinput = () => {
    this.refs.form.validateAll((errors, values) => {
      let params = {
        citizen_phones: []
      }
      if (!values.label) {
        Message.error('使用人员不能为空');
        return
      }
      params.name = values.label;
      if (values.num) {
        params.citizen_phones.push({
          num: values.num,
          memo: '手机',
        })
      }
      if (values.network && values.short_num) {
        params.citizen_phones.push({
          num: values.short_num,
          ven_name: values.network,
          memo: '短号',
        })
      }

      if (values.position) {
        params.position = values.position;
      }
      this.props.actions.createManinputCitizen(params)
        .then(res => {
          if (res.body.meta.success) {
            Message.success('添加成功...');
          } else {
            Message.error('添加失败...');
          }
        })
        .catch(err => {
          Message.error('添加失败...');
          console.log(err);
        });
    })
  }
  componentWillUnmount() {

  }

  sourceRender = (value) => {
    let key = {
      'citizen_book': '人员库',
      'pbill_records': '话单',
      'ven_num': '虚拟网',
    }
    return key[value]
  }

  render() {
    const { labelGroup, activeCitizensKey, activeChartKey, citizens, values, numsInfo, tableTitle, isCitizenLoading, numsInfoLoading } = this.state;
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
                  <Tab.Item title="号码信息" key={0}>
                    <h2>{this.state.activeItem} {this.state.loc} {this.state.numMemo}</h2>
                    <Table
                      loading={isCitizenLoading}
                      dataSource={citizens}
                      // primaryKey="social_no"
                      style={styles.table}
                      emptyContent={'人员库中查找不到该号码'}
                    >
                      <Table.Column align="center" title={'姓名'} dataIndex={'cname'} width={100} lock />
                      <Table.Column align="center" title={'职务'} dataIndex={'position'} width={100} lock />
                      <Table.Column align="center" title={'身份证'} dataIndex={'social_no'} width={200} lock />
                      <Table.Column align="center" title={'通讯录'} dataIndex={'book_name'} width={100} lock />
                      {
                        tableTitle.map(item => {
                          return (
                            <Table.Column align="center" title={item} dataIndex={item} key={item} width={130} />
                          )
                        })
                      }
                    </Table>
                    {
                      this.props.type === 'shortNum' ? (
                        <Fragment>
                          <h3>相同末四位长号</h3>
                          <Table
                            loading={numsInfoLoading}
                            dataSource={numsInfo[1]}
                            primaryKey="num"
                            style={styles.table}
                            fixedHeader
                            maxBodyHeight={160}
                          >
                            <Table.Column align="center" title="号码" dataIndex="owner_num" width={155}/>
                            <Table.Column align="center" title="标注" dataIndex="owner_name" cell={this.tableColumnRender} width={150}/>
                            <Table.Column align="center" title="归属地" dataIndex="call_attribution"/>
                          </Table>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <h3>相同末四位短号</h3>
                          <Table
                            loading={numsInfoLoading}
                            dataSource={numsInfo[2]}
                            // primaryKey="num"
                            style={styles.table}
                            fixedHeader
                            maxBodyHeight={160}
                          >
                            <Table.Column align="center" title="数据来源" dataIndex="source" cell={this.sourceRender}/>
                            <Table.Column align="center" title="短号" dataIndex="short_num" width={155}/>
                            <Table.Column align="center" title="虚拟网" dataIndex="network" width={150}/>
                            <Table.Column align="center" title="长号" dataIndex="num"/>
                            {/*<Table.Column align="center" title="标注" dataIndex="label"/>*/}
                          </Table>
                        </Fragment>
                      )
                    }
                  </Tab.Item>
                  <Tab.Item title="每日通话情况" key="每日通话情况">
                    <div>
                      <DailyCallChart config={this.state.config}
                        summaryDate={this.state.summaryDate}
                      />
                    </div>
                  </Tab.Item>
                  <Tab.Item title="通话地分布" key="通话地分布">
                    <div>
                      <DistributionOfCallsChart config={this.state.config} />
                    </div>
                  </Tab.Item>
                </Tab>
              </div>
              <div className="item-flex-4 chartCard" style={{ ...styles.formContent, marginTop: '36px' }}>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>长号</div>
                  <IceFormBinder
                    name="num"
                    // triggerType="onBlur"
                  >
                    <Input
                      name="num"
                      readOnly={this.props.type === 'num'}
                      style={{ width: '150px' }}
                    />
                  </IceFormBinder>
                  {/* <IceFormError name="started_at" style={styles.formError} /> */}
                  <div style={{ ...styles.formLabel, flex: '0 0 40px' }}>短号</div>
                  <IceFormBinder
                    name="short_num"
                    // triggerType="onBlur"
                  >
                    <Input
                      name="short_num"
                      readOnly={this.props.type === 'shortNum'}
                      style={{ width: '100px' }}
                    />
                  </IceFormBinder>
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>虚拟网名称</div>
                  <IceFormBinder
                    name="network"
                    // triggerType="onBlur"
                  >
                    <Select.AutoComplete dataSource={this.state.venNumbersList} style={{ width: '150px' }} />
                  </IceFormBinder>
                  {/* <IceFormError name="started_at" style={styles.formError} /> */}
                  <Button type="primary" style={{ marginLeft: '20px' }} onClick={this.onVenNumbersSubmit}>保存到虚拟网列表</Button>
                </div>
                <div style={styles.formItem}>
                  <div style={styles.formLabel}>使用人员</div>
                  <IceFormBinder
                    name="label"
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
                      color={this.state.values.label_bg_color}
                      onChangeComplete={(color) => {
                        this.changeColor(color);
                      }}
                    />
                  </IceFormBinder>
                  {/* <IceFormError name="color" style={styles.formError} /> */}
                </div>
                <div style={{ ...styles.formItem }}>
                  <div style={styles.formLabel}>单位职务</div>
                  <IceFormBinder
                    name="position"
                    // triggerType="onBlur"
                  >
                    <Input
                      style={{ width: '100%' }}
                    />
                  </IceFormBinder>
                  {/* <IceFormError name="started_at" style={styles.formError} /> */}
                </div>
                <div style={{ ...styles.formItem }}>
                  <div style={styles.formLabel}>分类标签</div>
                  <IceFormBinder
                    name="label_group_names"
                    // triggerType="onBlur"
                  >
                    <Select mode="tag" showSearch style={{ width: '100%' }}>
                      {
                        labelGroup.map(item => {
                          return (
                            <Option key={item.name + item.id} value={item.name}>{item.name}</Option>
                          );
                        })
                      }
                    </Select>
                  </IceFormBinder>
                  {/* <IceFormError name="started_at" style={styles.formError} /> */}
                </div>
                <div style={{ ...styles.formItem }}>
                  <div style={styles.formLabel}>个性标签</div>
                  <IceFormBinder
                    name="ptags"
                    // triggerType="onBlur"
                  >
                    {/* <Input */}
                    {/* maxLength={30} */}
                    {/* hasLimitHint */}
                    {/* style={{ width: '100%' }} */}
                    {/* /> */}
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
                  <Button type="secondary" style={{ marginLeft: '10px' }} onClick={this.createManinput}>保存到人员库</Button>
                  <Button type="secondary" style={{ marginLeft: '10px' }} onClick={() => { this.props.onClose(this.props.index); }}>关闭</Button>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <Tab shape="wrapped" unmountInactiveTabs activeKey={activeChartKey} onChange={this.onChartChange}>
                <Tab.Item title="与其他号码联系" key={0}>
                  <div style={{ height: '450px' }} >
                    <Related  styles={{ height: '93%' }} title={`${values.num || values.short_num || ''}在所有调取的话单里出现的情况`} num={values.num || values.short_num} criteria={this.state.criteria} />
                  </div>
                  <div style={{ height: '400px' }} >
                    <RelatedWithLabel title={`${values.num || values.short_num || ''}有联系的标注过的号码`} styles={{height: '93%'}} num={values.num || values.short_num} criteria={this.state.criteria} />
                  </div>
                </Tab.Item>
                <Tab.Item title="密切联系号码" key={1}>
                  <div style={{ height: '830px' }}>
                    <PeerNumExclusionCondition styles={{ height: '93%' }} title={`${values.num || values.short_num || ''}的话单里联系密切的号码(前30位)`} criteria={this.state.criteria} />
                  </div>
                </Tab.Item>
                <Tab.Item title="常出现基站" key={2}>
                  <div style={{ height: '710px' }}>
                    <CodeAndstartedhourLimit25class styles={{ height: '93%' }} title={`${values.num || values.short_num || ''}的话单里经常出现的基站(前25位)`} criteria={this.state.codeCriteria} />
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
    labelPNs: state.labelPNs,
    labelPN: state.labelPNs.LargItems,
    caseId: state.cases.case.id,
    // citizens: state.citizens,
    login: state.login,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions, ...citizensActions, ...labelCellActions }, dispatch),
  }),
)(NumberLabel);
