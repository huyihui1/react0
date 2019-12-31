import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Pagination, Message, Dialog} from '@alifd/next';
import solarLunar from 'solarlunar';

// import ajax from '../../../utils/ajax';
import {actions as caseBreakpointActions} from '../../../stores/caseBreakpoint';
import CaseBreakpointForm from './CaseBreakpointForm';

class CaseBreakpointList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          that.props.actions.setCaseBreakpoint(record);
          console.log('onSelect', selected, record, records);
        },
        onSelectAll(selected, records) {
          console.log('onSelectAll', selected, records);
        },
        selectedRowKeys: [],
        mode: 'single',
      },
      current: 1,
      itemId: null,
      isEdit: false,
      caseId: null,
      pageTotal: null,
      fileImpShow: false,
      visible: false
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
    this.setState({rowSelection,itemId:records[0].id});
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
    } else if (this.state.rowSelection.selectedRowKeys.length === 1) {
      Message.loading({
        title: '删除中...',
        duration: 0,
      });
      this.props.actions.deleteCaseBreakpoint({caseId: this.props.caseId, id: this.state.itemId})
        .then(res => {
          console.log(res);
          if (res.status === 'resolved') {
            this.setState({
              rowSelection: {
                ...this.state.rowSelection,
                selectedRowKeys: []
              }
            })
            this.onClose()
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
    rowSelection.selectedRowKeys = [record.name];
    this.setState({
      rowSelection,
      itemId: record.id,
    });
    this.props.actions.setCaseBreakpoint(record);
  }

  fetchData(caseId = this.props.caseId) {
    const {actions, pageSize} = this.props;
    console.log(actions);
    actions.fetchCaseBreakpoints({caseId}, {
      query: {
        page: this.state.current,
        pagesize: pageSize,
      },
    });
    this.setState({
      caseId,
    });
  }

  tableColumnRender(value, index, record) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const solar2lunarData = solarLunar.solar2lunar(year, month, day);
    return (
      <span>
        <span style={{marginRight: '5px', fontSize: '12px'}}>{solar2lunarData.monthCn}{solar2lunarData.dayCn}</span>
        <span style={{fontSize: '14px'}}>{value}</span>
      </span>
    );
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.caseId && parseInt(this.state.caseId, 0) !== nextProps.caseId) {
      this.fetchData(nextProps.caseId);
    }
    if (nextProps.caseBreakpoints.meta && nextProps.caseBreakpoints.meta.page) {
      this.setState({
        current: nextProps.caseBreakpoints.meta.page.current,
        pageTotal: nextProps.caseBreakpoints.meta.page.total,
      });
    }
  }

  onOpen() {
    if (this.state.rowSelection.selectedRowKeys.length === 1) {
      this.setState({
        visible: true,
      });
    } else {
      Message.warning('请选择一条数据');
    }
  }

  onClose() {
    this.setState({
      visible: false,
    });
  }

  popupConfirm = () => {
    Dialog.confirm({
      title: '删除',
      content: <div style={{lineHeight: '20px', fontSize: '13px'}}>您确定要删除该条记录吗?</div>,
      onOk: () => this.handleClick('删除'),
      onCancel: () => this.onClose()
    });
  };

  render() {
    const buttons = [
      // '导入',
      '添加',
      '编辑',
      '删除',
    ];
    const {caseBreakpoints} = this.props;
    return (
      <div style={styles.container}>
       <div>
         <div style={styles.buttons}>
           {buttons.map((text, index) => {
             return (
               <Button
                 key={index}
                 className={text === '删除' ? 'deleteBtn' : ''}
                 style={styles.button}
                 onClick={() => {
                   if (text === '删除') {
                     if (this.state.rowSelection.selectedRowKeys.length === 1) {
                       this.popupConfirm();
                     } else {
                       Message.warning('请选择一条数据');
                     }
                   } else {
                     this.handleClick(text)
                   }
                 }}
               >
                 {text}
               </Button>
             );
           })}
         </div>
         <Table
           loading={this.props.isLoading}
           dataSource={caseBreakpoints.items}
           rowSelection={this.state.rowSelection}
           onRowClick={this.onRowClick}
           primaryKey="name"
           style={styles.table}
         >
           <Table.Column align="center" title="时间分割点" dataIndex="started_at" width='35%' cell={this.tableColumnRender}/>
           {/*<Table.Column align="center" title="结束日期" dataIndex="ended_at" />*/}
           <Table.Column align="center" title="时间分割点说明" dataIndex="name" width='65%'/>
           {/*<Table.Column align="center" title="标注" dataIndex="color" cell={this.tableColumnRender} />*/}
         </Table>
         <CaseBreakpointForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit} caseThis={this}/>
         <div style={styles.pagination}>
           <Pagination
             current={this.state.current}
             total={this.state.pageTotal * this.props.pageSize}
             onChange={this.onPageChange}
             hideOnlyOnePage
           />
         </div>
       </div>
      </div>
    );
  }
}


const styles = {
  container: {
    // margin: '0 20px',
    letterSpacing: '2px',
    padding:'20px',
    background:'white'
  },
  button: {
    margin: '0 8px',
    letterSpacing: '2px',
  },
  table: {
    margin: '20px 0',
    minHeight: '463px',
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default connect(
  state => ({
    caseBreakpoints: state.caseBreakpoints,
    caseId: state.cases.case.id,
    pageSize: state.caseBreakpoints.pageSize,
    isLoading: state.caseBreakpoints.isLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...caseBreakpointActions}, dispatch),
  }),
)(CaseBreakpointList);
