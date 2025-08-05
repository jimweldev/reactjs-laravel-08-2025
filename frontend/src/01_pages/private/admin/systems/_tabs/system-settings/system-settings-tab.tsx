import { useState } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { type SystemSetting } from '@/04_types/system/system-setting';
import useSystemSettingStore from '@/05_stores/system/system-setting-store';
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
import CreateSystemSetting from './_components/create-system-setting';
import DeleteSystemSetting from './_components/delete-system-setting';
import UpdateSystemSetting from './_components/update-system-setting';

const SystemSettingsTab = () => {
  // Store
  const { setSelectedSystemSetting } = useSystemSettingStore();

  // Dialog States
  const [openCreateSystemSettingDialog, setOpenCreateSystemSettingDialog] =
    useState(false);
  const [openUpdateSystemSettingDialog, setOpenUpdateSystemSettingDialog] =
    useState(false);
  const [openDeleteSystemSettingDialog, setOpenDeleteSystemSettingDialog] =
    useState(false);

  // Tanstack query hook for pagination
  const systemSettingsPagination = useTanstackQueryPaginate<SystemSetting>({
    endpoint: '/system/settings',
    defaultSort: 'label',
  });

  // Define table columns
  const columns: DataTableColumn[] = [
    { label: 'Label', column: 'label' },
    { label: 'Value', column: 'value' },
    { label: 'Notes', column: 'notes' },
    { label: 'Created At', column: 'created_at', className: 'w-[200px]' },
    { label: 'Actions', className: 'w-[100px]' },
  ];

  // Actions buttons
  const actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateSystemSettingDialog(true);
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
            pagination={systemSettingsPagination}
            columns={columns}
            actions={actions}
          >
            {/* Render rows only if data is present */}
            {systemSettingsPagination.data?.records
              ? systemSettingsPagination.data.records.map(systemSetting => (
                  <TableRow key={systemSetting.id}>
                    <TableCell>{systemSetting.label}</TableCell>
                    <TableCell>{systemSetting.value}</TableCell>
                    <TableCell>{systemSetting.notes}</TableCell>
                    <TableCell>
                      {getDateTimezone(systemSetting.created_at, 'date_time')}
                    </TableCell>
                    <TableCell>
                      <InputGroup size="sm">
                        {/* Update button */}
                        <Tooltip content="Update">
                          <Button
                            variant="info"
                            size="icon-xs"
                            onClick={() => {
                              setSelectedSystemSetting(systemSetting);
                              setOpenUpdateSystemSettingDialog(true);
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
                              setSelectedSystemSetting(systemSetting);
                              setOpenDeleteSystemSettingDialog(true);
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
      <CreateSystemSetting
        open={openCreateSystemSettingDialog}
        setOpen={setOpenCreateSystemSettingDialog}
        refetch={systemSettingsPagination.refetch}
      />
      <UpdateSystemSetting
        open={openUpdateSystemSettingDialog}
        setOpen={setOpenUpdateSystemSettingDialog}
        refetch={systemSettingsPagination.refetch}
      />
      <DeleteSystemSetting
        open={openDeleteSystemSettingDialog}
        setOpen={setOpenDeleteSystemSettingDialog}
        refetch={systemSettingsPagination.refetch}
      />
    </>
  );
};

export default SystemSettingsTab;
