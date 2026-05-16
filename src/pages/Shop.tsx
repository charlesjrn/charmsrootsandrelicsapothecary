import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag, Filter } from "lucide-react";
import productsImage from "@/assets/products-flatlay.jpg";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

const categories = [
  "All Products",
  "Herbal Offerings",
  "Charms & Mojo Bags",
  "Spiritual Kits",
  "Education & Resources",
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from("products")
        .select("id, name, category, description, price, image_url")
        .eq("active", true)
        .order("created_at", { ascending: false });
      
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const generateWhatsAppLink = (product: Product) => {
    const message = encodeURIComponent(
      `Hello! I'm interested in ordering:\n\n*${product.name}*\nPrice: KES ${product.price.toLocaleString()}\n\nPlease let me know the next steps.`
    );
    return `https://wa.me/254714839693?text=${message}`;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 z-0">
          <img
            src={productsImage}
            alt="Apothecary products"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center text-primary-foreground">
            <span className="text-[hsl(38,65%,60%)] font-medium text-sm uppercase tracking-wider">
              Sacred Apothecary
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-semibold mt-2 mb-6">
              Our Shop
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Each item is crafted with intention, blessed with prayer, and rooted 
              in ancestral wisdom. Order via WhatsApp for personalized service.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading products...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="card-sacred overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    ) : (
                      <ShoppingBag className="w-16 h-16 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
                    )}
                  </div>

                  <div className="p-5">
                    <span className="text-accent text-xs font-medium uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="font-display text-lg font-semibold mt-1 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl font-semibold text-foreground">
                        KES {Number(product.price).toLocaleString()}
                      </span>
                      <Button variant="whatsapp" size="sm" asChild>
                        <a
                          href={generateWhatsAppLink(product)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Order Now
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Ordering Info */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-sacred text-2xl md:text-3xl mb-4">
              How to Order
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We handle all orders personally through WhatsApp to ensure you receive 
              the right products for your needs. Simply click "Order Now" on any product, 
              and you'll be connected directly with our team. We'll confirm your order, 
              discuss any customizations, and arrange payment and shipping.
            </p>
            <Button variant="whatsapp" size="lg" asChild>
              <a
                href="https://wa.me/254714839693?text=Hello!%20I'd%20like%20to%20learn%20more%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact Us on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}