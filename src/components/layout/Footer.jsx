import Link from "next/link";
import { BookOpen, Mail, MapPin, Phone, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-content flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight font-serif">
                Book<span className="text-primary">Nook</span>
              </span>
            </Link>
            <p className="text-sm text-base-content/70 leading-relaxed">
              A quiet community library built for curious readers. Add your favorite
              titles, borrow books effortlessly, and keep stories circulating.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-base-content/75">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-primary transition-colors">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/add-book" className="hover:text-primary transition-colors">
                  Share a Book
                </Link>
              </li>
              <li>
                <Link href="/my-borrows" className="hover:text-primary transition-colors">
                  My Borrowed Shelf
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-base mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-base-content/75">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>hello@booknook.library</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>

          {/* Social Links (with NEW X logo — no old Twitter bird) */}
          <div>
            <h4 className="font-semibold text-base mb-4">Connect</h4>
            <p className="text-sm text-base-content/70 mb-4">
              Follow weekly reading picks and new library arrivals.
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow BookNook on X"
                className="btn btn-sm btn-circle bg-base-100 border border-base-300 hover:bg-primary hover:text-primary-content hover:border-primary"
              >
                {/* Official New X Logo */}
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="BookNook on GitHub"
                className="btn btn-sm btn-circle bg-base-100 border border-base-300 hover:bg-primary hover:text-primary-content hover:border-primary"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="BookNook on LinkedIn"
                className="btn btn-sm btn-circle bg-base-100 border border-base-300 hover:bg-primary hover:text-primary-content hover:border-primary"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-base-300 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-base-content/60">
          <p>© {new Date().getFullYear()} BookNook Library. All rights reserved.</p>
          <p>Built for readers who love sharing great stories.</p>
        </div>
      </div>
    </footer>
  );
}