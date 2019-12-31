import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import IceLabel from '@icedesign/label';
import { Table, Button, Pagination, Message } from '@alifd/next';
import ajax from '../../../../utils/ajax';
import { actions as CitizensActions } from '../../../../stores/citizens';
import CitizensForm from '../CitizensForm';
import FileImport from '../FilesImport';

class CitzensList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          console.log('onSelect', selected, record, records);
          // that.props.actions.setCitizen(record);
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
    } else if (text === '归档到人员库') {
      Message.warning('功能未开发');
    } else if (this.state.rowSelection.selectedRowKeys.length === 1) {
      Message.loading({
        title: '删除中...',
        duration: 0,
      });
      this.props.actions.deleteCitizen({ caseId: this.props.caseId, id: this.state.itemId })
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
    // this.props.actions.setCitizen(record);
  }

  fetchData(caseId = this.props.caseId) {
    const { actions, pageSize } = this.props;
    console.log(pageSize);
    console.log(actions);
    actions.fetchCitizens({ caseId }, {
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
      <IceLabel inverse={false} style={{ fontSize: '14px', backgroundColor: record.label_bg_color, color: record.label_txt_color }}>{record.label}</IceLabel>
    );
  }
  cellRender(value) {
    if (value === 1) {
      return <span>手工单条添加</span>;
    } else if (value === 2) {
      return <span> 批量导入</span>;
    } else if (value === 3) {
      return <span>综合人员信息库中导入</span>;
    }
  }

  componentDidMount() {
    // this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.caseId && parseInt(this.state.caseId, 0) !== nextProps.caseId) {
      // this.fetchData(nextProps.caseId);
    }
    if (nextProps.citizens.meta && nextProps.citizens.meta.page) {
      this.setState({
        current: nextProps.citizens.meta.page.current,
        pageTotal: nextProps.citizens.meta.page.total,
      });
    }
  }

  handleTitle(key) {
    if (key === 'cname') {
      return '姓名'
    } else if (key === 'position') {
      return '职务'
    } else if (key === 'social_no') {
      return '身份证'
    } else {
      return key
    }
  }

  render() {
    const buttons = [
      '导入',
      '添加',
    ];
    const { citizens } = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.buttons}>
          {buttons.map((text, index) => {
            return (
              <Button
                key={index}

                style={styles.button}
                onClick={() => this.handleClick(text)}
              >
                {text}
              </Button>
            );
          })}
        </div>
        {
          citizens.items.map((item, index) => {
            return (
              <div key={index}>
                <h3>{item.book_name}</h3>
                <Table
                  loading={this.props.isLoading}
                  dataSource={[item]}
                  rowSelection={this.state.rowSelection}
                  onRowClick={this.onRowClick}
                  primaryKey="social_no"
                  style={styles.table}
                >
                  {
                    Object.keys(item).map((i, index) => {
                      if (i === 'book_name' || i === 'cid' || i === 'cb_id') {
                        return
                      }
                      return <Table.Column align="center" title={() => {return this.handleTitle(i)}} dataIndex={i} key={i} />;
                    })
                  }
                </Table>
              </div>
            );
          })
        }

        <CitizensForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit} />
        <FileImport title="人员信息导入"
          visible={this.state.fileImpShow}
          onClose={this.showFileImp}
          afterUploadFun={this.props.afterUploadFun}
          uuid={this.props.uuid}
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
    margin: '20px',
    letterSpacing: '2px',
  },
  button: {
    margin: '0 8px',
    letterSpacing: '2px',
  },
  table: {
    margin: '10px 0 20px',
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default connect(
  state => ({
    citizens: state.citizens,
    caseId: state.cases.case.id,
    pageSize: state.citizens.pageSize,
    isLoading: state.citizens.showLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...CitizensActions }, dispatch),
  }),
)(CitzensList);
