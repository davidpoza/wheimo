import { fetchAll, create } from '../actions/transaction';

const initialState = {
  isLoading: false,
  transactionsFetched: null,
  error: false,
  errorMessage: undefined,
};

/* eslint-disable no-case-declarations */
const reducer = (state = initialState, action) => {
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
      const newTransactionsFetched = [action.payload, ...state.transactionsFetched];
      return {
        ...state,
        isLoading: false,
        transactionsFetched: newTransactionsFetched,
        error: false,
      };
    case String(create.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload.message,
      };
    default:
      return state;
  }
};

export default reducer;
