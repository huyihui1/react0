import React, { Component } from 'react';
import moment from 'moment'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import IceLabel from '@icedesign/label';
import { Table, Message } from '@alifd/next';
import ajaxs from '../../../../../../../utils/ajax';

class BankAcctList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      dataSource: {},
      isLoading: true
    };

    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(caseId = this.props.caseId) {
    const { bank_acct, card_num } = this.props.activeItem;
    ajaxs.post(`/cases/${caseId}/bank_acct_nums/summary`, {bank_acct, card_num}).then(res => {
      let dataSource = []
      if (res.meta.success) {
        dataSource = res.data[0];
      }
      this.setState({
        dataSource,
        isLoading: false
      });
    }).catch(err => {
      console.log(err);
    });
  }

  componentDidMount() {
    this.fetchData();
  }


  render() {
    const { dataSource } = this.state;
    return (
      <div>
        <div style={styles.container}>
          <div style={styles.flexItem25}>
            <h3 style={styles.title}>账单时间</h3>
            <div>
              <p style={styles.text}>{moment(dataSource.first_trx_time).format("YYYY-MM-DD") || ''}</p>
              <p style={styles.text}>{moment(dataSource.last_trx_time).format("YYYY-MM-DD") || ''}</p>
            </div>
          </div>
          <div style={styles.flexItem25}>
            <h3 style={styles.title}>总的交易次数</h3>
            <div>
              <p style={styles.text}>{dataSource.total_trx_count || ''}</p>
            </div>
          </div>
          <div style={styles.flexItem25}>
            <h3 style={styles.title}>交易金额</h3>
            <div>
              <p style={styles.text}>{dataSource.total_trx_amt || ''}</p>
            </div>
          </div>
          <div style={styles.flexItem25}>
            <h3 style={styles.title}>对手账户数</h3>
            <div>
              <p style={styles.text}>{dataSource.peer_acct_nums || ''}</p>
            </div>
          </div>
        </div>
        <div style={{...styles.container, marginTop: '20px'}}>
          <div style={styles.flexItem25}>
            <h3 style={styles.title}>大额交易次数</h3>
            <div>
              <p style={styles.text}>{dataSource.mint_trx_count || ''}</p>
            </div>
          </div>
          <div style={styles.flexItem1}>
            <h3 style={styles.title}>存款金额/存款次数</h3>
            <div>
              <p style={styles.text}>{dataSource.cash_in_amt || ''} / {dataSource.cash_in_count || ''}</p>
            </div>
          </div>
          <div style={styles.flexItem1}>
            <h3 style={styles.title}>取款金额/取款次数</h3>
            <div>
              <p style={styles.text}>{dataSource.cash_out_amt || ''} / {dataSource.cash_out_count || ''}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const styles = {
  container: {
   display: 'flex',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    color: '#9B9B9B',
    fontSize: '12px',
    fontWeight: 'normal'
  },
  text: {
    color: '#4a90e2',
    fontSize: '22px',
    fontWeight: 'bold'
  },
  flexItem25: {
    width: '25%',
    flex: '0 0 25%'
  },
  flexItem1: {
    flex: 1
  },
  button: {
    margin: '0 8px',
    letterSpacing: '2px',
  },
  table: {

  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default connect(
  state => ({
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    // actions: bindActionCreators({...bankAcctLabels}, dispatch),
  }),
)(BankAcctList);
