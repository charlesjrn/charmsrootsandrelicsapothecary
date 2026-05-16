import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  FileText,
  Calendar,
  MessageSquare,
  Megaphone,
  Users,
  Image,
  Mail,
  LogOut,
  Home,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Blog Posts", url: "/admin/blog", icon: FileText },
  { title: "Events", url: "/admin/events", icon: Calendar },
  { title: "Inquiries", url: "/admin/inquiries", icon: MessageSquare },
  { title: "Announcements", url: "/admin/announcements", icon: Megaphone },
  { title: "Team Members", url: "/admin/team", icon: Users },
  { title: "Gallery", url: "/admin/gallery", icon: Image },
  { title: "Newsletter", url: "/admin/newsletter", icon: Mail },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();

  // Separate settings from main menu items
  const mainMenuItems = menuItems.filter(item => item.title !== "Settings");
  const settingsItem = menuItems.find(item => item.title === "Settings");

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
            <span className="text-sidebar-primary font-display text-lg">CR</span>
          </div>
          <div>
            <h2 className="font-display font-semibold text-sidebar-foreground">
              Admin Panel
            </h2>
            <p className="text-xs text-sidebar-foreground/60 truncate max-w-[140px]">
              {user?.email}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            Content Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                    >
                      <Link to={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border space-y-2">
        {settingsItem && (
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            asChild
          >
            <Link to={settingsItem.url}>
              <settingsItem.icon className="w-4 h-4 mr-2" />
              {settingsItem.title}
            </Link>
          </Button>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          asChild
        >
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            View Site
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}