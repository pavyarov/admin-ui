import {
  initialState,
  sessionPaneReducer,
  SET_BULK_OPERATION,
  SET_IS_NEW_SESSION,
  SET_SINGLE_OPERATION,
} from './manage-sessions-pane-reducer';

describe('Manage session pane reducer actions', () => {
  it('should changed singleOperation', () => {
    expect(
      sessionPaneReducer(initialState, {
        type: SET_SINGLE_OPERATION,
        payload: { id: 'test', operationType: 'abort' },
      }),
    ).toEqual({
      ...initialState,
      singleOperation: { id: 'test', operationType: 'abort' },
    });
  });

  it('should changed bulkOperation', () => {
    expect(
      sessionPaneReducer(initialState, {
        type: SET_BULK_OPERATION,
        payload: { isProcessing: true, operationType: 'abort' },
      }),
    ).toEqual({
      ...initialState,
      bulkOperation: { isProcessing: true, operationType: 'abort' },
    });
  });

  it('should changed isNewSession', () => {
    expect(sessionPaneReducer(initialState, { type: SET_IS_NEW_SESSION, payload: true })).toEqual({
      ...initialState,
      isNewSession: true,
    });
  });
});
