import type { ProviderData } from "@/shared/Types/user";
import { getFormattedAddress } from "@/utils/helper/formatedAddress";
import { toPascalCase } from "@/utils/helper/utils";
import CustomLink from "../ui/Custom/CustomLink";

const ProviderBackSideInfoCard: React.FC<{ data: ProviderData }> = ({ data }) => {

    const subcategoryNames =
    data.service?.subcategories?.length > 0
      ? data.service.subcategories.map((s) =>toPascalCase(s.name)).join(" | ") : "N/A";

    const formattedAddress = data.user?.location ? getFormattedAddress(data.user.location) : "No address available";

  return (
    <div className="flex flex-col text-center h-full overflow-y-auto space-y-2">
        {/* Name */}
        <h3 className="text-sm font-bold">{`${toPascalCase(data.user.fname ?? "")} ${toPascalCase(data.user.lname ?? "")}`.trim()}</h3>
        
        {/* Address */} 
        <div className="border-b-2 border-black ">
            <h4 className="text-sm font-semibold text-start">Address</h4>
            <p className="text-[12px] mt-1 text-gray-600 font-serif dark:text-gray-300">{formattedAddress}</p>
        </div>

        {/* Services */}
        <div className="border-b-2 border-black ">
            <h4 className="text-sm font-semibold text-start">Specializations</h4>
            <p className="text-[13px] mt-1 text-gray-600 font-serif dark:text-gray-300">{subcategoryNames}</p>
        </div>

        {/* KYC Documents */}
        <div
            className="flex flex-wrap gap-2 w-full"
            onClick={(e)=>e.stopPropagation()}
        >
            <CustomLink href={data.kyc.idCard} label="🆔 ID Card" />
            <CustomLink href={data.kyc.certificate.education} label="🎓 Education Certificate" />
            { data.kyc.certificate.experience && (
                <CustomLink href={data.kyc.certificate.experience} label="💼 Experience Certificate" />
            )}
        </div>
    </div>
  );
};


export default ProviderBackSideInfoCard;

 