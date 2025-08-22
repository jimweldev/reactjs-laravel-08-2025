import { FaBullhorn, FaRegBell, FaTicket } from 'react-icons/fa6';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnnouncementsTab from './_tabs/announcements-tab';
import NotificationsTab from './_tabs/notifications/notifications-tab';
import TicketsTab from './_tabs/tickets-tab';

type NotificationsSheetProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const NotificationsSheet = ({ open, setOpen }: NotificationsSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Tabs defaultValue="notifications">
        <SheetContent className="flex h-screen">
          <SheetHeader>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger className="relative" value="notifications">
                <FaRegBell />{' '}
                <Badge
                  className="absolute top-1/2 left-1/2 size-4 translate-x-2/3 -translate-y-1/2 rounded-full p-0 text-[0.6rem]"
                  variant="destructive"
                >
                  2
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="announcements">
                <FaBullhorn />
              </TabsTrigger>
              <TabsTrigger value="tickets">
                <FaTicket />
              </TabsTrigger>
            </TabsList>
          </SheetHeader>
          <TabsContent className="overflow-y-hidden" value="notifications">
            <NotificationsTab />
          </TabsContent>
          <TabsContent className="overflow-y-hidden" value="announcements">
            <AnnouncementsTab />
          </TabsContent>
          <TabsContent className="overflow-y-hidden" value="tickets">
            <TicketsTab />
          </TabsContent>
        </SheetContent>
      </Tabs>
    </Sheet>
  );
};

export default NotificationsSheet;
