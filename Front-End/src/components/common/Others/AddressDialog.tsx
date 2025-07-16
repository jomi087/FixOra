import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import { Button } from "../../ui/button"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { useState } from "react"
import { getPostalInfo } from "@/utils/helper/postalinfo"
import { toast } from "react-toastify"
import { validateCity, validateState, validateDistrict, validateHouseInfo, validateLocality, validatePostalCode, validateStreet } from "@/utils/validation/addressValidation"
import type { Address } from "@/shared/Types/location"

interface AddAdressProps{
    saveAdress: (formData: Address) => Promise<void>;
    open: boolean;
    setOpen: (value: boolean) => void;
    processing : boolean
}

const AddressDialog:React.FC<AddAdressProps> = ({saveAdress,open,setOpen,processing}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setForm] = useState({
        houseinfo: "",
        street: "",
        district: "",
        city: "",
        locality: "",
        state : "",
        postalCode: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePostalCode = async () => {
        const pincode = formData.postalCode.trim();
        if (!pincode || pincode.length != 6 || loading  ) return
        
        try {
            setLoading(true);

            const result = await getPostalInfo(pincode)

            const { Block,District,Division,State,  } = result
            setForm(prev => ({
                ...prev,
                district: District || "",
                city: Division || "",
                locality: Block || "",
                state: State || ""
            }))
        } catch (error:any) {
            const errorMsg = error?.response?.data?.message ||"Failed to get info from postalCode";
            toast.error(errorMsg);
        }finally {
            setLoading(false)
        }
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (processing) return 
        
        const validations = [
            validateHouseInfo(formData.houseinfo),
            validateStreet(formData.street),
            validateDistrict(formData.district),
            validateCity(formData.city),
            validateLocality(formData.locality),
            validateState(formData.state),
            validatePostalCode(formData.postalCode),
        ];

        const hasError = validations.some((error) => error !== null);
        if (hasError) {
            toast.error("Field's are Missing");
            return;
        }
        saveAdress(formData)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="mt-2"
                    >
                        Add Location
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Location</DialogTitle>
                        <DialogDescription >
                            <span className='text-cyan-600'>Enter postal code for auto fill up</span>,
                            Click save when you&apos;re done.
                            <span className='text-red-600'> Also Make sure the name's you entered is correct</span>,
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <div className="grid gap-1">
                            <Label htmlFor="houseinfo"> House No/Building No/Name </Label>
                            <Input
                                id="houseinfo"
                                name="houseinfo"
                                value={formData.houseinfo}
                                onChange={handleChange}
                            />
                            {validateHouseInfo(formData.houseinfo) && (
                                <p className="text-orange-600 text-sm">{ validateHouseInfo(formData.houseinfo) }</p>
                            )}
                        </div>
                        <div className="flex gap-3 ">
                            <div className="grid gap-1">
                                <Label htmlFor="street">Street</Label>
                                <Input
                                    id="street"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                />
                                {validateStreet(formData.street) && (
                                    <p className="text-orange-600 text-sm">{ validateStreet(formData.street) }</p>
                                )}
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="district">District</Label>
                                <Input
                                    id="district"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                />
                                {validateDistrict(formData.district) && (
                                    <p className="text-orange-600 text-sm">{ validateDistrict(formData.district) }</p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="grid gap-1">
                                <Label htmlFor="city"> City </Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                                {validateCity(formData.city) && (
                                    <p className="text-orange-600 text-sm">{validateCity(formData.city)}</p>
                                )}
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="locality"> Locality </Label>
                                <Input
                                    id="locality"
                                    name="locality"
                                        value={formData.locality}
                                    onChange={handleChange}
                                />
                                {validateLocality(formData.locality) && (
                                    <p className="text-orange-600 text-sm">{validateLocality(formData.locality)}</p>
                                )}
                            </div>
                            
                        </div>
                        <div className="flex gap-3">
                            <div className="grid gap-1">
                                <Label htmlFor="state"> State </Label>
                                <Input
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                                {validateState(formData.state) && (
                                    <p className="text-orange-600 text-sm">{validateState(formData.state)}</p>
                                )}
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="postalCode"> Postal Code </Label>
                                <Input
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    onBlur={handlePostalCode}
                                />
                                {validatePostalCode(formData.postalCode) && (
                                    <p className="text-orange-600 text-sm">{validatePostalCode(formData.postalCode)}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={loading || processing}
                            onClick={handleSubmit}
                        >
                            {loading||processing ? "Loading..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddressDialog
