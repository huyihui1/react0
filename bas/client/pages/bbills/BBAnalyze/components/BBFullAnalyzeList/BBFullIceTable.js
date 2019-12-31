import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Balloon } from '@alifd/next';

import { actions as bbAnalyzeActions } from '../../../../../bbStores/bbAnalyze';
import { actions as bbSearchActions } from '../../../../../bbStores/bbSearchStore';

import BankCardSimple from '../../../common/BankCardSimple'
import BankCardFull from '../../../common/BankCardFull'

import './index.scss'

const pageCount = 100;



class BBFullIceTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowIndex: -2,
      params: null,
      isScrollTitle: false,
      isLoading: false,
      isRequest: true
    }
    this.startedDay = null;
    this.page = 1
  }

  cardNumRender = (value, index, record) => {
    let ownerVal = value || record.owner_bank_acct;
    return (
      <Balloon align="t"
               closable={false}
        // triggerType="click"
               trigger={
                 <div>
                   <BankCardSimple card={ownerVal} card_type={record.owner_card_type} bankCode={record.owner_bank_code} />
                 </div>
               }
      >
        <BankCardFull
          card={ownerVal}
          card_type={record.owner_card_type}
          bankCode={record.owner_bank_code}
          bankName={record.owner_bank_name}
          userName={record.owner_name}
        />
      </Balloon>
    )
  }

  trxDirectionRender = (value, index, record) => {
    if (value === 1) {
      return (
        <div className='red'>存</div>
      )
    } else if (value === -1) {
      return (
        <div className='green'>取</div>
      )
    } else {
      return ''
    }
  }

  trxClassRender = (value) => {
    if (value === 1) {
      return '现存';
    } else if (value === 2) {
      return '现取';
    } else if (value === 3) {
      return '转存';
    } else if (value === 4) {
      return '转取';
    } else if (value === 9) {
      return '其他';
    }
    return '';
  }

  fetchData = (params) => {
    const {caseId, actions} = this.props;
    let {initPageCount} = this.state;
    this.setState({
      isLoading: true
    })
    initPageCount = 0;
    this.page = 1;
    actions.searchAnalyzes({case_id: caseId, ...params}).then(res => {
      if (res.body.meta.success) {
        initPageCount += res.body.data.length;
        this.page += 1
        if (res.body.data.length > 0 && initPageCount < pageCount) {
          this.getAnalyzes(initPageCount)
        }
        this.setState({
          initPageCount,
          isLoading: false
        })
      }
    })
  }

  getAnalyzes = async (initPageCount) => {
    const {actions, caseId, search} = this.props;
    let params = { ...search.params };
    params.adhoc.page = this.page;
    const res = await actions.getPagingAnalyzes({case_id: caseId, ...params});
    initPageCount += res.body.data.length;
    this.setState({
      initPageCount
    })
    if (res.body.data.length > 0 && initPageCount < pageCount) {
      this.page += 1;
      this.getAnalyzes(initPageCount)
    }
  }

  componentDidUpdate(preProps) {
    if (this.props.search) {
      if (this.props.search.params && JSON.stringify(preProps.search.params) !== JSON.stringify(this.props.search.params)) {
        this.fetchData(this.props.search.params);
        this.setState({
          params: {...this.props.search.params}
        })
      } else if (this.state.params !== null && this.props.search.params === null && this.props.search.isSearch === false) {
        this.setState({
          params: null
        })
      }

    }
  }

  onBodyScroll = (start) => {
    const tableBody = document.querySelector('.bbFullIceTable .next-table-body');
    const h = tableBody.scrollHeight
    const scrollTop = tableBody.scrollTop;
    if (scrollTop > h / 2 && this.state.isRequest && this.state.params) {
      const {actions, caseId, search} = this.props;
      let params = { ...search.params };
      params.adhoc.page = this.page;
      if (this.props.pagingType) {
        params = this.props.pagingType(this.props.bbAnalyzes);
      } else if (this.state.initPageCount < pageCount) {
        return
      }
      actions.getPagingAnalyzes({case_id: caseId, ...params}).then(res => {
        if (res.body.meta.success) {
          this.page += 1;
          if (res.body.data.length > 0) {
            this.setState({
              isRequest: true,
            });
          } else {
            this.setState({
              isRequest: false,
            });
          }
        }
      })
      this.setState({
        isRequest: false,
      });
      console.log('继续请求数据');
    }

  }

  cellProps = (rowIndex, colIndex, dataIndex, record) => {
    return {className: `cellHeight`};
  }


  render() {
    const {bbAnalyzes} = this.props;
    const tableTitle = [
      {
        key: 'owner_card_num', // owner_card_num / owner_bank_acct 卡号优先显示
        label: '本方账户',
        width: 150,
        componentProps: {
          lock: true,
          cell : this.cardNumRender
        }
      },
      {
        key: 'owner_name',
        label: '本方户名',
        width: 125,
        componentProps: {
          lock: true
        }
      },
      {
        key: 'trx_direction',
        label: '状态',
        width: 40,
        componentProps: {
          lock: true,
          cell : this.trxDirectionRender
        }
      },
      {
        key: 'trx_class',
        label: '类型',
        width: 60,
        componentProps: {
          lock: true,
          cell : this.trxClassRender
        }
      },
      {
        key: 'trx_amt',
        label: '交易额',
        width: 100,
      },
      {
        key: '整元',
        label: '整元',
        width: 100,
      },
      {
        key: 'currency',
        label: '币种',
        width: 50,
      },
      {
        key: 'bls',
        label: '余额',
        width: 100,
      },
      {
        key: 'peer_card_num', // peer_card_num / peer_bank_acct
        label: '对方账号',
        width: 150,
      },
      {
        key: 'peer_name',
        label: '对方户名',
        width: 125,
      },
      {
        key: 'peer_branch_num',
        label: '对方行号',
        width: 80,
      },
      {
        key: 'peer_branch',
        label: '对方行名',
        width: 125,
      },
      {
        key: 'trx_day',
        label: '日期',
        width: 120,
      },
      {
        key: 'trx_time',
        label: '时间',
        width: 80,
      },
      {
        key: '上中下旬',
        label: '上中下旬',
        width: 60,
      },
      {
        key: 'weekday',
        label: '周几',
        width: 30,
      },
      {
        key: 'trx_branch_num',
        label: '机构号',
        width: 80,
      },
      {
        key: 'trx_branch',
        label: '机构名称',
        width: 150,
      },
      {
        key: 'teller_code',
        label: '柜员号',
        width: 100,
      },
      {
        key: 'trx_no',
        label: '流水号',
        width: 150,
      },
      {
        key: 'trx_channel',
        label: '渠道',
        width: 80,
      },
      {
        key: 'memo',
        label: '备注',
        width: 120,
      },
      {
        key: 'digest',
        label: '摘要',
        width: 60,
      },
      {
        key: 'same_city',
        label: '外地',
        width: 60,
      },
      {
        key: 'same_branch',
        label: '跨行',
        width: 60,
      },
      {
        key: 'same_ppl',
        label: '本人',
        width: 60,
      },
    ];


    return (
      <div>
        <Table className={'bbFullIceTable'}
               dataSource={bbAnalyzes.items}
               useVirtual
               fixedHeader
               onBodyScroll={this.onBodyScroll}
               loading={this.state.isLoading}
               maxBodyHeight={window.innerHeight - 70}
               hasBorder={false}
               cellProps={this.cellProps}
        >
          {
            tableTitle.map(item => {
              return <Table.Column key={item.key} title={item.label} align={'center'} dataIndex={item.key} width={item.width} {...item.componentProps} />
            })
          }
        </Table>
      </div>
    )
  }
}


export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    search: state.bbSearchs,
    route: state.route,
    bbAnalyzes: state.bbAnalyzes,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...bbAnalyzeActions, ...bbSearchActions}, dispatch),
  }),
)(BBFullIceTable);
