"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
  ShoppingBag,
  LayoutDashboard,
  Search,
  Calendar,
  Zap,
  Package,
  Images,
  MapPin,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

const navLinks = [
  { href: "/events", label: "Events", icon: Calendar },
  { href: "#services", label: "Services", icon: Zap },
  { href: "#packages", label: "Packages", icon: Package },
  { href: "#gallery", label: "Gallery", icon: Images },
  { href: "/track", label: "Track Booking", icon: MapPin },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-card/95 backdrop-blur-md shadow-lg border-b border-border"
            : "bg-card/95 backdrop-blur-md shadow-lg border-b border-bordert"
        }`}
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between ">
            <Link href="/" className="flex items-center gap-2">
              <div className="gradient-primary p-2 rounded-xl">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-gradient">EventAura</span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium group"
                  >
                    <IconComponent className="h-4 w-4 transition-colors group-hover:text-primary" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <DarkModeToggle />
              {user ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUserMenu(!showUserMenu);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-foreground font-medium">
                      {user.name?.split(" ")[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <ShoppingBag className="h-4 w-4" />
                          My Orders
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        <hr className="my-2 border-border" />
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-muted transition-colors w-full"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="gradient-primary text-primary-foreground hover:opacity-90 shadow-lg"
                  >
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Sidebar - Outside Header for proper z-index */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />

            {/* Sidebar Menu */}
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-card border-l border-border shadow-2xl z-[101] overflow-y-auto"
            >
                <div className="p-6 flex flex-col h-full">
                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  {/* Logo Section */}
                  <div className="mb-8 pt-2">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                      <div className="gradient-primary p-2 rounded-xl">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold text-gradient">EventAura</span>
                    </Link>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex-1 space-y-2 overflow-y-auto">
                    <div className="px-2 space-y-1">
                      {navLinks.map((link) => {
                        const IconComponent = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 text-muted-foreground hover:text-primary hover:bg-primary/5 active:scale-95 group"
                          >
                            <IconComponent className="h-5 w-5 transition-colors group-hover:text-primary" />
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>

                    {user ? (
                      <div className="mt-6 pt-6 border-t border-border/50">
                        {/* Account Section */}
                        <div className="px-4 mb-4">
                          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            Account
                          </span>
                        </div>

                        <div className="px-2 space-y-1">
                          <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground transition-all hover:bg-accent group"
                          >
                            <div className="p-2 rounded-lg bg-background border border-border group-hover:border-primary/30 group-hover:text-primary transition-colors">
                              <User className="h-4 w-4" />
                            </div>
                            <span className="font-medium">Profile</span>
                          </Link>

                          <Link
                            href="/orders"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground transition-all hover:bg-accent group"
                          >
                            <div className="p-2 rounded-lg bg-background border border-border group-hover:border-primary/30 group-hover:text-primary transition-colors">
                              <ShoppingBag className="h-4 w-4" />
                            </div>
                            <span className="font-medium">My Orders</span>
                          </Link>

                          {user.role === "admin" && (
                            <Link
                              href="/admin"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-all group"
                            >
                              <div className="p-2 rounded-lg bg-primary text-primary-foreground shadow-sm">
                                <LayoutDashboard className="h-4 w-4" />
                              </div>
                              <span className="font-semibold">Admin Dashboard</span>
                            </Link>
                          )}

                          <button
                            onClick={() => {
                              logout();
                              setIsOpen(false);
                            }}
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 mt-4 rounded-xl border border-destructive/20 text-destructive font-semibold hover:bg-destructive/5 active:scale-[0.98] transition-all"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Auth Buttons */}
                  {!user && (
                    <div className="mt-auto pt-6 space-y-3 border-t border-border/50">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full h-12 rounded-xl border-2 hover:bg-accent transition-all font-semibold"
                      >
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full h-12 rounded-xl shadow-md shadow-primary/20 gradient-primary text-primary-foreground font-semibold active:scale-[0.98] transition-all"
                      >
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
    </>
  );
}
