import { useMemo, useState } from 'react';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { type PaginatedRecord } from '@/04_types/common/paginated-record';
import { mainInstance } from '@/07_instances/main-instance';

export type UseTanstackQueryPaginateReturn<T> = Omit<
  UseQueryResult<PaginatedRecord<T>>,
  'refetch'
> & {
  refetch: () => void;
  limit: string;
  page: number;
  sort: string;
  searchTerm: string;
  setLimit: (val: string) => void;
  setPage: (val: number) => void;
  setSort: (val: string) => void;
  setSearchTerm: (val: string) => void;
};

type PaginationState = {
  limit: string;
  page: number;
  sort: string;
  searchTerm: string;
};

type Url = {
  endpoint: string;
  extendedParams?: string;
  defaultSort?: string;
};

const useTanstackQueryPaginate = <T>(
  url: Url,
  options?: Omit<UseQueryOptions<PaginatedRecord<T>>, 'queryKey' | 'queryFn'>,
) => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<PaginationState>({
    limit: '10',
    page: 1,
    sort: url.defaultSort || '',
    searchTerm: '',
  });

  const { limit, page, sort, searchTerm } = pagination;

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      limit,
      page: page.toString(),
      sort,
      search: searchTerm,
    });

    if (url.extendedParams) {
      url.extendedParams.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          params.append(key, value);
        }
      });
    }

    return `${url.endpoint}?${params.toString()}`;
  }, [url.endpoint, url.extendedParams, limit, page, sort, searchTerm]);

  const tanstackQuery = useQuery<PaginatedRecord<T>>({
    queryKey: [url.endpoint, limit, page, sort, searchTerm, url.extendedParams],
    queryFn: async ({ signal }) => {
      const res = await mainInstance.get(queryString, { signal });
      return res.data;
    },
    placeholderData: keepPreviousData,
    gcTime: Infinity,
    enabled: !queryClient.getQueryData([
      url.endpoint,
      limit,
      page,
      sort,
      searchTerm,
      url.extendedParams,
    ]),
    ...options,
  });

  const refetch = () => {
    tanstackQuery.refetch();
    queryClient.removeQueries({ queryKey: [url.endpoint] });
  };

  return {
    ...tanstackQuery,
    ...pagination,
    refetch, // created my own refetch function
    setLimit: (val: string) => setPagination(prev => ({ ...prev, limit: val })),
    setPage: (val: number) => setPagination(prev => ({ ...prev, page: val })),
    setSort: (val: string) => setPagination(prev => ({ ...prev, sort: val })),
    setSearchTerm: (val: string) =>
      setPagination(prev => ({ ...prev, searchTerm: val })),
  };
};

export default useTanstackQueryPaginate;
