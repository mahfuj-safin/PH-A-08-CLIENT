import Link from "next/link";
import { BookOpen, Home, Search } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center bg-base-100 border border-base-300 rounded-3xl shadow-sm p-8 sm:p-12 space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <span className="text-8xl font-serif font-bold text-primary/15 select-none">
            404
          </span>
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center absolute">
            <BookOpen className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">
            Missing Chapter
          </h1>
          <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
            The page you are looking for isn&apos;t on our shelves. It may have been moved or the link might be mistyped.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="btn btn-primary rounded-xl px-6 gap-2 w-full sm:w-auto">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/books"
            className="btn btn-outline border-base-300 rounded-xl px-6 gap-2 w-full sm:w-auto"
          >
            <Search className="w-4 h-4" />
            Browse All Books
          </Link>
        </div>
      </div>
    </section>
  );
}