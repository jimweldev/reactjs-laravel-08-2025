import { useEffect, useRef, useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { FaBullhorn, FaRegBell, FaRegBellSlash } from 'react-icons/fa6';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router';
import type { Notification } from '@/04_types/user/notification';
import useNotificationStore from '@/05_stores/user/notification-store';
import NotificationsSkeleton from '@/components/skeleton/notifications-skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useTanstackInfiniteQuery from '@/hooks/tanstack/use-tanstack-infinite-query';
import { getTimeAgoTimezone } from '@/lib/date/get-time-ago-timezone';
import { getNotificationLink } from '@/lib/react-router/get-notification-link';
import { cn } from '@/lib/utils';
import ViewAnnouncementDialog from './_dialogs.tsx/view-notification-dialog';

const AnnouncementsTab = () => {
  let navigate = useNavigate();

  const { announcements, setAnnouncements, viewAnnouncement } =
    useNotificationStore();

  // Dialog States
  const [openViewAnnouncementDialog, setOpenViewAnnouncementDialog] =
    useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

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
      params: `type=announcement`,
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

  const handleViewAnnouncement = (announcement: Notification) => {
    viewAnnouncement(announcement);

    if (!announcement.link) {
      setOpenViewAnnouncementDialog(true);
    }

    if (announcement.link) {
      navigate(getNotificationLink(announcement.link));
    }
  };

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden">
        <div className="bg-card sticky top-0 z-10 flex items-center justify-between border-t border-b p-2">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
            <FaBullhorn />
            Announcements
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <FaEllipsisV />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Mark all as read</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className="flex-1 overflow-y-auto"
          id="announcements-scrollable"
          ref={containerRef}
        >
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
                  'text-muted-foreground p-2 text-center text-xs',
                  (isLoading || announcements.length === 0) && 'hidden',
                )}
              >
                No more announcements
              </p>
            }
          >
            {announcements.map(notif => (
              <div
                className={cn(
                  'hover:bg-primary/10 flex cursor-pointer items-start gap-2 border-b p-2',
                  !notif.is_read && 'bg-accent',
                )}
                onClick={() => handleViewAnnouncement(notif)}
                key={notif.id}
              >
                <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                  <FaRegBell />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {notif.title}
                  </p>
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {notif.message}
                  </p>
                  <p className="text-muted-foreground truncate text-xs font-light">
                    {getTimeAgoTimezone(notif.created_at, 'Asia/Manila')}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && <NotificationsSkeleton count={10} />}

            {!isLoading && announcements.length === 0 && (
              <div className="text-muted-foreground p-layout flex flex-col items-center justify-center">
                <div className="p-layout">
                  <FaRegBellSlash className="size-12" />
                </div>
                <p className="text-center text-sm">No announcements found</p>
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>

      <ViewAnnouncementDialog
        open={openViewAnnouncementDialog}
        setOpen={setOpenViewAnnouncementDialog}
      />
    </>
  );
};

export default AnnouncementsTab;
