import { useEffect, useState } from 'react';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import { Button } from '@mui/material';

type ItemT = { [colorName: string]: string[] };

interface PropsT {
  initialItems?: ItemT;
  onChange?: (items: ItemT) => void;
}

export default function MultipleStringsOfKey({
  initialItems,
  onChange,
}: PropsT) {
  const [color, setColor] = useState('');
  const [items, setItems] = useState(initialItems || {});

  const handleStringAdd = (colorName: string) => {
    setItems((prevItems) => ({
      ...prevItems,
      [colorName]: [...prevItems[colorName], ''],
    }));
  };

  useEffect(() => {
    console.log('initialItems ', initialItems);
  }, [initialItems]);

  const handleStringChange = (
    colorName: string,
    index: number,
    value: string
  ) => {
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
      <div className="flex flex-col items-center gap-2 py-4">
        <MuiTextField
          size="small"
          label="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <Button
          size="medium"
          onClick={addColor}
          variant="contained"
          className="w-full whitespace-nowrap"
        >
          Add Color
        </Button>
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
              color="error"
              onClick={() => removeColor(colorName)}
            >
              Remove Color
            </Button>
          </div>
          {values.map((value, stringIndex) => (
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
          ))}
          <Button
            size="small"
            variant="contained"
            onClick={() => handleStringAdd(colorName)}
          >
            {' '}
            Add IMEI{' '}
          </Button>
        </div>
      ))}
    </div>
  );
}
