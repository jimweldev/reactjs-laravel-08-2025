import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import DashboardPage from './01_pages/private/admin/dashboard/dashboard-page';
import MailsPage from './01_pages/private/admin/mails/mails-page';
import SystemsPage from './01_pages/private/admin/systems/systems-page';
import UsersPage from './01_pages/private/admin/users/users-page';
import DataTableGridPage from './01_pages/private/examples/data-table/data-table-grid-page';
import DataTableListGridPage from './01_pages/private/examples/data-table/data-table-list-grid-page';
import DataTableListPage from './01_pages/private/examples/data-table/data-table-list-page';
import CheckboxPage from './01_pages/private/examples/forms/checkbox-page';
import GlobalDropdownPage from './01_pages/private/examples/forms/global-dropdown-page';
import InputPage from './01_pages/private/examples/forms/input-page';
import RadioGroupPage from './01_pages/private/examples/forms/radio-group-page';
import ReactDropzonePage from './01_pages/private/examples/forms/react-dropzone-page';
import ReactQuillPage from './01_pages/private/examples/forms/react-quill-page';
import TextareaPage from './01_pages/private/examples/forms/textarea-page';
import HomePage from './01_pages/private/home/home-page';
import GeneralPage from './01_pages/private/settings/general-page';
import PasswordPage from './01_pages/private/settings/password-page';
import ProfilePage from './01_pages/private/settings/profile/profile-page';
import LoginPage from './01_pages/public/login-page';
import AdminLayout from './02_layouts/private/admin-layout';
import ExamplesLayout from './02_layouts/private/examples-layout';
import HomeLayout from './02_layouts/private/home-layout';
import PrivateLayout from './02_layouts/private/private-layout';
import SettingsLayout from './02_layouts/private/settings-layout';
import PublicLayout from './02_layouts/public/public-layout';
import useAuthUserStore from './05_stores/_common/auth-user-store';

const App = () => {
  const { token, user } = useAuthUserStore();

  const privateRoutes = [
    {
      element: <PrivateLayout />,
      children: [
        // ACCOUNT TYPE | MAIN
        ...(user?.account_type === 'Main'
          ? [
              // ADMIN LAYOUT
              {
                path: 'admin',
                element: <AdminLayout />,
                children: [
                  {
                    index: true,
                    element: <DashboardPage />,
                  },
                  {
                    path: 'users',
                    children: [
                      {
                        index: true,
                        element: <UsersPage />,
                      },
                      {
                        path: ':userTab',
                        element: <UsersPage />,
                        children: [
                          {
                            path: ':rbacTab',
                            element: <UsersPage />,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: 'systems',
                    element: <SystemsPage />,
                    children: [
                      {
                        path: ':systemTab',
                        element: <SystemsPage />,
                      },
                    ],
                  },
                  {
                    path: 'mails',
                    element: <MailsPage />,
                    children: [
                      {
                        path: ':mailTab',
                        element: <MailsPage />,
                      },
                    ],
                  },
                ],
              },
              // HOME LAYOUT
              {
                element: <HomeLayout />,
                children: [
                  {
                    path: '',
                    element: <HomePage />,
                  },
                ],
              },
              // SETTINGS LAYOUT
              {
                path: 'settings',
                element: <SettingsLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="profile" replace />,
                  },
                  {
                    path: 'profile',
                    element: <ProfilePage />,
                  },
                  {
                    path: 'password',
                    element: <PasswordPage />,
                  },
                  {
                    path: 'general',
                    element: <GeneralPage />,
                  },
                ],
              },
              // EXAMPLES LAYOUT
              {
                path: 'examples',
                element: <ExamplesLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="forms" replace />,
                  },
                  {
                    path: 'forms',
                    children: [
                      {
                        index: true,
                        element: <InputPage />,
                      },
                      {
                        path: 'textarea',
                        element: <TextareaPage />,
                      },
                      {
                        path: 'checkbox',
                        element: <CheckboxPage />,
                      },
                      {
                        path: 'radio-group',
                        element: <RadioGroupPage />,
                      },
                      {
                        path: 'react-dropzone',
                        element: <ReactDropzonePage />,
                      },
                      {
                        path: 'react-quill',
                        element: <ReactQuillPage />,
                      },
                      {
                        path: 'global-dropdown',
                        element: <GlobalDropdownPage />,
                      },
                    ],
                  },
                  {
                    path: 'data-table',
                    children: [
                      {
                        index: true,
                        element: <DataTableListPage />,
                      },
                      {
                        path: 'grid',
                        element: <DataTableGridPage />,
                      },
                      {
                        path: 'list-grid',
                        element: <DataTableListGridPage />,
                      },
                    ],
                  },
                ],
              },
            ]
          : []),
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];

  const publicRoutes = [
    {
      element: <PublicLayout />,
      children: [
        {
          path: '/login',
          element: <LoginPage />,
        },
        {
          path: '/register',
          element: <div>Register</div>,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    },
  ];

  const router = createBrowserRouter(!token ? publicRoutes : privateRoutes);

  return <RouterProvider router={router} />;
};

export default App;
