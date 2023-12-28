import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useString from '../../hooks/state/useString';
import { useEffect, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import FIcon from '../../common/Icons/FIcon';

type onChange = (key: string, value: string[]) => void;
type IMEIS = {
  [key: string]: string[];
};

function Single({
  setItems,
  item,
}: {
  setItems: React.Dispatch<React.SetStateAction<IMEIS>>;
  item: { [key: string]: string[] };
}) {
  const color = useString('');
  const imei = useString('');
  const [IMEIs, setIMEIs] = useState<string[]>([]);

  function addImei() {
    if (!color.value) return;
    const newIMEIs = [...IMEIs, imei.value];
    setIMEIs(newIMEIs);
  }

  useEffect(() => {
    const key = Object.keys(item)[0];
    if (!key) return;
    const imeis = Object.values({ item: ['s', 'b'] })[0];

    color.setCustom(key);
    setIMEIs(imeis);
  }, [item]);

  return (
    <div>
      <MuiTextField value={color.value} onChange={color.change} label="Color" />

      <div className="flex flex-col gap-2 py-3">
        {IMEIs?.map((imei) => (
          <div key={imei} className="flex items-center justify-start gap-1">
            <div>
              <IconButton 
              size="small"
                onClick={() => setIMEIs((p) => p.filter((v) => v !== imei))}
              >
                <FIcon icon="times" />
              </IconButton>
            </div>
            <p>{imei}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <MuiTextField
          disabled={!color.value}
          label="IMEI"
          value={imei.value}
          onChange={imei.change}
        />
        <Button onClick={addImei} variant="contained">
          Add
        </Button>
      </div>
    </div>
  );
}

export default function ColorAndIMEI({
  onChange,
  defaultIMEIs,
}: {
  onChange: onChange;
  defaultIMEIs: IMEIS;
}) {
  const [items, setItems] = useState<IMEIS>(defaultIMEIs || {});

  useEffect(() => {
    console.log('items ', items);
  }, [items]);

  return (
    <div className="space-y-2 rounded bg-gray-100 p-3 dark:bg-gray-900">
      {Object.entries(items).map(([key, value]) => (
        <Single item={{ [key]: value }} setItems={setItems} />
      ))}
    </div>
  );
}
