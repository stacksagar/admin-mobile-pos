import { IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import FIcon from '../Icons/FIcon';

interface Props
  extends Omit<
    Omit<React.HTMLAttributes<HTMLInputElement>, 'color'>,
    'onChange'
  > {
  onChange?:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;

  handleSubmit?: (id: number, data: object) => void;
  max?: number;
  keyName: string;
}

export default function ChangeNumberField({
  handleSubmit,
  max,
  keyName,
  ...props
}: Props) {
  const [value, setValue] = useState('');

  function submitHandler(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!value) return;

    let numberValue = Number(value);
    if (max) numberValue > max && (numberValue = max);
    handleSubmit && handleSubmit(Number(props.id), { [keyName]: numberValue });
  }

  return (
    <form onSubmit={submitHandler} className="flex items-center gap-2">
      <div className="w-16">
        <TextField
          className="w-full text-xs"
          type={'number'}
          label={keyName?.split('_').join(' ')}
          variant="standard"
          size="small"
          onChange={(e) =>
            Number(e.target.value) > 0 && setValue(e.target.value)
          }
          {...props}
        />
      </div>
      <IconButton type="submit" color="primary">
        <FIcon icon="check-square" size="lg" />
      </IconButton>
    </form>
  );
}
