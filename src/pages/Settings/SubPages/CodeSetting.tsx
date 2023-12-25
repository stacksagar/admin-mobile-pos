import FormWithFormik from '../../../common/Formik/FormWithFormik';
import { useSetting } from '../../../context/setting';
import useBoolean from '../../../hooks/state/useBoolean';
import useSettingSubmit from '../../../hooks/useSettingSubmit';

export default function CodeSetting() {
  const { setting } = useSetting();
  const submitting = useBoolean();
  const submit = useSettingSubmit(submitting.set);

  return (
    <FormWithFormik
      onSubmit={submit}
      submitting={submitting.true}
      fields={{
        map: {
          type: 'textarea',
          value: setting?.client?.map,
        },
        messenger_chat_code: {
          type: 'textarea',
          value: setting?.client?.messenger_chat_code,
        },
      }}
    />
  );
}
