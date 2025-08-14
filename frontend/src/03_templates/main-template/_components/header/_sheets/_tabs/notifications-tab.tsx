import { useEffect, useRef } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { FaRegBell } from 'react-icons/fa6';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { PaginatedRecord } from '@/04_types/_common/paginated-record';
import type { Notification } from '@/04_types/user/notification';
import useNotificationStore from '@/05_stores/user/notification-store';
import NotificationsSkeleton from '@/components/skeleton/notifications-skeleton';
import { Button } from '@/components/ui/button';
import useTanstackQuery from '@/hooks/tanstack/use-tanstack-query';

type NotificationsTabProps = {
  open: boolean;
};

const NotificationsTab = ({ open }: NotificationsTabProps) => {
  const {
    notifications,
    page,
    hasNextPage,
    setNotifications,
    appendNotifications,
    setPage,
    setHasNextPage,
  } = useNotificationStore();

  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching } = useTanstackQuery<
    PaginatedRecord<Notification>
  >(
    {
      endpoint: '/notifications',
      extendedParams: `page=${page}&type=notification`,
    },
    {
      enabled: open && notifications.length === 0,
    },
  );

  useEffect(() => {
    if (data) {
      appendNotifications(data.records);

      setHasNextPage(page < data.meta.total_pages);
    }
  }, [data]);

  const fetchNextPage = () => {
    if (isFetching) return;

    setPage(page + 1);
  };

  const handlePullToRefresh = () => {
    setNotifications([]);
    setPage(1);
  };

  return (
    <div
      id="notifications-scrollable"
      ref={containerRef}
      className="h-full overflow-y-auto"
    >
      <div className="bg-card sticky top-0 z-10 flex items-center justify-between border-t border-b p-2">
        <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
          <FaRegBell />
          Notifications {hasNextPage ? 't' : 'f'}
        </h4>
        <Button variant="ghost" size="icon-xs">
          <FaEllipsisV />
        </Button>
      </div>

      {isLoading && <NotificationsSkeleton count={10} />}

      <InfiniteScroll
        className="select-none"
        dataLength={notifications.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<NotificationsSkeleton count={3} />}
        scrollableTarget="notifications-scrollable"
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
      >
        {notifications &&
          notifications.map(notif => (
            <div
              className="hover:bg-muted flex items-center gap-2 p-2"
              key={notif.id}
            >
              <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                <FaRegBell />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{notif.title}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
      </InfiniteScroll>
    </div>
  );
};

export default NotificationsTab;
