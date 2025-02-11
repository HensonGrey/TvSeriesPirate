import { Home, Search, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Search",
    url: "/home",
    icon: Search,
  },
  {
    title: "Watch List",
    url: "/list",
    icon: Home,
  },
  {
    title: "Sign out",
    icon: LogOut,
    action: async () => {
      "use server";
      await signOut();
      redirect("/");
    },
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.url ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <form action={item.action}>
                      <SidebarMenuButton type="submit">
                        <item.icon className="w-4 h-4 mr-2" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </form>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
