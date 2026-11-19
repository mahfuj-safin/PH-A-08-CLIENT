"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { RotateCcw, BookOpen, CalendarDays, CheckCircle2 } from "lucide-react";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { authFetch } from "@/lib/api";
import { FadeUp } from "@/components/ui/MotionPrimitives";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function MyBorrowsContent() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Custom Return Confirm Modal state
  const [returningRecord, setReturningRecord] = useState(null);
  const [returningLoading, setReturningLoading] = useState(false);

  const fetchBorrows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authFetch("/borrows");
      setBorrows(data);
    } catch (err) {
      toast.error(err.message || "Failed to load borrowed books");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);

  const handleConfirmReturn = async () => {
    if (!returningRecord) return;

    setReturningLoading(true);
    try {
      await authFetch(`/borrows/${returningRecord._id}`, {
        method: "DELETE",
      });

      setBorrows((prev) => prev.filter((item) => item._id !== returningRecord._id));
      toast.success(`Returned "${returningRecord.bookTitle}". Copy restored to library!`);
      setReturningRecord(null);
    } catch (err) {
      toast.error(err.message || "Failed to return book");
    } finally {
      setReturningLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Personal Reading Shelf
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif mt-1">
            My Borrows
          </h1>
          <p className="text-sm sm:text-base text-base-content/70 mt-2">
            Track the books you currently hold and return them with one click when finished.
          </p>
        </div>

        <Link
          href="/books"
          className="btn btn-outline btn-primary rounded-xl gap-2 self-start sm:self-auto"
        >
          <BookOpen className="w-4 h-4" />
          Browse More Books
        </Link>
      </FadeUp>

      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm text-base-content/60">Loading your borrowed books...</p>
        </div>
      ) : borrows.length === 0 ? (
        <div className="bg-base-200/70 border border-dashed border-base-300 rounded-2xl p-14 text-center space-y-4">
          <h3 className="text-xl font-bold font-serif">Your Reading Shelf Is Empty</h3>
          <p className="text-sm text-base-content/70 max-w-md mx-auto">
            You haven&apos;t borrowed any books yet. Explore the catalog and borrow your next read!
          </p>
          <Link href="/books" className="btn btn-primary rounded-xl gap-2">
            <BookOpen className="w-4 h-4" />
            Explore All Books
          </Link>
        </div>
      ) : (
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200/80 text-base-content/80">
                <tr>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Return Date</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((item) => (
                  <tr key={item._id} className="hover:bg-base-200/40 transition-colors">
                    <td>
                      <div className="flex items-center gap-3.5">
                        <Image
                          src={item.bookImage}
                          alt={item.bookTitle}
                          width={48}
                          height={64}
                          unoptimized
                          className="w-12 h-16 rounded-lg object-cover border border-base-300 shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/books/${item.bookId}`}
                            className="font-bold text-sm sm:text-base hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.bookTitle}
                          </Link>
                          {item.bookAuthor && (
                            <p className="text-xs text-base-content/65 line-clamp-1">
                              by {item.bookAuthor}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-base-content/80">
                        <CalendarDays className="w-3.5 h-3.5 text-primary" />
                        {formatDate(item.borrowDate)}
                      </span>
                    </td>
                    <td className="text-sm whitespace-nowrap">
                      <span className="badge badge-secondary badge-soft font-medium">
                        {formatDate(item.returnDate)}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => setReturningRecord(item)}
                        className="btn btn-primary btn-sm rounded-xl gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Return Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CUSTOM RETURN CONFIRMATION MODAL */}
      {returningRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Return This Book?</h3>
                <p className="text-sm text-base-content/70 mt-1">
                  Confirm returning{" "}
                  <span className="font-semibold text-base-content">
                    &ldquo;{returningRecord.bookTitle}&rdquo;
                  </span>
                  . Its available copy count will immediately increase by 1.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={returningLoading}
                onClick={() => setReturningRecord(null)}
                className="btn btn-ghost btn-sm rounded-xl"
              >
                Keep Reading
              </button>
              <button
                type="button"
                disabled={returningLoading}
                onClick={handleConfirmReturn}
                className="btn btn-primary btn-sm rounded-xl px-5 gap-1.5"
              >
                {returningLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Return
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function MyBorrowsClient() {
  return (
    <PrivateRoute>
      <MyBorrowsContent />
    </PrivateRoute>
  );
}