import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Link from 'redux-first-router-link';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { validate, fetch } from 'common/utils';
import { URLS } from 'common/urls';
import { FORGOT_PASSWORD_PAGE } from 'common/constants';
import { showScreenLockAction, hideScreenLockAction } from 'controllers/screenLock';
import { showNotification, NOTIFICATION_TYPES } from 'controllers/notification';
import { loginAction } from 'controllers/auth';
import styles from './loginPage.scss';

const cx = classNames.bind(styles);
const messages = defineMessages({
  welcome: {
    id: 'LoginPage.welcome',
    defaultMessage: 'Welcome,',
  },
  loginTitle: {
    id: 'LoginPage.loginTitle',
    defaultMessage: 'Login to your account',
  },
  loginPlaceholder: {
    id: 'LoginPage.loginPlaceholder',
    defaultMessage: 'Enter login',
  },
  loginButton: {
    id: 'LoginPage.loginButton',
    defaultMessage: 'Login',
  },
  passwordPlaceholder: {
    id: 'LoginPage.passwordPlaceholder',
    defaultMessage: 'Enter password',
  },
  forgotPassword: {
    id: 'LoginPage.forgotPassword',
    defaultMessage: 'Forgot your password?',
  },
  registerButton: {
    id: 'LoginPage.registerButton',
    defaultMessage: 'Register',
  },
  invalidCredentials: {
    id: 'Notification.invalidCredentials',
    defaultMessage: 'Provided credentials were invalid',
  },
  successLogin: {
    id: 'Notification.successLogin',
    defaultMessage: 'You successfully logged in',
  },
});

@injectIntl
@reduxForm({
  form: 'loginForm',
  validate: ({ login, password }) => ({
    login: !login && !validate.login(login) && 'loginHint',
    password: (!password || !validate.password(password)) && 'passwordHint',
  }),
})
@connect(
  null,
  {
    showScreenLockAction,
    hideScreenLockAction,
    showNotification,
    loginAction,
  },
)
export class LoginPage extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    showScreenLockAction: PropTypes.func.isRequired,
    hideScreenLockAction: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    loginAction: PropTypes.func.isRequired,
  };
  static defaultProps = {};

  onSubmit = (data) => {
    this.props.showScreenLockAction();
    fetch(URLS.sessionLogin(), {
      method: 'POST',
      data: {
        username: data.login,
        password: data.password,
      },
    })
      .then(({ session }) => {
        this.props.showNotification({
          message: this.props.intl.formatMessage(messages.successLogin),
          type: NOTIFICATION_TYPES.SUCCESS,
        });
        this.props.loginAction(session.id);
      })
      .catch(() => {
        this.props.showNotification({
          message: this.props.intl.formatMessage(messages.invalidCredentials),
          type: NOTIFICATION_TYPES.ERROR,
        });
      })
      .then(() => {
        this.props.hideScreenLockAction();
      });
  };
  onRegister = () => {
    fetch(URLS.user(), {
      method: 'POST',
      data: {
        user: {
          email: '11112@email.com',
          username: 'superadmin',
          password: 'erebus',
        },
      },
    });
  };
  render() {
    const { intl, handleSubmit } = this.props;
    return (
      <div className={cx('login-page')}>
        <div className={cx('message')}>
          <span className={cx('big')}>{intl.formatMessage(messages.welcome)}</span>
          {intl.formatMessage(messages.loginTitle)}
        </div>
        <form className={cx('login-form')} onSubmit={handleSubmit(this.onSubmit)}>
          <div className={cx('field')} />

          <div className={cx('field')} />

          <div className={cx('forgot-password-link')}>
            <Link to={{ type: FORGOT_PASSWORD_PAGE }}>
              {intl.formatMessage(messages.forgotPassword)}
            </Link>
          </div>

          <div className={cx('buttons-block')}>
            <div className={cx('button')} />
          </div>
        </form>
      </div>
    );
  }
}
