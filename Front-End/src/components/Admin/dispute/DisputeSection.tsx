import { useEffect } from "react";
import { DisputeTable } from "./DisputeTable";
import type { DisputeListPayload } from "@/shared/typess/dispute";
import SearchInput from "@/components/common/other/SearchInput";
import FilterSelect from "@/components/common/other/FilterSelect";
import { DisputeStatus, DisputeType } from "@/shared/enums/Dispute";
import Pagination from "@/components/common/other/Pagination";
import { useDebounce } from "use-debounce";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDisputes, setFilters } from "@/store/admin/disputeSlice";

type Option<T> = { label: string; value: T };

const typeOptions: Option<"All" | DisputeType>[] = [
  { label: "All", value: "All" },
  // { label: DisputeType.CHAT, value: DisputeType.CHAT },
  { label: DisputeType.REVIEW, value: DisputeType.REVIEW },
];

const statusOptions: Option<"All" | DisputeStatus>[] = [
  { label: "All", value: "All" },
  { label: DisputeStatus.PENDING, value: DisputeStatus.PENDING },
  { label: DisputeStatus.RESOLVED, value: DisputeStatus.RESOLVED },
  { label: DisputeStatus.REJECTED, value: DisputeStatus.REJECTED },
];
const DisputeSection = () => {

  const dispatch = useAppDispatch();
  const { disputes, total, loading, filters } = useAppSelector((state) => state.disputes);
  const [debouncedQuery] = useDebounce(filters.searchQuery, 500);
  const totalPages = Math.ceil(total / filters.limit);

  useEffect(() => {
    const payload: DisputeListPayload = {
      searchQuery: debouncedQuery,
      filterType: filters.type === "All" ? "" : filters.type,
      filterStatus: filters.status === "All" ? "" : filters.status,
      page: filters.page,
      limit: filters.limit,
    };

    dispatch(fetchDisputes(payload));
  }, [debouncedQuery, filters.type, filters.status, filters.page, filters.limit, dispatch]);

  return (
    <div className="w-full rounded-md px-2 py-6">
      {/* Filter Bar */}
      <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between  gap-3 sm:gap-4 mb-4 w-full">
        <div className="flex-1 min-w-[50px] sm:max-w-[450px] ">
          <SearchInput
            value={filters.searchQuery}
            onChange={(val) => dispatch(setFilters({ searchQuery: val }))}
            placeholder="Search disputes by Name / Id / Reason"
          />
        </div>
        <div className="flex flex-row border-0 justify-end gap-3 sm:gap-4 w-full sm:w-auto">
          <FilterSelect
            filter={filters.type}
            onChange={(val) =>
              dispatch(setFilters({ type: val as typeof filters.type }))
            }
            options={typeOptions}
            className="w-full sm:w-[160px]"
          />
          <FilterSelect
            filter={filters.status}
            onChange={(val) =>
              dispatch(setFilters({ status: val as typeof filters.status }))
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
          currentPage={filters.page}
          totalPages={totalPages}
          onPage={(page) => dispatch(setFilters({ page }))}
        />
      )}
    </div>
  );
};

export default DisputeSection;
