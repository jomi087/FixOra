import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProviderTandCProps {
    openConfirm: boolean;
    setOpenConfirm: (value: boolean) => void;
}

const ProviderTandC: React.FC<ProviderTandCProps> = ({ openConfirm, setOpenConfirm }) => {
  const navigate = useNavigate();

  return (
    <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms & Conditions</DialogTitle>

          {/* Use asChild so it doesn't wrap in a <p> */}
          <DialogDescription asChild>
            <div className="prose max-h-[300px] overflow-y-auto text-sm text-gray-500 space-y-3">
              <p>By proceeding to become a provider on our platform, you agree to the following Terms and Conditions.</p>
              <p>1. <strong>Eligibility:</strong> You must be at least 18 years old and legally permitted to work and offer services in your region.</p>
              <p>2. <strong>Service Accuracy:</strong> You agree to provide accurate information about your services, availability, and qualifications.</p>
              <p>3. <strong>KYC Verification:</strong> You agree to submit necessary documents for identity and background verification as part of our Know Your Customer (KYC) process.</p>
              <p>4. <strong>Conduct:</strong> Providers must maintain professional behavior and respect towards customers. Any misuse of the platform may lead to suspension or permanent removal.</p>
              <p>5. <strong>Commission:</strong> By registering, you agree to the commission structure and payment terms outlined in our Provider Agreement.</p>
              <p>6. <strong>Privacy:</strong> Your personal and service-related data will be used in accordance with our Privacy Policy.</p>
              <p>7. <strong>Termination:</strong> We reserve the right to revoke provider access at ny time in case of policy violations or legal issues.</p>
              <p>8. <strong>Transportation:</strong> It is recommended to have your own vehicle for smooth operations. You will be paid an additional ₹30 fuel allowance for every 5 km travelled beyond the initial service area (fuel allowance may vary depending on current fuel prices).</p>
              <p>9. <strong>Modifications:</strong> Terms may be updated at ny time. It is your responsibility to stay informed.</p>
              <p>By clicking <strong>Confirm</strong>, you acknowledge that you have read, understood, and agreed to abide by these terms.</p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpenConfirm(false)}>
                        Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenConfirm(false);
              navigate("/customer/provider-KYC");
            }}
          >
                        Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderTandC;
