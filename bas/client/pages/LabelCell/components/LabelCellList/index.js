import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Button, Table, Pagination, Message, Balloon, Checkbox} from '@alifd/next';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import IceLabel from '@icedesign/label';

import {faExchangeAlt, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import ajax from '../../../../utils/ajax';
import LabelCellForm from '../LabelCellForm';
import {actions as labelCellActions} from '../../../../stores/labelCell';
import {actions as labelPNActions} from '../../../../stores/labelPN';
import FileImport from '../FileImport';

import icon1 from './img/icon1.png';
import {installExternalLibs} from "../../../../utils/utils";
import {coordOffsetDecrypt} from '../../../../utils/basCoord';
import appConfig from '../../../../appConfig';


// import {searchCode} from "../../../../stores/PBAnalyze/actions";


class LabelCellList extends Component {
  static displayName = 'LabelCellList';

  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        onSelect(selected, record, records) {
          that.props.actions.setLabelCell(record);
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
      codeInfo: '',
    };

    this.fetchData = this.fetchData.bind(this);
    this.showAddModal = this.showAddModal.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.showFileImp = this.showFileImp.bind(this);
    this.tableColumnRender = this.tableColumnRender.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.CtCodeRender = that.CtCodeRender.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
    this.renderMap = this.renderMap.bind(this);
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
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = ids;
    console.log('onChange', ids, records);
    this.setState({rowSelection, itemId: records[0].id});
  };

  onPageChange = (current) => {
    this.setState({
      current,
    }, () => {
      this.fetchData();
    });
  };


  handleClick = (text) => {
    if (text === '添加') {
      this.showAddModal();
    } else if (text === '导入') {
      this.showFileImp();
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
      this.props.actions.deleteLabelCell({caseId: this.props.caseId, id: this.state.itemId})
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
    rowSelection.selectedRowKeys = [record.ct_code];
    this.setState({
      rowSelection,
      itemId: record.id,
    });
    this.props.actions.setLabelCell(record);
  }

  fetchData(caseId = this.props.caseId) {
    const {actions, pageSize} = this.props;
    console.log(actions);
    actions.fetchLabelCells({caseId}, {
      query: {
        page: this.state.current,
        pagesize: pageSize,
      },
    });
    this.setState({
      caseId,
    });
  }

  tableColumnRender(value, index, record) {
    return <FontAwesomeIcon icon={faMapMarkerAlt} style={{color: value}}/>;
  }

  labelGroupsRender(value, index, record) {
    if (value) {
      let newVal = []
      value.forEach(item => {
        newVal.push(item);
      })
      return newVal.join(', ')
    } else {
      return value
    }
  }

  CtCodeRender(value, index, record) {
    const {codeInfo} = this.state;

    if (codeInfo && (Object.values(codeInfo.data)[0] || []).length > 0) {
      return (
        <Balloon trigger={<span>{value}</span>} shouldUpdatePosition={true} closable={false} align='r'
                 onVisibleChange={(b) => {
                   this.onVisibleChange(b, record);
                 }}>
          <div style={{width: '100%'}}>
            <h3 style={{marginBottom: '5px'}}>
              标注: <IceLabel inverse={false} style={{
              fontSize: '16px',
              backgroundColor: record.marker_color,
              color: '#fff',
              padding: '2px'
            }}>{record.label}</IceLabel>
            </h3>
            <p style={{fontSize: '14px', marginTop: '0'}}>
              <span style={{fontSize: '16px'}}>基站:</span> {value} <FontAwesomeIcon icon={faExchangeAlt}
                                                                                   style={{marginLeft: '8px'}}/> {`${parseInt(value.split(':')[0], 16)}:${parseInt(value.split(':')[1], 16)}:${parseInt(value.split(':')[2], 16)}`}
            </p>
            <p style={{
              minWidth: '240px',
              fontSize: '14px'
            }}> {codeInfo.data && JSON.stringify(codeInfo.data) != '{}' && Object.values(codeInfo.data)[0].length > 0 && Object.values(codeInfo.data)[0][1].address}</p>
            {/* <span>经纬度: ({(codeInfo.data && JSON.stringify(codeInfo.data) != '{}' && Object.values(codeInfo.data)[0][0] && Object.values(codeInfo.data)[0][0][0])}, {(codeInfo.data && JSON.stringify(codeInfo.data) != '{}' && Object.values(codeInfo.data)[0][0] && Object.values(codeInfo.data)[0][0][1])})</span> */}
            <div id="minMap" style={{width: '100%', height: '300px'}}/>
          </div>
        </Balloon>
      )
    }

    return (
      <Balloon
        shouldUpdatePosition
        align="r"
        closable={false}
        trigger={<span style={{transform: 'scale(.8)'}}>{value}</span>}
        popupStyle={{maxWidth: 'initial', width: '500px'}}
        triggerType="hover"
        onVisibleChange={(b) => {
          this.onVisibleChange(b, record)
        }}
      >
        <div style={{width: '100%'}}>
          <h3 style={{minWidth: '240px'}}>{
            codeInfo ? '基站数据暂未收录.' : '加载中...'
          }
          </h3>
        </div>
      </Balloon>
    );

  }

  async onVisibleChange(visible, code) {
    this.stopRequest = !visible;
    if (visible) {
      const codeInfo = await this.props.actions.searchCodeLabelCell({
        caseId: this.props.caseId,
        coord: '2',
        fmt: 16,
        ct_codes: [code.ct_code]
      });

      codeInfo.body.label = code.marker_color;

      if (this.stopRequest) return;
      this.setState({
        codeInfo: codeInfo.body,
      }, () => {
        if (window.BMap) {
          this.renderMap();
        } else {
          installExternalLibs(document.body, this.renderMap);
        }
      });
    } else {
      this.setState({
        codeInfo: '',
      });
    }
  }


  //  初始化百度地图
  renderMap() {
    const {codeInfo} = this.state;
    let data = null;
    if (codeInfo && codeInfo.data) {
      data = Object.keys(codeInfo.data).length > 0 && Object.values(codeInfo.data)[0].length > 0 ? Object.values(codeInfo.data)[0] : null;
    }
    const top_right_navigation = new window.BMap.NavigationControl({
      anchor: BMAP_ANCHOR_TOP_RIGHT,
      type: BMAP_NAVIGATION_CONTROL_ZOOM
    });
    const mapType1 = new window.BMap.MapTypeControl(
      {
        mapTypes: [BMAP_NORMAL_MAP],
        anchor: BMAP_ANCHOR_TOP_LEFT,
      }
    );
    const pointStyle = {
      // 指定Marker的icon属性为Symbol
      icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
        scale: 1, // 图标缩放大小
        fillColor: codeInfo && codeInfo.label ? codeInfo.label : '#f00', // 填充颜色
        fillOpacity: 0.8, // 填充透明度
      }),
    };
    if (!data || !document.getElementById('minMap')) return;

    let p = coordOffsetDecrypt(data[0][0] * 1, data[0][1] * 1);
    const ggPoint = new window.BMap.Point(p[0] * 1, p[1] * 1);
    this.map = new window.BMap.Map('minMap');
    this.map.addControl(mapType1);
    this.map.addControl(top_right_navigation);
    // this.map.enableScrollWheelZoom(true); // 允许鼠标缩放
    const sContent = `<div>
        <h3>地址: ${data[1].address}</h3>
        <span>(${(data[0][0] * 1)}, ${(data[0][1] * 1)})</span>
      </div>`;
    //  增加范围
    this.map.clearOverlays();
    // const circle = new window.BMap.Circle(data.points[0], bsSearchs.items.radius, { strokeColor: 'red', strokeWeight: 2, fillColor: 'red', fillOpacity: 0.1 });
    // this.map.addOverlay(polyline);
    // this.map.addOverlay(circle);
    const marker = new window.BMap.Marker(ggPoint, pointStyle);
    this.map.addOverlay(marker);
    // const infoWindow = new window.BMap.InfoWindow(sContent);
    // marker.addEventListener('click', function () {
    //   this.openInfoWindow(infoWindow);
    // });
    this.map.setCenter(ggPoint);
    this.map.centerAndZoom(ggPoint, appConfig.mapZoom);
  }


  componentDidMount() {
    this.fetchData();
    this.props.actions.fetchLabelPNs({caseId: this.props.caseId}, {
      query: {
        page: 1,
        pagesize: 100,
      },
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.caseId && parseInt(this.state.caseId, 0) !== nextProps.caseId) {
      this.fetchData(nextProps.caseId);
    }
    if (nextProps.labelCells.meta && nextProps.labelCells.meta.page) {
      this.setState({
        current: nextProps.labelCells.meta.page.current,
        pageTotal: nextProps.labelCells.meta.page.total,
      });
    }
  }

  render() {
    const buttons = [
      '导入',
      '添加',
      '编辑',
      '删除',
    ];
    const {isLoading, labelCells, pageSize} = this.props;

    return (
      <div style={styles.container}>
        <div style={styles.buttons}>
          {buttons.map((text, index) => {
            return (
              <Button
                key={index}
                className={text === '删除' ? 'deleteBtn' : ''}
                style={styles.button}
                onClick={() => this.handleClick(text)}
              >
                {text}
              </Button>
            );
          })}
        </div>
        <Table
          loading={isLoading}
          dataSource={labelCells.items}
          rowSelection={this.state.rowSelection}
          onRowClick={this.onRowClick}
          primaryKey="ct_code"
          style={styles.table}
        >
          <Table.Column align="center" title="基站代码" dataIndex="ct_code" style={{width: '150px'}}
                        cell={this.CtCodeRender}/>
          <Table.Column align="center" title="图钉" dataIndex="marker_color" cell={this.tableColumnRender} width={80}/>
          <Table.Column align="center" title="标注名称" dataIndex="label" width={145}/>
          <Table.Column align="center" title="标签" dataIndex="label_groups" cell={this.labelGroupsRender} width={180}/>
          <Table.Column align="center" title="备注" dataIndex="memo"/>
        </Table>
        <LabelCellForm visible={this.state.addModal} onClose={this.showAddModal} isEdit={this.state.isEdit}
                       current={this.state.current}/>
        <FileImport title="基站标注导入"
                    url={ajax.baseUrl}
                    caseId={this.state.caseId}
                    visible={this.state.fileImpShow}
                    onClose={this.showFileImp}
                    afterFileImpFun={this.fetchData}
        />
        <div style={styles.pagination}>
          <Pagination
            current={this.state.current}
            total={this.state.pageTotal * pageSize}
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
    margin: '20px 0',
    minHeight: '463px',
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default connect(
  state => ({
    labelCells: state.labelCells,
    caseId: state.cases ? state.cases.case.id : null,
    pageSize: state.labelCells.pageSize,
    isLoading: state.labelCells.isLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...labelCellActions, ...labelPNActions}, dispatch),
  }),
)(LabelCellList);
