import { useState } from 'react';
import { FaPenToSquare, FaShield, FaTrash } from 'react-icons/fa6';
import { type User } from '@/04_types/user';
import useUserStore from '@/05_stores/user-store';
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
import CreateUser from './_components/create-user';
import DeleteUser from './_components/delete-user';
import UpdateUser from './_components/update-user';
import UpdateUserRoles from './_components/update-user-roles';

const ActiveUsersTab = () => {
  // Store
  const { setSelectedUser } = useUserStore();

  // Dialog States
  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
  const [openUpdateUserDialog, setOpenUpdateUserDialog] = useState(false);
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = useState(false);
  const [openUpdateUserRolesDialog, setOpenUpdateUserRolesDialog] =
    useState(false);

  // Tanstack query hook for pagination
  const usersPagination = useTanstackQueryPaginate<User>({
    endpoint: '/users',
    defaultSort: 'id',
  });

  // Define table columns
  const columns: DataTableColumn[] = [
    { label: 'ID', column: 'id', className: 'w-[80px]' },
    { label: 'Name', column: 'last_name,first_name' },
    { label: 'Created At', column: 'created_at', className: 'w-[200px]' },
    { label: 'Actions', className: 'w-[100px]' },
  ];

  // Actions buttons
  const actions = (
    <Button size="sm" onClick={() => setOpenCreateUserDialog(true)}>
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
            pagination={usersPagination}
            columns={columns}
            actions={actions}
          >
            {/* Render rows only if data is present */}
            {usersPagination.data?.records
              ? usersPagination.data.records.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {getDateTimezone(user.created_at, 'date_time')}
                    </TableCell>
                    <TableCell>
                      <InputGroup size="sm">
                        {/* Update button */}
                        <Tooltip content="Update">
                          <Button
                            variant="info"
                            size="icon-xs"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenUpdateUserDialog(true);
                            }}
                          >
                            <FaPenToSquare />
                          </Button>
                        </Tooltip>

                        {/* Update Roles button */}
                        <Tooltip content="Update user roles">
                          <Button
                            variant="warning"
                            size="icon-xs"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenUpdateUserRolesDialog(true);
                            }}
                          >
                            <FaShield />
                          </Button>
                        </Tooltip>

                        {/* Delete button */}
                        <Tooltip content="Delete">
                          <Button
                            variant="destructive"
                            size="icon-xs"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenDeleteUserDialog(true);
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
        </CardBody>
      </Card>

      {/* Modals */}
      <CreateUser
        open={openCreateUserDialog}
        setOpen={setOpenCreateUserDialog}
        refetch={usersPagination.refetch}
      />
      <UpdateUser
        open={openUpdateUserDialog}
        setOpen={setOpenUpdateUserDialog}
        refetch={usersPagination.refetch}
      />
      <DeleteUser
        open={openDeleteUserDialog}
        setOpen={setOpenDeleteUserDialog}
        refetch={usersPagination.refetch}
      />
      <UpdateUserRoles
        open={openUpdateUserRolesDialog}
        setOpen={setOpenUpdateUserRolesDialog}
        refetch={usersPagination.refetch}
      />
    </>
  );
};

export default ActiveUsersTab;
