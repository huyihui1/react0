import React, { Component } from 'react';
import {Message} from '@alifd/next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import ExcelView from '../../../../../BBStat/components/ExcelView';
import ChartTitle from '../../../../../BBStat/components/ChartTitle';
import ajaxs from '../../../../../../../utils/ajax';
import columns from '../../../../../../../utils/hotColsDef'
import {actions} from '../../../../../../../bbStores/bankAcctLabels'
import { peerAcctTagRenders } from '../../../../../../../utils/hotRenders';


class GroupByPeers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colHeaders: [
        '对方账号',
        '对方卡号',
        '账户标注',
        '标签',
        '存款',
        '取款',
        '现存',
        '现取',
        '转存',
        '转取',
        '其他',
        '现场',
        '网络',
        '大额存款(次)',
        '大额存款(金)',
        '大额取款(次)',
        '大额取款(金)',
        '首次',
        '末次',
      ],
      hotSetting: {
        fixedColumnsLeft: 4,
        columns: columns.peers,
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: async (td, row, col, prop, value, cellProperties) => {
          if (col === 3){
            const dom = document.createElement('div');
            let peer_bank_acct = cellProperties.instance.getDataAtRowProp(row, 'peer_bank_acct');
            let peer_card_num = cellProperties.instance.getDataAtRowProp(row, 'peer_card_num');
            let component = peerAcctTagRenders(peer_bank_acct, peer_card_num)
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }
        },
      },
      dataSource: null,
      isLoading: true,
      drilldownOptions: {
        '现存': ['peer_bank_acct', 'peer_card_num', '现存'],
        '现取': ['peer_bank_acct', 'peer_card_num', '现取'],
        '转存': ['peer_bank_acct', 'peer_card_num', '转存'],
        '转取': ['peer_bank_acct', 'peer_card_num', '转取'],
        '其他': ['peer_bank_acct', 'peer_card_num', '其他'],
      },
    };
    this.domArr = []
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.props.activeItem.branch_num)
  }

  unmountCompsOnDoms = () => {
    this.domArr.forEach(d => {
      ReactDOM.unmountComponentAtNode(d);
    });
  };

  componentWillUnmount() {
    this.unmountCompsOnDoms();
  }

  fetchData(num) {
    const {bank_acct, card_num} = this.props.activeItem
    let t = {
      owner_card_num: card_num,
      owner_bank_acct: bank_acct,
    }
    if (!bank_acct && !card_num) {
      this.setState({
        isLoading: false,
        dataSource: []
      })
      return
    }
    if (!card_num && bank_acct) {
      t.owner_card_num = ""
    }
    ajaxs.post(`/cases/${this.props.caseId}/bbills/group-by-peers`, {...t}).then(res => {
      if (res.meta.success) {
        let dataSource = this.formatData(res.data)
        if (dataSource.length < 15) {
          dataSource = [...dataSource, ...Array.from({length: 15 - dataSource.length}, () => ({}))]
        }

        this.setState({
          isLoading: false,
          dataSource
        })
      } else {
        Message.error('数据请求失败')
        this.setState({
          isLoading: false,
          dataSource: []
        })
      }
    }).catch(err => {
      console.log(err);
    })
  }

  formatData = (data) => {
    const arr = [];

    for (let i = 0; i < data.length; i++) {
      let ai = {};
      for (let j = 0; j < data[i].length; j++) {
        const a2 = data[i][j];
        ai = {...ai, ...a2};
      }
      arr.push(ai)
    }
    return arr;
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center" />
        <ExcelView id="relatedOwnersExcel"
                   styles={{height: '450px'}}
                   colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting || null}
                   isLoading={this.state.isLoading}
                   data={this.state.dataSource}
                   drilldown={this.state.drilldownOptions}
        />
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    bankAcctLables: state.bankAcctLables
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(GroupByPeers);
