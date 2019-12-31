import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Button, Pagination, Message } from '@alifd/next';
// import ajax from '../../../utils/ajax';
import { actions as systemSettingActions } from '../../../stores/systemSettings';
import SystemSettingForm from './GlobalSettingForm';

class GlobalSettingList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          that.props.actions.setSystemSetting(record);
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
    } else if (this.state.rowSelection.selectedRowKeys.length === 1) {
      Message.loading({
        title: '删除中...',
        duration: 0,
      });
      this.props.actions.deleteSystemSetting({account_id: '0', id: this.state.itemId })
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

  onRowClick(record, index) {
    const { rowSelection } = this.state;
    rowSelection.selectedRowKeys = [record.k];
    this.setState({
      rowSelection,
      itemId: record.id,
    });
    this.props.actions.setSystemSetting({ ...record, index });
  }

  fetchData(caseId = this.props.caseId) {
    const { actions, pageSize } = this.props;
    actions.fetchSystemSettings({ type: 'global' }, {
      query: {
        page: this.state.current,
        pagesize: pageSize,
      },
    }).catch(err => {
      Message.error(err.message);
    });
    this.setState({
      caseId,
    });
  }
  tableColumnRender(value, index, record) {
    return (
      <div style={{ width: '100%', height: '20px', background: record.color }} />
    );
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.caseId && parseInt(this.state.caseId, 0) !== nextProps.caseId) {
      this.fetchData(nextProps.caseId);
    }
    if (nextProps.systemSettings.globalMeta && nextProps.systemSettings.globalMeta.page) {
      this.setState({
        current: nextProps.systemSettings.globalMeta.page.current,
        pageTotal: nextProps.systemSettings.globalMeta.page.total,
      });
    }
  }

  render() {
    const buttons = [
      // '导入',
      '添加',
      '编辑',
      '删除',
    ];
    const { systemSettings } = this.props;
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
          dataSource={systemSettings.globalItems}
          rowSelection={this.state.rowSelection}
          onRowClick={this.onRowClick}
          primaryKey="k"
          style={styles.table}
        >
          <Table.Column align="center" title="描述" dataIndex="memo" />
          <Table.Column align="center" title="Key" dataIndex="k" />
          <Table.Column align="center" title="值" dataIndex="v" />
        </Table>
        <SystemSettingForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit} />
        {/*<FileImport title="亲情网导入"*/}
        {/*url={ajax.baseUrl}*/}
        {/*caseId={this.state.caseId}*/}
        {/*visible={this.state.fileImpShow}*/}
        {/*onClose={this.showFileImp}*/}
        {/*afterFileImpFun={this.fetchData}*/}
        {/*/>*/}
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
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default connect(
  state => ({
    systemSettings: state.systemSettings,
    pageSize: state.systemSettings.pageSize,
    isLoading: state.systemSettings.isLoading,
  }),
  dispatch => ({
    actions: bindActionCreators({ ...systemSettingActions }, dispatch),
  }),
)(GlobalSettingList);
