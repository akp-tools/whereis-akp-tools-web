import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Client } from "@googlemaps/google-maps-services-js";

admin.initializeApp();

const GOOGLE_API_KEY = functions.config().google.key;
const client = new Client({});
const database = admin.database();
const rootRef = database.ref('/');

const DEFAULT_ERROR_PLACE_ID = "ChIJnXKOaXELs1IRgqNhl4MoExM";

const getConfigRef = () => {
  return rootRef.child('config');
}

const getIsEnabled = async () => {
  return (await getConfigRef().child('isEnabled').once('value')).val();
}

const getValidPlaceTypes = async () => {
  const allowedLocationTypesData = (await getConfigRef().child('allowedLocationTypes').once('value')).val();
  const keys = Object.keys(allowedLocationTypesData);

  const validValues = keys.filter((key) => allowedLocationTypesData[key]);

  return validValues;
}

const getDefaultPlaceId = async () => {
  return (await getConfigRef().child('defaultPlaceId').once('value')).val() || DEFAULT_ERROR_PLACE_ID;
}

const geocodeAndUpdateLocation = async (location: any, locationRef: admin.database.Reference) => {
  const isEnabled = await getIsEnabled();
  if (!isEnabled) {
    return null;
  }

  const defaultPlaceId = await getDefaultPlaceId()
  const allowedLocationTypes = await getValidPlaceTypes();
  return client.reverseGeocode({
    params: {
      key: GOOGLE_API_KEY,
      latlng: `${location.latitude},${location.longitude}`
    }
  }).then((response) => {
    if (response.data.status === 'OK') {
      const { results } = response.data;

      const validResults = results.filter((result) => {
        return result.types.some((type) => {
          return allowedLocationTypes.includes(type);
        });
      });

      const preciseLocationResult = results.filter((result) => {
        return result.types.some((type) => {
          // @ts-ignore plus_code definitely *does* exist.
          return type === 'plus_code';
        })
      })[0];

      const bestResult = validResults.length ? validResults[0] : null;

      const newLocation = {
        updatedAt: Date.now(),
        name: bestResult?.formatted_address || "No location found!",
        placeId: bestResult?.place_id || defaultPlaceId
      };

      const preciseLocation = {
        updatedAt: Date.now(),
        placeId: preciseLocationResult?.place_id || defaultPlaceId,
        latitude: location.latitude,
        longitude: location.longitude
      };

      return Promise.all([
        rootRef.child('results/all').set(results),
        rootRef.child('results/filtered').set(validResults),
        rootRef.child('results/best').set(bestResult),
        rootRef.child('results/precise').set(preciseLocationResult),
        locationRef?.set(newLocation),
        rootRef.child('preciseLocation').set(preciseLocation)
      ]);
    }

    const errorLocation = {
      updatedAt: Date.now(),
      name: response.data.error_message || "No location found!",
      placeId: defaultPlaceId,
      status: response.data.status,
      latitude: null,
      longitude: null
    };

    return Promise.all([
      rootRef.child('results').remove(),
      locationRef?.set(errorLocation),
      rootRef.child('preciseLocation').set(errorLocation),
      null,
      null,
      null
    ]);
  });
}

export const onLocationUpdate = functions.database.ref('newLocation').onUpdate(async (snapshot) => {
  const newLocation = snapshot.after.val();
  const locationRef = rootRef.child('location');

  return geocodeAndUpdateLocation(newLocation, locationRef);
});

export const onConfigUpdate = functions.database.ref('config').onUpdate(async (snapshot) => {
  const location = await (await rootRef.child('newLocation').once('value')).val();
  const locationRef = rootRef.child('location');

  return geocodeAndUpdateLocation(location, locationRef);
});

export const onNewUser = functions.auth.user().onCreate(async (newUser) => {
  const userRef = rootRef.child(`users/${newUser.uid}`);
  const permissionsRef = userRef.child('permissions');

  const permissionsData = await (await permissionsRef.once('value')).val();

  if (!permissionsData) {
    await permissionsRef.set({ viewer: true });
  }
});
