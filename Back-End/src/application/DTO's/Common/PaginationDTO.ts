export interface PaginationInputDTO {
  searchQuery: string;
  filter: string;
  currentPage: number;
  limit: number;
}

export interface PaginationOutputDTO<T> {
  data: T[];
  total: number;
}
