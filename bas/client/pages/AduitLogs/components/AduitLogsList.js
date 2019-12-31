import React, {Component} from 'react';
import './AduitLogs.css'
import {DatePicker, Button, Table, Pagination, Select} from '@alifd/next';


const {RangePicker} = DatePicker;

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actions as AduitLogsActions} from '../../../stores/AduitLogs'
import {FormBinderWrapper, FormBinder} from "@icedesign/form-binder";
import moment from 'moment'


class AduitLogsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staret: '',
      end: '',
      subject:'',
      aduitLogsList: []
    };
    this.onChange = this.onChange.bind(this);
    this.searchAuditLogs = this.searchAuditLogs.bind(this)
  }

  componentDidMount() {
    const {actions, caseId} = this.props;
    actions.fetchAduitLogs({caseId}, {
      query: {
        page: 1,
        pagesize: 10
      }
    }).then(res => {
      this.setState({aduitLogsList: res.body.data});
    })
  }

  onChange(val) {
    this.setState({staret: moment(val[0]).format('YYYY-MM-DD'), end: moment(val[1]).format('YYYY-MM-DD')})
  }

  searchAuditLogs() {
    const {actions} = this.props;
    let created_at = ["BETWEEN", [this.state.staret, this.state.end]];
    actions.createAduitLogs({criteria: {created_at: created_at,subject:['FUZZY',this.state.subject]}}).then(res => {
      this.setState({aduitLogsList: res.body.data});
    })
  }

  render() {
    return (
      <div>
        <div className="AduitLogs_header">
          <div className="AduitLogs_operator">
            <span>操作人 :</span>
            <Select mode="tag" showSearch popupStyle={{display: 'flex', flexWrap: 'wrap'}}>
              <Option></Option>
              }
            </Select>
          </div>
          <div className="AduitLogs_date">
            <span>日期  :</span>
            <RangePicker onChange={this.onChange}/>
          </div>
          <div className="AduitLogs_search">
            <Button type="primary" onClick={this.searchAuditLogs}>搜索</Button>
          </div>
        </div>
        <div className="AduitLogs_list">
          <Table dataSource={this.state.aduitLogsList}
                 hasBorder={true}
                 style={styles.table}
          >
            <Table.Column title="时间" alignHeader="center" align='center' dataIndex="created_at"/>
            <Table.Column title="操作人" alignHeader="center" align='center' dataIndex="subject"/>
            <Table.Column title="IP地址" alignHeader="center" align='center' dataIndex="remote_host"/>
            <Table.Column title="URL" alignHeader="center" align='center' dataIndex="action"/>
            <Table.Column title="内容" alignHeader="center" align='center' dataIndex="params"/>
          </Table>

        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    caseId: state.cases.case.id,
  }),

  dispatch => ({
    actions: bindActionCreators({...AduitLogsActions}, dispatch),
  }),
)(AduitLogsList);


const styles = {
  input: {
    width: '90%',
    margin: '0 4px',
  },
  longInput: {
    // width: '825px',
  },
  table: {
    margin: '20px 0',
    minHeight: '463px',
  },
};
