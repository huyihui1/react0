/*
 * LoginConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */
export const GET_VENNUMBERS_DATA = 'get_vennumbers_data';
export const SET_VENNUMBERS_DATA = 'set_vennumbers_data';
export const ADD_VENNUMBERS_DATA = 'add_vennumbers_data';
