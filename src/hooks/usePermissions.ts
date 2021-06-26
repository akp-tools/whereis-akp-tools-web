import { useState, useEffect } from 'react';
import { useUser, useDatabase } from 'reactfire';
import firebase from 'firebase/app';

export const usePermissions = () => {
  const user = useUser();
  const database = useDatabase();
  const [permissions, setPermissions] = useState<string[]>();

  useEffect(() => {
    if (!user || !user.data || user.status !== 'success') {
      return;
    }

    const userRef = database.ref(`/users/${user.data.uid || null}`);
    const permissionsRef = userRef.child('permissions');

    const onNewPermissions = (snap: firebase.database.DataSnapshot) => {
      const newPermissions = snap.val();
      const permissionKeys = Object.keys(newPermissions);

      const filteredPermissions = permissionKeys.filter((key) => newPermissions[key]);

      setPermissions(filteredPermissions);
    };

    permissionsRef.on('value', onNewPermissions);

    return () => {
      permissionsRef.off();
    }
  }, [user.data?.uid]);

  return permissions;
}

export default usePermissions;
