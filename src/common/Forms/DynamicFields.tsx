import { uid } from 'uid';
import MuiTextField from '../MaterialUi/Forms/MuiTextField';
import MuiSelect from '../MaterialUi/Forms/MuiSelect';
import { Button, IconButton } from '@mui/material';
import FIcon from '../Icons/FIcon';
import useString from '../../hooks/state/useString';
import { useState, useEffect } from 'react';
import toast from '../../libs/toast';

export type Field = {
  name: string;
  type: string;
};

const Field = ({ onSubmit }: { onSubmit: (field: Field) => void }) => {
  const fieldTypes = ['text', 'number', 'email', 'file', 'image'];

  const fieldName = useString('');
  const fieldType = useString('text');

  function handleSubmit() {
    onSubmit({
      name: fieldName.value
        ?.trim()
        ?.toLowerCase()
        ?.split(' ')
        .filter((t) => t)
        .join('_'),
      type: fieldType.value,
    });

    fieldName.reset();
    fieldType.setCustom('text');
  }

  return (
    <div className="flex gap-2">
      <MuiTextField
        value={fieldName.value}
        label="Field Name"
        onChange={fieldName.change}
      />
      <div className="w-fit md:w-[200px]">
        <MuiSelect
          label="Field Type"
          value={fieldType.value}
          options={fieldTypes.map((text) => ({
            title: text,
            value: text,
          }))}
          onChange={fieldType.change}
        />
      </div>
      <Button onClick={handleSubmit} type="button" variant="contained">
        Add
      </Button>
    </div>
  );
};

interface Props {
  onChange?: (fields: Field[]) => void;
  title?: string;
  defaultValues?: Field[];
}

export default function DynamicFields({
  onChange,
  title,
  defaultValues,
}: Props) {
  const [fields, setFields] = useState<Field[]>(defaultValues || []);

  function handleDelete(index: number) {
    console.log(index);
    setFields((prev) => {
      const all = [...prev];
      all.splice(index, 1);
      return all;
    });
  }

  function addField(field: Field) {
    if (!field.name)
      return toast({ message: 'field name is required', type: 'error' });
    const exist = fields.find(
      (f) => f.name?.toLowerCase()?.trim() === field.name?.toLowerCase()?.trim()
    );
    if (exist) return toast({ message: 'field already exist!', type: 'error' });
    setFields((p) => [...p, field]);
  }

  // useEffect(() => {
  //   if (!defaultValues) return;
  //   if (fields?.length > 0) return;
  //   defaultValues && setFields(defaultValues);

  //   console.log('defaultValues ', defaultValues);
  // }, [defaultValues]);

  useEffect(() => {
    console.log('fields ', fields);
    onChange && onChange(fields);
  }, [fields]);

  return (
    <div>
      {title ? <h3 className="section_header">{title}</h3> : null}
      <div className="flex flex-col gap-5">
        {fields?.map((field, index) => (
          <div key={uid()} className="flex flex-wrap gap-3">
            <p className="font-semibold">
              <span>Field Name: </span>
              <span className="rounded bg-[#6745e18e] px-2 py-1 text-white">
                {field?.name}
              </span>
            </p>
            <p className="font-semibold">
              <span>type: </span>
              <span className="rounded bg-[#588651af] px-2 py-1 text-white">
                {field?.type}
              </span>
            </p>
            <div className="flex gap-2">
              <IconButton onClick={() => handleDelete(index)} size="small">
                <FIcon icon="trash" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
      <br />
      <Field onSubmit={addField} />
    </div>
  );
}
