import { FaGear, FaRightFromBracket } from 'react-icons/fa6';
import useAuthUserStore from '@/05_stores/common/auth-user-store';
import ReactImage from '@/components/image/react-image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatName } from '@/lib/user/format-name';

const AppHeaderDropdown = () => {
  const { user, clearAuthUser } = useAuthUserStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="shrink-0">
          <ReactImage
            className="ring-primary flex size-7 items-center justify-center overflow-hidden rounded-full ring-2 ring-offset-2"
            src="asd"
            fallback="/images/default-avatar.jpg"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="font-medium">{formatName(user)}</span>
            <span className="text-muted-foreground text-xs">{user?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <FaGear />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={clearAuthUser}>
          <FaRightFromBracket />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppHeaderDropdown;
