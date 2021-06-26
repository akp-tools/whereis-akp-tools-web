import { useDatabase, useDatabaseObjectData } from 'reactfire';

interface Location {
  name: string;
  placeId: string;
  updatedAt: number;
}

interface PreciseLocation {
  placeId: string;
  latitude: number;
  longitude: number;
  updatedAt: number;
}

export const useLocation = () => {
  const locationRef = useDatabase().ref('location');
  const location = useDatabaseObjectData<Location>(locationRef);

  return location;
}

export const usePreciseLocation = () => {
  const preciseLocationRef = useDatabase().ref('preciseLocation');
  const preciseLocation = useDatabaseObjectData<PreciseLocation>(preciseLocationRef);

  return preciseLocation;
}

export default useLocation;
