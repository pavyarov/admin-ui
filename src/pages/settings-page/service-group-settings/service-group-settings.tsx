import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';

import { TabsPanel, Tab } from 'components';
import { Message } from 'types/message';
import { CommonEntity } from 'types/common-entity';
import { PluginsSettingsTab } from 'modules/plugins-settings-tab';
import { GeneralSettingsForm } from './general-settings-form';
import { SystemSettingsForm } from './system-setting-form';

import styles from './service-group-settings.module.scss';

interface Props {
  className?: string;
  showMessage: (message: Message) => void;
  serviceGroup: CommonEntity;
  type?: string;
}

interface TabsComponent {
  name: string;
  component: React.ReactNode;
}

const agentSettings = BEM(styles);

export const ServiceGroupSettings = agentSettings(
  ({ className, showMessage, serviceGroup }: Props) => {
    const [selectedTab, setSelectedTab] = React.useState('general');
    const tabsComponents: TabsComponent[] = [
      {
        name: 'general',
        component: <GeneralSettingsForm serviceGroup={serviceGroup} showMessage={showMessage} />,
      },
      {
        name: 'system',
        component: <SystemSettingsForm serviceGroup={serviceGroup} showMessage={showMessage} />,
      },
      {
        name: 'plugins',
        component: <PluginsSettingsTab agent={serviceGroup} />,
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
  },
);

const Tabs = agentSettings.tabsPanel(TabsPanel);
