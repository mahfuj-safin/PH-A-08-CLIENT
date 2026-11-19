"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { ArrowRight, BookPlus, Sparkles } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SLIDES = [
  {
    badge: "Community Reading Club",
    title: "Your Next Favorite Story Is Waiting on the Shelf",
    subtitle:
      "Browse curated fiction, science, and history shared by fellow readers. Borrow in one click and return when you finish.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80",
    primaryCta: { label: "Browse Books", href: "/books" },
    secondaryCta: { label: "Contribute a Book", href: "/add-book" },
  },
  {
    badge: "Real-Time Copy Tracking",
    title: "Share Knowledge, Keep Every Shelf Alive",
    subtitle:
      "List books from your personal collection, track live copy availability automatically, and build a thriving reading circle.",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80",
    primaryCta: { label: "Explore Catalog", href: "/books" },
    secondaryCta: { label: "My Books", href: "/my-books" },
  },
  {
    badge: "Effortless Borrowing",
    title: "Borrow Today, Return Anytime with One Click",
    subtitle:
      "Pick your return date, keep tabs on your active reads inside My Borrows, and pass stories along to the next curious mind.",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80",
    primaryCta: { label: "Start Reading", href: "/books" },
    secondaryCta: { label: "My Borrows", href: "/my-borrows" },
  },
];

const EASE = [0.22, 1, 0.36, 1];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-base-300">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          loop
          speed={900}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="h-[460px] sm:h-[520px] lg:h-[560px] w-full"
        >
          {SLIDES.map((slide, idx) => {
            const isActive = activeIndex === idx;
            return (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full flex items-center">
                  {/* Subtle Ken Burns Zoom on active slide */}
                  <motion.div
                    key={`bg-${idx}-${isActive}`}
                    initial={{ scale: 1.08 }}
                    animate={{ scale: isActive ? 1.0 : 1.08 }}
                    transition={{ duration: 6.5, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={idx === 0}
                      unoptimized
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Rich Editorial Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />

                  {/* Staggered Text Reveal synced with active slide */}
                  <div className="relative z-10 max-w-2xl px-8 sm:px-14 lg:px-16 text-white space-y-5">
                    <motion.div
                      key={`badge-${idx}-${isActive}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                      transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
                    >
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/15 backdrop-blur-md border border-white/20 text-amber-200">
                        <Sparkles className="w-3.5 h-3.5" />
                        {slide.badge}
                      </span>
                    </motion.div>

                    <div className="overflow-hidden">
                      <motion.h1
                        key={`title-${idx}-${isActive}`}
                        initial={{ opacity: 0, y: 36 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                        className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold font-serif leading-[1.12] tracking-tight"
                      >
                        {slide.title}
                      </motion.h1>
                    </div>

                    <motion.p
                      key={`sub-${idx}-${isActive}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.65, delay: 0.35, ease: EASE }}
                      className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.div
                      key={`cta-${idx}-${isActive}`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                      transition={{ duration: 0.6, delay: 0.48, ease: EASE }}
                      className="flex flex-wrap items-center gap-3 pt-2"
                    >
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Link
                          href={slide.primaryCta.href}
                          className="btn btn-primary rounded-xl px-6 gap-2 shadow-lg group"
                        >
                          {slide.primaryCta.label}
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Link
                          href={slide.secondaryCta.href}
                          className="btn btn-ghost rounded-xl px-6 gap-2 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20"
                        >
                          <BookPlus className="w-4 h-4" />
                          {slide.secondaryCta.label}
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}