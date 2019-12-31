import NotFound from './pages/NotFound';
import Empty from './pages/Empty';
import Forbidden from './pages/Forbidden';
import ServerError from './pages/ServerError';
import CaseEvent from './pages/CaseEvent';
import CaseBreakpoint from './pages/CaseBreakpoint';
import IWorkspace from './pages/IWorkspace';
import BBCaseOverview from './pages/bbills/BBCaseOverview';
import UserLogin from './pages/UserLogin/components/CreativeLogin';
import Reload from './pages/Reload';
import BBFilesImport from './pages/bbills/BBFilesImport';
import BBAnalyze from './pages/bbills/BBAnalyze';
import BBReports from './pages/bbills/BBReports';
import BankAcctLabels from './pages/bbills/BankAcctLabels';
import TrxLocLabels from './pages/bbills/TrxLocLabels';
import BBCasesImport from './pages/bbills/BBCasesImport';
import Bbills from './pages/bbills/Bbills';
import CaseBreakpoints from './pages/CaseBreakpoint';
import BBConnections from './pages/bbills/BBConnections';
import BBMatrix from './pages/bbills/BBMatrix';
import BBInCommons from './pages/bbills/BBInCommons';
import TsAnalyze from './pages/bbills/TsAnalyze';
import CashFlow from './pages/bbills/CashFlow';
import TrxMap from './pages/bbills/TrxMap';
import BackupAccts from './pages/bbills/BackupAccts';
import BbBalance from './pages/bbills/BBBalance';


import { getRouterData } from './utils/utils';
import { tasMenuConfig } from './menuConfig';
import LocalLicense from './pages/LocalLicense';
import Licenses from './pages/Licenses';
import AdminAccounts from './pages/AdminAccounts';
import SystemSetting from './pages/SystemSettings';
import Seetings from './pages/Setting/components/BaseSetting';
import AduitLogs from './pages/AduitLogs';
import TrackApi from './pages/TrackApi';
import SystemData from './pages/SystemData';
import ComboBills from './pages/ComboBills';
import Bins from './pages/bbills/Bins'
import CashTrends from './pages/bbills/CashTrends'
import CashAcc from './pages/bbills/CashAcc'
import BalanceOverview from './pages/bbills/BalanceOverview'
import CurrencyPairs from './pages/bbills/CurrencyPairs'

const routerConfig = [
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
    path: '/iworkspace',
    component: IWorkspace,
  },
  {
    path: '/cases/:caseId/caseEvent',
    component: CaseEvent,
  },
  {
    path: '/reload',
    component: Reload,
  },
  // 案件管理
  {
    path: '/cases/:caseId/bbills/overview',
    component: BBCaseOverview,
  },
  {
    path: '/cases/:caseId/bbills/acctLabels',
    component: BankAcctLabels,
  },
  {
    path: '/cases/:caseId/bbills/trxLocLabels',
    component: TrxLocLabels,
  },
  {
    path: '/cases/:caseId/caseEvent',
    component: CaseEvent,
  },
  // 账单管理
  {
    path: '/cases/:caseId/bbills/filesImport',
    component: BBFilesImport,
  },
  {
    path: '/cases/:caseId/bbills/casesImport',
    component: BBCasesImport,
  },
  {
    path: '/cases/:caseId/bbills',
    component: Bbills,
    exact: true
  },
  {
    path: '/cases/:caseId/caseBreakpoints',
    component: CaseBreakpoints,
  },
  {
    path: '/cases/:caseId/bbills/bins',
    component: Bins,
  },

  // 基础分析
  {
    path: '/cases/:caseId/bbills/analyze',
    component: BBAnalyze,
  },
  {
    path: '/cases/:caseId/bbills/reports',
    component: BBReports,
  },
//  关系挖掘
  {
    path: '/cases/:caseId/bbills/connections',
    component: BBConnections,
  },
  {
    path: '/cases/:caseId/bbills/matrix',
    component: BBMatrix,
  },
  {
    path: '/cases/:caseId/bbills/inCommons',
    component: BBInCommons,
  },
  {
    path: '/cases/:caseId/bbills/tsAnalyze',
    component: TsAnalyze,
  },
  {
    path: '/cases/:caseId/bbills/cashFlow',
    component: CashFlow,
  },
  // 网点分析
  {
    path: '/cases/:caseId/bbills/trxMap',
    component: TrxMap,
  },
  {
    path: '/cases/:caseId/bbills/backupAccts',
    component: BackupAccts,
  },
  {
    path: '/localLicense',
    component: LocalLicense
  },
  {
    path:'/Licenses',
    component:Licenses
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
    path:'/aduitLogs',
    component:AduitLogs
  },
  {
    path:'/trackApi',
    component:TrackApi
  },
  {
    path: '/systemData',
    component: SystemData
  },
  {
    path: '/cases/:caseId/comboBills',
    component: ComboBills
  },
  {
    path: '/cases/:caseId/bbills/cashTrends',
    component: CashTrends
  },
  {
    path: '/cases/:caseId/bbills/cashAcc',
    component: CashAcc
  },
  {
    path: '/cases/:caseId/bbills/blsOverview',
    component: BalanceOverview
  },
  {
    path: '/cases/:caseId/bbills/currencyPairs',
    component: CurrencyPairs
  }
];
const bbasRouterData = getRouterData(routerConfig, tasMenuConfig);

export { bbasRouterData };
