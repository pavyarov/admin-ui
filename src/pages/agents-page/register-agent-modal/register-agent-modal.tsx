import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-calculate';
import axios from 'axios';

import { Panel } from '../../../layouts';
import { Popup, Icons } from '../../../components';
import { FormGroup, Fields, Button, composeValidators, sizeLimit } from '../../../forms';
import { useWsConnection } from '../../../hooks';
import { defaultAdminSocket } from '../../../common/connection';
import { NotificationManagerContext } from '../../../notification-manager';
import { Agent } from '../../../types/agent';
import { BuildVersion } from '../../../types/build-version';
import { Message } from '../../../types/message';

import styles from './register-agent-modal.module.scss';

interface Props {
  className?: string;
  onToggle: (isOpen: boolean) => void;
  isOpen: boolean;
  agentId: string;
}

const registerAgentModal = BEM(styles);

const buildVersionAliasDecorator = createDecorator({
  field: 'buildVersionAlias',
  updates: {
    buildVersions: (buildVersionAlias: string, allValues: any) =>
      allValues.buildVersions.map(({ id, name }: BuildVersion) =>
        id === allValues.buildVersion ? { id, name: buildVersionAlias } : { id, name },
      ),
  },
});

const validateAgent = composeValidators(sizeLimit('name'), sizeLimit('description', 3, 256));

export const RegisterAgentModal = registerAgentModal(
  ({ className, isOpen, onToggle, agentId }: Props) => {
    const agent = useWsConnection<Agent>(defaultAdminSocket, `/get-agent/${agentId}`) || {};
    const { showMessage } = React.useContext(NotificationManagerContext);
    const [errorMessage, setErrorMessage] = React.useState('');

    return (
      <Popup isOpen={isOpen} onToggle={onToggle} header={`Agent Registration: ${agent.id}`}>
        <div className={className}>
          {errorMessage && (
            <ErrorMessage>
              <ErrorMessageIcon />
              {errorMessage}
            </ErrorMessage>
          )}
          <Content>
            <Form
              initialValues={agent}
              onSubmit={(values) => registerAgent(values, onToggle, showMessage, setErrorMessage)}
              decorators={[buildVersionAliasDecorator]}
              validate={validateAgent as any}
              render={({ handleSubmit, submitting, pristine, invalid }) => (
                <>
                  <FormGroup label="Agent name">
                    <Field name="name" component={Fields.Input} />
                  </FormGroup>
                  <FormGroup label="Group" optional>
                    <Field name="group" component={Fields.Input} />
                  </FormGroup>
                  <Description label="Description">
                    <Field name="description" component={Fields.Input} />
                  </Description>
                  <FormGroup label="Agent Build Version">
                    <Field name="buildVersion" component={Fields.Input} disabled />
                  </FormGroup>
                  <FormGroup label="Build Alias">
                    <Field
                      name="buildVersionAlias"
                      component={Fields.Input}
                      placeholder="Give build a meaningful name"
                    />
                  </FormGroup>
                  <ActionsPanel>
                    <RegisterAgentButton
                      type="primary"
                      onClick={handleSubmit as any}
                      disabled={submitting || pristine || invalid}
                    >
                      Register the agent
                    </RegisterAgentButton>
                    <CancelButton type="secondary" onClick={() => onToggle(false)}>
                      Cancel
                    </CancelButton>
                  </ActionsPanel>
                </>
              )}
            />
          </Content>
        </div>
      </Popup>
    );
  },
);

const Content = registerAgentModal.content('div');
const ErrorMessage = registerAgentModal.errorMessage(Panel);
const ErrorMessageIcon = registerAgentModal.errorMessageIcon(Icons.Warning);
const Description = registerAgentModal.description(FormGroup);
const ActionsPanel = registerAgentModal.actionsPanel(Panel);
const RegisterAgentButton = registerAgentModal.registerAgentButton(Button);
const CancelButton = registerAgentModal.cancelButton(Button);

async function registerAgent(
  agent: Agent,
  closeModal: (value: boolean) => void,
  showMessage: (message: Message) => void,
  setErrorMessage: (error: string) => void,
) {
  try {
    await axios.post(`/agents/${agent.id}/register`, agent);
    showMessage({ type: 'SUCCESS', text: 'The agent is registered' });
    closeModal(false);
  } catch (error) {
    setErrorMessage(error.message);
  }
}
