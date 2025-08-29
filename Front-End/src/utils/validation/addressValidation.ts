export const validateHouseInfo = (houseInfo: string): string | null => {
  if (!houseInfo.trim()) return "House info is required";
  return null;
};

export const validateStreet = (street: string): string | null => {
  if (!street.trim()) return "Street is required";
  return null;
};

export const validateDistrict = (district: string): string | null => {
  if (!district.trim()) return "District is required";
  return null;
};

export const validateCity = (city: string): string | null => {
  if (!city.trim()) return "City is required";
  return null;
};

export const validateLocality = (locality: string): string | null => {
  if (!locality.trim()) return "Locality is required";
  return null;
};

export const validateState = (state: string): string | null => {
  if (!state.trim()) return "State is required";
  return null;
};

export const validatePostalCode = (postalCode: string): string | null => {
  const trimmed = postalCode.trim();
  if (!trimmed) return "Postal code is required";
  if (!/^\d+$/.test(trimmed)) return "Postal code must be numeric";
  if (trimmed.length !== 6) return "Postal code must be exactly 6 digits";
  return null;
};
