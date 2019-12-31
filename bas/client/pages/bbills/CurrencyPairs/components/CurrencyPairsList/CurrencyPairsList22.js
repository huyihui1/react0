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
      dataSource:this.props.currencyPairs.currencyPairsList,
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
        mode: 'single'
        
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
  // validateFields = () => {
  //   const {validateAll} = this.refs.form;
  //   validateAll((errors, values) => {
  //     let val = {...values};
  //     for (let key in val) {
  //       if (!val[key] || !val[key].length) {
  //         delete val[key]
  //       }
  //     }
  //     if (JSON.stringify(val) !== "{}") {
  //       this.setState({searchData: {...val}});

  //       this.setState({current: 1}, () => {
  //         this.props.actions.searchBins({case_id: this.props.caseId, ...val}, {
  //           query: {
  //             page: this.state.current,
  //             pagesize: this.props.currencyPairs.pageSize
  //           }
  //         })
  //       })
  //     } else {
  //       // this.props.actions.searchBbills({case_id: this.props.caseId, query: ''})
  //     }
  //   });
  // };


 

  resetCurrent = () => {
    this.setState({current: 1})
  };

 
  // onPageChange = (current) => {
  //   this.setState({
  //     current,
  //   }, () => {
  //     const {searchData} = this.state;

  //     if (!this.props.currencyPairs.isSearch) {
  //       this.fetchData(current)
  //     } else {
  //       this.props.actions.searchBins({case_id: this.props.caseId, ...searchData}, {
  //         query: {
  //           page: current,
  //           pagesize: this.props.currencyPairs.pageSize
  //         }
  //       })
  //     }
  //   });
  // };
  handleClick = (text) => {
    if (text === '新建') {
      this.showAddModal();
    } else if (text === '编辑') {
      this.showEditModal();
    } else if (text === '删除') {
      if (this.state.itemId ) {
          var result = confirm ('确认要删除么')
          if(result){
            Message.loading({
              title: '删除中...',
              duration: 0,
            })
            //console.log(this.props.actions)
            this.props.actions.removeCurrencyPairs({case_id: this.props.caseId, id: this.state.itemId})
               .then(res =>{
                if(res.status == 'resolved'){
                this.setState({
                  itemId:null 
                  
                })
                  Message.success('删除成功');           
                }
              })
              .catch(err=>{
                console.log(err);
              })
          }
          else{

          }
        
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

  showEditModal = (isEdit =true ) =>{
    if(this.state.itemId!=null){
    this.setState({
      addModal:!this.state.addModal,
      isEdit
    },() => {
      if(!this.state.addModal){
        this.setState({
          isEdit:true
        })
      }
    })
  }
  else{
    Message.warning('请点击要修改的条目')
  }
  }

  valueRender = (value, index, record) => {
    return `${record.base_symbol}/${record.settle_symbol}`
  };

  onRowClick = (record) => {
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = [record.id];
    this.setState({
      rowSelection: rowSelection,
      itemId: record.id,
    });
    this.props.actions.setCurrencyPairs(record);//redux
  }

  fetchData = (current) => {
    this.props.actions.fetchCurrencyPairs({case_id: this.props.caseId}, {
      query: {
        page: current,
        pagesize: this.props.currencyPairs.pageSize
      }
    }).then(res =>{
        console.log(res)
    });
  };

  pageChange = (currentPage) => {
   console.log(currentPage)
   this.setState({
     current:currentPage
   },()=>{
     
     this.fetchData(currentPage)
   })
}
componentDidMount() {
  this.fetchData(this.state.current);
}

componentWillReceiveProps(nextProps) {
   if (nextProps.currencyPairs.pageFirst ==1 &&nextProps.currencyPairs.meta){
    this.setState({pageTotal: nextProps.currencyPairs.meta.page.total,
       current:1
    })
    }
  else if (nextProps.currencyPairs.meta) {
    console.log('页面的最后的值')
    this.setState({pageTotal: nextProps.currencyPairs.meta.page.total})
  }
 
  

}

//Dialog
 

  render() {
    console.log(this.props.currencyPairs.pageSize)
    const buttons = [
        '新建',
       '编辑',
       '删除',
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
                   warning= {text == '删除' ? true : false}
                   type = {text == '删除'? 'primary':'normal'}
                    onClick={() => this.handleClick(text)}
                  >
                    {text}
                  </Button>
                );
              })}
            </div>
            <Table dataSource={this.props.currencyPairs.currencyPairsList}//数组
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
            {/* <Pagination
                current={this.state.current}
                total={this.state.pageTotal * this.props.bins.pageSize}
                onChange={this.onPageChange}
                hideOnlyOnePage
              /> */}
            <CurrencyPairsForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit} />
            {/* 分页 */}
            <div className={styles.pagination}>
              <Pagination
                 onChange = {this.pageChange}
                 current={this.state.current}
                 total={this.state.pageTotal * this.props.currencyPairs.pageSize}
                
                // onChange={this.onPageChange}
                 hideOnlyOnePage
              />
              </div>
              {/* <Pagination/> */}
            </div> 
          </div>
        </div>
      
    );
  }
}

export default connect(
  state => ({
    caseId: state.cases.case.id,
    currencyPairs: state.currencyPairs,
    pageSize: state.currencyPairs.pageSize
    
  }),
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(CurrencyPairsList);
