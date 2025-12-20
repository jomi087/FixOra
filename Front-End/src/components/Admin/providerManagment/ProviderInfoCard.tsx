import type { ProviderData } from "@/shared/typess/user";
import React from "react";
import FlippableProviderCard from "./FlippableProviderCard";


interface ProviderInfoCardProps {
  datas: ProviderData[]
  onToggleStatus : ( id : string ) => void
}

const ProviderInfoCard: React.FC<ProviderInfoCardProps> = React.memo(({ datas, onToggleStatus }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6 px-4 py-6 max-w-7xl mx-auto">
      {datas.map((data) => (
        <FlippableProviderCard
          key={data.providerId}
          data={data}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
});
 
export default ProviderInfoCard;
