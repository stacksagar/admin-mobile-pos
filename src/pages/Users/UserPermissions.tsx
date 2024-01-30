import Label from '../../common/Forms/Label';
import { Checkbox } from '@mui/material';
import admin_links from '../../data/admin.links';
import useArray from '../../hooks/state/useArray';

export default function UserPermissions() {
  const permissions = useArray([] as string[]);

  function changePermission(checked: boolean, link: string) {
    permissions.set((prev) => {
      if (checked) {
        return [...prev, link];
      } else {
        return prev.filter((i) => i !== link);
      }
    });
  }
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-medium">Give Desire Permissions</h2>

      {admin_links?.map((item: any) => (
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
  );
}
