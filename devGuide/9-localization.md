# Localization

For localization needs TDM uses [react-intl](https://github.com/yahoo/react-intl) library, which is a part of [FormatJS](https://formatjs.io/).

[Documentation](https://github.com/yahoo/react-intl/wiki)

All text content of application should be controlled by localization system.
At the moment TDM supports only English (default) language.

Localization message id format: `ComponentsName.elementName` (for example LoginPage.passwordPlaceholder)

Localization workflow is:

1. Develop component and define default (English) translations using `<FormattedMessage>` component or `intl.formatMessage` function.
2. Execute npm script `manage:translations`.
