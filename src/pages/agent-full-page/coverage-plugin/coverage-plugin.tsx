import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import { withRouter, RouteComponentProps, Switch, Route } from 'react-router-dom';

import { Panel } from '../../../layouts';
import { Icons, PageHeader, TabsPanel, Tab } from '../../../components';
import { usePluginDispatch, setInitialConfig } from './store';
import { Dashboard } from './dashboard';
import { ScopesList, ScopeInfo } from './scope';
import { Tests } from './tests';
import { PluginHeader } from './plugin-header';
import { CoveragePluginModals } from './covarage-plugin-modals';
import { Agent } from '../../../types/agent';

import styles from './coverage-plugin.module.scss';

interface Props extends RouteComponentProps<{ agentId: string; tab: string; pluginId: string }> {
  className?: string;
  agent?: Agent;
}

const coveragePlugin = BEM(styles);

export const CoveragePlugin = withRouter(
  coveragePlugin(
    ({
      className,
      match: {
        params: { agentId, tab, pluginId },
      },
      agent: { name, buildVersion = '' } = {},
      history: { push },
    }: Props) => {
      const dispatch = usePluginDispatch();

      React.useEffect(() => {
        dispatch(setInitialConfig({ agentId, pluginId, buildVersion }));
        // eslint-disable-next-line
      }, [buildVersion]);

      return (
        <div className={className}>
          <PageHeader
            title={<span>Code Coverage Tracker</span>}
            actions={
              <Panel align="end">
                <SettingsButton>
                  <Icons.Settings onClick={() => push(`/agents/${agentId}/coverage/settings`)} />
                </SettingsButton>
              </Panel>
            }
          />
          <PluginHeader agentName={name} agentId={agentId} />
          <RoutingTabsPanel>
            <TabsPanel
              activeTab={tab}
              onSelect={(selectedTab: string) =>
                push(`/full-page/${agentId}/coverage/${selectedTab}`)
              }
            >
              <Tab name="dashboard">
                <TabIconWrapper>
                  <Icons.Dashboard />
                </TabIconWrapper>
                Dashboard
              </Tab>
              <Tab name="scopes">
                <TabIconWrapper>
                  <Icons.Scope />
                </TabIconWrapper>
                Scopes
              </Tab>
              <Tab name="tests">
                <TabIconWrapper>
                  <Icons.Test height={20} width={18} viewBox="0 0 20 18" />
                </TabIconWrapper>
                Tests
              </Tab>
            </TabsPanel>
          </RoutingTabsPanel>
          <Content>
            <Switch>
              <Route
                path={`/full-page/${agentId}/${pluginId}/dashboard`}
                component={Dashboard}
                exact
              />
              <Route
                path={`/full-page/${agentId}/${pluginId}/scopes`}
                component={ScopesList}
                exact
              />
              <Route
                path={`/full-page/${agentId}/${pluginId}/scopes/:scopeId`}
                component={ScopeInfo}
                exact
              />
              <Route path={`/full-page/${agentId}/${pluginId}/tests`} component={Tests} exact />
            </Switch>
          </Content>
          <CoveragePluginModals />
        </div>
      );
    },
  ),
);

const SettingsButton = coveragePlugin.settingsButton('div');
const RoutingTabsPanel = coveragePlugin.routingTabsPanel(Panel);
const Content = coveragePlugin.content('div');
const TabIconWrapper = coveragePlugin.tabIconWrapper(Panel);
