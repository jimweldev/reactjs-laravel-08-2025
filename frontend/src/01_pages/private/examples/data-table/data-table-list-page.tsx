import { useState } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { type Task } from '@/04_types/task';
import useTaskStore from '@/05_stores/task-store';
import DataTable, {
  type DataTableColumn,
} from '@/components/data-table/data-table';
import InputGroup from '@/components/input-group/input-group';
import Tooltip from '@/components/tooltip/tooltip';
import PageHeader from '@/components/typography/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { TableCell, TableRow } from '@/components/ui/table';
import useTanstackPaginateQuery from '@/hooks/tanstack/use-tanstack-paginate-query';
import { getDateTimezone } from '@/lib/date/get-date-timezone';
import CreateTaskDialog from './_components/create-task-dialog';
import DeleteTaskDialog from './_components/delete-task-dialog';
import UpdateTaskDialog from './_components/update-task-dialog';

const DataTableListPage = () => {
  // Store
  const { setSelectedTask } = useTaskStore();

  // Dialog States
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);
  const [openUpdateTaskDialog, setOpenUpdateTaskDialog] = useState(false);
  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = useState(false);

  // Tanstack query hook for pagination
  const tasksPagination = useTanstackPaginateQuery<Task>({
    endpoint: '/tasks',
    defaultSort: 'name',
  });

  // Define table columns
  const columns: DataTableColumn[] = [
    { label: 'Name', column: 'name' },
    { label: 'Created At', column: 'created_at', className: 'w-[200px]' },
    { label: 'Actions', className: 'w-[100px]' },
  ];

  // Actions buttons
  const actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateTaskDialog(true);
      }}
    >
      Create
    </Button>
  );

  return (
    <>
      <PageHeader className="mb-3">Data Table List</PageHeader>

      {/* Card */}
      <Card>
        <CardBody>
          {/* Data Table */}
          <DataTable
            pagination={tasksPagination}
            columns={columns}
            actions={actions}
          >
            {/* Render rows only if data is present */}
            {tasksPagination.data?.records
              ? tasksPagination.data.records.map(task => (
                  <TableRow key={task.id}>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>
                      {getDateTimezone(task.created_at, 'date_time')}
                    </TableCell>
                    <TableCell>
                      <InputGroup size="sm">
                        {/* Update button */}
                        <Tooltip content="Update">
                          <Button
                            variant="info"
                            size="icon-xs"
                            onClick={() => {
                              setSelectedTask(task);
                              setOpenUpdateTaskDialog(true);
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
                              setSelectedTask(task);
                              setOpenDeleteTaskDialog(true);
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

      {/* Dialogs */}
      <CreateTaskDialog
        open={openCreateTaskDialog}
        setOpen={setOpenCreateTaskDialog}
        refetch={tasksPagination.refetch}
      />
      <UpdateTaskDialog
        open={openUpdateTaskDialog}
        setOpen={setOpenUpdateTaskDialog}
        refetch={tasksPagination.refetch}
      />
      <DeleteTaskDialog
        open={openDeleteTaskDialog}
        setOpen={setOpenDeleteTaskDialog}
        refetch={tasksPagination.refetch}
      />
    </>
  );
};

export default DataTableListPage;
