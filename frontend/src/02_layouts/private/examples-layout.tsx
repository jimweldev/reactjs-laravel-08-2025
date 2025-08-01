import { FaChartArea } from 'react-icons/fa6';
import { Outlet } from 'react-router';
import { type SidebarGroup } from '@/03_templates/main-template/_components/sidebar/app-sidebar';
import MainTemplate from '@/03_templates/main-template/main-template';

const ExamplesLayout = () => {
  const sidebarGroups: SidebarGroup[] = [
    {
      sidebarLabel: 'Forms',
      sidebarItems: [
        {
          title: 'Input',
          url: '/examples/forms',
          icon: FaChartArea,
          end: true,
        },
        {
          title: 'Textarea',
          url: '/examples/forms/textarea',
          icon: FaChartArea,
        },
        {
          title: 'Checkbox',
          url: '/examples/forms/checkbox',
          icon: FaChartArea,
        },
        {
          title: 'Radio Group',
          url: '/examples/forms/radio-group',
          icon: FaChartArea,
        },
        {
          title: 'React Dropzone',
          url: '/examples/forms/react-dropzone',
          icon: FaChartArea,
        },
        {
          title: 'React Quill',
          url: '/examples/forms/react-quill',
          icon: FaChartArea,
        },
        {
          title: 'React Select',
          url: '/examples/forms/react-select',
          icon: FaChartArea,
        },
        {
          title: 'Global Dropdown',
          url: '/examples/forms/global-dropdown',
          icon: FaChartArea,
        },
      ],
    },
    {
      sidebarLabel: 'Data Table',
      sidebarItems: [
        {
          title: 'List',
          url: '/examples/data-table',
          icon: FaChartArea,
          end: true,
        },
        {
          title: 'Grid',
          url: '/examples/data-table/grid',
          icon: FaChartArea,
        },
        {
          title: 'List/Grid',
          url: '/examples/data-table/list-grid',
          icon: FaChartArea,
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

export default ExamplesLayout;
