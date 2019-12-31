import React, {Component} from 'react';
import {Table, Button, Progress, Balloon} from '@alifd/next';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import './index.scss';
import {actions as caseOverviewActions} from '../../../../stores/caseOverview';
import {actions as CasesImportActions} from "../../../../stores/CasesImport";
import moment from "../../../Pbills/components/PbillsList";
import IceLabel from '@icedesign/label';
import doT from 'dot';

// const activePages = [
//   {id: 1, page: '13178901234', amount: '连续不通话日期超过3天', percent: 90},
//   {id: 2, page: '13178903123', amount: '话单联系的对方号码个数少于50人', percent: 70},
//   {id: 3, page: '13178903221', amount: '总未使用天数超过10天', percent: 60},
//   {id: 4, page: '13178912311', amount: '平均每天通话次数少于等于3次', percent: 50},
// ];


class Warning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percent: 0,
      activePages: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.findAbnormalNums = this.findAbnormalNums.bind(this);
    this.getProgress = this.getProgress.bind(this);
    this.getOutlierNums = this.getOutlierNums.bind(this);
    this.tableColumnRender = this.tableColumnRender.bind(this);
    this.getPnumLabels = this.getPnumLabels.bind(this);
    this.numRender = this.numRender.bind(this)
  }

  findAbnormalNums() {
    this.setState({percent: 0});
    const {actions, caseId} = this.props;
    actions.findAbnormalNumsCaseOverview({case_id: caseId}).then(res => {
      if (res.body.data[0].id) {
        let jboId = res.body.data[0].id;
        this.getProgress(actions, caseId, jboId)
      }
    })
  }


  getProgress(actions, caseId, jboId) {
    actions.getProgressCaseOverview({case_id: caseId, job_id: jboId}).then(res => {
      if (res.body.data[0].processed !== res.body.data[0].total || res.body.data[0].total === 0) {
        if (res.body.data[0].total === 0) {
          this.setState({percent: 0});
        } else {
          this.setState({percent: parseInt(res.body.data[0].processed / res.body.data[0].total * 100)});
        }
        setTimeout(this.getProgress(actions, caseId, jboId), 100)
      } else {
        this.setState({percent: 100});
        this.getOutlierNums(actions, caseId);
        return false
      }
    })
  }

  getOutlierNums(actions, caseId) {
    actions.getOutlierNumsCaseOverview({case_id: caseId})
  }


  tableColumnRender(value, index, record) {
    const map = {
      "1": "#F39D9D",
      "2": "#DD4D4D",
      "3": "#8C0808",
      "4": "#210101"
    };
    let outliers = [];
    record.outliers.forEach(outItem => {
      let color = map[outItem.flaw_type];
      let text = '';
      switch (outItem.flaw_type) {
        case 1:
          text = '话单联系的对方号码个数少于{{=it.rule_params}}人';
          break;
        case 2:
          text = '连续不通话日期超过{{=it.rule_params}}天';
          break;
        case 3:
          text = '总未使用天数超过{{=it.rule_params}}天';
          break;
        case 4:
          text = '平均每天通话次数少于等于{{=it.rule_params}}次';
          break;
      }

      let tempFn = doT.template(text);
      text = tempFn(outItem);

      let el = {
        type: <div style={{
          width: '17px',
          height: '17px',
          'backgroundColor': color,
          display: 'inlineBlock',
          'borderRadius': '50%',
          margin: '0 5px',
        }}></div>,
        text: text
      };
      outliers.push(el);
    });

    const columnRender = <div style={{...styles.space, fontSize: '12px'}}>{outliers.map(item => {
      return (<span>{item.text + ','}</span>)
    })}</div>;

    if (outliers.length === 0) {
      return columnRender
    } else {
      return (
        <Balloon trigger={columnRender} closable={false} align='t'>
          {outliers.map(item => {
            return (<div style={{display: 'flex', margin: '8px 0'}}>
              <span>{item.type}</span>
              <span>{item.text}</span>
            </div>)
          })}
        </Balloon>
      )
    }
  }


  getPnumLabels() {
    const {actions, caseId} = this.props;
    actions.getPnumLabelsCasesImport({caseId: caseId}, {
      query: {
        page: 1,
        pagesize: 100
      }
    })
  }

  componentDidMount() {
    this.getPnumLabels();
    const {actions, caseId} = this.props;
    this.getOutlierNums(actions, caseId);
    actions.fetchCaseOverviews({case_id: caseId}).then(res => {
      if (res.body.data.jobs && res.body.data.jobs.length > 0) {
        let jobsList = res.body.data.jobs;
        jobsList.forEach(item => {
          if (item.jtype === 'find_outlier_nums_job') {
            if (item.ended_at) {
              this.setState({percent: 100});
              return
            } else {
              setTimeout(this.getProgress(actions, caseId, item.jid), 1000)
            }
          } else {
            return
          }
        })
      }
    });

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.caseId) {
      // console.log('改变');
    }

    if (nextProps.pnumLabels && nextProps.activePages) {
      this.setState({activePages: nextProps.activePages});
    }
  }


  handleClick = () => {
    Message.success('可以使用 Iceworks 按需添加页面');
  };

  numRender(value,index,record) {
    if (this.props.pnumLabels) {
      this.props.pnumLabels.forEach(item => {
        if (item.num === record.owner_num) {
          record.Tagging = item
        }
      });
    }

    return (
      <div>
        <span>{value}</span>
        {record.Tagging ? (<IceLabel inverse={false} style={{
          fontSize: '12px',
          backgroundColor: record.Tagging.label_bg_color,
          color: record.Tagging.label_txt_color,
          marginLeft: '5px'
        }}>{record.Tagging.label}</IceLabel>) : <span style={{marginLeft: '5px'}}>{record.owner_name}</span>}
      </div>
    )
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <div className="warning container" data-tut="reactour__warning">
        <div className="card">
          <div className="title">
            <div>异常话单</div>
            <div>
              <Button style={{marginRight: '15px'}} component="a" onClick={this.findAbnormalNums}>搜索异常话单
              </Button>
              <div style={{width: '110%', marginLeft: '10px'}}>
                <Progress size="small" percent={this.state.percent == 'NaN' ? 0 : this.state.percent}/>
              </div>
            </div>
          </div>
          <Table
            dataSource={this.state.activePages}
            hasBorder={false}
            style={{width: '100%'}}
            primaryKey='id'
            useVirtual
            loading={this.props.caseOverviews.isLoading}
          >
            <Table.Column title="号码" width={210} alignHeader="center" align='left' dataIndex="owner_num"
                          cell={this.numRender}/>
            <Table.Column title="异常情况" width='60%' alignHeader="center" dataIndex="outliers"
                          cell={this.tableColumnRender}/>
          </Table>
        </div>
      </div>
    );
  }
}


const styles = {
  space: {
    // width: '500px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
};


const mapStateToProps = (state) => {
  return {
    caseId: state.cases.case.id,
    caseOverviews: state.caseOverviews,
    pnumLabels: state.caseImports.pnumLabels,
    activePages: state.caseOverviews.activePages
  }
};

export default connect(
  mapStateToProps,

  dispatch => ({
    actions: bindActionCreators({...caseOverviewActions, ...CasesImportActions}, dispatch),
  })
)(Warning);
