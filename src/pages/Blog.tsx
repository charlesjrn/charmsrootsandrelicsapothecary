import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, excerpt, image_url, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });
      
      if (data) setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Wisdom & Knowledge
            </span>
            <h1 className="heading-sacred text-4xl md:text-5xl mt-2 mb-6">
              Blog & Resources
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Articles, guides, and teachings on herbalism, spiritual practice, 
              and ancestral wisdom to support your journey.
            </p>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-8 text-center text-muted-foreground">
            Loading posts...
          </div>
        </section>
      ) : posts.length === 0 ? (
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-8 text-center text-muted-foreground">
            No blog posts yet. Check back soon!
          </div>
        </section>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section className="section-padding pb-8">
              <div className="container mx-auto px-4 md:px-8">
                <Link
                  to={`/blog/${featuredPost.id}`}
                  className="block card-sacred overflow-hidden group"
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                      {featuredPost.image_url ? (
                        <img 
                          src={featuredPost.image_url} 
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <span className="text-6xl opacity-30">📜</span>
                      )}
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <span className="text-accent text-sm font-medium uppercase tracking-wider mb-2">
                        Featured
                      </span>
                      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4 group-hover:text-accent transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(featuredPost.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* Blog Posts Grid */}
          {regularPosts.length > 0 && (
            <section className="section-padding pt-8">
              <div className="container mx-auto px-4 md:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="card-sacred overflow-hidden group"
                    >
                      <div className="aspect-video bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden">
                        {post.image_url ? (
                          <img 
                            src={post.image_url} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <span className="text-4xl opacity-30">📖</span>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-lg font-semibold mt-2 mb-3 group-hover:text-accent transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(post.created_at), "MMM d, yyyy")}
                          </span>
                          <span className="flex items-center gap-1 text-accent group-hover:gap-2 transition-all">
                            Read more
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </Layout>
  );
}
