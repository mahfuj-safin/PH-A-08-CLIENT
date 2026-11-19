import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700"],
});

export const metadata = {
  title: {
    default: "BookNook | A Modern Online Library",
    template: "BookNook | %s",
  },
  description:
    "Discover, share, borrow, and return books effortlessly in BookNook — your community online library.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="booknook-light"
      suppressHydrationWarning
      className={`${jakarta.variable} ${playfair.variable}`}
    >
      <body className="font-sans antialiased bg-base-100 text-base-content min-h-screen flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}