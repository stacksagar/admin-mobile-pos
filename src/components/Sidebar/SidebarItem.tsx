import { NavLink } from 'react-router-dom';
import FIcon, { FAIconNames } from '../../common/Icons/FIcon';
import { motion } from 'framer-motion';

export interface SidebarItemProps {
  title: string;
  to: string;
  icon?: FAIconNames;
  CustomIcon?: JSX.Element;
  target?: React.HTMLAttributeAnchorTarget;
  onClick?: any;
}

export default function SidebarItem({
  to,
  title,
  icon,
  CustomIcon,
  target,
  onClick,
}: SidebarItemProps) {
  return (
    <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <NavLink
        onClick={onClick}
        to={to}
        target={target}
        className={({ isActive }) =>
          `${
            isActive ? 'bg-blue-600 text-white' : 'text-black dark:text-white'
          } group relative flex items-center gap-2.5 rounded-sm px-4 py-3 font-medium duration-300 ease-in-out hover:bg-gray-800 hover:text-white dark:hover:bg-meta-4`
        }
      >
        <span className="w-6">
          {icon ? <FIcon icon={icon} /> : null}
          {CustomIcon ? CustomIcon : null}
        </span>
        {title}
      </NavLink>
    </motion.li>
  );
}
