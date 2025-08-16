import { create } from 'zustand';
import type { Notification } from '@/04_types/user/notification';

type NotificationStoreProps = {
  notifications: Notification[];
  page: number;
  hasNextPage: boolean;
  setNotifications: (notifications: Notification[]) => void;
  appendNotifications: (notifications: Notification[]) => void;
  setPage: (page: number) => void;
  setHasNextPage: (hasNextPage: boolean) => void;
};

const useNotificationStore = create<NotificationStoreProps>(set => ({
  notifications: [],
  page: 1,
  hasNextPage: true,

  setNotifications: notifications =>
    set({
      notifications: dedupeNotifications(notifications),
    }),

  appendNotifications: notifications =>
    set(state => ({
      notifications: dedupeNotifications([
        ...state.notifications,
        ...notifications,
      ]),
    })),

  setPage: page => set({ page }),
  setHasNextPage: hasNextPage => set({ hasNextPage }),
}));

// Helper to remove duplicates by `id`
const dedupeNotifications = (notifications: Notification[]) => {
  const seen = new Set<number>();
  return notifications.filter(notification => {
    if (seen.has(notification.id!)) return false;
    seen.add(notification.id!);
    return true;
  });
};

export default useNotificationStore;
