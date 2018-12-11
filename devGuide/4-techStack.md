# Technical stack

We use [React](https://reactjs.org/) as a rendering library. Most of the state is stored in [Redux](https://redux.js.org/) store.

[Redux-form](https://redux-form.com/) is used to map forms to redux state and handle validation and submit.

[React-intl](https://github.com/yahoo/react-intl) is used for the app localization.

We use [redux-first-router](https://github.com/faceyspacey/redux-first-router/) as a routing library to keep redux store as the only source of truth and be able to change URL parameters from sagas.
