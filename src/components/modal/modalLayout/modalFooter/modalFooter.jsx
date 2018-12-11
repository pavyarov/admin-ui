import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './modalFooter.scss';

const cx = classNames.bind(styles);

export class ModalFooter extends Component {
  static propTypes = {
    warningMessage: PropTypes.string,
    okButton: PropTypes.shape({
      text: PropTypes.string.isRequired,
      danger: PropTypes.bool,
    }),
    cancelButton: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }),
    customButton: PropTypes.node,
    onClickOk: PropTypes.func,
    onClickCancel: PropTypes.func,
    onCloseConfirm: PropTypes.func,
    showConfirmation: PropTypes.bool,
    closeConfirmed: PropTypes.bool,
    confirmationMessage: PropTypes.string,
    confirmationWarning: PropTypes.string,
  };
  static defaultProps = {
    warningMessage: '',
    okButton: null,
    cancelButton: null,
    customButton: null,
    onClickOk: () => {},
    onClickCancel: () => {},
    onCloseConfirm: () => {},
    showConfirmation: false,
    closeConfirmed: false,
    confirmationMessage: '',
    confirmationWarning: '',
  };
  closeConfirmChangeHandler = () => {
    const { closeConfirmed } = this.props;
    this.props.onCloseConfirm(!closeConfirmed);
  };

  render() {
    const {
      warningMessage,
      okButton,
      cancelButton,
      customButton,
      showConfirmation,
      confirmationWarning,
    } = this.props;

    return (
      <div className={cx('modal-footer')}>
        {showConfirmation && (
          <div className={cx('confirmation-block')}>
            {confirmationWarning && (
              <div className={cx('warning-block-wrap')}>
                <div className={cx('warning-block')}>
                  <i className={cx('warning-icon')} />
                  <span className={cx('warning-message')}>{confirmationWarning}</span>
                </div>
              </div>
            )}
          </div>
        )}
        {warningMessage && (
          <div className={cx('warning-block')}>
            <i className={cx('warning-icon')} />
            <span className={cx('warning-message')}>{warningMessage}</span>
          </div>
        )}
        <div className={cx('buttons-block')}>
          {cancelButton && <div className={cx('button-container')} />}
          {okButton && <div className={cx('button-container')} />}
          {customButton ? <div className={cx('button-container')}>{customButton}</div> : null}
        </div>
      </div>
    );
  }
}