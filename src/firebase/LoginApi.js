import { signInWithGoogle, signInWithEmail } from '.';

async function authGoogle() {
  return await signInWithGoogle();
}

async function authEmail() {
  return await signInWithEmail();
}
export default {
  authGoogle,
  authEmail
};
