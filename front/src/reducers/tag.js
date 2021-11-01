import {
  fetchAll, create, remove, update, apply
} from '../actions/tag';
import { azOrder } from '../utils/utilities';
import types from '../actions/types';

const initialState = {
  isLoading: false,
  fetchedTags: [],
  editDialogOpen: false,
  error: false,
  errorMessage: undefined,
};

const reducer = (state = initialState, action) => {
  const fetchedTagsCopy = [...state.fetchedTags];
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
        fetchedTags: [...state.fetchedTags, action.payload].sort(azOrder),
        error: false,
      };
    case String(create.rejected):
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
      fetchedTagsCopy.splice(action.payload, 1);
      return {
        ...state,
        isLoading: false,
        fetchedTags: fetchedTagsCopy,
        error: false,
      };
    case String(remove.rejected):
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
      fetchedTagsCopy[action.payload.index] = action.payload;
      return {
        ...state,
        isLoading: false,
        fetchedTags: fetchedTagsCopy,
        error: false,
      };
    case String(update.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload.message,
      };
    case types.TAGS_EDIT_DIALOG_OPEN:
      return {
        ...state,
        editDialogOpen: true,
      };
    case types.TAGS_EDIT_DIALOG_CLOSE:
      return {
        ...state,
        editDialogOpen: false,
      };
    case String(apply.pending):
      return {
        ...state,
        isLoading: true,
        error: false,
        errorMessage: undefined,
      };
    case String(apply.fulfilled):
      return {
        ...state,
        isLoading: false,
        error: false,
      };
    case String(apply.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    default:
      return state;
  }
};

export default reducer;
