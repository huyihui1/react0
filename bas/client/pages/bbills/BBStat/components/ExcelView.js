import React from 'react';
import {connect} from 'react-redux';
import {Loading} from '@alifd/next';
import {HotTable} from '@handsontable/react';
import {bindActionCreators} from 'redux';
import 'handsontable/languages/zh-CN';
import 'handsontable/dist/handsontable.full.css';
import EmptyHandonTable from '../../../../components/NoData/EmptyHandonTable'
import {toggleBbDrilldownList} from '../../../../bbStores/bbDrilldownList/actions';

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
        manualColumnResize: true,//调整列宽
        manualRowResize: true,//调整行宽
        className: 'htCenter htMiddle',
         readOnly: true,
        columnSorting: true,//升序 降序
        afterOnCellMouseDown: (event, coords, td, controller) => {//单击行或者列或者单元格的标题时触发
          if (!td.innerHTML) return;
          // 获取hot实例
          const hot = this.refs[this.props.id].hotInstance;
          // 获取列表头值
          let headerKey = hot.getColHeader(coords.col);//获取表头的值行为-1 列的话就是1-++
          console.log(coords.col)//从左往右列值
          console.log(headerKey)
          if (!headerKey) {
            headerKey = hot.getCellMeta(coords.row, coords.col).prop//获取2级嵌套表格对应行或者列里的值
            console.log(headerKey)//取得的是data里的属性
          }
          const drilldownOpt = (this.props.drilldown || {})[headerKey];//含义没懂 代表this.props.drilldown[]和{}[]
          console.log(drilldownOpt)//每条具体的数据
          if (drilldownOpt && coords.row !== -1) {
            let {search, searchCriteria} = this.props;//不懂意思
            let criteria = searchCriteria ? JSON.parse(JSON.stringify(searchCriteria)) : JSON.parse(JSON.stringify(search.criteria)) || {};
            drilldownOpt.forEach(item => {
              console.log(item)
              if (typeof item === 'object') {
                for (const k in item) {
                  console.log('k:'+k)
                  if (Array.isArray(item[k])) {
                    criteria[k] = item[k]//item[k]也是对象的写法具体的值是0-7
                    //console.log('item:'+item[k])
                  } else {
                    criteria[k] = item[k]
                    //console.log('item:'+item[k])
                  }
                }
              } else {
                console.log('item------'+item)
                let param = hot.getDataAtRowProp(coords.row, item);
                console.log('row:'+coords.row)
                console.log(param);//param是卡号

                switch (item) {
                  case '现存': item = 'trx_class'; param=1;break;
                  case '现取': item = 'trx_class'; param=2;break;
                  case '转存': item = 'trx_class'; param=3;break;
                  case '转取': item = 'trx_class'; param=4;break;
                  case '其他': item = 'trx_class'; param=9;break;
                  default:
                    break
                }
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
                  case '其他':
                    if (item === 'digest') {
                      break
                    } else if (item === 'trx_class' || item === '其他') {
                      param = 9
                      item = 'trx_class'
                    } else {
                      param = 0;
                    }
                    break;
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
                  case '0:00~4:29':
                    if (item === 'ttl1') {
                      item = 'trx_time_l1_class'
                      param=8
                    } else {
                      param=15;
                    }
                    break;
                  case '4时': if(item === 'thc') item = 'trx_hour_class'; param=0;break;
                  case '5时': if(item === 'thc') item = 'trx_hour_class'; param=1;break;
                  case '6时': if(item === 'thc') item = 'trx_hour_class'; param=2;break;
                  case '7时': if(item === 'thc') item = 'trx_hour_class'; param=3;break;
                  case '8时': if(item === 'thc') item = 'trx_hour_class'; param=4;break;
                  case '9时': if(item === 'thc') item = 'trx_hour_class'; param=5;break;
                  case '10时': if(item === 'thc') item = 'trx_hour_class'; param=6;break;
                  case '11时': if(item === 'thc') item = 'trx_hour_class'; param=7;break;
                  case '12时': if(item === 'thc') item = 'trx_hour_class'; param=8;break;
                  case '13时': if(item === 'thc') item = 'trx_hour_class'; param=9;break;
                  case '14时': if(item === 'thc') item = 'trx_hour_class'; param=10;break;
                  case '15时': if(item === 'thc') item = 'trx_hour_class'; param=11;break;
                  case '16时': if(item === 'thc') item = 'trx_hour_class'; param=12;break;
                  case '17时': if(item === 'thc') item = 'trx_hour_class'; param=13;break;
                  case '18时': if(item === 'thc') item = 'trx_hour_class'; param=14;break;
                  case '19时': if(item === 'thc') item = 'trx_hour_class'; param=15;break;
                  case '20时': if(item === 'thc') item = 'trx_hour_class'; param=16;break;
                  case '21时': if(item === 'thc') item = 'trx_hour_class'; param=17;break;
                  case '22时': if(item === 'thc') item = 'trx_hour_class'; param=18;break;
                  case '23时': if(item === 'thc') item = 'trx_hour_class'; param=19;break;
                  case '0时': if(item === 'thc') item = 'trx_hour_class'; param=20;break;
                  case '1时': if(item === 'thc') item = 'trx_hour_class'; param=21;break;
                  case '2时': if(item === 'thc') item = 'trx_hour_class'; param=22;break;
                  case '3时': if(item === 'thc') item = 'trx_hour_class'; param=23;break;
                  case '现存':
                    if (item !== 'digest') {
                      item = 'trx_class';
                      param=1;
                    }
                    break;
                  case '现取':
                    if (item !== 'digest') {
                      item = 'trx_class';
                      param=2;
                  }
                    break;
                  case '转存':
                    if (item !== 'digest') {
                      item = 'trx_class';
                      param=3;
                    }
                    break;
                  case '转取':
                    if (item !== 'digest') {
                      item = 'trx_class';
                      param=4;
                    }
                    break;
                  case '< 200(含)元': param=1;break;
                  case '200~1000元': param=2;break;
                  case '1000(含)~4500元': param=3;break;
                  case '4500(含)~9000元': param=4;break;
                  case '9000(含)~5万元': param=5;break;
                  case '5万(含)~9万元': param=6;break;
                  case '9万(含)~50万元': param=7;break;
                  case '50万(含)~100万元': param=8;break;
                  case '4:30~6:59':  item = 'trx_time_l1_class'; param=0;break;
                  case '7:00~8:29':  item = 'trx_time_l1_class'; param=1;break;
                  case '8:30-11:29': item = 'trx_time_l1_class'; param=2;break;
                  case '11:30~13:59': item = 'trx_time_l1_class'; param=3;break;
                  case '14:00~16:59': item = 'trx_time_l1_class'; param=4;break;
                  case '17:00~18:29': item = 'trx_time_l1_class'; param=5;break;
                  case '18:30~20:59':  item = 'trx_time_l1_class';param=6;break;
                  case '21:00~23:59':  item = 'trx_time_l1_class';param=7;break;
                  case '现场': param=1;break;
                  case '网络': param=2;break;
                  case '未知': param=3;break;
                  default:
                    break
                }
                if (headerKey === '中心度'){
                  criteria['peer_num'] = ["IN", [param]]
                } else {
                  if (item === 'peer_bank_acct' && !param) {
                    let p = hot.getDataAtRowProp(coords.row, 'peer_card_num');
                    if (!p) {
                      criteria[item] = ["IN", [""]]//criteria是一个对象
                    }
                  }
                  if (item === 'peer_card_num' && !param) {
                    let p = hot.getDataAtRowProp(coords.row, 'peer_bank_acct');
                    console.log('p:'+p)
                    if (p) {
                      criteria[item] = ["IN", [p]]//A3执行的条件是如果对方账号为空,就取得本方账号的银行卡号
                    }
                  }
                  if (item === 'owner_card_num' && !param) {
                    let p = hot.getDataAtRowProp(coords.row, 'owner_bank_acct');
                    if (p) {
                      criteria[item] = ["IN", [p]]
                    }
                  }
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
              this.props.actions.toggleBbDrilldownList(true, criteria,'DailyPbills')
            } else if(headerKey === '中心度'){
              this.props.actions.toggleBbDrilldownList(true, criteria,'NumConnections')
            }else {
              this.props.actions.toggleBbDrilldownList(true, criteria,'Other')
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
      <div style={{padding: '15px 20px', width: '100%', height: '600px', ...this.props.styles}}>
        {
          this.props.data && this.props.data.length > 0 ? (
            <HotTable ref={this.props.id} id={this.props.id} data={this.props.data} settings={this.state.hotSettings}
                      language="zh-CN"/>
          ) : this.props.data ?  <EmptyHandonTable colHeaders={this.props.colHeaders} styles={this.props.styles}/>:
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
  state => ({
    search: state.search,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({toggleBbDrilldownList}, dispatch)
  }),
)(ExcelView);
