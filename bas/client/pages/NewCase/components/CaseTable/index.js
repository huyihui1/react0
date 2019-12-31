import React, { Component } from 'react';
import CaseAdd from '../CaseAdd';
import { Button, Table, Pagination, Message } from '@alifd/next';



export default class CaseTable extends Component {
  static displayName = 'DismantlingTable';

  constructor(props) {
    super(props);
    this.state = {
      addModal:false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          console.log('onSelect', selected, record, records);
        },
        onSelectAll(selected, records) {
          console.log('onSelectAll', selected, records);
        },
        selectedRowKeys: [],
        mode: 'single',
      },
      current: 2,
      mockData:[
        {
          number: '15151515775',
          reason: '拆迁',
          date: '2018-10-10',
          holder: '李小四',
          department: '执行局',
        },
        {
          number: '15151515785',
          reason: '赔偿',
          date: '2018-10-10',
          holder: '李小四',
          department: '执行局',
        },
        {
          number: '15151515795',
          reason: '绿化',
          date: '2018-10-10',
          holder: '李小四',
          department: '执行局',
        },
        {
          number: '15151515805',
          reason: '拆迁',
          date: '2018-10-10',
          holder: '李小四',
          department: '执行局',
        },
        {
          number: '15151515815',
          reason: '拆迁',
          date: '2018-10-10',
          holder: '李小四',
          department: '执行局',
        },
        {
          number: '15151515825',
          reason: '赔偿',
          date: '2018-10-10',
          holder: '李小四',
          department: '执行局',
        },
      ]
    };

    this.showAddModal = this.showAddModal.bind(this);
  }

  showAddModal(){
    this.setState({
      addModal:!this.state.addModal
    })
  }
  onTableChange = (ids, records) => {
    const { rowSelection } = this.state;
    rowSelection.selectedRowKeys = ids;
    console.log('onChange', ids, records);
    this.setState({ rowSelection });
  };

  onPageChange = (current) => {
    this.setState({
      current,
    });
  };


  handleClick = (text) => {
    if(text === "新案件录入"){
      this.showAddModal()
    }else{
      Message.toast.success(`暂不支持${text}`);
    }
  };

  componentDidMount(){
    let _this = this;
  }

  render() {
    const buttons = [
      '新案件录入',
      '编辑',
      '删除',
    ];
    return (
      <div style={styles.container}>
        <div style={styles.buttons}>
          {buttons.map((text, index) => {
            return (
              <Button
                key={index}

                style={styles.button}
                onClick={() => this.handleClick(text)}
              >
                {text}
              </Button>
            );
          })}
        </div>
        <Table
          dataSource={this.state.mockData}
          rowSelection={this.state.rowSelection}
          primaryKey="number"
          style={styles.table}
        >
          <Table.Column align="center" title="案件名称" dataIndex="number" />
          <Table.Column align="center" title="案件编号" dataIndex="number" />
          <Table.Column align="center" title="立案人" dataIndex="holder" />
          <Table.Column align="center" title="立案时间" dataIndex="date" />
          <Table.Column align="center" title="备注" dataIndex="department" />
        </Table>
        <CaseAdd visible={this.state.addModal} onClose={this.showAddModal}/>
        <div style={styles.pagination}>
          <Pagination
            current={this.state.current}
            onChange={this.onPageChange}

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
    margin: '20px 0',
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};
