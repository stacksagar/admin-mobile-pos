import { useSetting } from '../context/setting';
import useUpdate from './axios/useUpdateAsync';

export default function useSettingSubmit(setLoading: any) {
  const { setting, setSetting } = useSetting();
  const update = useUpdate();
  return async (values: any) => {
    const data = await update(
      '/setting',
      { client: { ...setting?.client, ...values } },
      setLoading
    );
    setSetting(data?.setting || {});
  };
}
