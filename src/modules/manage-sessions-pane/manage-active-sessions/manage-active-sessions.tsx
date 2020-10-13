import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import { Field } from 'react-final-form';
import { LinkButton, Panel } from '@drill4j/ui-kit';

import { Fields } from 'forms';
import { ActiveSession } from 'types/active-session';

import styles from './manage-active-sessions.module.scss';

interface Props {
  className?: string;
  activeSessions: ActiveSession[];
  disabledActions: boolean;
  setAbortingSessionsIsProcessing: (isProcessing: boolean) => void,
  setFinishingSessionsIsProcessing: (isProcessing: boolean) => void
}

const manageActiveSessions = BEM(styles);

export const ManageActiveSessions = manageActiveSessions(
  ({
    activeSessions, disabledActions, className,
    setFinishingSessionsIsProcessing, setAbortingSessionsIsProcessing,
  }: Props) => (
    <div className={className} data-test="manage-active-sessions:search-panel">
      <Panel align="space-between">
        <span>
          Active Sessions
          <Count>{activeSessions.length}</Count>
        </span>
        <ActionsPanel>
          <LinkButton
            size="small"
            onClick={() => setAbortingSessionsIsProcessing(true)}
            data-test="manage-active-sessions:abort-all"
            disabled={disabledActions}
          >
            Abort all
          </LinkButton>
          <LinkButton
            size="small"
            onClick={() => setFinishingSessionsIsProcessing(true)}
            data-test="manage-active-sessions:finish-all"
            disabled={disabledActions}
          >
            Finish all
          </LinkButton>
        </ActionsPanel>
      </Panel>
      <form>
        <Field
          name="id"
          component={Fields.Search}
          placeholder="Search session by ID"
          disabled
        />
      </form>
    </div>
  ),
);

const Count = manageActiveSessions.count('span');
const ActionsPanel = manageActiveSessions.actionsPanel('div');
