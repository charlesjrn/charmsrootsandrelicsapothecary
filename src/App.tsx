import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useSupabaseKeepAlive } from "@/hooks/useSupabaseKeepAlive";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppInner() {
  useSupabaseKeepAlive();
  return (
    <>
      <Toaster />
      <Sonner richColors closeButton position="top-right" />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/inquiries" element={<AdminInquiries />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/team" element={<AdminTeam />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/newsletter" element={<AdminNewsletter />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider delayDuration={0}>
        <AppInner />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;