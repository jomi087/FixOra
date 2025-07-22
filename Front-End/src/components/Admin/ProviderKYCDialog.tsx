import {Dialog,DialogContent,} from "@/components/ui/dialog";
import AuthService from "@/services/AuthService";
import type { ProviderList } from "@/shared/Types/user";
import { formatDOB, toPascalCase } from "@/utils/helper/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import ReasonDialog from "../common/Others/ReasonDialog";
import { KYCStatus } from "@/shared/enums/KycStatus";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";


interface ProviderKYCDialogProps {
  selectedProvider: ProviderList | null;
  setSelectedProvider: (provider: ProviderList | null) => void;
}

const ProviderKYCDialog: React.FC<ProviderKYCDialogProps> = ({ selectedProvider, setSelectedProvider }) => {
  const [loading, setLoading] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  if (!selectedProvider) return null;
  
  const handleApprove = async() => {
    setLoading(true)
    try {      
      const res = await AuthService.updateProviderKYC(selectedProvider.id,{action:KYCStatus.Approved})
      if (res.status === HttpStatusCode.OK ) {
        toast.success("KYC Approved");
        setSelectedProvider(null);
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Failed to Approve application";
      toast.error(errorMsg);
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async(reason:string) => {
    setLoading(true)
    try {
      const res = await AuthService.updateProviderKYC(selectedProvider.id,{ action: KYCStatus.Rejected, reason })
      if (res.status === HttpStatusCode.OK) {
        toast.success("KYC Rejected");
        setRejectDialogOpen(false); 
        setSelectedProvider(null);
      }

    } catch (error: any) {
      
      const errorMsg = error?.response?.data?.message || "Failed to  Reject application";
      toast.error(errorMsg);

    } finally {
      setLoading(false)
    }
  }
  

  return (
    <Dialog
      open={!!selectedProvider}
      onOpenChange={(open) => !open && setSelectedProvider(null)}
    >
      <DialogContent className="!max-w-2xl w-full rounded-none  shadow-xl h-full overflow-auto p-0  gap-0">
        <div className="flex flex-col md:flex-row gap-6 bg-hero-background font-serif ">
          
          {/* Profile Image */}
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <div className="w-52 h-52 shadow-lg overflow-hidden">
              <img
                src={selectedProvider.profileImage}
                alt={`${selectedProvider.user.fname} ${selectedProvider.user.lname}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 pt-3 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-xl underline mt-1">
                {selectedProvider.serviceName.toUpperCase()}
              </p>
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full mr-10 ${
                  selectedProvider.status === "Pending"
                    ? "bg-yellow-200 text-yellow-900": selectedProvider.status === "Approved"
                    ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"
                }`}
              >
                {selectedProvider.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 gap-x-6 gap-y-1 text-base">
              <p><span className="font-medium">👤 Name:</span> {`${toPascalCase(selectedProvider.user.fname)} ${toPascalCase(selectedProvider.user.lname)}`}</p>
              <p><span className="font-medium">📧 Email:</span> {selectedProvider.user.email}</p>
              <p><span className="font-medium">📱 Mobile:</span> {selectedProvider.user.mobileNo}</p>
              <p><span className="font-medium">🎂 DOB:</span> {formatDOB(selectedProvider.dob)}</p>
              <p><span className="font-medium">🚻 Gender:</span> {selectedProvider.gender}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 bg-body-background ">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-5 rounded-lg shadow-sm border">
              <h3 className=" font-semibold text-lg flex items-center gap-2 border-b pb-2 mb-3">
                📍 Location
              </h3>
              <p className="text-sm leading-relaxed">
                {selectedProvider.user.location.street},{" "}
                {selectedProvider.user.location.city},{" "}
                {selectedProvider.user.location.district},{" "}
                {selectedProvider.user.location.state},{" "}
                {selectedProvider.user.location.postalCode}
              </p>
            </div>

            <div className="p-5 rounded-lg shadow-sm border">
              <h3 className=" font-semibold text-lg flex items-center gap-2 border-b pb-2 mb-3">
                🛠 Service Details
              </h3>
              <div className="space-y-2 text-sm ">
                <p>
                  <span className="font-medium">Service:</span> {selectedProvider.serviceName}
                </p>
                <p>
                  <span className="font-medium">Specializations:</span>{" "}
                  {selectedProvider.specializationNames
                    .map((s) => toPascalCase(s)).join(" | ")}
                </p>
                <p>
                  <span className="font-medium">Service Charge:</span> ₹{selectedProvider.serviceCharge}
                </p>
              </div>
            </div>
          </div>

          {selectedProvider.reason && (
            <div className="bg-white p-5 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2 mb-3">
                ⚠️ Reason
              </h3>
              <p className="text-sm text-red-700 leading-relaxed">
                {selectedProvider.reason}
              </p>
            </div>
          )}

          <div className="p-5 rounded-lg shadow-sm border">
            <h3 className=" font-semibold text-lg flex items-center  gap-2 border-b pb-2 mb-4">
              📝 KYC Documents
            </h3>
            <div className="flex flex-wrap justify-between gap-3">
              <a
                href={selectedProvider.kyc.idCard}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
              >
                🆔 View ID Card
              </a>
              <a
                href={selectedProvider.kyc.certificate.education}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-green-500 text-green-600 hover:bg-green-50 transition"
              >
                🎓 Education Certificate
              </a>
              { selectedProvider.kyc.certificate.experience && (
                <a
                  href={selectedProvider.kyc.certificate.experience}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-purple-500 text-purple-600 hover:bg-purple-50 transition"
                >
                  💼 Experience Certificate
                </a>
              )}

            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button
              onClick={handleApprove}
              variant="success"
              disabled={loading}
            >
              ✅ Approve
            </Button>
            {/*Reject with reason*/}
            <ReasonDialog handleRejectOnConfirm={handleReject} loading={loading} open={rejectDialogOpen} setOpen={setRejectDialogOpen} />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderKYCDialog;
