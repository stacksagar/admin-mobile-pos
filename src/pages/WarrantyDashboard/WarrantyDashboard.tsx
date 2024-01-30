import { useEffect } from 'react';

import DashboardCard from '../Dashboard/DashboardCard';
import useNumber from '../../hooks/state/useNumber';
import useWarranties from '../../hooks/react-query/useWarranties';

const WarrantyDashboard = () => {
  const { warranties } = useWarranties();
  const total_warranty_fee = useNumber(0);
  const total_delivery_fee = useNumber(0);
  const total_advance = useNumber(0);
  const total_due = useNumber(0);

  useEffect(() => {
    warranties?.map((w) => {
      console.log(w?.warranty_fee);
      total_warranty_fee.set((p) => p + (w.warranty_fee || 0));
      total_delivery_fee.set((p) => p + (w.delivery_fee || 0));
      total_advance.set((p) => p + (w.advance_amount || 0));
      total_due.set((p) => p + (w.due_amount || 0));
    });
  }, [warranties]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <DashboardCard
            to="/warranties"
            value={total_delivery_fee.value + total_warranty_fee.value}
            title="Total Amount"
            icon="dollar"
            bg="bg-pink-600"
          />
        </div>
        <div className="xl:col-span-4">
          <DashboardCard
            to="/warranties"
            value={total_delivery_fee.value}
            title="Total Delivery Fee"
            icon="dollar"
            bg="bg-cyan-600"
          />
        </div>

        <div className="xl:col-span-4">
          <DashboardCard
            to="/warranties"
            value={total_warranty_fee.value}
            title="Total Warranty Fee"
            icon="dollar"
            bg="bg-amber-500"
          />
        </div>

        <div className="xl:col-span-6">
          <DashboardCard
            to="/warranties"
            value={total_advance.value}
            title="Total Advance"
            icon="dollar"
            bg="bg-blue-500"
          />
        </div>
        <div className="xl:col-span-6">
          <DashboardCard
            to="/warranties"
            value={total_due.value}
            title="Total Due"
            icon="dollar"
            bg="bg-fuchsia-500"
          />
        </div>
      </div>
    </div>
  );
};

export default WarrantyDashboard;
