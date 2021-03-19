import { fetchAll } from '../actions/tag';
import types from '../actions/types';

const initialState = {
  isLoading: false,
  fetchedTags: [],
  error: false,
  errorMessage: undefined,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case String(fetchAll.pending):
      return {
        ...state,
        isLoading: true,
        error: false,
        errorMessage: undefined,
      };
    case String(fetchAll.fulfilled):
      return {
        ...state,
        isLoading: false,
        fetchedTags: action.payload,
        error: false,
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
};

export default reducer;
