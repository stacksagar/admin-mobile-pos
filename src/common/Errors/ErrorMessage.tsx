import { useAuth } from '../../context/auth';
import FIcon from '../Icons/FIcon';

const ErrorMessage = () => {
  const { error } = useAuth();
  if (!error) return <></>;

  return (
    <p className="col-span-full flex items-center gap-x-1 text-lg font-medium text-red-500">
      <span>
        <FIcon icon="exclamation-circle" />
      </span>
      <span>{error}</span>
    </p>
  );
};

export default ErrorMessage;
