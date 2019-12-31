import React, {Component} from 'react';
import { Table} from '@alifd/next';
import IceLabel from '@icedesign/label';
import { connect } from 'react-redux';


class IcePBAnalyzeList extends Component{
  constructor(props) {
    super(props)
    this.state = {
      tableTitle: [
        {
          key: 'bill_type',
          label: '计费类型',
        },
        {
          key: 'owner_num_status',
          label: '状态',
        },
        {
          key: 'owner_comm_loc',
          label: '本方通话地',
        },
        {
          key: 'owner_num',
          label: '本方号码',
          width: 110,
        },
        {
          key: 'owner_cname',
          label: '人员信息',
          cell: this.tableColumnOwnerNumLabelRender,
          width: 60,
        },
        {
          key: 'comm_direction',
          label: '联系类型',
        },
        {
          key: 'peer_num',
          label: '对方号码',
          width: 110,
        },
        {
          key: 'peer_short_num',
          label: '短号',
        },
        {
          key: 'peer_cname',
          label: '人员信息',
          cell: this.tableColumnPeerNumLabelRender,
          width: 60,
        },
        {
          key: 'peer_num_attr',
          label: '归属地',
        },
        {
          key: 'peer_comm_loc',
          label: '对方通话地',
        },
        {
          key: 'long_dist',
          label: '长途',
          width: 35
        },
        {
          key: 'ven',
          label: '虚拟',
          width: 35
        },
        {
          key: 'started_day',
          label: '日期',
          width: 85
        },
        {
          key: 'started_time',
          label: '时间',
          width: 50
        },
        {
          key: 'started_time_l1_class',
          label: '时间类型',
        },
        {
          key: 'weekday',
          label: '周几',
        },
        {
          key: 'time_class',
          label: '时间性质',
        },
        {
          key: 'duration',
          label: '时长分',
          width: 35
        },
        {
          key: 'duration_class',
          label: '时长类别',
          width: 50
        },
        // {
        //   key: 'cell_tower',
        //   label: '基站代码',
        //   width: 80,
        // },
        {
          key: 'owner_ct_code',
          label: '本方基站',
        },
        {
          key: 'peer_ct_code',
          label: '对方基站',
        },
      ]
    }
  }
  tableColumnOwnerNumLabelRender = (value, index, record) => {
    const { labelPNs } = this.props;
    const res = labelPNs.LargItems.filter(item => {
      return item.num === record.owner_num
    })
    if (res.length > 0) {
      return (
        <IceLabel inverse={false} style={{
          fontSize: '12px',
          backgroundColor: res[0].label_bg_color,
          color: res[0].label_txt_color
        }}><span title={res[0].label}>{res[0].label}</span></IceLabel>
      );
    } else {
      return value
    }
  }

  tableColumnPeerNumLabelRender = (value, index, record) => {
    const { labelPNs } = this.props;
    const res = labelPNs.LargItems.filter(item => {
      return item.num === record.peer_num
    })
    if (res.length > 0) {
      return (
        <IceLabel inverse={false} title={res[0].label} style={{
          fontSize: '12px',
          backgroundColor: res[0].label_bg_color,
          color: res[0].label_txt_color
        }}><span title={res[0].label}>{res[0].label}</span></IceLabel>
      );
    } else {
      return value
    }
  }

  defaultRender(value) {
    return value;
  }

  render() {
    return (
      <Table
        loading={this.props.dataSource ? false : true}
        dataSource={this.props.dataSource || []}
        // rowSelection={this.state.rowSelection}
        // onRowClick={this.onRowClick}
        useVirtual
        fixedHeader
        className='icePBAnalyzeList'
        style={{height: '100%'}}
        maxBodyHeight={this.props.height * 0.85}
      >
        {
          this.state.tableTitle.map((item, index) => {
            return (
              <Table.Column align="center" title={item.label} key={item.key + index} dataIndex={item.key} width={item.width} cell={item.cell || this.defaultRender} />
            )
          })
        }
      </Table>
    )
  }
}

export default connect(
  state => ({
    labelPNs: state.labelPNs,
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    // actions: bindActionCreators({...actions, ...matrixsListActions}, dispatch),
  }),
)(IcePBAnalyzeList);

