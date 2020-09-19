import {auth} from '../firebase'

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
}

export const getExpire = async() => {
  const token = await auth.currentUser.getIdTokenResult()
  return token.expirationTime;
}
export const getUserPicture = () => {
  return auth.currentUser.photoURL;
    
}

export const getUserName = () => {
  return auth.currentUser.displayName;
}

export const getUid = () => {
  return auth.currentUser.uid;
}




