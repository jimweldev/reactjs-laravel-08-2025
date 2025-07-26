import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HomePage = () => {
  return (
    <Tabs defaultValue="account">
      <div className="gap-layout mb-layout flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Home</h1>

        <TabsList size="sm">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default HomePage;
