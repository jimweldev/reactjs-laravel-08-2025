import { useState } from 'react';
import { FaHistory } from 'react-icons/fa';
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
import RestoreUser from './_components/restore-user';

const ArchivedUsersTab = () => {
  // Store
  const { setSelectedUser } = useUserStore();

  // Dialog States
  const [openRestoreUserDialog, setOpenRestoreUserDialog] = useState(false);

  // Tanstack query hook for pagination
  const usersPagination = useTanstackQueryPaginate<User>({
    endpoint: '/users/archived',
    defaultSort: 'last_name,first_name',
  });

  // Define table columns
  const columns: DataTableColumn[] = [
    { label: 'Name', column: 'name' },
    { label: 'Created At', column: 'created_at', className: 'w-[200px]' },
    { label: 'Actions', className: 'w-[100px]' },
  ];

  return (
    <>
      {/* Card */}
      <Card>
        <CardBody>
          {/* Data Table */}
          <DataTable pagination={usersPagination} columns={columns}>
            {/* Render rows only if data is present */}
            {usersPagination.data?.records
              ? usersPagination.data.records.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {getDateTimezone(user.created_at, 'date_time')}
                    </TableCell>
                    <TableCell>
                      <InputGroup size="sm">
                        {/* Restore button */}
                        <Tooltip content="Restore">
                          <Button
                            variant="warning"
                            size="icon-xs"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenRestoreUserDialog(true);
                            }}
                          >
                            <FaHistory />
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
      <RestoreUser
        open={openRestoreUserDialog}
        setOpen={setOpenRestoreUserDialog}
        refetch={usersPagination.refetch}
      />
    </>
  );
};

export default ArchivedUsersTab;
