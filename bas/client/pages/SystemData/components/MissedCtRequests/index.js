import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Pagination, Message} from '@alifd/next';
import {actions as SystemDataActions} from '../../../../stores/SystemData';
// import styles from "/index.module.scss";
import styles from './index.module.scss'

class MissedCtRequests extends Component {
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
      missedCtRequestsListData: [],
      current: 1,
      rowData: {}
    };
  }


  onTableChange = (ids, records) => {
    console.log(records);
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = ids;
    // console.log('onChange', ids, records);
    this.setState({rowSelection, rowData: records[0]});
  };

  componentDidMount() {
    this.getmissedCtRequestsList(this.state.current)
  }

  getmissedCtRequestsList = (current) => {
    this.props.actions.getmissedCtRequestsListSystemDatas({page: current}).then(res => {
      if (res.body.meta.success) {
        this.setState({
          missedCtRequestsListData: res.body.data,
          current: res.body.meta.page.current,
          pageTotal: res.body.meta.page.total,
        })
      }
    })
  };

  onPageChange = (current) => {
    this.setState({
      current,
    }, () => {
      this.getmissedCtRequestsList(current)
    });
  };

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>加急基站请求</h3>
        <div>
          <Table
            loading={this.props.missedCtRequestsIsLoading}
            dataSource={this.state.missedCtRequestsListData}
            // rowSelection={this.state.rowSelection}
            primaryKey="code"
            // maxBodyHeight={420}
            // useVirtual
            className={styles.table}
          >
            <Table.Column align="center" title="基站编码" dataIndex="code"/>
            <Table.Column align="center" title="请求次数" dataIndex="count"/>
            <Table.Column align="center" title="最早请求" dataIndex="min_created_at"/>
            <Table.Column align="center" title="最晚请求" dataIndex="max_created_at"/>
          </Table>
          <div className={styles.pagination}>
            <Pagination
              current={this.state.current}
              onChange={this.onPageChange}
              total={this.state.pageTotal * 10}
              // total={80}
              hideOnlyOnePage
            />
          </div>
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
    missedCtRequestsIsLoading: state.systemData.missedCtRequestsIsLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...SystemDataActions}, dispatch),
  }),
)(MissedCtRequests);
