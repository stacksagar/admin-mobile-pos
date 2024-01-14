import { useState } from 'react';
import useBoolean from './useBoolean';

export default function useNumber(defaultValue?: number) {
  const [value, setValue] = useState<number>(defaultValue as any);
  const loading = useBoolean();

  return {
    value,
    set: setValue,
    reset: () => setValue('' as any),
    change: (e: any) => setValue(Number(e.target.value)),
    setCustom: (val?: number) => setValue(val as any),
    loading,
  };
}

export type UseNumber = ReturnType<typeof useNumber>;
