"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, BookMarked, BookPlus, Mail, ShieldCheck } from "lucide-react";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { useSession } from "@/lib/auth-client";
import { publicFetch, authFetch } from "@/lib/api";
import { FadeUp } from "@/components/ui/MotionPrimitives";

function ProfileContent() {
  const { data: session } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState({ added: 0, borrowed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    let active = true;

    async function loadStats() {
      try {
        const [myBooks, myBorrows] = await Promise.all([
          publicFetch(`/books?email=${encodeURIComponent(user.email)}`),
          authFetch("/borrows"),
        ]);
        if (active) {
          setStats({ added: myBooks.length, borrowed: myBorrows.length });
        }
      } catch {
        // Keep defaults if request fails
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStats();
    return () => {
      active = false;
    };
  }, [user?.email]);

  const avatarSrc =
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "Reader"
    )}&background=0f4c3a&color=fff`;

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <FadeUp className="bg-base-100 border border-base-300 rounded-3xl shadow-sm overflow-hidden">
        {/* Decorative Header Strip */}
        <div className="h-32 bg-gradient-to-r from-primary via-primary/85 to-secondary/80" />

        <div className="px-6 sm:px-10 pb-10">
          {/* Avatar & Identity */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-8">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-base-100 shadow-lg bg-base-200 shrink-0">
                <Image
                  src={avatarSrc}
                  alt={user?.name || "Reader"}
                  width={96}
                  height={96}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pb-1">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif">
                  {user?.name}
                </h1>
                <p className="text-sm text-base-content/70 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  {user?.email}
                </p>
              </div>
            </div>

            <span className="badge badge-primary badge-soft gap-1.5 px-3 py-3 self-start sm:self-end">
              <ShieldCheck className="w-4 h-4" />
              Verified Member
            </span>
          </div>

          {/* Live Reader Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-base-200/70 border border-base-300 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Books Contributed
                </p>
                <p className="text-4xl font-bold font-serif mt-1 text-primary">
                  {loading ? "—" : stats.added}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-base-200/70 border border-base-300 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Currently Borrowed
                </p>
                <p className="text-4xl font-bold font-serif mt-1 text-secondary">
                  {loading ? "—" : stats.borrowed}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                <BookMarked className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link href="/add-book" className="btn btn-primary rounded-xl gap-2">
              <BookPlus className="w-4 h-4" />
              Add a Book
            </Link>
            <Link href="/my-books" className="btn btn-outline rounded-xl border-base-300">
              Manage My Books
            </Link>
            <Link href="/my-borrows" className="btn btn-outline rounded-xl border-base-300">
              View My Borrows
            </Link>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}

export default function ProfileClient() {
  return (
    <PrivateRoute>
      <ProfileContent />
    </PrivateRoute>
  );
}