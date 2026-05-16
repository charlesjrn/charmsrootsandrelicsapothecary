import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Event {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  date_time: string;
  price_vip: number | null;
  price_regular: number | null;
  price_advance: number | null;
  ticket_link: string | null;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from("events")
        .select("id, name, description, location, date_time, price_vip, price_regular, price_advance, ticket_link")
        .eq("is_public", true)
        .gte("date_time", new Date().toISOString())
        .order("date_time", { ascending: true });
      
      if (data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Gather With Us
            </span>
            <h1 className="heading-sacred text-4xl md:text-5xl mt-2 mb-6">
              Events & Workshops
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Join our community for transformative gatherings, educational workshops, 
              and sacred celebrations. Both virtual and in-person events available.
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No upcoming events at the moment. Check back soon!
            </div>
          ) : (
            <div className="space-y-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="card-sacred overflow-hidden"
                >
                  <div className="grid lg:grid-cols-3 gap-0">
                    {/* Date Card */}
                    <div className="bg-primary text-primary-foreground p-8 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
                      <span className="text-[hsl(38,65%,60%)] font-medium text-sm uppercase tracking-wider mb-2">
                        Upcoming Event
                      </span>
                      <h3 className="font-display text-2xl md:text-3xl font-semibold mb-4">
                        {event.name}
                      </h3>
                      <div className="space-y-2 text-primary-foreground/80 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[hsl(38,65%,60%)]" />
                          {format(new Date(event.date_time), "MMMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[hsl(38,65%,60%)]" />
                          {format(new Date(event.date_time), "h:mm a")}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[hsl(38,65%,60%)]" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-8 lg:col-span-2">
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {event.description}
                      </p>

                      {/* Pricing */}
                      {(event.price_advance || event.price_regular || event.price_vip) && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                            Ticket Options
                          </h4>
                          <div className="grid grid-cols-3 gap-4">
                            {event.price_advance != null && (
                              <div className="bg-secondary rounded-lg p-4 text-center">
                                <span className="text-xs text-muted-foreground uppercase">Advance</span>
                                <p className="font-display text-xl font-semibold">${Number(event.price_advance).toFixed(0)}</p>
                              </div>
                            )}
                            {event.price_regular != null && (
                              <div className="bg-secondary rounded-lg p-4 text-center">
                                <span className="text-xs text-muted-foreground uppercase">Regular</span>
                                <p className="font-display text-xl font-semibold">${Number(event.price_regular).toFixed(0)}</p>
                              </div>
                            )}
                            {event.price_vip != null && (
                              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center">
                                <span className="text-xs text-accent uppercase font-medium">VIP</span>
                                <p className="font-display text-xl font-semibold">${Number(event.price_vip).toFixed(0)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      {event.ticket_link && (
                        <div className="flex items-center justify-end">
                          <Button variant="amber" size="lg" asChild>
                            <a
                              href={event.ticket_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Get Tickets
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Private Sessions CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Looking for Private Sessions?
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed mb-8">
              For one-on-one consultations, private ritual work, or custom workshops, 
              please reach out through our services inquiry form. We'll work with you 
              to schedule a session that meets your needs.
            </p>
            <Button variant="gold" size="lg" asChild>
              <a href="/services">
                Request a Private Session
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
