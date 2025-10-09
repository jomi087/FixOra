import AuthService from "@/services/AuthService";
import type { ProviderData } from "@/shared/types/user";
import { usePaginatedProviderApi } from "./usePaginatedProviderApi";
import { PCPP } from "@/utils/constant";

export const useProviderManagement = () =>
  usePaginatedProviderApi<ProviderData>(
    AuthService.getAllProviderApi,
    {
      defaultFilter: "all",
      defaultItemsPerPage: PCPP || 12,
      debounceDelay: 500,
    }
  );
