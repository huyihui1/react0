import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Pagination, Message, Dialog} from '@alifd/next';
import {actions as PubServiceNumsActions} from '../../../stores/PubServiceNums';
import PubServiceNumsForm from './PubServiceNumsForm'


export class PubServiceNumsList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          that.props.actions.setPubServiceNums(record);
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
      pubServiceNumsList: []
    };

    // this.fetchData = this.fetchData.bind(this);
    this.showAddModal = this.showAddModal.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.showFileImp = this.showFileImp.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.changeShortNum = this.changeShortNum.bind(this);
    this.fetch = this.fetch.bind(this);
    this.popupAlert = this.popupAlert.bind(this)
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
      this.fetch(current)
    });
  };

  changeShortNum() {
    this.props.actions.changeShortNumRelNumber({caseId: this.props.caseId}).then(res => {
      if (res.status === 'resolved') {
        Message.success('转换成功');
      }
    }).catch(err => {
      console.log(err);
      Message.error('转换失败');
    });
  }

  handleClick = (text) => {
    if (text === '添加') {
      this.showAddModal();
    } else if (text === '编辑') {
      if (this.state.rowSelection.selectedRowKeys.length === 1) {
        this.showAddModal();
        this.setState({isEdit: true});
      } else {
        Message.warning('请选择一条数据');
      }
    } else if (this.state.rowSelection.selectedRowKeys.length === 1) {
      this.popupAlert()
    } else {
      Message.warning('请选择一条数据');
    }

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
            this.props.actions.removePubServiceNums({id: this.props.caseEvent.id}).then(res => {
              console.log(res);
              if (res.body.meta.success) {
                Message.success('删除成功');
                this.state.rowSelection.selectedRowKeys = [];
                this.fetch(this.state.current)
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


  onRowClick(record) {
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = [record.id];
    this.setState({
      rowSelection,
      itemId: record.id,
    });
    this.props.actions.setPubServiceNums(record);
  }

  componentDidMount() {
    this.fetch(this.state.current)
  }

  fetch(page) {
    const {actions, caseId} = this.props;
    actions.fetchPubServiceNums({caseId}, {
      query: {
        page: page,
        pagesize: this.props.pageSize
      }
    }).then(res => {
      if (res.body.meta.success && res.body.data.length === 0) {
        actions.fetchPubServiceNums({caseId}, {
          query: {
            page: this.state.current - 1,
            pagesize: this.props.pageSize
          }
        })
        this.setState({current: this.state.current - 1})
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pubServiceNumsList && nextProps.meta.page && nextProps.meta.page.total) {
      this.setState({pageTotal: nextProps.meta.page.total, pubServiceNumsList: nextProps.pubServiceNumsList})
    }
  }

  render() {
    const buttons = [
      '添加',
      '编辑',
      '删除',
    ];
    const {PubServiceNumsList} = this.props;
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
          dataSource={this.state.pubServiceNumsList}
          rowSelection={this.state.rowSelection}
          onRowClick={this.onRowClick}
          primaryKey="id"
          style={styles.table}
        >
          <Table.Column align="center" title="特殊号码" dataIndex="num"/>
          <Table.Column align="center" title="号码说明" dataIndex="memo"/>
          <Table.Column align="center" title="分组" dataIndex="grup"/>
        </Table>
        <PubServiceNumsForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit}
                            caseThis={this} current={this.state.current}/>
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
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    pageSize: state.pubServiceNums.pageSize,
    // isLoading: state.relNumbers.isLoading,
    meta: state.pubServiceNums.meta,
    pubServiceNumsList: state.pubServiceNums.PubServiceNumsList,
    caseEvent: state.pubServiceNums.item
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...PubServiceNumsActions}, dispatch),
  }),
)(PubServiceNumsList);
