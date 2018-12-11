import { redirect } from 'redux-first-router';
import { setStorageItem } from 'common/utils';
import { SOURCE_DATA_PAGE, LOGIN_PAGE } from 'common/constants';
import { LOGIN, LOGOUT } from './constants';

export const authorizateAction = () => (dispatch) => {
  dispatch({ type: LOGIN });
};
export const loginAction = (sessionId) => (dispatch) => {
  setStorageItem('X-API-KEY', sessionId);
  dispatch({ type: LOGIN });
  dispatch(redirect({ type: SOURCE_DATA_PAGE }));
};

export const logoutAction = () => (dispatch) => {
  setStorageItem('X-API-KEY', '');
  dispatch({ type: LOGOUT });
  dispatch(redirect({ type: LOGIN_PAGE }));
};
