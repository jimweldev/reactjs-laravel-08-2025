import { useEffect, useRef } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { FaBullhorn, FaRegBellSlash, FaTicket } from 'react-icons/fa6';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { Notification } from '@/04_types/user/notification';
import useTicketStore from '@/05_stores/user/ticket-store';
import NotificationsSkeleton from '@/components/skeleton/notifications-skeleton';
import { Button } from '@/components/ui/button';
import useTanstackInfiniteQuery from '@/hooks/tanstack/use-tanstack-infinite-query';
import { cn } from '@/lib/utils';

const TicketsTab = () => {
  const { tickets, setTickets } = useTicketStore();

  const containerRef = useRef<HTMLDivElement>(null);

  const type = 'ticket';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    handlePullToRefresh,
  } = useTanstackInfiniteQuery<Notification>(
    {
      endpoint: 'notifications',
      params: `type=${type}`,
    },
    {
      enabled: tickets.length === 0,
    },
  );

  useEffect(() => {
    setTickets(data?.pages.flatMap(page => page.records) ?? []);
  }, [data, setTickets]);

  // Auto-load if container has no scrollbar
  useEffect(() => {
    if (
      containerRef.current &&
      hasNextPage &&
      !isFetchingNextPage &&
      containerRef.current.scrollHeight <= containerRef.current.clientHeight
    ) {
      fetchNextPage();
    }
  }, [tickets, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div
      id="tickets-scrollable"
      ref={containerRef}
      className="h-full overflow-y-auto"
    >
      <div className="bg-card sticky top-0 z-10 flex items-center justify-between border-t border-b p-2">
        <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
          <FaTicket />
          Tickets
        </h4>
        <Button variant="ghost" size="icon-xs">
          <FaEllipsisV />
        </Button>
      </div>

      <InfiniteScroll
        className="select-none"
        dataLength={tickets.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<NotificationsSkeleton count={3} />}
        scrollableTarget="tickets-scrollable"
        pullDownToRefresh
        pullDownToRefreshThreshold={80}
        refreshFunction={handlePullToRefresh}
        pullDownToRefreshContent={
          <h4 className="text-muted-foreground p-2 text-center text-sm">
            ↓ Pull down to refresh
          </h4>
        }
        releaseToRefreshContent={
          <h4 className="text-success p-2 text-center text-sm">
            ↑ Release to refresh
          </h4>
        }
        endMessage={
          <p
            className={cn(
              'text-muted-foreground p-2 text-center text-sm',
              (isLoading || tickets.length === 0) && 'hidden',
            )}
          >
            No more tickets
          </p>
        }
      >
        {tickets.map(notif => (
          <div
            className="hover:bg-muted flex items-center gap-2 p-2"
            key={notif.id}
          >
            <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
              <FaBullhorn />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{notif.title}</p>
              <p className="text-muted-foreground truncate text-xs">
                {notif.message}
              </p>
            </div>
          </div>
        ))}

        {isLoading && <NotificationsSkeleton count={10} />}

        {!isLoading && tickets.length === 0 && (
          <div className="text-muted-foreground p-layout flex flex-col items-center justify-center">
            <div className="p-layout">
              <FaRegBellSlash className="size-12" />
            </div>
            <p className="text-center text-sm">No tickets found</p>
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default TicketsTab;
