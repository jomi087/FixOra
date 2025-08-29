import { z } from "zod";
import { cityField,  stateField, districtField, firstNameField, lastNameField, latitudeField, localityField, longitudeField, mobileField, postalCodeField, houseInfoField, streetField } from "./fields";

export const editProfileSchema = z.object({
    fname: firstNameField,
    lname: lastNameField,
    mobile: mobileField,

    location: z.object({
        houseinfo: houseInfoField.optional(),  
        street: streetField.optional(), 
        district: districtField,
        city: cityField,
        locality: localityField,
        state: stateField,
        postalCode: postalCodeField,

        coordinates: z.object({
            latitude: latitudeField,
            longitude: longitudeField
        })
    }),
});

