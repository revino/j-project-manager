import { signInWithGoogle } from '../firebase';

async function authGoogle() {
  return await signInWithGoogle();
}
export default {
  authGoogle,
};
