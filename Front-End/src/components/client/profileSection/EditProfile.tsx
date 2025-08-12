import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ProfileEdit } from "@/shared/Types/user";
import type { Address } from "@/shared/Types/location";

import { getAddressFromCoordinates } from "@/utils/helper/reverseGeocodingLocation";
import { getFormattedAddress } from "@/utils/helper/formatedAddress";
import AuthService from "@/services/AuthService";
import { getCoordinatesFromAddress } from "@/utils/helper/forwardGeocodingLocation";
import { Userinfo } from "@/store/user/userSlice";
import { validateFName, validateLName, validateMobileNo } from "@/utils/validation/formValidation";
import AddressDialog from "../../common/Others/AddressDialog";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { Messages } from "@/utils/constant";


interface EditProfileProps {
    toggle: (editMode: boolean) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ toggle }) => {

    const { user } = useAppSelector((state) => state.auth);
    const [form, setForm] = useState<ProfileEdit>({
        fname: user?.fname || "",
        lname: user?.lname || "",
        mobile: user?.mobileNo || "",
        location: user?.location || {
            houseinfo: "",
            street: "",
            district: "",
            city: "",
            locality: "",
            state: "",
            postalCode: "",
            coordinates: {
                latitude: 0,
                longitude: 0
            }
        }
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleClearAddress = () => {
        setForm((prev) => ({
            ...prev,
            location: {
                houseinfo: "",
                street: "",
                district: "",
                city: "",
                locality: "",
                state: "",
                postalCode: "",
                coordinates: { latitude: 0, longitude: 0 }
            }
        })
    )}

    const handleGetLocation = () => {
        if (loading) return;

        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);

        const options = {
            maximumAge: 0,
            enableHighAccuracy: true,
            timeout : 15000
        }

        navigator.geolocation.getCurrentPosition(
            async (position: GeolocationPosition) => {
                const { latitude, longitude } = position.coords;
                try {
                    const address = await getAddressFromCoordinates(latitude, longitude);
                    console.log(address)
                    setForm((prev) => ({
                        ...prev,
                        location: {
                            houseinfo: "",
                            street: address.road != "unnamed road" ? address.road : "",
                            district: address.state_district,
                            city: address._normalized_city ,
                            locality: address.county,
                            state: address.state,
                            postalCode: address.postcode,
                            coordinates: { latitude: latitude , longitude: longitude }
                        }
                    }))

                } catch (error:any) {
                    const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_FETCH_ADDRESS_CORDINATES;
                    toast.error(errorMsg);
                } finally {
                     setLoading(false);;
                }
            },
            (error) => {
                toast.error(`Location error: ${error.message}`);
                 setLoading(false);
            },
            options
        );
    };

    const handleSetLocation = async(formData : Address) => {
        setLoading(true)
        try {
            const addressString = [
                //formData.houseinfo,formData.street, // the resone  i commented  cz  while formwardGeocoding is not wrk  well wil this both fileds so i avodied it 
                formData.locality,
                formData.city,
                formData.state,
                formData.district,
                formData.postalCode,
            ]
                .filter(Boolean)
                .join(', ')
            
            const { latitude, longitude } = await getCoordinatesFromAddress(addressString);

            const AddressWithCoordinates = {
                ...formData,
                coordinates: { latitude, longitude }
            }

            setForm((prev) => ({
                ...prev,
                location: AddressWithCoordinates
            }));

            setIsDialogOpen(false);
        } catch (error:any) {
            const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_FETCH_CORDINATES;
            toast.error(errorMsg);
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        const fnameError = validateFName(form.fname)
        const lnameError  = validateLName(form.lname)
        const mobileNumberError = validateMobileNo(form.mobile)
        

        if (fnameError || lnameError || mobileNumberError) {
            toast.error(fnameError || lnameError || mobileNumberError);
            return;
        }

        const isSame = (
            form.fname === user?.fname &&
            form.lname === user?.lname &&
            form.mobile === user?.mobileNo &&
            JSON.stringify(form.location) === JSON.stringify(user?.location)
        );

        if (isSame) {
            toast.info("No changes Made.");
            return;
        }

        setLoading(true)
        try {
            const res = await AuthService.editProfileApi(form)
            if (res.status == HttpStatusCode.OK) {
                console.log(res.data)
                dispatch(Userinfo({ user: { ...user, ...res.data.user } }));
                toast.success("Updated");
                toggle(false)
            }
        } catch (error:any) {
            const errorMsg = error?.response?.data?.message ||Messages.PROFILE_MODIFICATION_FAILED;
            toast.error(errorMsg);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex-1 p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">My Profile </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name */}
                <div>
                <Label htmlFor="fname" className="mb-2 ml-1 ">First Name</Label>
                <Input
                    id="fname"
                    name="fname"
                    value={form.fname}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="dark:text-white"
                />
                </div>

                {/* Last Name */}
                <div>
                <Label htmlFor="lname" className="mb-2 ml-1 ">Last Name</Label>
                <Input
                    id="lname"
                    name="lname"
                    value={form.lname}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="dark:text-white"
                />
                </div>

                {/* Mobile */}
                <div>
                <Label htmlFor="mobile" className="mb-2 ml-1 ">Mobile Number</Label>
                <Input
                    id="mobile"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    className="dark:text-white"
                    placeholder="Enter mobile number"
                />
                </div>

                {/* Address */}
                <div>
                    <Label htmlFor="address" className="mb-2 ml-1 ">Address</Label>
                    <div className="flex items-center gap-x-1">
                        <Input
                            id="address"
                            name="address"
                            value={getFormattedAddress(form.location)}
                            onChange={handleChange}
                            placeholder="Address"
                            className="dark:text-white flex-1"
                            readOnly
                        />
                        <Button type="button" onClick={handleClearAddress} variant="outline"> X </Button>
                    </div>
                    <div className="flex justify-between flex-wrap">
                        
                        {/* Modal version */}
                        <AddressDialog
                            saveAdress={handleSetLocation}
                            open={isDialogOpen}
                            setOpen={setIsDialogOpen}
                            processing={loading}
                        />

                        <Button
                            type="button"
                            variant="outline"
                            className="mt-2"
                            onClick={handleGetLocation}
                            disabled={loading}
                        >
                            Use Current Location
                        </Button>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between">
                    <Button type="submit" disabled={loading}>Update Profile</Button>
                    <Button variant="outline" type="button"
                        onClick={() => toggle(false)}
                    >
                        Go Back
                    </Button>
                </div>
            </form>
        </div >
    );
};

export default EditProfile;
