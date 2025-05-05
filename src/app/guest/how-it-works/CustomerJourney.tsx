"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  UserCheck,
  ClipboardList,
  MapPin,
  CheckSquare,
  Star,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const CustomerJourney: React.FC = () => {
  const customerSteps = [
    {
      title: "Sign Up",
      icon: <UserCheck className="w-8 h-8" />,
      description: "Create your account & verify your identity",
    },
    {
      title: "Request Service",
      icon: <ClipboardList className="w-8 h-8" />,
      description: "Describe what you need done & when",
    },
    {
      title: "Get Matched",
      icon: <UserCheck className="w-8 h-8" />,
      description: "Connect with verified runners in your area",
    },
    {
      title: "Track Progress",
      icon: <MapPin className="w-8 h-8" />,
      description: "Follow your task progress in real-time",
    },
    {
      title: "Verify & Complete",
      icon: <CheckSquare className="w-8 h-8" />,
      description: "Confirm task completion & release payment",
    },
    {
      title: "Rate Experience",
      icon: <Star className="w-8 h-8" />,
      description: "Share your feedback to help the community",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      <Card className="overflow-hidden border-blue-200 shadow-lg mb-10">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <CardTitle className="text-2xl">Customer Journey</CardTitle>
          <CardDescription className="text-blue-100">
            Follow these steps to find reliable help for your errands
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Interactive Journey Flow */}
          <div className="relative">
            {/* Connection lines */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-blue-200 z-0" />

            {/* Steps */}
            <div className="flex flex-wrap justify-between relative z-10">
              {customerSteps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  className="flex flex-col items-center text-center mb-8 px-2"
                  style={{
                    width: `${100 / Math.min(3, customerSteps.length)}%`,
                  }}
                >
                  <div className="mb-3 relative">
                    <div className="w-16 h-16 dark:text-black bg-blue-100 rounded-full flex items-center justify-center mb-1 mx-auto">
                      {step.icon}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Responsive Journey Display for Mobile */}
            <div className="md:hidden mt-6">
              <h3 className="font-bold text-lg mb-4 text-center">
                Journey Steps
              </h3>
              <div className="space-y-4">
                {customerSteps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold">{step.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CustomerJourney;
