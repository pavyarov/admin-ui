import { fetch } from 'common/utils';
import { URLS } from 'common/urls';
import { FETCH_USER_SUCCESS } from './constants';

const fetchUserSuccessAction = (user) => ({
  type: FETCH_USER_SUCCESS,
  payload: user,
});

export const fetchUserAction = () => (dispatch) =>
  fetch(URLS.user()).then((user) => {
    dispatch(fetchUserSuccessAction(user));
    return user;
  });
