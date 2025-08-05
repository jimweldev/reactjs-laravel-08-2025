import { useState } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { type SystemGlobalDropdown } from '@/04_types/system/system-global-dropdown';
import useSystemGlobalDropdownStore from '@/05_stores/system/system-global-dropdown-store';
import DataTable, {
  type DataTableColumn,
} from '@/components/data-table/data-table';
import InputGroup from '@/components/input-group/input-group';
import Tooltip from '@/components/tooltip/tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { TableCell, TableRow } from '@/components/ui/table';
import useTanstackQueryPaginate from '@/hooks/tanstack/use-tanstack-query-paginate';
import { getDateTimezone } from '@/lib/date/get-date-timezone';
import CreateGlobalDropdown from './_components/create-global-dropdown';
import DeleteGlobalDropdown from './_components/delete-global-dropdown';
import UpdateGlobalDropdown from './_components/update-global-dropdown';

const GlobalDropdownsTab = () => {
  // Store
  const { setSelectedSystemGlobalDropdown } = useSystemGlobalDropdownStore();

  // Dialog States
  const [openCreateGlobalDropdownDialog, setOpenCreateGlobalDropdownDialog] =
    useState(false);
  const [openUpdateGlobalDropdownDialog, setOpenUpdateGlobalDropdownDialog] =
    useState(false);
  const [openDeleteGlobalDropdownDialog, setOpenDeleteGlobalDropdownDialog] =
    useState(false);

  // Tanstack query hook for pagination
  const systemGlobalDropdownsPagination =
    useTanstackQueryPaginate<SystemGlobalDropdown>({
      endpoint: '/system/global-dropdowns',
      defaultSort: 'label',
    });

  // Define table columns
  const columns: DataTableColumn[] = [
    { label: 'Label', column: 'label' },
    { label: 'Module', column: 'module' },
    { label: 'Type', column: 'type' },
    { label: 'Created At', column: 'created_at', className: 'w-[200px]' },
    { label: 'Actions', className: 'w-[100px]' },
  ];

  // Actions buttons
  const actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateGlobalDropdownDialog(true);
      }}
    >
      Create
    </Button>
  );

  return (
    <>
      {/* Card */}
      <Card>
        <CardBody>
          {/* Data Table */}
          <DataTable
            pagination={systemGlobalDropdownsPagination}
            columns={columns}
            actions={actions}
          >
            {/* Render rows only if data is present */}
            {systemGlobalDropdownsPagination.data?.records
              ? systemGlobalDropdownsPagination.data.records.map(
                  systemGlobalDropdown => (
                    <TableRow key={systemGlobalDropdown.id}>
                      <TableCell>{systemGlobalDropdown.label}</TableCell>
                      <TableCell>{systemGlobalDropdown.module}</TableCell>
                      <TableCell>{systemGlobalDropdown.type}</TableCell>
                      <TableCell>
                        {getDateTimezone(
                          systemGlobalDropdown.created_at,
                          'date_time',
                        )}
                      </TableCell>
                      <TableCell>
                        <InputGroup size="sm">
                          {/* Update button */}
                          <Tooltip content="Update">
                            <Button
                              variant="info"
                              size="icon-xs"
                              onClick={() => {
                                setSelectedSystemGlobalDropdown(
                                  systemGlobalDropdown,
                                );
                                setOpenUpdateGlobalDropdownDialog(true);
                              }}
                            >
                              <FaPenToSquare />
                            </Button>
                          </Tooltip>

                          {/* Delete button */}
                          <Tooltip content="Delete">
                            <Button
                              variant="destructive"
                              size="icon-xs"
                              onClick={() => {
                                setSelectedSystemGlobalDropdown(
                                  systemGlobalDropdown,
                                );
                                setOpenDeleteGlobalDropdownDialog(true);
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </Tooltip>
                        </InputGroup>
                      </TableCell>
                    </TableRow>
                  ),
                )
              : null}
          </DataTable>
        </CardBody>
      </Card>

      {/* Modals */}
      <CreateGlobalDropdown
        open={openCreateGlobalDropdownDialog}
        setOpen={setOpenCreateGlobalDropdownDialog}
        refetch={systemGlobalDropdownsPagination.refetch}
      />
      <UpdateGlobalDropdown
        open={openUpdateGlobalDropdownDialog}
        setOpen={setOpenUpdateGlobalDropdownDialog}
        refetch={systemGlobalDropdownsPagination.refetch}
      />
      <DeleteGlobalDropdown
        open={openDeleteGlobalDropdownDialog}
        setOpen={setOpenDeleteGlobalDropdownDialog}
        refetch={systemGlobalDropdownsPagination.refetch}
      />
    </>
  );
};

export default GlobalDropdownsTab;
