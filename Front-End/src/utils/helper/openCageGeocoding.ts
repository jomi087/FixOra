import axios, { AxiosError } from "axios";
import type { Coordinates } from "@/shared/typess/location";

// Reverse Geocode (lat/lng → address)
export const getAddressFromCoordinates = async (lat: number, lon: number) => {
  try {
    const res = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
      params: {  //for query params are written like this in axios  for path param we can write directly (example shown in pincodeInfo.ts )
        q: `${lat}+${lon}`,
        key: import.meta.env.VITE_OPENCAGE_API_KEY,
        language: "en",
        roadinfo: 1,

      },
    });
    return res.data?.results[0]?.components;

  } catch (error) {
    console.error("Axios error in getAddressFromCoordinates:", error);
    throw new Error("Unable to retrieve address from coordinates.");
  }
};

// Forward Geocoding (text → lat/lng)
export const getCoordinatesFromAddress = async (address: string): Promise<Coordinates> => {
  try {
    const res = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
      params: {
        key: import.meta.env.VITE_OPENCAGE_API_KEY,
        q: address,
        limit: 1, //Return only the first best-matching result.
        no_annotation: 1,  //Do not include extra metadata like timezone, currency, calling code
        countrycode: "in",
      }
    });
    const result = res.data.results?.[0];

    if (!result) {
      throw new Error("No result found form the given address");
    }

    const { lat, lng } = result.geometry;
    return { latitude: lat, longitude: lng };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Forward geocoding error:", error.message);
    throw new Error("Unable to get coordinates from address.");
  }
};

/* 
    I have used https://opencagedata.com/ 
    for getting actual address from the log and lat 
*/