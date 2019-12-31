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
import {
  CREATE_VENNUM,
  FETCH_VENNUMS,
  SET_VENNUM,
  DELETE_VENNUM,
  UPDATE_VENNUM,
  SET_LOADING,
  GET_VENNUM,
  CHANGE_SHORNUM,
  GET_PNUMLABELS,
  GET_VENNUMBERS
} from './constants';
import appConfig from '../../appConfig';

// The initial state of the login
const initialState = {
  isLoading: true,
  meta: {},
  // FETCH props
  items: [],
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
  pageSize: appConfig.pageSize,
};

function VENnumbersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_VENNUMS:
      state.items = action.payload.data;
      state.meta = action.payload.meta;
      return {
        ...state,
        isLoading: false,
      };
    case GET_VENNUM:
      return {
        ...state,
        items: action.payload.data,
        meta: action.payload.meta,
      };
    case CREATE_VENNUM:
      const temp = {...state};
      temp.items.unshift(action.data);
      if (temp.items.length > 10) {
        temp.items.pop();
      }
      return temp;
    case SET_VENNUM:
      state.item = action.data;
      return {
        ...state,
      };
    case UPDATE_VENNUM:
      // state.item = action.data;
      return {
        ...state,
      };
    case DELETE_VENNUM:
      const newState = {...state};
      newState.items.splice(action.activeId, 1);
      return newState;
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case CHANGE_SHORNUM:
      return {
        ...state
      };
    case GET_PNUMLABELS:
      return {
        ...state,
        pnumLabels: action.payload.data
      };
    case GET_VENNUMBERS:
      return {
        ...state,
        venNumbers: action.payload.data
      };
    default:
      return state;
  }
}

export default VENnumbersReducer;
