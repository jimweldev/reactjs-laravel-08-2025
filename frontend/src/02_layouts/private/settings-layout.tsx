import { FaHouse } from 'react-icons/fa6';
import { Outlet } from 'react-router';
import { type SidebarGroup } from '@/03_templates/main-template/_components/sidebar/app-sidebar';
import MainTemplate from '@/03_templates/main-template/main-template';

const SettingsLayout = () => {
  const sidebarGroups: SidebarGroup[] = [
    {
      sidebarLabel: 'Settings',
      sidebarItems: [
        {
          title: 'Profile',
          url: '/settings/profile',
          icon: FaHouse,
        },
        {
          title: 'Password',
          url: '/settings/password',
          icon: FaHouse,
        },
        {
          title: 'General',
          url: '/settings/general',
          icon: FaHouse,
        },
      ],
    },
  ];

  return (
    <MainTemplate sidebarGroups={sidebarGroups}>
      <Outlet />
    </MainTemplate>
  );
};

export default SettingsLayout;
