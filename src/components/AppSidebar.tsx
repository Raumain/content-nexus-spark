
import { NavLink } from "react-router-dom";
import { Home, FolderOpen, Search, Settings, BookOpen, Clock, Star, Trash2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// Main navigation items
const mainNavItems = [
  { title: "Dashboard", path: "/", icon: Home },
  { title: "Documents", path: "/documents", icon: FolderOpen },
  { title: "Search", path: "/search", icon: Search },
  { title: "Settings", path: "/settings", icon: Settings },
];

// Collection navigation items
const collectionItems = [
  { title: "Documentation", path: "/documents?collection=docs", icon: BookOpen },
  { title: "Recent", path: "/documents?collection=recent", icon: Clock },
  { title: "Favorites", path: "/documents?collection=favorites", icon: Star },
  { title: "Trash", path: "/documents?collection=trash", icon: Trash2 },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center h-16 px-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary-accent rounded-md p-1">
            <FolderOpen className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl text-white">NuxeoDocs</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path} 
                      className={({ isActive }) => isActive ? "text-white bg-sidebar-accent font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"}
                      end={item.path === "/"}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collectionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path} 
                      className={({ isActive }) => isActive ? "text-white bg-sidebar-accent font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button className="w-full bg-primary-accent hover:bg-blue-600">
          Upload Document
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
