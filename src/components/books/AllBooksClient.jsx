"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, BookOpen } from "lucide-react";
import { publicFetch } from "@/lib/api";
import BookCard from "@/components/ui/BookCard";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";

const CATEGORIES = ["All", "Fiction", "Science", "History", "Kids", "Others"];

function AllBooksContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    CATEGORIES.includes(initialCategory) ? initialCategory : "All"
  );

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "All") params.append("category", selectedCategory);
        if (searchQuery.trim()) params.append("search", searchQuery.trim());

        const queryString = params.toString();
        const data = await publicFetch(`/books${queryString ? `?${queryString}` : ""}`);
        if (active) setBooks(data);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <FadeUp className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Library Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif mt-1">
          All Books
        </h1>
        <p className="text-sm sm:text-base text-base-content/70 mt-2 max-w-2xl">
          Browse every title in BookNook. Search by book name or author, or filter by category.
        </p>
      </FadeUp>

      {/* Search & Category Filter Bar */}
      <div className="bg-base-200/70 border border-base-300 rounded-2xl p-4 mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or author..."
            className="input input-bordered w-full pl-10 rounded-xl bg-base-100 focus:input-primary"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-base-content/60 flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Genre:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm rounded-xl ${selectedCategory === cat
                ? "btn-primary"
                : "btn-ghost bg-base-100 border border-base-300"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid (3 cards per row on desktop) */}
      {loading ? (
        <div className="min-h-[320px] flex flex-col items-center justify-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm text-base-content/60">Loading library catalog...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-base-200/60 border border-dashed border-base-300 rounded-2xl p-14 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-serif">No matching books found</h3>
          <p className="text-sm text-base-content/70 max-w-md mx-auto">
            Try clearing your search or switching back to All categories.
          </p>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="btn btn-primary btn-sm rounded-xl mt-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs font-medium text-base-content/60 mb-5">
            Showing {books.length} {books.length === 1 ? "book" : "books"}
          </p>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <StaggerItem key={book._id}>
                <BookCard book={book} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </>
      )}
    </section>
  );
}

export default function AllBooksClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      }
    >
      <AllBooksContent />
    </Suspense>
  );
}