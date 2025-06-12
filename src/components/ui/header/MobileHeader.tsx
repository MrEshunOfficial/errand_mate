// components/MobileHeader.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Logout } from "@/app/user/Logout";
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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

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
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 relative z-50"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-2xl z-40 md:hidden max-h-[calc(100vh-4rem)] overflow-hidden"
            >
              <div className="px-4 py-6 space-y-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
                {/* Navigation Items */}
                <div className="space-y-1">
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
                </div>

                {/* Auth Section */}
                <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                  {!userSession ? (
                    <div className="flex flex-col space-y-3">
                      <Link
                        href="/user/login"
                        onClick={handleItemClick}
                        className="w-full py-3 px-4 text-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/user/register"
                        onClick={handleItemClick}
                        className="w-full py-3 px-4 text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-cyan-600 shadow-md hover:shadow-lg"
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
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Mobile User Menu Component
function MobileUserMenu({ onItemClick }: { onItemClick: () => void }) {
  const { data: session } = useSession();

  return (
    <div className="space-y-3">
      {/* User Info */}
      <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="w-12 h-12 rounded-full overflow-hidden relative bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={`${session?.user?.name || "User"}'s avatar`}
              width={48}
              height={48}
              className="rounded-full object-cover"
              sizes="48px"
            />
          ) : (
            <span className="text-white text-lg font-medium">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
            {session?.user?.name || "User"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {session?.user?.email}
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        <Link
          href="/user/profile"
          onClick={onItemClick}
          className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
        >
          Profile
        </Link>
        <Link
          href="/user/dashboard"
          onClick={onItemClick}
          className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
        >
          Dashboard
        </Link>
        <Link
          href="/user/orders"
          onClick={onItemClick}
          className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
        >
          My Orders
        </Link>
        <Link
          href="/user/settings"
          onClick={onItemClick}
          className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
        >
          Settings
        </Link>
        <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2">
            <Logout className="w-full justify-start p-0" />
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
      className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
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
        className={`flex justify-between items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
          isActive
            ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
            : "text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <span>{item.title}</span>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-200 ${
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
            className="overflow-hidden"
          >
            <div className="pl-4 pr-2 py-2 space-y-1">
              {item.children?.map((child) => (
                <Link
                  key={child.title}
                  href={child.href}
                  onClick={onItemClick}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 border-l-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
                >
                  <div className="flex items-center gap-3">
                    {child.icon && (
                      <span className="text-gray-400">{child.icon}</span>
                    )}
                    <span className="flex-1">{child.title}</span>
                    {child.badge && (
                      <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">
                        {child.badge}
                      </span>
                    )}
                  </div>
                  {child.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7">
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
