import type { Address } from "@/shared/typess/location";

export const getFormattedAddress = (location: Address): string => {
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
