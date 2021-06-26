import React from 'react';
import usePermissions from '../hooks/usePermissions';
import PreciseMap from './PreciseMap';
import ImpreciseMap from './ImpreciseMap';

export const Map = ({ mapsApiKey }: { mapsApiKey: string }) => {
  const permissions = usePermissions();

  if (permissions?.includes('viewPreciseLocation') || permissions?.includes('admin')) {
    return <PreciseMap mapsApiKey={mapsApiKey} />
  }

  return <ImpreciseMap mapsApiKey={mapsApiKey} />;
}

export default Map;
