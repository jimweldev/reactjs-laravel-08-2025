import { FaChartArea, FaEnvelope, FaGears, FaUsers } from 'react-icons/fa6';
import { Outlet } from 'react-router';
import { type SidebarGroup } from '@/03_templates/main-template/_components/sidebar/app-sidebar';
import MainTemplate from '@/03_templates/main-template/main-template';

const AdminLayout = () => {
  const sidebarGroups: SidebarGroup[] = [
    {
      sidebarLabel: 'Admin',
      sidebarItems: [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: FaChartArea,
          end: true,
        },
        {
          title: 'Users',
          url: '/admin/users',
          icon: FaUsers,
        },
        {
          title: 'Systems',
          url: '/admin/systems',
          icon: FaGears,
        },
        {
          title: 'Mails',
          url: '/admin/mails',
          icon: FaEnvelope,
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

export default AdminLayout;
