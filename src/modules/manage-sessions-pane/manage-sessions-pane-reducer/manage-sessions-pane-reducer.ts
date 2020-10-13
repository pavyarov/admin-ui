export const SET_IS_NEW_SESSION = 'SET_IS_NEW_SESSION';
export const SET_SINGLE_OPERATION = 'SET_SINGLE_OPERATION';
export const SET_BULK_OPERATION = 'SET_BULK_OPERATION';

interface State {
  singleOperation: {
    id: string;
    operationType: string
  };
  bulkOperation: {
    isProcessing: boolean;
    operationType: string
  };
  isNewSession: boolean;
}

export type Action = ReturnType<typeof setSingleOperation | typeof setIsNewSession | typeof setBulkOperation>;

export const setSingleOperation = (operationType: string, id: string) => ({
  type: SET_SINGLE_OPERATION,
  payload: { id, operationType },
} as const);

export const setBulkOperation = (operationType: string, isProcessing: boolean) => ({
  type: SET_BULK_OPERATION,
  payload: { isProcessing, operationType },
} as const);

export const setIsNewSession = (isNewSession: boolean) => ({
  type: SET_IS_NEW_SESSION,
  payload: isNewSession,
} as const);

export const initialState: State = {
  isNewSession: false,
  singleOperation: {
    id: '',
    operationType: '',
  },
  bulkOperation: {
    isProcessing: false,
    operationType: '',
  },
};

export const sessionPaneReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_BULK_OPERATION:
      return {
        ...state,
        bulkOperation: action.payload,
      };
    case SET_SINGLE_OPERATION:
      return {
        ...state,
        singleOperation: action.payload,
      };
    case SET_IS_NEW_SESSION:
      return {
        ...state,
        isNewSession: action.payload,
      };
    default:
      return state;
  }
};
