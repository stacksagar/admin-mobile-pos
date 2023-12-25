import error_message from './error_message';
import toast from '../libs/toast';
import { axios_req } from '../api/api';

export default async function imageUpload(file: any, setLoading?: any) {
  if (!file) return;
  if (setLoading) {
    setLoading(true);
  }

  const formData = new FormData();

  formData.append('file', file);

  try {
    const { data } = await axios_req.post('upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error) {
    toast({
      message: error_message(error),
      type: 'error',
    });
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
}
