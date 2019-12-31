/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { LOCATION_CHANGE } from 'react-router-redux';
import { rootReducer as relNumberReducer } from './stores/RelNumbers';
import { rootReducer as caseEventReducer } from './stores/caseEvent';
import { rootReducer as LabelPNReducer } from './stores/labelPN';
import { rootReducer as LabelCellReducer } from './stores/labelCell';
import { rootReducer as userAdminsReducer } from './stores/adminAccounts';
import { rootReducer as systemSettingsReducer } from './stores/systemSettings';
import { rootReducer as settingsReducer } from './stores/setting';
import { rootReducer as pbFilesImportReducer } from './stores/pbFilesImport';
import { rootReducer as pbStatImportReducer } from './stores/pbStat';
import { rootReducer as ownerNumReducer } from './stores/pbStat/ownerNum';
import { rootReducer as codeAndstartedtimel2Reducer } from './stores/pbStat/codeAndstartedtimel2Class';
import { rootReducer as relatedReducer } from './stores/pbStat/related';
import { rootReducer as SearchStoreReducer } from './stores/SearchStore';
import { rootReducer as CaseBreakpointReducer } from './stores/caseBreakpoint';
import { rootReducer as CitizensReducer } from './stores/citizens';
import { rootReducer as CalltrackReducer } from './stores/calltrack';
import { rootReducer as BSSearchReducer } from './stores/bsSearch';
import { rootReducer as caseOverviewReducer } from './stores/caseOverview';
import { rootReducer as CasesImportReducer } from './stores/CasesImport';
import { rootReducer as LicensesReducer } from './stores/localLicenses';
import { rootReducer as ConnectionsReducer } from './stores/connections';
import { rootReducer as FindNewsReducer } from './stores/FindNews';
import { rootReducer as AduitLogsReducer } from './stores/AduitLogs';
import { rootReducer as PbillsReducer } from './stores/Pbills';
import { rootReducer as superLicensesReducer } from './stores/Licenses';
import { rootReducer as inCommonsListReducer } from './stores/inCommonsList';
import { rootReducer as normalizeCTReducer } from './stores/NormalizeCT';
import { rootReducer as mutualReducer } from './stores/mutual';
import { rootReducer as PubServiceNumsReducer } from './stores/PubServiceNums';
import { rootReducer as MatrixListReducer } from './stores/MatrixList';
import { rootReducer as SystemDataReducer } from './stores/SystemData';
import { rootReducer as CalcOnSetsReducer } from './stores/calcOnSets';
import { rootReducer as ComboBillsReducer } from './stores/comboBills';
import { PBAnalyzeReducer } from './stores/simplePbillRecordList/reducer';
import { BbDrilldownList } from './bbStores/bbDrilldownList/reducer';




// 账单组件
import {rootReducer as bbFilesImportReducer} from './bbStores/bbFilesImport'
import {rootReducer as bbillsReducer} from './bbStores/bbills'
import {rootReducer as bbSearchStoreReducer} from './bbStores/bbSearchStore'
import {rootReducer as bbAnalyzeReducer} from './bbStores/bbAnalyze'
import {rootReducer as bbBalanceReducer} from './bbStores/bbBalance'
import {rootReducer as peeracctandtrxamtclassReducer} from './bbStores/bbStat/GroupByPeeracctandtrxamtclass'

import { rootReducer as Peeracctandtrxtimel1classandhourReducer} from './bbStores/bbStat/GroupByPeeracctandtrxtimel1classandhour'//小胡加的

import {rootReducer as peeracctandtrxtimel1classReducer} from './bbStores/bbStat/GroupByPeeracctandtrxtimel1class'
import {rootReducer as trxclassReducer} from './bbStores/bbStat/GroupByTrxclass'
import {rootReducer as trxamtclassReducer} from './bbStores/bbStat/GroupByTrxAmtClass'
import {rootReducer as trxchannelReducer} from './bbStores/bbStat/GroupByTrxChannel'
import {rootReducer as peeracctReducer} from './bbStores/bbStat/GroupByPeeracct'
import {rootReducer as owneracctReducer} from './bbStores/bbStat/GroupByOwneracct'
import {rootReducer as owneracctandtrxamtclassReducer} from './bbStores/bbStat/GroupByOwneracctandtrxamtclass'
import {rootReducer as owneracctandtrxtimel1classReducer} from './bbStores/bbStat/GroupByOwneracctandtrxtimel1class'
import {rootReducer as groupByDigestReducer} from './bbStores/bbStat/GroupByDigest'
import {rootReducer as binsReducer} from './bbStores/Bins'
import {rootReducer as groupByBranchnumReducer} from './bbStores/bbStat/GroupByBranchnum'
import {rootReducer as groupByTellerReducer} from './bbStores/bbStat/GroupByTeller'
import {rootReducer as GroupByBranchNumAndHour} from './bbStores/bbStat/GroupByBranchNumAndHour'
import {rootReducer as GroupByTrxTimeL1Class} from './bbStores/bbStat/GroupByTrxTimeL1Class'
import {rootReducer as GroupByTrxHourClass} from './bbStores/bbStat/GroupByTrxHourClass'
import {rootReducer as GroupByBranchNumAndTimeL1} from './bbStores/bbStat/GroupByBranchNumAndTimeL1'
import {rootReducer as GroupByTellerAndTimeL1} from './bbStores/bbStat/GroupByTellerAndTimeL1'
import {rootReducer as GroupByTellerAndHour} from './bbStores/bbStat/GroupByTellerAndHour'
import {rootReducer as GroupByTrxDay} from './bbStores/bbStat/GroupByTrxDay'
import {rootReducer as GroupByTrxDayAndTimeL1} from './bbStores/bbStat/GroupByTrxDayAndTimeL1'
import {rootReducer as CurrencyPairs} from './bbStores/CurrencyPairs'
import {rootReducer as BBGlobalLabel} from './bbStores/BBGlobalLabel'
import {rootReducer as bankAcctLabels} from './bbStores/bankAcctLabels'
import {rootReducer as TrxLocLabels} from './bbStores/TrxLocLabels'
import {rootReducer as trxamtclassandtrxtimel1class} from './bbStores/bbStat/Trxamtclassandtrxtimel1class'
import {rootReducer as GroupByWeekday} from './bbStores/bbStat/GroupByWeekday'




/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@5
 *
 */

// Initial routing state
const routeInitialState = {
  location: null,
};

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return Object.assign({}, state, { location: action.payload });
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
  return combineReducers({
    route: routeReducer,
    relNumbers: relNumberReducer,
    caseEvents: caseEventReducer,
    labelPNs: LabelPNReducer,
    labelCells: LabelCellReducer,
    userAdmins: userAdminsReducer,
    systemSettings: systemSettingsReducer,
    setting: settingsReducer,
    pbFileImps: pbFilesImportReducer,
    pbStat: pbStatImportReducer,
    ownerNums: ownerNumReducer,
    codeAndstartedtimel2Class: codeAndstartedtimel2Reducer,
    relateds: relatedReducer,
    search: SearchStoreReducer,
    caseBreakpoints: CaseBreakpointReducer,
    citizens: CitizensReducer,
    cellTowers: CalltrackReducer,
    bsSearchs: BSSearchReducer,
    caseOverviews: caseOverviewReducer,
    caseImports: CasesImportReducer,
    licenses: LicensesReducer,
    superLicenses: superLicensesReducer,
    connections: ConnectionsReducer,
    findNews: FindNewsReducer,
    aduitLogs: AduitLogsReducer,
    pbills: PbillsReducer,
    inCommonsList: inCommonsListReducer,
    normalizeCT:normalizeCTReducer,
    mutuals: mutualReducer,
    pubServiceNums:PubServiceNumsReducer,
    matrixs:MatrixListReducer,
    systemData:SystemDataReducer,
    SimplePbillRecordList: PBAnalyzeReducer,
    calcOnSets: CalcOnSetsReducer,

    //账单stores
    bbFileImps: bbFilesImportReducer,
    bbills: bbillsReducer,
    bbSearchs: bbSearchStoreReducer,
    bbAnalyzes: bbAnalyzeReducer,
    comboBills: ComboBillsReducer,
    bbBalances: bbBalanceReducer,
    peeracctandtrxamtclass:peeracctandtrxamtclassReducer,


    Peeracctandtrxtimel1classandhour: Peeracctandtrxtimel1classandhourReducer,//小胡写的

    peeracctandtrxtimel1class:peeracctandtrxtimel1classReducer,
    trxclass:trxclassReducer,
    trxamtclass:trxamtclassReducer,
    trxchannel:trxchannelReducer,
    peeracct:peeracctReducer,
    owneracct:owneracctReducer,
    owneracctandtrxamtclass:owneracctandtrxamtclassReducer,
    owneracctandtrxtimel1class:owneracctandtrxtimel1classReducer,
    groupByDigests: groupByDigestReducer,
    bins:binsReducer,
    branchnums: groupByBranchnumReducer,
    tellers: groupByTellerReducer,
    branchNumAndHours: GroupByBranchNumAndHour,
    trxTimeL1Class: GroupByTrxTimeL1Class,
    trxHourClass: GroupByTrxHourClass,
    branchNumAndTimeL1: GroupByBranchNumAndTimeL1,
    tellerandtimel1: GroupByTellerAndTimeL1,
    tellerandhours: GroupByTellerAndHour,
    trxdays: GroupByTrxDay,
    currencyPairs: CurrencyPairs,
    globalLabels: BBGlobalLabel,
    trxDayAndTimeL1: GroupByTrxDayAndTimeL1,
    bankAcctLables: bankAcctLabels,
    bbDrilldownList: BbDrilldownList,
    trxLocLables: TrxLocLabels,
    trxamtclassandtrxtimel1class: trxamtclassandtrxtimel1class,
    weekdays: GroupByWeekday,
    ...injectedReducers,
  });
}
