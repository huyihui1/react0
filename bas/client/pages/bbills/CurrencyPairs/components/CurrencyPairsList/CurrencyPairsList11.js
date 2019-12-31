import React, {Component} from 'react';
import {Balloon, Button, Input, Table, Pagination, Select, Loading, Message, Dialog} from '@alifd/next';
import {FormBinder, FormBinderWrapper, FormError as IceFormError} from "@icedesign/form-binder";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import styles from './index.module.scss'
import {actions} from '../../../../../bbStores/CurrencyPairs/index';
import CurrencyPairsForm from '../CurrencyPairsForm/index.js'


class CurrencyPairsList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      values: {},
      tips: '',
      current: 1,
      pageTotal: null,
      importDialog: false,
      isEdit: false,
      addModal: false,
      searchData: {},
      itemId: null,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          that.props.actions.setCurrencyPairs(record);
          console.log('onSelect', selected, record, records);
        },
        onSelectAll(selected, records) {
          console.log('onSelectAll', selected, records);
        },
        selectedRowKeys: [],
        mode: 'single',
      },
    };
  }

  onTableChange = (ids, records) => {
    console.log(ids);
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = ids;
    console.log('onChange', ids, records);
    this.setState({rowSelection,itemId:records[0].id});
  };

  //查询
  validateFields = () => {
    const {validateAll} = this.refs.form;
    validateAll((errors, values) => {
      let val = {...values};
      for (let key in val) {
        if (!val[key] || !val[key].length) {
          delete val[key]
        }
      }
      if (JSON.stringify(val) !== "{}") {
        this.setState({searchData: {...val}});

        this.setState({current: 1}, () => {
          this.props.actions.searchBins({case_id: this.props.caseId, ...val}, {
            query: {
              page: this.state.current,
              pagesize: this.props.currencyPairs.pageSize
            }
          })
        })
      } else {
        // this.props.actions.searchBbills({case_id: this.props.caseId, query: ''})
      }
    });
  };

  fetchData = (current) => {
    this.props.actions.fetchCurrencyPairs({case_id: this.props.caseId}, {
      query: {
        page: current,
        pagesize: this.props.currencyPairs.pageSize
      }
    });
  };

  componentDidMount() {
    this.fetchData(this.state.current);
  }Dialog

  resetCurrent = () => {
    this.setState({current: 1})
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.currencyPairs.meta) {
      // this.setState({pageTotal: nextProps.currencyPairs.meta.page.total})
    }
  }

  onPageChange = (current) => {
    this.setState({
      current,
    }, () => {
      const {searchData} = this.state;

      if (!this.props.currencyPairs.isSearch) {
        this.fetchData(current)
      } else {
        this.props.actions.searchBins({case_id: this.props.caseId, ...searchData}, {
          query: {
            page: current,
            pagesize: this.props.currencyPairs.pageSize
          }
        })
      }
    });
  };
  handleClick = (text) => {
    if (text === '新建') {
      this.showAddModal();
    } else if (text === '编辑') {
      this.showAddModal();
    } else if (text === '删除') {
      if (this.state.rowSelection.selectedRowKeys.length === 1) {

      } else {
        Message.warning('请选择一条数据');
      }
    }
  };

  showAddModal = (isEdit = false) => {
    this.setState({
      addModal: !this.state.addModal,
      isEdit
    }, () => {
      if (!this.state.addModal) {
        this.setState({
          isEdit: false,
        });
      }
    });
  }


  valueRender = (value, index, record) => {
    return `${record.base_symbol}/${record.settle_symbol}`
  };

  onRowClick = (record) => {
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = [record.id];
    this.setState({
      rowSelection,
      itemId: record.id,
    });
    this.props.actions.setCurrencyPairs(record);
  }

  render() {
    const buttons = [
        '新建',
       '编辑',
      // '删除',
    ];
    return (
      <div>
        <div className={styles.body} style={{minHeight: `${document.documentElement.offsetHeight - 300}px`}}>
          <div style={{margin: '0 20px'}}>
            <div className={styles.buttons}>
              {buttons.map((text, index) => {
                return (
                  <Button
                    key={index}
                    className={styles.button}
                    onClick={() => this.handleClick(text)}
                  >
                    {text}
                  </Button>
                );
              })}
            </div>
            <Table dataSource={this.props.currencyPairs.currencyPairsList}
                   rowSelection={this.state.rowSelection}
                   onRowClick={this.onRowClick}
                   primaryKey="id"
                   loading={this.props.currencyPairs.isLoading}
                   style={{minHeight: '463px'}}
            >
              <Table.Column title="外汇对" alignHeader="center" align='center' cell={this.valueRender} />
              <Table.Column title="外币" alignHeader="center" align='center' dataIndex='base_name' />
              <Table.Column title="本币" alignHeader="center" align='center' dataIndex='settle_name'/>
              <Table.Column title="汇率" alignHeader="center" align='center' dataIndex='rate'/>
            </Table>
            <CurrencyPairsForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit}/>
            {/* 分页 */}
            {/*<div className={styles.pagination}>*/}
              {/*<Pagination*/}
                {/*current={this.state.current}*/}
                {/*total={this.state.pageTotal * this.props.currencyPairs.pageSize}*/}
                {/*onChange={this.onPageChange}*/}
                {/*hideOnlyOnePage*/}
              {/*/>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    caseId: state.cases.case.id,
    currencyPairs: state.currencyPairs
  }),
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(CurrencyPairsList);
