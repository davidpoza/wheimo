const actions = [
  // user
  'USER_RESET_STATE',
  'USER_SETTINGS_DIALOG_OPEN',
  'USER_SETTINGS_DIALOG_CLOSE',
  // TRANSACTIONS
  'TRANSACTIONS_CREATE_EDIT_DIALOG_OPEN',
  'TRANSACTIONS_CREATE_EDIT_DIALOG_CLOSE',
  'TRANSACTIONS_TOGGLE_CHECKBOX',
  'TRANSACTIONS_DETAILS_DIALOG_OPEN',
  'TRANSACTIONS_DETAILS_DIALOG_CLOSE',
  'TRANSACTIONS_TOGGLE_CHARTS',
  'TRANSACTIONS_SET_PAGE',
  // UI
  'UI_CONTEXT_MENU_CHANGE_INDEX',
  'UI_CONTEXT_MENU_CHANGE_ID',
  'UI_CONTEXT_MENU_CHANGE_POSITION',
  'UI_OPEN_DRAWER',
  'UI_CLOSE_DRAWER',
  // TAG
  'TAGS_EDIT_DIALOG_OPEN',
  'TAGS_EDIT_DIALOG_CLOSE',
  'TAGS_SET_PAGE',
  // ACCOUNt
  'ACCOUNTS_EDIT_DIALOG_OPEN',
  'ACCOUNTS_EDIT_DIALOG_CLOSE',
];

const actionTypes = {};
actions.forEach((action) => {
  actionTypes[action] = action;
});

export default actionTypes;
