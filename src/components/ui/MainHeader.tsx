// components/Header.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Laptop,
  Menu,
  X,
  ChevronDown,
  Search,
  Grid3X3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logout from "@/app/user/Logout";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCategories } from "@/hooks/useCategory";
import { Category } from "@/store/type/service-categories";

// Navigation item interface
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

// Base navigation items
const baseNavigationItems: NavigationItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Services",
    href: "/e",
    children: [
      {
        title: "All Services",
        href: "/e/errand-services",
        description: "Browse all available services",
        icon: <Grid3X3 className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "How It Works",
    href: "/how-it-works",
    children: [
      {
        title: "Getting Started",
        href: "/how-it-works",
        description: "Learn how our platform works",
      },
    ],
  },
  {
    title: "About",
    href: "/about-us",
    children: [
      {
        title: "Our Story",
        href: "/about-us/story",
        description: "Learn about our journey",
      },
      {
        title: "Team",
        href: "/about-us/team",
        description: "Meet our amazing team",
      },

      {
        title: "Contact",
        href: "/about-us/our-contacts",
        description: "Get in touch with us",
      },
    ],
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const userSession = session?.user?.id;
  const pathname = usePathname();

  // Categories hook
  const { categories, getCategoriesWithCounts } = useCategories();

  // Enhanced navigation items with categories
  const navigationItems = useMemo(() => {
    const items = [...baseNavigationItems];

    // Find the Services item and enhance it
    const servicesIndex = items.findIndex((item) => item.title === "Services");

    if (servicesIndex !== -1 && categories.length > 0) {
      // Create category navigation items
      const categoryChildren: NavigationChild[] = categories
        .filter(
          (category) =>
            category.categoryName &&
            category.serviceCount &&
            category.serviceCount > 0
        )
        .map((category: Category) => ({
          title: category.categoryName,
          href: `/e/errand-services/categories/${encodeURIComponent(
            category.categoryName.toLowerCase().replace(/\s+/g, "-")
          )}`,
          description:
            category.description || `Explore ${category.categoryName} services`,
          badge: category.serviceCount ? `${category.serviceCount}` : undefined,
        }));

      // Update services navigation with categories
      items[servicesIndex].children = [
        {
          title: "All Services",
          href: "/e/errand-services",
          description: "Browse all available services",
          icon: <Grid3X3 className="h-4 w-4" />,
        },
        ...categoryChildren,
      ];
    }

    return items;
  }, [categories]);

  // Fetch categories on mount
  useEffect(() => {
    getCategoriesWithCounts();
  }, [getCategoriesWithCounts]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname?.startsWith(path);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/e/errand-services?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50"
          : "bg-white dark:bg-gray-900 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EM</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text dark:from-blue-400 dark:to-cyan-300">
                  Errands Mate
                </span>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 rounded-full border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </form>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-1">
            {navigationItems.map((item) =>
              item.children ? (
                <NavDropdown
                  key={item.title}
                  item={item}
                  isActive={isActive(item.href)}
                />
              ) : (
                <NavLink
                  key={item.title}
                  href={item.href}
                  isActive={isActive(item.href)}
                >
                  {item.title}
                </NavLink>
              )
            )}
          </nav>

          {/* Auth Buttons and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            {!userSession ? (
              <>
                <Link
                  href="/user/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/user/register"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <UserMenu />
            )}

            <ThemeSwitcher />
          </div>

          {/* Mobile menu button */}
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
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border-gray-200 dark:border-gray-700"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </form>
        </div>
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
              {navigationItems.map((item) =>
                item.children ? (
                  <MobileNavDropdown
                    key={item.title}
                    item={item}
                    isActive={isActive(item.href)}
                    onItemClick={() => setMobileMenuOpen(false)}
                  />
                ) : (
                  <MobileNavLink
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    isActive={isActive(item.href)}
                  >
                    {item.title}
                  </MobileNavLink>
                )
              )}

              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                {!userSession ? (
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/user/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2 px-4 text-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-md border border-gray-200 dark:border-gray-700 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/user/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2 px-4 text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-md transition-all hover:from-blue-700 hover:to-cyan-600"
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  <div className="pt-2">
                    <Logout />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Theme Switcher Component
function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer"
        >
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// User Menu Component
function UserMenu() {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full border-gray-200 dark:border-gray-700 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <span className="hidden sm:inline">
            {session?.user?.name || "Account"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {session?.user?.name || "User"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {session?.user?.email}
          </p>
        </div>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/user/profile" className="flex w-full">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user/dashboard" className="flex w-full">
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user/orders" className="flex w-full">
              My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user/settings" className="flex w-full">
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Logout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Enhanced Desktop Nav Link
function NavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 font-medium transition-all duration-200 group rounded-md ${
        isActive
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950"
          : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 ${
          isActive ? "w-3/4" : "group-hover:w-3/4"
        }`}
      />
    </Link>
  );
}

// Enhanced Desktop Nav Dropdown
function NavDropdown({
  item,
  isActive,
}: {
  item: NavigationItem;
  isActive: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`relative px-4 py-2 font-medium transition-all duration-200 group flex items-center gap-1 rounded-md ${
            isActive
              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950"
              : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {item.title}
          <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
          <span
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 ${
              isActive ? "w-3/4" : "group-hover:w-3/4"
            }`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-900"
        align="center"
        sideOffset={8}
      >
        <div className="grid gap-2">
          {item.children?.map((child) => (
            <Link
              key={child.title}
              href={child.href}
              className="flex items-start p-3 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            >
              {child.icon && (
                <div className="mr-3 mt-0.5 text-gray-400 group-hover:text-blue-500">
                  {child.icon}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {child.title}
                  </span>
                  {child.badge && (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">
                      {child.badge}
                    </span>
                  )}
                </div>
                {child.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {child.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Mobile Nav Link
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

// Mobile Nav Dropdown
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
