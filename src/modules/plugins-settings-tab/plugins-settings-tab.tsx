import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import { useHistory, useParams } from 'react-router-dom';
import { Panel, Icons, Button } from '@drill4j/ui-kit';

import { PluginListEntry } from 'components';
import { Agent } from 'types/agent';
import { AddPluginsModal } from './add-plugins-modal';
import { NoPluginsStub } from './no-plugins-stub';

import styles from './plugins-settings-tab.module.scss';

interface Props {
  className?: string;
  agent: Agent;
}

const pluginsSettingsTab = BEM(styles);

export const PluginsSettingsTab = pluginsSettingsTab(
  ({
    className,
    agent: { id = '', plugins = [], buildVersion = '' },
  }: Props) => {
    const [isAddPluginOpen, setIsAddPluginOpen] = React.useState(false);
    const { type: agentType } = useParams<{ type: 'service-group' | 'agent' }>();
    const { push } = useHistory();
    return (
      <div className={className}>
        <InfoPanel align="space-between">
          <Panel>
            <InfoIcon />
            {`Plugins installed on your ${agentType === 'agent' ? 'agent' : 'service group'}.`}
          </Panel>
        </InfoPanel>
        <Header align="space-between">
          <span>
            Plugins
            <PluginsCount>{(plugins || []).length}</PluginsCount>
          </span>
          <AddPluginButton
            type="secondary"
            onClick={() => setIsAddPluginOpen(!isAddPluginOpen)}
            data-test={`${agentType}-info-page:add-plugin-button`}
          >
            <Icons.Add />
            <span>Add plugin</span>
          </AddPluginButton>
        </Header>
        <Content>
          {(plugins || []).length > 0 ? (
            plugins.map(({
              id: pluginId, name, description, version,
            }) => (
              <PluginListEntry
                key={id}
                description={description}
                onClick={() => agentType === 'agent' && push(`/full-page/${id}/${buildVersion}/${pluginId}/dashboard`)}
                icon={name as keyof typeof Icons}
              >
                <Panel>
                  <PluginName>{name}&nbsp;</PluginName>
                  {version && <PluginVersion>({version})</PluginVersion>}
                </Panel>
              </PluginListEntry>
            ))
          ) : (
            <NoPluginsStub />
          )}
        </Content>
        {isAddPluginOpen && (
          <AddPluginsModal
            isOpen={isAddPluginOpen}
            onToggle={setIsAddPluginOpen}
            agentId={id}
            agentType={agentType}
          />
        )}
      </div>
    );
  },
);

const InfoPanel = pluginsSettingsTab.infoPanel(Panel);
const InfoIcon = pluginsSettingsTab.infoIcon(Icons.Info);
const Content = pluginsSettingsTab.content('div');
const Header = pluginsSettingsTab.header(Panel);
const PluginsCount = pluginsSettingsTab.pluginsCount('span');
const AddPluginButton = pluginsSettingsTab.addPlugin(Button);
const PluginName = pluginsSettingsTab.pluginName('div');
const PluginVersion = pluginsSettingsTab.pluginVersion('div');
