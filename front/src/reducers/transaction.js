import {
  fetchAll, create, remove, update, fetchExpensesByTag,
} from '../actions/transaction';
import types from '../actions/types';

const initialState = {
  isLoading: false,
  fetchedTransactions: [],
  page: 1,
  expensesByTag: {},
  createEditDialogOpen: false,
  detailsDialogOpen: false,
  showCharts: false,
  error: false,
  errorMessage: undefined,
};

const reducer = (state = initialState, action) => {
  const fetchedTransactionsCopy = [...state.fetchedTransactions];
  switch (action.type) {
    case String(fetchAll.pending):
      return {
        ...state,
        isLoading: true,
        // fetchedTransactions: null,
        error: false,
        errorMessage: undefined,
      };
    case String(fetchAll.fulfilled):
      return {
        ...state,
        isLoading: false,
        fetchedTransactions: action.payload,
        error: false,
      };
    case String(fetchAll.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload.message,
      };
    case String(fetchExpensesByTag.pending):
      return {
        ...state,
        isLoading: true,
        error: false,
        errorMessage: undefined,
      };
    case String(fetchExpensesByTag.fulfilled):
      return {
        ...state,
        isLoading: false,
        expensesByTag: action.payload,
        error: false,
      };
    case String(fetchExpensesByTag.rejected):
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
        fetchedTransactions: [action.payload, ...state.fetchedTransactions],
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
      fetchedTransactionsCopy[action.payload.index] = action.payload;
      return {
        ...state,
        isLoading: false,
        fetchedTransactions: fetchedTransactionsCopy,
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
      fetchedTransactionsCopy.splice(action.payload, 1);
      return {
        ...state,
        isLoading: false,
        fetchedTransactions: fetchedTransactionsCopy,
        error: false,
      };
    case String(remove.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload.message,
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
      };
    case types.TRANSACTIONS_TOGGLE_CHECKBOX:
      fetchedTransactionsCopy[action.payload].checked = !fetchedTransactionsCopy[action.payload].checked;
      return {
        ...state,
        fetchedTransactions: fetchedTransactionsCopy,
      };
    case types.TRANSACTIONS_TOGGLE_CHARTS:
      return {
        ...state,
        showCharts: !state.showCharts,
      };
    case types.TRANSACTIONS_SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
