"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  BookMarked,
  RotateCcw,
  Feather,
  Atom,
  Landmark,
  Smile,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover & Choose",
    description:
      "Browse all community-added books by title, author, or category and check live copy availability.",
  },
  {
    number: "02",
    icon: BookMarked,
    title: "Borrow in One Click",
    description:
      "Open any available book, confirm your return date in a quick modal, and add it to your personal shelf.",
  },
  {
    number: "03",
    icon: RotateCcw,
    title: "Read & Return Easily",
    description:
      "Track due dates from My Borrows and return books with one click so the next reader can enjoy them.",
  },
];

const categories = [
  {
    name: "Fiction",
    tagline: "Novels, literary classics & storytelling",
    icon: Feather,
  },
  {
    name: "Science",
    tagline: "Physics, technology, space & discovery",
    icon: Atom,
  },
  {
    name: "History",
    tagline: "Civilizations, biographies & archives",
    icon: Landmark,
  },
  {
    name: "Kids",
    tagline: "Illustrated adventures & young readers",
    icon: Smile,
  },
  {
    name: "Others",
    tagline: "Self-growth, essays, art & more",
    icon: Layers,
  },
];

export default function ExtraSections() {
  return (
    <>
      {/* Extra Static Section 1: How Borrowing Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <FadeUp className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Simple Library Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif mt-1">
            How Borrowing Works
          </h2>
          <p className="text-sm sm:text-base text-base-content/70 mt-2">
            Add a book, borrow a book, return a book—built to stay effortless from day one.
          </p>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <StaggerItem key={step.number}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="h-full bg-base-200/70 border border-base-300 rounded-2xl p-7 flex flex-col relative overflow-hidden"
                >
                  <span className="text-5xl font-serif font-bold text-primary/10 absolute top-4 right-5 select-none">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-base-content/70 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </section>

      {/* Extra Static Section 2: Top Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Curated Genres
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif mt-1">
              Explore Top Categories
            </h2>
            <p className="text-sm sm:text-base text-base-content/70 mt-2">
              Jump straight into the subject that sparks your curiosity today.
            </p>
          </div>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <StaggerItem key={cat.name}>
                <Link
                  href={`/books?category=${encodeURIComponent(cat.name)}`}
                  className="group h-full bg-base-100 border border-base-300 hover:border-primary rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-content transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-base-content/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <h3 className="font-bold text-lg">{cat.name}</h3>
                    <p className="text-xs text-base-content/65 mt-1 leading-relaxed">
                      {cat.tagline}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </section>
    </>
  );
}