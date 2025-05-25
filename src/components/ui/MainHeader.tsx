// components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Laptop, Menu, X, ChevronDown } from "lucide-react";
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
import Logout from "@/app/user/Logout";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store"; // Adjust import path as needed
// import { fetchCategories } from "@/store/category-redux-slice";

// Define base navigation structure (non-dynamic items)
const baseNavigationItems = [
  {
    title: "Home",
    href: "/",
  },
  // Services will be fetched dynamically
  {
    title: "Services",
    href: "/guest/kayaye-services",
    children: [
      // This will be populated dynamically
      { title: "All Services", href: "/guest/kayaye-services" },
    ],
  },
  {
    title: "How It Works",
    href: "/guest/how-it-works",
    children: [{ title: "Visit Page", href: "/guest/how-it-works" }],
  },
  {
    title: "About",
    href: "/about-kayaye",
    children: [
      { title: "Our Story", href: "/about-kayaye/story" },
      { title: "Team", href: "/about-kayaye/team" },
      { title: "Careers", href: "/about-kayaye/careers" },
      { title: "Contact", href: "/about-kayaye/contact" },
    ],
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const userSession = session?.user?.id;
  const pathname = usePathname();
  const [navigationItems, setNavigationItems] = useState(baseNavigationItems);

  // Redux setup
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);

  // Fetch categories on component mount
  useEffect(() => {
    // dispatch(fetchCategories());
  }, [dispatch]);

  // Update navigation items when categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      const updatedNavItems = [...baseNavigationItems];

      // Find the Services item
      const servicesIndex = updatedNavItems.findIndex(
        (item) => item.title === "Services"
      );

      if (servicesIndex !== -1) {
        // Create service category links
        const serviceLinks = categories.map((category) => ({
          title: category.name,
          href: `/guest/kayaye-services/${encodeURIComponent(
            category.name.toLowerCase().replace(/\s+/g, "-")
          )}`,
        }));

        // Add "All Services" as the last item
        updatedNavItems[servicesIndex].children = [
          ...serviceLinks,
          { title: "All Services", href: "/guest/kayaye-services" },
        ];
      }

      setNavigationItems(updatedNavItems);
    }
  }, [categories]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if a path is active (exact match or starts with for parent routes)
  const isActive = (path: string) => {
    return pathname === path || (path !== "/" && pathname?.startsWith(path));
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg"
          : "bg-white dark:bg-gray-900"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text dark:from-blue-400 dark:to-cyan-300">
                  Errands Mate
                </span>
              </Link>
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
                  isActive={isActive(item.href)}>
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
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/user/register"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg">
                  Get Started
                </Link>
              </>
            ) : (
              <UserMenu />
            )}

            {/* Theme Switcher */}
            <ThemeSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Button */}
            <ThemeSwitcher />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300">
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
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
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="px-4 py-5 space-y-1">
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
                    isActive={isActive(item.href)}>
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
                      className="w-full py-2 px-4 text-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-md border border-gray-200 dark:border-gray-700">
                      Sign In
                    </Link>
                    <Link
                      href="/user/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2 px-4 text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-md">
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
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-gray-200 dark:border-gray-700">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer">
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer">
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer">
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// User Menu Component with Dropdown
function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <span>My Account</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
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

// Desktop Nav Link component with hover effects
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
      className={`relative px-3 py-2 font-medium transition-colors group ${
        isActive
          ? "text-blue-600 dark:text-blue-400"
          : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
      }`}>
      {children}
      <span
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-transform duration-300 origin-left ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}></span>
    </Link>
  );
}

// Desktop Nav Dropdown component
function NavDropdown({
  item,
  isActive,
}: {
  item: {
    title: string;
    href: string;
    children: { title: string; href: string }[];
  };
  isActive: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`relative px-3 py-2 font-medium transition-colors group flex items-center gap-1 capitalize ${
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          }`}>
          {item.title}
          <ChevronDown className="h-4 w-4" />
          <span
            className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-transform duration-300 origin-left ${
              isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
            }`}></span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
        align="center"
        sideOffset={8}>
        <div className="grid gap-1">
          {item.children.map((child) => (
            <Link
              key={child.title}
              href={child.href}
              className="flex items-center p-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors capitalize">
              {child.title}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Mobile Nav Link component with hover effects
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
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        isActive
          ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
          : "text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
      } transition-colors`}>
      {children}
    </Link>
  );
}

// Mobile Nav Dropdown component
function MobileNavDropdown({
  item,
  isActive,
  onItemClick,
}: {
  item: {
    title: string;
    href: string;
    children: { title: string; href: string }[];
  };
  isActive: boolean;
  onItemClick?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex justify-between items-center w-full px-3 py-2 rounded-md text-base font-medium capitalize ${
          isActive
            ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
            : "text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        } transition-colors`}>
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
            className="pl-4">
            <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-2 space-y-1 py-1">
              {item.children.map((child) => (
                <Link
                  key={child.title}
                  href={child.href}
                  onClick={onItemClick}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {child.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
