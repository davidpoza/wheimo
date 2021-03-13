const actions = [
  // user
  'USER_RESET_STATE',
  // transactions
  'TRANSACTIONS_CONTEXT_MENU_CHANGE_INDEX',
  'TRANSACTIONS_CONTEXT_MENU_CHANGE_ID',
  'TRANSACTIONS_CONTEXT_MENU_CHANGE_POSITION',
  'TRANSACTIONS_CREATE_EDIT_DIALOG_OPEN',
  'TRANSACTIONS_CREATE_EDIT_DIALOG_CLOSE',
];

const actionTypes = {};
actions.forEach((action) => {
  actionTypes[action] = action;
});

export default actionTypes;
