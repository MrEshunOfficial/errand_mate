import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function KayayeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-white border-t border-gray-800 dark:border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-white dark:text-gray-900">
              Kayaye
            </h3>
            <p className="text-gray-300 dark:text-gray-600 mb-6">
              Connecting people with reliable help for everyday errands across
              Africa.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Company Links */}
            <div>
              <h4 className="font-bold mb-4 text-white dark:text-gray-900">
                Company
              </h4>
              <ul className="space-y-2">
                {["About Us", "Careers", "Blog", "Press"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-blue-400 dark:text-gray-600 dark:hover:text-blue-600 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="font-bold mb-4 text-white dark:text-gray-900">
                Services
              </h4>
              <ul className="space-y-2">
                {[
                  "Grocery Shopping",
                  "Luggage Carrying",
                  "Package Delivery",
                  "Market Shopping",
                  "Become a Runner",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-blue-400 dark:text-gray-600 dark:hover:text-blue-600 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links + Contact */}
            <div>
              <h4 className="font-bold mb-4 text-white dark:text-gray-900">
                Support
              </h4>
              <ul className="space-y-2">
                {[
                  "Help Center",
                  "Safety",
                  "Terms of Service",
                  "Privacy Policy",
                  "FAQs",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-blue-400 dark:text-gray-600 dark:hover:text-blue-600 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>

              <h4 className="font-bold mt-6 mb-2 text-white dark:text-gray-900">
                Contact
              </h4>
              <div className="text-gray-300 dark:text-gray-600">
                <p>support@kayaye.com</p>
                <p>+123 456 7890</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-700 dark:border-gray-200 text-center">
          <p className="text-gray-400 dark:text-gray-500">
            &copy; {currentYear} Project Kayaye. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
