import classNames from 'classnames'
import { useEffect, useState } from 'react';
import FIcon from '../Icons/FIcon';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  Size?: 'lg' | 'xl' | '2xl';
}

export default function SearchInput({ Size, ...props }: Props) {
  const [dynamicClasses, setDynamicClass] = useState<any>();

  useEffect(() => {
    setDynamicClass(
      classNames({
        'py-2.5': Size === 'lg' || !Size,
        'py-3': Size === 'xl',
        'py-4': Size === '2xl',
      })
    );
  }, [Size]);

  return (
    <div className="relative w-full">
      <label htmlFor="hs-table-with-pagination-search" className="sr-only">
        Search
      </label>
      <input
        {...props}
        type="text"
        name="hs-table-with-pagination-search"
        className={`border-gray-200 dark:border-gray-700 dark:text-gray-400 block w-full rounded-md border pl-10 pr-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-900 ${dynamicClasses} ${props.className}`}
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <FIcon icon="search" />
      </div>
    </div>
  );
}
