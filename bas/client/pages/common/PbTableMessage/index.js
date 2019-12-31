import React, { Component } from 'react';
import { Message } from '@alifd/next';
import ajaxs from '../../../utils/ajax';
import {keyMap} from '../../../utils/utils';

import './PbTableMessage.css';

class PbTableMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      count: null,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.hlColField && JSON.stringify(this.state.values) !== JSON.stringify(nextProps.data)) {
      this.setState({
        values: JSON.parse(JSON.stringify(nextProps.data)),
      }, () => {
        const {hlColValues, criteria, hlColField} = JSON.parse(JSON.stringify(this.state.values));
        if (hlColValues && hlColValues.length > 0) {
          criteria[hlColField] = ["IN", hlColValues];
          const daily_rec = criteria.daily_rec;
          delete criteria.daily_rec;
          delete criteria['order-by'];
          this.fetchData({criteria, view: {}, adhoc: {daily_rec } });
        } else {
          this.onSubmit()
        }
      });
    }
  }
  onSubmit() {
    this.setState({
      values: {},
      count: null,
    });
    this.props.onSubmit();
  }

  async fetchData(criteria) {
    this.props.fetchCountByDist(this.props.caseId, criteria, true);
    const res = await ajaxs.post(`/cases/${this.props.caseId}/pbills/records/count-by`, criteria);
    this.setState({
      count: res.data.count,
    });
  }

  render() {
    const { hlColField, colValues } = this.props.data;

    return (
      <div className="tableMessage">
        {
            this.state.count !== null ? (
              <Message type="success">
                {`符合的${keyMap[hlColField]}`}<span style={{ color: 'blue' }}>{colValues.join(', ')}</span>共<span
                  style={{ color: 'red' }}
                >{this.state.count}
                </span>条. <a href="javascript:;" onClick={this.onSubmit}>撤销</a>
              </Message>
            ) : (
              <Message title="加载中..." type="loading" />
            )
          }

      </div>
    );
  }
}

export default PbTableMessage;
