import i18n from 'utils/i18n';
import {
  fetchAll, create, remove, update, apply, untag, setPage,
} from '../actions/tag';
import { azOrder } from '../utils/utilities';
import types from '../actions/types';

const initialState = {
  isLoading: false,
  fetchedTags: [],
  editDialogOpen: false,
  error: false,
  errorMessage: undefined,
  successMessage: undefined,
  page: 1,
};
const reducer = (state = initialState, action) => {
  const lng = localStorage.getItem('lang');
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
        successMessage: undefined,
      };
    case String(create.fulfilled):
      return {
        ...state,
        isLoading: false,
        fetchedTags: [...state.fetchedTags, action.payload].sort(azOrder),
        successMessage: i18n.t('successMessages.createTag', { lng }),
        error: false,
      };
    case String(create.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: i18n.t('errorMessages.createTag', { lng })
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
      fetchedTagsCopy.splice(action.payload, 1);
      return {
        ...state,
        isLoading: false,
        fetchedTags: fetchedTagsCopy,
        error: false,
        successMessage: i18n.t('successMessages.deleteTag', { lng })
      };
    case String(remove.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: i18n.t('errorMessages.deleteTag', { lng })
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
      fetchedTagsCopy[action.payload.index] = action.payload;
      return {
        ...state,
        isLoading: false,
        fetchedTags: fetchedTagsCopy,
        successMessage: i18n.t('successMessages.updateTag', { lng }),
        error: false,
      };
    case String(update.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: i18n.t('errorMessages.updateTag', { lng })
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
        successMessage: undefined,
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
    case String(untag.pending):
      return {
        ...state,
        isLoading: true,
        error: false,
        errorMessage: undefined,
        successMessage: undefined,
      };
    case String(untag.fulfilled):
      return {
        ...state,
        isLoading: false,
        error: false,
      };
    case String(untag.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case types.TAGS_SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };
    case types.TAGS_HIDE_ALL_MSGS:
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
