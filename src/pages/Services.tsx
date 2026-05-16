import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Heart, BookOpen, Moon, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const services = [
  {
    id: "divination-cowrie",
    icon: Sparkles,
    title: "Cowrie Shell Reading",
    description: "Structured around four focused yes-or-no inquiries. Clients are guided to ask clear, direct questions for decisive ancestral responses. Especially helpful for decision-making, confirmation, or straightforward clarity.",
    duration: "45-60 minutes",
    format: "Virtual or In-Person",
  },
  {
    id: "divination-bone",
    icon: Moon,
    title: "Bone Reading",
    description: "More in-depth and reflective. Through four inquiries, clients receive layered guidance about life direction, lineage gifts and challenges, and areas that require attention or growth.",
    duration: "60-90 minutes",
    format: "Virtual or In-Person",
  },
  {
    id: "ritual-spellwork",
    icon: Heart,
    title: "Ritual Spell Work",
    description: "Rooted in Agikuyu traditional knowledge and informed by broader Afro-Indigenous spiritual systems. Each working is customized to the client's lived reality, lineage alignment, and spiritual readiness. Pricing from KES 6,000.",
    duration: "Varies by ritual",
    format: "In-Person",
  },
  {
    id: "wellness-coaching",
    icon: BookOpen,
    title: "Holistic Wellness Coaching",
    description: "A six-month guided journey addressing spiritual, emotional, physical, psychological, and social well-being. May include herbal support, spiritual baths, and body-based care.",
    duration: "6-month program",
    format: "Virtual or In-Person",
  },
  {
    id: "altar-setup",
    icon: Sparkles,
    title: "Altar Consultation & Setup",
    description: "Supports individuals called to create a dedicated ancestral altar. Includes consultation, bone reading for ancestral guidance, sourcing of items, and optional in-person setup with cleansing and purification.",
    duration: "By consultation",
    format: "In-Person",
  },
  {
    id: "home-blessing",
    icon: Heart,
    title: "Home Blessing & Cleansing",
    description: "Energetic renewal and harmony within a living space. May include herbal washes, room-by-room prayers, and cleansing of key areas. Focus on restoration, balance, and sacred placement.",
    duration: "2-4 hours",
    format: "In-Person",
  },
];

export default function Services() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("service_inquiries").insert({
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        service_type: formData.service,
        message: formData.message || null,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Your inquiry has been submitted! We'll be in touch soon.");

      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", service: "", message: "" });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Sacred Offerings
            </span>
             <h1 className="heading-sacred text-4xl md:text-5xl mt-2 mb-6">
              Sacred Services for Mind, Body & Soul
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our services are informed by traditional African knowledge systems, approached 
              from an educational and ethical standpoint. We emphasize personal agency, cultural 
              literacy, and responsible engagement with heritage practices.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {services.map((service) => (
              <div
                key={service.id}
                className="card-sacred p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <service.icon className="w-7 h-7 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-foreground">
                        <strong>Duration:</strong> {service.duration}
                      </span>
                      <span className="text-foreground">
                        <strong>Format:</strong> {service.format}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-[hsl(38,70%,60%)] font-medium text-sm uppercase tracking-wider">
                Get Started
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2 mb-6">
                Request a Service
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                Ready to begin your journey? Fill out the form and our team will 
                reach out to discuss your needs and schedule a session.
              </p>
              <div className="space-y-4 text-primary-foreground/80">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[hsl(38,70%,60%)] shrink-0 mt-0.5" />
                  <span>All inquiries are handled with complete confidentiality</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[hsl(38,70%,60%)] shrink-0 mt-0.5" />
                  <span>We respond within 24-48 hours</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[hsl(38,70%,60%)] shrink-0 mt-0.5" />
                  <span>Virtual sessions available worldwide</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-foreground/10 rounded-2xl p-6 md:p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[hsl(38,70%,50%)] flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Inquiry Received!
                  </h3>
                  <p className="text-primary-foreground/80">
                    We'll be in touch within 24-48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-primary-foreground">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 mt-1"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-primary-foreground">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 mt-1"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-primary-foreground">
                      Phone / WhatsApp
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 mt-1"
                      placeholder="+1 (234) 567-8900"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service" className="text-primary-foreground">
                      Service Type *
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                      required
                    >
                      <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground mt-1">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-primary-foreground">
                      Message / Description *
                    </Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 mt-1 min-h-[120px]"
                      placeholder="Tell us about your needs and what you're seeking..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
