import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Table, Icon} from '@alifd/next';
import IceLabel from '@icedesign/label';
import moment from 'moment';
import {actions as labelPNActions} from '../../../../stores/labelPN';
import appConfig from '../../../../appConfig';

import './index.scss'

class LabelPNOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelPNs: []
    };
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData(caseId = this.props.caseId) {
    const {actions} = this.props;
    actions.fetchLabelPNs({caseId}, {
      query: {
        page: 1,
        pagesize: 100,
      },
    }).then(res => {
      if (res.body && res.body.meta && res.body.meta.success) {
        this.setState({
          labelPNs: res.body.data
        })
      }
    })
    this.setState({
      caseId,
    });
  }

  tableColumnRender(value, index, record) {
    return (
      <div style={{fontSize: '12px', width: '185px'}}>
        <span>{value}</span>
        <IceLabel inverse={false} style={{
          fontSize: '12px',
          backgroundColor: record.label_bg_color,
          color: record.label_txt_color,
          marginLeft: '1px'
        }}>{record.label}</IceLabel>
      </div>
    );
  }

  labelGroupsRender(value, index, record) {
    let newVal = []
    if (value) {
      value.forEach(item => {
        newVal.push(item);
      })
      return <span style={{fontSize: '12px'}}>{newVal.join(', ')}</span>
    } else {
      return <span style={{fontSize: '12px'}}>{value}</span>
    }

  }

  ptagsRender(value, index, record) {
    let newVal = []
    if (value && typeof value === 'string') {
      JSON.parse(value).forEach(item => {
        newVal.push(item);
      })
      return <span style={{fontSize: '12px'}}>{newVal.join(', ')}</span>
    } else {
      return <span style={{fontSize: '12px'}}>{value}</span>
    }
  }

  momeRender(value){
    return <span style={{fontSize: '12px'}}>{value}</span>
  }


  cellRender(value) {
    value = parseInt(value);
    if (value === 1) {
      return <span>手工单条添加</span>;
    } else if (value === 2) {
      return <span> 批量导入</span>;
    } else if (value === 3) {
      return <span>综合人员信息库中导入</span>;
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const {caseId} = this.props;
    const {labelPNs} = this.state;

    return (
      <div className="LabelPNOverview container">
        <div className="LabelPNOverview card">
          <h4 className="title">
            号码标注
            <span>
              <Link to={`/cases/${caseId}/labelpn`}>
                <Icon type="ellipsis" style={{transform: "rotate(90deg)"}} size="small"/>
                更多
              </Link>
            </span>
          </h4>
          <div className="content">
            <Table
              dataSource={labelPNs}
              style={{width: '100%'}}
              fixedHeader={true}
              maxBodyHeight={485}
              loading={this.props.labelPNs.isLoading}
            >
              <Table.Column align="left" title="号码" dataIndex="num" cell={this.tableColumnRender}/>
              <Table.Column align="center" title="标签" dataIndex="label_groups" cell={this.labelGroupsRender}
                            width={120}/>
              <Table.Column align="center" title="个性标签" dataIndex="ptags" width={120} cell={this.ptagsRender}/>
              <Table.Column align="center" title="备注" dataIndex="memo" cell={this.momeRender}/>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    labelPNs: state.labelPNs,
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...labelPNActions}, dispatch),
  }),
)(LabelPNOverview);
