"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookCopy } from "lucide-react";
import Image from "next/image";

export default function BookCard({ book }) {
  const isAvailable = (book.totalCopies ?? 1) > 0;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group bg-base-100 border border-base-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col h-full"
    >
      {/* Fixed 4:5 image container so all cards have identical image height */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-base-200">
        <Image
          src={book.image}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge */}
        <span className="badge badge-primary badge-sm font-medium absolute top-3 left-3 shadow-md px-3 py-2.5">
          {book.category}
        </span>

        {/* Copies Availability Pill */}
        <span
          className={`badge badge-sm font-medium absolute top-3 right-3 shadow-md px-2.5 py-2.5 gap-1 ${isAvailable ? "bg-base-100/90 text-base-content" : "badge-error text-white"
            }`}
        >
          <BookCopy className="w-3 h-3" />
          {isAvailable ? `${book.totalCopies} left` : "Out"}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-base-content/70 mt-1 line-clamp-1">
          by {book.author}
        </p>

        <div className="mt-auto pt-5">
          <Link
            href={`/books/${book._id}`}
            className="btn btn-primary btn-sm w-full rounded-xl gap-2"
          >
            View Details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}