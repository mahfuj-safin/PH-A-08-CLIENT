"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookPlus } from "lucide-react";
import { publicFetch } from "@/lib/api";
import BookCard from "@/components/ui/BookCard";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";

export default function NewArrivals() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadLatestBooks() {
      try {
        const data = await publicFetch("/books?limit=6");
        if (active) setBooks(data);
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadLatestBooks();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Fresh on the Shelf
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif mt-1">
            New Arrivals
          </h2>
          <p className="text-sm sm:text-base text-base-content/70 mt-2 max-w-xl">
            Explore the latest additions contributed by our community members.
          </p>
        </div>

        <Link
          href="/books"
          className="btn btn-outline btn-primary btn-sm rounded-xl gap-2 self-start sm:self-auto"
        >
          See All Books
          <ArrowRight className="w-4 h-4" />
        </Link>
      </FadeUp>

      {loading ? (
        <div className="min-h-[260px] flex flex-col items-center justify-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm text-base-content/60">Loading newest arrivals...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-base-200/70 border border-dashed border-base-300 rounded-2xl p-12 text-center space-y-4">
          <h3 className="text-xl font-bold font-serif">The Shelf Is Ready for Its First Book</h3>
          <p className="text-sm text-base-content/70 max-w-md mx-auto">
            No books have been added yet. Be the first reader to add a title to BookNook!
          </p>
          <Link href="/add-book" className="btn btn-primary rounded-xl gap-2">
            <BookPlus className="w-4 h-4" />
            Add First Book
          </Link>
        </div>
      ) : (
        <>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <StaggerItem key={book._id}>
                <BookCard book={book} />
              </StaggerItem>
            ))}
          </StaggerGrid>

          <div className="mt-12 text-center">
            <Link href="/books" className="btn btn-primary rounded-xl px-8 gap-2">
              See All Books
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}