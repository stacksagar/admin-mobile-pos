import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { uid } from 'uid';
import { useEffect, useState } from 'react';
import FIcon from '../../Icons/FIcon';

type Props = {
  label?: string;

  options: any[];
  titleKey: string;

  secondTitleKey?: string;
  valueKey?: string;

  defaultValue?: any;
  defaultTitle?: any;
  onChange?: (value: any) => void;
};

export default function MuiSearchSelect({
  label,
  options: providedOptions,
  titleKey,
  secondTitleKey,
  valueKey,
  defaultValue: providedDefaultValue,
  defaultTitle,
  onChange,
}: Props) {
  const [options, setOptions] = useState<string[]>([]);
  const [defaultValue, setDefaultValue] = useState<any>(null);

  function handleChange(title: string | null) {
    if (!title || !onChange) return;
    const changedData = providedOptions?.find((op) => op[titleKey] === title);
    valueKey ? onChange(changedData[valueKey]) : onChange(changedData);
  }

  useEffect(() => {
    setOptions(providedOptions.map((op) => op[titleKey]));
  }, [providedOptions]);

  useEffect(() => {
    if (!providedDefaultValue || !providedDefaultValue[titleKey]) return;
    setDefaultValue(providedDefaultValue[titleKey]);
  }, [providedDefaultValue]);

  useEffect(() => {
    setDefaultValue(defaultTitle || null);
  }, [providedDefaultValue, defaultTitle]);

  return (
    <ul className="w-full">
      <Autocomplete
        options={options}
        value={defaultValue}
        getOptionLabel={(option: string) => option}
        renderInput={(params) => (
          <TextField {...params} label={label || 'Select'} margin="normal" />
        )}
        clearIcon={
          <li>
            <FIcon
              onClick={() => {
                setDefaultValue(null);
                onChange && onChange({});
              }}
              icon="times"
            />
          </li>
        }
        onChange={(_, val) => handleChange(val)}
        renderOption={(props, option, { inputValue, selected }) => {
          const matches = match(option, inputValue, { insideWords: true });
          const parts = parse(option, matches);

          return (
            <li {...props}>
              <div>
                {parts.map((part: any) => (
                  <span
                    key={uid()}
                    className={`${
                      part.highlight ? 'font-bold' : 'font-normal'
                    }`}
                  >
                    {part.text}
                  </span>
                ))}

                {selected ? (
                  <FIcon className="mx-2 text-green-600" icon="check-circle" />
                ) : null}
              </div>
            </li>
          );
        }}
      />
    </ul>
  );
}
