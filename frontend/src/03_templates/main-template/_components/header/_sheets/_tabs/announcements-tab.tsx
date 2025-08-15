import { useEffect, useRef } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { FaBullhorn } from 'react-icons/fa6';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { Notification } from '@/04_types/user/notification';
import useAnnouncementStore from '@/05_stores/user/announcement-store';
import NotificationsSkeleton from '@/components/skeleton/notifications-skeleton';
import { Button } from '@/components/ui/button';
import useTanstackInfiniteQuery from '@/hooks/tanstack/use-tanstack-infinite-query';
import { cn } from '@/lib/utils';

const AnnouncementsTab = () => {
  const { announcements, setAnnouncements } = useAnnouncementStore();

  const containerRef = useRef<HTMLDivElement>(null);

  const type = 'announcement';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    handlePullToRefresh,
  } = useTanstackInfiniteQuery<Notification>(
    {
      endpoint: 'announcements',
      params: `type=${type}`,
    },
    {
      enabled: announcements.length === 0,
    },
  );

  useEffect(() => {
    setAnnouncements(data?.pages.flatMap(page => page.records) ?? []);
  }, [data, setAnnouncements]);

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
  }, [announcements, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div
      id="announcements-scrollable"
      ref={containerRef}
      className="h-full overflow-y-auto"
    >
      <div className="bg-card sticky top-0 z-10 flex items-center justify-between border-t border-b p-2">
        <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
          <FaBullhorn />
          Announcements
        </h4>
        <Button variant="ghost" size="icon-xs">
          <FaEllipsisV />
        </Button>
      </div>

      {isLoading && <NotificationsSkeleton count={10} />}

      <InfiniteScroll
        className="select-none"
        dataLength={announcements.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<NotificationsSkeleton count={3} />}
        scrollableTarget="announcements-scrollable"
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
              (isLoading || announcements.length === 0) && 'hidden',
            )}
          >
            No more announcements
          </p>
        }
      >
        {announcements.map(notif => (
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
      </InfiniteScroll>
    </div>
  );
};

export default AnnouncementsTab;
