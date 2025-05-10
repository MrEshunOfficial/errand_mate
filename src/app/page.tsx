import AppDownload from "@/components/ui/AppDownload";
import CTASection from "@/components/ui/CTASection";
import FAQSection from "@/components/ui/FAQSection";
import HomePageFooter from "@/components/ui/HomePageFooter";
import PopularServices from "@/components/ui/PopularServices";
import Testimonials from "@/components/ui/Testimonials";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-geist-sans leading-tight">
              Find reliable help for your everyday errands in Ghana
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              Errands mate connects you with trusted local runners who can help
              with grocery shopping, luggage carrying, deliveries, and more
              throughout Ghana.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
              >
                Request a Service
              </a>
              <a
                href="#"
                className="px-6 py-3 bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors font-medium"
              >
                Register as a Service Provider
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="relative rounded-xl overflow-hidden shadow-xl aspect-video">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-75"></div>
              <div className="relative flex items-center justify-center h-full text-white text-xl font-medium">
                Trusted Errand Services Across Ghana
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            How Errands Mate Works
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We make it easy to find help for your errands in just a few simple
            steps
          </p>
        </div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{""}</h2>
          <Link
            href="/guest/how-it-works"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
          >
            Learn More
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Request a Service",
              description:
                "Tell us what you need help with, when and where you need it done.",
              icon: (
                <svg
                  className="w-12 h-12 text-blue-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              ),
            },
            {
              title: "Get Matched",
              description:
                "We'll connect you with verified runners in your area who can help.",
              icon: (
                <svg
                  className="w-12 h-12 text-blue-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              ),
            },
            {
              title: "Track Progress",
              description:
                "Monitor your runner's location and receive real-time updates throughout the service.",
              icon: (
                <svg
                  className="w-12 h-12 text-blue-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  ></path>
                </svg>
              ),
            },
            {
              title: "Safe Completion",
              description:
                "Verify your task is completed correctly before payment is released to the runner.",
              icon: (
                <svg
                  className="w-12 h-12 text-blue-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              ),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              {item.icon}
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Services */}
      <PopularServices />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <CTASection />

      {/* App Download Section */}
      <AppDownload />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <HomePageFooter />
    </div>
  );
}
