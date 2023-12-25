import MessengerCustomerChat from 'react-messenger-customer-chat';
import { useSetting } from '../context/setting';

export default function MessengerChat() {
  const { setting } = useSetting();

  return (
    <MessengerCustomerChat
      pageId={setting?.client?.facebook_page_id}
      appId={setting?.client?.facebook_app_id}
    />
  );
}
