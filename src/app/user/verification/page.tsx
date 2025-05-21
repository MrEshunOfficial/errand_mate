"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AxiosError } from "@/store/type/axios-types";

// Define API response types
interface ApiSuccessResponse {
  success: boolean;
  message: string;
}

interface ApiErrorResponse {
  success: boolean;
  error: string;
}

interface VerificationState {
  status: "idle" | "loading" | "success" | "error";
  message: string | null;
}

/**
 * Email Verification Component
 * Handles verification of user emails via tokens
 */
export default function VerifyEmail() {
  const [verification, setVerification] = useState<VerificationState>({
    status: "idle",
    message: null,
  });

  /**
   * Verifies email by sending token to the API
   */
  const verifyEmail = async (verificationToken: string) => {
    if (!verificationToken) return;

    try {
      setVerification({
        status: "loading",
        message: "Verifying your email...",
      });

      const response = await axios.post<ApiSuccessResponse>(
        "/api/verifyemail",
        {
          token: verificationToken,
        }
      );

      if (response.data.success) {
        setVerification({
          status: "success",
          message:
            response.data.message ||
            "Your email has been verified successfully!",
        });
      } else {
        setVerification({
          status: "error",
          message: "Email verification failed.",
        });
      }
    } catch (error) {
      console.error("Error verifying email:", error);

      // Handle specific error cases
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response) {
        setVerification({
          status: "error",
          message:
            axiosError.response.data?.error || "Email verification failed.",
        });
      } else {
        setVerification({
          status: "error",
          message: "An error occurred while verifying your email.",
        });
      }
    }
  };

  // Extract token from URL on initial load
  useEffect(() => {
    const extractTokenFromUrl = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get("token");

        if (tokenFromUrl) {
          verifyEmail(tokenFromUrl);
        } else {
          setVerification({
            status: "error",
            message: "No verification token found in URL.",
          });
        }
      } catch (error) {
        console.error("Error extracting token:", error);
        setVerification({
          status: "error",
          message: "Invalid verification link.",
        });
      }
    };

    extractTokenFromUrl();
  }, []);

  // Render appropriate UI based on verification status
  const renderVerificationStatus = () => {
    switch (verification.status) {
      case "success":
        return (
          <div className="text-green-500 font-medium text-center p-4 bg-green-50 rounded-lg">
            <svg
              className="w-6 h-6 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {verification.message}
          </div>
        );

      case "error":
        return (
          <div className="text-red-500 font-medium text-center p-4 bg-red-50 rounded-lg">
            <svg
              className="w-6 h-6 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {verification.message}
          </div>
        );

      case "loading":
        return (
          <div className="text-blue-500 font-medium text-center p-4 bg-blue-50 rounded-lg animate-pulse">
            <svg
              className="w-6 h-6 mx-auto mb-2 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Verifying your email...
          </div>
        );

      default:
        return (
          <div className="text-gray-500 text-center">
            Waiting for verification...
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Email Verification
          </h1>

          {renderVerificationStatus()}

          <div className="mt-8">
            <Link
              href="/user/login"
              className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
