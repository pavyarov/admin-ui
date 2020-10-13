import * as React from 'react';
import { Form } from 'react-final-form';
import { BEM } from '@redneckz/react-bem-helper';
import {
  Modal, Button, Icons, GeneralAlerts,
} from '@drill4j/ui-kit';

import {
  composeValidators,
  sizeLimit,
  required,
} from 'forms';
import { useGeneralAlertMessage } from 'hooks';
import { useParams } from 'react-router-dom';
import { ManageNewSession } from './manage-new-session';
import { useActiveSessions } from './use-active-sessions';
import {
  startServiceGroupSessions,
  startAgentSession,
  abortAllSession,
  finishAllSession,
} from './manage-sessions-pane-api';
import { OperationActionWarning } from './operation-action-warning';
import { ManageActiveSessions } from './manage-active-sessions';
import { EmptyActiveSessionsStub } from './active-sessions-list/empty-active-sessions-stub';
import { ActiveSessionsList } from './active-sessions-list';
import {
  initialState, sessionPaneReducer, setBulkOperation, setIsNewSession, setSingleOperation,
} from './manage-sessions-pane-reducer';

import styles from './manage-sessions-pane.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onToggle: (value: boolean) => void;
}

const manageSessionsPane = BEM(styles);

const validateManageSessionsPane = composeValidators(
  required('sessionId', 'Session ID'),
  sizeLimit({
    name: 'sessionId', alias: 'Session ID', min: 1, max: 256,
  }),
);

export const ManageSessionsPane = manageSessionsPane(
  ({
    className, isOpen, onToggle,
  }: Props) => {
    const [{ isNewSession, bulkOperation, singleOperation }, dispatch] = React.useReducer(sessionPaneReducer, initialState);
    const { generalAlertMessage, showGeneralAlertMessage } = useGeneralAlertMessage();
    const {
      agentId = '', serviceGroupId = '', pluginId = '', buildVersion = '',
    } = useParams<{ agentId: string; serviceGroupId: string; pluginId: string; buildVersion: string}>();
    const agentType = serviceGroupId ? 'ServiceGroup' : 'Agent';
    const id = agentId || serviceGroupId;
    const activeSessions = useActiveSessions(agentType, id, buildVersion) || [];
    return (
      <Modal isOpen={isOpen} onToggle={onToggle}>
        <div className={className}>
          <Form
            onSubmit={(values: { sessionId: string }) =>
              (agentId
                ? startAgentSession(agentId, pluginId, showGeneralAlertMessage)(values)
                : startServiceGroupSessions(
                  serviceGroupId,
                  pluginId,
                  showGeneralAlertMessage,
                )(values))}
            validate={validateManageSessionsPane as any}
            render={({ invalid, handleSubmit, form }) => (
              <>
                <Header data-test="manage-sessions-pane:header">
                  {isNewSession ? 'Start New Session' : 'Manage Sessions'}
                </Header>
                {generalAlertMessage?.type && (
                  <GeneralAlerts type={generalAlertMessage.type}>
                    {generalAlertMessage.text}
                  </GeneralAlerts>
                )}
                {isNewSession && <ManageNewSession agentId={agentId} serviceGroupId={serviceGroupId} />}
                {!isNewSession && activeSessions.length > 0 ? (
                  <>
                    <ManageActiveSessions
                      activeSessions={activeSessions}
                      disabledActions={bulkOperation.isProcessing || Boolean(singleOperation.id)}
                      setAbortingSessionsIsProcessing={(isProcessing) => dispatch(setBulkOperation('abort', isProcessing))}
                      setFinishingSessionsIsProcessing={(isProcessing) => dispatch(setBulkOperation('finish', isProcessing))}
                    />
                    <ActiveSessionsList
                      agentType={agentType}
                      activeSessions={activeSessions}
                      showGeneralAlertMessage={showGeneralAlertMessage}
                      operations={{
                        singleOperation,
                        bulkOperation,
                      }}
                      actions={{
                        setAbortingSessionIdByAgentId: (sessionIdByAgentId) => dispatch(setSingleOperation('abort', sessionIdByAgentId)),
                        setFinishingSessionIdByAgentId: (sessionIdByAgentId) => dispatch(setSingleOperation('finish', sessionIdByAgentId)),
                      }}
                    />
                  </>
                ) : <EmptyActiveSessionsStub />}
                {bulkOperation.operationType === 'abort' && bulkOperation.isProcessing && (
                  <WarningPanel>
                    <OperationActionWarning
                      handleConfirm={() => {
                        abortAllSession({ agentType, pluginId, agentId: id }, showGeneralAlertMessage);
                        dispatch(setBulkOperation('abort', false));
                      }}
                      handleDecline={() => dispatch(setBulkOperation('abort', false))}
                      operationType="abort"
                    >
                      Are you sure you want to abort all sessions? All your progress will be lost.
                    </OperationActionWarning>
                  </WarningPanel>

                )}
                {bulkOperation.operationType === 'finish' && bulkOperation.isProcessing && (
                  <WarningPanel>
                    <OperationActionWarning
                      handleConfirm={() => {
                        finishAllSession({ agentType, pluginId, agentId: id }, showGeneralAlertMessage);
                        dispatch(setBulkOperation('finish', false));
                      }}
                      handleDecline={() => dispatch(setBulkOperation('finish', false))}
                      operationType="finish"
                    >
                      Are you sure you want to finish all sessions?
                    </OperationActionWarning>
                  </WarningPanel>
                )}
                {!bulkOperation.isProcessing && (
                  <ActionsPanel>
                    { isNewSession ? (
                      <Button
                        type="primary"
                        size="large"
                        disabled={invalid}
                        onClick={() => {
                          handleSubmit();
                          form.change('sessionId', '');
                          dispatch(setIsNewSession(false));
                        }}
                        data-test="manage-sessions-pane:start-session-button"
                      >
                        Start Session
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => dispatch(setIsNewSession(true))}
                        data-test="manage-sessions-pane:start-new-session-button"
                        disabled={Boolean(singleOperation.id)}
                      >
                        Start New Session
                      </Button>
                    )}
                    { activeSessions.length > 0 && isNewSession && (
                      <Button
                        type="secondary"
                        size="large"
                        onClick={() => dispatch(setIsNewSession(false))}
                        data-test="manage-sessions-pane:back-button"
                      >
                        <Icons.Expander width={8} height={14} rotate={180} />
                        <span>Back</span>
                      </Button>
                    )}

                    <Button
                      type="secondary"
                      size="large"
                      onClick={() => onToggle(false)}
                      data-test="manage-sessions-pane:cancel-button"
                    >
                      Cancel
                    </Button>
                  </ActionsPanel>
                )}
              </>
            )}
          />
        </div>
      </Modal>
    );
  },
);

const Header = manageSessionsPane.header('div');
const ActionsPanel = manageSessionsPane.actionsPanel('div');
const WarningPanel = manageSessionsPane.warningPanel('div');
