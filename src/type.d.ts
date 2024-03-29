type TableOrder = 'asc' | 'desc';
type ID = number;
type Tracking = 'initial' | 'start' | 'finished';

interface KeyValuePair {
  [key: string]: any;
}

type MuiTableHeader<T> = {
  key: keyof (T & { actions: string });
  startIcon?: React.ReactNode | string;
  endIcon?: React.ReactNode | string;
  label?: string;
  disablePadding?: boolean;
  numeric?: boolean;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  RenderComponent?: ({ row }: { row: T }) => React.ReactNode;
  ActionButtons?: ({ row }: { row: T }) => React.ReactNode;
  shouldHideDeleteButton?: (row: T) => boolean;
  shouldDisableDeleteButton?: (row: T) => boolean;
  WrapperComponent?: ({
    children,
  }: {
    children: React.ReactNode;
    row: T;
  }) => React.ReactNode;
};

type Roles = 'user' | 'moderator' | 'admin';
