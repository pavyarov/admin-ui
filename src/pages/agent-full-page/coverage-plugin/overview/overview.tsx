import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import { Panel, Icons } from '@drill4j/ui-kit';

import { TabsPanel, Tab } from 'components';
import { BuildCoverage } from 'types/build-coverage';
import { ActiveScope } from 'types/active-scope';
import { Methods } from 'types/methods';
import { useAgent, useBuildVersion } from 'hooks';
import { TableActionsProvider } from 'modules';
import { ParentBuild } from 'types/parent-build';
import { CoveragePluginHeader } from '../coverage-plugin-header';
import { CoverageDetails } from '../coverage-details';
import { ProjectMethodsCards } from '../project-methods-cards';
import { usePluginState } from '../../store';
import { Tests } from '../tests';
import { ActiveBuildCoverageInfo } from './active-build-coverage-info';
import { BuildCoverageInfo } from './build-coverage-info';
import { ActiveScopeInfo } from './active-scope-info';
import { usePreviousBuildCoverage } from '../use-previous-build-coverage';

import styles from './overview.module.scss';

interface Props {
  className?: string;
}

const overview = BEM(styles);

export const Overview = overview(({ className }: Props) => {
  const [selectedTab, setSelectedTab] = React.useState('methods');
  const { agentId, loading } = usePluginState();
  const { status } = useAgent(agentId) || {};
  const { version: previousBuildVersion = '' } = useBuildVersion<ParentBuild>('/data/parent') || {};
  const { percentage: previousBuildCodeCoverage = 0 } = usePreviousBuildCoverage(previousBuildVersion) || {};
  const buildCoverage = useBuildVersion<BuildCoverage>('/build/coverage') || {};
  const { percentage: buildCodeCoverage = 0 } = buildCoverage;
  const scope = useBuildVersion<ActiveScope>('/active-scope');
  const buildMethods = useBuildVersion<Methods>('/build/methods') || {};

  return (
    <div className={className}>
      <CoveragePluginHeader />
      <SummaryPanel align="space-between">
        {scope?.active ? (
          <>
            <ActiveBuildCoverageInfo
              buildCoverage={buildCoverage}
              previousBuildVersion={previousBuildVersion}
              previousBuildCodeCoverage={previousBuildCodeCoverage}
              scope={scope}
              status={status}
              loading={loading}
            />
            <ActiveScopeInfo scope={scope} />
          </>
        )
          : (
            <BuildCoverageInfo
              buildCodeCoverage={buildCodeCoverage}
              previousBuildVersion={previousBuildVersion}
              previousBuildCodeCoverage={previousBuildCodeCoverage}
            />
          )}
      </SummaryPanel>
      <RoutingTabsPanel>
        <TabsPanel activeTab={selectedTab} onSelect={setSelectedTab}>
          <Tab name="methods">
            <TabIconWrapper>
              <Icons.Function />
            </TabIconWrapper>
            Build methods
          </Tab>
          <Tab name="tests">
            <TabIconWrapper>
              <Icons.Test width={16} />
            </TabIconWrapper>
            Build tests
          </Tab>
        </TabsPanel>
      </RoutingTabsPanel>
      <TabContent>
        {selectedTab === 'methods' ? (
          <>
            <ProjectMethodsCards methods={buildMethods} />
            <TableActionsProvider>
              <CoverageDetails
                topic="/build/coverage/packages"
                associatedTestsTopic="/build/associated-tests"
                classesTopicPrefix="build"
                packageCount={buildCoverage.packageCount?.total}
              />
            </TableActionsProvider>
          </>
        ) : (
          <Tests />
        )}
      </TabContent>
    </div>
  );
});

const SummaryPanel = overview.summaryPanel(Panel);
const RoutingTabsPanel = overview.routingTabsPanel('div');
const TabContent = overview.tabContent('div');
const TabIconWrapper = overview.tabIconWrapper('div');
