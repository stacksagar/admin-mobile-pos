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
        header_bg: {
          type: 'color',
          value: setting?.client?.header_bg,
        },
        header_text: {
          type: 'color',
          value: setting?.client?.header_text,
        },
        sub_header_bg: {
          type: 'color',
          value: setting?.client?.sub_header_bg,
        },
        sub_header_text: {
          type: 'color',
          value: setting?.client?.sub_header_text,
        },
        footer_bg: {
          type: 'color',
          value: setting?.client?.footer_bg,
        },
        footer_text: {
          type: 'color',
          value: setting?.client?.footer_text,
        },
      }}
    />
  );
}
