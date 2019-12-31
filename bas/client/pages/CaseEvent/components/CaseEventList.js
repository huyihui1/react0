import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Button, Pagination, Message } from '@alifd/next';
import IceLabel from '@icedesign/label';
import solarLunar from 'solarlunar';
import moment from 'moment'
// import ajax from '../../../utils/ajax';
import { actions as caseEventActions } from '../../../stores/caseEvent';
import CaseEventsForm from './CaseEventForm';

class CaseEventList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          that.props.actions.setCaseEvent(record);
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
    this.setState({ rowSelection,itemId:records[0].id });
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
      this.props.actions.deleteCaseEvent({ caseId: this.props.caseId, id: this.state.itemId })
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
    rowSelection.selectedRowKeys = [record.name];
    this.setState({
      rowSelection,
      itemId: record.id,
    });
    this.props.actions.setCaseEvent(record);
  }

  fetchData(caseId = this.props.caseId) {
    const { actions, pageSize } = this.props;
    console.log(actions);
    actions.fetchCaseEvents({ caseId }, {
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
        <span style={{ fontSize: '14px', borderBottom: `2px solid ${record.color}` }}>{moment(value).format("YYYY-MM-DD")}</span>
        <span style={{marginLeft: '5px', fontSize: '12px'}}>{solar2lunarData.monthCn}{solar2lunarData.dayCn}</span>
      </span>
    );
  }


  tableColumnRenderEnd(value, index, record) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const solar2lunarData = solarLunar.solar2lunar(year, month, day);
    return (
      <span>
        <span style={{ fontSize: '14px', borderBottom: `2px solid ${record.color}` }}>{moment(value).format("YYYY-MM-DD")}</span>
        <span style={{marginLeft: '5px', fontSize: '12px'}}>{solar2lunarData.monthCn}{solar2lunarData.dayCn}</span>
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
    if (nextProps.caseEvents.meta && nextProps.caseEvents.meta.page) {
      this.setState({
        current: nextProps.caseEvents.meta.page.current,
        pageTotal: nextProps.caseEvents.meta.page.total,
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
    const { caseEvents } = this.props;
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
          dataSource={caseEvents.items}
          rowSelection={this.state.rowSelection}
          onRowClick={this.onRowClick}
          primaryKey="name"
          style={styles.table}
        >
          <Table.Column align="center" title="开始日期" dataIndex="started_at" cell={this.tableColumnRender} width={230} />
          <Table.Column align="center" title="结束日期" dataIndex="ended_at" cell={this.tableColumnRenderEnd} width={230} />
          <Table.Column align="center" title="事件" dataIndex="name" />
          {/* <Table.Column align="center" title="标注" dataIndex="color" cell={this.tableColumnRender} /> */}
        </Table>
        <CaseEventsForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit} />
        {/* <FileImport title="亲情网导入" */}
        {/* url={ajax.baseUrl} */}
        {/* caseId={this.state.caseId} */}
        {/* visible={this.state.fileImpShow} */}
        {/* onClose={this.showFileImp} */}
        {/* afterFileImpFun={this.fetchData} */}
        {/* /> */}
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
    caseEvents: state.caseEvents,
    caseId: state.cases.case.id,
    pageSize: state.caseEvents.pageSize,
    isLoading: state.caseEvents.isLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...caseEventActions }, dispatch),
  }),
)(CaseEventList);
