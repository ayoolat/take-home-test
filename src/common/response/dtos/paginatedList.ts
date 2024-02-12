export class PaginatedList<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  data: T;
}
