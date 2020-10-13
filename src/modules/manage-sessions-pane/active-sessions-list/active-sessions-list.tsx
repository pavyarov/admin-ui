import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';

import { ActiveSession } from 'types/active-session';
import { Message } from 'types/message';
import { SessionInfo } from './session-info';
import { ServiceGroupSessions } from './service-group-sessions';

import styles from './active-sessions-list.module.scss';

interface Props {
  className?: string;
  agentType: string;
  activeSessions: ActiveSession[];
  showGeneralAlertMessage: (message: Message) => void;
  operations: {
    singleOperation: {
      id: string,
      operationType: string
    };
    bulkOperation: {
      isProcessing: boolean,
      operationType: string
    };
  },
  actions: {
    setAbortingSessionIdByAgentId: (id: string) => void,
    setFinishingSessionIdByAgentId: (id: string) => void,
  }
}

const activeSessionsList = BEM(styles);

export const ActiveSessionsList = activeSessionsList(
  ({
    agentType, activeSessions, showGeneralAlertMessage, className,
    operations: { singleOperation, bulkOperation },
    actions: {
      setAbortingSessionIdByAgentId, setFinishingSessionIdByAgentId,
    },
  }: Props) => (
    <div className={className}>
      {agentType === 'Agent' ? (
        activeSessions.map(({ id: sessionId, testType, agentId }) => (
          <SessionInfo
            key={sessionId}
            sessionId={sessionId}
            agentId={agentId}
            testType={testType}
            showGeneralAlertMessage={showGeneralAlertMessage}
            operations={{ bulkOperation, singleOperation }}
            actions={{ setAbortingSessionIdByAgentId, setFinishingSessionIdByAgentId }}
          />
        ))
      ) : (
        <ServiceGroupSessions
          activeSessions={activeSessions}
          showGeneralAlertMessage={showGeneralAlertMessage}
          operations={{ bulkOperation, singleOperation }}
          actions={{ setAbortingSessionIdByAgentId, setFinishingSessionIdByAgentId }}
        />
      )}
    </div>
  ),
);
