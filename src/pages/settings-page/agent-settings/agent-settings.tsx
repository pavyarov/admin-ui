import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';

import { TabsPanel, Tab } from 'components';
import { Agent } from 'types/agent';
import { Message } from 'types/message';
import { PluginsSettingsTab } from 'modules';
import { GeneralSettingsForm } from './general-settings-form';
import { SystemSettingsForm } from './system-setting-form';

import styles from './agent-settings.module.scss';

interface Props {
  className?: string;
  showMessage: (message: Message) => void;
  agent: Agent;
}

interface TabsComponent {
  name: string;
  component: React.ReactNode;
}

const agentSettings = BEM(styles);

export const AgentSettings = agentSettings(({ className, showMessage, agent }: Props) => {
  const [selectedTab, setSelectedTab] = React.useState('general');
  const tabsComponents: TabsComponent[] = [
    {
      name: 'general',
      component: <GeneralSettingsForm agent={agent} showMessage={showMessage} />,
    },
    {
      name: 'system',
      component: <SystemSettingsForm agent={agent} showMessage={showMessage} />,
    },
    {
      name: 'plugins',
      component: <PluginsSettingsTab agent={agent} />,
    },
  ];
  return (
    <div className={className}>
      <Tabs activeTab={selectedTab} onSelect={setSelectedTab}>
        <Tab name="general">General</Tab>
        <Tab name="system">System</Tab>
        <Tab name="plugins">Plugins</Tab>
      </Tabs>
      {tabsComponents.find(({ name }) => name === selectedTab)?.component}
    </div>
  );
});

const Tabs = agentSettings.tabsPanel(TabsPanel);
