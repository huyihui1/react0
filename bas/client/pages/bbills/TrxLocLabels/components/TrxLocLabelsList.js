import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import IceLabel from '@icedesign/label';
import {Table, Button, Pagination, Message} from '@alifd/next';
import ajax from '../../../../utils/ajax';
import {actions as trxLocLabelsActions} from '../../../../bbStores/TrxLocLabels';
import BankAcctForm from './TrxLocLabelsForm';

class TrxLocLabelsList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          that.props.actions.setTrxLocLable(record);
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
    this.setState({rowSelection,itemId: records[0].id,});
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
      this.props.actions.deleteTrxLocLable({caseId: this.props.caseId, id: this.state.itemId})
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
    rowSelection.selectedRowKeys = [record.id];
    this.setState({
      rowSelection,
      itemId: record.id,
    });

    this.props.actions.setTrxLocLable(JSON.parse(JSON.stringify(record)));
  }

  fetchData(caseId = this.props.caseId) {
    const {actions, pageSize} = this.props;
    console.log(pageSize);
    console.log(actions);
    actions.fetchTrxLocLables({caseId}, {
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
    console.log(record)
    return (
      <IceLabel inverse={false} style={{
        fontSize: '14px',
        backgroundColor: record.marker_color,
        color: '#fff'
      }}>{record.label}</IceLabel>
    );
  }

  cellRender(value) {
    value = parseInt(value);
    if (value === 1) {
      return <span>手工单条添加</span>;
    } else if (value === 2) {
      return <span> 批量导入</span>;
    } else if (value === 3) {
      return <span>综合人员信息库中导入</span>;
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.caseId && parseInt(this.state.caseId, 0) !== nextProps.caseId) {
      this.fetchData(nextProps.caseId);
    }
    if (nextProps.trxLocLables.meta && nextProps.trxLocLables.meta.page) {
      this.setState({
        current: nextProps.trxLocLables.meta.page.current,
        pageTotal: nextProps.trxLocLables.meta.page.total,
      });
    }
  }

  labelGroupsRender(value, index, record) {
    let newVal = [];
    if (value) {
      if (typeof value == 'string') {
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
    }
    if (newVal.length > 0) {
      return newVal.join(', ')
    } else {
      return ''
    }
  }


  render() {
    console.log(this.props.trxLocLables.it);
    const buttons = [
      '添加',
      '编辑',
      '删除',
    ];
    const {trxLocLables} = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.buttons}>
          {buttons.map((text, index) => {
            return (
              <Button
                key={index}
                className={text === '删除' ? 'deleteBtn' : ''}
                style={styles.button}
                onClick={() => this.handleClick(text)}
              >
                {text}
              </Button>
            );
          })}
        </div>
        <Table
          loading={this.props.isLoading}
          dataSource={trxLocLables.items}
          rowSelection={this.state.rowSelection}
          onRowClick={this.onRowClick}
          primaryKey="id"
          style={styles.table}
        >
          <Table.Column align="center" title="机构号" dataIndex="branch_num" width={155}/>
          <Table.Column align="center" title="银行" dataIndex="bank_name" width={155}/>
          <Table.Column align="center" title="机构名称" dataIndex="branch" width={155}/>
          <Table.Column align="center" title="柜员号" dataIndex="teller_code" width={120}/>
          <Table.Column align="center" title="标注" dataIndex="label" cell={this.tableColumnRender} width={70}/>
          <Table.Column align="center" title="标签" dataIndex="ptags"
                        cell={this.labelGroupsRender}
                        width={180}/>
          <Table.Column align="center" title="备注" dataIndex="memo" width={200}/>
          {/*<Table.Column align="center" title="产生途径" dataIndex="source" cell={this.cellRender} width={90}/>*/}
          {/*<Table.Column align="center" title="修改时间" dataIndex="updated_at" width={130}/>*/}
        </Table>
        <BankAcctForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit} current={this.state.current}/>
        <div style={styles.pagination}>
          <Pagination
            current={this.state.current}
            total={this.state.pageTotal * this.props.pageSize}
            onChange={this.onPageChange}
            hideOnlyOnePage
          />
        </div>
      </div>
    );
  }
}


const styles = {
  container: {
    margin: '0 20px',
    letterSpacing: '2px',
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
    trxLocLables: state.trxLocLables,
    caseId: state.cases.case.id,
    pageSize: state.trxLocLables.pageSize,
    isLoading: state.trxLocLables.isLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...trxLocLabelsActions}, dispatch),
  }),
)(TrxLocLabelsList);
