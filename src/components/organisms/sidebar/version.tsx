"use client";

import { type FC, useEffect, useState } from "react";

import { SidebarFooter } from "@/components/ui/sidebar";

const VersionFooter: FC = () => {
  const [appVersion, setAppVersion] = useState<AppVersion | undefined>();

  useEffect(() => {
    let isMounted = true;

    const fetchVersion = async () => {
      const version = await getAppVersion();
      if (isMounted) setAppVersion(version);
    };

    void fetchVersion();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!appVersion?.version) return null;

  const version = `v${appVersion.version}`;
  const build = [appVersion?.branch, appVersion?.commit].filter(Boolean).join(" · ");

  return (
    <SidebarFooter className="border-sidebar-border border-t px-4 py-3 group-data-[collapsible=icon]:hidden">
      <div className="text-sidebar-foreground/60 flex min-w-0 flex-col gap-0.5 text-xs">
        <span className="font-semibold">{version}</span>
        {build ? <span className="truncate">{build}</span> : null}
      </div>
    </SidebarFooter>
  );
};

export default VersionFooter;

const getAppVersion = async () => {
  try {
    const response = await fetch("/version.json", { cache: "no-store" });
    if (response.ok) return (await response.json()) as AppVersion;
  } catch (error) {
    console.error(error);
  }

  return undefined;
};

export interface AppVersion {
  version?: string;
  commit?: string;
  branch?: string;
  builtAt?: string;
}
