import { Link } from 'react-router-dom';
import FIcon from '../../common/Icons/FIcon';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
  icon: IconProp;
  title: string;
  value: number;
  value2: number;
  currency?: string;
  sub_title?: string;
  bg?: string;
  to: string;
}

export default function DashboardCard2({
  to,
  bg,
  value,
  value2,
  title,
  icon,
}: Props) {
  return (
    <Link to={to || '/'}>
      <div className="overflow-hidden rounded text-white">
        <div className={`${bg} group flex items-center justify-between p-5`}>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-6">
              <div className="flex flex-col">
                <span className="text-3xl font-semibold">
                  {value?.toString() || 0}
                </span>
                <small className="text-cyan-200">Sales Amount</small>
              </div>

              <div className="flex flex-col">
                <span className="text-3xl font-semibold">
                  {value2?.toString() || 0}
                </span>
                <small className="text-cyan-200">Profiit Amount</small>
              </div>
            </div>
            <h2 className="text-base text-white">{title?.toString()}</h2>
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
