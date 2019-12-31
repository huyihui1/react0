import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Pagination, Message,Icon} from '@alifd/next';
import moment from 'moment';
// import ajax from '../../../utils/ajax';
import {actions as userAdminActions} from '../../../stores/adminAccounts';
import UserAdminForm from './AdminAccountForm';
import PasswordForm from './PasswordForm'

class AdminAccountList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      passwordModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          that.props.actions.setUserAdmin(record);
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
      isDisabled: true,
      clearPassword: {},
      deletedAt:null,
      childrenThis:{}
    };

    this.fetchData = this.fetchData.bind(this);
    this.showAddModal = this.showAddModal.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.showPasswordModal = this.showPasswordModal.bind(this);
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

  showPasswordModal() {
    this.setState({
      passwordModal: !this.state.passwordModal,
      clearPassword: {}
    });
  }

  onTableChange = (ids, records) => {
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = ids;
    console.log('onChange', ids, records);
    this.setState({rowSelection, itemId: records[0].id, isDisabled: records[0].built_in});
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
    } else if (text === '重置密码') {
      if (this.state.rowSelection.selectedRowKeys.length === 1) {
        this.showPasswordModal();
        this.state.childrenThis.claerPassWordMessage()
      } else {
        Message.warning('请选择一条数据');
      }
    } else if (text === '编辑') {
      if (this.state.rowSelection.selectedRowKeys.length === 1) {
        this.showAddModal();
        this.setState({isEdit: true});
      } else {
        Message.warning('请选择一条数据');
      }
    } else if (text === '冻结') {
      if (this.state.rowSelection.selectedRowKeys.length === 1) {
        this.revokeAdmin()
      } else {
        Message.warning('请选择一条数据');
      }
    } else if (text === '解冻') {
      if (this.state.rowSelection.selectedRowKeys.length === 1) {
        this.setbackAdmin()
      } else {
        Message.warning('请选择一条数据');
      }
    }
  };

  revokeAdmin = () => {
    const {actions, userAdmins} = this.props;
    actions.revokeUserAdmin({id: userAdmins.item.account.id}).then(res => {
      if (res.body.meta.success) {
        Message.success('冻结成功!');
        this.fetchData()
      } else {
        Message.error('冻结失败!')
      }
    }).catch(err => {
      Message.error(err.message)
    })
  };

  setbackAdmin = () => {
    const {actions, userAdmins} = this.props;
    actions.setbackUserAdmin({id: userAdmins.item.account.id}).then(res => {
      if (res.body.meta.success) {
        Message.success('解冻成功!');
        this.fetchData()
      } else {
        Message.error('解冻失败!')
      }
    }).catch(err => {
      Message.error(err.message)
    })
  };


  onRowClick(record) {
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = [record.account];
    this.setState({
      rowSelection,
      itemId: record.id,
      isDisabled: record.built_in
    });
    this.props.actions.setUserAdmin(record);
  }

  fetchData(caseId = this.props.caseId) {
    const {actions, pageSize} = this.props;
    actions.fetchUserAdmins({caseId}, {
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
      <div style={{width: '100%', height: '20px', background: record.color}}/>
    );
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.caseId && parseInt(this.state.caseId, 0) !== nextProps.caseId) {
      this.fetchData(nextProps.caseId);
    }
    if (nextProps.userAdmins.meta && nextProps.userAdmins.meta.page) {
      this.setState({
        current: nextProps.userAdmins.meta.page.current,
        pageTotal: nextProps.userAdmins.meta.page.total,
      });
    }
    // if (nextProps.userAdmins.item){
    //   this.setState({deletedAt:nextProps.userAdmins.item.account.deleted_at})
    // }
  }

  usernameRender = (value, index, record) => {
    if (record.deleted_at){
      return <div style={{position:'relative'}}><Icon type='warning' size="small" style={{position:'absolute',left:'-6px',top:'-2px',color:'#f1c826'}} title='账号已被冻结'/><span>{value}</span></div>
    }
    return value
  };

  rowPropsRender = (record,index) => {
    if (record.deleted_at){
      return {style:{backgroundColor:'#eee'}}
    }
  };

  setThis = (value) => {
    this.setState({childrenThis:value})
  };

  featuresRender = (value, rowIndex, record) => {
    if (Array.isArray(value)) {
      let text = []
      value.forEach(item => {
        if (item === 'bbills') {
          text.push('账单系统')
        } else if (item === 'pbills') {
          text.push('话单系统')
        }
      })
      return (
        <div>
          {text.join(", ")}
        </div>
      )
    }
  }

  render() {
    const buttons = [
      '添加',
      '编辑',
      '重置密码',
      '冻结',
      '解冻'
    ];
    const {userAdmins} = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.buttons}>
          {buttons.map((text, index) => {
            return (
              <Button
                key={index}
                // disabled={text === '冻结' && this.state.deletedAt || text === '解冻' && !this.state.deletedAt ? true : false}
                style={styles.button}
                onClick={() => this.handleClick(text)}
              >
                {text}
              </Button>
            );
          })}
        </div>
        <div style={{margin: '20px 0'}}>
          <Table
            loading={this.props.isLoading}
            dataSource={userAdmins.items}
            rowSelection={this.state.rowSelection}
            onRowClick={this.onRowClick}
            primaryKey="account"
            style={styles.table}
            rowProps={this.rowPropsRender}
          >
            <Table.Column align="center" title="帐号" dataIndex="account" width={150} lock cell={this.usernameRender}/>
            <Table.Column align="center" title="用户" dataIndex="name" width={150} lock/>
            <Table.Column align="center" title="角色" dataIndex="role" width={150} lock/>
            <Table.Column align="center" title="最近登录IP" dataIndex="last_remote_host" width={200} />
            <Table.Column align="center" title="最近登录时间" dataIndex="last_login_at" width={200}/>
            <Table.Column align="center" title="单位" dataIndex="org" width={120}/>
            <Table.Column align="center" title="可用功能" dataIndex="sub_systems" width={200} cell={this.featuresRender} />
            <Table.Column align="center" title="备注" dataIndex="memo" width={300} />
          </Table>
        </div>
        <UserAdminForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit}
                       current={this.state.current} id={this.props.caseId}/>
        <PasswordForm visible={this.state.passwordModal} onClose={this.showPasswordModal}
                      clearPassword={this.state.clearPassword} setThis={this.setThis}></PasswordForm>
        {/*<FileImport title="亲情网导入"*/}
        {/*url={ajax.baseUrl}*/}
        {/*caseId={this.state.caseId}*/}
        {/*visible={this.state.fileImpShow}*/}
        {/*onClose={this.showPasswordModal}*/}
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
    userAdmins: state.userAdmins,
    pageSize: state.userAdmins.pageSize,
    isLoading: state.userAdmins.isLoading,
  }),
  dispatch => ({
    actions: bindActionCreators({...userAdminActions}, dispatch),
  }),
)(AdminAccountList);
