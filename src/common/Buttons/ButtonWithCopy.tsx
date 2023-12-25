import { Button, IconButton } from '@mui/material';
import FIcon from '../Icons/FIcon';
import useCopy from '../../hooks/useCopy';
import useToast from '../../hooks/useToast';

interface Props {
  value?: string;
  showValue?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function ButtonWithCopy({ value, showValue, size }: Props) {
  const toast = useToast();
  const { copy, isCopied } = useCopy();
  if (!value) return <></>;

  function handelCopy() {
    copy(value as string);
    toast({
      message: `Copied`,
      type: 'info',
      duration: 300,
      hideProgressBar: true,
    });
  }

  return (
    <div className="inline-flex h-fit items-center">
      {showValue ? (
        <Button
          title={`Copy ${value}`}
          className="flex items-center gap-2"
          onClick={handelCopy}
          size={size}
        >
          <span>{value}</span>
          <span className="text-base">
            {isCopied ? <FIcon icon="check" /> : <FIcon icon="clipboard" />}
          </span>
        </Button>
      ) : (
        <IconButton
          title={`Copy ${value}`}
          className="flex h-6 w-6 items-center gap-1"
          onClick={handelCopy}
          size={size}
        >
          <span className="text-base">
            {isCopied ? <FIcon icon="check" /> : <FIcon icon="clipboard" />}
          </span>
        </IconButton>
      )}
    </div>
  );
}
