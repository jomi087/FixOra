import AuthService from "@/services/AuthService";
import type { ServiceData, Services } from "@/shared/types/user";
import { toPascalCase } from "@/utils/helper/utils";
import type { AxiosError } from "axios";
import { Undo2 } from "lucide-react";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";

interface ServiceListProps {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  actualServices: Services | null;
  services: Services | null
  setServices: React.Dispatch<React.SetStateAction<Services | null>>;
  error: string;
  setError: (error: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ edit, setEdit, actualServices, services, setServices, error, setError }) => {

  //move to useEffect to parrent dependeicy as initailData
  const [loading, setLoading] = useState(false);
  const [allCategory, setAllCategory] = useState<ServiceData | null>(null);
  const handleServiceEdit = async () => {
    try {
      setLoading(true);
      const res = await AuthService.getServiceApi();
      setAllCategory(res.data.serviceData as ServiceData);
      setEdit(true);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err?.response?.data?.message || "Failed to update ProviderData");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-start">
      <div className="w-full space-y-3">
        <div className="flex gap-2 ">
          <p className="font-medium text-gray-700 dark:text-gray-200 ">
            Services
          </p>
        </div>
        <div className="flex flex-wrap gap-2 ml-2">
          {services &&
            <>
              <h6>{`${toPascalCase(services.name).split(" ")[0]} :`}</h6>
              {edit ? (
                allCategory && allCategory.subcategories.map((sub) => {
                  const isSelected = services.subcategories.some(
                    (s) => s.subCategoryId === sub.subCategoryId
                  );
                  return (
                    <span
                      key={sub.subCategoryId}
                      onClick={() => {
                        if (isSelected) {
                          setServices((prev) => {
                            if (!prev) return prev;
                            const arr = prev.subcategories.filter((s) => s.subCategoryId !== sub.subCategoryId);
                            return { ...prev, subcategories: arr };
                          });
                        } else {
                          setServices((prev) => {
                            if (!prev) return prev;
                            return {
                              ...prev,
                              subcategories: [...prev.subcategories, { subCategoryId: sub.subCategoryId, name: sub.name }],
                            };
                          });
                        }
                        setError("");
                      }}

                      className={`px-3 py-1 text-sm border rounded-md flex items-center gap-1 cursor-pointer transition-colors
                          ${isSelected
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                    }`}                            >
                      {toPascalCase(sub.name)}
                    </span>
                  );
                })
              ) : (
                services.subcategories.map((service) => (
                  <span
                    key={service.subCategoryId}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-200 flex items-center gap-1"
                  >
                    {toPascalCase(service.name)}
                  </span>
                ))
              )}
            </>
          }
        </div>
        {error && (
          <p className="text-red-500 text-sm ml-2">{error}</p>
        )}
      </div>

      {edit ? (
        <Undo2
          size={18}
          className={`cursor-pointer transition-colors ${error ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-primary"
          }`}
          onClick={() => {
            setEdit(false);
            setServices(actualServices ?? null);
            setError("");
          }}
        />
      ) : (
        (!loading) && (
          <CiEdit
            size={22}
            className="cursor-pointer text-gray-500 hover:text-primary transition-colors"
            onClick={handleServiceEdit}
          />
        )
      )}
    </div>
  );
};

export default ServiceList;