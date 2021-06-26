import React from 'react';
import LastUpdated from './LastUpdated';
import { useLocation, usePreciseLocation } from '../hooks/useLocation';
import usePermissions from '../hooks/usePermissions';

export const Map = ({ mapsApiKey }: { mapsApiKey: string }) => {
  const { data: location, status: locationStatus } = useLocation();
  const { data: preciseLocation, status: preciseLocationStatus } = usePreciseLocation();
  const permissions = usePermissions();

  if (locationStatus === 'loading' || preciseLocationStatus === 'loading') {
    return <span>loading...</span>;
  }

  let locationToUse: any = location;

  if (permissions?.includes('viewPreciseLocation') || permissions?.includes('admin')) {
    locationToUse = preciseLocation;
  }

  return (
    <>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        src={`https://www.google.com/maps/embed/v1/place?q=place_id:${locationToUse.placeId}&key=${mapsApiKey}`}
      />
      <LastUpdated updatedAt={location.updatedAt} />
    </>
  );
}

export default Map;
