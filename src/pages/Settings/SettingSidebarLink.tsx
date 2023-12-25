import { NavLink } from 'react-router-dom';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import FIcon from '../../common/Icons/FIcon';

export default function SettingSidebarLink({
  to,
  icon,
  text,
}: {
  to: string;
  icon: IconProp;
  text: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${
          isActive
            ? 'bg-blue-600 text-white'
            : 'hover:bg-blue-500 hover:text-white'
        } border-default block border-b  px-4 py-2.5`
      }
    >
      <div className="flex items-center gap-3">
        <FIcon icon={icon} />
        <span>{text}</span>
      </div>
    </NavLink>
  );
}
