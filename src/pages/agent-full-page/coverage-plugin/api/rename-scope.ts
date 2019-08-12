import axios from 'axios';

import { ScopeSummary } from '../../../../types/scope-summary';

export function renameScope(
  agentId: string,
  { onSuccess, onError }: { onSuccess?: () => void; onError?: (message: string) => void } = {},
) {
  return async ({ id, name }: ScopeSummary) => {
    try {
      await axios.post(`/agents/${agentId}/coverage/dispatch-action`, {
        type: 'RENAME_SCOPE',
        payload: { scopeId: id, scopeName: name },
      });
      onSuccess && onSuccess();
    } catch ({ message }) {
      onError && onError(message);
    }
  };
}