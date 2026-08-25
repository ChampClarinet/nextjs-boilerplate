import Link from "next/link";

import { Button } from "@/components/ui/button";
import { applicationDescription, applicationName } from "@/config/app";

export default function RootPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="flex max-w-xl flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">{applicationName}</h1>
        <p className="text-muted-foreground">{applicationDescription}</p>

        {/* Replace this starter action with the consuming application's primary entry point. */}
        <Button asChild>
          <Link href="/login">Open login example</Link>
        </Button>
      </section>
    </main>
  );
}
