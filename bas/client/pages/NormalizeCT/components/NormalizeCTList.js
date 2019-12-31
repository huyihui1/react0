import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Button, Pagination, Balloon, Dialog, ConfigProvider, Checkbox, Loading, Input} from '@alifd/next';
import IceLabel from '@icedesign/label';
import solarLunar from 'solarlunar';
// import ajax from '../../../utils/ajax';
import {actions as NormalizeCTActions} from '../../../stores/NormalizeCT';
import {actions as CasesImportActions} from "../../../stores/CasesImport";
import NormalizeCTFoem from './normalizeCTForm'
import moment from 'moment';
import {MenuProvider} from "react-contexify";
import {searchCode} from "../../../stores/PBAnalyze/actions";
import {installExternalLibs} from "../../../utils/utils";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExchangeAlt} from "@fortawesome/free-solid-svg-icons";
import appConfig from '../../../appConfig';
import {coordOffsetDecrypt} from '../../../utils/basCoord';
import BatchMapComponent from '../../common/LocGroupMap'


let oldCode = null;

class NormalizeCTList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      addModal: false,
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        selectedRowKeys: [],
        // mode: 'single',
      },
      normalizeRowData: {},
      clickRowData: {},

      current: 1,
      pageTotal: '',
      fixed: {},
      codeInfo: '',
      rowData: {},
      searchData: null,
      childrenThis: null,
    };

    this.stopRequest = false;


    this.showAddModal = this.showAddModal.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    // this.getSuggestData = this.getSuggestData.bind(this);
    this.fetch = this.fetch.bind(this);
    // this.getCasesDate = this.getCasesDate.bind(this)
    this.sugsSameCiRender = this.sugsSameCiRender.bind(this);
    this.sugsCityCiRender = this.sugsCityCiRender.bind(this);
    this.onChangeCity = this.onChangeCity.bind(this);
    this.onChangeSame = this.onChangeSame.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
    this.onClickMarker = this.onClickMarker.bind(this);
    this.RowMouseEnter = this.RowMouseEnter.bind(this);
  }

  onPageChange = (current) => {
    this.fetch(current);
    this.setState({
      current,
    });
  };

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

  async onVisibleChange(visible, code) {
    // console.log(visible + '=============触发日志');
    let codes = [];
    code.forEach(item => {
      if (typeof item === 'object') {
        codes.push(item.code)
      } else {
        codes.push(item)
      }
    });

    this.stopRequest = !visible;
    if (visible) {
      const codeInfo = await this.props.actions.searchCodeNormalizeCT({
        caseId: this.props.caseId,
        coord: '2',
        fmt: 16,
        ct_codes: codes
      });
      console.log(codeInfo.body);

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


  renderMap() {
    const {codeInfo} = this.state;
    let data = [];
    let arr = [];

    if (codeInfo && codeInfo.data) {
      for (let key in  codeInfo.data) {
        data.push(codeInfo.data[key][0])
      }
      // data = Object.keys(codeInfo.data).length > 0 && Object.values(codeInfo.data)[0].length > 0 ? Object.values(codeInfo.data)[0] : null;
    }

    if (!data || !document.getElementById('minMap')) return;

    this.map = new window.BMap.Map('minMap');
    this.map.clearOverlays();
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
    this.map.addControl(mapType1);
    this.map.addControl(top_right_navigation);

    data.forEach(item => {
      if (!item) return;
      const pointStyle = {
        // 指定Marker的icon属性为Symbol
        icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
          scale: 1, // 图标缩放大小
          fillColor: codeInfo && codeInfo.label ? codeInfo.label.marker_color : '#f00', // 填充颜色
          // fillColor: '#f00', // 填充颜色
          fillOpacity: 0.8, // 填充透明度
        }),
      };


      let p = coordOffsetDecrypt(item[0] * 1, item[1] * 1);
      const ggPoint = new window.BMap.Point(p[0] * 1, p[1] * 1);
      arr.push(ggPoint);

      // this.map.enableScrollWheelZoom(true); // 允许鼠标缩放
      // const sContent = `<div>
      //   <h3>地址: ${data[1].address}</h3>
      //   <span>(${(data[0][0] * 1)}, ${(data[0][1] * 1)})</span>
      // </div>`;
      //  增加范围
      // const circle = new window.BMap.Circle(data.points[0], bsSearchs.items.radius, { strokeColor: 'red', strokeWeight: © 2018 SHULAN Tech2, fillColor: 'red', fillOpacity: 0.1 });
      // this.map.addOverlay(polyline);
      // this.map.addOverlay(circle);
      const marker = new window.BMap.Marker(ggPoint, pointStyle);
      this.map.addOverlay(marker);
      // const infoWindow = new window.BMap.InfoWindow(sContent);
      // marker.addEventListener('click', function () {
      //   this.openInfoWindow(infoWindow);
      // });
      // this.map.setCenter(ggPoint);


    });
    this.map.setViewport(arr);

    // this.map.centerAndZoom(point, appConfig.mapZoom);


    // const top_right_navigation = new window.BMap.NavigationControl({
    //   anchor: BMAP_ANCHOR_TOP_RIGHT,
    //   type: BMAP_NAVIGATION_CONTROL_ZOOM
    // });
    // const mapType1 = new window.BMap.MapTypeControl(
    //   {
    //     mapTypes: [BMAP_NORMAL_MAP],
    //     anchor: BMAP_ANCHOR_TOP_LEFT,
    //   }
    // );
    // const pointStyle = {
    //   // 指定Marker的icon属性为Symbol
    //   icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
    //     scale: 1, // 图标缩放大小
    //     fillColor: codeInfo && codeInfo.label ? codeInfo.label.marker_color : '#f00', // 填充颜色
    //     fillOpacity: 0.8, // 填充透明度
    //   }),
    // };
    // if (!data || !document.getElementById('minMap')) return;
    //
    //
    // // console.log(data[0][0] * 1, data[0][1] * 1);
    // let p = coordOffsetDecrypt(data[0][0] * 1, data[0][1] * 1);
    // console.log(p);
    // const ggPoint = new window.BMap.Point(p[0] * 1, p[1] * 1);
    // this.map = new window.BMap.Map('minMap');
    // this.map.addControl(mapType1);
    // this.map.addControl(top_right_navigation);
    // // this.map.enableScrollWheelZoom(true); // 允许鼠标缩放
    // const sContent = `<div>
    //     <h3>地址: ${data[1].address}</h3>
    //     <span>(${(data[0][0] * 1)}, ${(data[0][1] * 1)})</span>
    //   </div>`;
    // //  增加范围
    // this.map.clearOverlays();
    // // const circle = new window.BMap.Circle(data.points[0], bsSearchs.items.radius, { strokeColor: 'red', strokeWeight: 2, fillColor: 'red', fillOpacity: 0.1 });
    // // this.map.addOverlay(polyline);
    // // this.map.addOverlay(circle);
    // const marker = new window.BMap.Marker(ggPoint, pointStyle);
    // this.map.addOverlay(marker);
    // // const infoWindow = new window.BMap.InfoWindow(sContent);
    // // marker.addEventListener('click', function () {
    // //   this.openInfoWindow(infoWindow);
    // // });
    // this.map.setCenter(ggPoint);
    // this.map.centerAndZoom(ggPoint, appConfig.mapZoom);
  }


  onTableChange = (ids, record) => {
    // console.log(record);

    this.setState({normalizeRowData: record});


    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = ids;
  };

  onRowClick(record, index, e) {
    this.setState({clickRowData: record})
  }


  fetch(page) {
    const {actions, caseId, pagesize} = this.props;
    actions.fetchNormalizeCTs({caseId: caseId}, {query: {page: page, pagesize}})
  }

  componentDidMount() {
    this.fetch(this.state.current)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.meta && nextProps.meta.page) {
      this.setState({
        current: nextProps.meta.page.current,
        pageTotal: nextProps.meta.page.total,
      });
    }
    if (nextProps.normalizeCTList) {
      const {fixed} = this.state;
      let data = nextProps.normalizeCTList;
      for (let i = 0; i < data.length; i++) {
        if (data[i].sugs_same_ci.length === 1) {
          fixed[data[i].owner_ct_code] = data[i].sugs_same_ci[0];
          this.setState({fixed})
        }
      }
    }
  }


  sugsSameCiRender(value, index, record) {
    let values = [];
    if (this.state.fixed[record.owner_ct_code]) {
      values = [this.state.fixed[record.owner_ct_code]]
    } else {
      values = []
    }
    // console.log(values);

    let div =
      <Checkbox.Group itemDirection="ver" style={{display: 'inline-block'}} onChange={(value, e) => {
        this.onChangeSame(value, e, record)
      }} disabled={record.disabledStatus}
                      dataSource={record.sugs_same_ci} value={values}>

        {
          record.sugs_same_ci.map(item => {
            return (
              <Checkbox value={item}>{item}</Checkbox>
            )
          })
        }
      </Checkbox.Group>;


    let codes = [];
    record.sugs_same_ci.forEach(item => {
      if (typeof item === 'object') {
        codes.push(item.code)
      } else {
        codes.push(item)
      }
    });


    return (
      <Balloon trigger={div}
               shouldUpdatePosition={true}
               needAdjust={true}
               closable={false}
               align='l'
               autoFocus={false}
      >
        <BatchMapComponent id={codes[0] + index + '2'} code={codes} ctLabel={this.state.ctLabel}
                           styles={{width: '450px', height: '300px'}} clickMarker={this.onClickMarker} isBool={false}
                           activeCode={values[0]} getChildrenThis={this.getChildrenThis}/>
        {/*<div id="minMap" style={{width: '300px', height: '300px'}}/>*/}
      </Balloon>
    )


    // const {codeInfo} = this.state;
    // if (codeInfo && (Object.values(codeInfo.data)[0] || []).length > 0) {
    //   return (
    //     <Checkbox.Group itemDirection="ver" onChange={(value, e) => {
    //       this.onChangeSame(value, e, record)
    //     }} disabled={record.disabledStatus}
    //                     dataSource={record.sugs_same_ci} value={values}>
    //
    //       {
    //         record.sugs_same_ci.map(item => {
    //           return (
    //             <Balloon trigger={<Checkbox value={item}>{item}</Checkbox>} shouldUpdatePosition={true}
    //                      needAdjust={true}
    //                      closable={false} onVisibleChange={(b) => {
    //               this.onVisibleChange(b, [item]);
    //             }}>
    //               {/*<div><span>{this.state.codeInfo.data[item][0]}</span></div>*/}
    //               <p style={{fontSize: '14px', marginTop: '0'}}>
    //                 <span style={{fontSize: '16px'}}>基站:</span> {item} <FontAwesomeIcon icon={faExchangeAlt}
    //                                                                                     style={{marginLeft: '8px'}}/> {`${parseInt(item.split(':')[0], 16)}:${parseInt(item.split(':')[1], 16)}:${parseInt(item.split(':')[2], 16)}`}
    //               </p>
    //               <p style={{
    //                 minWidth: '240px',
    //                 fontSize: '14px'
    //               }}> {codeInfo && codeInfo.data && JSON.stringify(codeInfo.data) != '{}' && Object.values(codeInfo.data)[0].length > 0 && Object.values(codeInfo.data)[0][1].address}</p>
    //               <div id="minMap" style={{width: '100%', height: '300px'}}/>
    //             </Balloon>
    //           )
    //         })
    //       }
    //
    //     </Checkbox.Group>
    //   )
    // }
    //
    //
    // return (
    //   <Checkbox.Group itemDirection="ver" onChange={(value, e) => {
    //     this.onChangeSame(value, e, record)
    //   }} disabled={record.disabledStatus}
    //                   dataSource={record.sugs_same_ci} value={values}>
    //
    //     {
    //       record.sugs_same_ci.map(item => {
    //         return (
    //           <Balloon trigger={<Checkbox value={item}>{item}</Checkbox>} shouldUpdatePosition={true} closable={false}
    //                    needAdjust={true}
    //                    onVisibleChange={(b) => {
    //                      this.onVisibleChange(b, [item]);
    //                    }}>
    //             <div style={{width: '100%'}}>
    //               <h3 style={{minWidth: '240px'}}>{
    //                 codeInfo ? '基站数据暂未收录.' : '加载中...'
    //               }
    //               </h3>
    //             </div>
    //           </Balloon>
    //         )
    //       })
    //     }
    //
    //   </Checkbox.Group>
    // )


  }


  sugsCityCiRender(value, index, record) {
    let values = [];
    if (this.state.fixed[record.owner_ct_code]) {
      values = [this.state.fixed[record.owner_ct_code][0].code]
    } else {
      values = []
    }

    let div =
      <Checkbox.Group itemDirection="ver" style={{display: 'inline-block'}} onChange={(value, e) => {
        this.onChangeCity(value, e, record)
      }} disabled={record.disabledStatus}
                      dataSource={record.sugs_city_ci} value={values}>

        {
          record.sugs_city_ci.map(item => {
            return (
              <Checkbox value={item.code}>{item.code + '  ' + item.district + item.town}</Checkbox>
            )
          })
        }
      </Checkbox.Group>;


    let codes = [];
    record.sugs_city_ci.forEach(item => {
      if (typeof item === 'object') {
        codes.push(item.code)
      } else {
        codes.push(item.code)
      }
    });


    return (
      <Balloon trigger={div}
        // shouldUpdatePosition={true}
        // needAdjust={true}
               closable={false}
               align='l'
               autoFocus={false}
      >
        <BatchMapComponent id={codes[0] + index + '3'} code={codes} ctLabel={this.state.ctLabel}
                           clickMarker={this.onClickMarker}
                           activeCode={values[0]} isBool={true} getChildrenThis={this.getChildrenThis}/>
        {/*<div id="minMap" style={{width: '300px', height: '300px'}}/>*/}
      </Balloon>
    )


  }

  onChangeSame(value, e, record) {
    const {fixed} = this.state;

    this.state.childrenThis.setHighlight(value[value.length - 1]);

    if (value.length !== 0) {
      fixed[record.owner_ct_code] = value[value.length - 1];
    } else {
      delete fixed[record.owner_ct_code]
    }
    console.log(fixed);
    this.setState({fixed});


  }

  onChangeCity(value, e, record) {
    const {fixed} = this.state;
    this.state.childrenThis.setHighlight(value[value.length - 1]);
    if (value.length !== 0) {
      fixed[record.owner_ct_code] = [{code: value[value.length - 1]}, record.owner_comm_loc];
    } else {
      delete fixed[record.owner_ct_code]
    }
    console.log(fixed);
    this.setState({fixed});

  }


  onClickMarker(value) {
    const {fixed, rowData} = this.state;

    if (value.isBool) {
      fixed[rowData.owner_ct_code] = [{code: value.code}, rowData.owner_comm_loc];
      this.setState({fixed});
    } else {
      fixed[rowData.owner_ct_code] = value.code;
      this.setState({fixed});
    }
  }

  RowMouseEnter(record, index, e) {
    this.setState({rowData: record})
  }

  handleClick(text) {
    if (text === '数据补全') {
      const {fixed} = this.state;
      let arr = [];
      let obj = [];


      for (let i in fixed) {
        if (typeof fixed[i] == 'object') {
          obj = {
            ct_code: fixed[i][0].code,
            comm_loc: fixed[i][1]
          };
          arr.push(obj)
        } else {
          obj = {
            ct_code: fixed[i],
          };
          arr.push(obj)
        }
      }


      console.log(arr);

      if (arr.length === 0) {
        return
      } else {
        this.props.actions.fixMlformedNormalizeCT({case_id: this.props.caseId, fixed: arr}).then(res => {
          if (res.body.meta.success) {
            this.fetch(1);
            this.setState({fixed: {}})
          }
        })
      }
    }
  }


  search = () => {
    if (this.state.searchData && this.state.searchData.length !== 0) {
      this.props.actions.searchNormalizeCT({caseId: this.props.caseId, code: this.state.searchData});
    }
  };

  getSearchData = (e) => {
    this.setState({searchData: e})
  };

  getChildrenThis = (value) => {
    this.setState({childrenThis: value})
  };

  render() {
    const buttons = [
      // '导入',
      '数据补全',
    ];


    return (
      <div>
        <div style={{margin: '20px', position: 'relative'}}>
          <span style={styles.caseNumber}>
            <Input
              onChange={this.getSearchData}
              placeholder='请输入基站'
              trim
            />
            <span>
              <Button
                type="primary"
                style={{marginLeft: '10px'}}
                onClick={this.search}
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
        <div style={styles.container}>
          <div style={styles.buttons}>
            {buttons.map((text, index) => {
              return (
                <Button
                  key={index}

                  style={styles.button}
                  onClick={() => this.handleClick(text, index)}
                >
                  {text}
                </Button>
              );
            })}
          </div>
          <Loading visible={this.props.isLoading} style={{width: '100%'}} tip="加载中...">
            {/*this.props.normalizeCTList*/}
            <Table
              dataSource={this.props.normalizeCTList}
              // rowSelection={this.state.rowSelection}
              onRowClick={this.onRowClick}
              primaryKey="owner_ct_code"
              style={styles.table}
              onRowMouseEnter={this.RowMouseEnter}
            >
              <Table.Column align="center" title="通话地" dataIndex="owner_comm_loc"/>
              <Table.Column align="center" title="基站" dataIndex="owner_ct_code"/>
              <Table.Column align="center" title="案件中可能完整基站" dataIndex="sugs_same_ci" cell={this.sugsSameCiRender}/>
              <Table.Column align="center" title="城市+CI" dataIndex="sugs_city_ci" cell={this.sugsCityCiRender}/>
            </Table>
          </Loading>

          <div style={styles.pagination}>
            <Pagination
              current={this.state.current}
              onChange={this.onPageChange}
              total={this.state.pageTotal * this.props.pagesize}
              hideOnlyOnePage={true}
            />
          </div>
          {/*<NormalizeCTFoem visible={this.state.addModal} onClose={this.showAddModal}*/}
          {/*normalizeRowData={this.state.normalizeRowData} suggestList={this.state.suggestList}*/}
          {/*normalizeId={this.state.normalizeId} fetch={this.fetch} current={this.state.current}/>*/}
        </div>
      </div>
    );
  }
}


const styles = {
  container: {
    margin: '20px',
    letterSpacing: '2px',
    padding: '20px',
    'backgroundColor': 'white',
  },
  button: {
    margin: '0 8px',
    letterSpacing: '2px',
    marginBottom: '20px'
  },
  table: {
    // margin: '20px 0',
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
    marginTop: '35px',
  },
};

export default connect(
  state => ({
    caseId: state.cases.case.id,
    pagesize: state.normalizeCT.pageSize,
    isLoading: state.normalizeCT.showLoading,
    normalizeCTList: state.normalizeCT.normalizeCTList,
    meta: state.normalizeCT.meta
  }),
  dispatch => ({
    actions: bindActionCreators({...NormalizeCTActions, ...CasesImportActions}, dispatch),
  }),
)(NormalizeCTList);
