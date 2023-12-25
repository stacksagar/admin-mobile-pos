import FormWithFormik from '../../../common/Formik/FormWithFormik';
import { useSetting } from '../../../context/setting';
import useBoolean from '../../../hooks/state/useBoolean';
import useSettingSubmit from '../../../hooks/useSettingSubmit';

export default function HeaderSetting() {
  const { setting } = useSetting();
  const submitting = useBoolean();
  const submit = useSettingSubmit(submitting.set);

  return (
    <FormWithFormik
      onSubmit={submit}
      submitting={submitting.true}
      fields={{
        header_logo: {
          type: 'file',
          value: setting?.client?.header_logo,
        },

        favicon: {
          type: 'file',
          value: setting?.client?.favicon,
        },

        site_title: {
          type: 'text',
          value: setting?.client?.site_title,
        },
      }}
    />
  );
}
