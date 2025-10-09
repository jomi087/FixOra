import axios, { AxiosError } from "axios";
import type { Coordinates } from "@/shared/Types/location";


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