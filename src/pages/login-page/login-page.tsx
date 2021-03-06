import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import { useHistory } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Inputs, Button } from '@drill4j/ui-kit';

import { LoginLayout } from 'layouts';
import { defaultAdminSocket, defaultTest2CodePluginSocket, getSocketUrl } from 'common/connection';
import { TOKEN_HEADER, TOKEN_KEY } from 'common/constants';
import { ErrorPanel } from './error-panel';

import styles from './login-page.module.scss';

interface Props {
  className?: string;
}

const loginPage = BEM(styles);

export const LoginPage = loginPage(({ className }: Props) => {
  const [error, setError] = React.useState<AxiosError | null>(null);
  const { push } = useHistory();

  async function handleLogin() {
    await axios
      .post('/login')
      .then((response) => {
        const authToken = response.headers[TOKEN_HEADER.toLowerCase()];
        if (authToken) {
          localStorage.setItem(TOKEN_KEY, authToken);
        }
        defaultAdminSocket.reconnect(getSocketUrl('drill-admin-socket'));
        defaultTest2CodePluginSocket.reconnect(getSocketUrl('/plugins/test2code'));
        push('/');
      })
      .catch((err: AxiosError) => setError(err));
  }

  return (
    <LoginLayout>
      <div className={className}>
        <Logo />
        <Title>Welcome to Drill4J</Title>
        <SubTitle>Click &quot;Continue as a guest&quot; to entry Admin Panel with admin privilege</SubTitle>
        {error && <Error>{`${error.message}`}</Error>}
        <SignInForm>
          <Inputs.Text placeholder="User ID" disabled />
          <Inputs.Text placeholder="Password" disabled />
        </SignInForm>
        <LoginPageButtonWrapepr type="primary" size="large" disabled>
          Sign in
        </LoginPageButtonWrapepr>
        <ForgotPasswordLink>Forgot your password?</ForgotPasswordLink>
        <LoginPageButtonWrapepr type="secondary" size="large" onClick={handleLogin}>
          Continue as a guest (read only)
        </LoginPageButtonWrapepr>
        <Copyright>{`© ${new Date().getFullYear()} Drill4J. All rights reserved.`}</Copyright>
      </div>
    </LoginLayout>
  );
});

const Logo = loginPage.logo('div');
const Title = loginPage.title('div');
const SubTitle = loginPage.subTitle('div');
const Error = loginPage.error(ErrorPanel);
const SignInForm = loginPage.signInForm('div');
const ForgotPasswordLink = loginPage.forgotPassword('div');
const LoginPageButtonWrapepr = loginPage.loginPageButtonWrapepr(Button);
const Copyright = loginPage.copyright('div');
