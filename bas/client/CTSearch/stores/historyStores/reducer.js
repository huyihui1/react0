import {ADD_HISTORY, REMOVE_HISTORY} from './types';

const initHistoryState = []

export function historyReducer(state = initHistoryState, action) {
  switch (action.type) {
    case ADD_HISTORY:
      state.unshift(action.payload)
      return [...state]
    case REMOVE_HISTORY:
      return [];
    default:
      return initHistoryState
  }
}

