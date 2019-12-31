import React, { Component } from 'react';
import {Message} from '@alifd/next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ExcelView from '../../../../../BBStat/components/ExcelView';
import ChartTitle from '../../../../../BBStat/components/ChartTitle';
import ajaxs from '../../../../../../../utils/ajax';


class TellerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colHeaders: [
        '机构号',
        '机构名称',
        '柜员号',
      ],
      hotSetting: {
        columns:  [
          {
            data: 'trx_branch_num',
          },
          {
            data: 'trx_branch',
          },
          {
            data: 'teller_code',
          },
        ],
      },
      dataSource: null,
      isLoading: true,
      // drilldownOptions: {
      //   '柜员号': ['trx_branch_num', 'teller_code'],
      //   '机构号': ['trx_branch_num', 'teller_code', {trx_direction: 1}],
      //   '机构名称': ['trx_branch_num', 'teller_code', {trx_direction: -1}],
      // },
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.props.activeItem.branch_num)
  }

  fetchData(num) {
    ajaxs.get(`/cases/${this.props.caseId}/trx_loc_labels/summary/${num}`).then(res => {
      if (res.meta.success) {
        let dataSource = []
        res.data.teller_codes.forEach((item) => {
          dataSource.push({
            teller_code: item,
            trx_branch_num: res.data.branch_num,
            trx_branch: res.data.branch,
          })
        })
        if (dataSource.length <= 15) {
          dataSource = [...dataSource, ...Array.from({length: 15 - dataSource.length}, () => ({}))]
        }

        this.setState({
          isLoading: false,
          dataSource
        })
      } else {
        Message.error('数据请求失败')
        this.setState({
          isLoading: false
        })
      }
    }).catch(err => {
      console.log(err);
    })
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center" />
        <ExcelView id="groupByTellerExcel"
                   colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting || null}
                   isLoading={this.state.isLoading}
                   data={this.state.dataSource}
                   // drilldown={this.state.drilldownOptions}
        />
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    // actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(TellerList);
