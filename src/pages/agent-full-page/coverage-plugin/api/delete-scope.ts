import axios from 'axios';

import { finishScope } from './finish-scope';

export function deleteScope(
  agentId: string,
  pluginId: string,
  { onSuccess, onError }: { onSuccess?: () => void; onError?: (message: string) => void } = {},
) {
  return async ({ id, active }: { id?: string; active?: boolean }) => {
    if (active) {
      await finishScope(agentId, pluginId, { onSuccess, onError })({
        prevScopeEnabled: false,
        savePrevScope: false,
      });
    } else {
      try {
        await axios.post(`/agents/${agentId}/plugins/${pluginId}/dispatch-action`, {
          type: 'DROP_SCOPE',
          payload: { scopeId: id },
        });
        onSuccess && onSuccess();
      } catch ({ response: { data: { message } = {} } = {} }) {
        onError && onError(message);
      }
    }
  };
}
