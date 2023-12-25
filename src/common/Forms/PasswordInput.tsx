import { useState } from 'react';
import FIcon from '../Icons/FIcon';

interface propTypes extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = ({ value, ...rest }: propTypes) => {
  const [showPass, set_showPass] = useState(false);

  return (
    <div className="group relative">
      <input
        autoComplete="on"
        type={showPass ? 'text' : 'password'}
        placeholder={rest.placeholder || 'Password'}
        required={true}
        {...rest}
        className={`text-gray-800 dark:bg-gray-900 dark:text-gray-100 focus:ring-primary-600 focus:border-primary-600 block w-full rounded border bg-white p-2.5 focus:outline-none focus:ring-1 dark:border-opacity-50 sm:text-sm ${rest.className}
        `}
      />

      <div
        onClick={() => set_showPass((p) => !p)}
        className="text-gray-400 hover:text-primary-600 absolute inset-y-0 right-0 flex cursor-pointer items-center pr-6 text-base"
      >
        {showPass ? <FIcon icon="eye" /> : <FIcon icon="eye-slash" />}
      </div>
    </div>
  );
};

export default PasswordInput;
