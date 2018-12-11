import React from 'react';
import PropTypes from 'prop-types';
import PageSwitcher from 'routes/pageSwitcher';
import { LocalizationContainer } from 'components/localization/localizationContainer';
import { InitialDataContainer } from './initialDataContainer';

const App = ({ initialDispatch }) => (
  <InitialDataContainer initialDispatch={initialDispatch}>
    <LocalizationContainer>
      <PageSwitcher />
    </LocalizationContainer>
  </InitialDataContainer>
);

App.propTypes = {
  initialDispatch: PropTypes.func.isRequired,
};

export default App;
