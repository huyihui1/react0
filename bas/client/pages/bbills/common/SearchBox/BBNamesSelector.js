import React, { Component, Fragment } from 'react';
import { Select } from '@alifd/next';
import { connect } from 'react-redux';
import axios from 'axios';
import IceLabel from '@icedesign/label';
import { bindActionCreators } from 'redux';
import { getName } from '../../../../utils/bbillsUtils';

import "./BBNamesSelector.scss"
import appConfig from '../../../../appConfig';

class BBNamesSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      initSource: [],
      dataSource: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.values[nextProps.name] && JSON.stringify(nextProps.values[nextProps.name]) != JSON.stringify(this.state.value)) {
      this.setState({
        value: nextProps.values[nextProps.name]
      })
    } else if (!nextProps.values[nextProps.name] && this.state.value.length > 0) {
      this.setState({
        value: []
      })
    }
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {

    };
  }
  fetchData = async () => {
    const { name, caseId } = this.props;
    let res = [];
    if (name === 'owner_name') {
      res = await getName(`/cases/${caseId}/bbills/owner_names`);
    } else if (name === 'peer_name') {

    }
    console.log(res);
    this.setState({
      initSource: res,
      dataSource: res,
    });
  }
  onSelectChange = (value) => {
    const { name, onFormChange, values } = this.props;
    values[name] = value
    onFormChange(values)
    this.setState({
      value,
      dataSource: Object.assign([], this.state.initSource)
    })
  }
  cancelRequest = () => {
    if (typeof this.source === 'function') {
      this.source('终止请求');
    }
  }

  onSearch = (value) => {
    const { name, caseId } = this.props;
    const CancelToken = axios.CancelToken;
    const that = this;
    if (value === '') {
      this.setState({
        dataSource: Object.assign([], this.state.initSource)
      })
      return
    }
    // 取消上一次请求
    this.cancelRequest();
    let params = '/suggest-owner-names'
    if (name === 'peer_name') {
      params = '/suggest-peer-names'
    }
    axios.post(`${appConfig.rootUrl}/cases/${this.props.caseId}/bbills${params}`, { q: value }, { cancelToken: new CancelToken(((c) => {
        that.source = c;
      })) }).then(response => {
      const res = response.data;
      if (res.meta && res.meta.success) {
        this.setState({
          dataSource: res.data,
        });
      }
    }).catch((err) => {
      if (axios.isCancel(err)) {
        // 请求如果被取消，这里是返回取消的message
      } else {
        // handle error
        console.log(err);
      }
    });
  }
  render() {
    return (
      <Select
        style={this.props.styles}
        dataSource={this.state.dataSource}
        value={this.state.value}
        onSearch={this.onSearch}
        mode="tag"
        onChange={this.onSelectChange}
        {...this.props.componentProps}
        popupClassName={'nameBox'}
      />
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
    actions: bindActionCreators({ }, dispatch),
  }),
)(BBNamesSelector);
