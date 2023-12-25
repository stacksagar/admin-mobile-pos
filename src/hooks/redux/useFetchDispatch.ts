import { useEffect } from 'react';
import { useAppDispatch } from '../../app/store';

export default function useFetchDispatch({
  data,
  fetchFunc,
}: {
  data: any[];
  fetchFunc: any;
}) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (data.length > 0) return;
    dispatch(fetchFunc());
  }, []);
}
