import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FileText, Calendar, MessageSquare, Megaphone, Users, Image, Mail, TrendingUp, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Stats {
  products: number;
  blogPosts: number;
  events: number;
  inquiries: number;
  announcements: number;
  teamMembers: number;
  galleryImages: number;
  subscribers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    blogPosts: 0,
    events: 0,
    inquiries: 0,
    announcements: 0,
    teamMembers: 0,
    galleryImages: 0,
    subscribers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      const [products, blogPosts, events, inquiries, announcements, teamMembers, galleryImages, subscribers] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("service_inquiries").select("id", { count: "exact", head: true }),
        supabase.from("announcements").select("id", { count: "exact", head: true }),
        supabase.from("team_members").select("id", { count: "exact", head: true }),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
        supabase.from("subscribers").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);

      setStats({
        products: products.count ?? 0,
        blogPosts: blogPosts.count ?? 0,
        events: events.count ?? 0,
        inquiries: inquiries.count ?? 0,
        announcements: announcements.count ?? 0,
        teamMembers: teamMembers.count ?? 0,
        galleryImages: galleryImages.count ?? 0,
        subscribers: subscribers.count ?? 0,
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  const statCards = [
    { title: "Products", value: stats.products, icon: Package, href: "/admin/products", gradient: "blue" },
    { title: "Blog Posts", value: stats.blogPosts, icon: FileText, href: "/admin/blog", gradient: "green" },
    { title: "Events", value: stats.events, icon: Calendar, href: "/admin/events", gradient: "purple" },
    { title: "Inquiries", value: stats.inquiries, icon: MessageSquare, href: "/admin/inquiries", gradient: "orange" },
    { title: "Announcements", value: stats.announcements, icon: Megaphone, href: "/admin/announcements", gradient: "pink" },
    { title: "Team Members", value: stats.teamMembers, icon: Users, href: "/admin/team", gradient: "indigo" },
    { title: "Gallery", value: stats.galleryImages, icon: Image, href: "/admin/gallery", gradient: "amber" },
    { title: "Newsletter", value: stats.subscribers, icon: Mail, href: "/admin/newsletter", gradient: "teal" },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const numberVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: 0.2
      }
    }
  };

  const gradientMap = {
    blue: "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20",
    green: "from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20",
    purple: "from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20",
    orange: "from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20",
    pink: "from-pink-50 to-pink-100 dark:from-pink-950/20 dark:to-pink-900/20",
    indigo: "from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20",
    amber: "from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20",
    teal: "from-teal-50 to-teal-100 dark:from-teal-950/20 dark:to-teal-900/20",
  };

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Sparkles className="w-8 h-8 text-accent" />
          </motion.div>
          <h2 className="text-2xl font-display font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome Back!
          </h2>
        </div>
        <p className="text-muted-foreground">
          Here's what's happening with your apothecary today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            onHoverStart={() => setHoveredCard(stat.title)}
            onHoverEnd={() => setHoveredCard(null)}
            onClick={() => navigate(stat.href)}
            className="cursor-pointer"
          >
            <Card className={`
              relative overflow-hidden transition-all duration-300
              hover:shadow-2xl hover:border-accent/50
              ${hoveredCard === stat.title ? 'shadow-accent/20' : ''}
            `}>
              {/* Animated Gradient Background */}
              <motion.div
                className={`
                  absolute inset-0 bg-gradient-to-br ${gradientMap[stat.gradient as keyof typeof gradientMap]}
                  opacity-0 transition-opacity duration-300
                  ${hoveredCard === stat.title ? 'opacity-100' : 'opacity-0'}
                `}
                initial={false}
                animate={{ opacity: hoveredCard === stat.title ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Shine Effect on Hover */}
              <motion.div
                className="absolute inset-0 opacity-0 pointer-events-none"
                initial={false}
                animate={{
                  opacity: hoveredCard === stat.title ? 0.1 : 0,
                  background: "linear-gradient(90deg, transparent, white, transparent)",
                  x: ["0%", "100%"],
                }}
                transition={{
                  duration: 0.6,
                  repeat: hoveredCard === stat.title ? Infinity : 0,
                  repeatDelay: 1,
                }}
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
              />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  className="relative"
                >
                  <stat.icon className="w-5 h-5 text-muted-foreground" />
                  {hoveredCard === stat.title && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-3xl font-display font-bold"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                        <div className="w-16 h-8 rounded-lg bg-muted animate-pulse" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="loaded"
                      variants={numberVariants}
                      initial="initial"
                      animate="animate"
                      className="flex items-baseline gap-2"
                    >
                      <span className="text-3xl font-display font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {stat.value.toLocaleString()}
                      </span>
                      {hoveredCard === stat.title && (
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="flex items-center gap-1 text-xs text-accent"
                        >
                          <TrendingUp className="w-3 h-3" />
                          <span>View</span>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>

              {/* Bottom Progress Bar */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent to-accent/50"
                initial={{ width: "0%" }}
                animate={{ width: hoveredCard === stat.title ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bottom Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="relative overflow-hidden">
          {/* Decorative animated pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-accent via-transparent to-accent animate-pulse" />
          </div>
          
          <CardHeader>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Admin Dashboard Overview
              </CardTitle>
            </motion.div>
          </CardHeader>
          
          <CardContent>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <p className="text-muted-foreground leading-relaxed">
                Use the sidebar to manage your website content. You can add, edit, and remove
                products, blog posts, events, announcements, team members, gallery images, and send newsletters. 
                All service inquiries submitted through the website will appear in the Inquiries section.
              </p>
              
              {/* Quick Stats Summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-2xl font-bold text-accent">{stats.subscribers}</p>
                  <p className="text-xs text-muted-foreground">Newsletter Subscribers</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-2xl font-bold text-accent">{stats.inquiries}</p>
                  <p className="text-xs text-muted-foreground">Total Inquiries</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-2xl font-bold text-accent">{stats.products + stats.blogPosts + stats.events}</p>
                  <p className="text-xs text-muted-foreground">Total Content Items</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-2xl font-bold text-accent">{stats.galleryImages}</p>
                  <p className="text-xs text-muted-foreground">Gallery Photos</p>
                </div>
              </motion.div>

              {/* Quick Tips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/50"
              >
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  Quick Tips
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Click on any stat card to quickly navigate to that section</li>
                  <li>Hover over cards to see interactive animations</li>
                  <li>Use the Newsletter section to send updates to your {stats.subscribers} subscribers</li>
                  <li>Regularly backup your content for safety</li>
                </ul>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Animated Footer Decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="fixed bottom-4 right-4 pointer-events-none"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
          <Sparkles className="relative w-6 h-6 text-accent/40" />
        </div>
      </motion.div>
    </AdminLayout>
  );
}