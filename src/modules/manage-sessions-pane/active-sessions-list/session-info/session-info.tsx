import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import {
  Panel, Button, LinkButton, OverflowText,
} from '@drill4j/ui-kit';
import { useParams } from 'react-router-dom';

import { Message } from 'types/message';
import { capitalize } from 'utils';
import { finishSession, abortSession } from '../../manage-sessions-pane-api';
import { OperationActionWarning } from '../../operation-action-warning';

import styles from './session-info.module.scss';

interface Props {
  className?: string;
  testType: string;
  sessionId: string;
  agentId: string;
  showGeneralAlertMessage: (message: Message) => void;
  actions: {
    setAbortingSessionIdByAgentId: (id: string) => void,
    setFinishingSessionIdByAgentId: (id: string) => void,
  };
  operations: {
    bulkOperation: {
      isProcessing: boolean,
      operationType: string
    };
    singleOperation: {
      id: string,
      operationType: string
    };
  }
}

const sessionInfo = BEM(styles);

export const SessionInfo = sessionInfo(
  ({
    className, testType, sessionId, agentId, showGeneralAlertMessage,
    operations: { singleOperation, bulkOperation },
    actions: { setAbortingSessionIdByAgentId, setFinishingSessionIdByAgentId },
  }: Props) => {
    const { pluginId = '' } = useParams<{ pluginId: string;}>();
    const operationIsProcessing = Boolean(singleOperation.id === sessionId + agentId);
    const disabled = Boolean(singleOperation.id) || bulkOperation.isProcessing;
    return (
      <div className={className}>
        {singleOperation.operationType === 'abort' && operationIsProcessing && (
          <OperationActionWarning
            handleDecline={() => setAbortingSessionIdByAgentId('')}
            handleConfirm={() => {
              abortSession(agentId, pluginId, showGeneralAlertMessage)(sessionId);
              setAbortingSessionIdByAgentId('');
            }}
            operationType="abort"
          >
            Are you sure you want to abort this session? All your progress will be lost.
          </OperationActionWarning>
        )}
        {singleOperation.operationType === 'finish' && operationIsProcessing && (
          <OperationActionWarning
            handleDecline={() => setFinishingSessionIdByAgentId('')}
            handleConfirm={() => {
              finishSession(agentId, pluginId, showGeneralAlertMessage)(sessionId);
              setFinishingSessionIdByAgentId('');
            }}
            operationType="finish"
          >
            Are you sure you want to finish this session?
          </OperationActionWarning>
        )}
        {!operationIsProcessing && (
          <>
            <Panel align="space-between">
              <SessionId disabled={disabled} data-test="session-info:session-id">{sessionId}</SessionId>
              <ActionsPanel>
                <LinkButton
                  size="small"
                  onClick={() => setAbortingSessionIdByAgentId(sessionId + agentId)}
                  disabled={disabled}
                  data-test="session-info:abort-button"
                >
                  Abort
                </LinkButton>
                <Button
                  type="secondary"
                  size="small"
                  onClick={() => setFinishingSessionIdByAgentId(sessionId + agentId)}
                  disabled={disabled}
                  data-test="session-info:finish-button"
                >
                  Finish
                </Button>
              </ActionsPanel>
            </Panel>
            <TestType disabled={disabled} data-test="session-info:test-type">{capitalize(testType)}</TestType>
          </>
        )}
      </div>
    );
  },
);

const SessionId = sessionInfo.sessionId(OverflowText);
const ActionsPanel = sessionInfo.actionsPanel('div');
const TestType = sessionInfo.testType('span');
