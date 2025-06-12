// src/components/ui/dashboard/ClientProfileSidebar.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Phone,
  Mail,
  Edit,
  IdCard,
  Users,
  Globe,
  Shield,
  Calendar,
  Star,
  Eye,
  Settings,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { ClientData } from "@/store/type/client_provider_Data";
import Link from "next/link";
import { useState } from "react";

interface ClientProfileSidebarProps {
  currentClient: ClientData;
}

export function ClientProfileSidebar({
  currentClient,
}: ClientProfileSidebarProps) {
  const [showIdDetails, setShowIdDetails] = useState(false);

  const handleViewIdDetails = () => {
    // You can implement a modal or expand functionality here
    setShowIdDetails(!showIdDetails);
  };

  const handlePrivacySettings = () => {
    // Implement privacy settings functionality
    // This could open a modal, navigate to a page, or show a dropdown
    console.log("Privacy settings clicked");
    // For now, you could show a toast or modal
    alert("Privacy settings feature coming soon!");
  };

  return (
    <div className="w-80 shrink-0 sticky top-8">
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 max-h-[calc(85vh-8rem)] flex flex-col">
        <CardHeader className="shrink-0 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-800 dark:text-slate-200">
              Profile
            </CardTitle>
            <Link href="/customer/edit">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        {/* Scrollable Content Area */}
        <CardContent className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500 pr-3">
          <div className="space-y-6">
            {/* Profile Picture and Basic Info */}
            <div className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-red-100 dark:ring-red-900/30 transition-all duration-300 hover:ring-red-200 dark:hover:ring-red-800/50">
                <AvatarImage
                  src={currentClient.profilePicture?.url || ""}
                  alt={currentClient.fullName}
                />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-red-400 to-blue-500 text-white">
                  {currentClient.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-1 text-slate-800 dark:text-slate-200">
                {currentClient.fullName}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Client ID: {currentClient.userId}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-4 w-4 text-red-500" />
                <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
                  Contact Details
                </h4>
              </div>
              <div className="space-y-3 pl-6">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Primary
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {currentClient.contactDetails.primaryContact}
                    </p>
                  </div>
                </div>
                {currentClient.contactDetails.secondaryContact && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200">
                    <Phone className="h-4 w-4 text-green-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Secondary
                      </p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {currentClient.contactDetails.secondaryContact}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200">
                  <Mail className="h-4 w-4 text-purple-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Email
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {currentClient.contactDetails.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-red-500" />
                <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
                  Location
                </h4>
              </div>
              <div className="space-y-2 pl-6">
                <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">
                        Region:
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {currentClient.location.region}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">
                        City:
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {currentClient.location.city}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">
                        District:
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {currentClient.location.district}
                      </span>
                    </div>
                    {currentClient.location.locality && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">
                          Locality:
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {currentClient.location.locality}
                        </span>
                      </div>
                    )}
                    {currentClient.location.nearbyLandmark && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Landmark:
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {currentClient.location.nearbyLandmark}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ID Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <IdCard className="h-4 w-4 text-red-500" />
                <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
                  ID Details
                </h4>
              </div>
              <div className="pl-6 space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {currentClient.idDetails.idType}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleViewIdDetails}
                        className="h-6 px-2 text-xs hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        {showIdDetails ? "Hide" : "View"}
                      </Button>
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {showIdDetails
                        ? currentClient.idDetails.idNumber
                        : "••••••••"}
                    </p>
                  </div>
                </div>

                {/* ID File Download/View */}
                {currentClient.idDetails.idFile?.url && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                    <IdCard className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        ID Document
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                          {currentClient.idDetails.idFile.fileName}
                        </p>
                        <a
                          href={currentClient.idDetails.idFile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Handles */}
            {currentClient.socialMediaHandles &&
              currentClient.socialMediaHandles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-red-500" />
                    <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
                      Social Media
                    </h4>
                  </div>
                  <div className="space-y-2 pl-6">
                    {currentClient.socialMediaHandles.map((social, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                      >
                        <Globe className="h-4 w-4 text-blue-500" />
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {social.nameOfSocial}
                          </p>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            @{social.userName}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Account Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-red-500" />
                <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
                  Account Info
                </h4>
              </div>
              <div className="space-y-2 pl-6">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Member Since
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {format(
                        new Date(currentClient.createdAt),
                        "MMMM dd, yyyy"
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Account Status
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        Active
                      </span>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3 border-t border-slate-200/50 dark:border-slate-700/50">
              <Link href="/customer/edit" className="block">
                <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handlePrivacySettings}
                className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 mb-4"
              >
                <Settings className="mr-2 h-4 w-4" />
                Privacy Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
