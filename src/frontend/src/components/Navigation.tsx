import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import {
  Crown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShoppingCart,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCart, useIsAdmin } from "../hooks/useQueries";
import ShareWebsite from "./ShareWebsite";

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: cartItems } = useCart();
  const { data: isAdmin } = useIsAdmin();
  const { identity, login, clear } = useInternetIdentity();

  const cartCount =
    cartItems?.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b border-border"
      style={{
        background: "oklch(0.10 0.04 295 / 0.95)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <Crown
            className="h-7 w-7 text-gold"
            style={{ color: "oklch(0.82 0.16 75)" }}
          />
          <span
            className="font-serif text-2xl font-bold text-gold-light"
            style={{ color: "oklch(0.9 0.12 80)" }}
          >
            DS Trending
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium tracking-widest uppercase transition-colors hover:text-primary"
              style={{ color: "oklch(0.85 0.05 80)" }}
              activeProps={{ style: { color: "oklch(0.82 0.16 75)" } }}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-sm font-bold tracking-widest uppercase transition-colors"
              style={{ color: "oklch(0.82 0.16 75)" }}
              activeProps={{ style: { color: "oklch(0.95 0.18 75)" } }}
              data-ocid="nav.link"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Share button (desktop) */}
          <div className="hidden md:block">
            <ShareWebsite variant="icon" />
          </div>

          {/* Sign In / Sign Out button */}
          {identity ? (
            <button
              type="button"
              onClick={() => clear()}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide uppercase border transition-colors hover:bg-secondary"
              style={{
                borderColor: "oklch(0.82 0.16 75 / 0.5)",
                color: "oklch(0.82 0.16 75)",
              }}
              data-ocid="nav.toggle"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => login()}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold tracking-wide uppercase transition-opacity hover:opacity-90"
              style={{
                background: "oklch(0.78 0.14 75)",
                color: "oklch(0.12 0.04 295)",
              }}
              data-ocid="nav.toggle"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
          )}

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full transition-colors hover:bg-secondary"
            data-ocid="nav.link"
          >
            <ShoppingCart
              className="h-6 w-6"
              style={{ color: "oklch(0.85 0.05 80)" }}
            />
            {cartCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold rounded-full"
                style={{
                  background: "oklch(0.82 0.16 75)",
                  color: "oklch(0.12 0.04 295)",
                  border: "none",
                }}
              >
                {cartCount}
              </Badge>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-border"
            style={{ background: "oklch(0.12 0.045 295)" }}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-base font-medium tracking-widest uppercase py-2 transition-colors"
                  style={{ color: "oklch(0.85 0.05 80)" }}
                  activeProps={{ style: { color: "oklch(0.82 0.16 75)" } }}
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.link"
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-base font-bold tracking-widest uppercase py-2"
                  style={{ color: "oklch(0.82 0.16 75)" }}
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.link"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Admin Dashboard
                </Link>
              )}

              {/* Mobile Share button */}
              <div
                className="pt-1 border-t"
                style={{ borderColor: "oklch(0.28 0.07 295)" }}
              >
                <ShareWebsite variant="full" />
              </div>

              {/* Mobile Sign In / Sign Out */}
              <div
                className="border-t"
                style={{ borderColor: "oklch(0.28 0.07 295)" }}
              >
                {identity ? (
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 text-base font-semibold tracking-widest uppercase py-2 w-full transition-colors"
                    style={{ color: "oklch(0.82 0.16 75)" }}
                    data-ocid="nav.toggle"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 text-base font-bold tracking-widest uppercase py-2 px-4 rounded-lg w-full transition-opacity hover:opacity-90"
                    style={{
                      background: "oklch(0.78 0.14 75)",
                      color: "oklch(0.12 0.04 295)",
                    }}
                    data-ocid="nav.toggle"
                  >
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
