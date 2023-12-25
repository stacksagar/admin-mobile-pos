import { useRef, useEffect } from 'react';
import SunEditor from '../../common/Editors/SunEditor';
import SunEditorCore from 'suneditor/src/lib/core';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import { useFormik } from 'formik';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import { Button } from '@mui/material';
import Label from '../../common/Forms/Label';
import { useAppDispatch } from '../../app/store';

import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { addPage, updatePage } from '../../app/features/pages/pagesSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { axios_private } from '../../api/api';

export default function AddEditPage() {
  const isEditPage = location.pathname.includes('edit-page');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const dispatch = useAppDispatch();

  const page_content = useRef<SunEditorCore>();

  const pageFormik = useFormik({
    initialValues: {
      name: '',
    },

    onSubmit: async (values) => {
      pageFormik.setSubmitting(true);
      const pageData = {
        ...values,
        content: page_content?.current?.getContents(false),
      };

      try {
        if (isEditPage) {
          const { data } = await axios.put(
            `/page?id=${searchParams.get('id')}`,
            pageData
          );
          data?.page && dispatch(updatePage(data?.page));
          toast({ message: 'page updated!' });
        } else {
          const { data } = await axios.post('/page', pageData);
          data?.page && dispatch(addPage(data?.page));
          toast({ message: 'Added new page!' });
        }
        navigate('/pages');
      } catch (error) {
        toast({
          message: error_message(error),
          type: 'error',
        });
      }
    },
  });

  useEffect(() => {
    if (!isEditPage) return;
    (async () => {
      const { data: page } = await axios_private.get<Page>(
        `/page/single?id=${searchParams.get('id')}`
      );

      pageFormik.setFieldValue('name', page?.name);
      page_content.current?.setContents(page?.content);
    })();
  }, []);

  return (
    <div>
      <form onSubmit={pageFormik.handleSubmit}>
        <div className="space-y-8 bg-white p-8 dark:bg-black xl:col-span-8">
          <div className="col-span-full">
            <h3 className="section_header">Page Details</h3>
          </div>

          <MuiTextField
            required
            id="name"
            label="Page Name"
            {...pageFormik.getFieldProps('name')}
          />

          <div>
            <Label>Page Description</Label>
            <SunEditor
              height="400px"
              placeholder="Page Description..."
              editor={page_content}
            />
          </div>

          <div className="w-full">
            <Button type="submit" variant="contained" size="large">
              {isEditPage ? 'Update' : 'Submit'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
