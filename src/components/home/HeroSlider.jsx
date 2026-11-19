"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ArrowRight, Sparkles } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Image from "next/image";

const slides = [
  {
    badge: "Community Reading Club",
    title: "Your Next Favorite Story Is Waiting on the Shelf",
    description:
      "Browse curated fiction, science, and history shared by fellow readers. Borrow in one click and return when you finish.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1800&q=80",
  },
  {
    badge: "Share Knowledge Freely",
    title: "Add a Book Today, Inspire a Reader Tomorrow",
    description:
      "Turn idle books on your desk into a living community library. Track available copies automatically with zero hassle.",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1800&q=80",
  },
  {
    badge: "Seamless Borrowing",
    title: "Simple Lending Built for Curious Minds",
    description:
      "Keep all your borrowed reads and return dates organized in one clean dashboard—accessible anytime, on any device.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1800&q=80",
  },
];

export default function HeroSlider() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div className="rounded-3xl overflow-hidden shadow-xl border border-base-300">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="h-[440px] sm:h-[500px] lg:h-[540px] w-full"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full flex items-center">
                {/* Background Image */}
                <Image

                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="100vw"
                  priority={idx === 0}
                  className="object-cover"
                />
                {/* Editorial Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/65 to-stone-950/25" />

                {/* Content */}
                <div className="relative z-10 max-w-2xl px-8 sm:px-14 lg:px-16 text-white space-y-5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    {slide.badge}
                  </span>

                  <h1 className="text-3xl sm:text-5xl font-bold font-serif leading-tight">
                    {slide.title}
                  </h1>

                  <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-xl">
                    {slide.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href="/books"
                      className="btn btn-primary rounded-xl px-6 gap-2 shadow-lg"
                    >
                      Browse Books
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/add-book"
                      className="btn btn-ghost text-white border border-white/30 hover:bg-white/15 rounded-xl px-6"
                    >
                      Contribute a Book
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}