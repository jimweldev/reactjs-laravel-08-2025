import { useNavigate, useParams } from 'react-router';
import PageHeader from '@/components/typography/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActiveUsersTab from './_tabs/active-users/active-users-tab';
import ArchivedUsersTab from './_tabs/archived-users/archived-users-tab';
import RbacTab from './_tabs/rbac/rbac-tab';

// Main users page component with tabbed interface
const UsersPage = () => {
  // Get current tab from URL params
  const { userTab } = useParams();
  const navigate = useNavigate();
  // Default to active-users tab if no tab specified
  const currentTab = userTab || 'active-users';

  // Handle tab change navigation
  const handleTabChange = (value: string) => navigate(`/admin/users/${value}`);

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className="mb-3 flex items-center justify-between">
        <PageHeader>Users</PageHeader>

        {/* Tab navigation controls */}
        <TabsList variant="default" size="sm">
          <TabsTrigger value="active-users">Active Users</TabsTrigger>
          <TabsTrigger value="archived-users">Archived Users</TabsTrigger>
          <TabsTrigger value="rbac">RBAC</TabsTrigger>
        </TabsList>
      </div>

      {/* Main content area */}
      {/* Active users tab content */}
      <TabsContent value="active-users">
        <ActiveUsersTab />
      </TabsContent>

      {/* Archived users tab content */}
      <TabsContent value="archived-users">
        <ArchivedUsersTab />
      </TabsContent>

      {/* RBAC management tab content */}
      <TabsContent value="rbac">
        <RbacTab />
      </TabsContent>
    </Tabs>
  );
};

export default UsersPage;
