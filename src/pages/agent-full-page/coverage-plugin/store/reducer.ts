import { ActiveScope } from 'types/active-scope';
import { ActiveSessions } from 'types/active-sessions';
import { PluginState, ModalName } from './store-types';

const OPEN_MODAL = 'OPEN_MODAL';
const SET_ACTIVE_SESSIONS = 'SET_ACTIVE_SESSIONS';

export type Action = ReturnType<typeof openModal | typeof setActiveSessions>;

export const openModal = (modalName: ModalName | undefined, scope: ActiveScope | null) =>
  ({ type: OPEN_MODAL, payload: { openedModalName: modalName, scope } } as const);

export const setActiveSessions = (activeSessions: ActiveSessions) => ({ type: SET_ACTIVE_SESSIONS, payload: activeSessions } as const);

export const pluginReducer = (state: PluginState, action: Action): PluginState => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        ...action.payload,
      };
    case SET_ACTIVE_SESSIONS:
      return {
        ...state,
        activeSessions: action.payload,
      };
    default:
      return state;
  }
};
