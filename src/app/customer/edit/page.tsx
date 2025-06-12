"use client";

import { useClient } from "@/hooks/useClient";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Edit, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClientForm } from "@/components/ui/forms/clientForm/ClientForm";

export default function ClientEdit() {
  const { data: session, status } = useSession();
  const { currentClient, getClientByUserId, loading, clearAllErrors } =
    useClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const initializeClient = async () => {
      if (status === "loading") return;

      if (status === "unauthenticated" || !session?.user?.id) {
        router.push("/user/login");
        return;
      }

      try {
        clearAllErrors();
        setInitError(null);

        const clientData = await getClientByUserId(session.user.id);

        if (!clientData) {
          // No client found - redirect to registration
          router.push("/client/register");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          const errorMessage = error.message;

          if (
            errorMessage.includes("404") ||
            errorMessage.includes("HTTP error! status: 404")
          ) {
            router.push("/client/register");
            return;
          }

          console.error("Error fetching client data:", errorMessage);
          setInitError(errorMessage);
        } else {
          console.error("Unknown error fetching client data:", error);
          setInitError("An unexpected error occurred");
        }

        setIsLoading(false);
      }
    };

    initializeClient();
  }, [session, status, getClientByUserId, clearAllErrors, router]);

  const handleUpdateSuccess = () => {
    // Close the form and redirect to dashboard after successful update
    setShowEditForm(false);
    router.push("/user/dashboard");
  };

  const handleBackToDashboard = () => {
    router.push("/user/dashboard");
  };

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleEditClose = () => {
    setShowEditForm(false);
  };

  // Show loading spinner while checking auth and fetching client
  if (isLoading || status === "loading" || loading.fetchClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (initError) {
    return (
      <div className="container mx-auto py-8 bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
              Error Loading Profile
            </h1>
            <p className="text-red-600 dark:text-red-300 mb-4">
              We encountered an error while loading your profile.
            </p>
            <p className="text-sm text-red-500 dark:text-red-400 mb-4">
              {initError}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setInitError(null);
                  setIsLoading(true);
                }}
                className="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
              >
                Try Again
              </button>
              <Button variant="outline" onClick={handleBackToDashboard}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show edit form if client exists
  if (!currentClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No client data found
          </p>
          <Button onClick={() => router.push("/client/register")}>
            Register as Client
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>

              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                      <Edit className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Your Profile
                      </CardTitle>
                      <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                        Update your information to keep your profile current and
                        accurate.
                      </CardDescription>
                    </div>
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={currentClient.profilePicture?.url || ""}
                        alt={currentClient.fullName}
                      />
                      <AvatarFallback className="text-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {currentClient.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Current Profile Summary */}
            <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <User className="h-5 w-5" />
                  Current Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Full Name
                    </h4>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {currentClient.fullName}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Primary Contact
                    </h4>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {currentClient.contactDetails.primaryContact}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Email
                    </h4>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {currentClient.contactDetails.email}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Location
                    </h4>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {currentClient.location.locality},{" "}
                      {currentClient.location.city}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Button */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Update Profile Information
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Make changes to your profile information below. All fields
                  marked with an asterisk (*) are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleEditClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="mt-8 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    Need Help?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    If you need assistance updating your profile, our support
                    team is available to help.
                  </p>
                  <Button
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      <ClientForm
        mode="edit"
        initialData={currentClient}
        clientId={currentClient._id.toString()}
        onSuccess={handleUpdateSuccess}
        onClose={handleEditClose}
        isOpen={showEditForm}
      />
    </>
  );
}
