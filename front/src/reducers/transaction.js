import { fetchAll } from '../actions/transaction';

const initialState = {
  isLoading: false,
  transactionsFetched: null,
  error: false,
  errorMessage: undefined,
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case String(fetchAll.pending):
      return {
        ...state,
        isLoading: true,
        transactionsFetched: null,
        error: false,
        errorMessage: undefined,
      };
    case String(fetchAll.fulfilled):
      return {
        ...state,
        isLoading: false,
        transactionsFetched: action.payload,
        error: false
      };
    case String(fetchAll.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload.message,
      };
    default:
      return state;
  }
}

export default reducer;
