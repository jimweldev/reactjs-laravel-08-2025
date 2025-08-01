import { useState } from 'react';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { type MailTemplate } from '@/04_types/mail-template';
import useMailTemplateStore from '@/05_stores/mail-template-store';
import DataTable, {
  type DataTableColumn,
} from '@/components/data-table/data-table';
import InputGroup from '@/components/input-group/input-group';
import Tooltip from '@/components/tooltip/tooltip';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import useTanstackQueryPaginate from '@/hooks/tanstack/use-tanstack-query-paginate';
import { getDateTimezone } from '@/lib/date/get-date-timezone';
import CreateMailTemplate from './_components/create-mail-template';
import DeleteMailTemplate from './_components/delete-mail-template';
import UpdateMailTemplate from './_components/update-mail-template';

const MailTemplatesTab = () => {
  // Store
  const { setSelectedMailTemplate } = useMailTemplateStore();

  // Dialog States
  const [openCreateMailTemplateDialog, setOpenCreateMailTemplateDialog] =
    useState(false);
  const [openUpdateMailTemplateDialog, setOpenUpdateMailTemplateDialog] =
    useState(false);
  const [openDeleteMailTemplateDialog, setOpenDeleteMailTemplateDialog] =
    useState(false);

  // Tanstack query hook for pagination
  const mailTemplatesPagination = useTanstackQueryPaginate<MailTemplate>({
    endpoint: '/mails/templates',
    defaultSort: '-id',
  });

  // Define table columns
  const columns: DataTableColumn[] = [
    { label: 'Label', column: 'label' },
    { label: 'Created At', column: 'created_at', className: 'w-[200px]' },
    { label: 'Actions', className: 'w-[100px]' },
  ];

  // Actions buttons
  const actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateMailTemplateDialog(true);
      }}
    >
      Create
    </Button>
  );

  return (
    <>
      {/* Data Table */}
      <DataTable
        pagination={mailTemplatesPagination}
        columns={columns}
        actions={actions}
      >
        {/* Render rows only if data is present */}
        {mailTemplatesPagination.data?.records
          ? mailTemplatesPagination.data.records.map(mailTemplate => (
              <TableRow key={mailTemplate.id}>
                <TableCell>{mailTemplate.label}</TableCell>
                <TableCell>
                  {getDateTimezone(mailTemplate.created_at, 'date_time')}
                </TableCell>
                <TableCell>
                  <InputGroup size="sm">
                    {/* Update button */}
                    <Tooltip content="Update">
                      <Button
                        variant="info"
                        size="icon-xs"
                        onClick={() => {
                          setSelectedMailTemplate(mailTemplate);
                          setOpenUpdateMailTemplateDialog(true);
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
                          setSelectedMailTemplate(mailTemplate);
                          setOpenDeleteMailTemplateDialog(true);
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
      <CreateMailTemplate
        open={openCreateMailTemplateDialog}
        setOpen={setOpenCreateMailTemplateDialog}
        refetch={mailTemplatesPagination.refetch}
      />
      <UpdateMailTemplate
        open={openUpdateMailTemplateDialog}
        setOpen={setOpenUpdateMailTemplateDialog}
        refetch={mailTemplatesPagination.refetch}
      />
      <DeleteMailTemplate
        open={openDeleteMailTemplateDialog}
        setOpen={setOpenDeleteMailTemplateDialog}
        refetch={mailTemplatesPagination.refetch}
      />
    </>
  );
};

export default MailTemplatesTab;
