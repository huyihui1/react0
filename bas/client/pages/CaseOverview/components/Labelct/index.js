import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Icon } from '@alifd/next';
import { Link } from 'react-router-dom';
import IceLabel from '@icedesign/label';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import { actions as labelCellActions } from '../../../../stores/labelCell';
import appConfig from '../../../../appConfig';

import '../LabelPNOverview/index.scss'

class Labelct extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.fetchData()
  }
  fetchData(caseId = this.props.caseId) {
    const { actions } = this.props;
    actions.fetchLabelCells({ caseId }, {
      query: {
        page: 1,
        pagesize: appConfig.pageSize,
      },
    });
    this.setState({
      caseId,
    });
  }
  tableColumnRender(value, index, record) {
    return <FontAwesomeIcon icon={faMapMarkerAlt} style={{color: value}} />;
  }

  labelGroupsRender(value, index, record) {
    if (value) {
      let newVal = []
      value.forEach(item => {
        newVal.push(item.label_group_name);
      })
      return newVal.join(', ')
    } else {
      return value
    }
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

  render() {
    const { labelCells, caseId } = this.props;

    return (
      <div className="LabelPNOverview container">
        <div className="LabelPNOverview card">
          <h4 className="title">
            基站标注
            <span>
              <Link to={`/cases/${caseId}/labelct`}>
                <Icon type="ellipsis" style={{transform: "rotate(90deg)"}} size="small" />
                More
              </Link>
            </span>
          </h4>
          <div className="content">
            <Table
              dataSource={labelCells.items}
              style={{ width: '100%' }}
            >
              <Table.Column align="center" title="基站编码" dataIndex="ct_code" style={{ width: '150px' }} />
              <Table.Column align="center" title="标注信息" dataIndex="label" />
              <Table.Column align="center" title="分类标签" dataIndex="label_groups" cell={this.labelGroupsRender} />
              <Table.Column align="center" title="备注" dataIndex="memo" />
              <Table.Column align="center" title="图钉" dataIndex="marker_color" cell={this.tableColumnRender}
              />
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    labelCells: state.labelCells,
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...labelCellActions }, dispatch),
  }),
)(Labelct);
