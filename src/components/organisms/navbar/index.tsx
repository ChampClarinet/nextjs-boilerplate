"use client";

import { type FC } from "react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/providers/theme-provider";
import { LogOut, Moon, Sun, UserRound } from "lucide-react";

const Navbar: FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const username = "User";

  const handleLogout = async () => {
    //TODO
  };

  return (
    <header className="border-border bg-background flex h-16 shrink-0 items-center border-b px-4">
      <SidebarTrigger className="text-muted-foreground" />
      <div className="ml-auto flex items-center gap-5">
        <Button
          aria-label="Toggle theme"
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? (
            <Sun className="size-5" aria-hidden="true" />
          ) : (
            <Moon className="size-5" aria-hidden="true" />
          )}
        </Button>
        <div className="text-foreground border-border bg-background hover:bg-muted hover:text-foreground flex h-10 items-center gap-3 rounded-lg border border-solid px-4 text-base font-medium">
          <UserRound className="text-muted-foreground size-5" aria-hidden="true" />
          <span>{username}</span>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label="Log out"
                  variant="ghost"
                  size="icon-sm"
                  className="group/logout text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleLogout}
                />
              }
            >
              <LogOut className="size-5" aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent>Log out</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
