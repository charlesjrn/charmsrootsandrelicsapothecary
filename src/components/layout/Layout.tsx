import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import logo from "@/assets/logo.png";
import bgTexture from "@/assets/bg-texture.jpg";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      {/* Rest of your layout code remains the same */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-30"
        aria-hidden="true"
      >
        <img
          src={bgTexture}
          alt=""
          className="w-full h-full object-cover select-none"
          loading="eager"
        />
      </div>

      <div 
        className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
        aria-hidden="true"
      />

      <div
        className={`
          fixed inset-0 z-0 pointer-events-none flex items-center justify-center
          transition-opacity duration-1000 ease-out
          ${mounted ? 'opacity-100' : 'opacity-0'}
        `}
        aria-hidden="true"
      >
        <div className="relative w-full max-w-4xl mx-auto">
          <img
            src={logo}
            alt=""
            className="w-[70vw] max-w-[500px] mx-auto opacity-[0.08] select-none"
            style={{ 
              filter: "grayscale(100%) brightness(1.2)",
              transform: "rotate(-5deg)"
            }}
          />
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div 
        className="fixed top-0 left-0 w-32 h-32 z-0 pointer-events-none opacity-20"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-accent rounded-tl-2xl" />
      </div>
      <div 
        className="fixed top-0 right-0 w-32 h-32 z-0 pointer-events-none opacity-20"
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-accent rounded-tr-2xl" />
      </div>
      <div 
        className="fixed bottom-0 left-0 w-32 h-32 z-0 pointer-events-none opacity-20"
        aria-hidden="true"
      >
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-accent rounded-bl-2xl" />
      </div>
      <div 
        className="fixed bottom-0 right-0 w-32 h-32 z-0 pointer-events-none opacity-20"
        aria-hidden="true"
      >
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-accent rounded-br-2xl" />
      </div>

      <Header />

      <main className={`
        flex-1 pt-16 md:pt-20 relative z-[1]
        transition-opacity duration-500 ease-out
        ${mounted ? 'opacity-100' : 'opacity-0'}
      `}>
        {children}
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

// Scroll to Top Button component
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-8 z-50 p-3 rounded-full
        bg-accent text-white shadow-lg
        hover:bg-accent/90 hover:scale-110
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
      `}
      aria-label="Scroll to top"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}