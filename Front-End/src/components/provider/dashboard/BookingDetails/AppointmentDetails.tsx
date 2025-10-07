import { toPascalCase } from "@/utils/helper/utils";
import React from "react";

interface AppointmentDetailsProps {
  scheduledAt: string;
  category: {
    categoryId: string;
    name: string;
    subCategory: {
      subCategoryId: string;
      name: string;
    };
  };
  issue: string;

}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ scheduledAt, category, issue }) => {
  return (
    <div className="space-y-2 border-b-1 border-primary pb-5">
      <p className="space-x-2">
        <span className="font-semibold">Appointment Time:</span>{" "}
        <span className="font-mono text-gray-600 dark:text-gray-400">
          {new Date(scheduledAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </p>
      <p className="space-x-2">
        <span className="font-semibold ">Appointment Date:</span>{" "}
        <span className="font-mono text-gray-600 dark:text-gray-400">
          {new Date(scheduledAt).toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </p>

      <p className="mt-3 space-x-2">
        <span className="font-semibold">Service Type:</span>{" "}
        <span className="text-gray-600 dark:text-gray-400 font-mono">
          {category.name.toUpperCase()}
        </span>
      </p>

      <p className="space-x-15">
        <span className="font-semibold">Issue :</span>{" "}
        <span className="text-gray-600 dark:text-gray-400 font-mono">
          {category.subCategory.name.toUpperCase()}
        </span>
      </p>

      <div className="mt-2">
        <p className="font-semibold ">Description:</p>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 w-full">
          {`${toPascalCase(issue)}`}
        </p>
      </div>
    </div>
  );
};

export default AppointmentDetails;