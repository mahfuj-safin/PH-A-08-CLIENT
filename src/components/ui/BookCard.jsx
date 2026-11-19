"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, BookCopy } from "lucide-react";

export default function BookCard({ book }) {
  const availableCopies = book.totalCopies ?? 0;
  const isAvailable = availableCopies > 0;

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group h-full flex flex-col bg-base-100 rounded-2xl border border-base-300 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Fixed 4:5 Cover Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-base-200">
        <Image
          src={book.image}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Subtle Dark Vignette on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 badge badge-sm bg-base-100/90 backdrop-blur-md text-base-content border-none font-semibold px-3 py-2.5 shadow-sm">
          {book.category}
        </span>

        {/* Live Copy Status Pill */}
        <span
          className={`absolute top-3 right-3 badge badge-sm border-none font-semibold px-2.5 py-2.5 shadow-sm gap-1 ${isAvailable
            ? "bg-emerald-600/90 text-white"
            : "bg-error/95 text-white"
            }`}
        >
          <BookCopy className="w-3 h-3" />
          {isAvailable ? `${availableCopies} left` : "Out"}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex-1 flex flex-col p-5">
        <h3 className="text-lg font-bold font-serif line-clamp-1 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-xs font-medium text-base-content/65 mt-0.5 line-clamp-1">
          by {book.author}
        </p>

        <p className="text-sm text-base-content/75 mt-3 line-clamp-2 leading-relaxed flex-1">
          {book.description}
        </p>

        {/* Action Footer */}
        <div className="pt-4 mt-4 border-t border-base-200">
          <Link
            href={`/books/${book._id}`}
            className="btn btn-primary btn-sm w-full rounded-xl justify-between px-4 group/btn"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}