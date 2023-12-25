import { useEffect } from 'react';
import { useAppDispatch } from '../../app/store';

export interface FetchDataParams {
  page?: number;
  limit?: number;
  sort?: 'id';
  order?: 'ASC' | 'DESC';

  startPrice?: number;
  endPrice?: number;
  startAmount?: number;
  endAmount?: number;
  categories?: string;
  category?: string;
  startDate?: any;
  customDate?: boolean;
  endDate?: any;
}

export default function useFetchWithPagination({
  fetchFunc,
  limit,
  data,
}: {
  data: any[];
  fetchFunc: any;
  limit?: number;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data.length > 0) return;

    dispatch(fetchFunc({ page: 1, limit: limit || 10 }));
  }, []);

  const changePage = async ({ ...props }: FetchDataParams) => {
    dispatch(
      fetchFunc({
        ...props,
      })
    );
  };

  return { changePage };
}
