import SettingSidebarLink from './SettingSidebarLink';

const SettingSidebar = () => {
  return (
    <div className="border-default top-20 z-50 mb-5 h-fit w-full border border-b-transparent bg-white dark:border-b-transparent dark:bg-black lg:sticky lg:top-4 lg:mb-0 lg:w-[250px]">
      <SettingSidebarLink text="Header Setting" to="header" icon="h" />

      <SettingSidebarLink
        text="Footer Setting"
        to="footer"
        icon="info-circle"
      />
      <SettingSidebarLink text="Colors Setting" to="colors" icon="droplet" />
      <SettingSidebarLink text="Banner Setting" to="banner" icon="image" />
      <SettingSidebarLink text="Invoice Setting" to="invoice" icon="i" />
      <SettingSidebarLink text="Code Setting" to="code" icon="code" />
    </div>
  );
};

export default SettingSidebar;
