import { FaBullhorn } from 'react-icons/fa6';

const AnnouncementsTab = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-card sticky top-0 border-t border-b p-2">
        <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
          <FaBullhorn />
          Announcements
        </h4>
      </div>

      {[...Array(10)].map((_, index) => (
        <div className="hover:bg-muted flex items-center gap-2 p-2" key={index}>
          <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
            <FaBullhorn />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">System Update</p>
            <p className="text-muted-foreground truncate text-xs">
              New features and improvements have been added to enhance your
              experience
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementsTab;
