import StatCard from "@/components/common/other/StatCard";
import type { BaseStats } from "@/shared/typess/dashboard";
import { formatINRCurrency } from "@/utils/helper/utils";

interface SectionCardsProps {
  stats: BaseStats | null
}

const SectionCards: React.FC<SectionCardsProps> = ({ stats }) => {
  const total = stats && stats?.totalRevenue + stats?.penalityRevenue;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-primary ">
      {/* Total Revenue */}
      <StatCard
        title="Total Revenue"
        value={formatINRCurrency(total)}
        footer={`₹${stats?.penalityRevenue} Penality Revenue`}
      />

      {/* Customers */}
      <StatCard
        title="Customers"
        value={stats?.customers.total ?? "N/A"}
        footer={`${stats?.customers.blocked} Blocked`}
      />

      {/* Providers */}
      <StatCard
        title="Provider"
        value={stats?.providers.total ?? "N/A"}
        footer={`${stats?.providers.blocked} Blocked`}
      />

      {/* Services */}
      <StatCard
        title="Services"
        value={stats?.services.total ?? "N/A"}
        footer={`${stats?.services.inactive ?? "N/A"} In-Active`}
      />

    </div>
  );
};

export default SectionCards;

