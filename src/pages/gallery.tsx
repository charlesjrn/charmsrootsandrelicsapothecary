/**
 * Enhanced
 */
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Calendar, Camera, X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  event_name: string;
  event_date: string;
  created_at: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  useEffect(() => {
    async function fetchGallery() {
      const { data } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("active", true)
        .order("event_date", { ascending: false });
      
      if (data) setImages(data);
      setLoading(false);
    }
    fetchGallery();
  }, []);

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedIndex(-1);
    document.body.style.overflow = "auto";
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedIndex === -1) return;
    
    let newIndex = selectedIndex;
    if (direction === "prev") {
      newIndex = selectedIndex === 0 ? images.length - 1 : selectedIndex - 1;
    } else {
      newIndex = selectedIndex === images.length - 1 ? 0 : selectedIndex + 1;
    }
    
    setSelectedImage(images[newIndex]);
    setSelectedIndex(newIndex);
  };

  // Group images by event
  const groupedImages = images.reduce((groups, image) => {
    const eventKey = `${image.event_name}-${image.event_date}`;
    if (!groups[eventKey]) {
      groups[eventKey] = {
        eventName: image.event_name,
        eventDate: image.event_date,
        images: []
      };
    }
    groups[eventKey].images.push(image);
    return groups;
  }, {} as Record<string, { eventName: string; eventDate: string; images: GalleryImage[] }>);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateImage("prev");
      if (e.key === "ArrowRight") navigateImage("next");
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, selectedIndex]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Sacred Moments
            </span>
            <h1 className="heading-sacred text-4xl md:text-5xl mt-2 mb-6">
              Event Gallery
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Explore moments from our ceremonies, workshops, and community gatherings — 
              captured in sacred space and shared with love.
            </p>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-8 text-center text-muted-foreground">
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-30 animate-pulse" />
            <p>Loading gallery...</p>
          </div>
        </section>
      ) : images.length === 0 ? (
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-8 text-center text-muted-foreground">
            <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h3 className="font-display text-xl font-semibold mb-2">No images yet</h3>
            <p>Check back soon for photos from our events and ceremonies.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="border-b bg-card/50">
            <div className="container mx-auto px-4 md:px-8 py-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  {images.length} photos • {Object.keys(groupedImages).length} events
                </span>
              </div>
            </div>
          </div>

          {/* Gallery by Event */}
          <section className="section-padding">
            <div className="container mx-auto px-4 md:px-8">
              <div className="space-y-16">
                {Object.values(groupedImages).map((event) => (
                  <div key={`${event.eventName}-${event.eventDate}`}>
                    {/* Event Header */}
                    <div className="mb-6 pb-3 border-b-2 border-accent/20 inline-block">
                      <h2 className="font-display text-2xl md:text-3xl font-semibold">
                        {event.eventName}
                      </h2>
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.eventDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}</span>
                      </div>
                    </div>

                    {/* Masonry Grid */}
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                      {event.images.map((image, idx) => {
                        // Find global index for lightbox navigation
                        const globalIndex = images.findIndex(img => img.id === image.id);
                        
                        return (
                          <div
                            key={image.id}
                            className="break-inside-avoid cursor-pointer group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                            onClick={() => openLightbox(image, globalIndex)}
                          >
                            <div className="relative overflow-hidden bg-secondary/20">
                              <img
                                src={image.image_url}
                                alt={image.title}
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                              
                              {/* Overlay on hover */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                  <h3 className="font-display text-lg font-semibold mb-1">
                                    {image.title}
                                  </h3>
                                  {image.description && (
                                    <p className="text-sm text-white/80 line-clamp-2">
                                      {image.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2 text-xs text-white/70">
                                    <ZoomIn className="w-3 h-3" />
                                    <span>Click to view</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Caption (visible when not hovered) */}
                            <div className="p-3 bg-card border-t">
                              <h3 className="font-medium text-sm line-clamp-1">
                                {image.title}
                              </h3>
                              {image.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                  {image.description}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 text-white hover:text-accent transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("prev");
            }}
            className="absolute left-4 z-10 text-white hover:text-accent transition-colors bg-black/50 rounded-full p-2 backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
            className="absolute right-4 z-10 text-white hover:text-accent transition-colors bg-black/50 rounded-full p-2 backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image container */}
          <div 
            className="max-w-[90vw] max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-white font-display text-xl font-semibold mb-2">
                {selectedImage.title}
              </h3>
              <div className="flex items-center gap-4 text-white/80 text-sm mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedImage.event_name}
                </span>
                <span>
                  {new Date(selectedImage.event_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </div>
              {selectedImage.description && (
                <p className="text-white/90 text-sm leading-relaxed max-w-2xl">
                  {selectedImage.description}
                </p>
              )}
              <div className="mt-3 text-white/60 text-xs">
                {selectedIndex + 1} of {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}