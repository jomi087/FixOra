import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";


interface ProviderTandC {
    openConfirm: boolean;
    setOpenConfirm : (value: boolean) => void;
}


const ProviderTandC: React.FC<ProviderTandC> = ({ openConfirm, setOpenConfirm }) => {
    const navigate = useNavigate()
    
     return (
        <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Term's & Condition's</DialogTitle>
                    <DialogDescription className="prose  max-h-[300px] overflow-y-auto text-sm text-gray-500 space-y-3">
                        <p>By proceeding to become a provider on our platform, you agree to the following Terms and Conditions.</p>
                        <p>1. <strong>Eligibility:</strong> You must be at least 18 years old and legally permitted to work and offer services in your region.</p>
                        <p>2. <strong>Service Accuracy:</strong> You agree to provide accurate information about your services, availability, and qualifications.</p>
                        <p>3. <strong>KYC Verification:</strong> You agree to submit necessary documents for identity and background verification as part of our Know Your Customer (KYC) process.</p>
                        <p>4. <strong>Conduct:</strong> Providers must maintain professional behavior and respect towards customers. Any misuse of the platform may lead to suspension or permanent removal.</p>
                        <p>5. <strong>Commission:</strong> By registering, you agree to the commission structure and payment terms outlined in our Provider Agreement.</p>
                        <p>6. <strong>Privacy:</strong> Your personal and service-related data will be used in accordance with our Privacy Policy.</p>
                        <p>7. <strong>Termination:</strong> We reserve the right to revoke provider access at any time in case of policy violations or legal issues.</p>
                        <p>8. <strong>Modifications:</strong> Terms may be updated at any time. It is your responsibility to stay informed.</p>
                        <p>By clicking <strong>Confirm</strong>, you acknowledge that you have read, understood, and agreed to abide by these terms.</p>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                <Button variant="secondary" onClick={() => setOpenConfirm(false)}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                    setOpenConfirm(false);
                    navigate("/provider/KYC");
                    }}
                >
                    Confirm
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ProviderTandC