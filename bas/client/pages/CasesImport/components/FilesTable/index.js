import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import { Button, Table, Message } from '@alifd/next';



export default class FilesTable extends Component {
  static displayName = 'DismantlingTable';

  constructor(props) {
    super(props);
    this.state = {
      addModal:false,
      current: 2,
      mockData:[
        {
          number: '15151515775',
          duanhao: '1234',
          reason: '拆迁',
          date: '2018-10-10',
          holder: '李小四',
          department: '执行局',
        },
        {
          duanhao: '1234',
          number: '15151515785',
          reason: '赔偿',
          date: '2018-10-10',
          holder: '李小四',
          department: '执行局',
        },
        {
          duanhao: '1234',
          number: '15151515795',
          reason: '绿化',
          date: '2018-10-10',
          holder: '李小四',
          department: '执行局',
        },
        {
          duanhao: '1234',
          number: '15151515805',
          reason: '拆迁',
          date: '2018-10-10',
          holder: '李小四',
          department: '执行局',
        },
        {
          duanhao: '1234',
          number: '15151515815',
          reason: '拆迁',
          date: '2018-10-10',
          holder: '李小四',
          department: '执行局',
        },
        {
          duanhao: '1234',
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
    if(text === "添加"){
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
      '添加',
      '编辑',
      '删除',
    ];
    return (
      <div style={styles.container}>
        <div style={styles.buttons}>
          {/*buttons.map((text, index) => {
            return (
              <Button
                key={index}

                style={styles.button}
                onClick={() => this.handleClick(text)}
              >
                {text}
              </Button>
            );
          })*/}
        </div>
        <Table
          dataSource={this.state.mockData}
          primaryKey="number"
          style={styles.table}
        >
          <Table.Column align="center" title="手机" dataIndex="number" style={{width: "150px"}} />
          <Table.Column align="center" title="短号" dataIndex="duanhao" />
          <Table.Column align="center" title="使用人" dataIndex="holder" />
          <Table.Column align="center" title="库人员信息" dataIndex="reason" />
          <Table.Column align="center" title="单位服务" dataIndex="holder" />
          <Table.Column align="center" title="标签" dataIndex="department" />
          <Table.Column align="center" title="备注" dataIndex="department" />
          <Table.Column align="center" title="涉及案件" dataIndex="department" />
        </Table>
        <div style={{textAlign:"center"}}>
          <Link to={`/calls/find`}><Button type="primary">话单分析</Button></Link>
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
