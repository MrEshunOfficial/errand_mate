"use client";
import { doSocialLogin } from "@/app/actions";
import { JSX, useState, FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { Mail, ArrowRight, ChevronLeft, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import CredentialsLogin from "@/app/user/login/CredentialsLogin";
import { TermsAndPrivacy } from "../TermsandConditions";

// Shared Account Creation link component
function CreateAccountLink(): JSX.Element {
  return (
    <div className="text-center">
      <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base transition-colors duration-200">
        Don&apos;t have an account?{" "}
        <a
          href="/user/register"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200 underline-offset-2 hover:underline"
        >
          Create account
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
    <div className="space-y-6 p-3 lg:p-4">
      {/* Google Sign-In Button */}
      <Button
        onClick={handleGoogleSignIn}
        variant="secondary"
        className="w-full flex items-center justify-center gap-3 py-5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm rounded-lg"
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
      // This would call your actual doSocialLogin function
      // For demo purposes, we're just simulating the magic link sending
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
    <div className="space-y-5">
      {!showMagicLinkSent ? (
        <>
          {/* Magic Link Sign-In Form */}
          <div className="w-full space-y-3">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm text-gray-700 dark:text-gray-300 font-medium transition-colors duration-200"
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
                  className="w-full py-2.5 px-4 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
                  required
                />
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-200">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
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
              <div className="w-full border-t border-gray-300 dark:border-gray-700 transition-colors duration-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Or login with
              </span>
            </div>
          </div>
          {/* Alternative Sign-In Options */}
          <CredentialsLogin />
          <CreateAccountLink />
          <TermsAndPrivacy />
        </>
      ) : (
        /* Magic Link Sent Confirmation Screen */
        <div className="text-center space-y-5">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full w-14 h-14 mx-auto flex items-center justify-center transition-colors duration-200">
            <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
              Check your inbox
            </h3>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">
              We&apos;ve sent a magic link to{" "}
              <span className="text-gray-900 dark:text-white font-medium transition-colors duration-200">
                {email}
              </span>
            </p>
          </div>

          <Button
            onClick={resetForm}
            className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
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

// Combined auth component that can be used as a unified solution
export default function AuthLogin(): JSX.Element {
  const [authMethod, setAuthMethod] = useState<"google" | "magic-link">(
    "magic-link"
  );

  return (
    <div className="bg-white dark:bg-gray-900 w-full max-w-md hide-scrollbar transition-colors duration-200">
      <div className="p-4 lg:p-6">
        <div className="flex flex-col justify-center items-center mb-4 lg:mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
            Welcome Back to{" "}
            <span className="text-teal-600 dark:text-teal-400 transition-colors duration-200">
              Kayaye
            </span>
          </h2>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-2 transition-colors duration-200">
            Please choose your preferred sign-in method
          </span>
        </div>

        <div className="flex space-x-2 mb-4 lg:mb-6">
          <Button
            variant={authMethod === "magic-link" ? "default" : "outline"}
            className={`flex-1 ${
              authMethod === "magic-link"
                ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                : "border-gray-300 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            } transition-colors duration-200`}
            onClick={() => setAuthMethod("magic-link")}
          >
            Email
          </Button>
          <Button
            variant={authMethod === "google" ? "default" : "outline"}
            className={`flex-1 ${
              authMethod === "google"
                ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                : "border-gray-300 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            } transition-colors duration-200`}
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
