import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../../stores/mutual';
import {Table} from '@alifd/next';
import {_getPBAnalyze} from '../../../stores/PBAnalyze/actions'
import IceLabel from '@icedesign/label';
import '../mutual.css'
import moment from 'moment'
import PBAnalyzeList from '../../PBAnalyze/components/InfiniteScrollGrid/SimplePbillRecordList';



class MutualTravel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      criteria: null,
      mutualTravelData: [],
      mutualTravelExt: [],
      isLoading: false,
      childrenThis:null
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.search.criteria)) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
      });
    }
  }

  fetchData(criteria) {
    if (!criteria.owner_num || !criteria.peer_num) return;
    this.setState({isLoading: true});
    const {actions, caseId} = this.props;
    let adhoc = {
      numA: criteria.owner_num[1][0],
      numB: criteria.peer_num[1][0]
    };
    actions.fetchMutualTravelMutual({caseId, criteria: {}, adhoc}).then(res => {
      if (res.status === 'resolved') {
        this.setState({isLoading: false})
      } else {
        this.setState({isLoading: false})
      }

      let arr = [];
      for (let key in res.body.ext[0]) {
        let obj = {
          [key]: res.body.ext[0][key],
        };
        arr.push(obj)
      }
      let newData = _getPBAnalyze(res.body.data);
      this.setState({
        mutualTravelData: newData.state,
        mutualTravelExt: arr,
      })
    })
  }

  fieldRender = (value, rowIndex, record, context) => {
    for (let key in record) {
      return (
        <div key={key}>{key}</div>
      )
    }
  };

  timesRender = (value, rowIndex, record, context) => {
    console.log(this);
    let div = null;
    for (let key in record) {
      div = record[key].map(item => {
        if (moment(item[0]).format('YYYY-MM-DD') == moment(item[1]).format('YYYY-MM-DD')) {
          return <div style={{lineHeight: '25px'}} onClick={() => {this.clickTimes(key,moment(item[0]).format('YYYY-MM-DD'))}}>{moment(item[0]).format('YYYY-MM-DD')}</div>
        } else {
          return <div
            style={{lineHeight: '25px'}} onClick={() => {this.clickTimes(key,moment(item[0]).format('YYYY-MM-DD'))}}>{moment(item[0]).format('YYYY-MM-DD')} ~ {moment(item[1]).format('YYYY-MM-DD')}</div>
        }
      })
    }
    return div;
  };

  clickTimes = (address,date) => {
    let scrollToIndex = [];
    this.props.PBAnalyze.forEach((item,index) => {
      if (item.owner_comm_loc == address && item.started_day == date){
        scrollToIndex.push(index)
      }
    });
    this.state.childrenThis.setScrollToIndex(parseInt(scrollToIndex[0]))
  };

  ownerNumRender = (value, rowIndex, record, context) => {
    if (this.props.labelPNs) {
      this.props.labelPNs.forEach(item => {
        if (item.num === record.owner_num) {
          record.ownerLabel = item
        }
      });
    }

    return (
      <div>
        {record.ownerLabel ? (<IceLabel inverse={false} style={{
          fontSize: '12px',
          backgroundColor: record.ownerLabel.label_bg_color,
          color: record.ownerLabel.label_txt_color,
          marginLeft: '5px'
        }}>{record.ownerLabel.label}</IceLabel>) : <span style={{marginLeft: '5px'}}>{value}</span>}
      </div>
    )
  };

  peerNumRender = (value, rowIndex, record, context) => {
    if (this.props.labelPNs) {
      this.props.labelPNs.forEach(item => {
        if (item.num === record.peer_num) {
          record.peerLabel = item
        }
      });
    }

    return (
      <div>
        {record.peerLabel ? (<IceLabel inverse={false} style={{
          fontSize: '12px',
          backgroundColor: record.peerLabel.label_bg_color,
          color: record.peerLabel.label_txt_color,
          marginLeft: '5px'
        }}>{record.peerLabel.label}</IceLabel>) : <span style={{marginLeft: '5px'}}>{value}</span>}
      </div>
    )
  };

  startedDayRender = (value, rowIndex, record, context) => {
    return value
  };

  rowProps = (record, index) => {
    let ownerNum = this.props.search.criteria.owner_num[1][0];
    let peerNum = this.props.search.criteria.peer_num[1][0];

    if (record.owner_num === ownerNum) {
      return {className: 'numA'}
    }
    if (record.owner_num === peerNum) {
      return {className: 'numB'}
    }
  };

  getChildrenThis = (data) => {
    this.setState({childrenThis:data})
  };

  render() {
    const { criteria } = this.state;
    const height = 600;
    let opt = criteria && criteria.owner_num && criteria.peer_num? {adhoc:{numA:criteria.owner_num[1][0],numB:criteria.peer_num[1][0]}} : {};


    return (
      <div style={{height: '60%',}}>
        <h3 style={{
          fontSize: '18px',
          color: '#333',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
                <span>
                  共同去外地
                </span>
        </h3>
        <Table dataSource={this.state.mutualTravelExt} style={styles.table} loading={this.state.isLoading}>
          <Table.Column title="外地" align='center' cell={this.fieldRender}/>
          <Table.Column title="时间" align='center' cell={this.timesRender}/>
        </Table>
        <div style={{...styles.table, marginTop: '0px'}}>
          {/*<Table dataSource={this.state.mutualTravelData} hasBorder={false} primaryKey='name' useVirtual*/}
                 {/*maxBodyHeight={450} rowProps={this.rowProps} loading={this.state.isLoading}>*/}
            {/*<Table.Column title="计费类型" dataIndex="bill_type" align='center' lock width={60}/>*/}
            {/*<Table.Column title="状态" dataIndex="owner_num_status" align='center' lock width={60}/>*/}
            {/*<Table.Column title="本方通话地" dataIndex="owner_comm_loc" align='center' lock width={60}/>*/}
            {/*<Table.Column title="本方号码" dataIndex="owner_num" align='center' lock width={125}/>*/}
            {/*<Table.Column title="人员信息" dataIndex="owner_cname" align='center' lock width={120}*/}
                          {/*cell={this.ownerNumRender}/>*/}
            {/*<Table.Column title="联系类型" dataIndex="comm_direction" align='center' lock width={60}/>*/}
            {/*<Table.Column title="对方号码" dataIndex="peer_num" align='center' lock width={130}/>*/}
            {/*<Table.Column title="短号" dataIndex="peer_short_num" align='center' lock width={80}/>*/}
            {/*<Table.Column title="人员信息" dataIndex="peer_cname" align='center' lock width={120}*/}
                          {/*cell={this.peerNumRender}/>*/}
            {/*<Table.Column title="归属地" dataIndex="peer_num_attr" align='center' width={100}/>*/}
            {/*<Table.Column title="对方通话地" dataIndex="peer_comm_loc" align='center' width={60}/>*/}
            {/*<Table.Column title="长途" dataIndex="long_dist" align='center' width={60}/>*/}
            {/*<Table.Column title="虚拟" dataIndex="ven" align='center' width={60}/>*/}
            {/*<Table.Column title="日期" dataIndex="started_day" align='center' width={120} cell={this.startedDayRender}/>*/}
            {/*<Table.Column title="时间" dataIndex="started_time" align='center' width={100}/>*/}
            {/*<Table.Column title="时间类型" dataIndex="started_time_l1_class" align='center' width={60}/>*/}
            {/*<Table.Column title="周几" dataIndex="weekday" align='center' width={60}/>*/}
            {/*<Table.Column title="时间性质" dataIndex="time_class" align='center' width={80}/>*/}
            {/*<Table.Column title="时长分" dataIndex="duration" align='center' width={60}/>*/}
            {/*<Table.Column title="时长类型" dataIndex="duration_class" align='center' width={120}/>*/}
            {/*<Table.Column title="本方基站" dataIndex="owner_ct_code" align='center' width={120}/>*/}
            {/*<Table.Column title="对方基站" dataIndex="peer_ct_code" align='center' width={120}/>*/}
          {/*</Table>*/}
          {/*/cases/5/pbills/mutual/travel*/}
          <PBAnalyzeList noPaging height={height} componentProps={{url: `/cases/${this.props.caseId}/pbills/mutual/travel`, opt }} getChildrenThis={this.getChildrenThis}/>
        </div>
      </div>
    );
  }
}

const styles = {
  table: {
    margin: '10px 10px 0'
  }
};

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    search: state.search,
    route: state.route,
    labelPNs: state.labelPNs.items,
    PBAnalyze: state.SimplePbillRecordList.items || [],
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(MutualTravel);

