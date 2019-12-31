/*
 * LoginReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { CREATE_CASE, FETCH_CASES, UPDATE_CASE, GET_CASE, GET_ARCHIVED_CASES, GET_ACTIVE_CASES, SET_LOADING, TOGGLE_NAV, SET_CASE,REMOVE_CASE, CLEAR_CASE } from './constants';

// The initial state of the login
const initialState = {
  isLoading: false,
  meta: {},
  // FETCH props
  items: [],
  case: {},
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
  pageSize: 7,
  iconOnly: false,
  caseStatus: 0
};

function CasesReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CASES:
      state.items = action.data.data;
      state.meta = action.data.meta;
      state.case = action.data.case || state.case;
      state.caseStatus = 2
      return {
        ...state,
      };
    case SET_CASE:
      return {
        ...state,
        case: action.data,
      };
    case CREATE_CASE:
      const temp = { ...state };
      temp.items.unshift(action.data);
      return temp;
    case UPDATE_CASE:
      const items = [...state.items];
      items.forEach((item, index) => {
        if (item.id === action.data.id) {
          items[index] = action.data;
        }
      })
      return {
        ...state,
        items,
      };
    case GET_CASE:
      return {
        ...state,
        items: action.data.data,
        meta: action.data.meta,
      };
    case GET_ACTIVE_CASES:
      state.caseStatus = 0
      return {
        ...state,
        items: action.data.data,
        meta: action.data.meta,
      };
    case GET_ARCHIVED_CASES:
      state.caseStatus = 1
      return {
        ...state,
        items: action.data.data,
        meta: action.data.meta,
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      }
    case TOGGLE_NAV:
      return {
        ...state,
        iconOnly: !state.iconOnly,
      }
    case REMOVE_CASE:
      return{
        ...state
      };
    case CLEAR_CASE:
      return initialState
    default:
      return state;
  }
}

export default CasesReducer;
