"use client";
import { doSocialLogin } from "@/app/actions";
import { JSX, useState, FormEvent, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Mail, ArrowRight, ChevronLeft, AlertCircle } from "lucide-react";

import CredentialsRegister from "@/app/user/register/CredentialsRegister";
import { Button } from "@/components/ui/button";
import { TermsAndPrivacy } from "../TermsandConditions";

// Shared Account Creation link component
function CreateAccountLink(): JSX.Element {
  return (
    <div className="text-center">
      <p className="text-gray-600 dark:text-white/80 text-sm lg:text-base">
        have an account already?{" "}
        <a
          href="/user/login"
          className="text-blue-600 dark:text-white hover:text-blue-800 dark:hover:text-blue-200 font-medium transition-colors duration-200 underline-offset-2 hover:underline"
        >
          login instead
        </a>
      </p>
    </div>
  );
}

// Shared Google Sign-In handler
function handleGoogleSignIn() {
  const formData = new FormData();
  formData.append("action", "google");
  doSocialLogin(formData);
}

// Google Sign-In Component with enhanced UI and functionality
export function GoogleSignIn(): JSX.Element {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Google Sign-In Button */}
      <Button
        onClick={handleGoogleSignIn}
        variant="secondary"
        className="w-full flex items-center justify-center gap-3 py-6 bg-white text-gray-800 hover:bg-gray-100 transition-all duration-200 shadow-sm rounded-lg"
      >
        <FcGoogle className="h-5 w-5 lg:h-6 lg:w-6" />
        <span className="font-medium">Continue with Google</span>
      </Button>

      <CreateAccountLink />
      <TermsAndPrivacy />
    </div>
  );
}

// Enhanced Resend Magic Link Component with email validation and improved UI
export function ResendSignIn(): JSX.Element {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMagicLinkSent, setShowMagicLinkSent] = useState(false);
  const [error, setError] = useState("");

  // Simple email validation
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowMagicLinkSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the form to initial state
  const resetForm = () => {
    setShowMagicLinkSent(false);
    setEmail("");
  };

  return (
    <div className="space-y-6 w-full">
      {!showMagicLinkSent ? (
        <>
          {/* Magic Link Sign-In Form */}
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm text-gray-700 dark:text-white/90 font-medium"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full py-3 px-4 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200"
            >
              {isSubmitting ? (
                "Sending link..."
              ) : (
                <>
                  Send magic link
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Or register with
              </span>
            </div>
          </div>
          {/* Alternative Sign-In Options */}
          <CredentialsRegister />
          <CreateAccountLink />
        </>
      ) : (
        /* Magic Link Sent Confirmation Screen */
        <div className="text-center space-y-6">
          <div className="bg-blue-100 dark:bg-blue-500/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Check your inbox
            </h3>
            <p className="text-gray-600 dark:text-white/70">
              We&apos;ve sent a magic link to{" "}
              <span className="text-gray-900 dark:text-white font-medium">
                {email}
              </span>
            </p>
          </div>

          <Button
            onClick={resetForm}
            className="flex items-center justify-center gap-2 text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white"
            variant="ghost"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to sign in
          </Button>
        </div>
      )}
    </div>
  );
}

// Enhanced Header Component
function EnhancedHeader(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="text-center relative overflow-hidden">
      <div
        className={`space-y-2 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        } transition-all duration-1000`}
      >
        <h2 className="flex item-center gap-1 text-lg lg:text-xl font-extrabold text-gray-900 dark:text-white">
          <span>Connect & Access</span>
          <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-600">
            Essential Services
            <svg
              className="absolute -bottom-1 left-0 w-full"
              height="6"
              viewBox="0 0 200 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 3C50 3 50 3 100 3C150 3 150 3 200 3"
                stroke="url(#paint0_linear)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="0"
                  y1="3"
                  x2="200"
                  y2="3"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0D9488" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#0D9488" />
                  <stop offset="1" stopColor="#0891B2" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h2>

        <h3 className="lg:text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
          Join the{" "}
          <span className="text-teal-600 dark:text-teal-400 bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
            Kayaye
          </span>
          <span></span> Network
        </h3>
      </div>
    </div>
  );
}

// Combined auth component that can be used as a unified solution
export default function AuthRegister(): JSX.Element {
  const [authMethod, setAuthMethod] = useState<"google" | "magic-link">(
    "magic-link"
  );

  return (
    <div className="bg-white dark:bg-gray-900 w-full max-w-md overflow-y-scroll hide-scrollbar">
      <div className="p-4 lg:p-6">
        {/* Replacing the original header with the enhanced version */}
        <EnhancedHeader />

        <div className="flex space-x-2 mt-6 mb-6">
          <Button
            variant={authMethod === "magic-link" ? "default" : "outline"}
            className={`flex-1 ${
              authMethod === "magic-link"
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-gray-300 dark:border-white/30 bg-transparent text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
            onClick={() => setAuthMethod("magic-link")}
          >
            Email
          </Button>
          <Button
            variant={authMethod === "google" ? "default" : "outline"}
            className={`flex-1 ${
              authMethod === "google"
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-gray-300 dark:border-white/30 bg-transparent text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
            onClick={() => setAuthMethod("google")}
          >
            Google
          </Button>
        </div>

        {authMethod === "google" ? <GoogleSignIn /> : <ResendSignIn />}
      </div>
    </div>
  );
}
