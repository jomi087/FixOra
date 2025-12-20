import { HiUserCircle } from "react-icons/hi2";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "@/services/AuthService";
import { Messages } from "@/utils/constant";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import ServiceShimmer from "./shimmer_ui/ServiceShimmer";
import type { ServiceData, Services } from "@/shared/types/user";
import { serviceAndSpecializationValidation, serviceChargeValidation } from "@/utils/validation/serviceValidation";
import ServiceCharge from "./ServiceCharge";
import ServiceList from "./ServiceList";

const AdvanceProfile = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [loadingStates, setLoadingStates] = useState({
    initial: false,
    update: false,
  });

  const [edit, setEdit] = useState<{ serviceCharge: boolean; services: boolean }>({
    serviceCharge: false,
    services: false,
  });
  const [error, setError] = useState<{ serviceCharge: string; services: string }>({
    serviceCharge: "",
    services: ""
  });

  const [initialData, setInitialData] = useState<ServiceData | null>(null);
  const [allCategory, setAllCategory] = useState<Services | null>(null);
  const [serviceCharge, setServiceCharge] = useState<number | null>(null);
  const [services, setServices] = useState<Services | null>(null);

  const handleSave = async () => {

    const serviceChargeErr = serviceChargeValidation(serviceCharge);
    const servicesErr = serviceAndSpecializationValidation(services);
    if (serviceChargeErr || servicesErr) {
      setError({
        serviceCharge: serviceChargeErr || "",
        services: servicesErr || "",
      });
      return;
    }
    if (!initialData || !serviceCharge || !services) return;



    const isServiceChargeSame = serviceCharge === initialData.serviceCharge;
    const isServicesSame = JSON.stringify(services ?? {}) === JSON.stringify(initialData.category ?? {});

    if (isServiceChargeSame && isServicesSame) {
      toast.info("No changes made.");
      return;
    }

    const payload: Pick<ServiceData, "serviceCharge" | "category"> = {
      serviceCharge: serviceCharge as number,
      category: services as Services
    };

    setLoadingStates((prev) => ({ ...prev, update: true }));
    try {
      const res = await AuthService.updateProviderDataApi(payload);
      const data = res.data.updatedProviderData;
      setInitialData(data);
      toast.success("Successfull");
      setEdit({ serviceCharge: false, services: false });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err?.response?.data?.message || "Failed to update ProviderData");
    } finally {
      setLoadingStates((prev) => ({ ...prev, update: false }));
    }
  };

  useEffect(() => {
    setLoadingStates((prev) => ({ ...prev, initial: true }));
    const fetchProviderData = async () => {
      try {
        const res = await AuthService.providerDataApi();
        const serviceData = res.data.providerData as ServiceData;
        const serviceCharge = serviceData.serviceCharge;
        const specializations = serviceData.category;
        setInitialData(serviceData);
        setServiceCharge(serviceCharge);
        setServices(specializations);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const msg =
          err?.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
        toast.error(msg);
      } finally {
        setLoadingStates((prev) => ({ ...prev, initial: false }));
      }
    };

    const fetchService = async () => {
      try {
        setLoadingStates((prev) => ({ ...prev, initial: true }));
        const res = await AuthService.getServiceApi();
        setAllCategory(res.data.serviceData as Services);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err?.response?.data?.message || "Failed to update ProviderData");
      } finally {
        setLoadingStates((prev) => ({ ...prev, initial: false }));
      }
    };;

    fetchProviderData();
    fetchService();
  }, []);



  return (
    <div className="flex-1 px-6 pt-6 max-w-4xl mx-auto text-nav-text">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
        <Button
          variant="link"
          className="text-sm text-primary hover:underline hover:scale-105 transition-transform"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>
      </div>

      {/* Profile Card */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 rounded-2xl shadow-md border border-gray-200 bg-white dark:bg-gray-900 ">
        {/* Profile Image & Name */}
        <div className="flex flex-col items-center text-center md:w-1/3 border-b md:border-b-0 md:border-r-2 border-gray-200 pb-6 md:pb-0">
          {user?.fname ? (
            <div className="flex items-center justify-center w-28 h-28 md:w-32 md:h-32 border-2 border-primary rounded-full shadow-xl bg-primary-foreground">
              <span className="text-5xl md:text-6xl font-bold text-primary">
                {user.fname[0]?.toUpperCase()}
              </span>
            </div>
          ) : (
            <HiUserCircle size={130} className="text-gray-400" />
          )}
          <h3 className="text-xl font-semibold mt-4">
            {`${user?.fname ?? ""} ${user?.lname ?? ""}`}
          </h3>
          <p className="text-primary text-sm mt-1">{user?.email}</p>
        </div>

        {loadingStates.initial ? (
          <ServiceShimmer />
        ) : !initialData ? (
          <ServiceShimmer text={"N/A"} />
        ) : (
          <div className="flex-1 w-full md:w-2/3 space-y-2">
            {/* Service Charge */}
            <ServiceCharge
              edit={edit.serviceCharge}
              setEdit={(bool) => setEdit(prev => ({ ...prev, serviceCharge: bool }))}
              actualServiceCharge={initialData.serviceCharge ?? null}
              serviceCharge={serviceCharge}
              setServiceCharge={setServiceCharge}
              error={error.serviceCharge}
              setError={(newError) => setError(prev => ({ ...prev, serviceCharge: newError }))}
            />
            {/* ServicesList */}
            <ServiceList
              edit={edit.services}
              setEdit={(bool) => setEdit(prev => ({ ...prev, services: bool }))}
              allCategory={allCategory}
              actualServices={initialData.category ?? null}
              services={services}
              setServices={setServices}
              error={error.services}
              setError={(newError) => setError(prev => ({ ...prev, services: newError }))}
            />
          </div>
        )}
      </div>

      {
        (edit.serviceCharge || edit.services) &&
        <div className="flex justify-end mt-6 mr-2 ">
          <Button
            onClick={handleSave}
            disabled={loadingStates.update}
          >
            Save
          </Button>
        </div>
      }
    </div >
  );
};

export default AdvanceProfile;
