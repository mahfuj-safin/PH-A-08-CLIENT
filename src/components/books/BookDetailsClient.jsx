"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  BookCopy,
  BookMarked,
  Calendar,
  Mail,
  Tag,
  User,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/api";
import { FadeUp } from "@/components/ui/MotionPrimitives";

function getDefaultReturnDate() {
  const date = new Date();
  date.setDate(date.getDate() + 14); // Default 14 days borrowing window
  return date.toISOString().split("T")[0];
}

function getMinReturnDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function BookDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Borrow Modal State
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [returnDate, setReturnDate] = useState(getDefaultReturnDate());
  const [borrowing, setBorrowing] = useState(false);

  const loadBook = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await authFetch(`/books/${id}`);
      setBook(data);
    } catch (err) {
      setErrorMsg(err.message || "Could not load book details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  const handleConfirmBorrow = async (e) => {
    e.preventDefault();
    if (!book) return;

    setBorrowing(true);
    try {
      await authFetch("/borrows", {
        method: "POST",
        body: JSON.stringify({
          bookId: book._id,
          returnDate,
        }),
      });

      // Decrease copy count immediately in UI to match MongoDB $inc: -1
      setBook((prev) => ({
        ...prev,
        totalCopies: Math.max(0, (prev.totalCopies ?? 1) - 1),
      }));

      setBorrowModalOpen(false);
      toast.success(`You borrowed "${book.title}"! View it in My Borrows.`);
    } catch (err) {
      // Catches No Double Borrow (409) & Out of Stock (400) cleanly
      toast.error(err.message || "Failed to borrow this book.");
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center gap-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-base-content/60">Loading book details...</p>
      </div>
    );
  }

  if (errorMsg || !book) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold font-serif">Book Not Found</h1>
        <p className="text-sm text-base-content/70">
          {errorMsg || "This book may have been removed from the library."}
        </p>
        <Link href="/books" className="btn btn-primary rounded-xl gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to All Books
        </Link>
      </section>
    );
  }

  const availableCopies = book.totalCopies ?? 0;
  const isAvailable = availableCopies > 0;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back navigation */}
      <button
        type="button"
        onClick={() => router.back()}
        className="btn btn-ghost btn-sm rounded-xl gap-1.5 mb-8 text-base-content/75 hover:text-base-content"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <FadeUp className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Cover Image */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-xl border border-base-300 bg-base-200">
            <Image
              src={book.image}
              alt={book.title}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              unoptimized
              className="object-cover"
            />
          </div>
        </div>

        {/* Right: Book Metadata & Borrow Action */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="badge badge-primary font-semibold px-3.5 py-3 gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {book.category}
            </span>

            <span
              className={`badge font-semibold px-3.5 py-3 gap-1.5 ${isAvailable ? "badge-success badge-soft" : "badge-error text-white"
                }`}
            >
              <BookCopy className="w-3.5 h-3.5" />
              {isAvailable
                ? `${availableCopies} ${availableCopies === 1 ? "copy" : "copies"} available`
                : "Not Available"}
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight">
              {book.title}
            </h1>
            <p className="text-lg text-base-content/75 mt-2 font-medium">
              by <span className="text-base-content font-semibold">{book.author}</span>
            </p>
          </div>

          <div className="divider my-2" />

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/60">
              About This Book
            </h2>
            <p className="text-base text-base-content/85 leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </div>

          {/* Contributor Card */}
          <div className="bg-base-200/70 border border-base-300 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-base-content/60">Added By</p>
                <p className="text-sm font-semibold truncate">
                  {book.userName || "Community Reader"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-base-content/60">Contributor Email</p>
                <p className="text-sm font-semibold truncate">{book.userEmail}</p>
              </div>
            </div>
          </div>

          {/* Borrow Action */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              disabled={!isAvailable}
              onClick={() => setBorrowModalOpen(true)}
              className={`btn btn-lg rounded-2xl px-8 gap-2.5 ${isAvailable ? "btn-primary shadow-lg" : "btn-disabled"
                }`}
            >
              <BookMarked className="w-5 h-5" />
              {isAvailable ? "Borrow This Book" : "Not Available"}
            </button>

            <Link
              href="/my-borrows"
              className="btn btn-outline btn-lg rounded-2xl border-base-300"
            >
              View My Borrows
            </Link>
          </div>
        </div>
      </FadeUp>

      {/* BORROW CONFIRMATION MODAL */}
      {borrowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-serif">Borrow Book</h2>
              <button
                type="button"
                onClick={() => setBorrowModalOpen(false)}
                className="btn btn-ghost btn-circle btn-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-base-content/70 mb-5">
              You are borrowing{" "}
              <span className="font-semibold text-base-content">
                &ldquo;{book.title}&rdquo;
              </span>
              . Confirm your details below.
            </p>

            <form onSubmit={handleConfirmBorrow} className="space-y-4">
              {/* Read-only User Name */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-xs font-semibold">Borrower Name</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={user?.name || ""}
                  className="input input-bordered input-sm w-full rounded-xl bg-base-200 cursor-not-allowed text-base-content/75"
                />
              </div>

              {/* Read-only User Email */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-xs font-semibold">Borrower Email</span>
                </label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="input input-bordered input-sm w-full rounded-xl bg-base-200 cursor-not-allowed text-base-content/75"
                />
              </div>

              {/* Return Date Picker */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-xs font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Expected Return Date
                  </span>
                </label>
                <input
                  type="date"
                  required
                  min={getMinReturnDate()}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="input input-bordered input-sm w-full rounded-xl focus:input-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  disabled={borrowing}
                  onClick={() => setBorrowModalOpen(false)}
                  className="btn btn-ghost btn-sm rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={borrowing}
                  className="btn btn-primary btn-sm rounded-xl px-6 gap-1.5"
                >
                  {borrowing ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Borrow
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default function BookDetailsClient() {
  return (
    <PrivateRoute>
      <BookDetailsContent />
    </PrivateRoute>
  );
}