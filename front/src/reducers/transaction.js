import i18n from 'utils/i18n';
import {
  fetchAll,
  create,
  remove,
  update,
  fetchExpensesByTag,
  addAttachment,
  removeAttachment,
  updatedAttachment,
  applySpecificTags,
} from 'actions/transaction';
import types from 'actions/types';

const initialState = {
  isLoading: false,
  isUploadingAttachment: false,
  fetchedTransactions: [],
  page: 1,
  expensesByTag: {},
  createEditDialogOpen: false,
  detailsDialogOpen: false,
  mergeDialogOpen: false,
  taggingDialogOpen: false,
  showCharts: false,
  error: false,
  errorMessage: undefined,
  successMessage: undefined,
};

const reducer = (state = initialState, action) => {
  const lng = localStorage.getItem('lang');
  const fetchedTransactionsCopy = state.fetchedTransactions
    ? [...state.fetchedTransactions]
    : [];
  const transactionIndex = fetchedTransactionsCopy.map((t) => t.id).indexOf(action.payload?.transactionId);
  switch (action.type) {
    case String(fetchAll.pending):
      return {
        ...state,
        isLoading: true,
        // fetchedTransactions: null,
        error: false,
        errorMessage: undefined,
        successMessage: undefined,
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
        errorMessage: i18n.t('errorMessages.fetchTransactions', { lng }),
      };
    case String(fetchExpensesByTag.pending):
      return {
        ...state,
        isLoading: true,
        error: false,
        errorMessage: undefined,
        successMessage: undefined,
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
        successMessage: undefined,
      };
    case String(create.fulfilled):
      return {
        ...state,
        isLoading: false,
        fetchedTransactions: action.payload.refresh ? [action.payload, ...state.fetchedTransactions] : state.fetchedTransactions,
        successMessage: i18n.t('successMessages.createTransaction', { lng }),
        error: false,
      };
    case String(create.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: i18n.t('errorMessages.createTransaction', { lng }),
      };
    case String(update.pending):
      return {
        ...state,
        isLoading: true,
        error: false,
        errorMessage: undefined,
        successMessage: undefined,
      };
    case String(update.fulfilled):
      fetchedTransactionsCopy[action.payload.index] = action.payload;
      return {
        ...state,
        isLoading: false,
        fetchedTransactions: fetchedTransactionsCopy,
        successMessage: i18n.t('successMessages.updateTransaction', { lng }),
        error: false,
      };
    case String(update.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: i18n.t('errorMessages.updateTransaction', { lng }),
      };
    case String(applySpecificTags.pending):
      return {
        ...state,
        isLoading: true,
        error: false,
        errorMessage: undefined,
        successMessage: undefined,
      };
    case String(applySpecificTags.fulfilled):
      Object.keys(action.payload).forEach(id => {
        const index = fetchedTransactionsCopy.findIndex(t => t.id === parseInt(id));
        if (index !== -1) fetchedTransactionsCopy[index].tags = action.payload[id];
      });
      return {
        ...state,
        isLoading: false,
        fetchedTransactions: fetchedTransactionsCopy,
        successMessage: i18n.t('successMessages.applySpecificTags', { lng }),
        error: false,
      };
    case String(applySpecificTags.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: i18n.t('errorMessages.applySpecificTags', { lng }),
      };
    case String(remove.pending):
      return {
        ...state,
        isLoading: true,
        error: false,
        errorMessage: undefined,
        successMessage: undefined,
      };
    case String(remove.fulfilled):
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          isLoading: false,
          fetchedTransactions: fetchedTransactionsCopy
            .map((t, i) => {
              if (!action.payload.includes(i)) return t;
              return undefined;
            })
            .filter(t => t),
          successMessage: i18n.t('successMessages.deleteTransaction', { lng }),
          error: false,
        };
      }
      fetchedTransactionsCopy.splice(action.payload, 1);
      return {
        ...state,
        isLoading: false,
        fetchedTransactions: fetchedTransactionsCopy,
        successMessage: i18n.t('successMessages.deleteTransaction', { lng }),
        error: false,
      };
    case String(remove.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: i18n.t('errorMessages.deleteTransaction', { lng }),
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
    case types.TRANSACTIONS_MERGE_DIALOG_OPEN:
      return {
        ...state,
        mergeDialogOpen: true,
      };
    case types.TRANSACTIONS_MERGE_DIALOG_CLOSE:
      return {
        ...state,
        mergeDialogOpen: false,
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
    case types.TRANSACTIONS_TAGGING_DIALOG_OPEN:
      return {
        ...state,
        taggingDialogOpen: true,
      };
    case types.TRANSACTIONS_TAGGING_DIALOG_CLOSE:
      return {
        ...state,
        taggingDialogOpen: false,
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
    case String(addAttachment.pending):
      return {
        ...state,
        isUploadingAttachment: true,
        error: false,
        errorMessage: undefined,
        successMessage: undefined,
      };
    case String(addAttachment.fulfilled):
      if (transactionIndex !== -1) {
        fetchedTransactionsCopy[transactionIndex].attachments = [
          action.payload,
          ...fetchedTransactionsCopy[transactionIndex].attachments,
        ];
      }
      return {
        ...state,
        isUploadingAttachment: false,
        fetchedTransactions: fetchedTransactionsCopy,
        error: false,
      };
    case String(addAttachment.rejected):
      return {
        ...state,
        isUploadingAttachment: false,
        error: true,
        errorMessage: action.payload.message,
      };
    case String(removeAttachment.pending):
      return {
        ...state,
        error: false,
        errorMessage: undefined,
        successMessage: undefined,
      };
    case String(removeAttachment.fulfilled):
      if (transactionIndex !== -1) {
        fetchedTransactionsCopy[transactionIndex].attachments = fetchedTransactionsCopy[transactionIndex].attachments
          .filter((att) => att.id !== action.payload.id);
      }
      return {
        ...state,
        fetchedTransactions: fetchedTransactionsCopy,
        error: false,
      };
    case String(removeAttachment.rejected):
      return {
        ...state,
        error: true,
        errorMessage: action.payload.message,
      };
    case String(updatedAttachment.pending):
      return {
        ...state,
        error: false,
        errorMessage: undefined,
        successMessage: undefined,
      };
    case String(updatedAttachment.fulfilled):
      if (transactionIndex !== -1) {
        fetchedTransactionsCopy[transactionIndex].attachments[
          fetchedTransactionsCopy[transactionIndex].attachments
            .map((att) => att.id).indexOf(action.payload.id)
        ] = action.payload;
      }
      return {
        ...state,
        fetchedTransactions: fetchedTransactionsCopy,
        error: false,
      };
    case String(updatedAttachment.rejected):
      return {
        ...state,
        error: true,
        errorMessage: action.payload.message,
      };
    case types.TRANSACTIONS_HIDE_ALL_MSGS:
      return {
        ...state,
        errorMessage: undefined,
        successMessage: undefined,
      };
    default:
      return state;
  }
};

export default reducer;
