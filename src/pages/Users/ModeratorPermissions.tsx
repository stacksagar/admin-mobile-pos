import Label from '../../common/Forms/Label';
import { Button, Checkbox } from '@mui/material';
import admin_links from '../../data/admin.links';
import useArray from '../../hooks/state/useArray';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { UserT } from '../../data';
import toast from '../../libs/toast';

export default function ModeratorPermissions() {
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [user, setUser] = useState({} as UserT);

  const permissions = useArray([] as string[]);
  const [links, setLinks] = useState<{ link: string; checked: boolean }[]>([]);

  function changePermission(checked: boolean, link: string) {
    permissions.set((prev) => {
      if (checked) {
        return [...prev, link];
      } else {
        return prev.filter((i) => i !== link);
      }
    });
  }

  useEffect(() => {
    const id = params.get('id');
    if (!id) return;

    (async () => {
      const { data } = await axios.get<UserT>(`/auth/user/${id}`);
      if (!data?.id) return navigate('/moderators');
      setLinks(
        admin_links.map((item) =>
          data?.permission?.values?.includes(item?.link)
            ? { ...item, checked: true }
            : { ...item, checked: false }
        )
      );
      permissions.set(data?.permission?.values || []);
      setUser(data);
    })();
  }, [params]);

  async function updatePermission() {
    try {
      await axios.put(`/auth/user/permissions/${user.id}`, {
        permission: { ...user.permission, values: permissions.data },
      });
      toast({
        message: 'Permissions updated!',
      });
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  return (
    <div className=" rounded bg-white p-3 dark:bg-gray-900 lg:p-6">
      <h2 className="text-xl font-medium">
        Give Permissions to <b> {user?.name} </b>
      </h2>
      <br />
      <div className="flex flex-col">
        {links?.map((item: any) => (
          <Label
            key={item?.link}
            htmlFor={item?.link}
            className="cursor-pointer capitalize"
          >
            <Checkbox
              onChange={(e) => changePermission(e.target.checked, item?.link)}
              defaultChecked={item?.checked}
              id={item?.link}
            />
            <span className="cursor-pointer">
              {item?.link === '/'
                ? 'Dashboard'
                : item?.link
                    ?.replace('/', '')
                    ?.replaceAll('-', ' ')
                    ?.replaceAll('_', ' ')}
            </span>
          </Label>
        ))}
      </div>
      <br />
      <Button onClick={updatePermission} variant="contained" size="large">
        Save
      </Button>
    </div>
  );
}
