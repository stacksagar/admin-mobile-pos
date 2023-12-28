import { useSetting } from '../../context/setting';

export default function AdminPanelLogo() {
  const { setting } = useSetting();

  return (
    <div className="mx-auto flex w-fit max-w-[200px] max-h-[70px] items-center justify-around gap-2">
      <img src={setting?.client?.header_logo} alt="" />
    </div>
  );
}
