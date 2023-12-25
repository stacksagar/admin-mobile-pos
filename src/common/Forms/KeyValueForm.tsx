import { Button, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import MuiTextField from '../MaterialUi/Forms/MuiTextField';
import toast from '../../libs/toast';

type Item = {
  key: string;
  value: string;
};

interface Props {
  defaultValues?: KeyValuePair;
  keyTitle?: string;
  valueTitle?: string;
  onChange?: (values: KeyValuePair) => void;
}

const KeyValueForm = ({
  defaultValues,
  keyTitle,
  valueTitle,
  onChange,
}: Props) => {
  const [keyValuePairs, setKeyValuePairs] = useState<Item[]>(
    defaultValues
      ? Object.entries(defaultValues || {}).map(([key, value]) => ({
          key,
          value,
        }))
      : [{ key: '', value: '' }]
  );

  useEffect(() => {
    const values = Object.entries(defaultValues || {}).map(([key, value]) => ({
      key,
      value,
    }));
    setKeyValuePairs(values);
  }, [defaultValues]);

  const handleKeyChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedPairs = [...keyValuePairs];
    updatedPairs[index].key = event.target.value;
    setKeyValuePairs(updatedPairs);
  };

  const handleValueChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedPairs = [...keyValuePairs];
    updatedPairs[index].value = event.target.value;
    setKeyValuePairs(updatedPairs);
  };

  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
  };

  const removeKeyValuePair = (index: number) => {
    if (keyValuePairs.length === 1)
      return toast({ message: "You can't empty all fields!", type: 'warn' });
    const updatedPairs = [...keyValuePairs];
    updatedPairs.splice(index, 1);
    setKeyValuePairs(updatedPairs);
  };

  useEffect(() => {
    const reduces = keyValuePairs.reduce((curr: any, { key, value }) => {
      key && (curr[key] = value);
      return curr;
    }, {});

    onChange && onChange(reduces);
  }, [keyValuePairs]);

  return (
    <div className="space-y-3">
      {keyValuePairs.map((pair, index) => (
        <div key={index} className="grid grid-cols-12">
          <div className="col-span-7">
            <MuiTextField
              value={pair.key}
              onChange={(e) => handleKeyChange(index, e)}
              label={keyTitle}
            />
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <span>=</span>
          </div>

          <div className="col-span-3">
            <MuiTextField
              label={valueTitle}
              value={pair.value}
              onChange={(e) => handleValueChange(index, e)}
            />
          </div>

          <div className="col-span-1 flex h-full items-center">
            <IconButton
              onClick={() => removeKeyValuePair(index)}
              key="Remove"
              color="error"
              className="h-fit w-fit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
                />
              </svg>
            </IconButton>
          </div>
        </div>
      ))}

      <Button onClick={addKeyValuePair} variant="contained">
        Add Another Field
      </Button>
    </div>
  );
};

export default KeyValueForm;
