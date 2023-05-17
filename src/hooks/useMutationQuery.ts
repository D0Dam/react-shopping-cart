import { useCallback, useState } from 'react';
import type { MutationFetchMethod } from '../types';

interface Return<BodyData, ResponseData> {
  mutateQuery: (method: MutationFetchMethod, data?: BodyData, id?: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  responseData: ResponseData | null;
}

const useMutationQuery = <BodyData, ResponseData>(
  fetchUrl: string,
  headers?: HeadersInit
): Return<BodyData, ResponseData> => {
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateQuery = useCallback(
    async (method: MutationFetchMethod, data?: BodyData, id = '') => {
      setLoading(true);
      setError(null);

      const body = data ? JSON.stringify(data) : null;

      return await fetch(`${fetchUrl}/${id}`, {
        method,
        body,
        headers,
      })
        .then(res => {
          if (method === 'DELETE' || 'PATCH') return res.text();
          else return res.json();
        })
        .then(data => {
          return setResponseData(data);
        })
        .catch((error: Error) => {
          return setError(error.message);
        })
        .finally(() => setLoading(false));
    },
    [fetchUrl, headers]
  );

  return { responseData, loading, error, mutateQuery };
};

export default useMutationQuery;
