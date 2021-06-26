import React from 'react';
import { Global, css } from '@emotion/core';
import { createRoot } from 'react-dom';
import firebase from 'firebase/app'
import { FirebaseAppProvider, SuspenseWithPerf, preloadDatabase } from 'reactfire';

import AdminFab from './components/AdminFab';
import AndroidIntegration from './components/AndroidIntegration';
import Map from './components/Map';

window.idToken = null;

const firebaseConfig = {
  apiKey: "AIzaSyBISQp59u5IwILXV1RCL2OXfecYB3MdrFM",
  mapsApiKey: "AIzaSyB8Tl-Lx1tkHflw4Mukol6t6xEHdESMhiw",
  authDomain: "whereis-akp-tools-d2d6a.firebaseapp.com",
  databaseURL: "https://whereis-akp-tools-d2d6a.firebaseio.com",
  projectId: "whereis-akp-tools-d2d6a",
  storageBucket: "whereis-akp-tools-d2d6a.appspot.com",
  messagingSenderId: "942522057252",
  appId: "1:942522057252:web:7f7aca60ec434402eaceb1",
  measurementId: "G-MB24X6YFX9"
};

const App = () => {
  return (
    <>
      <Global
        styles={css`
          body, html, * { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        `}
      />
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <SuspenseWithPerf fallback={<p>loading...</p>} traceId={'load-placeId'}>
          <AndroidIntegration />
          <Map mapsApiKey={firebaseConfig.mapsApiKey} />
          <AdminFab />
        </SuspenseWithPerf>
      </FirebaseAppProvider>
    </>
  );
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

const doTheNeedful = async () => {
  await preloadDatabase({
    firebaseApp,
    setup: async (factory) => {
      const database = factory()

      // if (process.env.NODE_ENV !== 'production') {
      //   database.useEmulator('localhost', 9000)
      // }

      return database
    },
  });

  // Enable Concurrent Mode
  // https://reactjs.org/docs/concurrent-mode-adoption.html#enabling-concurrent-mode
  createRoot(document.getElementById('app')).render(<App />);
}

doTheNeedful();
