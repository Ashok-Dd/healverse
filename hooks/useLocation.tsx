import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

// Location data type
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

// Region/Address data type
export interface RegionData {
  city: string | null;
  region: string | null;
  country: string | null;
  postalCode: string | null;
  street: string | null;
  name: string | null;
}

// Hook return type
interface UseLocation {
  location: LocationData | null;
  region: RegionData | null;
  isLoading: boolean;
  error: string | null;
  getLocation: () => Promise<void>;
  clearError: () => void;
}

/**
 * Simple hook for getting user location with reverse geocoding
 */
export const useLocation = (): UseLocation => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [region, setRegion] = useState<RegionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request and check permission
  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is needed to access your location.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  };

  // Get location and reverse geocode
  const getLocation = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Request permission
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setError('Location permission denied');
        return;
      }

      // Get current location
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData: LocationData = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy,
      };

      setLocation(locationData);

      // Reverse geocode to get region/address
      const [address] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (address) {
        const regionData: RegionData = {
          city: address.city || null,
          region: address.region || null,
          country: address.country || null,
          postalCode: address.postalCode || null,
          street: address.street || null,
          name: address.name || null,
        };

        setRegion(regionData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      console.error('Location error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    location,
    region,
    isLoading,
    error,
    getLocation,
    clearError,
  };
};