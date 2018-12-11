import { LOGIN, LOGOUT, INITIAL_STATE } from './constants';

export const authReducer = (state = INITIAL_STATE, { type }) => {
  switch (type) {
    case LOGIN:
      return Object.assign({}, state, { authorized: true });
    case LOGOUT:
      return Object.assign({}, state, INITIAL_STATE);
    default:
      return state;
  }
};
