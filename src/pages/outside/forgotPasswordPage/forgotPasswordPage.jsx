import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { redirect } from 'redux-first-router';
import { LOGIN_PAGE } from 'common/constants';
import { validate } from 'common/utils';
import { showScreenLockAction, hideScreenLockAction } from 'controllers/screenLock';
import { showNotification, NOTIFICATION_TYPES } from 'controllers/notification';
import styles from './forgotPasswordPage.scss';

const cx = classNames.bind(styles);
const messages = defineMessages({
  forgotPassword: {
    id: 'ForgotPasswordPage.forgotPassword',
    defaultMessage: 'Forgot password?',
  },
  restoreTitle: {
    id: 'ForgotPasswordPage.restoreTitle',
    defaultMessage: 'Enter your email to restore',
  },
  emailPlaceholder: {
    id: 'ForgotPasswordPage.emailPlaceholder',
    defaultMessage: 'Enter email',
  },
  sendEmailButton: {
    id: 'ForgotPasswordPage.sendEmailButton',
    defaultMessage: 'Send email',
  },
  cancelButton: {
    id: 'ForgotPasswordPage.cancelButton',
    defaultMessage: 'Cancel',
  },
  successSentEmail: {
    id: 'Notification.successSentEmail',
    defaultMessage: 'Email with instructions was sent to your mailbox',
  },
});

@injectIntl
@reduxForm({
  form: 'restorePasswordForm',
  validate: ({ email }) => ({
    email: !validate.email(email) && 'emailHint',
  }),
})
@connect(
  null,
  {
    showScreenLockAction,
    hideScreenLockAction,
    showNotification,
    redirect,
  },
)
export class ForgotPasswordPage extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
    showScreenLockAction: PropTypes.func.isRequired,
    hideScreenLockAction: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
  };
  static defaultProps = {};

  onSubmit = () => {
    this.props.showScreenLockAction();
    setTimeout(() => {
      this.props.hideScreenLockAction();
      this.props.redirect({ type: LOGIN_PAGE });
      this.props.showNotification({
        message: this.props.intl.formatMessage(messages.successSentEmail),
        type: NOTIFICATION_TYPES.SUCCESS,
      });
    }, 2000);
  };
  onClickCancel = () => {
    this.props.redirect({ type: LOGIN_PAGE });
  };
  render() {
    const { intl, handleSubmit } = this.props;
    return (
      <div className={cx('forgot-password-page')}>
        <div className={cx('message')}>
          <span className={cx('big')}>{intl.formatMessage(messages.forgotPassword)}</span>
          {intl.formatMessage(messages.restoreTitle)}
        </div>
        <form className={cx('forgot-password-form')} onSubmit={handleSubmit(this.onSubmit)}>
          <div className={cx('field')} />

          <div className={cx('buttons-block')}>
            <div className={cx('button')} onClick={this.onClickCancel} />
            <div className={cx('button')} />
          </div>
        </form>
      </div>
    );
  }
}
