import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import IceLabel from '@icedesign/label';
import moment from 'moment';
import {Table, Button, Pagination, Message} from '@alifd/next';
import ajax from '../../../../utils/ajax';
import {actions as inCommonsListActions} from '../../../../stores/inCommonsList';
import InCommonsListChart from '../InCommonsListChart'
import * as Scroll from 'react-scroll';


// 回到顶部动画设置, 值越小越快
const scrollTime = 300;
const scroll = Scroll.animateScroll;

const topIcon = (
  <svg t="1569296853164" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
       p-id="3812" width="32" height="32">
    <path
      d="M796.422846 524.478323 537.312727 265.185862c-6.368176-6.39914-14.688778-9.471415-22.976697-9.407768-1.119849-0.096331-2.07972-0.639914-3.19957-0.639914-4.67206 0-9.024163 1.087166-13.023626 2.879613-4.032146 1.536138-7.87163 3.872168-11.136568 7.135385L227.647682 524.27706c-12.512727 12.480043-12.54369 32.735385-0.032684 45.248112 6.239161 6.271845 14.432469 9.407768 22.65674 9.407768 8.191587 0 16.352211-3.135923 22.624056-9.34412L479.1356 363.426421l0 563.712619c0 17.695686 14.336138 31.99914 32.00086 31.99914s32.00086-14.303454 32.00086-31.99914L543.13732 361.8576l207.91012 207.73982c6.240882 6.271845 14.496116 9.440452 22.687703 9.440452s16.319527-3.103239 22.560409-9.311437C808.870206 557.277355 808.902889 536.989329 796.422846 524.478323z"
      p-id="3813" fill="#8a8a8a"></path>
    <path
      d="M864.00258 192 160.00258 192c-17.664722 0-32.00086-14.336138-32.00086-32.00086S142.337858 128 160.00258 128l704 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.698266 192 864.00258 192z"
      p-id="3814" fill="#8a8a8a"></path>
  </svg>
);


class InCommonsList extends Component {
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
          title: '目标号码',
          dataIndex: 'peer_num',
          cell: this.labelRender.bind(this),
          lock: true,
          width: 160,
        },
        // {
        //   title: '人员信息',
        //   dataIndex: 'peer_num',
        //   cell: this.labelRender.bind(this),
        // },
        {
          title: '归属地',
          dataIndex: 'peer_num_attr',
          lock: true,
          width: 120,
        },
        {
          title: '出现数',
          dataIndex: 'total',
          lock: true,
          width: 100,
        },
      ],
      numCols: [
        {
          title: '目标号码',
          dataIndex: 'peer_num',
          cell: this.labelRender.bind(this),
          lock: true,
          width: 150,
        },
        // {
        //   title: '人员信息',
        //   dataIndex: 'peer_num',
        //   cell: this.labelRender.bind(this),
        // },
        {
          title: '归属地',
          dataIndex: 'peer_num_attr',
          lock: true,
          width: 120,
        },
        {
          title: '出现数',
          dataIndex: 'total',
          lock: true,
          width: 100,
        },
      ],
      inCommonsItems: [],
      inCommonsData: [],
      isStickyHeader: true
    };

    this.fetchData = this.fetchData.bind(this);
    this.showAddModal = this.showAddModal.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.showFileImp = this.showFileImp.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
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
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = ids;
    console.log('onChange', ids, records);
    this.setState({rowSelection});
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
        this.setState({isEdit: true});
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
      this.props.actions.deleteLabelPN({caseId: this.props.caseId, id: this.state.itemId})
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
    const {rowSelection} = this.state;
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
        <h3 style={{color: 'red', margin: 0}}>{value.count}</h3>
        <span>{moment(record[`${value.num}started_at_min`]).format('MM.DD')}至{moment(record[`${value.num}started_at_max`]).format('MM.DD')}</span>
      </div>
    ) : value;
  }

  defaultRender(value) {
    return value;
  }

  labelRender(value, index, record) {
    // let val = '';
    // labelPNs.items.forEach(item => {
    //   console.log(item);
    //   if (item.num === value) {
    //     val = (
    //       <div>
    //         <span>{item}</span>
    //         <IceLabel inverse={false}
    //                   style={{
    //                     fontSize: '14px',
    //                     backgroundColor: item.label_bg_color,
    //                     color: item.label_txt_color,
    //                   }}
    //         >{item.label}
    //         </IceLabel>
    //       </div>
    //     );
    //   }else {
    //     val = (
    //       <span>{value}</span>
    //     )
    //   }
    // });
    //
    // return val;


    const {labelPNs} = this.props;
    if (labelPNs) {
      labelPNs.LargItems.forEach(item => {
        if (item.num === record.peer_num) {
          record.Tagging = item
        }
      });
    }


    return (
      <div>
        <span>{value}</span>
        {record.Tagging ? (<IceLabel inverse={false} style={{
          fontSize: '12px',
          backgroundColor: record.Tagging.label_bg_color,
          color: record.Tagging.label_txt_color,
          marginLeft: '5px'
        }}>{record.Tagging.label}</IceLabel>) : <span style={{marginLeft: '5px'}}>{record.owner_name} {record.peer_cname}</span>}
      </div>
    )
  }

  fetchData(params) {
    const {actions, caseId, labelPNs} = this.props;
    let {cols, numCols} = this.state;
    let headerNum = [];

    if (params.criteria && params.criteria.owner_num) {
      headerNum = [...params.criteria.owner_num[1]];
    }
    actions.fetchInCommonsLists({case_id: caseId, ...params}).then(res => {
      if (res.body.meta && res.body.meta.success) {
        numCols = [];
        labelPNs.LargItems.forEach(item => {
          if (headerNum.indexOf(item.num) !== -1) {
            headerNum[headerNum.indexOf(item.num)] = item;
          }
        });
        console.log(headerNum);
        const inCommonsItems = [];
        const map = {};
        res.body.data.forEach(item => {
          if (headerNum.indexOf(item.owner_num) !== -1) {
            headerNum[headerNum.indexOf(item.owner_num)] = {
              label: item.owner_cname,
              num: item.owner_num,
              label_bg_color: '#fff',
              label_txt_color: '#ccc'
            };
          }
          if (!map[item.peer_num]) {
            item.total = 1;
            item[item.owner_num] = {
              count: item.count,
              num: item.owner_num,
            };
            item[`${item.owner_num}started_at_min`] = item.started_at_min;
            item[`${item.owner_num}started_at_max`] = item.started_at_max;
            inCommonsItems.push(item);
            map[item.peer_num] = item;
          } else {
            inCommonsItems.forEach(i => {
              if (i.peer_num === item.peer_num) {
                i.total += 1;
                i[item.owner_num] = {
                  count: item.count,
                  num: item.owner_num,
                };
                i[`${item.owner_num}started_at_min`] = item.started_at_min;
                i[`${item.owner_num}started_at_max`] = item.started_at_max;
              }
            });
          }
        });
        headerNum.forEach(item => {
          console.log(item);
          if (typeof item === 'object') {
            numCols.push({
              title: <div><span>{item.num}</span><IceLabel inverse={false} style={{
                fontSize: '12px',
                backgroundColor: item.label_bg_color,
                color: item.label_txt_color,
                marginLeft: '5px'
              }}>{item.label}</IceLabel></div>,
              dataIndex: item.num,
              cell: this.numRender,
              width: 180
            });
          } else {
            numCols.push({
              title: item,
              dataIndex: item,
              cell: this.numRender,
              width: 180
            });
          }
        });

        this.setState({
          numCols: [...cols, ...numCols],
          inCommonsItems,
          inCommonsData:  res.body.data
        });
      }
    }).catch(err => {
      console.log(err);
    });
  }

  componentDidMount() {
    window.onscroll = () => {
      const t = document.documentElement.scrollTop || document.body.scrollTop;
      // if (Array.isArray(this.props.PBAnalyze) && this.props.PBAnalyze.length == 0) return;
      const topDom = document.getElementById('top');
      if (t > 500) {
        topDom.classList.add('show');
        this.setState({
          toggleMiniTimeLine: false,
        });
      } else {
        topDom.classList.remove('show');
        this.setState({
          toggleMiniTimeLine: true,
        });
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.criteria && Object.keys(nextProps.criteria).length !== 0 && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.criteria)) {
      this.fetchData(nextProps.criteria);
      this.setState({
        criteria: nextProps.criteria,
      });
    }
    if (nextProps.criteria && JSON.stringify(nextProps.criteria) === '{}'){
      this.setState({numCols:[],inCommonsData:[]})
    }
  }

  componentWillUnmount() {
    window.onscroll = null
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

  handleStickyHeader = (bool) => {
    this.setState({
      isStickyHeader: bool
    })
  }

  onTop = () => {
    scroll.scrollTo(0, {
      duration: scrollTime
    });
  }

  render() {
    const {numCols, inCommonsItems, inCommonsData, isStickyHeader} = this.state;
    return (
      <div style={styles.container}>
        <div id="top" onClick={this.onTop}>
          {topIcon}
        </div>
        <Table
          loading={this.props.inCommonsList.showLoading}
          dataSource={inCommonsItems}
          // rowSelection={this.state.rowSelection}
          // onRowClick={this.onRowClick}
          // primaryKey="num"
          useVirtual
          fixedHeader
          maxBodyHeight={document.documentElement.offsetHeight - 50 || document.body.offsetHeight - 50}
          style={styles.table}
        >
          {
            numCols.map(col => {
              return (
                <Table.Column align="center" title={col.title} dataIndex={col.dataIndex} key={col.dataIndex}
                              cell={col.cell || this.defaultRender} width={col.width} lock={col.lock} />
              );
            })
          }
        </Table>
        <div style={{boxShadow: '0 0 20px #c7c7c7', marginTop: '10px'}}>
          <InCommonsListChart dataSource={inCommonsData} handleStickyHeader={this.handleStickyHeader} stickyHeader={isStickyHeader} />
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
    actions: bindActionCreators({...inCommonsListActions}, dispatch),
  }),
)(InCommonsList);
