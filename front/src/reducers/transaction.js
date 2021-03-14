import {
  fetchAll, create, remove, update,
} from '../actions/transaction';
import types from '../actions/types';

const initialState = {
  isLoading: false,
  transactionsFetched: [],
  createEditDialogOpen: false,
  detailsDialogOpen: false,
  contextMenuState: {
    mouseX: null,
    mouseY: null,
    index: null,
    id: null,
  },
  error: false,
  errorMessage: undefined,
};

const reducer = (state = initialState, action) => {
  const transactionsFetchedCopy = [...state.transactionsFetched];
  switch (action.type) {
    case String(fetchAll.pending):
      return {
        ...state,
        isLoading: true,
        // transactionsFetched: null,
        error: false,
        errorMessage: undefined,
      };
    case String(fetchAll.fulfilled):
      return {
        ...state,
        isLoading: false,
        transactionsFetched: action.payload,
        error: false,
      };
    case String(fetchAll.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload.message,
      };
    case String(create.pending):
      return {
        ...state,
        isLoading: true,
        error: false,
        errorMessage: undefined,
      };
    case String(create.fulfilled):
      return {
        ...state,
        isLoading: false,
        transactionsFetched: [action.payload, ...state.transactionsFetched],
        error: false,
      };
    case String(create.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload.message,
      };
    case String(update.pending):
      return {
        ...state,
        isLoading: true,
        error: false,
        errorMessage: undefined,
      };
    case String(update.fulfilled):
      transactionsFetchedCopy[action.payload.index] = action.payload;
      return {
        ...state,
        isLoading: false,
        transactionsFetched: transactionsFetchedCopy,
        error: false,
      };
    case String(update.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload.message,
      };
    case String(remove.pending):
      return {
        ...state,
        isLoading: true,
        error: false,
        errorMessage: undefined,
      };
    case String(remove.fulfilled):
      transactionsFetchedCopy.splice(action.payload, 1);
      return {
        ...state,
        isLoading: false,
        transactionsFetched: transactionsFetchedCopy,
        error: false,
      };
    case String(remove.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload.message,
      };
    case types.TRANSACTIONS_CONTEXT_MENU_CHANGE_INDEX:
      return {
        ...state,
        contextMenuState: {
          ...state.contextMenuState,
          index: action.payload,
        },
      };
    case types.TRANSACTIONS_CONTEXT_MENU_CHANGE_ID:
      return {
        ...state,
        contextMenuState: {
          ...state.contextMenuState,
          id: action.payload,
        },
      };
    case types.TRANSACTIONS_CONTEXT_MENU_CHANGE_POSITION:
      return {
        ...state,
        contextMenuState: {
          ...state.contextMenuState,
          mouseX: action.payload.x,
          mouseY: action.payload.y,
        },
      };
    case types.TRANSACTIONS_CREATE_EDIT_DIALOG_OPEN:
      return {
        ...state,
        createEditDialogOpen: true,
      };
    case types.TRANSACTIONS_CREATE_EDIT_DIALOG_CLOSE:
      return {
        ...state,
        createEditDialogOpen: false,
        contextMenuState: {
          ...state.contextMenuState,
          index: undefined,
        },
      };
    case types.TRANSACTIONS_DETAILS_DIALOG_OPEN:
      return {
        ...state,
        detailsDialogOpen: true,
      };
    case types.TRANSACTIONS_DETAILS_DIALOG_CLOSE:
      return {
        ...state,
        detailsDialogOpen: false,
        contextMenuState: {
          ...state.contextMenuState,
          index: undefined,
        },
      };
    case types.TRANSACTIONS_TOGGLE_CHECKBOX:
      transactionsFetchedCopy[action.payload].checked = !transactionsFetchedCopy[action.payload].checked;
      return {
        ...state,
        transactionsFetched: transactionsFetchedCopy,
      };
    default:
      return state;
  }
};

export default reducer;
