import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import DataTablePage from './01_pages/private/examples/data-table/data-table-page';
import CheckboxPage from './01_pages/private/examples/forms/checkbox-page';
import GlobalDropdownPage from './01_pages/private/examples/forms/global-dropdown-page';
import InputPage from './01_pages/private/examples/forms/input-page';
import RadioGroupPage from './01_pages/private/examples/forms/radio-group-page';
import ReactDropzonePage from './01_pages/private/examples/forms/react-dropzone-page';
import ReactQuillPage from './01_pages/private/examples/forms/react-quill-page';
import ReactSelectPage from './01_pages/private/examples/forms/react-select-page';
import TextareaPage from './01_pages/private/examples/forms/textarea-page';
import HomePage from './01_pages/private/home/home-page';
import LoginPage from './01_pages/public/login-page';
import AdminLayout from './02_layouts/private/admin-layout';
import ExamplesLayout from './02_layouts/private/examples-layout';
import HomeLayout from './02_layouts/private/home-layout';
import PrivateLayout from './02_layouts/private/private-layout';
import PublicLayout from './02_layouts/public/public-layout';
import useAuthUserStore from './05_stores/common/auth-user-store';

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
                    element: <HomePage />,
                  },
                  {
                    path: 'users',
                    element: <HomePage />,
                  },
                  {
                    path: 'system',
                    element: <HomePage />,
                  },
                  {
                    path: 'mails',
                    element: <HomePage />,
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
                        path: 'react-select',
                        element: <ReactSelectPage />,
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
                        element: <DataTablePage />,
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
