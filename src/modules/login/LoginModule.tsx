"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { applicationDescription, applicationName } from "@/config/app";
import { Shield } from "lucide-react";

export function LoginModule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApiLogin = () => {
    //? Login logic here
    setLoading(true);
    setError("");
  };

  return (
    <div className="bg-background flex min-h-screen w-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="bg-primary flex size-16 items-center justify-center rounded-2xl shadow-lg">
            <Shield className="text-primary-foreground size-8" />
          </div>
          <div className="text-center">
            <h1 className="text-foreground text-2xl leading-8 font-semibold">{applicationName}</h1>
            <p className="text-muted-foreground mt-1 text-sm leading-6">{applicationDescription}</p>
          </div>
        </div>

        <div className="bg-card text-card-foreground w-full rounded-xl border p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            {error ? <p className="text-destructive text-sm leading-5">{error}</p> : null}
            <Button className="w-full" disabled={loading} onClick={handleApiLogin} type="button">
              {loading ? "Redirecting..." : "Login"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
