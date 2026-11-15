import * as Location from "expo-location";
import { useCallback, useState } from "react";

export interface RegionData {
  city: string | null;
  region: string | null;
  country: string | null;
  postalCode: string | null;
  street: string | null;
  name: string | null;
}

interface UseLocation {
  region: RegionData | null;
  isLoading: boolean;
  /** User-facing message when location could not be read. */
  error: string | null;
  getLocation: () => Promise<void>;
}

/** Reads the device location once and reverse-geocodes it to an address. */
export const useLocation = (): UseLocation => {
  const [region, setRegion] = useState<RegionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission was denied.");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [address] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (address) {
        setRegion({
          city: address.city ?? null,
          region: address.region ?? null,
          country: address.country ?? null,
          postalCode: address.postalCode ?? null,
          street: address.street ?? null,
          name: address.name ?? null,
        });
      }
    } catch {
      setError("We couldn't read your location.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { region, isLoading, error, getLocation };
};
