import { useEffect, useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { FaEllipsisV } from 'react-icons/fa';
import { FaRegBell } from 'react-icons/fa6';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { PaginatedRecord } from '@/04_types/_common/paginated-record';
import type { Notification } from '@/04_types/user/notification';
import useNotificationStore from '@/05_stores/user/notification-store';
import { mainInstance } from '@/07_instances/main-instance';
import NotificationsSkeleton from '@/components/skeleton/notifications-skeleton';
import { Button } from '@/components/ui/button';

type NotificationsTabProps = {
  open: boolean;
};

const NotificationsTab = ({ open }: NotificationsTabProps) => {
  const { notifications, setNotifications } = useNotificationStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await mainInstance.get<PaginatedRecord<Notification>>(
        `notifications?page=${pageParam}&type=notification`,
      );
      return {
        records: res.data.records,
        nextPage: pageParam + 1,
        hasMore: pageParam < res.data.meta.total_pages,
      };
    },
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    enabled: open && notifications.length === 0,
  });

  useEffect(() => {
    setNotifications(data?.pages.flatMap(page => page.records) ?? []);
  }, [data, setNotifications]);

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
  }, [notifications, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handlePullToRefresh = async () => {
    queryClient.setQueryData(['notifications'], {
      pageParams: [1],
      pages: [],
    });

    await refetch();
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
          Notifications {notifications.length}
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
        hasMore={!!hasNextPage}
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
        {notifications.map(notif => (
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
