import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUserAction } from 'controllers/user';
import { authorizateAction } from 'controllers/auth';
import { setStorageItem, getStorageItem } from 'common/utils';
import { SpinningPreloader } from 'components/preloaders/spinningPreloader';

@connect(
  null,
  {
    fetchUserAction,
    authorizateAction,
  },
)
export class InitialDataContainer extends Component {
  static propTypes = {
    fetchUserAction: PropTypes.func.isRequired,
    authorizateAction: PropTypes.func.isRequired,
    children: PropTypes.node,
    initialDispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  state = {
    initialDataReady: false,
  };

  componentDidMount() {
    const token = getStorageItem('X-API-KEY');
    if (!token) {
      setStorageItem('X-API-KEY', '');
    }
    const userPromise = this.props
      .fetchUserAction()
      .then(() => {
        this.props.authorizateAction();
      })
      .catch(() => {
        setStorageItem('X-API-KEY', '');
      });
    Promise.all([userPromise]).then(() => {
      this.props.initialDispatch();
      this.setState({ initialDataReady: true });
    });
  }

  render() {
    return this.state.initialDataReady ? this.props.children : <SpinningPreloader />;
  }
}
