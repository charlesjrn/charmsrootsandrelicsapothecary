import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import slideSacredArt from "@/assets/slide-sacred-art.jpg";
import slideAdinkra from "@/assets/slide-adinkra.jpg";
import slideApothecary from "@/assets/slide-apothecary.jpg";
import slideAncestors from "@/assets/slide-ancestors.jpg";

const slides = [
  {
    image: slideSacredArt,
    caption: "Sacred Art & Symbolism",
    subtitle: "Visual expressions of African spiritual traditions",
  },
  {
    image: slideAdinkra,
    caption: "Adinkra Wisdom",
    subtitle: "Ancient symbols carrying deep philosophical meaning",
  },
  {
    image: slideApothecary,
    caption: "The Apothecary",
    subtitle: "Herbal remedies rooted in ancestral knowledge",
  },
  {
    image: slideAncestors,
    caption: "Ancestral Connections",
    subtitle: "Honoring those who walked before us",
  },
];

export function FeaturedSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(
    () => goTo((current - 1 + slides.length) % slides.length),
    [current, goTo]
  );

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <span className="text-accent font-medium text-sm uppercase tracking-wider">
            Sacred Gallery
          </span>
          <h2 className="heading-sacred text-3xl md:text-4xl mt-2">
            Art, Culture & Heritage
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-elevated group">
          {/* Slides */}
          <div className="relative aspect-[4/3] md:aspect-video overflow-hidden bg-foreground/5">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-in-out",
                  index === current
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                )}
              >
                <img
                  src={slide.image}
                  alt={slide.caption}
                  className="w-full h-full object-cover animate-[kenburns_12s_ease-in-out_infinite_alternate]"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

                {/* Caption */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 p-6 md:p-8 transition-all duration-500 delay-200",
                    index === current
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  )}
                >
                  <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-1">
                    {slide.caption}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === current
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
