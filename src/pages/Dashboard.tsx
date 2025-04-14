
import { useQuery } from "@tanstack/react-query";
import { FileText, Users, Clock, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetchDashboardStats, fetchRecentDocuments } from "@/lib/api";
import { Document } from "@/types";

const DashboardCard = ({ title, value, description, icon, color }: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`p-2 rounded-md ${color}`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </Card>
);

const DocumentItem = ({ document }: { document: Document }) => (
  <div className="flex items-center p-3 hover:bg-gray-50 rounded-md">
    <div className="p-2 bg-blue-50 rounded mr-3">
      <FileText className="h-5 w-5 text-primary-blue" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{document.title}</p>
      <p className="text-xs text-gray-500">Updated {new Date(document.lastModified).toLocaleDateString()}</p>
    </div>
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-gray-400" />
      <span className="text-xs text-gray-500">{document.lastModifiedBy}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats
  });

  const { data: recentDocuments, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ["recentDocuments"],
    queryFn: fetchRecentDocuments
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your document management overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {!isLoadingStats && stats && (
          <>
            <DashboardCard
              title="Total Documents"
              value={stats.totalDocuments}
              description="Documents in your workspace"
              icon={<FileText className="h-5 w-5 text-white" />}
              color="bg-primary-blue"
            />
            <DashboardCard
              title="Shared Documents"
              value={stats.sharedDocuments}
              description="Documents shared with team"
              icon={<Users className="h-5 w-5 text-white" />}
              color="bg-primary-teal"
            />
            <DashboardCard
              title="Recent Activity"
              value={stats.recentActivity}
              description="Changes in last 7 days"
              icon={<Clock className="h-5 w-5 text-white" />}
              color="bg-amber-500"
            />
            <DashboardCard
              title="Favorites"
              value={stats.favorites}
              description="Your favorite documents"
              icon={<Star className="h-5 w-5 text-white" />}
              color="bg-purple-500"
            />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
            <CardDescription>Your workspace storage utilization</CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoadingStats && stats && (
              <>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    {stats.storageUsed} of {stats.storageTotal}
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round((stats.storageUsedBytes / stats.storageTotalBytes) * 100)}%
                  </span>
                </div>
                <Progress value={(stats.storageUsedBytes / stats.storageTotalBytes) * 100} className="h-2" />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Recently modified documents</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-0.5">
              {!isLoadingDocuments && recentDocuments && 
                recentDocuments.slice(0, 5).map((doc) => (
                  <DocumentItem key={doc.id} document={doc} />
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
