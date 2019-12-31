import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import IceLabel from '@icedesign/label';
import moment from 'moment';
import { Table, Button, Pagination, Message, Icon, Balloon } from '@alifd/next';
import ajaxs from '../../../../utils/ajax';
import { actions } from '../../../../stores/SearchStore/index';
import { actions as matrixsListActions } from '../../../../stores/MatrixList';
import PBAnalyzeList from '../../../PBAnalyze/components/InfiniteScrollGrid/SimplePbillRecordList';
import IcePBAnalyzeList from '../IcePBAnalyzeList';
import { _getPBAnalyze, toggleSimplePbillRecordList } from '../../../../stores/simplePbillRecordList/actions';

import '../../matrix.css';

class MatrixList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          that.props.actions.setLabelPN(record);
          console.log('onSelect', selected, record, records);
        },
        onSelectAll(selected, records) {
          console.log('onSelectAll', selected, records);
        },
        selectedRowKeys: [],
        mode: 'single',
      },
      criteria: null,
      cols: [
        {
          title: '纵向号码/横向号码',
          dataIndex: 'y_num',
          width: 150,
          lock: true,
          cell: this.labelRender.bind(this),
        },
        // {
        //   title: '号码属性',
        //   dataIndex: '号码属性',
        //   width: 140,
        //   lock: true
        // },
        // {
        //   title: '人员信息',
        //   dataIndex: 'yNum',
        //   cell: this.labelRender.bind(this),
        //   width: 140,
        //   lock: true
        // },
      ],
      numCols: [
        // {
        //   title: '号码',
        //   dataIndex: 'yNum',
        //   width: 150,
        //   lock: true
        // },
        // {
        //   title: '号码属性',
        //   dataIndex: '号码属性',
        //   width: 140,
        //   lock: true
        // },
        // {
        //   title: '人员信息',
        //   dataIndex: 'yNum',
        //   cell: this.labelRender.bind(this),
        //   width: 140,
        //   lock: true
        // },
      ],
      MatrixList: [],
      windowScroller: null,
      isShowPbList: false,
      dataSource: null,
      cnData: null,
      cnTableHeader: [],
      showTableType: 'cn',
      params: null
    };

    this.fetchData = this.fetchData.bind(this);
    this.showAddModal = this.showAddModal.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.showFileImp = this.showFileImp.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.numRender = this.numRender.bind(this);
    this.showPbList = this.showPbList.bind(this);
    this.hidePbList = this.hidePbList.bind(this);
  }

  showAddModal() {
    this.setState({
      addModal: !this.state.addModal,
    }, () => {
      if (!this.state.addModal) {
        this.setState({
          isEdit: false,
        });
      }
    });
  }

  showFileImp() {
    this.setState({
      fileImpShow: !this.state.fileImpShow,
    });
  }

  onTableChange = (ids, records) => {
    console.log(ids);
    const { rowSelection } = this.state;
    rowSelection.selectedRowKeys = ids;
    console.log('onChange', ids, records);
    this.setState({ rowSelection });
  };

  onPageChange = (current) => {
    this.setState({
      current,
    }, () => {
      this.fetchData();
    });
  };

  handleClick = (text) => {
    if (text === '添加') {
      this.showAddModal();
    } else if (text === '导入') {
      this.showFileImp();
    } else if (text === '编辑') {
      if (this.state.rowSelection.selectedRowKeys.length === 1) {
        this.showAddModal();
        this.setState({ isEdit: true });
      } else {
        Message.warning('请选择一条数据');
      }
    } else if (text === '归档到人员库') {
      Message.warning('功能未开发');
    } else if (this.state.rowSelection.selectedRowKeys.length === 1) {
      Message.loading({
        title: '删除中...',
        duration: 0,
      });
      this.props.actions.deleteLabelPN({ caseId: this.props.caseId, id: this.state.itemId })
        .then(res => {
          console.log(res);
          if (res.status === 'resolved') {
            Message.success('删除成功');
          }
        })
        .catch(err => {
          console.log(err);
          Message.error('删除失败');
        });
    } else {
      Message.warning('请选择一条数据');
    }
  };

  onRowClick(record) {
    const { rowSelection } = this.state;
    rowSelection.selectedRowKeys = [record.num];
    this.setState({
      rowSelection,
      itemId: record.id,
    });

    this.props.actions.setLabelPN(JSON.parse(JSON.stringify(record)));
  }

  numRender(value, index, record) {
    return value ? (
      <div>
        {
          this.props.searchData.display.indexOf('1') !== -1 ? (
            <Fragment>
              <h3 className='drilldown' style={{
                color: 'blue',
                margin: 0,
                fontSize: '14px',
                display: 'inline-block',
                border: 'none'
              }}
                onClick={() => { this.showPbList(record, value.num, 'pbr'); }}
              >{value.inter_connect ? `${value.inter_connect}次` : null}
              </h3>
              <div>{record[`${value.num}first_day`] ? moment(record[`${value.num}first_day`]).format('MM.DD') : null}{record[`${value.num}last_day`] ? `至${moment(record[`${value.num}last_day`]).format('MM.DD')}` : null}</div>
            </Fragment>
          ) : null
        }
        <h3 style={{ color: 'red', margin: 0, display: this.props.searchData.display.indexOf('2') !== -1 ? 'inline-block' : 'none' }} onClick={() => {this.showPbList(record, value.num, 'cn');}}>{value.count}</h3>
      </div>
    ) : value;
  }

  defaultRender(value) {
    return value;
  }

  showPbList(record, x_num, type) {
    const criteria = {};
    console.log(record);
    criteria.owner_num = ['IN', [x_num]];
    criteria.peer_num = ['IN', [record.y_num]];
    if (type === 'pbr') {
      // this.fetchPbrData(criteria);
      this.props.actions.toggleSimplePbillRecordList(true, criteria)
    } else {
      this.fetchCnData(record, x_num)
      this.pbListBox.classList.add('show');
    }
    this.setState({
      isShowPbList: true,
      showTableType: type,
      params: criteria
    });
  }

  hidePbList() {
    this.pbListBox.classList.remove('show');
    this.setState({
      isShowPbList: false,
      dataSource: null,
      cnData: null,
      showTableType: 'cn',
    });
  }

  labelRender(value, index, record) {
    // let val = '';
    // const { labelPNs } = this.props;
    // labelPNs.items.forEach(item => {
    //   if (item.num === value) {
    //     val = (
    //       <IceLabel inverse={false}
    //         style={{
    //         fontSize: '14px',
    //         backgroundColor: item.label_bg_color,
    //         color: item.label_txt_color,
    //       }}
    //       >{item.label}
    //       </IceLabel>
    //     );
    //   }
    // });

    // return val;


    if (this.props.labelPNs) {
      this.props.labelPNs.LargItems.forEach(item => {
        if (item.num === record.y_num) {
          record.Tagging = item;
        }
      });
    }
    return (
      <div>
        {/* <Link to={`/cases/${caseId}/pb_analyze?owner_num=${num}`}>{value}</Link> */}
        <span>{value}</span>
        {record.Tagging ? (<IceLabel inverse={false}
          style={{
          fontSize: '12px',
          backgroundColor: record.Tagging.label_bg_color,
          color: record.Tagging.label_txt_color,
          marginLeft: '5px',
        }}
        >{record.Tagging.label}
        </IceLabel>) : <span style={{ marginLeft: '5px' }}>{record.owner_name} {record.y_name}</span>}
      </div>
    );
  }

  fetchData(params) {
    const { actions, caseId, labelPNs } = this.props;
    let { cols, numCols } = this.state;
    let headerNum = [];
    if (params && params.adhoc.x_nums) {
      headerNum = [...params.adhoc.x_nums];
    }

    actions.fetchMatrixs({ case_id: caseId, ...params }).then(res => {
      if (res.body.meta && res.body.meta.success) {
        numCols = [];
        labelPNs.LargItems.forEach(item => {
          if (headerNum.indexOf(item.num) !== -1) {
            headerNum[headerNum.indexOf(item.num)] = item;
          }
        });

        const MatrixList = [];
        const map = {};
        res.body.data.forEach(items => {
          items.forEach(item => {
            if (headerNum.indexOf(item.x_num) !== -1) {
              headerNum[headerNum.indexOf(item.x_num)] = {
                label: item.x_name,
                num: item.x_num,
                label_bg_color: '#fff',
                label_txt_color: '#ccc',
              };
            }
            if (!map[item.y_num]) {
              item.total = 1;
              item[item.x_num] = {
                count: item.common_num_count,
                num: item.x_num,
                inter_connect: item.inter_connect,
              };
              item[`${item.x_num}first_day`] = item.first_day;
              item[`${item.x_num}last_day`] = item.last_day;
              MatrixList.push(item);
              map[item.y_num] = item;
            } else {
              MatrixList.forEach(i => {
                if (i.y_num === item.y_num) {
                  i.total += 1;
                  i[item.x_num] = {
                    count: item.common_num_count,
                    num: item.x_num,
                    inter_connect: item.inter_connect,
                  };
                  i[`${item.x_num}first_day`] = item.first_day;
                  i[`${item.x_num}last_day`] = item.last_day;
                }
              });
            }
          });
        });
        headerNum.forEach(item => {
          if (typeof item === 'object') {
            numCols.push({
              title: <div><span>{item.num}</span><IceLabel inverse={false}
                style={{
                fontSize: '12px',
                backgroundColor: item.label_bg_color,
                color: item.label_txt_color,
                marginLeft: '5px',
              }}
              >{item.label}
              </IceLabel>
              </div>,
              dataIndex: item.num,
              cell: this.numRender,
              width: 180,
            });
          } else {
            numCols.push({
              title: item,
              dataIndex: item,
              cell: this.numRender,
              width: 180,
            });
          }
        });
        this.setState({
          numCols: [...cols, ...numCols],
          MatrixList,
        });
      }
    }).catch(err => {
      console.log(err);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.criteria && Object.keys(nextProps.criteria).length !== 0 && this.state.criteria !== nextProps.criteria) {
      this.fetchData(nextProps.criteria);
      this.setState({
        criteria: nextProps.criteria,
      });
    }

    if (nextProps.criteria && Object.keys(nextProps.criteria).length === 0){
      this.setState({numCols:[],MatrixList:[]})
    }
  }

  labelGroupsRender(value, index, record) {
    const newVal = [];
    if (value) {
      value.forEach(item => {
        newVal.push(item.label_group_name);
      });
      return newVal.join(', ');
    }
    return value;
  }

  ptagsRender(value) {
    // console.log(value);
    const newVal = [];
    if (value) {
      if (typeof value === 'string') {
        JSON.parse(value).forEach(item => {
          // console.log(item);
          newVal.push(item);
        });
      } else {
        value.forEach(item => {
          // console.log(item);
          newVal.push(item);
        });
      }

      return newVal.join(', ');
    }
    return value;
  }

  fetchPbrData(params) {
    const { caseId } = this.props;
    const { criteria } = this.state;
    ajaxs.post(`/cases/${caseId}/pbills/analyze/matrix/drilldown/pbr`, { criteria: { ...criteria.criteria, ...params } }).then(res => {
      if (res.meta.success) {
        const data = _getPBAnalyze(res.data).state;
        this.setState({
          dataSource: data,
        });
      }
    });
  }

  fetchCnData(record, x_num) {
    const adhoc = {};
    adhoc.x_num = x_num;
    adhoc.y_num = record.y_num;
    const { caseId } = this.props;
    const { criteria } = this.state;
    const {labelPNs} = this.props;


    let cnTableHeader = [
      {
        num: x_num,
      },
      {
        num: record.y_num
      }
    ];
    cnTableHeader.forEach(item => {
      for (let i = 0; i < labelPNs.LargItems.length; i++) {
        const argument = labelPNs.LargItems[i];
        if (item.num.indexOf(argument.num) !== -1) {
          item.labelInfo = argument;
          break;
        }
      }
    })
    this.setState({
      cnTableHeader
    });
    ajaxs.post(`/cases/${caseId}/pbills/analyze/matrix/drilldown/cn`, { criteria: { ...criteria.criteria }, adhoc }).then(res => {
      if (res.meta.success) {
        const newArr = [];
        res.data.forEach(item => {
          for (const k in item) {
            item[k].forEach(nums => {
              for (let i = 0; i < labelPNs.LargItems.length; i++) {
                const argument = labelPNs.LargItems[i];
                if (nums.common_num.indexOf(argument.num) !== -1) {
                  nums.lableInfo = argument;
                  break;
                }
              }
              nums[`${k}count`] = nums.count;
              let isPush = true
              for (let i = 0; i < newArr.length; i++) {
                const newArrElement = newArr[i];
                if (newArrElement.common_num === nums.common_num) {
                  isPush = false
                  newArrElement[`${k}count`] = nums.count;
                }
              }
              if (isPush) {
                newArr.push(nums);
              }
            });
          }
        });
        this.setState({
          cnData: newArr,
        });
      } else {
        this.setState({
          cnData: null,
        });
      }
    });
  }


  render() {
    const { numCols, MatrixList} = this.state;
    const height = document.querySelector('.pbListBox') && document.querySelector('.pbListBox').offsetHeight;
    return (
      <div style={styles.container}>
        <Table
          loading={this.props.inCommonsList.showLoading}
          dataSource={MatrixList}
          // rowSelection={this.state.rowSelection}
          // onRowClick={this.onRowClick}
          style={styles.table}
        >
          {
            numCols.map(col => {
              return (
                <Table.Column align="center"
                  title={col.title}
                  dataIndex={col.dataIndex}
                  key={col.dataIndex}
                  cell={col.cell || this.defaultRender}
                  width={col.width}
                  lock={col.lock}
                />
              );
            })
          }
        </Table>

        <div ref={(e) => { this.pbListBox = e; }} className="pbListBox">
          <div className="pbListBox-close" style={{ position: 'fixed', right: '10px', top: '10px', zIndex: 999, cursor: 'pointer' }}>
            <Icon type="close" onClick={() => { this.hidePbList(); }} size="small" />
          </div>
          <div style={{ height: '100%', backgroundColor: '#fff' }}>
            <div style={{display: this.state.showTableType === 'pbr' ? 'none' : 'block'}}>
              <Table
                loading={this.state.cnData ? false : true}
                dataSource={this.state.cnData || []}
                useVirtual
                fixedHeader
                primaryKey="num"
                style={{height: '100%'}}
                maxBodyHeight={height * 0.9}
              >
                <Table.Column align="center"
                              title="共同号码"
                              dataIndex="common_num"
                              cell={this.defaultRender}
                />
                {
                  this.state.cnTableHeader.map(item => {
                    return (
                      <Table.Column align="center"
                                    title={
                                      <div>
                                        <span>{item.num}</span>
                                        {
                                          item.labelInfo ? (
                                            <IceLabel inverse={false}
                                                      style={{
                                                        fontSize: '12px',
                                                        backgroundColor: item.labelInfo.label_bg_color,
                                                        color: item.labelInfo.label_txt_color,
                                                        marginLeft: '5px',
                                                      }}
                                            >
                                              {item.labelInfo.label}
                                            </IceLabel>
                                          ) : null
                                        }
                                      </div>
                                    }
                                    dataIndex={`${item.num}count`}
                                    cell={this.defaultRender}
                      />
                    )
                  })
                }
              </Table>
            </div>
          </div>
          {/* { */}
          {/* isShowPbList ? ( */}
          {/* <PBAnalyzeList getWindowScroller={this.props.getWindowScroller} componentProps={{url: `/cases/5/pbills/records/search`}}/> */}
          {/* ) : null */}
          {/* } */}
          {/* <PBAnalyzeList getWindowScroller={this.props.getWindowScroller} componentProps={{url: `/cases/${this.props.caseId}/pbills/analyze/matrix-pbill-records`}} /> */}
        </div>
      </div>
    );
  }
}


const styles = {
  container: {
    margin: '0 20px',
    letterSpacing: '2px',
    backgroundColor: '#fff',
    minHeight: '463px',
  },
  button: {
    margin: '0 8px',
    letterSpacing: '2px',
  },
  table: {
    // margin: '20px 0',
    // minHeight: '463px',
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default connect(
  state => ({
    labelPNs: state.labelPNs,
    inCommonsList: state.inCommonsList,
    caseId: state.cases.case.id,
    criteria: state.search.criteria,
    isLoading: state.inCommonsList.showLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions, ...matrixsListActions, toggleSimplePbillRecordList }, dispatch),
  }),
)(MatrixList);
