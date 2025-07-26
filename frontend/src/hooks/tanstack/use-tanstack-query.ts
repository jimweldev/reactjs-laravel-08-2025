import { useMemo } from 'react';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { mainInstance } from '@/07_instances/main-instance';

type Url = {
  endpoint: string;
  extendedParams?: string;
};

const useTanstackQuery = <T>(
  url: Url,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) => {
  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (url.extendedParams) {
      url.extendedParams.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          params.append(key, value);
        }
      });
    }

    return `${url.endpoint}?${params.toString()}`;
  }, [url.endpoint, url.extendedParams]);

  const tanstackQuery = useQuery<T>({
    queryKey: [url.endpoint, url.extendedParams],
    queryFn: async ({ signal }) => {
      const res = await mainInstance.get(queryString, { signal });
      return res.data;
    },
    ...options,
  });

  return tanstackQuery;
};

export default useTanstackQuery;
