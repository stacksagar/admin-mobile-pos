import { NavLink } from 'react-router-dom';
import FIcon from '../../common/Icons/FIcon';
import AdminPanelLogo from '../../common/Logos/AdminPanelLogo';

type Props = {
  trigger: React.MutableRefObject<any>;
  setSidebarOpen: (arg: boolean) => void;
  sidebarOpen: boolean;
};

export default function SidebarHeader({
  trigger,
  setSidebarOpen,
  sidebarOpen,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-2 px-6 max-h-[75px] border-b">
      <NavLink to="/" className="py-2">
        {/* <div className="flex items-center justify-around gap-2">
          <div className="text-2xl text-blue-300 transform -rotate-12">
            <FIcon icon="mobile-screen" />
          </div>
          <div className="space-x-1 border-r-2 border-t-2 border-b-2 border-white border-opacity-20 py-1 pr-2 text-xl font-bold tracking-wider">
            <span className="text-blue-600">GADGET</span>
            <span className="text-blue-200">POINT</span>
          </div>
        </div> */}
        <AdminPanelLogo />
      </NavLink>

      <button
        title="Hide Sidebar"
        ref={trigger}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-expanded="true"
        className="block text-xl lg:hidden"
      >
        <FIcon icon="times" />
      </button>
    </div>
  );
}
