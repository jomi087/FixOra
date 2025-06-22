import type { AddressWithCoordinates } from "@/shared/Types/location";

export const getFormattedAddress = (location: AddressWithCoordinates): string => {
  return [
    location.houseinfo,
    location.street,
    location.locality,
    location.city,
    location.district,
    location.state,
    location.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
};
