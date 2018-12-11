import axios, { CancelToken } from 'axios';
import { X_APPLICATION_KEY, LOGIN_PAGE } from 'common/constants';
import { setStorageItem, getStorageItem } from 'common/utils';
import { LOGOUT } from 'controllers/auth/constants';
import { showNotification, NOTIFICATION_TYPES } from 'controllers/notification';
import { redirect } from 'redux-first-router';
import { store } from '../../index';

export const ERROR_CANCELED = 'REQUEST_CANCELED';
export const ERROR_UNAUTHORIZED = 'UNAUTHORIZED';

const handleError = (error) => {
  if (axios.isCancel(error)) {
    throw new Error(ERROR_CANCELED);
  }
  if (error.response && error.response.status === 401) {
    setStorageItem('X-API-KEY', '');
    if (store.getState().auth.authorized) {
      store.dispatch({ type: LOGOUT });
      store.dispatch(redirect({ type: LOGIN_PAGE }));
      store.dispatch(
        showNotification({
          message: 'Session were expired',
          type: NOTIFICATION_TYPES.ERROR,
        }),
      );
    }
    throw new Error(ERROR_UNAUTHORIZED);
  }
  if (error.response && error.response.data) {
    throw error.response.data;
  }
  throw error;
};

const handleResponse = (res) => res.data;
const handleResponseFull = (res) => res;

export const fetch = (url, params = {}) => {
  const cancelToken = params && params.abort ? new CancelToken(params.abort) : null;
  const headersFromParams = params && params.headers;
  const headers = Object.assign(
    {
      'X-Application-Key': X_APPLICATION_KEY,
      'X-Api-Key': getStorageItem('X-API-KEY'),
    },
    headersFromParams || {},
  );
  const requestParams = {
    ...params,
    cancelToken,
    url,
    headers,
  };
  return axios(requestParams)
    .catch(handleError)
    .then(params.fullResponse ? handleResponseFull : handleResponse);
};
