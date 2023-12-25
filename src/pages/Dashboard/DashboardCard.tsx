import { Link } from 'react-router-dom';
import FIcon from '../../common/Icons/FIcon';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
  icon: IconProp;
  title: string;
  value?: number;
  currency?: string;
  sub_title?: string;
  bg?: string;
  to: string;
}

export default function DashboardCard({ to, bg, value, title, icon }: Props) {
  return (
    <Link to={to || '/'}>
      <div className="overflow-hidden rounded text-white">
        <div className={`${bg} group flex items-center justify-between p-5`}>
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-semibold text-white">
              {value?.toString()}
            </h2>
            <h2 className="pb-6 text-base text-white">{title?.toString()}</h2>
          </div>
          <div className="transform text-4xl opacity-30 transition-all group-hover:scale-110">
            <FIcon icon={icon} />
          </div>
        </div>
        <div
          className={`${bg} flex items-center justify-center gap-x-2 bg-opacity-70 p-1 text-sm`}
        >
          <span>More Info</span>
          <span>
            <FIcon icon="arrow-right" />
          </span>
        </div>
      </div>
    </Link>
  );
}
