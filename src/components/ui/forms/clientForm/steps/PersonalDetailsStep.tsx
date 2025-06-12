// src/components/forms/ClientForm/steps/PersonalDetailsStep.tsx
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useSession } from "next-auth/react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User, CheckCircle } from "lucide-react";
import { ClientFormData } from "../ClientFormUI";

const PersonalDetailsStep: React.FC = () => {
  const { data: session } = useSession();
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ClientFormData>();

  const fullName = watch("fullName");

  // Auto-populate form fields from session
  useEffect(() => {
    if (session?.user?.name && !fullName) {
      setValue("fullName", session.user.name);
    }
  }, [session?.user?.name, fullName, setValue]);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Authentication Required
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please sign in to continue with your profile setup.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
        <CardContent className="p-8">
          {/* Account Info Display */}
          <div className="flex items-center space-x-4 mb-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                Account Verified
              </h3>
              <p className="text-xs text-green-700 dark:text-green-300">
                Signed in as {session.user.email}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <FormField
              control={control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Full Name *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        placeholder="Enter your full name"
                        className={`pl-10 h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg ${
                          errors.fullName
                            ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                            : ""
                        }`}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Hidden User ID field for form validation */}
            <FormField
              control={control}
              name="userId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Info Note */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              <strong>Note:</strong> This information will be used for your
              client profile and will be visible to service providers. Ensure
              accuracy for proper identification. The email address will be
              collected in the next step.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalDetailsStep;
