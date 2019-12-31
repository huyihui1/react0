// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import { getRouterData } from './utils/utils';
import { asideMenuConfig } from './menuConfig';

import UserLogin from './pages/UserLogin/components/CreativeLogin';
import UserRegister from './pages/UserRegister';
// import Dashboard from './pages/Dashboard';
// import Charts from './pages/Charts';
// import BaiscCharts from './pages/BaiscCharts';
// import Portlets from './pages/Portlets';
// import Terms from './pages/Terms';
// import Result from './pages/Result';
import Empty from './pages/Empty';
// import BasicList from './pages/BasicList';
// import CardList from './pages/CardList';
// import BasicTable from './pages/BasicTable';
// import GeneralTable from './pages/GeneralTable';
import Profile from './pages/Profile';
// import Setting from './pages/Setting';
import NotFound from './pages/NotFound';
// import Fail from './pages/Fail';
import ServerError from './pages/ServerError';
import Forbidden from './pages/Forbidden';

import IWorkspace from './pages/IWorkspace';
import CaseOverview from './pages/CaseOverview';
// import NewCase from './pages/NewCase'; //案件录入
import Pb_Analyze from './pages/PBAnalyze'; //话单浏览
import PBStat from './pages/PBStat';
import LabelPN from './pages/LabelPN';
import LabelCell from './pages/LabelCell';
import CaseEvent from './pages/CaseEvent';
import CaseBreakpoint from './pages/CaseBreakpoint';
import Citizens from './pages/Citizens';
import FilesImport from './pages/FilesImport';
import CasesImport from './pages/CasesImport';
import Vennumbers from './pages/VENNumbers';
import RelNumbers from './pages/RelNumbers';
import BSSearch from './pages/BSSearch';
import Connection from './pages/Connections';
import AdminAccounts from './pages/AdminAccounts';
import SystemSetting from './pages/SystemSettings';
import Seetings from './pages/Setting/components/BaseSetting/index';
import SystemData from './pages/SystemData'
import LocalLicense from './pages/LocalLicense';
import Licenses from './pages/Licenses';
import Calltrack from './pages/Calltrack';
import BackupNums from './pages/BackupNums';
import NormalizeCT from './pages/NormalizeCT'
import InCommons from './pages/InCommons';
import Meetanalyze from './pages/Meetanalyze';
import NewNums from './pages/NewNums'
import AduitLogs from "./pages/AduitLogs";
import TrackApi from "./pages/TrackApi";
import Pbills from './pages/Pbills';
import PubServiceNums from './pages/PubServiceNums'
import Matrix from './pages/Matrix'

import Mutual from './pages/Mutual';
import Reload from './pages/Reload';
import CalcOnSets from './pages/CalcOnSets';
import Overlap from './pages/Overlap';
import ComboBills from './pages/ComboBills';


const routerConfig = [
  /*
  {
    path: '/portlets/base',
    component: Portlets,
  },
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/chart/general',
    component: Charts,
  },
  {
    path: '/chart/basic',
    component: BaiscCharts,
  },
  {
    path: '/list/basic',
    component: BasicList,
  },
  {
    path: '/list/card',
    component: CardList,
  },
  {
    path: '/result/success',
    component: Result,
  },
  {
    path: '/result/fail',
    component: Fail,
  },
  {
    path: '/table/basic',
    component: BasicTable,
  },
  {
    path: '/portlets/terms',
    component: Terms,
  },
  {
    path: '/table/general',
    component: GeneralTable,
  },
  */
  {
    path: '/account/profile',
    component: Profile,
  },
  // {
  //   path: '/account/setting',
  //   component: Setting,
  // },
  {
    path: '/exception/500',
    component: ServerError,
  },
  {
    path: '/exception/403',
    component: Forbidden,
  },
  {
    path: '/exception/204',
    component: Empty,
  },
  {
    path: '/exception/404',
    component: NotFound,
  },
  {
    path: '/user/login',
    component: UserLogin,
  },
  {
    path: '/user/register',
    component: UserRegister,
  },

  {
    path: '/iworkspace',
    component: IWorkspace,
  },
  {
    path: '/cases/:caseId/overview',
    component: CaseOverview,
  },
  {
    path: '/cases/:caseId/labelpn',
    component: LabelPN,
  },
  {
    path: '/cases/:caseId/labelct',
    component: LabelCell,
  },
  {
    path: '/cases/:caseId/caseEvent',
    component: CaseEvent,
  },
  {
    path: '/cases/:caseId/caseBreakpoints',
    component: CaseBreakpoint,
  },
  {
    path: '/cases/:caseId/citizens',
    component: Citizens,
  },
  {
    path: '/cases/:caseId/pb_filesimport',
    component: FilesImport,
  },
  {
    path: '/cases/:caseId/pb_casesimport',
    component: CasesImport,
  },
  {
    path: '/cases/:caseId/pb_analyze',
    component: Pb_Analyze,
  },
  {
    path: '/cases/:caseId/pb_stat',
    component: PBStat,
  },
  {
    path: '/cases/:caseId/vennumbers',
    component: Vennumbers,
  },
  {
    path: '/cases/:caseId/relnumbers',
    component: RelNumbers,
  },
  {
    path: '/cases/:caseId/celltowerloc',
    component: BSSearch,
  },

  {
    path: '/cases/:caseId/connections',
    component: Connection,
  },
  {
    path: '/admin_accounts',
    component: AdminAccounts,
  },
  {
    path: '/admin_settings',
    component: SystemSetting,
  },
  {
    path: '/settings',
    component: Seetings
  },
  {
    path: '/systemData',
    component: SystemData
  },
  {
    path: '/localLicense',
    component: LocalLicense
  },
  {
    path: '/cases/:caseId/calltrack',
    component: Calltrack,
  },
  {
    path: '/cases/:caseId/BackupNums',
    component: BackupNums,
  },
  {
    path:'/cases/:caseId/normalizeCT',
    component:NormalizeCT
  },
  {
    path: '/cases/:caseId/incommons',
    component: InCommons,
  },
  {
    path: '/cases/:caseId/meets',
    component: Meetanalyze,
  },
  {
    path: '/cases/:caseId/newnums',
    component: NewNums,
  },
  {
    path:'/aduitLogs',
    component:AduitLogs
  },
  {
    path:'/trackApi',
    component:TrackApi
  },
  {
    path:'/cases/:caseId/pbills',
    component:Pbills,
    exact: true
  },
  {
    path:'/Licenses',
    component:Licenses
  },
  {
    path: '/cases/:caseId/pbills/mutual',
    component: Mutual
  },
  {
    path:'/cases/:caseId/pubServiceNums',
    component:PubServiceNums
  },
  {
    path:'/cases/:caseId/matrix',
    component: Matrix
  },
  {
    path:'/reload',
    component: Reload
  },
  {
    path: '/cases/:caseId/calcOnSets',
    component: CalcOnSets
  },
  {
    path: '/cases/:caseId/overlap',
    component: Overlap
  },
  {
    path: '/cases/:caseId/comboBills',
    component: ComboBills
  }
];

const routerData = getRouterData(routerConfig, asideMenuConfig);

export { routerData };
