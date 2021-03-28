import {
  fetchAll, create, remove, update,
} from '../actions/account';

import types from '../actions/types';

const initialState = {
  isLoading: false,
  fetchedAccounts: [],
  editDialogOpen: false,
  error: false,
  errorMessage: undefined,
};

const reducer = (state = initialState, action) => {
  const fetchedAccountsCopy = [...state.fetchedAccounts];
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
        fetchedAccounts: action.payload,
        error: false,
      };
    case String(fetchAll.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload.message,
      };
    // case String(create.pending):
    //   return {
    //     ...state,
    //     isLoading: true,
    //     error: false,
    //     errorMessage: undefined,
    //   };
    // case String(create.fulfilled):
    //   return {
    //     ...state,
    //     isLoading: false,
    //     fetchedTags: [...state.fetchedTags, action.payload].sort(azOrder),
    //     error: false,
    //   };
    // case String(create.rejected):
    //   return {
    //     ...state,
    //     isLoading: false,
    //     error: true,
    //     errorMessage: action.payload.message,
    //   };
    // case String(remove.pending):
    //   return {
    //     ...state,
    //     isLoading: true,
    //     error: false,
    //     errorMessage: undefined,
    //   };
    // case String(remove.fulfilled):
    //   fetchedTagsCopy.splice(action.payload, 1);
    //   return {
    //     ...state,
    //     isLoading: false,
    //     fetchedTags: fetchedTagsCopy,
    //     error: false,
    //   };
    // case String(remove.rejected):
    //   return {
    //     ...state,
    //     isLoading: false,
    //     error: true,
    //     errorMessage: action.payload.message,
    //   };
    // case String(update.pending):
    //   return {
    //     ...state,
    //     isLoading: true,
    //     error: false,
    //     errorMessage: undefined,
    //   };
    // case String(update.fulfilled):
    //   fetchedTagsCopy[action.payload.index] = action.payload;
    //   return {
    //     ...state,
    //     isLoading: false,
    //     fetchedTags: fetchedTagsCopy,
    //     error: false,
    //   };
    // case String(update.rejected):
    //   return {
    //     ...state,
    //     isLoading: false,
    //     error: true,
    //     errorMessage: action.payload.message,
    //   };
    // case types.TAGS_EDIT_DIALOG_OPEN:
    //   return {
    //     ...state,
    //     editDialogOpen: true,
    //   };
    // case types.TAGS_EDIT_DIALOG_CLOSE:
    //   return {
    //     ...state,
    //     editDialogOpen: false,
    //   };
    default:
      return state;
  }
};

export default reducer;
