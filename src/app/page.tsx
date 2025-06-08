import AppDownload from "@/components/ui/AppDownload";
import CTASection from "@/components/ui/CTASection";
import FAQSection from "@/components/ui/FAQSection";
import HomePageFooter from "@/components/ui/HomePageFooter";
import PopularServices from "@/components/ui/PopularServices";
import Testimonials from "@/components/ui/Testimonials";
import { ArrowRight, CheckCircle, MapPin, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-7xl min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/20 dark:to-purple-400/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
                  🇬🇭 Trusted across Ghana
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Your reliable partner for everyday errands
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Connect with trusted local runners for grocery shopping,
                  deliveries, luggage assistance, and more. Fast, secure, and
                  available throughout Ghana.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <span className="flex items-center justify-center gap-2">
                    Request Service Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm">
                  Become a Runner
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Verified Runners
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Secure Payments
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Real-time Tracking
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-3xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/errand-logo.jpg"
                    alt="Errands Mate - Reliable Service Platform"
                    width={500}
                    height={300}
                    className="w-full h-auto object-contain rounded-2xl"
                    priority
                  />
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-green-400 rounded-full opacity-60 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              How Errands Mate Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get help with your errands in four simple steps. Fast, reliable,
              and secure.
            </p>
            <div className="flex justify-center mt-8">
              <Link
                href="/guest/how-it-works"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold group"
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {[
              {
                step: "01",
                title: "Request Service",
                description:
                  "Tell us what you need help with, when and where you need it done.",
                icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50 dark:bg-blue-900/20",
              },
              {
                step: "02",
                title: "Get Matched",
                description:
                  "We connect you with verified, trusted runners in your area who can help.",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50 dark:bg-green-900/20",
              },
              {
                step: "03",
                title: "Track Progress",
                description:
                  "Monitor your runner's location and receive real-time updates throughout.",
                icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50 dark:bg-purple-900/20",
              },
              {
                step: "04",
                title: "Safe Completion",
                description:
                  "Verify task completion and secure payment release to your runner.",
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                color: "from-orange-500 to-orange-600",
                bgColor: "bg-orange-50 dark:bg-orange-900/20",
              },
            ].map((item, index) => (
              <div key={index} className="group relative">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {item.step}
                </div>

                {/* Card */}
                <div
                  className={`${item.bgColor} backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 dark:border-gray-700/20 h-full`}
                >
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={item.icon}
                      />
                    </svg>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="space-y-0">
        <PopularServices />
        <Testimonials />
        <CTASection />
        <AppDownload />
        <FAQSection />
        <HomePageFooter />
      </div>
    </div>
  );
}
