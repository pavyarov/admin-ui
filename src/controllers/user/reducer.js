import { FETCH_USER_SUCCESS } from './constants';

export const userReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case FETCH_USER_SUCCESS:
      return { ...state, user: payload };
    default:
      return state;
  }
};
