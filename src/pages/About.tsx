import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Users, Heart, Leaf, Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import aboutImage from "@/assets/about-hands.jpg";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
}

const values = [
  {
    icon: Heart,
    title: "Cultural Preservation",
    description: "We work to preserve and revitalize African cultural memory, heritage, and living knowledge systems.",
  },
  {
    icon: Leaf,
    title: "Decolonial Education",
    description: "Engaging African knowledge systems as valid and contemporary frameworks for well-being and self-understanding.",
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Creating spaces for intergenerational knowledge exchange, cultural reconnection, and critical dialogue.",
  },
  {
    icon: Sparkles,
    title: "Spiritual Integrity",
    description: "Prioritizing cultural respect, informed consent, and ethical engagement with heritage practices.",
  },
];

export default function About() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchTeam() {
      const { data } = await supabase
        .from("team_members")
        .select("id, name, role, bio, image_url")
        .order("display_order", { ascending: true });
      if (data) setTeamMembers(data);
      setLoading(false);
    }
    fetchTeam();
  }, []);

  const toggleExpand = (memberId: string) => {
    setExpandedMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                Our Story
              </span>
               <h1 className="heading-sacred text-4xl md:text-5xl mt-2 mb-6">
                Who We Are
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Charms, Roots & Relics is a cultural and educational initiative that works 
                at the intersection of cultural preservation, decolonial education, and 
                community-based knowledge sharing rooted in African epistemologies. Our core 
                mission is to support African and Afro-descendant communities in reclaiming 
                cultural memory, strengthening identity, and engaging African knowledge 
                systems as valid and contemporary frameworks for well-being and self-understanding.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We operate through two interconnected arms — the Apothecary and the Community 
                platform. The Apothecary provides culturally grounded spiritual and wellness 
                services, while the Community functions as a learning and dialogue space for 
                Africans and people of African descent across the continent and diaspora.
              </p>
            </div>
            <div className="relative">
              <img
                src={aboutImage}
                alt="Hands holding sacred herbs"
                className="rounded-2xl shadow-elevated"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Founders & Members */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Our Circle
            </span>
            <h2 className="heading-sacred text-3xl md:text-4xl mt-2">
              Founders & Team
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Meet the practitioners and healers who guide our community with 
              wisdom, love, and dedication.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Team members coming soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamMembers.map((member) => {
                const isExpanded = expandedMembers.has(member.id);
                const hasLongBio = member.bio && member.bio.length > 120;
                const displayBio = isExpanded ? member.bio : truncateText(member.bio || "");
                
                return (
                  <div
                    key={member.id}
                    className="card-sacred p-6 text-center flex flex-col h-full"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                        {member.image_url ? (
                          <img
                            src={member.image_url}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-primary-foreground font-display text-2xl font-semibold">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-semibold">
                        {member.name}
                      </h3>
                      <p className="text-accent text-sm font-medium mb-3">
                        {member.role}
                      </p>
                    </div>
                    
                    <div className="flex-grow">
                      {member.bio && (
                        <>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {displayBio}
                          </p>
                          {hasLongBio && (
                            <button
                              onClick={() => toggleExpand(member.id)}
                              className="inline-flex items-center gap-1 text-accent hover:text-accent/80 text-sm font-medium mt-2 transition-colors"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  Show More
                                </>
                              )}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Our Foundation
            </span>
            <h2 className="heading-sacred text-3xl md:text-4xl mt-2">
              Mission & Values
            </h2>
          </div>

          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xl text-foreground font-display italic leading-relaxed">
              "To support African and Afro-descendant communities in reclaiming cultural 
              memory, strengthening identity, and engaging African knowledge systems as 
              valid and contemporary frameworks for well-being and self-understanding."
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="card-sacred p-6 text-center h-full flex flex-col"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[hsl(38,70%,60%)] font-medium text-sm uppercase tracking-wider">
                Our Community
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2">
                The Community & Ancestral Archive
              </h2>
            </div>

            <div className="space-y-6 text-primary-foreground/80 leading-relaxed">
              <p>
                The Charms, Roots & Relics Community functions as a learning and dialogue 
                space for Africans and people of African descent across the continent and 
                diaspora. It creates opportunities for cultural reconnection, intergenerational 
                knowledge exchange, and critical conversations on decoloniality, African 
                spirituality, Afro-feminism, Afro-futurism, and historically grounded African narratives.
              </p>
              <p>
                A key program within the community is the Ancestral Archive Book Club — a 
                literary circle focused on works by African and Afro-descendant authors. The 
                book club promotes critical engagement with African-centered literature, 
                supporting literacy, historical awareness, and cultural education.
              </p>
              <p>
                The initiative is well-positioned for partnerships in cultural education, 
                heritage preservation, community wellness, and decolonial knowledge production. 
                We welcome collaboration with organizations, researchers, educators, and cultural 
                institutions aligned with these values.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}