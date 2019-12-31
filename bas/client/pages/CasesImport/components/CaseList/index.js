import React, {Component} from 'react';
import {Button, Table, Pagination, Message, Input} from '@alifd/next';
import CaseSearch from '../CaseSearch'

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from "../../../../stores/CasesImport";
import IceLabel from '@icedesign/label';
import {CN_PHONE_NUM_VAGUE_RULE} from '../../../../fieldConstraints'
import IceContainer from "../../../IWorkspace/components/SearchBar";

class CaseList extends Component {
  static displayName = 'DismantlingTable';

  constructor(props) {
    super(props);
    this.state = {
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          // console.log('onSelect', selected, record, records);
        },
        onSelectAll(selected, records) {
          console.log('onSelectAll', selected, records);
        },
        selectedRowKeys: [],
      },
      current: 1,
      pageTotal: "",
      newsItems: [],
      serchItems: [],
      ids: [],
      markData: [],
      expandedRowIndent: [0, 0],
      searchData: '',
      isSearch: false,
      openRowKeys: [],
      tips:''
    };
    this.fetchData = this.fetchData.bind(this);
    this.createDate = this.createDate.bind(this);
    this.getPnumLabels = this.getPnumLabels.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.onRowOpen = this.onRowOpen.bind(this);
    this.expandedRowRender = this.expandedRowRender.bind(this);
    this.importStatement = this.importStatement.bind(this);
    this.ownerNumRender = this.ownerNumRender.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.searchOwnerNum = this.searchOwnerNum.bind(this);
    this.getSearchData = this.getSearchData.bind(this);
    this.expandedSearchRowRender = this.expandedSearchRowRender.bind(this);
    this.onSearchRowOpen = this.onSearchRowOpen.bind(this)
  }

  expandedRowRender(record, index) {
    return (
      <Table
        dataSource={record.childRen}
        rowSelection={this.state.rowSelection}
        onRowClick={this.onRowClick}
        primaryKey="id"
        style={{minHeight: "300"}}
        maxBodyHeight={300}
        useVirtual
      >
        <Table.Column alignHeader='center' align="left" title="话单号码" dataIndex="owner_num" cell={this.ownerNumRender}/>
        <Table.Column align="center" title="开始日期" dataIndex="alyz_day_start"/>
        <Table.Column align="center" title="结束日期" dataIndex="alyz_day_end"/>
        <Table.Column align="center" title="条数" dataIndex="total"/>
      </Table>
    )
  };

  expandedSearchRowRender(record, index) {
    return (
      <Table
        dataSource={record.childRen}
        rowSelection={this.state.rowSelection}
        onRowClick={this.onRowClick}
        primaryKey="id"
        style={{minHeight: "300"}}
        maxBodyHeight={300}
        useVirtual
      >
        <Table.Column align="center" title="话单号码" dataIndex="owner_num" cell={this.ownerNumRender}/>
        <Table.Column align="center" title="开始日期" dataIndex="alyz_day_start"/>
        <Table.Column align="center" title="结束日期" dataIndex="alyz_day_end"/>
        <Table.Column align="center" title="条数" dataIndex="total"/>
      </Table>
    )
  };


  ownerNumRender(value, index, record) {
    if (this.props.pnumLabels) {
      this.props.pnumLabels.forEach(item => {
        if (item.num === record.owner_num) {
          record.Tagging = item
        }
      });
    }
    console.log(this.props.pnumLabels);

    return (
      <div>
        <span>{value}</span>
        {record.Tagging ? (<IceLabel inverse={false} style={{
          fontSize: '12px',
          backgroundColor: record.Tagging.label_bg_color,
          color: record.Tagging.label_txt_color,
          marginLeft: '5px'
        }}>{record.Tagging.label}</IceLabel>) : <span style={{marginLeft: '5px'}}>{record.owner_name}</span>}
      </div>
    )

  }


  onTableChange = (ids, records) => {
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = ids;
    this.setState({rowSelection, ids});
  };

  onPageChange = (current) => {
    this.setState({
      current,
    }, res => {
      this.fetchData(current)
    });
  };

  onRowClick(record) {
    // const {rowSelection} = this.state;
    // rowSelection.selectedRowKeys = [record.department];
    // this.setState({
    //   rowSelection,
    //   itemId: record.id,
    // });
    // this.props.actions.setUserAdmin(record);
  }

  onRowOpen(openRowKeys, currentRowKey, expanded, currentRecord) {
    if (expanded) {
      this.getPnumLabels(currentRowKey);
      this.createDate(currentRowKey);
    }
  }

  onSearchRowOpen(openRowKeys, currentRowKey, expanded, currentRecord) {
    console.log(openRowKeys);
    // this.setState({openRowKeys:openRowKeys})
  }

  //导入话单到本案
  importStatement() {
    const {actions, caseId} = this.props;
    if (this.state.ids.length !== 0) {
      actions.importsCasesImport({id: caseId, pbill_ids: this.state.ids}).then(res => {
        if (res.body.data) {
          Message.success('导入成功!')
        }else {
          Message.error('导入失败!')
        }
      })
    }
  }


  fetchData(page) {
    const {actions} = this.props;
    actions.fetchCasesImports({caseId: this.props.caseId}, {
      query: {
        page: page,
        pagesize: this.props.pagesize
      }
    }).catch(err => {
      Message.error(err.message);
    });
  }

  createDate(id) {
    const {actions} = this.props;
    const {newsItems, markData} = this.state;
    actions.createCasesImport({cases_id: id}, {
      query: {
        page: 1,
        pagesize: 100
      }
    }).then(res => {
      newsItems.forEach(item => {
        if (item.id === id) {
          item.childRen = res.body.data;
        }
      });
      this.setState({
        newsItems
      })
    }).catch(err => {
      Message.error(err.message);
    });
  }

  getPnumLabels(id) {
    const {actions} = this.props;
    actions.getPnumLabelsCasesImport({caseId: id}, {
      query: {
        page: 1,
        pagesize: 100
      }
    })
  }


  componentDidMount() {
    this.fetchData(this.state.current);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.meta && nextProps.meta.page) {
      this.setState({
        current: nextProps.meta.page.current,
        pageTotal: nextProps.meta.page.total
      })
    }

    if (nextProps.caseImports && nextProps.caseImports.items) {
      let items = nextProps.caseImports.items;
      let caseId = nextProps.caseId;
      const newcaseImports = [];
      items.forEach(item => {
        if (item.id != caseId) {
          newcaseImports.push(item)
        }
      });
      this.setState({newsItems: newcaseImports});
    }
  }

  searchOwnerNum() {
    if (!this.state.searchData) {
      this.setState({tips:'请输入正确格式'});
      return
    };


    this.props.actions.searchOwnerNumCasesImport({
      caseId: this.props.caseId,
      query: this.state.searchData
    }).then(res => {
      let arr = [];
      let newopenRowKeys = [];
      res.body.data.forEach(item => {
        item.case.childRen = item.pbills;
        arr.push(item.case);
        newopenRowKeys.push(item.case.id)
      });
      this.setState({serchItems: arr, openRowKeys: newopenRowKeys});

    });

    this.setState({isSearch: true})

  }

  getSearchData(value) {
    if (!CN_PHONE_NUM_VAGUE_RULE.test(value)) {
      this.setState({tips:'请输入正确格式'})
      this.setState({searchData: ''})
    } else {
      this.setState({tips:''});
      this.setState({searchData: value})
    }
  }


  render() {
    const {caseImports, caseId} = this.props;
    return (
      <div>
        <div style={{margin: '20px',position:'relative'}}>
          <span style={styles.caseNumber}>
            <Input
              onChange={this.getSearchData}
              style={{...styles.input, ...styles.shortInput}}
              placeholder='请输入手机号码'
            />
            <span>
              <Button

                type="primary"
                style={styles.button}
                onClick={this.searchOwnerNum}
              >
                搜索
              </Button>
            </span>
          </span>
          <div style={{
            position: 'absolute',
            left: '280px',
            top: '8px',
            color: '#f76048',
            width: '250px'
          }}>{this.state.tips}</div>
        </div>
        {
          this.state.isSearch ? (
            <div style={{margin: '20px', padding: '20px', 'backgroundColor': 'white'}}>
              <div style={styles.container}>
                <div><Button onClick={this.importStatement}>导入话单到本案</Button></div>
                <Table dataSource={this.state.serchItems}
                       hasBorder={false}
                       expandedRowRender={this.expandedSearchRowRender}
                       onRowOpen={this.onSearchRowOpen}
                       expandedRowIndent={this.state.expandedRowIndent}
                       openRowKeys={this.state.openRowKeys}
                       style={styles.table}>
                  >
                  <Table.Column title="案件名称" align="center" dataIndex="name"/>
                  <Table.Column title="案件编号" align="center" dataIndex="num"/>
                  <Table.Column title="话单数量" align="center" dataIndex="pb_rec_count"/>
                  <Table.Column title="备注" align="center" dataIndex="memo"/>
                </Table>


                <div style={styles.pagination}>
                  <Pagination
                    current={this.state.current}
                    onChange={this.onPageChange}
                    total={this.state.pageTotal * this.props.pagesize}
                    hideOnlyOnePage
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={{margin: '20px', padding: '20px', 'backgroundColor': 'white'}}>
              <div style={styles.container}>
                <div><Button onClick={this.importStatement}>导入话单到本案</Button></div>
                <Table dataSource={this.state.newsItems}
                       hasBorder={false}
                       expandedRowRender={this.expandedRowRender}
                       onRowOpen={this.onRowOpen}
                       expandedRowIndent={this.state.expandedRowIndent}
                       style={styles.table}>
                  >
                  <Table.Column title="案件名称" align="center" dataIndex="name"/>
                  <Table.Column title="案件编号" align="center" dataIndex="num"/>
                  <Table.Column title="话单数量" align="center" dataIndex="pb_rec_count"/>
                  <Table.Column title="备注" align="center" dataIndex="memo"/>
                </Table>


                <div style={styles.pagination}>
                  <Pagination
                    current={this.state.current}
                    onChange={this.onPageChange}
                    total={this.state.pageTotal * this.props.pagesize}
                    hideOnlyOnePage
                  />
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

const styles = {
  container: {
    margin: '0 20px',
    letterSpacing: '2px',
  },
  button: {
    margin: '0 8px',
    letterSpacing: '2px',
  },
  table: {
    margin: '20px 0',
    minHeight: '470px',
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
    marginTop: '35px',
  },
};

export default connect(
  state => ({
    caseImports: state.caseImports,
    isLoading: state.caseImports.isLoading,
    caseId: state.cases.case.id,
    meta: state.caseImports.meta,
    pagesize: state.caseImports.pageSize,
    pnumLabels: state.caseImports.pnumLabels
  }),
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(CaseList);
