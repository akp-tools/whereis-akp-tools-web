import React from 'react';
import LastUpdated from './LastUpdated';
import { useLocation } from '../hooks/useLocation';

export const ImpreciseMap = ({ mapsApiKey }: { mapsApiKey: string }) => {
  const { data: location, status: locationStatus } = useLocation();

  if (locationStatus === 'loading') {
    return <span>loading...</span>;
  }

  return (
    <>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        src={`https://www.google.com/maps/embed/v1/place?q=place_id:${location.placeId}&key=${mapsApiKey}`}
      />
      <LastUpdated updatedAt={location.updatedAt} />
    </>
  );
}

export default ImpreciseMap;
