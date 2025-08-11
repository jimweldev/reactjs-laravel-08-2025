import { ChevronsUpDown } from 'lucide-react';
import { FaCode, FaHouse, FaUserGear } from 'react-icons/fa6';
import { Link, NavLink, useLocation } from 'react-router';
import ReactImage from '@/components/image/react-image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';

export type SidebarGroup = {
  sidebarLabel?: string;
  sidebarItems: SidebarItem[];
};

type SidebarItem = {
  title: string;
  url: string;
  icon: React.ComponentType;
  end?: boolean;
  subSidebarItems?: SidebarSubItem[];
};

type SidebarSubItem = {
  title: string;
  url: string;
};

type AppSidebarProps = {
  sidebarGroups: SidebarGroup[];
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
};

const AppSidebar = ({ sidebarGroups = [], ...props }: AppSidebarProps) => {
  const location = useLocation();

  const excludedMainMenuPaths = ['/admin', '/examples', '/settings'];
  const isExcluded = excludedMainMenuPaths.some(path =>
    location.pathname.startsWith(path),
  );

  const mainMenuPaths = [
    {
      path: '/admin',
      icon: <FaUserGear className="text-inherit" />,
      label: 'Admin',
    },
    {
      path: '/',
      icon: <FaHouse className="text-inherit" />,
      label: 'Home',
    },
    {
      path: '/examples',
      icon: <FaCode className="text-inherit" />,
      label: 'Examples',
    },
  ];

  // Find the active menu item (fallback to Home if no match)
  const activeMenu =
    mainMenuPaths.find(menu =>
      menu.path === '/'
        ? location.pathname === '/' || !isExcluded
        : location.pathname.startsWith(menu.path),
    ) || mainMenuPaths[1]; // default to Home

  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-col items-center justify-between">
        <Link className="max-w-[80px] overflow-hidden rounded-md" to="/">
          <ReactImage src="asd" fallback="/images/default-avatar.jpg" />
        </Link>
        <h1 className="transition-[margin,opacity,hidden] group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0">
          {import.meta.env.VITE_APP_NAME}
        </h1>
      </SidebarHeader>
      <SidebarContent>
        {/* Desktop Sidebar */}
        {sidebarGroups.map(group => (
          <SidebarGroup key={group.sidebarLabel}>
            <SidebarGroupLabel>{group.sidebarLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.sidebarItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url} end={item.end} tabIndex={-1}>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <item.icon />
                          {item.title}
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                    {item.subSidebarItems && (
                      <SidebarMenuSub>
                        {item.subSidebarItems.map(subItem => (
                          <SidebarMenuItem key={subItem.title}>
                            <NavLink to={subItem.url} end>
                              {({ isActive }) => (
                                <SidebarMenuButton isActive={isActive}>
                                  {subItem.title}
                                </SidebarMenuButton>
                              )}
                            </NavLink>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
