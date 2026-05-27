import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar, Image, BookOpen, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const navigation = [
  { name: "Home", href: "/", icon: Sparkles },
  { name: "About", href: "/about", icon: Users },
  { name: "Services", href: "/services", icon: BookOpen },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Gallery", href: "/gallery", icon: Image },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-border/20" 
          : "bg-white border-b border-border/50"
      )}
    >
      <nav className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo with Animation & Glow */}
          <Link 
            to="/" 
            className="flex items-center gap-2 md:gap-3 group"
            aria-label="Home"
          >
            <motion.div
              className="relative"
              whileHover="hover"
              animate="animate"
              initial="initial"
            >
              {/* Animated Glow Effect */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-accent/20 blur-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Rotating Ring on Hover */}
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-transparent"
                whileHover={{ 
                  borderColor: "rgba(212, 175, 55, 0.4)",
                  scale: 1.15,
                  rotate: 360
                }}
                transition={{ duration: 0.8 }}
              />
              
              {/* Logo Image */}
              <motion.img
                src={logo}
                alt="Charms, Roots & Relics Apothecary"
                className="relative w-10 h-10 md:w-12 md:h-12 object-contain cursor-pointer"
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -8, 8, -8, 0],
                  transition: {
                    rotate: { duration: 0.5, ease: "easeInOut" }
                  }
                }}
                animate={{
                  filter: [
                    "drop-shadow(0 0 0px rgba(212, 175, 55, 0))",
                    "drop-shadow(0 0 5px rgba(212, 175, 55, 0.4))",
                    "drop-shadow(0 0 0px rgba(212, 175, 55, 0))",
                  ]
                }}
                transition={{
                  filter: {
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }
                }}
              />
            </motion.div>

            {/* Text Animation */}
            <div className="hidden sm:block">
              <motion.span 
                className="font-display text-base md:text-lg font-bold text-foreground tracking-tight block"
                whileHover={{ color: "hsl(var(--accent))", x: 3 }}
                transition={{ duration: 0.2 }}
              >
                Charms, Roots & Relics
              </motion.span>
              <motion.span 
                className="block text-[10px] md:text-xs text-accent font-medium tracking-wider -mt-1 relative overflow-hidden"
                whileHover={{ letterSpacing: "0.1em" }}
                transition={{ duration: 0.3 }}
              >
                APOTHECARY
                <motion.span 
                  className="absolute bottom-0 left-0 h-px bg-accent"
                  initial={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
            </div>
          </Link>

          {/* Desktop Navigation - Increased spacing */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300",
                      isActive
                        ? "text-accent"
                        : "text-foreground hover:text-accent hover:bg-accent/5"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {isActive && <item.icon className="w-4 h-4" />}
                      {item.name}
                    </span>
                    {isActive && (
                      <motion.span 
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full"
                        layoutId="activeNav"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    {!isActive && (
                      <motion.span 
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent rounded-full"
                        whileHover={{ width: "60%" }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right Section - CTA Buttons */}
          <motion.div 
            className="hidden lg:flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button 
                variant="whatsapp" 
                size="default" 
                className="shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <a
                  href="https://forms.gle/qUpxCembcgjomsan9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Join Community
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-lg hover:bg-accent/10 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation with Animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-border/50">
                <div className="flex flex-col gap-2">
                  {navigation.map((item, index) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300",
                            isActive
                              ? "text-accent bg-accent/10"
                              : "text-foreground hover:text-accent hover:bg-accent/5"
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.name}
                          {isActive && (
                            <motion.span 
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"
                              layoutId="activeMobileNav"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                  
                  <motion.div 
                    className="pt-4 mt-2 border-t border-border/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        variant="whatsapp" 
                        size="lg" 
                        className="w-full shadow-lg"
                        asChild
                      >
                        <a
                          href="https://forms.gle/qUpxCembcgjomsan9"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Users className="w-5 h-5" />
                          Join Community
                        </a>
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}