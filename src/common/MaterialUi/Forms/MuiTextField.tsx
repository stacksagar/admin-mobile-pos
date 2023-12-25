import { TextField, TextFieldProps, TextFieldVariants } from '@mui/material';
import FIcon from '../../Icons/FIcon';

type Props = Omit<Omit<TextFieldProps, 'variant'>, 'error'> & {
  variant?: TextFieldVariants;
  touched?: boolean;
  error?: string;
};

export default function MuiTextField({ touched, error, ...props }: Props) {
  return (
    <div className="w-full">
      <TextField
        className="-z-0 w-full capitalize"
        required={props.required ? true : false}
        name={props.id}
        error={error ? true : false}
        variant={props.variant || 'outlined'}
        type={props.type || 'text'}
        {...props}
      />

      {touched && error ? (
        <p className="flex items-center justify-start gap-x-1 pt-0.5">
          <span className="text-sm text-red-500">
            <FIcon icon="exclamation-circle" />
          </span>
          <small className="font-medium tracking-tight text-red-500">
            {error}
          </small>
        </p>
      ) : null}
    </div>
  );
}
