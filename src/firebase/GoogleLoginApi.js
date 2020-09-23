import { signInWithGoogle } from '.';

async function authGoogle() {
  return await signInWithGoogle();
}
export default {
  authGoogle,
};
