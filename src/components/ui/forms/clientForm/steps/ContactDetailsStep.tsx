// src/components/forms/ClientForm/steps/ContactDetailsStep.tsx
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, PhoneCall } from "lucide-react";
import { ClientFormData } from "../ClienForm";

const ContactDetailsStep: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ClientFormData>();

  const inputClasses =
    "transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white";
  const iconClasses = "h-4 w-4 text-gray-500 dark:text-gray-400";

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Primary Contact */}
          <FormField
            control={control}
            name="contactDetails.primaryContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                  <Phone className={iconClasses} />
                  Primary Contact Number
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="+233 24 123 4567"
                    className={inputClasses}
                    type="tel"
                  />
                </FormControl>
                <FormDescription className="text-gray-500 dark:text-gray-400 text-sm">
                  Main phone number for client communication
                </FormDescription>
                <FormMessage className="text-red-600 dark:text-red-400 text-sm" />
              </FormItem>
            )}
          />

          {/* Secondary Contact */}
          <FormField
            control={control}
            name="contactDetails.secondaryContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                  <PhoneCall className={iconClasses} />
                  Secondary Contact Number
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="+233 20 765 4321"
                    className={inputClasses}
                    type="tel"
                  />
                </FormControl>
                <FormDescription className="text-gray-500 dark:text-gray-400 text-sm">
                  Alternative contact number (family member or close friend)
                </FormDescription>
                <FormMessage className="text-red-600 dark:text-red-400 text-sm" />
              </FormItem>
            )}
          />

          {/* Email Address */}
          <FormField
            control={control}
            name="contactDetails.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                  <Mail className={iconClasses} />
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="client@example.com"
                    className={inputClasses}
                    type="email"
                  />
                </FormControl>
                <FormDescription className="text-gray-500 dark:text-gray-400 text-sm">
                  Valid email address for notifications and communication
                </FormDescription>
                <FormMessage className="text-red-600 dark:text-red-400 text-sm" />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Error Summary */}
      {(errors.contactDetails?.primaryContact ||
        errors.contactDetails?.secondaryContact ||
        errors.contactDetails?.email) && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-red-800 dark:text-red-200 font-medium text-sm">
                  Please correct the following contact details:
                </h4>
                <ul className="text-red-700 dark:text-red-300 text-sm mt-1 space-y-1">
                  {errors.contactDetails?.primaryContact && (
                    <li>• {errors.contactDetails.primaryContact.message}</li>
                  )}
                  {errors.contactDetails?.secondaryContact && (
                    <li>• {errors.contactDetails.secondaryContact.message}</li>
                  )}
                  {errors.contactDetails?.email && (
                    <li>• {errors.contactDetails.email.message}</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactDetailsStep;
