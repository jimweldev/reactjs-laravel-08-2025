import { create } from 'zustand';
import type { Notification } from '@/04_types/user/notification';

type NotificationStoreProps = {
  // VARIABLES
  // notifications
  selectedNotification: Notification | null;
  notifications: Notification[];
  notificationPage: number;
  notificationHasNextPage: boolean;
  notificationsViewed: number[];

  // announcements
  announcements: Notification[];
  announcementPage: number;
  announcementHasNextPage: boolean;
  announcementsViewed: number[];

  // tickets
  tickets: Notification[];
  ticketPage: number;
  ticketHasNextPage: boolean;
  ticketsViewed: number[];

  // FUNCTIONS

  // notifications
  setNotifications: (notifications: Notification[]) => void;
  viewNotification: (notification: Notification) => void;
  notificationSetPage: (page: number) => void;
  notificationSetHasNextPage: (hasNextPage: boolean) => void;

  // announcements
  setAnnouncements: (announcements: Notification[]) => void;
  viewAnnouncement: (announcement: Notification) => void;
  announcementSetPage: (page: number) => void;
  announcementSetHasNextPage: (hasNextPage: boolean) => void;

  // tickets
  setTickets: (tickets: Notification[]) => void;
  viewTicket: (ticket: Notification) => void;
  ticketSetPage: (page: number) => void;
  ticketSetHasNextPage: (hasNextPage: boolean) => void;
};

const useNotificationStore = create<NotificationStoreProps>((set, get) => ({
  // VARIABLES
  selectedNotification: null,

  // notifications
  notifications: [],
  notificationPage: 1,
  notificationHasNextPage: true,
  notificationsViewed: [],

  // announcements
  announcements: [],
  announcementPage: 1,
  announcementHasNextPage: true,
  announcementsViewed: [],

  // tickets
  tickets: [],
  ticketPage: 1,
  ticketHasNextPage: true,
  ticketsViewed: [],

  // FUNCTIONS
  // notifications
  setNotifications: notifications => {
    const { notificationsViewed } = get();

    const updated = dedupeNotifications(notifications).map(n =>
      notificationsViewed.includes(n.id!) ? { ...n, is_read: true } : n,
    );

    set({ notifications: updated });
  },
  viewNotification: notification => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === notification.id ? { ...n, is_read: true } : n,
      ),
      selectedNotification: notification,
      notificationsViewed: state.notificationsViewed.includes(notification.id!)
        ? state.notificationsViewed
        : [...state.notificationsViewed, notification.id!],
    }));
  },
  notificationSetPage: notificationPage => {
    set({ notificationPage });
  },
  notificationSetHasNextPage: notificationHasNextPage => {
    set({ notificationHasNextPage });
  },

  // announcements
  setAnnouncements: announcements => {
    const { announcementsViewed } = get();

    const updated = dedupeNotifications(announcements).map(n =>
      announcementsViewed.includes(n.id!) ? { ...n, is_read: true } : n,
    );

    set({ announcements: updated });
  },
  viewAnnouncement: announcement => {
    set(state => ({
      announcements: state.announcements.map(n =>
        n.id === announcement.id ? { ...n, is_read: true } : n,
      ),
      selectedNotification: announcement,
      announcementsViewed: state.announcementsViewed.includes(announcement.id!)
        ? state.announcementsViewed
        : [...state.announcementsViewed, announcement.id!],
    }));
  },
  announcementSetPage: announcementPage => {
    set({ announcementPage });
  },
  announcementSetHasNextPage: announcementHasNextPage => {
    set({ announcementHasNextPage });
  },

  // tickets
  setTickets: tickets => {
    const { ticketsViewed } = get();

    const updated = dedupeNotifications(tickets).map(n =>
      ticketsViewed.includes(n.id!) ? { ...n, is_read: true } : n,
    );

    set({ tickets: updated });
  },
  viewTicket: ticket => {
    set(state => ({
      tickets: state.tickets.map(n =>
        n.id === ticket.id ? { ...n, is_read: true } : n,
      ),
      selectedNotification: ticket,
      ticketsViewed: state.ticketsViewed.includes(ticket.id!)
        ? state.ticketsViewed
        : [...state.ticketsViewed, ticket.id!],
    }));
  },
  ticketSetPage: ticketPage => {
    set({ ticketPage });
  },
  ticketSetHasNextPage: ticketHasNextPage => {
    set({ ticketHasNextPage });
  },
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
