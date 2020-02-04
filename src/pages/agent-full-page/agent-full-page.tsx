import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import {
  Switch, withRouter, RouteComponentProps, Route, matchPath,
} from 'react-router-dom';

import { Toolbar, Icons, Footer } from 'components';
import { PluginsLayout, Panel } from 'layouts';
import { useAgent } from 'hooks';
import { Plugin } from 'types/plugin';
import { CoveragePlugin } from './coverage-plugin';
import { PluginProvider } from './store';
import { PluginHeader } from './plugin-header';
import { Breadcrumbs } from './breadcrumbs';
import { Dashboard } from './dashboard';
import { BuildList } from './build-list';
import { Sidebar } from './sidebar';
import { InitialConfigController } from './initial-config-controller';
import { NewBuildModal } from './new-build-modal';
import { useNotification } from './use-notification';

import styles from './agent-full-page.module.scss';

interface Props extends RouteComponentProps<{ agentId: string }> {
  className?: string;
}

interface Link {
  id: string;
  link: string;
  icon: keyof typeof Icons;
  computed: boolean;
}

const agentFullPage = BEM(styles);

const getPluginsLinks = (plugins: Plugin[] = []): Link[] => ([
  {
    id: 'dashboard',
    link: 'dashboard',
    icon: 'Dashboard',
    computed: true,
  },
  ...plugins.map(({ id = '', name }) => ({
    id, link: `${id}/dashboard`, icon: name as keyof typeof Icons, computed: true,
  })),
]);

export const AgentFullPage = withRouter(
  agentFullPage(
    ({
      className,
      match: {
        params: { agentId },
      },
      history,
      location: { pathname },
    }: Props) => {
      const agent = useAgent(agentId) || {};
      const path = '/:page/:agentId/:buildVersion/:activeLink';
      const { params: { activeLink = '' } = {} } = matchPath<{ activeLink: string }>(pathname, {
        path,
      }) || {};
      const notification = useNotification() || {};
      const [isNewBuildModalOpened, setIsNewBuildModalOpened] = React.useState(false);
      React.useEffect(() => {
        if (notification.status === 'UNREAD' && notification.agentId === agentId) {
          setIsNewBuildModalOpened(true);
        }
      }, [notification, agentId]);

      return (
        <PluginProvider>
          <InitialConfigController>
            <PluginsLayout
              sidebar={activeLink && <Sidebar links={getPluginsLinks(agent.plugins)} matchParams={{ path }} />}
              toolbar={(
                <Toolbar
                  breadcrumbs={(
                    <Panel>
                      <ArrowBackLabel onClick={() => history.push('/agents')}>
                        &lt;&nbsp;Back to Admin
                      </ArrowBackLabel>
                    </Panel>
                  )}
                />
              )}
              header={<PluginHeader agentName={agent.name} agentStatus={agent.status} />}
              breadcrumbs={<Breadcrumbs />}
              footer={<Footer />}
            >
              <div className={className}>
                <Switch>
                  <Route
                    path="/full-page/:agentId/:buildVersion/dashboard"
                    render={() => <Dashboard agent={agent} />}
                  />
                  <Route path="/full-page/:agentId/build-list" component={BuildList} />
                  <Route
                    path="/full-page/:agentId/:buildVersion/:pluginId/:tab"
                    component={CoveragePlugin}
                  />
                </Switch>
                {isNewBuildModalOpened && (
                  <NewBuildModal
                    isOpen={isNewBuildModalOpened}
                    onToggle={setIsNewBuildModalOpened}
                    notification={notification}
                  />
                )}
              </div>
            </PluginsLayout>
          </InitialConfigController>
        </PluginProvider>
      );
    },
  ),
);

const ArrowBackLabel = agentFullPage.arrowBackIcon('span');
