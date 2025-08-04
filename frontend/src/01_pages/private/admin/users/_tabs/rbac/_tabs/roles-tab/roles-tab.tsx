import { useState } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { type RbacRole } from '@/04_types/rbac-role';
import useRoleStore from '@/05_stores/role-store';
import DataTable, {
  type DataTableColumn,
} from '@/components/data-table/data-table';
import InputGroup from '@/components/input-group/input-group';
import Tooltip from '@/components/tooltip/tooltip';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import useTanstackQueryPaginate from '@/hooks/tanstack/use-tanstack-query-paginate';
import { getDateTimezone } from '@/lib/date/get-date-timezone';
import CreateRole from './_components/create-role';
import DeleteRole from './_components/delete-role';
import UpdateRole from './_components/update-role';

const RolesTab = () => {
  // Store
  const { setSelectedRole } = useRoleStore();

  // Dialog States
  const [openCreateRoleDialog, setOpenCreateRoleDialog] = useState(false);
  const [openUpdateRoleDialog, setOpenUpdateRoleDialog] = useState(false);
  const [openDeleteRoleDialog, setOpenDeleteRoleDialog] = useState(false);

  // Tanstack query hook for pagination
  const rolesPagination = useTanstackQueryPaginate<RbacRole>({
    endpoint: '/rbac/roles',
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
        setOpenCreateRoleDialog(true);
      }}
    >
      Create
    </Button>
  );

  return (
    <>
      {/* Data Table */}
      <DataTable
        pagination={rolesPagination}
        columns={columns}
        actions={actions}
      >
        {/* Render rows only if data is present */}
        {rolesPagination.data?.records
          ? rolesPagination.data.records.map(role => (
              <TableRow key={role.id}>
                <TableCell>{role.id}</TableCell>
                <TableCell>{role.label}</TableCell>
                <TableCell>{role.value}</TableCell>
                <TableCell>
                  {getDateTimezone(role.created_at, 'date_time')}
                </TableCell>
                <TableCell>
                  <InputGroup size="sm">
                    {/* Update button */}
                    <Tooltip content="Update">
                      <Button
                        variant="info"
                        size="icon-xs"
                        onClick={() => {
                          setSelectedRole(role);
                          setOpenUpdateRoleDialog(true);
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
                          setSelectedRole(role);
                          setOpenDeleteRoleDialog(true);
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
      <CreateRole
        open={openCreateRoleDialog}
        setOpen={setOpenCreateRoleDialog}
        refetch={rolesPagination.refetch}
      />
      <UpdateRole
        open={openUpdateRoleDialog}
        setOpen={setOpenUpdateRoleDialog}
        refetch={rolesPagination.refetch}
      />
      <DeleteRole
        open={openDeleteRoleDialog}
        setOpen={setOpenDeleteRoleDialog}
        refetch={rolesPagination.refetch}
      />
    </>
  );
};

export default RolesTab;
