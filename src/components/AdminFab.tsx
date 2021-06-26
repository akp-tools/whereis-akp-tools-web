import React from 'react';
import Fab from '@material-ui/core/Fab';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import MyLocationIcon from '@material-ui/icons/MyLocation';
import SettingsIcon from '@material-ui/icons/Settings';
import { useAuth, useUser } from 'reactfire';
import firebase from 'firebase/app';
import 'firebase/auth';

declare global {
  var Android: any;
}

import usePermissions from '../hooks/usePermissions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(4),
      right: theme.spacing(8),
    },
    fabHigher: {
      position: 'absolute',
      bottom: theme.spacing(12),
      right: theme.spacing(8.5),
    },
  }),
);

export const AdminFab = () => {
  const classes = useStyles();
  const user = useUser();
  const auth = useAuth();
  const permissions = usePermissions();

  const logIn = async () => {
    await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    window.location.reload();
  }

  const logOut = async () => {
    await auth.signOut();
    window.location.reload();
  }

  const LogOutFab = () => (
    <Fab color="primary" aria-label="logout" className={classes.fab} onClick={logOut}>
      <ExitToAppIcon />
    </Fab>
  )

  if (!user.data && !window.Android) {
    return (
      <Fab color="primary" aria-label="login" className={classes.fab} onClick={logIn}>
        <AccountCircleIcon />
      </Fab>
    );
  }

  if (!permissions?.includes('admin') && !window.Android) {
    return <LogOutFab />;
  }

  return (
    <>
      { window.Android ? null : <LogOutFab /> }
      { window.Android ? (
        <Fab
          color="primary"
          aria-label="location"
          className={classes.fab}
        >
          <MyLocationIcon />
        </Fab>
      ) : null }
    </>
  )
}

export default AdminFab;
