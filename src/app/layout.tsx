import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

const heading = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Peachy | Seoulful Temptations in Toronto",
  description:
    "Premium Korean-inspired desserts in Toronto -- whole cakes, spoon cakes, and bingsu made with Belgian chocolate, organic vanilla, and fresh cream.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} h-full antialiased`}>
        <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <CartProvider>
          <Header />
          <main id="main-content" className="flex-1 pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
          <CartDrawer />
        </CartProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
