import { GET_OWNER_NUMS, GET_PBANALYZE, GET_PEER_NUMS, FETCH_MYSEARCH, DELETE_MYSEARCH, CREATE_MYSEARCH, SET_LOADING, CREATE_TABITEM, DELETE_TABITEM, DELETE_EXT, TOGGLE_TABLE } from './constants';

const initialState = {
  items: [],
  ownerNums: [],
  peerNums: [],
  mySearchs: [],
  isFetching: false,
  lastUpdated: 0,
  didInvalidate: true,
  // GET props
  item: null,
  isFetchingItem: false,
  lastUpdatedItem: 0,
  didInvalidateItem: true,
  // CREATE props
  isCreating: false,
  // UPDATE props
  isUpdating: false,
  isUpdatingMany: false,
  // DELETE props
  isDeleting: false,
  isDeletingMany: false,
  isLoading: false,
  tabPanes: [{ tab: '话单浏览', closeable: false, key: "0" }],
  showSimplePbillRecordList: false,
  simplePbillRecordListParams: null
};

export function PBAnalyzeReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PBANALYZE:
      return {
        ...state,
        items: action.state,
        last_alyz_day: action.last_alyz_day,
        ext: action.ext
      };
    case GET_OWNER_NUMS:
      return {
        ...state,
        ownerNums: action.payload.data,
      };
    case GET_PEER_NUMS:
      return {
        ...state,
        peerNums: action.payload.data,
      };
    case FETCH_MYSEARCH:
      return {
        ...state,
        mySearchs: action.payload.data,
      };
    case DELETE_MYSEARCH:
      // action.payload.id
      return {
        ...state,
        // mySearchs: action.payload.data,
      };
    case CREATE_MYSEARCH:
      const newMySearchs = [...state.mySearchs];
      newMySearchs.unshift(action.payload);
      return {
        ...state,
        mySearchs: newMySearchs,
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      }
    case CREATE_TABITEM:
      return {
        ...state,
        tabPanes: [...state.tabPanes, action.payload]
      }
    case DELETE_TABITEM:
      state.tabPanes.forEach((item, index) => {
        if (item.key === action.payload) {
          state.tabPanes.splice(index, 1)
        }
      })
    case DELETE_EXT:
      return {
        ...state,
        ext: action.ext
      }
    case TOGGLE_TABLE:
      return {
        ...state,
        showSimplePbillRecordList: action.bool,
        simplePbillRecordListParams: action.params
      }
    default:
    // {...state,state2:action.state2}
      return state;
  }
}
