import types from '../actions/types';

const initialState = {
  drawerOpen: false,
  contextMenuState: {
    mouseX: null,
    mouseY: null,
    index: null,
    id: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UI_CONTEXT_MENU_CHANGE_INDEX:
      return {
        ...state,
        contextMenuState: {
          ...state.contextMenuState,
          index: action.payload,
        },
      };
    case types.UI_CONTEXT_MENU_CHANGE_ID:
      return {
        ...state,
        contextMenuState: {
          ...state.contextMenuState,
          id: action.payload,
        },
      };
    case types.UI_CONTEXT_MENU_CHANGE_POSITION:
      return {
        ...state,
        contextMenuState: {
          ...state.contextMenuState,
          mouseX: action.payload.x,
          mouseY: action.payload.y,
        },
      };
    case types.UI_OPEN_DRAWER:
      return {
        ...state,
        drawerOpen: true,
      };
    case types.UI_CLOSE_DRAWER:
      return {
        ...state,
        drawerOpen: false,
      };
    default:
      return state;
  }
};

export default reducer;
