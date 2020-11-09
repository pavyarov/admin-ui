import { invertOrder } from 'utils/invert-order';
import { Search } from 'types/search';
import { TableActionsState } from './table-actions-types';

const SET_SEARCH = 'SET_SEARCH';
const TOGGLE_ORDER = 'TOGGLE_ORDER';

export type Action = ReturnType<typeof setSearch | typeof toggleOrder>;

export const setSearch = (search: Search[]) => ({ type: SET_SEARCH, payload: search } as const);

export const toggleOrder = (field: string) => ({ type: TOGGLE_ORDER, payload: field } as const);

export const actionsReducer = (state: TableActionsState, action: Action): TableActionsState => {
  switch (action.type) {
    case SET_SEARCH:
      return { ...state, search: action.payload };
    case TOGGLE_ORDER:
      return {
        ...state,
        sort: state.sort.map(order => ({
          field: action.payload,
          order: (order.field === action.payload ? invertOrder(order.order) : 'ASC'),
        })),
      };
    default:
      return state;
  }
};
