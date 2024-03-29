'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

import MuiTableHead from './MuiTableHead';
import MuiTableHeadToolbar from './MuiTableHeadToolbar';
import { Button } from '@mui/material';
import MuiTableSkeleton from './MuiTableSkeleton';
import { uid } from 'uid';
import MuiTableDeleteWarning from './MuiTableDeleteWarning';
import useBoolean, { UseBoolean } from '../../../hooks/state/useBoolean';
import { getComparator, stableSort } from './functions';

export interface BodyRow {
  sl: number;
  id: ID;
  name: string;
  price: number;
}

interface MuiTableProps {
  tableCells: MuiTableHeader<any>[];
  rows: any[];
  tableTitle: React.ReactNode | string;
  onDelete?: (id: ID[]) => void;
  deleting?: UseBoolean;
  loading?: boolean;
  onRefreshData?: () => void;
  onEditButton?: (id: string) => void;
  CustomButton?: React.ReactNode;
}

export default function MuiTable({
  tableCells,
  rows,
  tableTitle,
  onDelete,
  deleting,
  loading,
  onRefreshData,
  onEditButton,
  CustomButton,
}: MuiTableProps) {
  const [order, setOrder] = React.useState<TableOrder>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof BodyRow>('sl');
  const [selected, setSelected] = React.useState<ID[]>([]);
  const [deleteID, setDeleteID] = React.useState(null);
  const [page, setPage] = React.useState(0);

  const showDeleteWarning = useBoolean();

  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof BodyRow
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: ID) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: ID[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: ID) => selected?.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );

  if (loading) return <MuiTableSkeleton tableTitle={tableTitle} />;

  return (
    <div className="max-w-[100%]">
      <MuiTableDeleteWarning
        deleting={deleting}
        showDeleteWarning={showDeleteWarning}
        onConfirm={() => onDelete && onDelete(deleteID ? [deleteID] : selected)}
        total={deleteID ? 1 : selected?.length}
      />
      <Box>
        <Paper sx={{ mb: 2 }}>
          <MuiTableHeadToolbar
            clearDeleteID={() => setDeleteID(null)}
            tableTitle={tableTitle}
            selected={selected}
            showDeleteWarning={showDeleteWarning}
            onRefreshData={onRefreshData}
            CustomButton={CustomButton}
          />

          <TableContainer>
            <Table aria-labelledby="tableTitle">
              <MuiTableHead
                numSelected={selected?.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows?.length}
                headCells={tableCells}
              />

              <TableBody>
                {visibleRows.map((row: any, _index) => (
                  <TableRow
                    key={row?.id || uid()}
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isSelected(row.id)}
                    tabIndex={-1}
                    selected={isSelected(row.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isSelected(row.id)} />
                    </TableCell>

                    {tableCells.map((cell, index) => {
                      const {
                        key,
                        RenderComponent,
                        WrapperComponent,
                        className,
                        align,
                        startIcon,
                        endIcon,
                        ActionButtons,
                        shouldHideDeleteButton,
                        shouldDisableDeleteButton,
                      } = cell;

                      return (
                        <React.Fragment key={key as string}>
                          <TableCell
                            align={align}
                            className={`${
                              className ? className : ''
                            } whitespace-nowrap pr-3`}
                          >
                            {RenderComponent ? (
                              <RenderComponent row={row} />
                            ) : typeof row[key] === 'object' ? (
                              index == 0 ? (
                                <div className="max-w-[200px] text-yellow-600">
                                  Hey bro, this is got object, please use custom
                                  <b> RenderComponent </b>
                                  in tableCells
                                  <pre className="mt-3 rounded bg-black p-3 text-yellow-300">
                                    {JSON.stringify(row[key], null, 2)}
                                  </pre>
                                </div>
                              ) : null
                            ) : WrapperComponent ? (
                              <WrapperComponent row={row}>
                                {row[key]}
                              </WrapperComponent>
                            ) : key === 'actions' ? (
                              <div className="space-x-1 whitespace-nowrap">
                                {ActionButtons ? (
                                  <ActionButtons row={row} />
                                ) : null}

                                {shouldHideDeleteButton &&
                                shouldHideDeleteButton(row) ? (
                                  <>{/* completed */}</>
                                ) : (
                                  <Button
                                    disabled={
                                      shouldDisableDeleteButton &&
                                      shouldDisableDeleteButton(row)
                                    }
                                    title="Delete item"
                                    onClick={() => {
                                      setDeleteID(row?.id);
                                      showDeleteWarning.setTrue();
                                    }}
                                    color="error"
                                    variant="contained"
                                    size="small"
                                  >
                                    <span>Delete</span>
                                  </Button>
                                )}

                                {onEditButton ? (
                                  <Button
                                    onClick={() => onEditButton(row?.id)}
                                    variant="contained"
                                    size="small"
                                  >
                                    Edit
                                  </Button>
                                ) : null}
                              </div>
                            ) : (
                              <>
                                {startIcon}
                                {row[key]}
                                {endIcon}
                              </>
                            )}
                          </TableCell>
                        </React.Fragment>
                      );
                    })}
                  </TableRow>
                ))}

                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 50, 100, 500]}
            component="div"
            count={rows?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />



        </Paper>
      </Box>
    </div>
  );
}
