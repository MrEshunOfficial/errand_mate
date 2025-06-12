// components/MobileHeader.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Logout from "@/app/user/Logout";
import Image from "next/image";

// Navigation item interfaces
interface NavigationItem {
  title: string;
  href: string;
  children?: NavigationChild[];
  icon?: React.ReactNode;
}

interface NavigationChild {
  title: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface MobileHeaderProps {
  navigationItems: NavigationItem[];
  ThemeSwitcher: React.ComponentType;
}

export default function MobileHeader({
  navigationItems,
  ThemeSwitcher,
}: MobileHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const userSession = session?.user?.id;
  const pathname = usePathname();

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname?.startsWith(path);
  };

  const handleItemClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button and theme switcher */}
      <div className="md:hidden flex items-center space-x-2">
        <ThemeSwitcher />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-700 dark:text-gray-300"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg"
          >
            <div className="px-4 py-5 space-y-1 max-h-96 overflow-y-auto">
              {/* Navigation Items */}
              {navigationItems.map((item) =>
                item.children ? (
                  <MobileNavDropdown
                    key={item.title}
                    item={item}
                    isActive={isActive(item.href)}
                    onItemClick={handleItemClick}
                  />
                ) : (
                  <MobileNavLink
                    key={item.title}
                    href={item.href}
                    onClick={handleItemClick}
                    isActive={isActive(item.href)}
                  >
                    {item.title}
                  </MobileNavLink>
                )
              )}

              {/* Auth Section */}
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                {!userSession ? (
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/user/login"
                      onClick={handleItemClick}
                      className="w-full py-2 px-4 text-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-md border border-gray-200 dark:border-gray-700 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/user/register"
                      onClick={handleItemClick}
                      className="w-full py-2 px-4 text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-md transition-all hover:from-blue-700 hover:to-cyan-600"
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  <MobileUserMenu onItemClick={handleItemClick} />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Mobile User Menu Component
function MobileUserMenu({ onItemClick }: { onItemClick: () => void }) {
  const { data: session } = useSession();

  return (
    <div className="space-y-2">
      {/* User Info */}
      <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="w-10 h-10 rounded-full overflow-hidden relative bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={`${session?.user?.name || "User"}'s avatar`}
              width={40}
              height={40}
              className="rounded-full object-cover"
              sizes="40px"
            />
          ) : (
            <span className="text-white text-sm font-medium">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {session?.user?.name || "User"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {session?.user?.email}
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        <Link
          href="/user/profile"
          onClick={onItemClick}
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Profile
        </Link>
        <Link
          href="/user/dashboard"
          onClick={onItemClick}
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/user/orders"
          onClick={onItemClick}
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          My Orders
        </Link>
        <Link
          href="/user/settings"
          onClick={onItemClick}
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Settings
        </Link>
        <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="px-3 py-2">
            <Logout />
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Nav Link Component
function MobileNavLink({
  href,
  onClick,
  children,
  isActive,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
        isActive
          ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
          : "text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {children}
    </Link>
  );
}

// Mobile Nav Dropdown Component
function MobileNavDropdown({
  item,
  isActive,
  onItemClick,
}: {
  item: NavigationItem;
  isActive: boolean;
  onItemClick?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex justify-between items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
          isActive
            ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
            : "text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <span>{item.title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-4"
          >
            <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-2 space-y-1 py-1">
              {item.children?.map((child) => (
                <Link
                  key={child.title}
                  href={child.href}
                  onClick={onItemClick}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {child.icon}
                    <span>{child.title}</span>
                    {child.badge && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">
                        {child.badge}
                      </span>
                    )}
                  </div>
                  {child.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                      {child.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
