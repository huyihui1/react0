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
export const FETCH_VENNUMS = '@@resource/VENNUMS/FETCH';
export const GET_VENNUM = '@@resource/VENNUM/GET';
export const CREATE_VENNUM = '@@resource/VENNUM/CREATE';
export const SET_VENNUM = '@@resource/VENNUM/SET';
export const UPDATE_VENNUM = '@@resource/VENNUM/UPDATE';
export const DELETE_VENNUM = '@@resource/VENNUM/DELETE';
export const CHANGE_SHORNUM = '@@resource/SHORNUM/CHANGE';
export const GET_PNUMLABELS = '@@resource/GET/PNUMLABELS';
export const GET_VENNUMBERS = '@@resource/GET/VENNUMBERS';

// 加载动画
export const SET_LOADING = '@@resource/VENNUMS/LOADING';
