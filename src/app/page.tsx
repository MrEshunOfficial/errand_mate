import AppDownload from "@/components/ui/AppDownload";
import CTASection from "@/components/ui/CTASection";
import FAQSection from "@/components/ui/FAQSection";
import HomePageFooter from "@/components/ui/HomePageFooter";
import PopularServices from "@/components/ui/PopularServices";
import Testimonials from "@/components/ui/Testimonials";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import ProgressiveDisclosureHero from "@/components/ui/AnimatedCardsHero";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-7xl min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/20 dark:to-purple-400/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          {/* Mobile-First Hero Layout */}
          <div className="space-y-8 lg:space-y-0">
            {/* Mobile Header with Compact Logo */}
            <div className="lg:hidden text-center space-y-6">
              {/* Compact Mobile Logo */}
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div className="w-20 h-20 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-2xl shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300"></div>
                    <div className="relative z-10 w-full h-full bg-white dark:bg-gray-800 rounded-2xl p-1.5 shadow-md">
                      <Image
                        src="/errand-logo.jpg"
                        alt="Errands Mate"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain rounded-xl"
                        priority
                      />
                    </div>
                  </div>
                  {/* Subtle mobile floating elements */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full opacity-70 animate-pulse"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 rounded-full opacity-60"></div>
                </div>
              </div>

              {/* Mobile Hero Content */}
              <div className="px-4">
                <ProgressiveDisclosureHero />
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex flex-col gap-3 px-4 max-w-sm mx-auto">
                <Link
                  href="/services"
                  className="group px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center"
                >
                  <span className="flex items-center justify-center gap-2">
                    Request Service
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/errand-provider"
                  className="px-6 py-4 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm inline-flex items-center justify-center"
                >
                  Browse Service Providers
                </Link>
              </div>
            </div>

            {/* Desktop Hero Grid */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
              {/* Left Column - Hero Content */}
              <div className="space-y-8">
                {/* Progressive Disclosure Hero Component */}
                <ProgressiveDisclosureHero />

                {/* Desktop Action Buttons */}
                <div className="flex flex-row gap-4 max-w-md">
                  <Link
                    href="/services"
                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Request Service
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    href="/errand-provider"
                    className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm inline-flex items-center justify-center"
                  >
                    Browse Providers
                  </Link>
                </div>
              </div>

              {/* Right Column - Desktop Logo */}
              <div className="relative flex justify-end">
                <div className="relative group max-w-md xl:max-w-lg">
                  {/* Main Logo Container */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-3xl shadow-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500 opacity-90"></div>
                    <div className="relative z-10 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl">
                      <Image
                        src="/errand-logo.jpg"
                        alt="Errands Mate - Reliable Service Platform"
                        width={400}
                        height={300}
                        className="w-full h-auto object-contain rounded-2xl"
                        priority
                      />
                    </div>
                  </div>

                  {/* Desktop Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-80 animate-pulse shadow-lg"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-400 rounded-full opacity-70 animate-bounce shadow-lg"></div>
                  <div className="absolute top-1/4 -left-6 w-10 h-10 bg-purple-400 rounded-full opacity-60 animate-pulse shadow-lg"></div>

                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-100/30 to-purple-100/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl blur-3xl transform scale-110"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 sm:py-10 lg:py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              Simple Process
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              How Errands Mate Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get help with your errands in four simple steps. Fast, reliable,
              and secure.
            </p>
            <div className="flex justify-center mt-6 sm:mt-8">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold group"
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Steps Grid - Better mobile layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
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
                <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg z-10">
                  {item.step}
                </div>

                {/* Card */}
                <div
                  className={`${item.bgColor} backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 dark:border-gray-700/20 h-full`}
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-white"
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
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
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
