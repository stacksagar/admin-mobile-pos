import { useTheme } from '../../context/theme';
import { motion } from 'framer-motion';

const DarkModeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
      <label
        className={`relative m-0 block h-7.5 w-14 rounded-full ${
          theme === 'dark' ? 'bg-primary' : 'bg-stroke'
        }`}
      >
        <input
          title="Switch Theme"
          type="checkbox"
          onChange={toggleTheme}
          className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
            theme === 'dark' && '!right-[3px] !translate-x-full'
          }`}
        ></span>
      </label>
    </motion.button>
  );
};

export default DarkModeSwitcher;
