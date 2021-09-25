const getRecipientUid = (users, userLoggedIn) =>
  users?.filter((userToFilter) => userToFilter !== userLoggedIn?.uid)[0];

export default getRecipientUid;
