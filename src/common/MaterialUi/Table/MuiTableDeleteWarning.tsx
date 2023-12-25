import { useEffect } from 'react';
import MuiConfirmationDialog from '../Modal/MuiConfirmationDialog';
import useTracking from '../../../hooks/useTracking';
import { UseBoolean } from '../../../hooks/state/useBoolean';

interface Props {
  showDeleteWarning: UseBoolean;
  deleting?: UseBoolean;
  onConfirm: () => void;
  total?: number;
}

export default function MuiTableDeleteWarning({
  deleting,
  showDeleteWarning,
  onConfirm,
  total,
}: Props) {
  const tracking = useTracking();

  useEffect(() => {
    tracking.start(deleting?.true);
    tracking.finish(!deleting?.true);
  }, [tracking, deleting]);

  useEffect(() => {
    if (tracking.done) {
      showDeleteWarning.setFalse();
      tracking.reset();
    }
  }, [showDeleteWarning, tracking]);

  return (
    <MuiConfirmationDialog
      loading={deleting?.true}
      showModal={showDeleteWarning}
      warningText={`Want to delete all selected '${total}' items?`}
      onConfirm={onConfirm}
      confirmButtonText={`Delete (${total}) items!`}
    />
  );
}
