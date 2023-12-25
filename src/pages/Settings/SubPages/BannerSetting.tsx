import { Button, TextField } from '@mui/material';
import { useSetting } from '../../../context/setting';
import useUpdate from '../../../hooks/axios/useUpdateAsync';
import { useEffect, useState } from 'react';
import FIcon from '../../../common/Icons/FIcon';
import imageUpload from '../../../utils/imageUpload';

export default function BannerSetting() {
  const { setting, setSetting } = useSetting();
  const update = useUpdate();

  const [banner_width, set_banner_width] = useState<string>('');
  const [banners, setBanners] = useState<{ img: string; link: string }[]>([
    {
      img: '',
      link: '',
    },
  ]);

  function change_handler(e: any, i2: any) {
    setBanners((p: any) => {
      return p.map((b: any, i: any) =>
        i === i2 ? { ...b, link: e?.target?.value } : b
      );
    });
  }

  function add_new_banner() {
    setBanners((p: any) => [...(p || []), { img: '', link: '' }]);
  }

  function remove_handler(i2: any) {
    setBanners((p: any) => {
      return p.filter((_b: any, i: any) => i !== i2);
    });
  }

  const [b_uploading, set_b_uploading] = useState(false);
  async function banner_upload(e: any, i2: any) {
    const data = await imageUpload(e?.target?.files[0], set_b_uploading);

    setBanners((p: any) => {
      return p.map((b: any, i: any) =>
        i === i2 ? { ...b, img: data?.url } : b
      );
    });
  }

  useEffect(() => {
    setBanners(setting?.client?.banners || []);
  }, [setting]);

  async function submit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    const newData = {
      banners,
      banner_width,
    };

    const data = await update('/setting', {
      client: { ...setting?.client, ...newData },
    });
    setSetting(data?.setting || {});
  }

  return (
    <form
      onSubmit={submit}
      className="w-full space-y-9 bg-white dark:bg-black sm:p-5 lg:p-10"
    >
      <div className="space-y-9">
        <TextField
          defaultValue={setting?.client?.banner_width}
          onChange={(e) => set_banner_width(e.target.value || '')}
          className="w-full"
          label="Banner Width Full?"
        />

        {banners?.map((b: any, i: any) => (
          <div
            key={i}
            className="relative w-full space-y-2 rounded bg-white p-6 shadow"
          >
            <button
              type="button"
              title="remove this banner"
              onClick={() => remove_handler(i)}
              className="absolute right-1.5 top-1.5 text-xl text-red-500"
            >
              <FIcon icon="trash" />
            </button>
            {b?.img ? (
              <img src={b?.img} alt="" className="w-full rounded lg:w-96" />
            ) : (
              <div className="text-dark-primary border-dark-primary relative flex flex-col items-center justify-center gap-y-3 border border-dashed p-5">
                {b_uploading ? (
                  <h2>Uploading</h2>
                ) : (
                  <>
                    <h2>Upload Banner</h2>
                    <small>Recommended size: Width 1300px * Height 350px</small>
                    <h2>
                      <FIcon icon="upload" />
                    </h2>
                  </>
                )}
                <input
                  title="choose banner image"
                  onChange={(e) => banner_upload(e, i)}
                  type="file"
                  className="absolute inset-0 z-50 m-auto block h-full w-full opacity-0"
                />
              </div>
            )}

            <TextField
              className="w-full"
              type="input"
              placeholder="Banner link"
              value={banners[i]?.link || ''}
              onChange={(e) => change_handler(e, i)}
            />
          </div>
        ))}

        <div className="w-fit">
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={add_new_banner}
          >
            Add New Banner
          </Button>
        </div>
        <Button variant="contained" type="submit">
          Update Banners
        </Button>
      </div>
    </form>
  );
}
