const SkeletonDiv2 = ({
  className,
  children,
}: {
  className?: string;
  children?: any;
}) => {
  return (
    <div
      className={`shadow w-full flex rounded bg-gradient-to-l from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 ${className}`}
    >
      {children}
    </div>
  );
};

export default SkeletonDiv2;
