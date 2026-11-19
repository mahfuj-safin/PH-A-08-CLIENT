"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BookOpen, Sun, Moon, Menu, X, User, LogOut } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { clearAuthToken } from "@/lib/api";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [theme, setTheme] = useState("booknook-light");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("booknook-theme") || "booknook-light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const nextTheme =
      theme === "booknook-light" ? "booknook-dark" : "booknook-light";
    setTheme(nextTheme);
    localStorage.setItem("booknook-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleLogout = async () => {
    try {
      clearAuthToken();
      await signOut();
      toast.success("Logged out successfully");
      setMobileOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to logout");
    }
  };

  const user = session?.user;

  // Private links ONLY appear when logged in (Assignment rule)
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "All Books" },
    ...(user
      ? [
        { href: "/add-book", label: "Add Book" },
        { href: "/my-books", label: "My Books" },
        { href: "/my-borrows", label: "My Borrows" },
      ]
      : []),
  ];

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const avatarSrc =
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "Reader"
    )}&background=0f4c3a&color=fff`;

  return (
    <header className="sticky top-0 z-50 bg-base-100/85 backdrop-blur-lg border-b border-base-300/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Left: Consistent Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-content flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight font-serif">
              Book<span className="text-primary">Nook</span>
            </span>
          </Link>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${isActive(link.href)
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-base-content/75 hover:text-base-content hover:bg-base-200"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Theme Toggle + Auth Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark or light theme"
              className="btn btn-ghost btn-circle btn-sm"
            >
              {theme === "booknook-light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-secondary" />
              )}
            </button>

            {isPending ? (
              <span className="loading loading-spinner loading-sm text-primary"></span>
            ) : user ? (
              /* Logged-in Avatar Dropdown */
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar ring-2 ring-primary/30 hover:ring-primary transition-all"
                  title={user.name}
                >
                  <div className="w-9 rounded-full overflow-hidden">
                    <img src={avatarSrc} alt={user.name || "User"} />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 border border-base-300 rounded-2xl z-50 w-56 p-2 shadow-xl mt-3"
                >
                  <li className="px-3 py-2 border-b border-base-200 mb-1 pointer-events-none">
                    <div className="flex flex-col items-start gap-0.5 p-0">
                      <span className="font-semibold text-sm text-base-content truncate w-full">
                        {user.name}
                      </span>
                      <span className="text-xs text-base-content/60 truncate w-full">
                        {user.email}
                      </span>
                    </div>
                  </li>
                  <li>
                    <Link href="/profile" className="rounded-xl gap-2.5">
                      <User className="w-4 h-4 text-primary" />
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-xl gap-2.5 text-error hover:bg-error/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              /* Guest Login & Register Buttons */
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login" className="btn btn-ghost btn-sm rounded-xl">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm rounded-xl">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn btn-ghost btn-circle btn-sm md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-base-200 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${isActive(link.href)
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-base-content/80 hover:bg-base-200"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {!user && !isPending && (
              <div className="flex gap-2 pt-3 px-1">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-outline btn-sm flex-1 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-primary btn-sm flex-1 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}