"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserCheck,
  MapPin,
  MessageSquare,
  Smartphone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomerJourney from "./CustomerJourney";
import RunnerJourney from "./ServiceProviderJourney";
import FAQSection from "@/components/ui/FAQSection";

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState("customer");

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          How Errands mate Works
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Our platform makes it easy to find trusted help for your errands in
          Ghana. Here&apos;s a detailed guide on how our service works from
          start to finish.
        </p>
      </motion.div>

      {/* User/Service Provider Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <div className="flex justify-center mb-8">
          <TabsList className="w-full flex items-center justify-between max-w-md py-3">
            <TabsTrigger value="customer" className="flex-1 py-4">
              For Customers
            </TabsTrigger>
            <TabsTrigger value="Service Provider" className="flex-1 py-4">
              For Service Providers
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Customer Journey */}
        <TabsContent value="customer">
          <CustomerJourney />

          {/* Call to Action for Customers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8"
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Request a Service
            </Button>
          </motion.div>
        </TabsContent>

        {/* Service Provider Journey */}
        <TabsContent value="Service Provider">
          <RunnerJourney />

          {/* Call to Action for Service Providers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8"
          >
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Apply to Be a Service Provider
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Security & Trust Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-16"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Your Safety is Our Priority
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We&apos;ve built multiple security layers into every step of the
            Errands mate experience
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Verified Identities",
                  description:
                    "Every Service Provider undergoes a strict verification process including ID checks and background screening",
                  icon: <UserCheck className="w-10 h-10 text-blue-600" />,
                },
                {
                  title: "Secure Payments",
                  description:
                    "All payments are held in escrow until you confirm task completion",
                  icon: <ShieldCheck className="w-10 h-10 text-blue-600" />,
                },
                {
                  title: "Real-time Tracking",
                  description:
                    "Track your Service Provider's location in real-time throughout the service for peace of mind",
                  icon: <MapPin className="w-10 h-10 text-blue-600" />,
                },
                {
                  title: "In-app Communication",
                  description:
                    "All communications happen within our app so your personal contact details remain private",
                  icon: <MessageSquare className="w-10 h-10 text-blue-600" />,
                },
                {
                  title: "Community Ratings",
                  description:
                    "Our rating system ensures accountability and helps maintain high service standards",
                  icon: <Star className="w-10 h-10 text-blue-600" />,
                },
                {
                  title: "24/7 Support",
                  description:
                    "Our support team is always available to assist with any issues or concerns",
                  icon: <Smartphone className="w-10 h-10 text-blue-600" />,
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4">
                  <div className="flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* FAQ Section - Using the new reusable component */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <FAQSection />
      </motion.div>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers across Ghana who use Errands
          mate for their everyday errands
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="font-medium text-blue-600"
            onClick={() => setActiveTab("customer")}
          >
            Find a Service Provider
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="font-medium text-blue-600 bg-white border-white hover:bg-blue-50 dark:text-black"
            onClick={() => setActiveTab("Service Provider")}
          >
            Become a Service Provider
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
