import { useNavigate, useParams } from 'react-router';
import PageHeader from '@/components/typography/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalDropdownsTab from './_tabs/global-dropdowns/global-dropdowns-tab';
import SystemSettingsTab from './_tabs/system-settings/system-settings-tab';

// Main systems page component with tabbed interface
const SystemsPage = () => {
  // Get current tab from URL params
  const { systemTab } = useParams();
  const navigate = useNavigate();
  // Default to system-settings tab if no tab specified
  const currentTab = systemTab || 'system-settings';

  // Handle tab change navigation
  const handleTabChange = (value: string) =>
    navigate(`/admin/systems/${value}`);

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className="mb-3 flex items-center justify-between">
        <PageHeader>Systems</PageHeader>

        {/* Tab navigation controls */}
        <TabsList variant="default" size="sm">
          <TabsTrigger value="system-settings">System Settings</TabsTrigger>
          <TabsTrigger value="global-dropdowns">Global Dropdowns</TabsTrigger>
        </TabsList>
      </div>

      {/* Main content area */}
      {/* Active systems tab content */}
      <TabsContent value="system-settings">
        <SystemSettingsTab />
      </TabsContent>

      {/* Archived systems tab content */}
      <TabsContent value="global-dropdowns">
        <GlobalDropdownsTab />
      </TabsContent>
    </Tabs>
  );
};

export default SystemsPage;
