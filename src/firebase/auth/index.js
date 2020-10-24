import {auth} from '../'

export const getUserPicture = () => {
  return auth.currentUser.photoURL;
}

export const getUserName = () => {
  return auth.currentUser.displayName;
}

export const getUid = () => {
  return auth.currentUser.uid;
}




