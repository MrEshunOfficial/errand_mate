"use client";
import { ClientForm } from "@/components/ui/forms/clientForm/ClienForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ClientRegister() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.user?.id) {
      router.push("/user/login");
      return;
    }

    setIsLoading(false);
  }, [session, status, router]);

  const handleRegistrationSuccess = () => {
    router.push("/user/dashboard");
  };

  const handleBackToDashboard = () => {
    router.push("/user/dashboard");
  };

  if (isLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-300" />
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>

            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 border border-blue-200 dark:border-gray-700 shadow-lg rounded-2xl p-0">
              <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('/pattern.svg')] bg-no-repeat bg-center bg-contain pointer-events-none" />
              <CardHeader className="text-center py-10 px-6 md:px-12 relative z-10">
                <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shadow-inner ring-4 ring-white dark:ring-gray-800">
                  <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <CardTitle className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Let’s Get You Ready
                </CardTitle>
                <CardDescription className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Finish your one-time profile setup to start using{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    ErrandsMate
                  </span>{" "}
                  and unlock your personalized experience.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 dark:text-green-300 font-bold text-xl">
                    1
                  </span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  Quick Setup
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete your profile in just a few minutes
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 dark:text-blue-300 font-bold text-xl">
                    2
                  </span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  Personalized Service
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find service providers near you, tailored to your preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 dark:text-purple-300 font-bold text-xl">
                    3
                  </span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  Track Progress
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitor your service requests and history
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                Client Registration
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Please fill in your details to create your client profile. All
                fields marked with an asterisk (*) are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientForm
                mode="create"
                onSuccess={handleRegistrationSuccess}
                showSuccessRedirect={false}
              />
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  If you encounter any issues during registration, our support
                  team is here to help.
                </p>
                <Button
                  variant="outline"
                  className="dark:border-gray-600 dark:text-gray-200"
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
