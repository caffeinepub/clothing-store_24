import { Link } from "@tanstack/react-router";
import { Crown, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border pt-12 pb-8"
      style={{ background: "oklch(0.09 0.04 295)" }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Crown
                className="h-7 w-7"
                style={{ color: "oklch(0.82 0.16 75)" }}
              />
              <span
                className="font-serif text-2xl font-bold"
                style={{ color: "oklch(0.9 0.12 80)" }}
              >
                DS Trending Store
              </span>
            </div>
            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: "oklch(0.6 0.04 80)" }}
            >
              Luxury fashion for the royally inclined. Every piece is crafted to
              make you feel like the royalty you are.
            </p>
            <a
              href="https://instagram.com/ds.trending"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 transition-colors hover:text-primary"
              style={{ color: "oklch(0.82 0.16 75)" }}
            >
              <Instagram className="h-5 w-5" />
              <span className="text-sm font-medium">@ds.trending</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-serif text-sm font-semibold tracking-widest uppercase mb-4"
              style={{ color: "oklch(0.82 0.16 75)" }}
            >
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/shop", label: "Shop" },
                { to: "/about", label: "About Us" },
                { to: "/cart", label: "Cart" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors hover:text-primary"
                    style={{ color: "oklch(0.65 0.04 80)" }}
                    data-ocid="nav.link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4
              className="font-serif text-sm font-semibold tracking-widest uppercase mb-4"
              style={{ color: "oklch(0.82 0.16 75)" }}
            >
              Categories
            </h4>
            <ul className="space-y-3">
              {["Tops", "Bottoms", "Dresses", "Accessories"].map((cat) => (
                <li key={cat}>
                  <Link
                    to="/shop"
                    className="text-sm transition-colors hover:text-primary"
                    style={{ color: "oklch(0.65 0.04 80)" }}
                    data-ocid="nav.link"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "oklch(0.5 0.03 80)" }}>
            © {currentYear} DS Trending Store. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
              style={{ color: "oklch(0.6 0.05 80)" }}
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs" style={{ color: "oklch(0.5 0.03 80)" }}>
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
