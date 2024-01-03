import { useEffect, useState } from 'react';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import { Button } from '@mui/material';
import toast from '../../libs/toast';

type ItemT = { [colorName: string]: string[] };

interface PropsT {
  initialItems?: ItemT;
  onChange?: (items: ItemT) => void;
  previousImeis?: string[];
  isEditPage?: boolean;
}

export default function MultipleStringsOfKey({
  initialItems,
  onChange,
  previousImeis,
  isEditPage,
}: PropsT) {
  const [color, setColor] = useState('');
  const [items, setItems] = useState(initialItems || {});

  const handleStringAdd = (colorName: string) => {
    setItems((prevItems) => ({
      ...prevItems,
      [colorName]: [...prevItems[colorName], ''],
    }));
  };

  // check is prev exist then make disable EDIT/Remove
  function isPrevExist(imei: string) {
    return previousImeis?.includes(imei);
  }

  const handleStringChange = (
    colorName: string,
    index: number,
    value: string
  ) => {
    if (isPrevExist(value)) {
      // alert('This IMEI already exist!');
      toast({
        message: 'This IMEI already exist',
        type: 'warning',
      });
      return;
    }

    setItems((prevItems) => ({
      ...prevItems,
      [colorName]: [
        ...prevItems[colorName].slice(0, index),
        value,
        ...prevItems[colorName].slice(index + 1),
      ],
    }));
  };

  const handleStringRemove = (colorName: string, index: number) => {
    setItems((prevItems) => ({
      ...prevItems,
      [colorName]: prevItems[colorName].filter((_, i) => i !== index),
    }));
  };

  const addColor = () => {
    if (!color) return;

    setItems((prevItems) => ({
      ...prevItems,
      [color]: [],
    }));

    setColor('');
  };

  const removeColor = (colorName: string) => {
    setItems((prevItems) => {
      const newItems = { ...prevItems };
      delete newItems[colorName];
      return newItems;
    });
  };

  useEffect(() => {
    if (onChange) {
      const filteredItems: ItemT = {};
      //   remove empty with filter
      Object.entries(items).map(([color, imeis]) => {
        filteredItems[color] = imeis?.filter((imei) => imei);
      });
      onChange(filteredItems);
    }
  }, [items]);

  return (
    <div className="spaec-y-3">
      <div className="flex items-center py-4">
        <MuiTextField
          size="small"
          label="Color"
          disabled={isEditPage}
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button
          type="button"
          disabled={isEditPage}
          onClick={isEditPage ? () => {} : addColor}
          className="relative z-50 -ml-2 h-full w-fit whitespace-nowrap bg-blue-600 px-4 py-2 font-medium text-white focus:ring"
        >
          Add Color
        </button>
      </div>

      {Object.entries(items).map(([colorName, values], _colorIndex) => (
        <div
          key={colorName}
          className="mt-2 space-y-3 rounded border bg-gray-50 p-4 dark:border-transparent dark:bg-gray-800"
        >
          <div className="flex items-center justify-between bg-yellow-50 p-2 dark:bg-gray-800">
            <h3>
              Color: <b className="text-xl font-semibold"> {colorName} </b>
            </h3>
            <h3>
              Quantity:{' '}
              <b className="text-xl font-semibold"> {values?.length} </b>
            </h3>
            <Button
              size="small"
              variant="contained"
              disabled={isEditPage}
              color="error"
              onClick={() => (isEditPage ? null : removeColor(colorName))}
            >
              Remove Color
            </Button>
          </div>
          {values.map((value, stringIndex) =>
            isPrevExist(value) ? (
              <div
                key={`${colorName}-${stringIndex}`}
                className="flex items-center gap-2"
              >
                <MuiTextField
                  size="small"
                  label="IMEI"
                  value={value}
                  disabled
                />
                <Button disabled color="info" variant="contained">
                  Previous
                </Button>
              </div>
            ) : (
              <div
                key={`${colorName}-${stringIndex}`}
                className="flex items-center gap-2"
              >
                <MuiTextField
                  size="small"
                  label="IMEI"
                  value={value}
                  onChange={(e) =>
                    handleStringChange(colorName, stringIndex, e.target.value)
                  }
                />
                <Button
                  color="warning"
                  variant="contained"
                  onClick={() => handleStringRemove(colorName, stringIndex)}
                >
                  Remove
                </Button>
              </div>
            )
          )}
          <Button
            size="small"
            variant="contained"
            disabled={isEditPage}
            onClick={() => (isEditPage ? null : handleStringAdd(colorName))}
          >
            Add IMEI
          </Button>
        </div>
      ))}
    </div>
  );
}
