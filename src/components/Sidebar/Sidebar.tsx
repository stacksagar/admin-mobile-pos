import { useEffect, useRef, useState } from 'react';

import SidebarItem from './SidebarItem';
import GridSvg from '../../svgs/GridSvg';
import SidebarHeader from './SidebarHeader';
import SidebarItemGroup from './SidebarItemGroup';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };

    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-[99] flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <SidebarHeader
        trigger={trigger}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
      {/* <!-- SIDEBAR HEADER --> */}

      {/* <!-- Sidebar Menu --> */}
      <nav className="flex flex-col overflow-y-auto px-4 pt-3 duration-300 ease-linear lg:px-6">
        <div>
          <ul className="mb-6 flex flex-col gap-1.5">
            <SidebarItem to="/" title="Dashboard" CustomIcon={<GridSvg />} />

            <SidebarItem to="/pos" title="Sale Create POS" icon="p" />
            <SidebarItem to="/sales" title="Sales" icon="file" />

            <SidebarItemGroup
              title="Suppliers"
              icon="users-line"
              items={[
                {
                  to: '/suppliers',
                  title: 'Suppliers',
                  icon: 'users',
                },
                {
                  to: '/supplier-purchase-history',
                  title: 'Purchase Histories',
                  icon: 'history',
                },
              ]}
            />

            <SidebarItemGroup
              title="Warranty"
              icon="calendar"
              items={[
                {
                  to: '/warranty-dashboard',
                  title: 'W. Dashboard',
                  icon: 'calendar',
                },
                {
                  to: '/warranty-pos',
                  title: 'Warranty POS',
                  icon: 'calendar-alt',
                },
                {
                  to: '/warranties',
                  title: 'Warranties',
                  icon: 'calendar-alt',
                },
              ]}
            />

            <SidebarItem
              to="/barcode-print"
              title="Barcode Print"
              icon="barcode"
            />

            <SidebarItemGroup
              title="Products"
              icon="bars-staggered"
              items={[
                {
                  to: '/products-categories',
                  title: 'Categories',
                  icon: 'users',
                },
                {
                  to: '/products',
                  title: 'Products',
                  icon: 'list',
                },
              ]}
            />

            <SidebarItemGroup
              title="Expenses"
              icon="money-bill"
              items={[
                {
                  to: '/expenses-categories',
                  title: 'Categories',
                  icon: 'list-dots',
                },
                {
                  to: '/expenses',
                  title: 'All Expenses',
                  icon: 'money-bill',
                },
              ]}
            />

            {/* <SidebarItem to="/orders" title="Orders" icon="list-ol" /> */}
            <SidebarItem to="/pages" title="Pages" icon="file" />

            <SidebarItemGroup
              title="Management"
              icon="bars-staggered"
              items={[
                {
                  to: '/payments',
                  title: 'Payment',
                  icon: 'p',
                },
                {
                  to: '/discounts',
                  title: 'Discount',
                  icon: 'd',
                },
                {
                  to: '/vats',
                  title: 'Vats',
                  icon: 'v',
                },
                {
                  to: '/brands',
                  title: 'Brands',
                  icon: 'v',
                },
                {
                  to: '/customers',
                  title: 'Customers',
                  icon: 'users',
                },
                {
                  to: '/users',
                  title: 'Users',
                  icon: 'users',
                },
                {
                  to: '/moderators',
                  title: 'Moderators',
                  icon: 'user-cog',
                },

                {
                  to: '/stock-out-products',
                  title: 'Stockout Products',
                  icon: 'p',
                },
              ]}
            />
          </ul>
        </div>

        {/* <!-- Setting Group --> */}
        <div>
          <h3 className="sidebar_list_title">Settings</h3>
          <ul className="mb-6 flex flex-col gap-1.5">
            <SidebarItemGroup
              title="Profile Setting"
              icon="user-cog"
              items={[
                {
                  to: '/edit-profile',
                  title: 'Edit Profile',
                  icon: 'user-pen',
                },
                {
                  to: '/change-password',
                  title: 'Change Password',
                  icon: 'lock',
                },
              ]}
            />
            <SidebarItem
              to="/settings/header"
              title="Application Settings"
              icon="screwdriver-wrench"
            />
          </ul>
        </div>
      </nav>
      {/* <!-- Sidebar Menu --> */}
    </aside>
  );
};

export default Sidebar;
