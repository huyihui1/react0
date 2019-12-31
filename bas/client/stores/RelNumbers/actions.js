import {SET_VENNUMBERS_DATA, ADD_VENNUMBERS_DATA} from './constants';


const setRelNumbers = (payload) => {
  return {
    type: SET_VENNUMBERS_DATA,
    payload,
  };
}

const getMockData = () => {
  const result = [];
  for (let i = 0; i < 3; i++) {
    result.push({
      short_num: "67834" + i,
      num: "13867834" + i,
      label: '未知',
      network: '李明的亲情网',
      updated_at: '2019年01月19日 10:40',
    });
  }
  return result;
};

export const getRelNumbers = () => {
  return async (dispatch) => {
    const response = await getMockData();
    dispatch(setRelNumbers(response));
  };
}

export const addRelNumbers = (data) => {
  return async (dispatch) => {
    dispatch({
      type: ADD_VENNUMBERS_DATA,
      data,
    });
  }
}

