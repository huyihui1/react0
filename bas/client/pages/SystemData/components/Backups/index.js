import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Pagination, Message, Dialog} from '@alifd/next';
import solarLunar from 'solarlunar';
import numeral from 'numeral'

// import ajax from '../../../utils/ajax';
// import {actions as caseBreakpointActions} from '../../../stores/caseBreakpoint';
import {actions as SystemDataActions} from '../../../../stores/SystemData';
import styles from './index.module.scss'

class BackupsPane extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          // console.log(records);
          // that.props.actions.setCaseBreakpoint(record);
          // console.log('onSelect', selected, record, records);
        },
        onSelectAll(selected, records) {
          console.log('onSelectAll', selected, records);
        },
        selectedRowKeys: [],
        mode: 'single',
      },
      backupsListData: [],
      show: false,
      rowData: {},
      current:1
    };

    this.onRowClick = this.onRowClick.bind(this);
    this.fetchdata = this.fetchdata.bind(this);
    this.exportBackups = this.exportBackups.bind(this);
    this.restoreBackups = this.restoreBackups.bind(this);
    this.exportBackupsAlert = this.exportBackupsAlert.bind(this);
    this.restoreBackupsAlert = this.restoreBackupsAlert.bind(this);
  }


  onTableChange = (ids, records) => {
    console.log(records);
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = ids;
    // console.log('onChange', ids, records);
    this.setState({rowSelection, rowData: records[0]});
  };


  handleClick = (text) => {
    if (text === '生成备份') {
      // this.exportBackups()
      this.exportBackupsAlert()
    } else if (text === '恢复备份') {
      if (this.state.rowSelection.selectedRowKeys.length === 1) {
        // this.restoreBackups()
        this.restoreBackupsAlert()
      } else {
        Message.warning('请选择一条数据');
      }
    } else {
      Message.warning('请选择一条数据');
    }
  };

  onRowClick(record) {
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = [record.name];
    this.setState({
      rowSelection,
      rowData: record
    });
  }

  fetchdata() {
    this.props.actions.fetchSystemDatas().then(res => {
      if (res.body.meta.success) {
        this.setState({backupsListData: res.body.data})
      }
    })
  }

  exportBackups() {
    this.setState({show: true});
    this.props.actions.exportSystemDatas().then(res => {
      if (res.body.meta.success) {
        this.fetchdata();
        this.setState({show: false});
        Message.success("备份成功!!")
      } else {
        Message.error("备份失败!");
        this.setState({show: false});
      }
    })
  }
  restoreBackups(){
    this.setState({show: true});
    this.props.actions.restoreSystemDatas({name:this.state.rowData.name}).then(res => {
      if (res.body.meta.success) {
        this.fetchdata();
        this.setState({show: false});
        Message.success("恢复成功!")
      } else {
        Message.error("恢复失败!");
        this.setState({show: false});
      }
    })
  }

  componentDidMount() {
    this.fetchdata()
  }

  componentWillReceiveProps(nextProps) {
  }

  fileSizeRender = (value, rowIndex, record, context) => {
    return numeral(value).format('0.0 b')
  };

  exportBackupsAlert() {
    const dialog = Dialog.show({
      title: '提示',
      content: <span style={{lineHeight:'20px'}}>数据库数据较多时备份需要较长时间。同时备份时<br/>可能会影响其他操作，建议您在空闲时进行备份操<br/>作。您确定要进行备份吗?</span>,
      footer: (
        <div style={{width: '300px'}}>
          <Button warning type="primary" onClick={() => {
            this.exportBackups();
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

  restoreBackupsAlert() {
    const dialog = Dialog.show({
      title: '提示',
      content: <span style={{lineHeight:'20px'}}>恢复之前的备份可能会让当前数据库丢失部分数据，<br/>您确定要恢复备份吗?</span>,
      footer: (
        <div style={{width: '300px'}}>
          <Button warning type="primary" onClick={() => {
            this.restoreBackups();
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

  render() {
    const buttons = [
      '生成备份',
      '恢复备份',
    ];
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>备份管理</h3>
        <div>
          <div className={styles.buttons}>
            {buttons.map((text, index) => {
              return (
                <Button
                  key={index}
                  className={styles.button}
                  onClick={() => this.handleClick(text)}
                  disabled={this.state.show}
                >
                  {text}
                </Button>
              );
            })}
          </div>
          <Table
            loading={this.props.isLoading}
            dataSource={this.state.backupsListData}
            rowSelection={this.state.rowSelection}
            onRowClick={this.onRowClick}
            primaryKey="name"
            maxBodyHeight={210}
            useVirtual
            className={styles.table}
          >
            <Table.Column align="center" title="备份文件" dataIndex="name"/>
            <Table.Column align="center" title="生成日期" dataIndex="created_at"/>
            <Table.Column align="center" title="文件大小" dataIndex="file_size" cell={this.fileSizeRender}/>
          </Table>
          {/*<div className={styles.pagination}>*/}
            {/*<Pagination*/}
              {/*current={this.state.current}*/}
              {/*// onChange={this.onPageChange}*/}
              {/*// total={this.state.pageTotal * this.props.pageSize}*/}
              {/*total={80}*/}
              {/*hideOnlyOnePage*/}
            {/*/>*/}
          {/*</div>*/}
        </div>
      </div>
    );
  }
}


// const styles = {
//   container: {
//     // margin: '0 20px',
//     letterSpacing: '2px',
//     padding: '20px',
//     background: 'white'
//   },
//   button: {
//     margin: '0 8px',
//     letterSpacing: '2px',
//   },
//   table: {
//     margin: '20px 0',
//     minHeight: '463px',
//   },
//   pagination: {
//     textAlign: 'center',
//     marginBottom: '20px',
//   },
// };

export default connect(
  state => ({
    caseId: state.cases.case.id,
    pageSize: state.caseBreakpoints.pageSize,
    isLoading: state.systemData.isLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...SystemDataActions}, dispatch),
  }),
)(BackupsPane);
