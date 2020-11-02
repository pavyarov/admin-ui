import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import { Modal, Button } from '@drill4j/ui-kit';

import { useWsConnection } from 'hooks';
import { defaultAdminSocket } from 'common/connection';
import { NotificationManagerContext } from 'notification-manager';
import { Plugin } from 'types/plugin';
import { SelectableList } from './selectable-list';
import { loadPlugins } from './load-plugins';

import styles from './add-plugins-modal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onToggle: (arg: boolean) => void;
  agentId: string;
  agentType: string;
}

const addPluginModal = BEM(styles);

export const AddPluginsModal = addPluginModal(({
  className, isOpen, onToggle, agentId, agentType,
}: Props) => {
  const [selectedPlugins, setSelectedPlugins] = React.useState<string[]>([]);
  const { showMessage } = React.useContext(NotificationManagerContext);
  const connectionTopic = `/${agentType === 'agent' ? 'agents' : 'service-groups'}/${agentId}/plugins`;
  const plugins = useWsConnection<Plugin[]>(defaultAdminSocket, connectionTopic);
  const handleLoadPlugins = loadPlugins(connectionTopic, {
    onSuccess: () => {
      onToggle(false);
      showMessage({ type: 'SUCCESS', text: 'Plugin has been added' });
    },
    onError: (message: string) => showMessage({ type: 'ERROR', text: message }),
  });
  return (
    <Modal isOpen={isOpen} onToggle={onToggle}>
      <div className={className}>
        <Header>Add new plugin</Header>
        <Content>
          <Title>Choose one or more plugins:</Title>
          <PluginsList>
            <SelectableList
              data={plugins || []}
              idKey="id"
              selectedRows={selectedPlugins}
              onSelect={setSelectedPlugins}
            />
          </PluginsList>
        </Content>
        <Actions>
          <Button
            type="primary"
            size="large"
            onClick={() => handleLoadPlugins(selectedPlugins)}
            disabled={selectedPlugins.length === 0}
          >
            Add plugin
          </Button>
          <Button type="secondary" size="large" onClick={() => onToggle(!isOpen)}>
            Cancel
          </Button>
        </Actions>
      </div>
    </Modal>
  );
});

const Header = addPluginModal.header('div');
const Content = addPluginModal.content('div');
const Title = addPluginModal.title('div');
const PluginsList = addPluginModal.pluginsList('div');
const Actions = addPluginModal.actions('div');
