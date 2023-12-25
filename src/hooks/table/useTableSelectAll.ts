import React from 'react';

export default function useTableSelectAll() {
  const [selectedIds, setSelected] = React.useState<any[]>([]);
  function onChangeSelected(ids: any[]) {
    setSelected(ids);
  }

  return { selectedIds, onChangeSelected };
}