import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import {
  Switch, useLocation, useParams, Route, matchPath,
} from 'react-router-dom';
import { Icons } from '@drill4j/ui-kit';

import { Toolbar, Footer } from 'components';
import { PluginsLayout } from 'layouts';
import { Breadcrumbs } from 'modules';
import { useAgent, useWsConnection } from 'hooks';
import { Plugin } from 'types/plugin';
import { Notification } from 'types/notificaiton';
import { defaultAdminSocket } from 'common/connection';
import { CoveragePlugin } from './coverage-plugin';
import { PluginProvider } from './store';
import { PluginHeader } from './plugin-header';
import { Dashboard } from './dashboard';
import { BuildList } from './build-list';
import { Sidebar } from './sidebar';
import { InitialConfigController } from './initial-config-controller';
import { NewBuildModal } from './new-build-modal';

import styles from './agent-full-page.module.scss';

interface Props {
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

export const AgentFullPage = agentFullPage(
  ({
    className,
  }: Props) => {
    const { agentId = '' } = useParams<{ agentId: string }>();
    const { pathname } = useLocation();
    const agent = useAgent(agentId) || {};
    const path = '/:page/:agentId/:buildVersion/:activeLink';
    const { params: { activeLink = '' } = {} } = matchPath<{ activeLink: string }>(pathname, {
      path,
    }) || {};
    const notifications = useWsConnection<Notification[]>(defaultAdminSocket, '/notifications') || [];
    const newBuildNotification = notifications.find((notification) => notification.agentId === agentId) || {};
    const [isNewBuildModalOpened, setIsNewBuildModalOpened] = React.useState(false);
    React.useEffect(() => {
      if (!newBuildNotification?.read && newBuildNotification?.agentId === agentId) {
        setIsNewBuildModalOpened(true);
      }
    }, [newBuildNotification, agentId]);

    return (
      <PluginProvider>
        <InitialConfigController>
          <PluginsLayout
            sidebar={activeLink && <Sidebar links={getPluginsLinks(agent.plugins)} matchParams={{ path }} />}
            toolbar={(
              <Toolbar
                breadcrumbs={<Breadcrumbs />}
              />
            )}
            header={<PluginHeader agentName={agent.name} agentStatus={agent.status} />}
            footer={<Footer />}
          >
            <div className={className}>
              <Switch>
                <Route
                  path="/full-page/:agentId/:buildVersion/dashboard"
                  render={() => <Dashboard agent={agent} />}
                  exact
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
                  notification={newBuildNotification}
                />
              )}
            </div>
          </PluginsLayout>
        </InitialConfigController>
      </PluginProvider>
    );
  },
);
