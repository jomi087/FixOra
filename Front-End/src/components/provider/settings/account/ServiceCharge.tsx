import { Input } from "@/components/ui/input";
import { Undo2 } from "lucide-react";
import { CiEdit } from "react-icons/ci";

interface ServiceChargeProps {
    edit: boolean;
    setEdit: (edit: boolean) => void;
    actualServiceCharge: number | null;
    serviceCharge: number | null;
    setServiceCharge: (serviceCharge: number|null) => void;
    error: string;
    setError: (error: string) => void;
}

const ServiceCharge: React.FC<ServiceChargeProps> = ({ edit, setEdit, actualServiceCharge, serviceCharge, setServiceCharge, error, setError }) => {

  return (
    <div className="flex justify-between items-center pb-3">
      <div className="space-y-3">
        <p className="font-medium text-gray-700 dark:text-gray-200">
        Service Charge
        </p>
        {edit ? (
          <>
            <Input
              type="number"
              placeholder="300Rs - 500Rs"
              value={serviceCharge ?? "N/A"}
              onChange={(e) => {
                const value = e.target.value;
                const numeric = value ? Number(value) : null;
                setServiceCharge(numeric);
                setError("");
              }}
              className="ml-4  w-full no-spinner"
            />
            {error && (
              <p className="text-red-500 text-sm ml-4">{error}</p>
            )}
          </>
        ) : (
          <p className="ml-4 mb-3 text-gray-600 dark:text-gray-400">₹ {serviceCharge ?? "N/A"}</p>
        )}
      </div>
      {edit ? (
        <Undo2
          size={18}
          className={`cursor-pointer transition-colors ${error ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-primary"
          }`}
          onClick={() => {
            setEdit(false);
            setServiceCharge(actualServiceCharge ?? null);
            setError("");
          }}
        />
      ) : (
        <CiEdit
          size={22}
          className="cursor-pointer text-gray-500 hover:text-primary transition-colors"
          onClick={() => (setEdit(true))}
        />
      )}
    </div>
  );
};

export default ServiceCharge;