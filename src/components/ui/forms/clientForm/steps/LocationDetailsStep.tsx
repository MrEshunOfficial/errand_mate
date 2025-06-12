// src/components/forms/ClientForm/steps/LocationDetailsStep.tsx
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Map, Building, Home, Compass } from "lucide-react";
import { ClientFormData } from "@/hooks/useClientFormHook";

// Ghana regions data
const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Central",
  "Eastern",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Brong-Ahafo",
  "Western North",
  "Ahafo",
  "Bono East",
  "Oti",
  "Savannah",
  "North East",
];

// Sample cities for Greater Accra (you can expand this)
const CITIES_BY_REGION: Record<string, string[]> = {
  "Greater Accra": [
    "Accra",
    "Tema",
    "Kasoa",
    "Madina",
    "Adenta",
    "Teshie",
    "Nungua",
    "Dansoman",
    "Achimota",
    "East Legon",
  ],
  Ashanti: [
    "Kumasi",
    "Obuasi",
    "Ejisu",
    "Konongo",
    "Mampong",
    "Bekwai",
    "Agogo",
  ],
  // Add more regions and cities as needed
};

const LocationDetailsStep: React.FC = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ClientFormData>();

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const selectedRegion = watch("location.region");
  const availableCities = selectedRegion
    ? CITIES_BY_REGION[selectedRegion] || []
    : [];

  // Handle region change
  const handleRegionChange = (region: string) => {
    setValue("location.region", region);
    // Clear city when region changes
    setValue("location.city", "");
    setValue("location.district", "");
  };

  // Handle GPS location detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const gpsCoords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setValue("location.gpsAddress", gpsCoords);
        setIsDetectingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to detect your location. Please enter it manually.");
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Location Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* GPS Address */}
          <FormField
            control={control}
            name="location.gpsAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  GPS Address / Coordinates *
                </FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        {...field}
                        placeholder="e.g., 5.603717, -0.186964 or gps digital address"
                        className={`pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                          errors.location?.gpsAddress
                            ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                            : ""
                        }`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDetectLocation}
                      disabled={isDetectingLocation}
                      className="h-11 px-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                      {isDetectingLocation ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
                      ) : (
                        <Compass className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription className="text-xs text-gray-500 dark:text-gray-400">
                  Click the compass button to auto-detect your current location,
                  or enter GPS coordinates manually.
                </FormDescription>
                <FormMessage className="text-xs text-red-600 dark:text-red-400" />
              </FormItem>
            )}
          />

          {/* Nearby Landmark */}
          <FormField
            control={control}
            name="location.nearbyLandmark"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Nearby Landmark *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      {...field}
                      placeholder="e.g., Near Accra Mall, Behind STC Station"
                      className={`pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                        errors.location?.nearbyLandmark
                          ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                          : ""
                      }`}
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-xs text-gray-500 dark:text-gray-400">
                  Help service providers find you by mentioning a well-known
                  landmark nearby.
                </FormDescription>
                <FormMessage className="text-xs text-red-600 dark:text-red-400" />
              </FormItem>
            )}
          />

          {/* Region and City Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Region */}
            <FormField
              control={control}
              name="location.region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Region *
                  </FormLabel>
                  <Select
                    onValueChange={handleRegionChange}
                    value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className={`h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                          errors.location?.region
                            ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                            : ""
                        }`}>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GHANA_REGIONS.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={control}
              name="location.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    City *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedRegion}>
                    <FormControl>
                      <SelectTrigger
                        className={`h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.location?.city
                            ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                            : ""
                        }`}>
                        <SelectValue
                          placeholder={
                            selectedRegion
                              ? "Select city"
                              : "Select region first"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                      {availableCities.length === 0 && selectedRegion && (
                        <SelectItem value="other" disabled>
                          No cities available - contact support
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* District and Locality Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* District */}
            <FormField
              control={control}
              name="location.district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    District *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        {...field}
                        placeholder="e.g., Accra Metropolitan"
                        className={`pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                          errors.location?.district
                            ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                            : ""
                        }`}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Locality */}
            <FormField
              control={control}
              name="location.locality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Locality / Neighborhood *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        {...field}
                        placeholder="e.g., East Legon, Dansoman"
                        className={`pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                          errors.location?.locality
                            ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                            : ""
                        }`}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Location Privacy & Usage
                </h4>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>
                    • Your location helps match you with nearby service
                    providers
                  </li>
                  <li>• GPS coordinates are used for accurate positioning</li>
                  <li>• Landmarks help providers find your location easily</li>
                  <li>• All location data is kept secure and private</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationDetailsStep;
