// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置
import {
  faBook,
  faBriefcase,
  faHourglassHalf,
  faPhoneSquare,
  faEye,
  faUsers,
  faWifi,
  faTools,
  faYenSign,
  faMapMarkerAlt,
  faCog,
  faDesktop,
  faClipboardList,
  faFileImport,
  faUpload,
  faMapMarkedAlt,
  faListAlt,
  faCalendarDay,
  faNetworkWired,
  faGlobe,
  faBookmark,
  faEdit,
  faRoute,
  faCreditCard,
  faListUl,
  faChartArea,
  faBroadcastTower,
  faSearch,
  faUserFriends,
  faTheaterMasks,
  faUserCog,
  faUserTag,
  faFileArchive,
  faTh,
  faFileInvoiceDollar,
  faChartLine,
  faSearchDollar,
  faChartPie,
  faHandHoldingUsd
} from '@fortawesome/free-solid-svg-icons'

import {
  faUser,
  faBuilding,
  faClock,
  faBell,
  faComments,
} from '@fortawesome/free-regular-svg-icons'

import {
  faConnectdevelop,
  faBuromobelexperte,
  faCreativeCommonsSampling
} from '@fortawesome/free-brands-svg-icons'



const headerMenuConfig = [
  {
    name: '一对一画像',
    path: '/cases/{{=it.caseId}}/pbills/mutual',
    to: true,
    // newWindow: true,
    icon: faUser,
  },
  // {
  //   name: '密切联系人',
  //   path: '/#',
  //   external: true,
  //   newWindow: true,
  //   icon: faComments,
  // },
  // {
  //   name: '空间分析',
  //   path: '/#',
  //   external: true,
  //   newWindow: true,
  //   icon: faBuilding,
  // },
  // {
  //   name: '时间分析',
  //   path: '/#',
  //   external: true,
  //   newWindow: true,
  //   icon: faHourglassHalf,
  // },
  // {
  //   name: '异常分析',
  //   path: '/#',
  //   external: true,
  //   newWindow: true,
  //   icon: faBell,
  // },
  // {
  //   name: '生活规律',
  //   path: '/#',
  //   external: true,
  //   newWindow: true,
  //   icon: faClock,
  // },
];

const asideMenuConfig = [
  {
    name: '工作台',
    path: '/Workspace',
    icon: faBriefcase,
    children: [
      {
        mkey: 'iWorkspace',
        name: '我的工作台',
        path: '/iworkspace',
        icon: faDesktop,
        auth: false,
      },
    ],
  },
  {
    name: '案件管理',
    path: '/CaseMgnt',
    icon: faBook,
    // authority: 'user',
    children: [
      {
        mkey:'overview',
        icon: faClipboardList,
        name: '案件概览',
        path: '/cases/{{=it.caseId}}/overview',
      },
      {
        mkey:'labelPN',
        icon: faBookmark,
        name: '号码标注',
        path: '/cases/{{=it.caseId}}/labelpn',
      },
      {
        mkey:'labelCT',
        icon: faMapMarkedAlt,
        name: '基站标注',
        path: '/cases/{{=it.caseId}}/labelct',
      },
      {
        mkey: 'caseEvent',
        icon: faEdit,
        name: '事件标注',
        path: '/cases/{{=it.caseId}}/caseEvent',
      },
      // {
      //   name: '银行卡标注',
      //   path: '/cases/{{=it.caseId}}/labelbn',
      // },
      // {
      //   name: '网点标注',
      //   path: '/cases/{{=it.caseId}}/labelbb',
      // },
    ],
  },
  {
    name: '话单管理',
    path: '/PhoneBills',
    icon: faPhoneSquare,
    children: [
      {
        mkey:'pbFilesImport',
        icon: faUpload,
        name: '转换导入',
        path: '/cases/{{=it.caseId}}/pb_filesimport',
      },
      {
        mkey:'pbCasesImport',
        icon: faFileImport,
        name: '他案导入',
        path: '/cases/{{=it.caseId}}/pb_casesimport',
      },
      {
        mkey:'pbills',
        icon: faListAlt,
        name: '话单列表',
        path: '/cases/{{=it.caseId}}/pbills',
      },
      {
        mkey:'venNumbers',
        icon: faGlobe,
        name: '虚拟网',
        path: '/cases/{{=it.caseId}}/vennumbers',
      },
      {
        mkey:'relNumbers',
        icon: faNetworkWired,
        name: '亲情网',
        path: '/cases/{{=it.caseId}}/relnumbers',
      },
      {
        mkey:'caseBreakpoints',
        icon: faCalendarDay,
        name: '时间分割点',
        path: '/cases/{{=it.caseId}}/caseBreakpoints',
      },
      {
        mkey:'normalizeCT',
        icon: faBroadcastTower,
        name: '基站补正',
        path: '/cases/{{=it.caseId}}/normalizeCT',
      },
    ],
  },
  // {
  //   name: '账单数据',
  //   path: '/BankBills',
  //   icon: faYenSign,
  //   children: [
  //     {
  //       name: '文件导入',
  //       path: '/cases/{{=it.caseId}}/bb_filesimport',
  //     },
  //     {
  //       name: '案件导入',
  //       path: '/cases/{{=it.caseId}}/bb_casesimport',
  //     },
  //   ],
  // },
  {
    name: '基础分析',
    path: '/calls',
    icon: faEye,
    children: [
      {
        mkey: 'pbAnalyze',
        icon:faListUl,
        name: '话单浏览',
        path: '/cases/{{=it.caseId}}/pb_analyze',
      },
      {
        mkey:'pbStat',
        icon:faChartArea,
        name: '话单统计',
        path: '/cases/{{=it.caseId}}/pb_stat',
      },
      // {
      //   name: '账单分析',
      //   path: '/cases/{{=it.caseId}}/bb_analyze',
      // },
      // {
      //   name: '账单统计',
      //   path: '/cases/{{=it.caseId}}/bb_stat',
      // },
    ],
  },
  {
    name: '关系挖掘',
    path: '/RelAnalyze',
    icon: faUsers,
    children: [
      {
        mkey:'connections',
        icon:faConnectdevelop,
        name: '关系图',
        path: '/cases/{{=it.caseId}}/connections',
      },
      // {
      //   name: '关系判定',
      //   path: '/cases/{{=it.caseId}}/closedrel',
      // },
      {
        mkey:'matrix',
        icon:faBuromobelexperte,
        name: '矩阵关系',
        path: '/cases/{{=it.caseId}}/matrix',
      },
      {
        mkey:'inCommons',
        icon:faSearch,
        name: '号码碰撞',
        path: '/cases/{{=it.caseId}}/incommons',
      },
      {
        name: '集合运算',
        mkey: 'calcOnSets',
        path: '/cases/{{=it.caseId}}/calcOnSets',
      },
      {
        name: '交叉通话',
        mkey: 'overlap',
        path: '/cases/{{=it.caseId}}/overlap',
      },
    ],
  },
  {
    name: '基站分析',
    path: '/dashboard',
    icon: faWifi,
    children: [
      {
        mkey:'locCT',
        icon:faMapMarkerAlt,
        name: '基站定位',
        path: '/cases/{{=it.caseId}}/celltowerloc',
      },
      {
        mkey:'calltrack',
        icon:faRoute,
        name: '通话轨迹',
        path: '/cases/{{=it.caseId}}/calltrack',
      },
      // {
      //   name: '批量基站定位',
      //   path: '/',
      // },
      // {
      //   name: '自动碰撞',
      //   path: '/dashboard/17',
      // },
      {
        mkey:'meets',
        icon:faUserFriends,
        name: '互相碰面',
        path: '/cases/{{=it.caseId}}/meets',
      },
      {
        mkey:'backupNums',
        icon:faTheaterMasks,
        name: '伴随号码',
        path: '/cases/{{=it.caseId}}/BackupNums',
      },
    ],
  },
  // {
  //   name: '网点分析',
  //   path: '/dashboard2',
  //   icon: faMapMarkerAlt,
  //   children: [
  //     {
  //       name: '便捷工具',
  //       path: '/dashboard/29',
  //     },
  //   ],
  // },
  {
    name: '高级功能',
    path: '/dashboard',
    icon: faTools,
    children: [
      {
        mkey:'comboBills',
        icon:faCreativeCommonsSampling,
        name: '联合浏览',
        path: '/cases/{{=it.caseId}}/comboBills',
      },
      {
        mkey:'newNums',
        icon:faCreativeCommonsSampling,
        name: '新号搜索',
        path: '/cases/{{=it.caseId}}/newnums',
      },
      {
        mkey:'citizens',
        icon:faUsers,
        name: '人员库',
        path: '/cases/{{=it.caseId}}/citizens',
      },
      {
        mkey:'utilNums',
        icon:faListAlt,
        name: '特殊号码',
        path: '/cases/{{=it.caseId}}/pubServiceNums',
      },
    ],
  },
  {
    name: '系统管理',
    path: '/adminAccounts',
    icon: faCog,
    children: [
      {
        mkey:'localLicense',
        name: '许可证',
        path: '/localLicense',
        auth: false,
        isRoot: true
      },
      {
        mkey:'licenses',
        name: '许可证管理',
        path: '/Licenses',
        auth: false,
        isRoot: true,
        isSuperRoot: true
      },
      {
        mkey:'accounts',
        name: '用户管理',
        path: '/admin_accounts',
        auth: false,
        isRoot: true,
      },
      {
        mkey:'sysSettings',
        name: '系统设置',
        path: '/admin_settings',
        auth: false,
        controlled: true,
        isRoot: true
      },
      {
        mkey:'settings',
        icon:faUserCog,
        name: '个人设置',
        path: '/settings',
        auth: false
      },
      {
        mkey:'accessLogs',
        name: '日志审核',
        path: '/aduitLogs',
        auth: false,
        isRoot: true
      },
      {
        mkey:'apiTrack',
        name: '软件统计',
        path: '/trackApi',
        auth: false,
        isRoot: true
      },
      {
        mkey:'systemData',
        name: '数据管理',
        path: '/systemData',
        auth: false,
        isRoot: true
      }
    ],
  },
  // {
  //   name: '便捷工具',
  //   path: '/dashboard2',
  //   icon: 'link',
  //   children: [
  //     {
  //       name: '便捷工具',
  //       path: '/dashboard/29',
  //     },
  //   ],
  // },


  // {
  //   name: '图表页',
  //   path: '/chart',
  //   icon: 'chart1',
  //   children: [
  //     {
  //       name: '基础图表',
  //       path: '/chart/basic',
  //     },
  //     {
  //       name: '通用图表',
  //       path: '/chart/general',
  //     },
  //   ],
  // },
  // {
  //   name: '表格页',
  //   path: '/table',
  //   icon: 'table',
  //   children: [
  //     {
  //       name: '基础表格',
  //       path: '/table/basic',
  //       // authority: 'admin',
  //     },
  //     {
  //       name: '通用表格',
  //       path: '/table/general',
  //       // authority: 'user',
  //     },
  //   ],
  // },
  // {
  //   name: '列表页',
  //   path: '/list',
  //   icon: 'ul-list',
  //   children: [
  //     {
  //       name: '基础列表',
  //       path: '/list/basic',
  //     },
  //     {
  //       name: '卡片列表',
  //       path: '/list/card',
  //     },
  //   ],
  // },
  // {
  //   name: '内容页',
  //   path: '/portlets',
  //   icon: 'publish',
  //   children: [
  //     {
  //       name: '基础详情页',
  //       path: '/portlets/base',
  //     },
  //     {
  //       name: '条款协议页',
  //       path: '/portlets/terms',
  //     },
  //   ],
  // },
  // {
  //   name: '结果页',
  //   path: '/result',
  //   icon: 'result',
  //   children: [
  //     {
  //       name: '成功',
  //       path: '/result/success',
  //     },
  //     {
  //       name: '失败',
  //       path: '/result/fail',
  //     },
  //   ],
  // },
  // {
  //   name: '个人页',
  //   path: '/account',
  //   icon: 'yonghu',
  //   children: [
  //     {
  //       name: '个人设置',
  //       path: '/account/setting',
  //     },
  //   ],
  // },
  // {
  //   name: '异常页',
  //   path: '/exception',
  //   icon: 'gaojingxinxi',
  //   children: [
  //     {
  //       name: '204',
  //       path: '/exception/204',
  //     },
  //     {
  //       name: '403',
  //       path: '/exception/403',
  //     },
  //     {
  //       name: '404',
  //       path: '/exception/404',
  //     },
  //     {
  //       name: '500',
  //       path: '/exception/500',
  //     },
  //   ],
  // },
];

const casMenuConfig = [
  {
    name: '工作台',
    path: '/Workspace',
    icon: 'cascades',
    children: [
      {
        name: '我的工作台',
        path: '/iworkspace',
      },
    ],
  },
  {
    name: '案件管理',
    path: '/CaseMgnt',
    icon: 'copy',
    // authority: 'user',
    children: [
      {

        name: '号码标注',
        path: '/cases/{{=it.caseId}}/labelpn',
      },
      {
        name: '基站标注',
        path: '/cases/{{=it.caseId}}/labelct',
      },
    ],
  },
  {
    name: '话单数据',
    path: '/PhoneBills',
    icon: 'directory',
    children: [
      {
        name: '文件导入',
        path: '/cases/{{=it.caseId}}/pb_filesimport',
      },
      {
        name: '案件导入',
        path: '/cases/{{=it.caseId}}/pb_casesimport',
      },
      {
        name: '虚拟网',
        path: '/cases/{{=it.caseId}}/vennumbers',
      },
      {
        name: '亲情网',
        path: '/cases/{{=it.caseId}}/relnumbers',
      },
      {
        name: '数据管理',
        path: '/cases/{{=it.caseId}}/pbills',
      },
    ],
  },
  {
    name: '基础分析',
    path: '/calls',
    icon: 'eye',
    children: [
      {
        name: '话单分析',
        path: '/cases/{{=it.caseId}}/pb_analyze',
      },
      {
        name: '话单统计',
        path: '/cases/{{=it.caseId}}/pb_stat',
      },
      {
        name: '账单分析',
        path: '/cases/{{=it.caseId}}/bb_analyze',
      },
      {
        name: '账单统计',
        path: '/cases/{{=it.caseId}}/bb_stat',
      },
    ],
  },
  {
    name: '关系挖掘',
    path: '/dashboard',
    icon: 'fans',
    children: [
      {
        name: '关系图',
        path: '/cases/{{=it.caseId}}/connections',
      },
      {
        name: '多对象关系图',
        path: '/cases/{{=it.caseId}}/mutcontact',
      },
      {
        name: '关系判定',
        path: '/cases/{{=it.caseId}}/closedrel',
      },
      {
        name: '矩阵关系',
        path: '/cases/{{=it.caseId}}/matrix',
      },
      {
        name: '自动碰撞',
        path: '/cases/{{=it.caseId}}/newnumfind',
      },
      {
        name: '逻辑运算',
        path: '/dashboard/11',
      },
    ],
  },
  {
    name: '基站分析',
    path: '/dashboard',
    icon: 'material',
    children: [
      {
        name: '基站定位',
        path: '/cases/{{=it.caseId}}/celltowerloc',
      },
      {
        name: '基站补全',
        path: '/cases/{{=it.caseId}}/normalizeCT',
      },
      {
        name: '每日通话轨迹',
        path: '/cases/{{=it.caseId}}/calltrack',
      },
      {
        name: '批量基站定位',
        path: '/',
      },
      {
        name: '自动碰撞',
        path: '/dashboard/17',
      },
      {
        name: '互相碰面',
        path: '/cases/{{=it.caseId}}/meetanalyze',
      },
      {
        name: '伴随号码',
        path: '/cases/{{=it.caseId}}/follownums',
      },
    ],
  },
  {
    name: '网点分析',
    path: '/dashboard2',
    icon: 'link',
    children: [
      {
        name: '便捷工具',
        path: '/dashboard/29',
      },
    ],
  },
  {
    name: '高级功能',
    path: '/dashboard',
    icon: 'repair',
    children: [
      {
        name: '新号搜索',
        path: '/',
      },
      {
        name: '交叉通话',
        path: '/cases/{{=it.caseId}}/commcrossedtime',
      },
      {
        name: '一致通话',
        path: '/cases/{{=it.caseId}}/commsametime',
      },
      {
        name: '综合查询',
        path: '/aduitedquery',
      },
      {
        name: 'IMEI管理',
        path: '/dashboard/24',
      },
      {
        name: '服务信息',
        path: '/dashboard/25',
      },
    ],
  },
  // {
  //   name: '便捷工具',
  //   path: '/dashboard2',
  //   icon: 'link',
  //   children: [
  //     {
  //       name: '便捷工具',
  //       path: '/dashboard/29',
  //     },
  //   ],
  // },


  // {
  //   name: '图表页',
  //   path: '/chart',
  //   icon: 'chart1',
  //   children: [
  //     {
  //       name: '基础图表',
  //       path: '/chart/basic',
  //     },
  //     {
  //       name: '通用图表',
  //       path: '/chart/general',
  //     },
  //   ],
  // },
  // {
  //   name: '表格页',
  //   path: '/table',
  //   icon: 'table',
  //   children: [
  //     {
  //       name: '基础表格',
  //       path: '/table/basic',
  //       // authority: 'admin',
  //     },
  //     {
  //       name: '通用表格',
  //       path: '/table/general',
  //       // authority: 'user',
  //     },
  //   ],
  // },
  // {
  //   name: '列表页',
  //   path: '/list',
  //   icon: 'ul-list',
  //   children: [
  //     {
  //       name: '基础列表',
  //       path: '/list/basic',
  //     },
  //     {
  //       name: '卡片列表',
  //       path: '/list/card',
  //     },
  //   ],
  // },
  // {
  //   name: '内容页',
  //   path: '/portlets',
  //   icon: 'publish',
  //   children: [
  //     {
  //       name: '基础详情页',
  //       path: '/portlets/base',
  //     },
  //     {
  //       name: '条款协议页',
  //       path: '/portlets/terms',
  //     },
  //   ],
  // },
  // {
  //   name: '结果页',
  //   path: '/result',
  //   icon: 'result',
  //   children: [
  //     {
  //       name: '成功',
  //       path: '/result/success',
  //     },
  //     {
  //       name: '失败',
  //       path: '/result/fail',
  //     },
  //   ],
  // },
  // {
  //   name: '个人页',
  //   path: '/account',
  //   icon: 'yonghu',
  //   children: [
  //     {
  //       name: '个人设置',
  //       path: '/account/setting',
  //     },
  //   ],
  // },
  // {
  //   name: '异常页',
  //   path: '/exception',
  //   icon: 'gaojingxinxi',
  //   children: [
  //     {
  //       name: '204',
  //       path: '/exception/204',
  //     },
  //     {
  //       name: '403',
  //       path: '/exception/403',
  //     },
  //     {
  //       name: '404',
  //       path: '/exception/404',
  //     },
  //     {
  //       name: '500',
  //       path: '/exception/500',
  //     },
  //   ],
  // },
];

const tasMenuConfig = [
  {
    name: '工作台',
    path: '/Workspace',
    icon: faBriefcase,
    children: [
      {
        mkey: 'iWorkspace',
        name: '我的工作台',
        path: '/iworkspace',
        icon: faDesktop,
        auth: false,
      },
    ],
  },
  {
    name: '案件管理',
    path: '/CaseMgnt',
    icon: faBook,
    // authority: 'user',
    children: [
      {
        mkey:'overview',
        icon: faClipboardList,
        name: '案件概览',
        path: '/cases/{{=it.caseId}}/bbills/overview',
      },
      {
        mkey:'acctLabels',
        icon: faBookmark,
        name: '账户标注',
        path: '/cases/{{=it.caseId}}/bbills/acctLabels',
      },
      {
        mkey:'trxLocLabels',
        icon: faMapMarkedAlt,
        name: '网点标注',
        path: '/cases/{{=it.caseId}}/bbills/trxLocLabels',
      },
      {
        mkey: 'caseEvent',
        icon: faEdit,
        name: '事件标注',
        path: '/cases/{{=it.caseId}}/caseEvent',
      },
    ],
  },
  {
    name: '账单管理',
    path: '/PhoneBills',
    icon: faCreditCard,
    children: [
      {
        mkey:'bbills.filesImport',
        icon: faFileArchive,
        name: '转换导入',
        path: '/cases/{{=it.caseId}}/bbills/filesImport',
      },
      // {
      //   mkey:'bbills.casesImport',
      //   icon: faFileImport,
      //   name: '他案导入',
      //   path: '/cases/{{=it.caseId}}/bbills/casesImport',
      // },
      {
        mkey:'bbills.list',
        icon: faTh,
        name: '账单列表',
        path: '/cases/{{=it.caseId}}/bbills',
      },
      {
        mkey:'caseBreakpoints',
        icon: faCalendarDay,
        name: '时间分割点',
        path: '/cases/{{=it.caseId}}/caseBreakpoints',
      },
      {
        mkey:'bbills.bins',
        icon: faCreditCard,
        name: '银行卡标识',
        path: '/cases/{{=it.caseId}}/bbills/bins',
      },
      {
        mkey:'bbills.currencyPairs',
        icon: faCreditCard,
        name: '外币汇率',
        path: '/cases/{{=it.caseId}}/bbills/currencyPairs',
      },
    ],
  },
  {
    name: '基础分析',
    path: '/calls',
    icon: faEye,
    children: [
      {
        mkey: 'bbills.analyze',
        icon:faFileInvoiceDollar,
        name: '账单浏览',
        path: '/cases/{{=it.caseId}}/bbills/analyze',
      },
      // {
      //   mkey:'bbills.balance',
      //   icon:faChartLine,
      //   name: '收支分析',
      //   path: '/cases/{{=it.caseId}}/bbills/balance',
      // },
      {
        mkey:'bbills.stat',
        icon:faChartPie,
        name: '账单统计',
        path: '/cases/{{=it.caseId}}/bbills/reports',
      },
    ],
  },
  {
    name: '收支分析',
    path: '/cashAnalyze',
    icon: faSearchDollar,
    children: [
      {
        mkey: 'bbills.cashTrends',
        icon:faChartLine,
        name: '收支趋势',
        path: '/cases/{{=it.caseId}}/bbills/cashTrends',
      },
      {
        mkey:'bbills.cashAcc',
        icon:faChartArea,
        name: '累计收支',
        path: '/cases/{{=it.caseId}}/bbills/cashAcc',
      },
      {
        mkey:'bbills.blsOverview',
        icon:faHandHoldingUsd,
        name: '资产概况',
        path: '/cases/{{=it.caseId}}/bbills/blsOverview',
      },
    ],
  },
  {
    name: '关系挖掘',
    path: '/RelAnalyze',
    icon: faUsers,
    children: [
      {
        mkey:'bbConnections',
        icon:faConnectdevelop,
        name: '关系图',
        path: '/cases/{{=it.caseId}}/bbills/connections',
      },
      {
        mkey:'bbmatrix',
        icon:faBuromobelexperte,
        name: '矩阵关系',
        path: '/cases/{{=it.caseId}}/bbills/matrix',
      },
      {
        mkey:'bbInCommons',
        icon:faSearch,
        name: '交易碰撞',
        path: '/cases/{{=it.caseId}}/bbills/inCommons',
      },
      {
        name: '时序分析',
        mkey: 'tsAnalyze',
        path: '/cases/{{=it.caseId}}/bbills/tsAnalyze',
      },
      {
        name: '资金流向',
        mkey: 'cashFlow',
        path: '/cases/{{=it.caseId}}/bbills/cashFlow',
      },
    ],
  },
  {
    name: '网点分析',
    path: '/dashboard',
    icon: faWifi,
    children: [
      {
        mkey:'trxMap',
        icon:faMapMarkerAlt,
        name: '交易地图',
        path: '/cases/{{=it.caseId}}/bbills/trxMap',
      },
      {
        mkey:'backupAccts',
        icon:faRoute,
        name: '伴随账号',
        path: '/cases/{{=it.caseId}}/bbills/backupAccts',
      },
    ],
  },
  {
    name: '高级功能',
    path: '/dashboard',
    icon: faTools,
    children: [
      {
        mkey:'comboBills',
        icon:faCreativeCommonsSampling,
        name: '联合浏览',
        path: '/cases/{{=it.caseId}}/comboBills',
      },
    ],
  },
  {
    name: '系统管理',
    path: '/adminAccounts',
    icon: faCog,
    children: [
      {
        mkey:'localLicense',
        name: '许可证',
        path: '/localLicense',
        auth: false,
        isRoot: true
      },
      {
        mkey:'licenses',
        name: '许可证管理',
        path: '/Licenses',
        auth: false,
        isRoot: true,
        isSuperRoot: true
      },
      {
        mkey:'accounts',
        name: '用户管理',
        path: '/admin_accounts',
        auth: false,
        isRoot: true,
      },
      {
        mkey:'sysSettings',
        name: '系统设置',
        path: '/admin_settings',
        auth: false,
        controlled: true,
        isRoot: true
      },
      {
        mkey:'settings',
        icon:faUserCog,
        name: '个人设置',
        path: '/settings',
        auth: false
      },
      {
        mkey:'accessLogs',
        name: '日志审核',
        path: '/aduitLogs',
        auth: false,
        isRoot: true
      },
      {
        mkey:'apiTrack',
        name: '软件统计',
        path: '/trackApi',
        auth: false,
        isRoot: true
      },
      {
        mkey:'systemData',
        name: '数据管理',
        path: '/systemData',
        auth: false,
        isRoot: true
      }
    ],
  },
];

export {headerMenuConfig, asideMenuConfig, casMenuConfig, tasMenuConfig};
