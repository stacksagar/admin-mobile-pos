import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/auth';
import images from '../../data/images';
import FIcon from '../../common/Icons/FIcon';
import useLogout from '../../hooks/axios/useLogout';

const DropdownUser = () => {
  const { auth, loading } = useAuth();
  const logout = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative">
      <Link ref={trigger} onClick={() => setDropdownOpen(!dropdownOpen)} to="#">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-x-2 rounded border border-[#ddd] py-2 px-2 focus:border-transparent focus:ring dark:border-[#777] focus:dark:border-transparent sm:px-3"
        >
          <img
            className="w-6 rounded"
            src={auth?.user?.picture || images.avatar}
            alt=""
          />
          <span className="capitalize"> {auth?.user?.name} </span>
          <small>
            {dropdownOpen ? (
              <FIcon icon="chevron-up" />
            ) : (
              <FIcon icon="chevron-down" />
            )}
          </small>
        </motion.button>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link
              to="/edit-profile"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <FIcon icon="user-alt" />
              My Profile
            </Link>
          </li>
          <li>
            <Link
              to="/change-password"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <FIcon icon="lock" />
              Change Password
            </Link>
          </li>
        </ul>
        <button
          onClick={logout}
          className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
        >
          <FIcon icon="sign-out" />
          Log Out
          {loading ? (
            <FIcon className=" animate-spin-2" icon="spinner" />
          ) : null}
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;
