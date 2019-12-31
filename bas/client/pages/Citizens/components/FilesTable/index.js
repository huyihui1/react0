import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Message, Card } from '@alifd/next';
import { bindActionCreators } from 'redux';
import { actions as citizensImportActions } from '../../../../stores/citizens';
import { toggleNav } from '../../../../stores/case/actions';


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
      this.props.actions.fetchCitizens({
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
    if (nextProps.Citizens.meta && nextProps.Citizens.meta.page) {
      this.setState({
        current: nextProps.Citizens.meta.page.current,
        pageTotal: nextProps.Citizens.meta.page.total,
      });
    }
    if (nextProps.Citizens.items.length > 0) {
      this.setState({
        showButton: true,
      });
    }
  }

  render() {
    const { Citizens, uuid, isLoading } = this.props;
    const { createCitizen, removeCitizen } = this.props.actions;
    return (
      <div>
        <div>
          {
            this.props.Citizens.items.map((items, index) => {
              return (
                <Card contentHeight="auto" style={styles.card} key={index}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <div>
                      <div style={styles.head}>
                        <span style={{ ...styles.circle, ...styles.purple }} />
                        <div style={styles.cellTitle}>本方号码</div>
                      </div>
                      {
                        items.map((item, i) => {
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column' }} key={item.owner_num + i}>
                              <div style={styles.body}>
                                <div style={styles.costValue}>{item.ownerNum}</div>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                    <div>
                      <div style={styles.head}>
                        <span style={{ ...styles.circle, ...styles.green }} />
                        <div style={styles.cellTitle}>通话记录</div>
                      </div>
                      {
                        items.map((item, i) => {
                          return (
                            <div style={styles.body} key={item.totalCount + i}>
                              <span style={styles.costValue}>{item.totalCount}</span>
                              <span style={styles.costUnit}>条</span>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                </Card>
              );
            })
          }
        </div>
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
    width: '50%',
    boxShadow: '0 8px 24px rgba(163, 177, 191, .35)',
    // margin: '0 5px 10px',
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
    Citizens: state.citizens,
    case: state.cases.case,
    pageSize: state.citizens.pageSize,
    isLoading: state.citizens.isLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...citizensImportActions }, dispatch),
    toggleNav: bindActionCreators(toggleNav, dispatch),
  }),
)(FilesTable);

