import type { ProviderData } from "@/shared/types/user";
import { getFormattedAddress } from "@/utils/helper/formatedAddress";
import { toPascalCase } from "@/utils/helper/utils";
import { ImageModal } from "@/components/common/modal/ImageModal";

const ProviderBackSideInfoCard: React.FC<{ data: ProviderData }> = ({ data }) => {

  const subcategoryNames =
    data.service?.subcategories?.length > 0
      ? data.service.subcategories.map((s) => toPascalCase(s.name)).join(" | ") : "N/A";

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
        onClick={(e) => e.stopPropagation()}
      >
        <ImageModal
          src={data.kyc.idCard}
          alt="ID Card"
          trigger={
            <p
              className="block text-blue-500 dark:text-blue-500 hover:text-blue-800 text-sm font-semibold"
            >
              🆔 View ID Card
            </p>
          }
        />

        <ImageModal
          src={data.kyc.certificate.education}
          alt="Education Certificate"
          trigger={
            <p
              className="block text-blue-500 dark:text-blue-500 hover:text-blue-800 text-sm font-semibold"
            >
              🎓 Education Certificate
            </p>
          }
        />

        {data.kyc.certificate.experience && (
          <ImageModal
            src={data.kyc.certificate.experience}
            alt="Experience Certificate"
            trigger={
              <p
                className="block text-blue-500 dark:text-blue-500 hover:text-blue-800 text-sm font-semibold"
              >
                💼 Experience Certificate
              </p>
            }
          />
        )}


      </div>
    </div>
  );
};


export default ProviderBackSideInfoCard;

