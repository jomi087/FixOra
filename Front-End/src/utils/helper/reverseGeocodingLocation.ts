// utils/location.ts
import axios from "axios";

export const getAddressFromCoordinates = async (lat: number, lon: number) => {
  try {
    console.log(lat,lon);
    const res = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
      params: {  //for query params are written like this in axios  for path param we can write directly (example shown in pincodeInfo.ts )
        q:`${lat}+${lon}`,
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

/* 
    I have used https://opencagedata.com/ 
    for getting actual address from the log and lat 
*/