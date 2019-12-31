import React, {Component} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Pagination, Message, Dialog} from '@alifd/next';
import {
  fetchVENnumbers,
  setVENnumber,
  deleteVENnumber,
  shortnumChange,
  getPnumLabels,
  getVenNumbers
} from '../../../../stores/venNumbers/actions';
import ajax from '../../../../utils/ajax';
import injectReducer from '../../../../utils/injectReducer';
import VENnumbersReducer from '../../../../stores/venNumbers/reducer';

import VENNumberForm from '../VENNumberForm/index';
import FileImport from '../FileImport';
import IceLabel from '@icedesign/label';
import {Link} from "react-router-dom";


export class VennumbersTable extends Component {
  static displayName = 'VennumbersTable';


  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect: this.onSelect,
        onSelectAll(selected, records) {
          console.log('onSelectAll', selected, records);
        },
        selectedRowKeys: [],
        mode: 'single',
      },
      VENnumbersList: [],
      current: 1,
      pageTotal: null,
      pageSize: null,
      isEdit: false,
      activeIndex: null,
      caseId: null,
      fileImpShow: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.showAddModal = this.showAddModal.bind(this);
    this.showFileImp = this.showFileImp.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onFileClick = this.onFileClick.bind(this);
    this.onFileClose = this.onFileClose.bind(this);
    this.numRender = this.numRender.bind(this);
    this.popupTips = this.popupTips.bind(this);
    this.pbillsRender = this.pbillsRender.bind(this);
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

  onRowClick(record, index) {
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = [record.num];
    this.setState({
      rowSelection,
      activeIndex: index,
    });
    this.props.setVENnumber(record);
  }

  onTableChange = (ids, records) => {
    console.log(ids);
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = ids;
    console.log('onChange', ids, records);
    this.setState({rowSelection});
  };

  onSelect = (selected, record, records) => {
    const activeIndex = this.state.VENnumbersList.indexOf(record);
    this.props.setVENnumber(record);
    this.setState({
      activeIndex,
    });
    console.log('onSelect', selected, record, records);
  };

  onPageChange = (current) => {
    this.setState({
      current,
    }, () => {
      this.props.fetchVENnumbers(this.state.caseId, {
        page: this.state.current,
        pagesize: this.state.pageSize,
      });
    });
  };

  popupTips() {
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

  handleClick = (text) => {
    if (text === '添加') {
      this.showAddModal();
    } else if (text === '导入') {
      this.showFileImp();
    } else if (text === '虚拟网短号转换为长号') {
      // this.props.shortnumChange(this.state.caseId);
      this.popupTips()
    } else if (text === '编辑') {
      if (this.state.rowSelection.selectedRowKeys.length === 1) {
        this.showAddModal();
        this.setState({isEdit: true});
      } else {
        Message.warning('请选择一条数据');
      }
    } else if (this.state.rowSelection.selectedRowKeys.length === 1) {
      this.props.deleteVENnumber(this.state.activeIndex, this.state.caseId, this.props.VENnumber.id);
    } else {
      Message.warning('请选择一条数据');
    }
  };

  beforeUpload(file) {
    console.log('beforeUpload : ', file);
  }

  onChange(info) {
    console.log('onChange : ', info);
  }

  onSuccess(info) {
    console.log('onSuccess : ', info);
    this.setState({
      isPreview: true,
    });
  }

  onFileClick() {
    ajax.post(`/cases/${this.state.caseId}/ven_numbers/do-import`);
  }

  onFileClose() {
    ajax.post(`/cases/${this.state.caseId}/ven_numbers/abort-import`);
  }

  fetchData(caseId = this.state.caseId, params = {
    page: this.state.current,
    pagesize: this.props.pageSize,
  }) {
    this.props.fetchVENnumbers(caseId, params);
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

  componentDidMount() {
    this.setState({
      caseId: this.props.caseId,
    }, () => {
      this.fetchData(this.state.caseId);
    });


    this.props.getPnumLabels(this.props.caseId);

    this.props.getVenNumbers(this.props.caseId);


  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.pnumLabels.pnumLabels);
    if (this.state.caseId && parseInt(this.state.caseId, 0) !== nextProps.caseId) {
      this.setState({
        caseId: nextProps.caseId,
      });
      this.props.fetchVENnumbers(nextProps.caseId, {
        page: this.state.current,
        pagesize: this.props.pageSize,
      });
    }
    if (this.state.VENnumbersList !== nextProps.vennumbers.items.data) {
      this.setState({
        VENnumbersList: nextProps.vennumbers.items,
        pageSize: nextProps.vennumbers.pageSize,
      });
    }
    if (nextProps.vennumbers.meta.page) {
      this.setState({
        current: nextProps.vennumbers.meta.page.current,
        pageTotal: nextProps.vennumbers.meta.page.total,
      });
    }
  }

  numRender(value, index, record) {
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
        <div style={{margin:'5px 0'}}>
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


  render() {
    const buttons = [
      '导入',
      '添加',
      '编辑',
      '删除',
      '虚拟网短号转换为长号'
    ];
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
                  if (text == '删除'){
                  this.popupConfirm()
                  }
                  else{
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
          dataSource={this.state.VENnumbersList}
          rowSelection={this.state.rowSelection}
          onRowClick={this.onRowClick}
          primaryKey="num"
          style={styles.table}
        >
          <Table.Column align="left" alignHeader="center" width={245} title="长号" dataIndex="num" cell={this.numRender} lock/>
          <Table.Column align="center" title="虚拟网短号" width={115} dataIndex="short_num" lock/>
          <Table.Column align="center" title="虚拟网名称" width={150} dataIndex="network" lock/>
          <Table.Column align="left" alignHeader="center" width={245} title="受影响的话单" dataIndex="pbills"  cell={this.pbillsRender}/>
          <Table.Column align="center" title="产生途径" width={200} dataIndex="source" cell={this.cellRender}/>
          <Table.Column align="center" title="修改时间" width={200} dataIndex="updated_at"/>
        </Table>
        <VENNumberForm visible={this.state.addModal} isEdit={this.state.isEdit} onClose={this.showAddModal}/>
        <FileImport title="虚拟网导入"
                    url={ajax.baseUrl}
                    caseId={this.state.caseId}
                    visible={this.state.fileImpShow}
                    onClose={this.showFileImp}
                    afterFileImpFun={this.fetchData}
        />
        <div style={styles.pagination}>
          <Pagination
            current={this.state.current}
            total={this.state.pageTotal * this.state.pageSize}
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
  fileTable: {
    margin: '20px 0',
  },
  table: {
    minHeight: '470px',
  },
  pagination: {
    margin: '20px 0',
    textAlign: 'center',
  },
  submitButton: {
    // marginLeft: '85px',
  },
  submitButton2: {
    marginLeft: '15px',
  },
  buttons:{
    margin:'20px 0 '
  }
};

const mapStateToProps = state => {
  return {
    caseId: state.cases.case.id,
    isLoading: state.vennumbers.isLoading,
    route: state.route,
    vennumbers: state.vennumbers,
    VENnumber: state.vennumbers.item,
    pageSize: state.vennumbers.pageSize,
    pnumLabels: state.vennumbers.pnumLabels,
    venNumbersList: state.vennumbers.venNumbers
  };
};

const mapDispatchToProps = {
  fetchVENnumbers,
  setVENnumber,
  deleteVENnumber,
  shortnumChange,
  getPnumLabels,
  getVenNumbers
};
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withReducer = injectReducer({key: 'vennumbers', reducer: VENnumbersReducer});

export default compose(
  withReducer,
  withConnect,
)(VennumbersTable);
