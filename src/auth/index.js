
export const getUserInfo = () => {
  const ret = window.sessionStorage.getItem("firebase:authUser:AIzaSyCwNU0s6FikXidM6GFbLAUIqURYJ_jTMx4:[DEFAULT]");

  return JSON.parse(ret);
}

export const removeUserInfo = () => {
  window.sessionStorage.removeItem("firebase:authUser:AIzaSyCwNU0s6FikXidM6GFbLAUIqURYJ_jTMx4:[DEFAULT]");
  localStorage.removeItem('ACCESS_TOKEN');
}

export const getToken = () => {
  return localStorage.getItem('ACCESS_TOKEN')
  //return getUserInfo().stsTokenManager.accessToken;
}

export const getExpire = () => {
  return getUserInfo().stsTokenManager.expirationTime;

}
export const getUserPicture = () => {
  return getUserInfo().photoURL;
}

export const getUserName = () => {
  return getUserInfo().displayName;
}

export const getUid = () => {
  return getUserInfo().uid;
}




