const actions = [
  // user
  'USER_RESET_STATE',
  // transactions
  'TRANSACTIONS_CONTEXT_MENU_CHANGE_INDEX',
  'TRANSACTIONS_CONTEXT_MENU_CHANGE_ID',
  'TRANSACTIONS_CONTEXT_MENU_CHANGE_POSITION',
];

const actionTypes = {};
actions.forEach((action) => {
  actionTypes[action] = action;
});

export default actionTypes;
