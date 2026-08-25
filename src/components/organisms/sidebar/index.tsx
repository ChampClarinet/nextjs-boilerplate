"use client";

import { type CSSProperties, type FC, type PropsWithChildren, useEffect } from "react";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { House, LayoutGrid, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import VersionFooter from "./version";

export interface SidebarProps {
  sidebarList: SidebarItem[];
}

const Sidebar: FC<PropsWithChildren<SidebarProps>> = (props) => {
  const pathname = usePathname();
  const currentPage = props.sidebarList.find((item) =>
    item.exact
      ? pathname === item.link
      : pathname === item.link || pathname.startsWith(`${item.link}/`),
  );

  useEffect(() => {
    document.title = currentPage ? `${currentPage.name} | VIP ADMIN` : "VIP ADMIN";
  }, [currentPage]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "15rem",
          "--sidebar-width-icon": "4rem",
        } as CSSProperties
      }
    >
      <ShadcnSidebar collapsible="icon" className="border-sidebar-border border-r">
        <SidebarHeader className="border-sidebar-border h-16 flex-row items-center gap-3 border-b px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          {/* //TODO should replace with app icon */}
          <LayoutGrid
            aria-hidden="true"
            className="text-foreground size-7 shrink-0 group-data-[collapsible=icon]:hidden"
            strokeWidth={2.4}
          />
          <span className="text-foreground text-lg font-semibold group-data-[collapsible=icon]:hidden">
            VIP Admin
          </span>
        </SidebarHeader>
        <SidebarContent className="bg-sidebar px-2 py-3 group-data-[collapsible=icon]:px-3">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {props.sidebarList.map((item) => {
                  const Icon = sidebarIcons[item.icon];
                  const isActive = item.exact
                    ? pathname === item.link
                    : pathname === item.link || pathname.startsWith(`${item.link}/`);
                  const content = (
                    <>
                      <Icon aria-hidden="true" strokeWidth={2.2} />
                      <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
                    </>
                  );

                  return (
                    <SidebarMenuItem key={item.id} aria-disabled={item.disabled}>
                      {item.disabled ? (
                        <SidebarMenuButton
                          disabled
                          tooltip={item.name}
                          isActive={false}
                          size="lg"
                          className={sidebarMenuButtonDisabledClassName}
                        >
                          {content}
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          tooltip={item.name}
                          isActive={isActive}
                          size="lg"
                          className={sidebarMenuButtonEnabledClassName}
                          render={
                            <Link href={item.link} aria-current={isActive ? "page" : undefined} />
                          }
                        >
                          {content}
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <VersionFooter />
        <SidebarRail />
      </ShadcnSidebar>
      <SidebarInset className="min-h-svh min-w-0 overflow-x-hidden">{props.children}</SidebarInset>
    </SidebarProvider>
  );
};

export default Sidebar;

const sidebarMenuButtonBaseClassName = cn(
  "text-sidebar-foreground h-9 gap-3 rounded-lg px-3 text-base font-medium transition-colors group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0!",
  "data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-active:font-semibold",
  "[&_svg]:size-5 [&_svg]:text-current",
);
const sidebarMenuButtonEnabledClassName = cn(
  sidebarMenuButtonBaseClassName,
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
);
const sidebarMenuButtonDisabledClassName = cn(
  sidebarMenuButtonBaseClassName,
  "hover:bg-transparent hover:text-sidebar-foreground",
);

const sidebarIcons = {
  house: House,
} satisfies Record<string, LucideIcon>;

type SidebarIconName = keyof typeof sidebarIcons;

export interface SidebarItem {
  id: string;
  name: string;
  link: string;
  exact?: boolean;
  icon: SidebarIconName;
  disabled?: boolean;
}
