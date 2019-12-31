import React, {Component} from 'react';
import {Balloon, Button, Input, Table, Pagination, Select, Loading, Message, Dialog} from '@alifd/next';
import {FormBinder, FormBinderWrapper, FormError as IceFormError} from "@icedesign/form-binder";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import styles from './index.module.scss'
import {actions} from '../../../../../bbStores/Bins';
import ImportBins from './ImportBins'
import BinForm from '../BinForm'


class BinsList extends Component {
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
          that.props.actions.setBins(record);
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
              pagesize: this.props.bins.pageSize
            }
          })
        })
      } else {
        // this.props.actions.searchBbills({case_id: this.props.caseId, query: ''})
      }
    });
  };

  fetchData = (current) => {
    this.props.actions.fetchBins({case_id: this.props.caseId}, {
      query: {
        page: current,
        pagesize: this.props.bins.pageSize
      }
    });
  };

  componentDidMount() {
    this.fetchData(this.state.current);
  }

  resetCurrent = () => {
    this.setState({current: 1})
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.bins.meta) {
      this.setState({pageTotal: nextProps.bins.meta.page.total})
    }
  }

  onPageChange = (current) => {
    this.setState({
      current,
    }, () => {
      const {searchData} = this.state;

      if (!this.props.bins.isSearch) {
        this.fetchData(current)
      } else {
        this.props.actions.searchBins({case_id: this.props.caseId, ...searchData}, {
          query: {
            page: current,
            pagesize: this.props.bins.pageSize
          }
        })
      }
    });
  };
  handleClick = (text) => {
    if (text === '添加') {
      this.showAddModal();
    } else if (text === '导入') {
      this.showImportBinsDialog()
    } else if (text === '编辑') {
      if (this.state.rowSelection.selectedRowKeys.length === 1) {
        this.showAddModal(true);
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

  showImportBinsDialog = () => {
    this.setState({
      importDialog: !this.state.importDialog,
    });
  };
  cardTypeRender = (value) => {
    switch (value) {
      case 1 :
        return '借记卡';
      case 2 :
        return '贷记卡(信用卡)';
      case 3 :
        return '准贷记卡';
      case 4 :
        return '预付费卡'
    }
  };

  valueRender = (value, index, record) => {
    return JSON.stringify(value).padEnd(record.card_len + 2, 'x').replace(/\"/g, '')
  };

  onRowClick = (record) => {
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = [record.id];
    this.setState({
      rowSelection,
      itemId: record.id,
    });
    this.props.actions.setBins(record);
  }

  render() {
    const buttons = [
      '导入',
      '添加',
      '编辑',
      // '删除',
    ];
    return (
      <div>
        <div className={styles.searchBox}>
          <FormBinderWrapper
            ref="form"
            value={this.state.values}
          >
            <label className={styles.caseNumber}>
              <FormBinder name="query">
                <Input
                  placeholder={'标识符/银行名称'}
                  className={styles.button}
                  trim
                />
              </FormBinder>
            </label>
          </FormBinderWrapper>
          <span>
          <Button
            type="primary"
            className={styles.button}
            onClick={this.validateFields}
          >
            查询
          </Button>
            {/*<div style={{*/}
            {/*position: 'absolute',*/}
            {/*left: '660px',*/}
            {/*top: '8px',*/}
            {/*color: '#f76048',*/}
            {/*width: '250px'*/}
            {/*}}>{this.state.tips}</div>*/}
        </span>
        </div>
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
            <Table dataSource={this.props.bins.binsList}
                   rowSelection={this.state.rowSelection}
                   onRowClick={this.onRowClick}
                   primaryKey="id"
                   loading={this.props.bins.isLoading}
                   style={{minHeight: '463px'}}
            >
              <Table.Column title="卡名" alignHeader="center" align='center' dataIndex='card_name'/>
              <Table.Column title="标识符" alignHeader="center" align='center' dataIndex='value' cell={this.valueRender}/>
              <Table.Column title="卡号长度" alignHeader="center" align='center' dataIndex='card_len'/>
              <Table.Column title="类型" alignHeader="center" align='center' dataIndex='card_type'
                            cell={this.cardTypeRender}/>
              <Table.Column title="银行名称" alignHeader="center" align='center' dataIndex='bank_name'/>
              <Table.Column title="银行编码" alignHeader="center" align='center' dataIndex='bank_id'/>
            </Table>
            <BinForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit}/>
            <ImportBins visible={this.state.importDialog} onClose={this.showImportBinsDialog}
                        resetCurrent={this.resetCurrent}/>
            <div className={styles.pagination}>
              <Pagination
                current={this.state.current}
                total={this.state.pageTotal * this.props.bins.pageSize}
                onChange={this.onPageChange}
                hideOnlyOnePage
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    caseId: state.cases.case.id,
    bins: state.bins
  }),
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(BinsList);
