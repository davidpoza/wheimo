const actions = [
  // user
  'USER_RESET_STATE',
];

const actionTypes = {};
actions.forEach(action => {
  actionTypes[action] = action;
});

export default actionTypes;