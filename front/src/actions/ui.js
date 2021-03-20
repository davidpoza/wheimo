import types from './types';

export const contextMenuChangeIndex = (index) => ({
  type: types.UI_CONTEXT_MENU_CHANGE_INDEX,
  payload: index,
});

export const contextMenuChangeId = (id) => ({
  type: types.UI_CONTEXT_MENU_CHANGE_ID,
  payload: id,
});

export const contextMenuChangePosition = (x, y) => ({
  type: types.UI_CONTEXT_MENU_CHANGE_POSITION,
  payload: { x, y },
});
