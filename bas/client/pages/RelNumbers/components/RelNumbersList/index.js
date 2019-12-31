import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Pagination, Message, Dialog} from '@alifd/next';
import {actions as relNumberActions} from '../../../../stores/RelNumbers';


import RelNumbersForm from '../RelNumbersForm/index';
import FileImport from '../FileImport';
import ajax from '../../../../utils/ajax';
import IceLabel from '@icedesign/label';


export class RelNumbersTable extends Component {
  static displayName = 'RelNumbersList';


  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      visible: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          that.props.actions.setRelNumber(record);
          console.log('onSelect', selected, record, records);
        },
        onSelectAll(selected, records) {
          console.log('onSelectAll', selected, records);
        },
        selectedRowKeys: [],
        mode: 'single',
      },
      current: 1,
      itemId: null,
      isEdit: false,
      caseId: null,
      pageTotal: null,
      fileImpShow: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.showAddModal = this.showAddModal.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.showFileImp = this.showFileImp.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.changeShortNum = this.changeShortNum.bind(this);
    this.popupTips = this.popupTips.bind(this);
    this.numRender = this.numRender.bind(this);
    this.pbillsRender = this.pbillsRender.bind(this)
  }

  showAddModal() {
    this.setState({
      addModal: !this.state.addModal,
    }, () => {
      if (!this.state.addModal) {
        this.setState({
          isEdit: false,
        });
      }
    });
  }

  showFileImp() {
    this.setState({
      fileImpShow: !this.state.fileImpShow,
    });
  }

  onTableChange = (ids, records) => {
    console.log(ids);
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = ids;
    console.log('onChange', ids, records);
    this.setState({rowSelection,itemId:records[0].id});
  };

  onPageChange = (current) => {
    this.setState({
      current,
    }, () => {
      this.fetchData()
    });
  };

  changeShortNum() {
    Message.loading({
      title: '转化中...',
      duration: 0,
    });
    this.props.actions.changeShortNumRelNumber({caseId: this.props.caseId}).then(res => {
      if (res.status === 'resolved') {
        Message.success('转换成功');
      }
    }).catch(err => {
      console.log(err);
      Message.error('转换失败');
    });
  }

  popupTips() {
    Dialog.confirm({
      title: '提示',
      content: '本操作将会把下方列出的受影响的话单中存在于下方列表中的亲情网短号转换为长号，确定要继续吗？',
      onOk: () => this.changeShortNum(),
    });
  }
  popupConfirm = () =>{
    if (this.state.rowSelection.selectedRowKeys.length === 1){
      Dialog.confirm({
        title: '删除',
        content: <div style={{lineHeight: '20px', fontSize: '13px'}}>您确定要删除该条记录吗?</div>,
        onOk: () => this.handleClick('删除'),
        onCancel: () => this.onClose()
      });
    }else {
      Message.warning('请选择一条数据')
    }
  } 
  
  onClose = () =>{
    this.setState({
      visible: false
    })
  }


  handleClick = (text) => {
    if (text === '添加') {
      this.showAddModal();
    } else if (text === '导入') {
      this.showFileImp();
    } else if (text === '亲情网短号转换为长号') {
      // this.changeShortNum();
      this.popupTips()
    } else if (text === '编辑') {
      if (this.state.rowSelection.selectedRowKeys.length === 1) {
        this.showAddModal();
        this.setState({isEdit: true});
      } else {
        Message.warning('请选择一条数据');
      }
    } else if (this.state.rowSelection.selectedRowKeys.length === 1) {
      Message.loading({
        title: '删除中...',
        duration: 0,
      });
      this.props.actions.deleteRelNumber({caseId: this.props.caseId, id: this.state.itemId})
        .then(res => {
          console.log(res);
          if (res.status === 'resolved') {
            Message.success('删除成功');
          }
        })
        .catch(err => {
          console.log(err);
          Message.error('删除失败');
        });
    } else {
      Message.warning('请选择一条数据');
    }
  };

  onRowClick(record) {
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = [record.num];
    this.setState({
      rowSelection,
      itemId: record.id,
    });
    this.props.actions.setRelNumber(record);
  }

  fetchData(caseId = this.props.caseId) {
    const {actions, pageSize} = this.props;
    actions.fetchRelNumbers({caseId}, {
      query: {
        page: this.state.current,
        pagesize: pageSize,
      },
    });
    this.setState({
      caseId,
    });
  }

  cellRender(value) {
    if (value === 1) {
      return <span>手工单条添加</span>;
    } else if (value === 2) {
      return <span> 批量导入</span>;
    } else if (value === 3) {
      return <span>综合人员信息库中导入</span>;
    }
  }

  numRender(value, index, record) {
    // console.log(this.props.pnumLabels);
    if (this.props.pnumLabels) {
      this.props.pnumLabels.forEach(item => {
        if (item.num === record.num) {
          record.Tagging = item
        }
      });
    }


    return (
      <div>
        <span>{value}</span>
        {record.Tagging ? (<IceLabel inverse={false} style={{
          fontSize: '12px',
          backgroundColor: record.Tagging.label_bg_color,
          color: record.Tagging.label_txt_color,
          marginLeft: '1px'
        }}>{record.Tagging.label}</IceLabel>) : ''}
      </div>
    )
  }


  pbillsRender(value, index, record) {
    if (this.props.pnumLabels) {
      this.props.pnumLabels.forEach(item => {
        record.pbills.forEach(pbItem => {
          if (pbItem.length !== 0 && pbItem.owner_num === item.num) {
            pbItem.Tagging = item
          }
        })
      })
    }

    let arr = record.pbills.map(item => {
      return (
        <div style={{margin: '5px 0'}}>
          <span>{item.owner_num}</span>
          {item.Tagging ? (<IceLabel inverse={false} style={{
            fontSize: '12px',
            backgroundColor: item.Tagging.label_bg_color,
            color: item.Tagging.label_txt_color,
            marginLeft: '1px'
          }}>{item.Tagging.label}</IceLabel>) : ''}
        </div>
      )
    });

    return arr

  }


  componentDidMount() {
    this.fetchData();
    this.props.actions.getPnumLabelsRelNumber({caseId: this.props.caseId}, {
      query: {
        page: 1,
        pagesize: 10
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (this.state.caseId && parseInt(this.state.caseId, 0) !== nextProps.caseId) {
      this.fetchData(nextProps.caseId);
    }
    if (nextProps.relNumbers.meta && nextProps.relNumbers.meta.page) {
      this.setState({
        current: nextProps.relNumbers.meta.page.current,
        pageTotal: nextProps.relNumbers.meta.page.total,
      });
    }
  }

  render() {
    const buttons = [
      '导入',
      '添加',
      '编辑',
      '删除',
      '亲情网短号转换为长号'
    ];
    const {relNumbers} = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.buttons}>
          {buttons.map((text, index) => {
            return (
              <Button
                key={index}
                className={text === '删除' ? 'deleteBtn' : ''}
                style={styles.button}
                onClick={() => {
                  if (text == '删除') {
                    this.popupConfirm()
                  }else{
                    this.handleClick(text)}
                }
              }
              >
                {text}
              </Button>
            );
          })}
        </div>
        <Table
          loading={this.props.isLoading}
          dataSource={relNumbers.items}
          rowSelection={this.state.rowSelection}
          onRowClick={this.onRowClick}
          primaryKey="num"
          style={styles.table}
        >
          <Table.Column align="left" alignHeader="center" width={245} title="长号" dataIndex="num" cell={this.numRender}
                        lock/>
          <Table.Column align="center" title="亲情网短号" width={115} dataIndex="short_num" lock/>
          <Table.Column align="center" title="亲情网名称" width={150} dataIndex="network" lock/>
          <Table.Column align="left" alignHeader="center" title="受影响的话单" dataIndex="pbills" width={245}
                        cell={this.pbillsRender}/>
          <Table.Column align="center" title="产生途径" width={200} dataIndex="source" cell={this.cellRender}/>
          <Table.Column align="center" title="修改时间" width={200} dataIndex="updated_at"/>
        </Table>
        <RelNumbersForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit}/>
        <FileImport title="亲情网导入"
                    url={ajax.baseUrl}
                    caseId={this.state.caseId}
                    visible={this.state.fileImpShow}
                    onClose={this.showFileImp}
                    afterFileImpFun={this.fetchData}
        />
        <div style={styles.pagination}>
          <Pagination
            current={this.state.current}
            total={this.state.pageTotal * this.props.pageSize}
            onChange={this.onPageChange}
            hideOnlyOnePage
          />
        </div>
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
    minHeight: '470px',
  },
  pagination: {
    textAlign: 'center',
    margin: '20px 0',
  },
  buttons:{
    margin:'20px 0'
  }
};

export default connect(
  // mapStateToProps
  state => ({
    pathname: state.route.location.pathname,
    relNumbers: state.relNumbers,
    caseId: state.cases.case.id,
    pageSize: state.relNumbers.pageSize,
    isLoading: state.relNumbers.isLoading,
    pnumLabels: state.relNumbers.pnumLabels
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...relNumberActions}, dispatch),
  }),
)(RelNumbersTable);
