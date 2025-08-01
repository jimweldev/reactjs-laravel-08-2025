import { useEffect, useState, type ReactNode } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { isAxiosError } from 'axios';
import {
  FaArrowsRotate,
  FaFaceGrinBeamSweat,
  FaListUl,
  FaTableCellsLarge,
} from 'react-icons/fa6';
import ReactPaginate from 'react-paginate';
import { type UseTanstackQueryPaginateReturn } from '@/hooks/tanstack/use-tanstack-query-paginate';
import { cn } from '@/lib/utils';
import InputGroup from '../input-group/input-group';
import SearchInput from '../input/search-input';
import Tooltip from '../tooltip/tooltip';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import DataTableHead from './data-table-head';

export type DataTableColumn = {
  label: string | ReactNode;
  column?: string;
  className?: string;
};

type DataTableProps<T> = {
  pagination: UseTanstackQueryPaginateReturn<T>;
  columns?: DataTableColumn[];
  actions?: ReactNode;
  showViewToggle?: boolean;
  showHeader?: boolean;
  defaultView?: 'list' | 'grid';
  list?: ReactNode;
  grid?: ReactNode;
  skeleton?: ReactNode;
  children?: ReactNode;
};

const DataTable = <T,>({
  pagination,
  columns,
  actions,
  showViewToggle,
  showHeader = true,
  defaultView = 'list',
  list,
  grid,
  skeleton,
  children,
}: DataTableProps<T>) => {
  const [view, setView] = useState<'list' | 'grid'>(defaultView);

  const [search, setSearch] = useDebouncedState('', 300);

  useEffect(() => {
    pagination.setSearchTerm(search);
    pagination.setPage(1);
  }, [search]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    pagination.setPage(selected + 1);
  };

  return (
    <div>
      <div className="mb-layout flex flex-col justify-between gap-2 @sm/main:flex-row">
        <div className="flex flex-wrap gap-2">{actions}</div>

        <div className="flex flex-wrap justify-center gap-2">
          <div className="flex min-w-full flex-1 gap-2 @sm/main:min-w-auto">
            <SearchInput
              inputSize="sm"
              placeholder="Search..."
              defaultValue={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
            />
            <Tooltip content="Refresh">
              <Button
                size="icon-sm"
                onClick={() => pagination.refetch()}
                disabled={pagination.isFetching}
              >
                <FaArrowsRotate
                  className={pagination.isFetching ? 'animate-spin' : ''}
                />
              </Button>
            </Tooltip>
          </div>

          {showViewToggle ? (
            <InputGroup>
              <Tooltip content="List">
                <Button
                  size="icon-sm"
                  variant={view === 'list' ? 'default' : 'outline'}
                  onClick={() => setView('list')}
                >
                  <FaListUl />
                </Button>
              </Tooltip>
              <Tooltip content="Grid">
                <Button
                  size="icon-sm"
                  variant={view === 'grid' ? 'default' : 'outline'}
                  onClick={() => setView('grid')}
                >
                  <FaTableCellsLarge />
                </Button>
              </Tooltip>
            </InputGroup>
          ) : null}
        </div>
      </div>

      {/* List */}
      {view === 'list' ? (
        <Table
          className={cn(
            'border-t',
            pagination.isFetching ? 'border-primary' : '',
          )}
        >
          {showHeader && columns ? (
            <TableHeader>
              <TableRow>
                {columns?.map((column, index) =>
                  column.column ? (
                    <DataTableHead
                      key={index}
                      sort={pagination.sort}
                      setSort={pagination.setSort}
                      setCurrentPage={pagination.setPage}
                      label={column.label}
                      column={column.column}
                      className={column.className}
                    />
                  ) : (
                    <TableHead key={index} className={column.className}>
                      {column.label}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
          ) : null}
          <TableBody className="border-b">
            {/* List or Children */}
            {list || children}

            {/* Loading */}
            {pagination.isLoading ? (
              <TableRow>
                <TableCell className="text-center" colSpan={columns?.length}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : null}

            {/* Loading */}
            {pagination.isFetching && pagination.data?.records?.length === 0 ? (
              <TableRow>
                <TableCell className="text-center" colSpan={columns?.length}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : null}

            {/* No data found */}
            {!pagination.isFetching &&
            !!!pagination.error &&
            pagination.data?.records?.length === 0 ? (
              <TableRow>
                <TableCell className="text-center" colSpan={columns?.length}>
                  No records found
                </TableCell>
              </TableRow>
            ) : null}

            {/* Error */}
            {pagination.error ? (
              <TableRow className="">
                <TableCell
                  className="text-center whitespace-pre-wrap"
                  colSpan={columns?.length}
                >
                  <div className="flex flex-col">
                    <p className="font-semibold">
                      {isAxiosError(pagination.error) &&
                      pagination.error.response?.data?.message
                        ? pagination.error.response.data.message
                        : 'An error occurred'}
                    </p>
                    <p>
                      {isAxiosError(pagination.error) &&
                      pagination.error.response?.data?.error
                        ? pagination.error.response.data.error
                        : 'Unknown error occurred'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      ) : null}

      {/* Grid */}
      {view === 'grid' ? (
        <div
          className={`pt-layout border-t ${pagination.isFetching ? 'border-primary' : ''} `}
        >
          {grid || children}
          {/* Loading */}
          {pagination.isLoading ? skeleton : null}

          {/* Loading */}
          {pagination.isFetching && pagination.data?.records?.length === 0
            ? skeleton
            : null}

          {/* No data found */}
          {!pagination.isFetching &&
          !!!pagination.error &&
          pagination.data?.records?.length === 0 ? (
            <div className="p-layout flex flex-col items-center gap-3">
              <FaFaceGrinBeamSweat className="text-muted-foreground text-5xl" />
              <h4 className="text-muted-foreground text-center text-lg">
                No records found
              </h4>
            </div>
          ) : null}

          {/* Error */}
          {pagination.error ? (
            <div className="p-layout flex flex-col items-center gap-3">
              <p className="font-semibold">
                {isAxiosError(pagination.error) &&
                pagination.error.response?.data?.message
                  ? pagination.error.response.data.message
                  : 'An error occurred'}
              </p>
              <p>
                {isAxiosError(pagination.error) &&
                pagination.error.response?.data?.error
                  ? pagination.error.response.data.error
                  : 'Unknown error occurred'}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-layout flew-wrap flex items-center justify-between gap-4">
        <span className="text-muted-foreground text-xs">
          {`Showing ${
            (pagination.data?.records?.length || 0) > 0
              ? (pagination.page - 1) * Number(pagination.limit) + 1
              : 0
          } to ${
            (pagination.page - 1) * Number(pagination.limit) +
            (pagination.data?.records?.length || 0)
          } of ${pagination.data?.meta?.total_records || 0} entries`}
        </span>

        <ReactPaginate
          containerClassName="pagination pagination-sm"
          pageCount={pagination.data?.meta?.total_pages || 1}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          forcePage={pagination.page - 1}
          previousLabel={<>&laquo;</>}
          nextLabel={<>&raquo;</>}
          breakLabel="..."
          activeClassName="active"
        />
      </div>
    </div>
  );
};

export default DataTable;
