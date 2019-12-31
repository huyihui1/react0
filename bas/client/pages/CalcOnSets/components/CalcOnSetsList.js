import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import IceLabel from '@icedesign/label';
import moment from 'moment';
import { Table, Balloon } from '@alifd/next';
import { actions } from '../../../stores/calcOnSets';
import MapComponent from '../../common/MapComponent'
import { store } from '../../../index';


class CalcOnSetsList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          that.props.actions.setLabelPN(record);
          console.log('onSelect', selected, record, records);
        },
        onSelectAll(selected, records) {
          console.log('onSelectAll', selected, records);
        },
        selectedRowKeys: [],
        mode: 'single',
      },
      criteria: null,
      initNumCols: [
        {
          title: '对方号码(基站)',
          dataIndex: 'peer_num',
          lock: true,
          width: 160,
        },
        {
          title: '人员信息',
          dataIndex: 'peer_cname',
          lock: true,
          cell: this.labelRender.bind(this),
          width: 100,
        },
        {
          title: '所有话单出现次数',
          dataIndex: 'count',
          lock: true,
          width: 100,
        },
        {
          title: '所有话单首次',
          dataIndex: 'all_first_day',
          // lock: true,
          width: 130,
        },
        {
          title: '所有话单末次',
          dataIndex: 'all_last_day',
          // lock: true,
          width: 130,
        },
      ],
      initCodeCols: [{
        title: '对方号码(基站)',
        dataIndex: 'owner_ct_code',
        cell: this.ctCodeRender.bind(this),
        lock: true,
        width: 160,
      },
      {
        title: '基站属性',
        dataIndex: '基站属性',
        lock: true,
        cell: this.labelRender.bind(this),
        width: 100,
      },
      {
        title: '所有话单出现次数',
        dataIndex: 'count',
        lock: true,
        width: 100,
      },
      {
        title: '所有话单首次',
        dataIndex: 'all_first_day',
        // lock: true,
        width: 130,
      },
      {
        title: '所有话单末次',
        dataIndex: 'all_last_day',
        // lock: true,
        width: 130,
      }],
      cols: [
        {
          title: '对方号码(基站)',
          dataIndex: 'peer_num',
          lock: true,
          width: 160,
        },
        {
          title: '人员信息',
          dataIndex: 'peer_cname',
          lock: true,
          cell: this.labelRender.bind(this),
          width: 100,
        },
        {
          title: '所有话单出现次数',
          dataIndex: 'count',
          lock: true,
          width: 100,
        },
        {
          title: '所有话单首次',
          dataIndex: 'all_first_day',
          // lock: true,
          width: 130,
        },
        {
          title: '所有话单末次',
          dataIndex: 'all_last_day',
          // lock: true,
          width: 130,
        },
      ],
      customCols: {
        s1: [
          {
            title: 's1中次数',
            dataIndex: 's1_count',
            width: 80,
          },
          {
            title: 's1中首次',
            dataIndex: 's1_first_call',
            cell: this.firstCallRender.bind(this),
            width: 130,
          },
          {
            title: 's1中末次',
            dataIndex: 's1_last_call',
            width: 130,
          },
        ],
        s2: [
          {
            title: 's2中次数',
            dataIndex: 's2_count',
            width: 80,
          },
          {
            title: 's2中首次',
            cell: this.firstCallRender.bind(this),
            dataIndex: 's2_first_call',
            width: 130,
          },
          {
            title: 's2中末次',
            dataIndex: 's2_last_call',
            width: 130,
          },
        ],
        s3: [
          {
            title: 's3中次数',
            dataIndex: 's3_count',
            width: 80,
          },
          {
            title: 's3中首次',
            cell: this.firstCallRender.bind(this),
            dataIndex: 's3_first_call',
            width: 130,
          },
          {
            title: 's3中末次',
            dataIndex: 's3_last_call',
            width: 130,
          },
        ],
        s4: [
          {
            title: 's4中次数',
            dataIndex: 's4_count',
            width: 80,
          },
          {
            title: 's4中首次',
            cell: this.firstCallRender.bind(this),
            dataIndex: 's4_first_call',
            width: 130,
          },
          {
            title: 's4中末次',
            dataIndex: 's4_last_call',
            width: 130,
          },
        ],
      },
      isStickyHeader: true,
      setCount: 2,
      meter: ''
    };

    this.showAddModal = this.showAddModal.bind(this);
    this.showFileImp = this.showFileImp.bind(this);
  }

  firstCallRender = (value, index, record) => {
    return (
      <span style={{color: '#90620C'}}>{value}</span>
    )
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
    const { rowSelection } = this.state;
    rowSelection.selectedRowKeys = ids;
    console.log('onChange', ids, records);
    this.setState({ rowSelection });
  };


  numRender(value, index, record) {
    return value ? (
      <div>
        <h3 style={{ color: 'red', margin: 0 }}>{value.count}</h3>
        <span>{moment(record[`${value.num}started_at_min`]).format('MM.DD')}至{moment(record[`${value.num}started_at_max`]).format('MM.DD')}</span>
      </div>
    ) : value;
  }

  defaultRender(value) {
    return value;
  }

  ctCodeRender(value, index, record) {
    return (
      <Balloon align="tr"
               needAdjust
               trigger={<span>{value}</span>}
               closable={false}
      >
        <div style={{width: '600px', height: '300px'}}>
          <MapComponent code={value} ctLabel={this.props.labelCells.items} />
        </div>
      </Balloon>
    )
  }

  labelRender(value, index, record) {
    // let val = '';
    // labelPNs.items.forEach(item => {
    //   console.log(item);
    //   if (item.num === value) {
    //     val = (
    //       <div>
    //         <span>{item}</span>
    //         <IceLabel inverse={false}
    //                   style={{
    //                     fontSize: '14px',
    //                     backgroundColor: item.label_bg_color,
    //                     color: item.label_txt_color,
    //                   }}
    //         >{item.label}
    //         </IceLabel>
    //       </div>
    //     );
    //   }else {
    //     val = (
    //       <span>{value}</span>
    //     )
    //   }
    // });
    //
    // return val;


    const { labelPNs } = this.props;
    if (labelPNs) {
      labelPNs.LargItems.forEach(item => {
        if (item.num === record.peer_num) {
          record.Tagging = item;
        }
      });
    }


    return (
      <div>
        {record.Tagging ? (<span style={{
          display: 'inline-block',
          padding: '5px',
          fontSize: '12px',
          backgroundColor: record.Tagging.label_bg_color,
          color: record.Tagging.label_txt_color,
        }}
        >{record.Tagging.label}
        </span>) : <span>{record.owner_name} {record.peer_cname}</span>}
      </div>
    );
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.meter && nextProps.meter !== this.state.meter || nextProps.setCount !== this.state.setCount) {
      const { initNumCols, customCols, initCodeCols } = this.state;
      const arr = Array(nextProps.setCount).fill();
      let cols = initNumCols
      this.props.actions.clearCalcOnSets();
      if (nextProps.meter === 'pbrs') {
        arr.forEach((item, index) => {
          cols = [...cols, ...customCols[`s${index + 1}`]];
        });
      } else {
        cols = initCodeCols
        arr.forEach((item, index) => {
          cols = [...cols, ...customCols[`s${index + 1}`]];
        });
      }
      this.setState({
        cols,
        meter: nextProps.meter,
        setCount: nextProps.setCount,
      });
    }
  }

  componentDidMount() {
    const { initNumCols, initCodeCols, customCols } = this.state;
    const arr = Array(this.props.setCount).fill();
    let cols = initNumCols
    if (this.props.meter === 'pbrs') {
      arr.forEach((item, index) => {
        cols = [...cols, ...customCols[`s${index + 1}`]];
      });
    } else {
      cols = initCodeCols
      arr.forEach((item, index) => {
        cols = [...cols, ...customCols[`s${index + 1}`]];
      });
    }
    this.setState({
      cols,
      setCount: this.props.setCount,
      meter: this.props.meter
    });
  }

  render() {
    const { cols } = this.state;
    const { calcOnSets } = this.props;
    return (
      <div style={styles.container}>
        <Table
          loading={calcOnSets.isLoading}
          dataSource={calcOnSets.items}
          useVirtual
          fixedHeader
          maxBodyHeight={document.documentElement.offsetHeight - 50 || document.body.offsetHeight - 50}
          style={styles.table}
        >
          {
            cols.map(col => {
              return (
                <Table.Column align="center"
                  title={col.title}
                  dataIndex={col.dataIndex}
                  key={col.dataIndex}
                  cell={col.cell || this.defaultRender}
                  width={col.width}
                  lock={col.lock}
                />
              );
            })
          }
        </Table>
      </div>
    );
  }
}


const styles = {
  container: {
    letterSpacing: '2px',
    backgroundColor: '#fff',
    minHeight: '463px',
  },
  button: {
    margin: '0 8px',
    letterSpacing: '2px',
  },
  table: {
    // margin: '20px 0',
    // minHeight: '463px',
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default connect(
  state => ({
    caseId: state.cases.case.id,
    calcOnSets: state.calcOnSets,
    labelPNs: state.labelPNs,
    labelCells: state.labelCells,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(CalcOnSetsList);
