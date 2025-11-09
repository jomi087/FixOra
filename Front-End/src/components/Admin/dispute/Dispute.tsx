import { useEffect, useState } from "react";
import { DisputeTable } from "./DisputeTable";
import type { Dispute, DisputeListPayload } from "@/shared/types/dispute";
import { DLPP } from "@/utils/constant";
import SearchInput from "@/components/common/others/SearchInput";
import FilterSelect from "@/components/common/others/FilterSelect";
import { DisputeStatus, DisputeType } from "@/shared/enums/Dispute";
import Pagination from "@/components/common/others/Pagination";
import AuthService from "@/services/AuthService";
import { useDebounce } from "use-debounce";
import { Loader2 } from "lucide-react";

// import { dummyDisputes } from "@/utils/constant";
type Option<T> = { label: string; value: T };

const typeOptions: Option<"All" | DisputeType>[] = [
  { label: "All", value: "All" },
  { label: DisputeType.CHAT, value: DisputeType.CHAT },
  { label: DisputeType.REVIEW, value: DisputeType.REVIEW },
];

const statusOptions:  Option<"All" | DisputeStatus>[] = [
  { label: "All", value: "All" },
  { label: DisputeStatus.PENDING, value: DisputeStatus.PENDING },
  { label: DisputeStatus.RESOLVED, value: DisputeStatus.RESOLVED },
  { label: DisputeStatus.REJECTED, value: DisputeStatus.REJECTED },
];

interface FilterState {
  type: DisputeType | "All";
  status: DisputeStatus | "All";
}

const DisputeSection = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({ type: "All", status: "All" });
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  const [totalDisputes, setTotalDisputes] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = DLPP; // 10
  const totalPages = Math.ceil(totalDisputes / itemsPerPage);

  useEffect(() => {
    const loadDisputes = async () => {
      setLoading(true);
      const payload:DisputeListPayload = {
        searchQuery: debouncedQuery,
        filterType: filters.type === "All" ? "" : filters.type,
        filterStatus: filters.status === "All" ? "" : filters.status,
        page,
        limit: itemsPerPage,
      };

      try {
        const res = await AuthService.getDispute(payload);
        setDisputes(res.data.disputeData ?? []);
        setTotalDisputes(res.data.total ?? 1);
      } finally {
        setLoading(false);
      }
    };

    loadDisputes();
  }, [debouncedQuery, filters.type, filters.status, page]);

  return (
    <div className="w-full rounded-md px-2 py-6">
      {/* Filter Bar */}
      <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between  gap-3 sm:gap-4 mb-4 w-full">
        <div className="flex-1 min-w-[50px] sm:max-w-[450px] ">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search disputes by Name / Id / Reason"
          />
        </div>
        <div className="flex flex-row border-0 justify-end gap-3 sm:gap-4 w-full sm:w-auto">
          <FilterSelect
            filter={filters.type}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, type: val as FilterState["type"] }))
            }
            options={typeOptions}
            className="w-full sm:w-[160px]"
          />
          <FilterSelect
            filter={filters.status}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, status: val as FilterState["status"] }))
            }
            options={statusOptions}
            className="w-full sm:w-[160px]"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin mr-2" /> Loading disputes...
        </div>
      ) : disputes.length === 0 ? (
        <div className="flex justify-center items-center py-10 text-muted-foreground">
          No disputes found.
        </div>
      ) : (
        <DisputeTable disputes={disputes} />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPage={setPage}
        />
      )}
    </div>
  );
};

export default DisputeSection;
