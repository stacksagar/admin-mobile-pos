import { Outlet } from 'react-router-dom';
import SettingSidebar from './SettingSidebar';

export default function Settings() {
  return (
    <div className="gap-6 lg:flex">
      <SettingSidebar />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
