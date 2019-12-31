import React from 'react';
import {connect} from 'react-redux';
import {Loading} from '@alifd/next';
import {HotTable} from '@handsontable/react';
import {bindActionCreators} from 'redux';
import 'handsontable/languages/zh-CN';
import 'handsontable/dist/handsontable.full.css';
import EmptyHandonTable from '../../../components/NoData/EmptyHandonTable'
import {toggleSimplePbillRecordList} from '../../../stores/simplePbillRecordList/actions';

class ExcelView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hotSettings: {
        stretchH: 'all',
        colHeaders: this.props.colHeaders || false,
        rowHeaders: true,
        contextMenu: false,
        editor: false,
        licenseKey: 'non-commercial-and-evaluation',
        height: '100%',
        // colWidths: 120,
        manualColumnResize: true,
        manualRowResize: true,
        className: 'htCenter htMiddle',
        readOnly: true,
        columnSorting: true,
        afterOnCellMouseDown: (event, coords, td, controller) => {
          if (!td.innerHTML) return;
          // 获取hot实例
          const hot = this.refs[this.props.id].hotInstance;
          // 获取列表头值
          const headerKey = hot.getColHeader(coords.col);
          const drilldownOpt = (this.props.drilldown || {})[headerKey];
          if (drilldownOpt && coords.row !== -1) {
            let {search, searchCriteria} = this.props;
            let criteria = searchCriteria ? JSON.parse(JSON.stringify(searchCriteria)) : JSON.parse(JSON.stringify(search.criteria)) || {};
            drilldownOpt.forEach(item => {
              if (typeof item === 'object') {
                for (const k in item) {
                  if (Array.isArray(item[k])) {
                    criteria[k] = item[k]
                  } else {
                    criteria[k] = item[k]
                  }
                }
              } else {
                let param = hot.getDataAtRowProp(coords.row, item);

                switch (param) {
                  case '周一': param = 1;break;
                  case '周二': param = 2;break;
                  case '周三': param = 3;break;
                  case '周四': param = 4;break;
                  case '周五': param = 5;break;
                  case '周六': param = 6;break;
                  case '周日': param = 7;break;
                  case '通话': param = 1;break;
                  case '短信': param = 2;break;
                  case '彩信': param = 3;break;
                  case '主叫': param = 11;break;
                  case '<--': param = 12;break;
                  case '主短': param = 21;break;
                  case '被短': param = 22;break;
                  case '其他': param = 0;break;
                  case '本地': param = 1;break;
                  case '漫游': param = 2;break;
                  case '1~15秒': param=1;break;
                  case '16~90秒': param=2;break;
                  case '1.5~3分': param=3;break;
                  case '3~5分': param=4;break;
                  case '5~10分': param=5;break;
                  case '>10分': param=6;break;
                  case '早晨': param=0;break;
                  case '上午': param=1;break;
                  case '中午': param=2;break;
                  case '下午': param=3;break;
                  case '傍晚': param=4;break;
                  case '晚上': param=5;break;
                  case '深夜': param=6;break;
                  case '凌晨': param=7;break;
                  case '4:30~6:20': param=0;break;
                  case '6:21~7:10': param=1;break;
                  case '7:11~7:50': param=2;break;
                  case '7:51~8:25': param=3;break;
                  case '8:26~11:00': param=4;break;
                  case '11:01~11:30': param=5;break;
                  case '11:31~12:30': param=6;break;
                  case '12:31~13:20': param=7;break;
                  case '13:21~14:00': param=8;break;
                  case '14:01~16:50': param=9;break;
                  case '16:51~17:40': param=10;break;
                  case '17:41~18:50': param=11;break;
                  case '18:51~20:00': param=12;break;
                  case '20:01~21:50': param=13;break;
                  case '21:51~23:59': param=14;break;
                  case '0:00~4:29': param=15;break;
                  case '4时': param=0;break;
                  case '5时': param=1;break;
                  case '6时': param=2;break;
                  case '7时': param=3;break;
                  case '8时': param=4;break;
                  case '9时': param=5;break;
                  case '10时': param=6;break;
                  case '11时': param=7;break;
                  case '12时': param=8;break;
                  case '13时': param=9;break;
                  case '14时': param=10;break;
                  case '15时': param=11;break;
                  case '16时': param=12;break;
                  case '17时': param=13;break;
                  case '18时': param=14;break;
                  case '19时': param=15;break;
                  case '20时': param=16;break;
                  case '21时': param=17;break;
                  case '22时': param=18;break;
                  case '23时': param=19;break;
                  case '0时': param=20;break;
                  case '1时': param=21;break;
                  case '2时': param=22;break;
                  case '3时': param=23;break;
                }

                if (headerKey === '中心度'){
                    criteria['peer_num'] = ["IN", [param]]
                } else {
                  if (param || param === 0) {
                    criteria[item] = ["IN", [param]]
                  }
                }

                // if (param || param === 0) {
                //   criteria[item] = ["IN", [param]]
                // }
              }
            });
            if (headerKey === '使用天数' || headerKey === '联系天数'){
              this.props.actions.toggleSimplePbillRecordList(true, criteria,'DailyPbills')
            } else if(headerKey === '中心度'){
              this.props.actions.toggleSimplePbillRecordList(true, criteria,'NumConnections')
            }else {
              this.props.actions.toggleSimplePbillRecordList(true, criteria,'Other')
            }
          }
        },
      },
    };
  }

  componentDidMount() {
    if (this.props.excelColumnsRender) {
      this.setState({
        hotSettings: {
          ...this.state.hotSettings,
          renderer: this.props.excelColumnsRender,
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hotSetting && JSON.stringify(nextProps.hotSetting) !== JSON.stringify(this.state.hotSettings)) {
      this.setState({
        hotSettings: {
          ...this.state.hotSettings,
          ...nextProps.hotSetting,
        }
      });
    }
  }

  render() {
    return (
      <div style={{padding: '15px 20px', height: '600px', ...this.props.styles}}>
        {
          this.props.data && this.props.data.length > 0 ? (
            <HotTable ref={this.props.id} id={this.props.id} data={this.props.data} settings={this.state.hotSettings}
                      language="zh-CN"/>
          ) : this.props.data ? <EmptyHandonTable colHeaders={this.props.colHeaders} styles={this.props.styles}/> :
            (
              <Loading tip="加载中..." style={{width: '100%', height: '100%'}} visible={this.props.isLoading || false}>
              </Loading>
            )
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    search: state.search,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({toggleSimplePbillRecordList}, dispatch)
  }),
)(ExcelView);
