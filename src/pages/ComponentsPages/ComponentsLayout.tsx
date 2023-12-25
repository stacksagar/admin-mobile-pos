import { NavLink, Outlet } from 'react-router-dom';

export default function ComponentsLayout() {
  return (
    <main>
      <header className='p-4 bg-gray'>
        <nav className="flex flex-wrap gap-4">
          <NavLink to="form-elements">form-elements</NavLink>{' '}
          <NavLink to="form-layout">form-layout</NavLink>{' '}
          <NavLink to="tables">tables</NavLink>{' '}
          <NavLink to="chart">chart</NavLink>{' '}
        </nav>
      </header>
      <Outlet />
    </main>
  );
}
