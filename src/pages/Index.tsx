import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FeaturedSlideshow } from "@/components/FeaturedSlideshow";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Leaf, Heart, Calendar, BookOpen, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import productsImage from "@/assets/products-flatlay.jpg";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

interface Announcement {
  id: string;
  title: string;
  content: string | null;
}

const services = [
  {
    icon: Sparkles,
    title: "Divination",
    description: "Cowrie shell and bone readings — sacred practices of seeking clarity, alignment, and ancestral perspective for grounded decision-making.",
  },
  {
    icon: Heart,
    title: "Ritual & Healing",
    description: "Customized ritual spell work, home blessings, and holistic wellness coaching rooted in Agikuyu and Afro-Indigenous traditions.",
  },
  {
    icon: BookOpen,
    title: "Community & Learning",
    description: "Join our Ancestral Archive Book Club and community dialogues on decoloniality, African spirituality, and Afro-futurism.",
  },
];

const categories = [
  { name: "Herbal Offerings", count: 24 },
  { name: "Charms & Mojo Bags", count: 18 },
  { name: "Spiritual Kits", count: 12 },
  { name: "Education & Resources", count: 8 },
];

export default function Index() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [heroSlide, setHeroSlide] = useState(0);
  const heroImages = [heroSlide1, heroSlide2];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchAnnouncements() {
      const { data } = await supabase
        .from("announcements")
        .select("id, title, content")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(2);
      
      if (data) setAnnouncements(data);
    }
    fetchAnnouncements();
  }, []);

  return (
    <Layout>
      {/* Announcements Section — Before Hero */}
      {announcements.length > 0 && (
        <section className="section-padding bg-secondary/50 pattern-overlay">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                Latest Updates
              </span>
              <h2 className="heading-sacred text-3xl md:text-4xl mt-2">
                Announcements
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="card-sacred p-6 md:p-8"
                >
                  <div className="flex items-center gap-2 text-accent text-sm font-medium mb-3">
                    <Calendar className="w-4 h-4" />
                    New
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {announcement.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hero Section — Full Afrocentric Art Background */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Crossfading Hero Background */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Cultural preservation"
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out scale-105 animate-[kenburns_20s_ease-in-out_infinite_alternate]",
                index === heroSlide ? "opacity-100" : "opacity-0"
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(25,45%,5%)/0.96] via-[hsl(280,45%,8%)/0.94] to-[hsl(25,45%,5%)/0.88]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(25,45%,5%)/0.75] via-[hsl(0,0%,0%)/0.4] to-[hsl(280,30%,4%)/0.65]" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl animate-fade-in bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="CRRA Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg" />
              <div className="h-px flex-1 max-w-16 bg-[hsl(var(--gold))]" />
              <span className="text-white font-medium text-sm uppercase tracking-[0.2em]" style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}>
                Afro-Indigenous Knowledge Systems
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-[1.1] animate-slide-up" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.6)" }}>
              Cultural Preservation,{" "}
              <span className="text-[hsl(var(--gold))] italic">Decolonial Wisdom</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/95 mb-8 leading-relaxed animate-slide-up max-w-xl" style={{ animationDelay: "0.1s", textShadow: "1px 1px 4px rgba(0,0,0,0.5)" }}>
              Welcome to Charms, Roots & Relics — a cultural and educational initiative 
              at the intersection of cultural preservation, decolonial education, and 
              community-based knowledge sharing rooted in African epistemologies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button variant="amber" size="xl" asChild>
                <a
                  href="https://forms.gle/qUpxCembcgjomsan9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Join WhatsApp Community
                </a>
              </Button>
              <Button size="xl" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20" asChild>
                <Link to="/shop">
                  Explore Our Offerings
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float z-10">
          <div className="w-6 h-10 rounded-full border-2 border-[hsl(var(--gold))]/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-[hsl(var(--gold))] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Tribal Divider SVG */}
      <div className="w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-8 md:h-10">
          <path d="M0,20 Q150,0 300,20 T600,20 T900,20 T1200,20 L1200,40 L0,40 Z" fill="hsl(var(--background))" />
          <path d="M0,22 L20,18 L40,22 L60,18 L80,22 L100,18 L120,22 L140,18 L160,22 L180,18 L200,22 L220,18 L240,22 L260,18 L280,22 L300,18 L320,22 L340,18 L360,22 L380,18 L400,22 L420,18 L440,22 L460,18 L480,22 L500,18 L520,22 L540,18 L560,22 L580,18 L600,22 L620,18 L640,22 L660,18 L680,22 L700,18 L720,22 L740,18 L760,22 L780,18 L800,22 L820,18 L840,22 L860,18 L880,22 L900,18 L920,22 L940,18 L960,22 L980,18 L1000,22 L1020,18 L1040,22 L1060,18 L1080,22 L1100,18 L1120,22 L1140,18 L1160,22 L1180,18 L1200,22" stroke="hsl(var(--gold))" strokeWidth="1" fill="none" opacity="0.4"/>
        </svg>
      </div>

      {/* Featured Slideshow */}
      <FeaturedSlideshow />

      {/* Services Preview */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              How We Serve
            </span>
            <h2 className="heading-sacred text-3xl md:text-4xl mt-2">
              Our Sacred Services
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Culturally grounded spiritual and wellness services informed by traditional 
              African knowledge systems, emphasizing personal agency and cultural literacy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="card-sacred p-8 text-center group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="default" size="lg" asChild>
              <Link to="/services">
                Request a Service
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[hsl(38,65%,60%)] font-medium text-sm uppercase tracking-wider">
                Sacred Offerings
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2 mb-6">
                Shop Our Apothecary
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-8">
                Each item in our collection is crafted with intention and rooted in the 
                wisdom of our ancestors. From hand-blended herbal remedies to protective 
                charms and spiritual kits — ethically sourced with cultural respect.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="bg-primary-foreground/10 rounded-lg p-4"
                  >
                    <span className="text-[hsl(38,65%,60%)] font-semibold text-lg">
                      {category.count}+
                    </span>
                    <p className="text-primary-foreground/80 text-sm">
                      {category.name}
                    </p>
                  </div>
                ))}
              </div>

              <Button variant="gold" size="lg" asChild>
                <Link to="/shop">
                  <ShoppingBag className="w-4 h-4" />
                  Browse All Products
                </Link>
              </Button>
            </div>

            <div className="relative">
              <img
                src={productsImage}
                alt="Spiritual apothecary products"
                className="rounded-2xl shadow-elevated"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground rounded-xl p-6 shadow-elevated">
                <Leaf className="w-8 h-8 mb-2" />
                <p className="font-display text-lg font-semibold">Ethically Sourced</p>
                <p className="text-sm opacity-90">Handcrafted with intention</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          <div className="card-sacred p-8 md:p-12 text-center max-w-3xl mx-auto bg-gradient-to-br from-card to-secondary">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-accent" />
            </div>
            <h2 className="heading-sacred text-3xl md:text-4xl mb-4">
              Join Our Sacred Circle
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Connect with fellow seekers in our learning and dialogue space. Join 
              critical conversations on decoloniality, African spirituality, and Afro-futurism.
            </p>
            <Button variant="whatsapp" size="xl" asChild>
              <a
                href="https://forms.gle/qUpxCembcgjomsan9"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Join the Community
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
