import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Pagination, Message, Input, Upload} from '@alifd/next';
// import ajax from '../../../utils/ajax';
import {actions} from '../../../../stores/setting';
import AccountSettingForm from './AccountSettingForm';
import PasswordForm from './PasswordForm';
import {VerifyLogin} from './../../../../pages/UserLogin/actions'
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';

class AccountSettingList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      passwordModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          that.props.actions.setSystemSetting(record);
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
      value: {},
      settings: {},
      childThis:{}
    };

    this.fetchData = this.fetchData.bind(this);
    this.showAddModal = this.showAddModal.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.showFileImp = this.showFileImp.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.showPasswordModal = this.showPasswordModal.bind(this);
    this.modifyPassword = this.modifyPassword.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
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
    if (text === '编辑') {
      if (this.state.rowSelection.selectedRowKeys.length === 1) {
        this.showAddModal();
        this.setState({isEdit: true});
      } else {
        Message.warning('请选择一条数据');
      }
    }
  };

  onRowClick(record, index) {
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = [record.id];
    this.setState({
      rowSelection,
      itemId: record.id,
    });
    this.props.actions.setSetting({...record, index});
    this.props.actions.setSystemSetting(record);
  }

  fetchData(caseId = this.props.caseId) {
    const {actions, pageSize} = this.props;
    actions.fetchSettings().catch(err => {
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
    this.getUserProfile()
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.caseId && parseInt(this.state.caseId, 0) !== nextProps.caseId) {
      this.fetchData(nextProps.caseId);
    }
    if (nextProps.setting.accountMeta && nextProps.setting.accountMeta.page) {
      this.setState({
        current: nextProps.setting.accountMeta.page.current,
        pageTotal: nextProps.setting.accountMeta.page.total,
      });
    }
  }

  modifyPassword() {
    this.showPasswordModal();
    this.state.childThis.clearValue()
  }

  getUserProfile() {
    const {actions} = this.props;
    actions.getUserProfileSetting().then(res => {
      if (res.body.meta.code == '200') {
        this.setState({value: res.body.data})
      }
    })
  }

  preservation = () => {
    const {actions} = this.props;
    actions.getUserAccountSetting({name: this.state.value.name, avatar: ''}).then(res => {
      if (res.body.meta.code == '200') {
        Message.success('修改成功!');
        this.props.actions.VerifyLogin();
        this.getUserProfile()
      } else {
        Message.error('修改失败!')
      }
    })
  }

  vRender = (value, rowIndex, record, context) => {
    if (value === 'full') {
      return '高级版'
    }
    if (value === 'favorites') {
      return '快捷版'
    }
    return value;
  };

  setThis = (value) => {
    this.setState({childThis:value})
  };

  render() {
    const buttons = [
      // '导入',
      '编辑',
    ];
    const {setting} = this.props;
    return (
      <div style={styles.setBox}>
        <div style={styles.boxLeft}>
          <IceFormBinderWrapper ref="form" onChange={this.formChange} value={this.state.value}>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>账号：</div>
              {/*<IceFormBinder*/}
              {/*name="username"*/}
              {/*required*/}
              {/*>*/}
              {/*<Input*/}
              {/*style={{width: '60%'}}*/}
              {/*readOnly*/}
              {/*/>*/}
              {/*</IceFormBinder>*/}
              <span>{this.state.value.username}</span>
              {/* <IceFormError name="num" style={styles.formError}/> */}
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>使用人：</div>
              <IceFormBinder
                name="name"
                required
              >
                <Input
                  style={{width: '60%'}}
                />
              </IceFormBinder>
              {/* <IceFormError name="num" style={styles.formError}/> */}
            </div>
            <div style={styles.formItem}>
              <div style={{...styles.formLabel, height: '100px'}}>头像：</div>
              <IceFormBinder
                name="1"
                required
              >
                <Upload.Card
                  name="avatar"
                  listType="card"
                  action=""
                  accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                  limit={1}
                />
              </IceFormBinder>
              {/* <IceFormError name="num" style={styles.formError}/> */}
            </div>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>最近登录：</div>
              {/*<IceFormBinder*/}
              {/*name="last_login_at"*/}
              {/*required*/}
              {/*>*/}
              {/*<Input*/}
              {/*style={{width: '60%'}}*/}
              {/*readOnly*/}
              {/*/>*/}
              {/*</IceFormBinder>*/}
              <span>{this.state.value.last_login_at + '    IP: ' + this.state.value.last_remote_host}</span>
              {/* <IceFormError name="num" style={styles.formError}/> */}
            </div>
            <div style={{padding: '20px 0'}}>
              <div style={{paddingLeft: '120px', marginTop: '200px'}}>
                <Button
                  type="primary"
                  onClick={this.modifyPassword}
                >
                  修改密码
                </Button>
                <Button
                  type="secondary"
                  style={{marginLeft: '15px'}}
                  onClick={this.preservation}
                >
                  保 存
                </Button>
              </div>
            </div>
          </IceFormBinderWrapper>
        </div>
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
          <Table
            loading={this.props.isLoading}
            dataSource={setting.accountItems}
            rowSelection={this.state.rowSelection}
            onRowClick={this.onRowClick}
            primaryKey="id"
            style={styles.table}
          >
            <Table.Column align="left" alignHeader='center' title="描述" dataIndex="memo"/>
            <Table.Column align="center" title="值" dataIndex="v" cell={this.vRender}/>
            {/*<Table.Column align="center" title="key" dataIndex="k"/>*/}
          </Table>
          <AccountSettingForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit}
                              settings={this.state.settings}/>
          <PasswordForm visible={this.state.passwordModal} onClose={this.showPasswordModal} setThis={this.setThis}/>
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
      </div>
    );
  }
}


const styles = {
  container: {
    margin: '0 20px',
    letterSpacing: '2px',
    flex: '60%',
    // border: '1px solid #ccc'
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
  setBox: {
    display: 'flex'
  },
  boxLeft: {
    flex: '40%',
    border: '1px solid #EEEFF3',
    borderRadius: '6px'
  },
  formItem: {
    margin: '10px 0',
    display: 'flex',
    alignItems: 'center',
  },
  formLabel: {
    width: '120px',
    marginRight: '6px',
    textAlign: 'right',
  },
};

export default connect(
  state => ({
    setting: state.setting,
    pageSize: state.setting.pageSize,
    isLoading: state.setting.isLoading,
  }),
  dispatch => ({
    actions: bindActionCreators({...actions, VerifyLogin}, dispatch),
  }),
)(AccountSettingList);
