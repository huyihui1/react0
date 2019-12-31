import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Pagination, Message, Dialog, ConfigProvider, Balloon} from '@alifd/next';
import IceLabel from '@icedesign/label';
import solarLunar from 'solarlunar';
// import ajax from '../../../utils/ajax';
import {actions as LicensesActions} from '../../../stores/Licenses';
import moment from 'moment';

import LicensesForm from './LicensesForm';
import UpgradeForm from './UpgradeForm'

import humanizeDuration from 'humanize-duration';

const shortSCNHumanizer = humanizeDuration.humanizer({
  language: 'shortCn',
  languages: {
    shortCn: {
      y: () => '年',
      mo: () => '月',
      w: () => '周',
      d: () => '天',
      h: () => '时',
      m: () => '分',
      s: () => '秒',
    }
  }
});


class LicensesList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      upgradeModal: false,
      formData: {},
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        // onSelect(selected, record, records) {
        //   that.props.actions.setCaseEvent(record);
        //   console.log('onSelect', selected, record, records);
        // },
        onSelectAll(selected, records) {
          console.log('onSelectAll', selected, records);
        },
        selectedRowKeys: [],
        mode: 'single',
      },
      current: 1,
      itemId: null,
      caseId: null,
      pageTotal: null,
      licensesList: [],
      licensesId: '',
      licensesFormThis: '',
      isEdit: true,
      Today: ''
    };

    this.fetchData = this.fetchData.bind(this);
    this.showAddModal = this.showAddModal.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.popupAlert = this.popupAlert.bind(this);
    this.emptyLicensesLIst = this.emptyLicensesLIst.bind(this);
    this.setThis = this.setThis.bind(this);
    this.showUpgradeModal = this.showUpgradeModal.bind(this);
    this.expiredAtRender = this.expiredAtRender.bind(this);
    this.HardwareRender = this.HardwareRender.bind(this)
  }

  showAddModal() {
    this.setState({
      addModal: !this.state.addModal,
    });
  }

  showUpgradeModal() {
    this.setState({
      upgradeModal: !this.state.upgradeModal,
    });
  }

  onTableChange = (ids, records) => {
    const {rowSelection, licensesId} = this.state;
    rowSelection.selectedRowKeys = ids;
    this.setState({rowSelection});
    this.setState({formData: records[0]})
  };

  emptyLicensesLIst() {
    const {licensesFormThis} = this.state;
    licensesFormThis.emptyList()
  }

  setThis(data) {
    this.setState({licensesFormThis: data})
  }


  handleClick = (text) => {
    if (text === '创建许可证') {
      this.emptyLicensesLIst();
      this.setState({isEdit: true});
      this.props.actions.setEstablishStatusSuperLicenses(true);
      this.props.actions.setLicensesFormDataSuperLicenses({});
      this.showAddModal();
    } else if (text === '下载许可证' && this.state.rowSelection.selectedRowKeys.length === 1) {
      this.showAddModal();
      this.setState({isEdit: false});
    } else if (text === '升级许可证' && this.state.rowSelection.selectedRowKeys.length === 1) {
      this.showUpgradeModal()
    } else if (this.state.rowSelection.selectedRowKeys.length === 1) {
      this.popupAlert()
    } else {
      Message.warning('请选择一条数据');
    }
  };


  popupAlert() {
    const dialog = Dialog.show({
      title: '警告',
      content: '此操作不可撤回,是否继续?',
      footer: (
        <div style={{width: '300px'}}>
          <Button warning type="primary" onClick={() => {
            Message.loading({
              title: '删除中...',
              duration: 0,
            });
            this.props.actions.removeSuperLicenses({id: this.state.rowSelection.selectedRowKeys})
              .then(res => {
                if (res.status === 'resolved') {
                  Message.success('删除成功');
                  this.fetchData();
                  const {rowSelection} = this.state;
                  rowSelection.selectedRowKeys = [];
                  this.setState({rowSelection});
                }
              })
              .catch(err => {
                console.log(err);
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
    console.log(record);
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = [record.id];
    this.setState({
      rowSelection,
      itemId: record.id,
    });
    // this.props.actions.setCaseEvent(record);
    this.setState({formData: record})
  }

  fetchData(caseId = this.props.caseId) {
    const {actions} = this.props;
    actions.fetchSuperLicenses().then(res => {
      res.body.data.forEach(item => {
        if (item.plan === 'Trival') {
          item.plans = '试用版'
        } else if (item.plan === 'Personal') {
          item.plans = '个人版'
        } else if (item.plan === 'Pro') {
          item.plans = '专业版'
        } else if (item.plan === 'Enterprise') {
          item.plans = '企业版'
        }
      });
      this.setState({licensesList: res.body.data})
    });

    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = [];
    this.setState({rowSelection});
  }

  componentDidMount() {
    this.fetchData()
    let Today = moment(moment()).format("x");
    this.setState({Today})
  }

  expiredAtRender(value, rowIndex, record, context) {
    let Maturity = moment(value).format("x");
    let Surplus = parseInt(Maturity - this.state.Today);
    let v = shortSCNHumanizer(parseInt(Surplus), {spacer: '', delimiter: '', units: ['y', 'mo', 'd', 'h', 'm', 's']});

    const div = <div>{value}</div>

    //
    // if (value) {
    //   if (Surplus > 0) {
    //     return (
    //       <span>{value + '          剩余' + v}</span>
    //     )
    //   } else {
    //     return (
    //       <span>{value + '          已到期' + v}</span>
    //     )
    //   }
    // }
    //

    return (
      <Balloon trigger={div} shouldUpdatePosition align='t' closable={false}>
        <div style={{fontSize:'14px'}}>
          {
            Surplus > 0 ? (
              <span>{'剩余   ' + v}</span>
            ) : (
              <span>{'已到期   ' + v}</span>
            )
          }
        </div>
      </Balloon>
    )


  }

  HardwareRender(value, rowIndex, record, context) {
    const div = <div style={styles.ellipsis}>{value}</div>;
    return (
      <Balloon trigger={div} shouldUpdatePosition align='t' closable={false}>
        <div style={{fontSize: '14px'}}>
          <div style={{margin: '8px 0'}}>
            <span>系统：</span>
            <span>{record.system_sn}</span>
          </div>
          <div style={{margin: '8px 0'}}>
            <span>主板：</span>
            <span>{record.baseboard_info}</span>
          </div>
          <div style={{margin: '8px 0'}}>
            <span>处理器：</span>
            <span>{record.processor_info}</span>
          </div>
          <div style={{margin: '8px 0'}}>
            <span>网卡：</span>
            <span>{record.mac_address}</span>
          </div>
          <div style={{margin: '8px 0'}}>
            <span>IP地址：</span>
            <span>{record.ip_address}</span>
          </div>
        </div>
      </Balloon>
    )
  }

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

  rowProps = (record, index) => {
    let Maturity = moment(record.expired_at).format("x");
    let Today = moment(moment()).format("x");
    let Surplus = parseInt((Maturity - Today) / 1000);
    return Surplus <= 0 ? {style: {backgroundColor: 'red', color: '#fff'}} : '';
  }

  render() {
    const buttons = [
      // '导入',
      '创建许可证',
      '下载许可证',
      '升级许可证',
      '删除许可证',
    ];
    const {caseEvents} = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.buttons}>
          {buttons.map((text, index) => {
            return (
              <ConfigProvider key={index} locale={{Dialog: {ok: 'OK', cancel: 'Cancel'}}}>
                <Button
                  key={index}
                  className={text === '删除许可证' ? 'deleteBtn' : ''}
                  style={styles.button}
                  onClick={() => this.handleClick(text)}
                >
                  {text}
                </Button>
              </ConfigProvider>
            );
          })}
        </div>
        <Table
          // loading={this.props.isLoading}
          dataSource={this.state.licensesList}
          rowSelection={this.state.rowSelection}
          onRowClick={this.onRowClick}
          primaryKey="id"
          rowProps={this.rowProps}
          style={styles.table}
        >
          <Table.Column align="center" title="机器编码" dataIndex="host_id" /*cell={this.tableColumnRender}*/ lock
                        width={380}/>
          <Table.Column align="center" title="客户" dataIndex="cust_name" lock width={150}/>
          <Table.Column align="center" title="硬件信息" dataIndex="system_sn" width={180} cell={this.HardwareRender}/>
          <Table.Column align="center" title="购买计划" dataIndex="plans" width={100}/>
          <Table.Column align="center" title="可用功能" dataIndex="features" width={180} cell={this.featuresRender} />
          <Table.Column align="center" title="账号数量" dataIndex="acct_limit" width={100}/>
          <Table.Column align="center" title="失效时间" dataIndex="expired_at" cell={this.expiredAtRender} width={200}/>
          <Table.Column align="center" title="签发时间" dataIndex="" width={100}/>
          <Table.Column align="center" title="签发人" dataIndex="" width={100}/>
        </Table>
        <LicensesForm visible={this.state.addModal} onClose={this.showAddModal} fetchData={this.fetchData}
                      setThis={this.setThis} isEdit={this.state.isEdit} formData={this.state.formData}
                      isEstablish={this.state.isEstablish}/>
        <UpgradeForm visible={this.state.upgradeModal} onClose={this.showUpgradeModal} formData={this.state.formData}
                     fetchData={this.fetchData}/>
        {/*<div style={styles.pagination}>*/}
        {/*<Pagination*/}
        {/*current={this.state.current}*/}
        {/*total={this.state.pageTotal * this.props.pageSize}*/}
        {/*onChange={this.onPageChange}*/}
        {/*hideOnlyOnePage*/}
        {/*/>*/}
        {/*</div>*/}
      </div>
    );
  }
}


const styles = {
  container: {
    margin: '0 20px',
    letterSpacing: '2px',
    minHeight: '563px'
  },
  button: {
    margin: '0 8px',
    letterSpacing: '2px',
  },
  table: {
    margin: '0px 0',
    // minHeight: '463px',
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  buttons: {
    marginBottom: '20px'
  },
  ellipsis: {
    // width:'100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
};

export default connect(
  state => ({
    caseId: state.cases.case.id,
    LicensesList: state
  }),
  dispatch => ({
    actions: bindActionCreators({...LicensesActions}, dispatch),
  }),
)(LicensesList);
