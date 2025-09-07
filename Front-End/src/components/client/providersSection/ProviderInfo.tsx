import { useAppSelector } from "@/store/hooks";
import { toPascalCase } from "@/utils/helper/utils";
import { GiPathDistance } from "react-icons/gi";
import { IoPeopleSharp } from "react-icons/io5";
import { PiMathOperationsLight } from "react-icons/pi";
import { Skeleton } from "@/components/ui/skeleton";

const ProviderInfo: React.FC = () => {
  const { data } = useAppSelector((state) => state.providerInfo);

  return (
    <>
      {!data ? (
      // shimmer ui
        <div className="mt-5 flex flex-col lg:flex-row gap-10">
          <div className="flex flex-col lg:flex-row gap-6 border p-6 rounded-xl w-full shadow-sm">
            <div className="flex flex-col items-center gap-3 ">
              <Skeleton className="h-4 w-32 bg-primary/10" />
              <Skeleton className="w-52 h-52 rounded-xl bg-primary/10" />
            </div>

            <div className="w-full md:w-[70%] sm:border-r px-6">
              <div className="space-y-4 py-5 md:pt-10 ">
                <Skeleton className="h-4 w-24 bg-primary/15" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-20 bg-primary/16" />
                  <Skeleton className="h-4 w-32 bg-primary/16" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-20 bg-primary/15" />
                  <Skeleton className="h-4 w-24 bg-primary/15" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-28 bg-primary/15" />
                  <Skeleton className="h-4 w-20 bg-primary/15" />
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-10 w-full md:w-[50%] px-4 space-y-2">
              <Skeleton className="h-4 w-32 bg-primary/15" />
              <Skeleton className="h-3 w-40 bg-primary/15" />
              <Skeleton className="h-3 w-36 bg-primary/15" />
              <Skeleton className="h-3 w-44 bg-primary/15" />
            </div>
          </div>
          <div className="border p-6 rounded-xl shadow-sm w-full lg:w-2/5 space-y-4">
            <Skeleton className="h-4 w-24 bg-primary/10" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-40 bg-primary/10" />
              <Skeleton className="h-4 w-36 bg-primary/10" />
              <Skeleton className="h-4 w-44 bg-primary/10" />
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <Skeleton className="h-3 w-60 bg-primary/10" />
              <Skeleton className="h-3 w-56 bg-primary/10" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-col lg:flex-row gap-10 overflow-clip rounded-xl ">
          <div className="flex flex-col sm:flex-row  gap-6 shadow-xl shadow-ring border-2  p-6 rounded-xl w-full">
            <div className="flex flex-col items-center gap-2 ">
              <p className="text-base font-serif text-center uppercase underline underline-offset-4">
                {data.service.name}
              </p>
              <div className="w-48 h-50 rounded-2xl shadow-lg">
                <img
                  src={data.profileImage}
                  alt={`${data.user.fname} ${data.user.lname}`}
                  className="w-full h-full object-contain sm:object-cover rounded-4xl "
                />
              </div>
            </div>

            <div className="w-full md:w-[70%] sm:border-r-2 text-body-text">
              <div className="space-y-2 text-[15px] sm:text-base lg:p-5 sm:pt-10 w-full h-full items-center font-medium">
                <h4 className="font-semibold text-sm mb-2 md:mb-3 underline">INFORMATION</h4>
                <div className="flex flex-row sm:flex-wrap ">
                  <span className="w-35 sm:underline md:no-underline">Name:</span>
                  <span className="">{`${toPascalCase(data.user.fname)} ${toPascalCase(data.user.lname)}`}</span>
                </div>
                <div className="flex flex-row sm:flex-wrap">
                  <span className="w-35 sm:underline md:no-underline ">Gender:</span>
                  <span>{data.gender}</span>
                </div>
                <div className="flex flex-row sm:flex-wrap">
                  <span className="w-35 sm:underline md:no-underline ">Service Charge:</span>
                  <span>{data?.serviceCharge}₹</span>
                </div>
              </div>
            </div>

            <div className="mt-10 w-full md:w-[50%]  text-body-text">
              <h4 className="font-semibold text-sm mb-2 underline">Subcategories:</h4>
              <ul className="list-disc ml-5 text-base font-mono space-y-1">
                {data.service.subcategories.map((sub) => (
                  <li key={sub.subCategoryId}>{toPascalCase(sub.name)}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className=" shadow-lg shadow-ring border-2  p-6 rounded-xl w-full lg:w-2/5 ">
            <h3 className="text-lg font-semibold mb-4">Up_Front</h3>
            <div className="space-y-3 text-sm  text-body-text">
              <p><IoPeopleSharp className="inline m-1" /><span className="font-medium "> Service Charge:</span> {data.serviceCharge}</p>
              <p><GiPathDistance className="inline m-1" /><span className="font-medium"> Distance Fee:</span> {data.distanceFee}</p>
              <hr />
              <p><PiMathOperationsLight className="inline m-1" /> <span className="font-medium">Total:</span>
                {" "}{data.serviceCharge + data.distanceFee}
              </p>
            </div>
            <div className="mt-4 text-xs text-gray-600 space-y-1">
              <p>* This will be the upfront payment that the user pays when booking the service.</p>
              <p>* Additional charges (if any) will be added after diagnosing the issue.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProviderInfo;

