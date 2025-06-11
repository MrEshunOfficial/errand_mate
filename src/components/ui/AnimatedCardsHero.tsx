"use client";
import Link from "next/link";
import React from "react";

const ProgressiveDisclosureHero = () => {
  return (
    <div className="space-y-4 max-w-2xl mx-auto lg:mx-0">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
        Your everyday tasks, <span className="text-blue-600">simplified</span>
      </h3>

      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
        Connect with verified service providers across Ghana for reliable help
        when you need it.
      </p>

      <details className="group">
        <summary className="cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-2 transition-colors duration-200">
          What can we help with?
          <svg
            className="w-4 h-4 transition-transform group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </summary>
        <div className="mt-3 pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-2">
          {[
            "🛒 Grocery shopping & errands",
            "📄 Document processing & submissions",
            "🚚 Delivery & pickup services",
            "📚 Academic & research assistance",
            "🏠 Home support & maintenance",
          ].map((item, idx) => (
            <div
              key={idx}
              className="text-sm text-gray-600 dark:text-gray-400 opacity-90 hover:opacity-100 transition-opacity duration-200"
              style={{
                animation: `slideIn 0.3s ease-out ${idx * 0.05}s both`,
              }}
            >
              {item}
            </div>
          ))}
          <div
            className="text-sm opacity-90 hover:opacity-100 transition-opacity duration-200"
            style={{
              animation: `slideIn 0.3s ease-out ${5 * 0.05}s both`,
            }}
          >
            <Link
              href="/services"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              ...Explore All
            </Link>
          </div>
        </div>
      </details>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressiveDisclosureHero;
