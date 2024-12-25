import { useState, useCallback, useEffect } from 'react';
import { ApiResource } from '../types/api';
import { ApiService } from '../services/api.service';
import { useCaptcha } from './useCaptcha';

export interface UseResourceOptions {
  autoFetch?: boolean;
  onError?: (error: Error) => void;
}

export function createResourceHook<T extends ApiResource>(
  service: ApiService<T>,
  options: UseResourceOptions = { autoFetch: false }
) {
  return function useResource(id?: string | number) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { getCaptchaToken } = useCaptcha();

    const handleError = (err: unknown) => {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      options.onError?.(error);
      throw error;
    };

    const fetch = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await getCaptchaToken();
        const result = id
          ? [await service.getOne(id, token)]
          : await service.getAll(token);
        setData(result);
        return result;
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }, [id]);

    const create = async (newData: Partial<T>) => {
      try {
        setLoading(true);
        const token = await getCaptchaToken();
        const result = await service.create(newData, token);
        setData(prev => [...prev, result]);
        return result;
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    const update = async (id: string | number, updateData: Partial<T>) => {
      try {
        setLoading(true);
        const token = await getCaptchaToken();
        const result = await service.update(id, updateData, token);
        setData(prev => {
          return prev.map(item => item.id === id ? result : item);
        });
        return result;
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    const remove = async (id: string | number) => {
      try {
        setLoading(true);
        const token = await getCaptchaToken();
        await service.delete(id, token);
        setData(prev => {
          return prev.filter(item => item.id !== id);
        });
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (options.autoFetch) {
        fetch();
      }
    }, [fetch, options.autoFetch]);

    return {
      data,
      loading,
      error,
      fetch,
      create,
      update,
      remove
    };
  };
}