import { useState } from 'react';
import useBoolean from './useBoolean';

const useArray = <T>(defaultData?: T[]) => {
  const [data, setData] = useState<T[]>(defaultData || []);
  const loading = useBoolean();

  return {
    data,
    reset: () => setData([]),
    set: setData,
    add: (d: T) => setData((prev) => [...prev, d]),
    update: (newObject: T, key: keyof T) =>
      setData((prev) =>
        prev.map((item) => (item[key] === newObject[key] ? newObject : item))
      ),

    remove: (key: keyof T, value: any) =>
      setData((prev) => prev.filter((item: any) => item[key] !== value)),

    removeById: (id?: number) =>
      setData((prev) => prev.filter((item: any) => item?.id !== id)),

    loading,
  };
};

export type UseArray<T> = ReturnType<typeof useArray<T>>;
export default useArray;
