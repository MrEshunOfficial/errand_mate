// src/components/service-provider/LocationSection.tsx
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  MapPin,
  Navigation,
  Map,
  Landmark,
  LocateFixed,
  MapIcon,
} from "lucide-react";
import {
  ServiceProviderFormData,
  FormFieldErrors,
} from "@/hooks/useServiceProviderFormHook";

interface LocationSectionProps {
  formData: ServiceProviderFormData;
  errors: FormFieldErrors;
  updateNestedField: <
    K extends keyof ServiceProviderFormData,
    NK extends keyof ServiceProviderFormData[K]
  >(
    field: K,
    nestedField: NK,
    value: ServiceProviderFormData[K][NK]
  ) => void;
  validateField: (field: keyof ServiceProviderFormData) => boolean;
  getFieldError: (field: keyof ServiceProviderFormData) => string | undefined;
  disabled?: boolean;
}

// Ghana regions data
const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Central",
  "Eastern",
  "Northern",
  "Upper East",
  "Upper West",
  "Volta",
  "Brong Ahafo",
  "Western North",
  "Ahafo",
  "Bono",
  "Bono East",
  "Oti",
  "North East",
  "Savannah",
];

export const LocationSection: React.FC<LocationSectionProps> = ({
  formData,
  errors,
  updateNestedField,
  validateField,
  disabled = false,
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Initialize location with default values based on clientLocation interface
  const location = formData.location || {
    gpsAddress: "",
    nearbyLandmark: "",
    region: "",
    city: "",
    district: "",
    locality: "",
  };

  // Helper function to get nested field errors (similar to ContactDetailsSection)
  const getNestedFieldError = (field: string): string | undefined => {
    const locationErrors = errors.location;
    if (!locationErrors || typeof locationErrors !== "object") return undefined;

    return (locationErrors as Record<string, string>)[field];
  };

  const gpsAddressError = getNestedFieldError("gpsAddress");
  const nearbyLandmarkError = getNestedFieldError("nearbyLandmark");
  const regionError = getNestedFieldError("region");
  const cityError = getNestedFieldError("city");
  const districtError = getNestedFieldError("district");
  const localityError = getNestedFieldError("locality");

  const handleFieldBlur = () => {
    validateField("location");
  };

  // Get current GPS location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const gpsAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        updateNestedField("location", "gpsAddress", gpsAddress);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please enter it manually.");
        setIsGettingLocation(false);
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
      {/* GPS Address */}
      <div className="space-y-2">
        <Label
          htmlFor="gpsAddress"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center space-x-2">
            <Navigation className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>GPS Address</span>
            <span className="text-red-500">*</span>
          </div>
        </Label>
        <div className="flex space-x-2">
          <Input
            id="gpsAddress"
            type="text"
            value={location.gpsAddress}
            onChange={(e) =>
              updateNestedField("location", "gpsAddress", e.target.value)
            }
            onBlur={handleFieldBlur}
            disabled={disabled}
            placeholder="5.6037, -0.1870 or GA-123-4567"
            className={`flex-1 ${
              gpsAddressError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
            } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={getCurrentLocation}
            disabled={disabled || isGettingLocation}
            className="flex items-center space-x-2 px-3"
          >
            <MapPin
              className={`h-4 w-4 ${isGettingLocation ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">
              {isGettingLocation ? "Getting..." : "Get GPS"}
            </span>
          </Button>
        </div>
        {gpsAddressError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {gpsAddressError}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          GPS coordinates (latitude, longitude) or Ghana Post GPS address
        </p>
      </div>

      {/* Nearby Landmark */}
      <div className="space-y-2">
        <Label
          htmlFor="nearbyLandmark"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center space-x-2">
            <Map className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span>Nearby Landmark</span>
            <span className="text-red-500">*</span>
          </div>
        </Label>
        <Input
          id="nearbyLandmark"
          type="text"
          value={location.nearbyLandmark}
          onChange={(e) =>
            updateNestedField("location", "nearbyLandmark", e.target.value)
          }
          onBlur={handleFieldBlur}
          disabled={disabled}
          placeholder="e.g., Near Accra Mall, Behind Total Filling Station"
          className={`${
            nearbyLandmarkError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
        />
        {nearbyLandmarkError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {nearbyLandmarkError}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          A well-known landmark near your location for easy identification
        </p>
      </div>

      {/* Region */}
      <div className="space-y-2">
        <Label
          htmlFor="region"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center space-x-2">
            <MapIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>Region</span>
            <span className="text-red-500">*</span>
          </div>
        </Label>
        <Select
          value={location.region}
          onValueChange={(value) => {
            updateNestedField("location", "region", value);
            // Trigger validation after change
            setTimeout(() => validateField("location"), 0);
          }}
          disabled={disabled}
        >
          <SelectTrigger
            className={`${
              regionError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
            } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
          >
            <SelectValue placeholder="Select your region" />
          </SelectTrigger>
          <SelectContent>
            {GHANA_REGIONS.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {regionError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {regionError}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Select the region where your business is located
        </p>
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label
          htmlFor="city"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center space-x-2">
            <Landmark className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span>City/Town</span>
            <span className="text-red-500">*</span>
          </div>
        </Label>
        <Input
          id="city"
          type="text"
          value={location.city}
          onChange={(e) =>
            updateNestedField("location", "city", e.target.value)
          }
          onBlur={handleFieldBlur}
          disabled={disabled}
          placeholder="e.g., Accra, Kumasi, Cape Coast"
          className={`${
            cityError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
        />
        {cityError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{cityError}</AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          The city or town where your business operates
        </p>
      </div>

      {/* District */}
      <div className="space-y-2">
        <Label
          htmlFor="district"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center space-x-2">
            <LocateFixed className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span>District</span>
            <span className="text-red-500">*</span>
          </div>
        </Label>
        <Input
          id="district"
          type="text"
          value={location.district}
          onChange={(e) =>
            updateNestedField("location", "district", e.target.value)
          }
          onBlur={handleFieldBlur}
          disabled={disabled}
          placeholder="e.g., Accra Metropolitan, Oforikrom"
          className={`${
            districtError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
        />
        {districtError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {districtError}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          The administrative district of your location
        </p>
      </div>

      {/* Locality */}
      <div className="space-y-2">
        <Label
          htmlFor="locality"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Locality/Area</span>
            <span className="text-red-500">*</span>
          </div>
        </Label>
        <Input
          id="locality"
          type="text"
          value={location.locality}
          onChange={(e) =>
            updateNestedField("location", "locality", e.target.value)
          }
          onBlur={handleFieldBlur}
          disabled={disabled}
          placeholder="e.g., East Legon, Tema Station, Bantama"
          className={`${
            localityError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
        />
        {localityError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {localityError}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          The specific area or neighborhood within your city/town
        </p>
      </div>

      {/* Location Guidelines */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Location Information Guidelines
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>
            • GPS address is required for accurate location identification
          </li>
          <li>• Nearby landmark is required for easier navigation</li>
          <li>
            • Include Ghana Post GPS address (e.g., GA-123-4567) if available
          </li>
          <li>
            • Use the &quot;Get GPS&quot; button to auto-detect your current
            location
          </li>
          <li>• Ensure all location details are accurate and up-to-date</li>
          <li>• Double-check region and city information for correctness</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationSection;
