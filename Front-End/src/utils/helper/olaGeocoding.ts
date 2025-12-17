import AuthService from "@/services/AuthService";

// 1. Reverse Geocode (lat/lng → address)
export async function reverseGeocode(lat: number, lng: number) {
  try {
    console.log("calling reverseGeocode api");
    const res = await AuthService.reverseGeocode(lat, lng);
    return res.data.address;

  } catch (err) {
    console.error("Reverse geocoding error:", err);
    return "";
  }
}

// 2. Autocomplete
export async function autoCompleteSearch(query: string) {
  try {
    const res = await AuthService.autoCompleteSearch(query);
    return res.data;

  } catch (err) {
    console.error("Autocomplete error:", err);
    return [];
  }
}

// 3. Forward Geocoding (text → lat/lng)
export async function forwardGeocode(address: string) {
  try {
    const res = await AuthService.forwardGeocode(address);
    return res.data;

  } catch (err) {
    console.error("forwardGeocode error:", err);
    return [];
  }
}

/* Previous way

  // 1. Reverse Geocode (lat/lng → address)
  export async function reverseGeocode(lat: number, lng: number) {
    const res = await axios.get("https://api.olamaps.io/reverse_geocode", {
      params: { lat, lng, api_key: OLA_KEY },
    });

    return res.data?.results?.[0]?.formatted_address || "";
  }
  //axios.get("https://api.olamaps.io/reverse_geocode",{params..}) //this cause an cors error, 2 way to handle,add our url to ola origin or create a backend proxy i chose 2nd option cz its safe, 1st option will have a risk that api key will be exposed  

  */
