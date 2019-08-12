import axios from 'axios';

import { finishScope } from './finish-scope';
import { ScopeSummary } from '../../../../types/scope-summary';

export function deleteScope(
  agentId: string,
  { onSuccess, onError }: { onSuccess?: () => void; onError?: (message: string) => void } = {},
) {
  return async ({ id, active }: ScopeSummary) => {
    if (active) {
      await finishScope(agentId, { onSuccess, onError })({
        prevScopeEnabled: false,
        savePrevScope: false,
      });
    } else {
      try {
        await axios.post(`/agents/${agentId}/coverage/dispatch-action`, {
          type: 'DROP_SCOPE',
          payload: { scopeId: id },
        });
        onSuccess && onSuccess();
      } catch ({ message }) {
        onError && onError(message);
      }
    }
  };
}