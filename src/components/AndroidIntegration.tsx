import React from 'react';
import { useAuth, useUser } from 'reactfire'
import firebase from 'firebase/app';

declare global {
  var Android: any;
  var idToken: string;
  var setCredential: (credential: any) => void;
}

export const AndroidIntegration = () => {
  const user = useUser();
  const auth = useAuth();
  const [credential, setCredential] = React.useState<any>(null);
  const [signingIn, setSigningIn] = React.useState(false);

  React.useEffect(() => {
    const droid = window.Android;
    if (!droid) {
      return;
    }

    window.setCredential = (idToken: string) => setCredential(idToken);

    if (!user.data && user.status !== 'loading' && droid?.requestLogin) {
      droid.requestLogin();
    }

    if (credential && !user.data && user.status !== 'loading' && !signingIn) {
      const cred = firebase.auth.GoogleAuthProvider.credential(credential.idToken);
      setSigningIn(true);
      auth.signInWithCredential(cred).then(() => {
        window.location.reload();
      });
    }

    return () => {
      window.setCredential = null;
      delete window.setCredential;
    }

  }, [window.Android, credential, user, auth, signingIn, idToken])

  return null;
}

export default AndroidIntegration;
