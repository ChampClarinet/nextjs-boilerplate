import type { FC, PropsWithChildren } from "react";

import Navbar from "@/components/organisms/navbar";
import type { SidebarItem } from "@/components/organisms/sidebar";
import Sidebar from "@/components/organisms/sidebar";

import { PageScroll } from "../page-scroll";

export interface MainLayoutProps {
  sidebarList: SidebarItem[];
}
const MainLayout: FC<PropsWithChildren<MainLayoutProps>> = (props) => {
  return (
    <Sidebar sidebarList={props.sidebarList}>
      <div className="flex h-svh w-full flex-col overflow-hidden">
        <Navbar />
        <main className="@container/main-content min-h-0 w-full flex-1 overflow-auto px-6 py-5">
          <PageScroll>{props.children}</PageScroll>
        </main>
      </div>
    </Sidebar>
  );
};

export default MainLayout;
