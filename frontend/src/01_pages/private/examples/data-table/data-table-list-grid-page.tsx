import { useState } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { type Task } from '@/04_types/task';
import useTaskStore from '@/05_stores/task-store';
import DataTable, {
  type DataTableColumn,
} from '@/components/data-table/data-table';
import InputGroup from '@/components/input-group/input-group';
import DataTableGridSkeleton from '@/components/skeleton/data-table-grid-skeleton';
import Tooltip from '@/components/tooltip/tooltip';
import PageHeader from '@/components/typography/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { TableCell, TableRow } from '@/components/ui/table';
import useTanstackQueryPaginate from '@/hooks/tanstack/use-tanstack-query-paginate';
import { getDateTimezone } from '@/lib/date/get-date-timezone';
import CreateTask from './_components/create-task';
import DeleteTask from './_components/delete-task';
import UpdateTask from './_components/update-task';

const DataTableListGridPage = () => {
  // Store
  const { setSelectedTask } = useTaskStore();

  // Dialog States
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);
  const [openUpdateTaskDialog, setOpenUpdateTaskDialog] = useState(false);
  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = useState(false);

  // Tanstack query hook for pagination
  const tasksPagination = useTanstackQueryPaginate<Task>({
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

  const list = (
    <>
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
    </>
  );

  const grid = (
    <>
      {/* Render rows only if data is present */}
      {tasksPagination.data?.records ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
          {tasksPagination.data.records.map(task => (
            <div className="p-layout rounded border" key={task.id}>
              <h4 className="mb-layout">{task.name}</h4>

              <div className="flex justify-end">
                <InputGroup size="sm">
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
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );

  return (
    <>
      <PageHeader className="mb-layout">Data Table List/Grid</PageHeader>

      {/* Card */}
      <Card>
        <CardBody>
          {/* Data Table */}
          <DataTable
            pagination={tasksPagination}
            columns={columns}
            actions={actions}
            showViewToggle
            list={list}
            grid={grid}
            skeleton={<DataTableGridSkeleton />}
          ></DataTable>
        </CardBody>
      </Card>

      {/* Modals */}
      <CreateTask
        open={openCreateTaskDialog}
        setOpen={setOpenCreateTaskDialog}
        refetch={tasksPagination.refetch}
      />
      <UpdateTask
        open={openUpdateTaskDialog}
        setOpen={setOpenUpdateTaskDialog}
        refetch={tasksPagination.refetch}
      />
      <DeleteTask
        open={openDeleteTaskDialog}
        setOpen={setOpenDeleteTaskDialog}
        refetch={tasksPagination.refetch}
      />
    </>
  );
};

export default DataTableListGridPage;
