import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Message, Card, Slider } from '@alifd/next';
import { bindActionCreators } from 'redux';
import { actions as bbFilesImportActions } from '../../../../../bbStores/bbFilesImport';
import { toggleNav } from '../../../../../stores/case/actions';
// import '@alifd/next/lib/slider/main.scss'




class FilesTable extends Component {
  static displayName = 'FilesTable';

  constructor(props) {
    super(props);
    this.state = {
      addModal: false,
      case: {},
      current: 1,
      pageTotal: 1,
      showButton: false,
    };

    this.showAddModal = this.showAddModal.bind(this);
  }

  showAddModal() {
    this.setState({
      addModal: !this.state.addModal,
    });
  }

  onTableChange = (ids, records) => {
    const { rowSelection } = this.state;
    rowSelection.selectedRowKeys = ids;
    console.log('onChange', ids, records);
    this.setState({ rowSelection });
  };


  handleClick = (text) => {
    if (text === '添加') {
      this.showAddModal();
    } else {
      Message.success(`暂不支持${text}`);
    }
  };
  getCellProps() {
    return {
      style: { fontWeight: 0 },
    };
  }
  onPageChange = (current) => {
    this.setState({
      current,
    }, () => {
      this.props.actions.fetchPbFileImps({
        caseId: this.state.case.id,
        import_id: this.props.uuid,
      }, {
        query: {
          page: current,
          pagesize: this.props.pageSize,
        } });
    });
  };

  componentDidMount() {
    this.setState({
      case: this.props.case,
    });
    // this.props.toggleNav();
  }

  componentWillUnmount() {
    // this.props.toggleNav();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.case.id !== nextProps.case.id) {
      this.setState({
        case: nextProps.case,
      });
    }
    if (nextProps.bbFileImps.meta && nextProps.bbFileImps.meta.page) {
      this.setState({
        current: nextProps.bbFileImps.meta.page.current,
        pageTotal: nextProps.bbFileImps.meta.page.total,
      });
    }
    if (nextProps.bbFileImps.items.length > 0) {
      this.setState({
        showButton: true
      })
    }
  }

  formatData(obj) {
    const tempArr = [];
    if (obj && obj.length > 0) {
      obj = obj[0];
      const key = Object.keys(obj);
      const values = Object.values(obj);
      key.forEach((item, index) => {
        tempArr.push({
          ownerNum: item,
          totalCount: values[index],
        })
      })
      tempArr.shift();
    }
    return tempArr
  }

  render() {
    const { bbFileImps, uuid, isLoading } = this.props;
    return (
      <div>
        <Slider slidesToShow={bbFileImps.items[0] ? bbFileImps.items[0].length > 4 ? 4 : bbFileImps.items[0].length : 4} arrowPosition="outer" dots={false} >
          {
            this.formatData(bbFileImps.items[0]).map((item, index) => {
              return (
                <div style={{textAlign: 'center'}} key={item.ownerNum + index}>
                  <Card contentHeight="auto" style={styles.card} key={item.ownerNum}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                      <div>
                        <div style={styles.head}>
                          <span style={{ ...styles.circle, ...styles.purple }} />
                          <div style={styles.cellTitle}>本方银行卡号</div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                          <div style={styles.body}>
                            <div style={styles.costValue}>{item.ownerNum}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div style={styles.head}>
                          <span style={{ ...styles.circle, ...styles.green }} />
                          <div style={styles.cellTitle}>交易记录</div>
                        </div>
                        <div style={styles.body}>
                          <span style={styles.costValue}>{item.totalCount}</span>
                          <span style={styles.costUnit}>条</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })
          }
        </Slider>
        {
          this.state.showButton ? (
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <Link to={`/cases/${this.state.case.id}/bbills/analyze`}><Button type="primary">账单浏览</Button></Link>
            </div>
          ) : null
        }
      </div>
    );
  }
}

const styles = {
  container: {
    letterSpacing: '2px',
    overflowX: 'auto',
  },
  card: {
    display: 'inline-block',
    width: '96%',
    // boxShadow: '0 8px 24px rgba(163, 177, 191, .35)',
    // margin: '0 5px',
    background: '#fff',
    padding: '30px 0',
  },
  button: {
    margin: '0 8px',
    letterSpacing: '2px',
  },
  table: {
    margin: '20px 0',
    fontSize: '12px',
    // minWidth: '1500px',
  },
  submitButton2: {
    marginLeft: '15px',
  },
  pagination: {
    position: 'relative',
    textAlign: 'center',
    margin: '20px 0',
  },
  tableTitle: {
    color: '#666',
    fontWeight: 700,
  },
  head: {
    display: 'flex',
    alignItems: 'center',
  },
  cellTitle: {
    color: '#666',
    lineHeight: '14px',
    fontSize: '14px',
    marginRight: '5px',
  },
  circle: {
    width: '10px',
    height: '10px',
    marginRight: '10px',
    display: 'inline-block',
    borderRadius: '5px',
  },
  body: {
    display: 'flex',
    alignItems: 'baseline',
    marginTop: '10px',
    justifyContent: 'center',
  },
  costValue: {
    fontSize: '22px',
    fontWeight: '500',
    lineHeight: '30px',
    height: '30px',
    color: '#333',
  },
  costUnit: {
    marginLeft: '2px',
    fontSize: '12px',
    color: '#333',
  },
  purple: {
    background: '#908ce1',
  },
  green: {
    background: '#26c9ad',
  },
};

export default connect(
  state => ({
    bbFileImps: state.bbFileImps,
    case: state.cases.case,
    pageSize: state.bbFileImps.pageSize,
    isLoading: state.bbFileImps.isLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...bbFilesImportActions }, dispatch),
    toggleNav: bindActionCreators(toggleNav, dispatch),
  }),
)(FilesTable);

