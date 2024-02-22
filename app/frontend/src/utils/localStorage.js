
export const addUserToLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
}

export const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  // if user is not null then return user else return null
  return user ? JSON.parse(user) : null;
}
