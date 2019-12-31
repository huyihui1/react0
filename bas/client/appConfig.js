const appConfig = {
  rootUrl: 'http://47.103.61.224:9091',
  pbasTitle: '数岚话单分析',
  bbasTitle: '数岚账单分析',

  mapsSetting: {
    vendor: 'BaiduMaps',
    appId: 'xxx',
    appKey: 'yyyyy',
  },
  pageSize: 10,
  largePageSize: 100,
  mapAK: 'ocV1Fw5H1utwvWfvatIlke295BtFM3vL',
  labelColorsConfig: {
    colors: [
      '#f5317f', '#f04134', '#f56a00', '#00a854', '#00a2ae', '#108ee9', '#7265e6', '#000000',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b',
    ],
  },
  callrackColors: ['#FFD306', '#00AEAE', '#F00078', '#FF8000', '#B87070', '#66B3FF', '#00EC00', '#9D9D9D', '#FF5151', '#2828FF'],
  NO_DATA_TEXT: '暂无数据',
  NO_DATA_ROW_LIMIT: 10,
  LOADING_TEXT: '正在加载...',
  mapZoom: 17,
  bigMapZoom: 13,
  PBAS: 'pbills',
  BBAS: 'bbills',
  reportMap: {width: '600px'}, // 已废弃, 因多处引用暂时保留
  singleLocMap: {width: '600px', height: '250px'},
  locGroupMap: {width: '450px', height: '300px'}
};

export default appConfig;
