import { reducer as formReducer } from 'redux-form';
import { userReducer } from 'controllers/user';
import { langReducer } from 'controllers/lang';
import { modalReducer } from 'controllers/modal';
import { screenLockReducer } from 'controllers/screenLock';
import { notificationReducer } from 'controllers/notification';
import { authReducer } from 'controllers/auth';

export default {
  user: userReducer,
  auth: authReducer,
  lang: langReducer,
  form: formReducer,
  modal: modalReducer,
  notifications: notificationReducer,
  screenLock: screenLockReducer,
};
