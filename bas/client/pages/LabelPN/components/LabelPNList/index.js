import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import IceLabel from '@icedesign/label';
import {Table, Button, Pagination, Message} from '@alifd/next';
import ajax from '../../../../utils/ajax';
import {actions as LabelPNActions} from '../../../../stores/labelPN';
import LabelPNForm from '../LabelPNForm';
import FileImport from '../FileImport';

class LabelPnList extends Component {
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

  fetchData(caseId = this.props.caseId) {
    const {actions, pageSize} = this.props;
    console.log(pageSize);
    console.log(actions);
    actions.fetchLabelPNs({caseId}, {
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
    if (nextProps.labelPNs.meta && nextProps.labelPNs.meta.page) {
      this.setState({
        current: nextProps.labelPNs.meta.page.current,
        pageTotal: nextProps.labelPNs.meta.page.total,
      });
    }
  }

  labelGroupsRender(value, index, record) {
    let newVal = [];
    if (value) {
      value.forEach(item => {
        newVal.push(item);
      });
    }
    if (record.ptags) {
      if (typeof record.ptags == 'string') {
        JSON.parse(record.ptags).forEach(item => {
          // console.log(item);
          newVal.push(item);
        });
      } else {
        record.ptags.forEach(item => {
          // console.log(item);
          newVal.push(item);
        });
      }
    }
    if (newVal.length > 0) {
      return newVal.join(', ')
    } else {
      return value
    }
  }


  render() {
    const buttons = [
      '导入',
      '添加',
      '编辑',
      '删除',
    ];
    const {labelPNs} = this.props;
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
          dataSource={labelPNs.items}
          rowSelection={this.state.rowSelection}
          onRowClick={this.onRowClick}
          primaryKey="num"
          style={styles.table}
        >
          <Table.Column align="center" title="号码" dataIndex="num" width={155}/>
          <Table.Column align="center" title="标注" dataIndex="label" cell={this.tableColumnRender} width={70}/>
          <Table.Column align="center" title="标签" dataIndex="label_groups" cell={this.labelGroupsRender} width={180}/>
          <Table.Column align="center" title="备注" dataIndex="memo"/>
          <Table.Column align="center" title="产生途径" dataIndex="source" cell={this.cellRender} width={90}/>
          <Table.Column align="center" title="修改时间" dataIndex="updated_at" width={130}/>
        </Table>
        <LabelPNForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit} current={this.state.current}/>
        <FileImport title="号码标注导入"
                    url={ajax.baseUrl}
                    caseId={this.state.caseId}
                    visible={this.state.fileImpShow}
                    onClose={this.showFileImp}
                    afterFileImpFun={this.fetchData}
        />
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
    labelPNs: state.labelPNs,
    caseId: state.cases.case.id,
    pageSize: state.labelPNs.pageSize,
    isLoading: state.labelPNs.isLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...LabelPNActions}, dispatch),
  }),
)(LabelPnList);
