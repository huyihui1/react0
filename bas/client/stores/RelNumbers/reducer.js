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
import { ADD_VENNUMBERS_DATA, SET_VENNUMBERS_DATA } from './constants';

// The initial state of the login
const initialState = {
  RelNumbersList: []
};

function VENnumbersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_VENNUMBERS_DATA:
      state.RelNumbersList = action.payload;
      return JSON.parse(JSON.stringify(state));
    case ADD_VENNUMBERS_DATA:
      state.RelNumbersList.push(action.data);
      return state;
    default:
      return state;
  }
}

export default VENnumbersReducer;
