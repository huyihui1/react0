import React, {Component} from 'react';
import {Balloon, Button, Input, Table, Pagination, Select, Loading, Message, Dialog} from '@alifd/next';
import {Link} from 'react-router-dom';

const {Option} = Select;

import {FormBinder, FormBinderWrapper, FormError as IceFormError} from "@icedesign/form-binder";
import './Pbills.css'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actions as PbillsActions} from "../../../stores/Pbills";
import {actions as CasesImportActions} from "../../../stores/CasesImport";
import moment from 'moment'
import IceLabel from '@icedesign/label';

import NetworkForm from './NetworkForm'
import FamilyForm from './FamilyForm'
import CityForm from './CityForm'
import doT from 'dot';



class PbillsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NetworkModal: false,
      FamilyModal: false,
      CityModal: false,
      pbillsList: [],
      deletePbillsList: [],
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        selectedRowKeys: [],
      },
      values: {},
      pbMarkData: [],
      current: 1,
      pageTotal: '',
      setData: [],
      buttons: ['设置虚拟网', '设置亲情网', '设置常驻地', '仅显示异常话单', '删除话单'],
      flag: true,
      labelGroupList: [],
      h: '',
      tips: ''
    };
    this.onTableChange = this.onTableChange.bind(this);
    this.getPbillsList = this.getPbillsList.bind(this);
    this.getAbnormalData = this.getAbnormalData.bind(this);
    this.showNetworkModal = this.showNetworkModal.bind(this);
    this.showFamilModal = this.showFamilModal.bind(this);
    this.showCityModal = this.showCityModal.bind(this);
    this.netTableColumnRender = this.netTableColumnRender.bind(this);
    this.familyTableColumnRender = this.familyTableColumnRender.bind(this);
    this.abnormalTableColumnRender = this.abnormalTableColumnRender.bind(this);
    this.popupAlert = this.popupAlert.bind(this);
    this.changeSetData = this.changeSetData.bind(this);
    this.ownerNumRender = this.ownerNumRender.bind(this);
    // this.onRowClick = this.onRowClick.bind(this);
    this.startedAtRender = this.startedAtRender.bind(this);
    this.endedAtRender = this.endedAtRender.bind(this);
    this.createdAtRender = this.createdAtRender.bind(this);
    this.getLabelGroup = this.getLabelGroup.bind(this);
  }

  onTableChange(ids, record) {
    console.log(ids);
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = ids;

    // console.log(record);
    let argsArray = [];
    record.forEach(item => {
      argsArray.push(item.owner_num)
    });
    this.setState({deletePbillsList: argsArray, setData: record});
  }


  // onRowClick = (record) => {
  //   // console.log(record);
  //   const {rowSelection, deletePbillsList, setData} = this.state;
  //   if (rowSelection.selectedRowKeys.indexOf(record.id) === -1) {
  //     rowSelection.selectedRowKeys.push(record.id);
  //   } else {
  //     let index = rowSelection.selectedRowKeys.findIndex((value) => {
  //       return value == record.id
  //     });
  //     rowSelection.selectedRowKeys.splice(index, 1);
  //   }
  //
  //   if (deletePbillsList.indexOf(record.ownerNum) === -1) {
  //     deletePbillsList.push(record.ownerNum)
  //   } else {
  //     let index = deletePbillsList.findIndex((value) => {
  //       return value == record.ownerNum
  //     });
  //     deletePbillsList.splice(index, 1);
  //   }
  //
  //
  //   if (setData.indexOf(record) === -1) {
  //     setData.push(record)
  //   } else {
  //     let index = setData.findIndex((value) => {
  //       return value == record
  //     });
  //     setData.splice(index, 1);
  //   }
  //
  //
  //   this.setState({rowSelection, deletePbillsList, setData})
  // };


  getPnumLabels() {
    const {actions, caseId} = this.props;
    actions.getPnumLabelsCasesImport({caseId: caseId}, {
      query: {
        page: 1,
        pagesize: 100
      }
    })
  }

  getPbillsList(page) {
    const {actions, caseId, pagesize} = this.props;
    actions.fetchPbills({caseId}, {
      query: {
        page: page,
        pagesize: 100
      }
    }).then(res => {
      if (res.status === 'resolved') {
        this.setState({buttons: ['设置虚拟网', '设置亲情网', '设置常驻地', '仅显示异常话单', '删除话单']});
      }
    })
  }

  getAbnormalData(page) {
    const {actions, caseId, pagesize} = this.props;
    actions.getAbnormalDataPbills({caseId}, {
      query: {
        page: page,
        pagesize: 100
      }
    }).then(res => {
      if (res.status === 'resolved') {
        this.setState({buttons: ['设置虚拟网', '设置亲情网', '设置常驻地', '显示全部号码', '删除话单']})
      }
    })
  }

  getLabelGroup() {
    this.props.actions.getLabelGroupPbills({caseId: this.props.caseId})
  };

  popupAlert() {
    const dialog = Dialog.show({
      title: '警告',
      content: '是否确认删除?',
      footer: (
        <div style={{width: '300px'}}>
          <Button type="primary" onClick={() => {
            Message.loading({
              title: '删除中...',
              duration: 0,
            });
            this.props.actions.removePbills({
              caseId: this.props.caseId,
              owner_num: this.state.deletePbillsList
            }).then(res => {
              if (res.status === 'resolved') {
                Message.success('删除成功');
                this.state.rowSelection.selectedRowKeys = [];
                this.getPbillsList(this.state.current)
              }
            }).catch(err => {
              // console.log(err);
              Message.error('删除失败');
            });
            dialog.hide()
          }}>
            确认
          </Button>
          <Button type="secondary" onClick={() => dialog.hide()} style={{marginLeft: '15px'}}>
            取消
          </Button>
        </div>
      )
    });
  };


  // shortNumChange() {
  //   const {actions, caseId} = this.props;
  //   actions.shortNumChangePbills({caseId}).then(res => {
  //     if (res.status === 'resolved') {
  //       Message.success('转换成功');
  //     }
  //   }).catch(err => {
  //     // console.log(err);
  //     Message.error('转换失败');
  //   })
  // }


  validateFields = () => {
    const {validateFields} = this.refs.form;
    const {caseId, actions} = this.props;
    validateFields((errors, values) => {

      for (let key in values){
        if (!values[key] || values[key].length === 0){
          delete values[key]
        }
      }


      if (!errors || values && values.label_groups.length !== 0 || values.query) {
        const v = {...values};
        this.props.actions.searchPbills({
          caseId: caseId,
          query: v.query ? v.query : '',
          label_groups: v.label_groups ? v.label_groups : ''
        })
      }
    });
  };

  handleClick = (text) => {
    if (text === '仅显示异常话单') {
      this.getAbnormalData(1);
      this.setState({flag: false})
    } else if (text === '显示全部号码') {
      this.getPbillsList(1);
      this.setState({flag: true})
    } else {
      if (text === '设置虚拟网' && this.state.rowSelection.selectedRowKeys.length !== 0) {
        this.showNetworkModal()
      } else if (text === '设置亲情网' && this.state.rowSelection.selectedRowKeys.length !== 0) {
        this.showFamilModal()
      } else if (text === '设置常驻地' && this.state.rowSelection.selectedRowKeys.length !== 0) {

        this.showCityModal()
      } else if (text === '删除话单' && this.state.rowSelection.selectedRowKeys.length !== 0) {
        this.popupAlert()
      } else {
        Message.warning('请选择一条数据');
      }
    }

  };
  onPageChange = (current) => {
    if (this.state.flag) {
      this.getPbillsList(current);
    } else {
      this.getAbnormalData(current);
    }
    this.setState({
      current,
    });
  };

  componentDidMount() {
    this.getPnumLabels();
    this.getPbillsList(this.state.current);
    this.getLabelGroup();
  }


  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    if (nextProps.pbillsList && nextProps.meta && nextProps.meta.page) {
      this.setState({
        current: nextProps.meta.page.current,
        pageTotal: nextProps.meta.page.total
      })
    }


    if (nextProps.labelGroupList) {
      this.setState({labelGroupList: nextProps.labelGroupList})
    }

    // if (nextProps.markData) {
    //   this.setState({pbMarkData: nextProps.markData})
    // }
  }


  showNetworkModal() {
    this.setState({NetworkModal: !this.state.NetworkModal})
  }

  showFamilModal() {
    this.setState({FamilyModal: !this.state.FamilyModal})
  }

  showCityModal() {
    this.setState({CityModal: !this.state.CityModal})
  }

  ownerNumRender(value, index, record) {
    if (this.props.pnumLabels) {
      this.props.pnumLabels.forEach(item => {
        if (item.num === record.owner_num) {
          record.Tagging = item
        }
      });
    }

    let num = null;
    if (typeof value === 'string') {
      num = value
    } else {
      num = record.ownerNum
    }
    const {caseId} = this.props;
    return (
      <div>
        {/*<Link to={`/cases/${caseId}/pb_analyze?owner_num=${num}`}>{value}</Link>*/}
        <span>{value}</span>
        {record.Tagging ? (<IceLabel inverse={false} style={{
          fontSize: '12px',
          backgroundColor: record.Tagging.label_bg_color,
          color: record.Tagging.label_txt_color,
          marginLeft: '5px'
        }}>{record.Tagging.label}</IceLabel>) : <span style={{marginLeft: '5px'}}>{record.owner_name}</span>}
      </div>
    )
  }

  netTableColumnRender(value, index, record) {
    return (
      <div>
        <span>{record.ven_network}</span>
        <span style={{marginLeft: '10px'}}>{record.ven_short_num}</span>
      </div>
    );
  }

  familyTableColumnRender(value, index, record) {
    return (
      <div>
        <span>{record.rel_network}</span>
        <span style={{marginLeft: '10px'}}>{record.rel_short_num}</span>
      </div>
    );
  }

  abnormalTableColumnRender(value, index, record) {
    const map = {
      "1": "#F39D9D",
      "2": "#DD4D4D",
      "3": "#8C0808",
      "4": "#210101"
    };
    let outliers = [];
    record.outliers.map(outItem => {
      let color = map[outItem.flaw_type];
      let text = '';
      switch (outItem.flaw_type) {
        case 1:
          text = '话单联系的对方号码个数少于50人';
          break;
        case 2:
          text = '连续不通话日期超过3天';
          break;
        case 3:
          text = '总未使用天数超过10天';
          break;
        case 4:
          text = '平均每天通话次数少于等于3次';
          break;
      }

      let tempFn = doT.template(text);
      text = tempFn(outItem);

      let el = {
        type: <div style={{
          width: '17px',
          height: '17px',
          'backgroundColor': color,
          display: 'inlineBlock',
          'borderRadius': '50%',
          margin: '0 5px',
        }}></div>,
        text: text
      };


      outliers.push(el);
    });

    const columnRender = <div style={styles.columnRenderStyle}>{outliers.map(item => {
      return (<div>{item.type}</div>)
    })}</div>;

    if (outliers.length === 0) {
      return columnRender
    } else {
      return (
        <Balloon trigger={columnRender} closable={false} align='t'>
          {outliers.map(item => {
            return (<div style={{display: 'flex', margin: '8px 0'}}>
              <span>{item.type}</span>
              <span>{item.text}</span>
            </div>)
          })}
        </Balloon>
      )
    }
  }


  changeSetData(value, even) {
    this.state.setData.forEach(item => {
      if (item.ownerNum === even) {
        item.ven_short_num = value
      }
    });

    console.log(this.state.setData);

    this.setState({setData: this.state.setData})
  }


  startedAtRender(value) {
    if (value) {
      return (
        <div>{moment(value).format('YYYY-MM-DD')}</div>
      )
    } else {
      return ''
    }
  }

  endedAtRender(value) {
    if (value) {
      return (
        <div>{moment(value).format('YYYY-MM-DD')}</div>
      )
    } else {
      return ''
    }
  }

  createdAtRender(value) {
    if (!value) return;
    return (
      <div>{moment(value).format('MM-DD HH:mm:ss')}</div>
    )
  }

  labelGroupsRender(value, index, record) {
    if (value) {
      return <span>{value.join(', ')}</span>
    } else {
      return <span>{value}</span>
    }

  }

  onBodyScroll() {
    // console.log('滚动了');
  }


  checkQuery = (rule, values, callback) => {
    if (!values && !this.state.values.label_groups || !values && this.state.values.label_groups.length === 0) {
      this.setState({tips: '请输入查询条件'})
    } else {
      callback();
      this.setState({tips: ''})
    }
  };
  checkLabelGroups = (rule, values, callback) => {
    if (!values && !this.state.values.query || values && values.length === 0 && !this.state.values.query) {
      this.setState({tips: '请输入查询条件'})
    } else {
      callback();
      this.setState({tips: ''})
    }
  };

  render() {
    return (
      <div>
        <div className="pbills_header">
          <FormBinderWrapper
            ref="form"
            value={this.state.values}
          >
            <label style={styles.caseNumber}>
              <FormBinder name="query" validator={this.checkQuery}>
                <Input
                  placeholder={'请输入话单号码/标注'}
                  style={{...styles.input}}
                  trim
                />
              </FormBinder>
              {/*<IceFormError name="query" style={{...styles.formError, left: '660px'}}/>*/}
            </label>

            <label style={styles.caseNumber}>
              分类标签:
              <FormBinder name="label_groups" validator={this.checkLabelGroups}>
                {/*<Select aria-label="tag mode" mode="tag" dataSource={dataSource}style={{...styles.input, width: 200}}/>*/}
                <Select mode="tag" showSearch style={{width: '300px', marginLeft: '5px'}}>
                  {
                    this.state.labelGroupList.map(item => {
                      return (
                        <Option key={item.name + item.id} value={item.name}>{item.name}</Option>
                      );
                    })
                  }
                </Select>
              </FormBinder>
              <IceFormError name="label_groups" style={{...styles.formError, left: '840px', display: 'none'}}/>
            </label>
          </FormBinderWrapper>
          <span>
          <Button
            type="primary"
            style={{...styles.button, marginLeft: '10px'}}
            onClick={this.validateFields}
          >
            查询
          </Button>
            <div style={{
              position: 'absolute',
              left: '660px',
              top: '8px',
              color: '#f76048',
              width: '250px'
            }}>{this.state.tips}</div>
        </span>
        </div>
        <div className='pbills_body' ref='pbillsBody' style={{minHeight: `${document.documentElement.offsetHeight - 300}px`}}>
          <div style={{margin: '0 20px'}}>
            <div style={styles.buttons}>
              {this.state.buttons.map((text, index) => {
                return (
                  <Button
                    key={index}
                    className={text === '删除话单' ? 'deleteBtn' : ''}
                    style={styles.button}
                    onClick={() => this.handleClick(text)}
                  >
                    {text}
                  </Button>
                );
              })}
            </div>
            <Loading visible={this.props.isLoading} style={{width: '100%'}} tip="加载中...">
              <div ref='table'>
                <Table dataSource={this.props.pbillsList}
                       rowSelection={this.state.rowSelection}
                       onRowClick={this.onRowClick}
                       primaryKey="id"
                  // useVirtual
                  // maxBodyHeight={438}
                       onBodyScroll={this.onBodyScroll}
                       // style={{height: `${document.documentElement.offsetHeight}px`}}
                  // fixedHeader={true}
                       stickyHeader={true}
                >

                  <Table.Column title="归属地" alignHeader="center" align='center' dataIndex="call_attribution" width={140}/>
                  <Table.Column title="常驻地" alignHeader="center" align='center' dataIndex="residence" width={140}/>
                  <Table.Column title="亲情网" alignHeader="center" align='center' dataIndex="" width={140}
                                cell={this.familyTableColumnRender}/>
                  <Table.Column title="虚拟网" alignHeader="center" align='center' dataIndex="" width={170}
                                cell={this.netTableColumnRender}/>
                  <Table.Column title="分类标签" alignHeader="center" align='center' dataIndex="label_groups" width={140}
                                cell={this.labelGroupsRender}/>
                  <Table.Column title="话单开始日期" alignHeader="center" align='center' dataIndex="started_at" width={140}
                                cell={this.startedAtRender}/>
                  <Table.Column title="话单结束日期" alignHeader="center" align='center' dataIndex="ended_at" width={140}
                                cell={this.endedAtRender}/>
                  <Table.Column title="话单条数" alignHeader="center" align='center' dataIndex="total" width={140}/>
                  <Table.Column title="上传时间" alignHeader="center" align='center' dataIndex="created_at" width={140}
                                cell={this.createdAtRender}/>
                  <Table.Column title="异常情况" alignHeader="center" align='center' dataIndex="newOutliers" width={140}
                                lock='right' cell={this.abnormalTableColumnRender}/>
                  <Table.Column title="话单号码" alignHeader="center" align='left' width={210} dataIndex="owner_num"
                                cell={this.ownerNumRender} lock/>
                  {/*<Table.Column cell={render} width={200}/>*/}
                </Table>


              </div>
            </Loading>
            {/*<div style={styles.pagination}>*/}
            {/*<Pagination*/}
            {/*current={this.state.current}*/}
            {/*onChange={this.onPageChange}*/}
            {/*total={this.state.pageTotal * this.props.pagesize}*/}
            {/*hideOnlyOnePage*/}
            {/*/>*/}
            {/*</div>*/}
            <NetworkForm visible={this.state.NetworkModal} onClose={this.showNetworkModal} setData={this.state.setData}
                         getPbillsList={this.getPbillsList} current={this.state.current}
                         rowSelection={this.state.rowSelection} changeSetData={this.changeSetData}/>
            <FamilyForm visible={this.state.FamilyModal} onClose={this.showFamilModal} setData={this.state.setData}
                        getPbillsList={this.getPbillsList} current={this.state.current}
                        rowSelection={this.state.rowSelection}/>
            <CityForm visible={this.state.CityModal} onClose={this.showCityModal} setData={this.state.setData}
                      getPbillsList={this.getPbillsList} current={this.state.current}
                      rowSelection={this.state.rowSelection}/>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    margin: '20px',
    letterSpacing: '2px',
  },
  input: {
    margin: '0 10px 0 5px',
  },
  select: {
    verticalAlign: 'middle',
    width: '200px',
  },
  shortInput: {
    width: '110px',
  },
  caseNumber: {
    position: 'relative'
  },
  date: {
    marginRight: '24px',
  },
  button: {
    margin: '0 4px',
    letterSpacing: '2px',
  },
  button2: {
    margin: '0 8px',
    letterSpacing: '2px',
  },
  table: {
    // margin: '20px 0',
    minHeight: '438px',
  },
  buttons: {
    marginBottom: '20px'
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
    marginTop: '35px',
  },
  columnRenderStyle: {
    width: '100%',
    height: '17px',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center'
  },
  formError: {
    position: 'absolute',
    top: '2px',
    color: '#f76048',
    width: '200px'
  },
};


export default connect(
  state => ({
    caseId: state.cases.case.id,
    pnumLabels: state.caseImports.pnumLabels,
    pbillsList: state.pbills.pbillsList,
    abnormalList: state.pbills.abnormalList,
    isLoading: state.pbills.showLoading,
    pagesize: state.pbills.pageSize,
    meta: state.pbills.meta,
    labelGroupList: state.pbills.labelGroupList
  }),
  dispatch => ({
    actions: bindActionCreators({...PbillsActions, ...CasesImportActions}, dispatch),
  }),
)(PbillsList);
