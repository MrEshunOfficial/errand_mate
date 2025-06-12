// src/components/ui/dashboard/ClientDashboardContent.tsx
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  Phone,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  Award,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { ClientServiceRequest } from "@/store/type/client_provider_Data";

interface ClientDashboardContentProps {
  serviceRequests: ClientServiceRequest[];
  completedServiceRequests: ClientServiceRequest[];
  pendingServiceRequests: ClientServiceRequest[];
  stats?: {
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    cancelledRequests: number;
    averageRating: number;
    totalRatingsGiven: number;
  } | null;
}

export function ClientDashboardContent({
  serviceRequests,
  completedServiceRequests,
  pendingServiceRequests,
  stats,
}: ClientDashboardContentProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400";
    }
  };

  // Calculate completion rate from stats
  // const getCompletionRate = () => {
  //   if (!stats || stats.totalRequests === 0) return 0;
  //   return Math.round((stats.completedRequests / stats.totalRequests) * 100);
  // };

  return (
    <div className="flex-1 min-w-0 space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Requests
            </CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
              {stats?.totalRequests ?? serviceRequests.length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              All time requests
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-950 border-emerald-200/50 dark:border-emerald-800/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Completed
            </CardTitle>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              {stats?.completedRequests ?? completedServiceRequests.length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-950 border-amber-200/50 dark:border-amber-800/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Pending
            </CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">
              {stats?.pendingRequests ?? pendingServiceRequests.length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-yellow-50 dark:from-slate-800 dark:to-yellow-950 border-yellow-200/50 dark:border-yellow-800/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Average Rating
            </CardTitle>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
              {stats?.averageRating ? stats.averageRating.toFixed(1) : "—"}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Service satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Service Requests
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
          >
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Requests */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Recent Requests
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Your latest service requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceRequests.slice(0, 5).map((request) => (
                    <div
                      key={request.requestId.toString()}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(request.status)}
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            Request #{request.requestNumber}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {format(new Date(request.date), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  ))}
                  {serviceRequests.length === 0 && (
                    <div className="text-center py-8">
                      <Activity className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-4" />
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        No service requests yet. Click &quot;Request New
                        Service&quot; to get started!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Award className="h-5 w-5 text-red-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/services">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900 dark:hover:to-red-800 text-red-700 dark:text-red-300 transition-all duration-300"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Request New Service
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800 hover:from-yellow-100 hover:to-yellow-200 dark:hover:from-yellow-900 dark:hover:to-yellow-800 text-yellow-700 dark:text-yellow-300 transition-all duration-300 mt-2"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Rate Recent Service
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900 dark:hover:to-blue-800 text-blue-700 dark:text-blue-300 transition-all duration-300"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-slate-200">
                All Service Requests
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Complete list of your service requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceRequests.map((request) => (
                  <Card
                    key={request.requestId.toString()}
                    className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                              Request #{request.requestNumber}
                            </h3>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Requested on{" "}
                            {format(new Date(request.date), "MMMM dd, yyyy")}
                          </p>
                          {request.serviceProvider && (
                            <div className="flex items-center gap-2 mt-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={
                                    request.serviceProvider.profilePicture
                                      ?.url || ""
                                  }
                                  alt={request.serviceProvider.name}
                                />
                                <AvatarFallback className="text-xs bg-gradient-to-br from-red-400 to-blue-500 text-white">
                                  {request.serviceProvider.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-slate-700 dark:text-slate-300">
                                {request.serviceProvider.name}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-200 dark:hover:border-red-800 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {serviceRequests.length === 0 && (
                  <div className="text-center py-12">
                    <CalendarDays className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
                      No service requests yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Start by requesting your first service
                    </p>
                    <Link href="/services">
                      <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
                        Request New Service
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-slate-200">
                Service History
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Your completed and past services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedServiceRequests.map((request) => (
                  <div
                    key={request.requestId.toString()}
                    className="border border-emerald-200/50 dark:border-emerald-700/50 rounded-lg p-4 bg-emerald-50/30 dark:bg-emerald-950/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">
                        Request #{request.requestNumber}
                      </h4>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Completed on{" "}
                      {format(new Date(request.date), "MMMM dd, yyyy")}
                    </p>
                    {request.serviceProvider && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Service Provider: {request.serviceProvider.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {completedServiceRequests.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      No completed services yet
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
