"use client";

import { Home, Search, LogOut, Heart, Tv } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setFavourites } from "@/store/WatchListSlice";
import { setSignedIn } from "@/store/signedInSlice";
import { useEffect, useMemo } from "react";

// Define interface for menu items
interface MenuItem {
  title: string;
  url?: string;
  icon: typeof Home | typeof Search | typeof LogOut;
  action?: () => Promise<void>;
}

export function AppSidebar() {
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state: RootState) => state.signedIn);
  const { data: session } = useSession();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    if (session) {
      dispatch(setSignedIn(true));
    } else {
      dispatch(setSignedIn(false));
    }
  }, [session, dispatch]);

  // Memoize menu items to avoid unnecessary re-renders
  const menuItems = useMemo(() => {
    const items: MenuItem[] = [
      { title: "Search", url: "/home", icon: Search },
      { title: "Favourites", url: "/favourites", icon: Heart },
      { title: "Watching", url: "/currently-watching", icon: Tv },
    ];

    if (isSignedIn) {
      items.push({
        title: "Sign out",
        icon: LogOut,
        action: async () => {
          dispatch(setFavourites([]));
          dispatch(setSignedIn(false));
          setOpenMobile(false);
          await signOut();
        },
      });
    }

    return items;
  }, [isSignedIn, dispatch, setOpenMobile]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) =>
                item.url ? (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <Link
                        href={item.url}
                        onClick={() => setOpenMobile(false)}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={item.action}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
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
