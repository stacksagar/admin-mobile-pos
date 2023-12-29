import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import FIcon from '../../common/Icons/FIcon';
import { SidebarItemProps } from './SidebarItem';

export type Props = Omit<SidebarItemProps, 'to'> & {
  items?: SidebarItemProps[];
  alwaysOpen?: boolean;
};

const SidebarItemGroup = ({
  title,
  icon,
  CustomIcon,
  items,
  alwaysOpen,
}: Props) => {
  const location = useLocation();
  const { pathname } = location;

  const [open, setOpen] = useState<boolean>(
    pathname === '/forms' || pathname.includes('forms')
  );
 

  const handleClick = () => {
    setOpen((p) => !p);
  };

  useEffect(() => {
    alwaysOpen && setOpen(alwaysOpen);
  }, [alwaysOpen]);

  return (
    <li>
      <NavLink
        to="#"
        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out text-black dark:text-white hover:bg-gray-800 hover:text-white`}
        onClick={(e) => {
          e.preventDefault();
          // sidebarExpanded ? handleClick() : setSidebarExpanded(true);

          handleClick();
        }}
      >
        <span className="flex w-6 items-center justify-center">
          {icon ? <FIcon icon={icon} /> : CustomIcon}
          {CustomIcon ? CustomIcon : null}
        </span>

        {title}

        <span className="absolute inset-y-0 right-4 my-auto flex items-center text-xs">
          {open ? <FIcon icon="chevron-up" /> : <FIcon icon="chevron-down" />}
        </span>
      </NavLink>
      {/* <!-- Dropdown Menu Start --> */}
      <div
        className={`translate transform overflow-hidden ${!open && 'hidden'}`}
      >
        <ul className="mb-5.5 mt-4 flex flex-col gap-4 pl-6">
          {items?.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out  hover:text-black-2 dark:hover:text-white ${
                    isActive ? 'font-bold text-black-2 dark:text-white' : ''
                  }`
                }
              >
                <span className="flex w-6 items-center justify-center">
                  {item?.icon ? <FIcon icon={item.icon} /> : null}
                  {item?.CustomIcon ? item.CustomIcon : null}
                </span>
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default SidebarItemGroup;
