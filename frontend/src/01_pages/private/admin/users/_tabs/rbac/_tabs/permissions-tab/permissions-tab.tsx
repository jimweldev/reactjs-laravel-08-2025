import { useState } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { type RbacPermission } from '@/04_types/rbac-permission';
import usePermissionStore from '@/05_stores/permission-store';
import DataTable, {
  type DataTableColumn,
} from '@/components/data-table/data-table';
import InputGroup from '@/components/input-group/input-group';
import Tooltip from '@/components/tooltip/tooltip';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import useTanstackQueryPaginate from '@/hooks/tanstack/use-tanstack-query-paginate';
import { getDateTimezone } from '@/lib/date/get-date-timezone';
import CreatePermission from './_components/create-permission';
import DeletePermission from './_components/delete-permission';
import UpdatePermission from './_components/update-permission';

const PermissionsTab = () => {
  // Store
  const { setSelectedPermission } = usePermissionStore();

  // Dialog States
  const [openCreatePermissionDialog, setOpenCreatePermissionDialog] =
    useState(false);
  const [openUpdatePermissionDialog, setOpenUpdatePermissionDialog] =
    useState(false);
  const [openDeletePermissionDialog, setOpenDeletePermissionDialog] =
    useState(false);

  // Tanstack query hook for pagination
  const permissionsPagination = useTanstackQueryPaginate<RbacPermission>({
    endpoint: '/rbac/permissions',
    defaultSort: 'id',
  });

  // Define table columns
  const columns: DataTableColumn[] = [
    { label: 'ID', column: 'id', className: 'w-[80px]' },
    { label: 'Label', column: 'label' },
    { label: 'Value', column: 'value' },
    { label: 'Created At', column: 'created_at', className: 'w-[200px]' },
    { label: 'Actions', className: 'w-[100px]' },
  ];

  // Actions buttons
  const actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreatePermissionDialog(true);
      }}
    >
      Create
    </Button>
  );

  return (
    <>
      {/* Data Table */}
      <DataTable
        pagination={permissionsPagination}
        columns={columns}
        actions={actions}
      >
        {/* Render rows only if data is present */}
        {permissionsPagination.data?.records
          ? permissionsPagination.data.records.map(permission => (
              <TableRow key={permission.id}>
                <TableCell>{permission.id}</TableCell>
                <TableCell>{permission.label}</TableCell>
                <TableCell>{permission.value}</TableCell>
                <TableCell>
                  {getDateTimezone(permission.created_at, 'date_time')}
                </TableCell>
                <TableCell>
                  <InputGroup size="sm">
                    {/* Update button */}
                    <Tooltip content="Update">
                      <Button
                        variant="info"
                        size="icon-xs"
                        onClick={() => {
                          setSelectedPermission(permission);
                          setOpenUpdatePermissionDialog(true);
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
                          setSelectedPermission(permission);
                          setOpenDeletePermissionDialog(true);
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </Tooltip>
                  </InputGroup>
                </TableCell>
              </TableRow>
            ))
          : null}
      </DataTable>

      {/* Modals */}
      <CreatePermission
        open={openCreatePermissionDialog}
        setOpen={setOpenCreatePermissionDialog}
        refetch={permissionsPagination.refetch}
      />
      <UpdatePermission
        open={openUpdatePermissionDialog}
        setOpen={setOpenUpdatePermissionDialog}
        refetch={permissionsPagination.refetch}
      />
      <DeletePermission
        open={openDeletePermissionDialog}
        setOpen={setOpenDeletePermissionDialog}
        refetch={permissionsPagination.refetch}
      />
    </>
  );
};

export default PermissionsTab;
