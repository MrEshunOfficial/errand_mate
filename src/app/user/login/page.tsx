import React, { JSX } from "react";
import FeaturesCarousel from "../FeaturesCarousel";
import AuthLogin from "@/app/user/login/AuthLogin";

export default function AuthPage(): JSX.Element {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Left Panel - Sign In Form */}
      <AuthLogin />

      {/* Right Panel - Interactive Feature Carousel */}
      <div className="hidden md:block flex-1 h-full relative overflow-hidden">
        {/* Features Carousel Component */}
        <FeaturesCarousel />
      </div>
    </div>
  );
}
