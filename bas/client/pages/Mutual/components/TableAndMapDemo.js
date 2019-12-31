import React, { Component } from 'react';
import { Table, Input, Radio, Message } from '@alifd/next';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { installExternalLibs, trans_comm_direction } from '../../../utils/utils';
import { actions } from '../../../stores/mutual';


class TableAndMapDemo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect: this.onSelect,
        onSelectAll(selected, records) {
          console.log('onSelectAll', selected, records);
        },
        selectedRowKeys: [],
        mode: 'single',
      },
      activeIndex: null,
      meetList: [],
      criteria: {},
    }
    this.fetchData = this.fetchData.bind(this);
  }

  onTableChange = (ids, records) => {
    console.log(ids);
    const { rowSelection } = this.state;
    rowSelection.selectedRowKeys = ids;
    console.log('onChange', ids, records);
    this.setState({ rowSelection });
  };

  onSelect = (selected, record, records) => {
    // const activeIndex = this.state.VENnumbersList.indexOf(record);
    // this.props.setVENnumber(record);
    // this.setState({
    //   activeIndex,
    // });
    console.log('onSelect', selected, record, records);
  };


  fetchData(criteria = {...this.state.criteria}) {
    const { actions, caseId, values } = this.props;
    console.log(criteria);
    if (criteria.owner_num && criteria.peer_num) {
      const numA = criteria.owner_num[1][0];
      const numB = criteria.peer_num[1][0];
      delete criteria.owner_num;
      delete criteria.peer_num;
      actions.fetchMeetMutual({case_id: caseId, criteria, adhoc: {numA, numB, loc_rule: values.loc_rule, mutual_call: values.mutual_call * 1} }).then(res => {
        if (res.body.meta && res.body.meta.success) {
          const data = res.body.data;
          this.setState({
            meetList: data
          })
        } else {
          Message.error("互相碰面 - 数据请求失败..")
        }
      }).catch(err => {
        console.log(err);
        Message.error("互相碰面 - " + err.message)
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.search.criteria)) {
      this.fetchData({...nextProps.search.criteria});
      this.setState({
        criteria: nextProps.search.criteria,
      });
    }
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  cellDirectionRender = (val) => {
    return trans_comm_direction(val);
  }

  render() {
    const {meetList} = this.state;

    return (
      <div id="item-wrap" className="item-wrap">
          <Table
            loading={this.props.mutuals.meetLoading || false}
            dataSource={meetList}
            // rowSelection={this.state.rowSelection}
            // onRowClick={this.onRowClick}
            useVirtual
            primaryKey="num"
            style={styles.table}
            fixedHeader
            maxBodyHeight={355}
          >
            <Table.Column align="center" title="本方通话地" dataIndex="owner_comm_loc" width={60} />
            <Table.Column align="center" title="本方号码" dataIndex="owner_num" width={100} />
            <Table.Column align="center" title="联系类型" dataIndex="comm_direction" width={60} cell={this.cellDirectionRender} />
            <Table.Column align="center" title="对方号码" dataIndex="peer_num" cell={this.cellRender} width={100} />
            <Table.Column align="center" title="归属地" dataIndex="peer_num_attr" width={60} />
            <Table.Column align="center" title="对方通话地" dataIndex="peer_comm_loc" width={60} />
            <Table.Column align="center" title="日期" dataIndex="started_day" width={80} />
          </Table>
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
  fileTable: {
    margin: '20px 0',
  },
  table: {
    margin: '10px 10px 0',
    height: '95%',
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  submitButton: {
    // marginLeft: '85px',
  },
  submitButton2: {
    marginLeft: '15px',
  },
};

export default connect(
  // mapStateToProps
  state => ({
    search: state.search,
    labelPNs: state.labelPNs,
    mutuals: state.mutuals,
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(TableAndMapDemo);
