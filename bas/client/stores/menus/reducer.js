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
import { GET_FAVORITESLIST,ADD_FAVORITES,DELETE_FAVORITES, CLEAR_FAVORITES } from './constants';

// The initial state of the login
const initialState = {
  isLoading: false,
  meta: {},
  // FETCH props
  items: [],
  favoritesList: [],
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
};

export function MenusReducer(state = initialState, action) {
  switch (action.type) {
    case GET_FAVORITESLIST:
      return {
        ...state,
        favoritesList: action.data,
        favoritesId:action.dataId
      }
    case CLEAR_FAVORITES:
      return {
        ...state,
        favoritesList: [],
        favoritesId: null
      }
    default:
      return state;
  }
}

export default MenusReducer;
