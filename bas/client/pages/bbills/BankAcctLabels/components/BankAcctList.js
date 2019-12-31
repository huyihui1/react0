import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import IceLabel from '@icedesign/label';
import {Table, Button, Pagination, Message} from '@alifd/next';
import ajax from '../../../../utils/ajax';
import {actions as bankAcctLabels} from '../../../../bbStores/bankAcctLabels';
import BankAcctForm from './BankAcctForm';

class BankAcctList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          that.props.actions.setBankAcct(record);
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
      this.props.actions.deleteBankAcct({caseId: this.props.caseId, id: this.state.itemId})
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

    this.props.actions.setBankAcct(JSON.parse(JSON.stringify(record)));
  }

  fetchData(caseId = this.props.caseId) {
    const {actions, pageSize} = this.props;
    actions.fetchBankAccts({caseId}, {
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
    return (
      <IceLabel inverse={false} style={{
        fontSize: '14px',
        backgroundColor: record.label_bg_color,
        color: record.label_txt_color
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
    if (nextProps.bankAcctLables.meta && nextProps.bankAcctLables.meta.page) {
      this.setState({
        current: nextProps.bankAcctLables.meta.page.current,
        pageTotal: nextProps.bankAcctLables.meta.page.total,
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
    const buttons = [
      '添加',
      '编辑',
      '删除',
    ];
    const {bankAcctLables} = this.props;
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
          dataSource={bankAcctLables.items}
          rowSelection={this.state.rowSelection}
          onRowClick={this.onRowClick}
          primaryKey="id"
          style={styles.table}
        >
          <Table.Column align="center" title="账号" dataIndex="bank_acct" width={155}/>
          <Table.Column align="center" title="卡号" dataIndex="card_num" width={155}/>
          <Table.Column align="center" title="标注" dataIndex="label" cell={this.tableColumnRender} width={70}/>
          <Table.Column align="center" title="标签" dataIndex="ptags"
                        cell={this.labelGroupsRender}
                        width={180}/>
          <Table.Column align="center" title="备注" dataIndex="memo" width={200}/>
          <Table.Column align="center" title="产生途径" dataIndex="source" cell={this.cellRender} width={90}/>
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
    bankAcctLables: state.bankAcctLables,
    caseId: state.cases.case.id,
    pageSize: state.bankAcctLables.pageSize,
    isLoading: state.bankAcctLables.isLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...bankAcctLabels}, dispatch),
  }),
)(BankAcctList);
