"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const tabs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Stake Hours", href: "/stake" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Rewards", href: "/rewards" },
  { label: "Buy Tokens", href: "/buy-tokens" },
  { label: "Profile", href: "/profile" }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      setEmail(session?.user?.email || "");
      setToken(session?.access_token || "");
    };
    fetchUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email || "");
      setToken(session?.access_token || "");
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    router.replace("/auth/login");
  };

  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <header className="border-b border-white/5 bg-gradient-to-r from-slate-950/80 to-slate-900/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-brand-300">
            TBM Collective
          </p>
          <p className="text-lg font-semibold text-white">
            Stake time. Earn trust.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-900/40"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-brand-300 hover:text-brand-100"
          >
            Logout
          </button>
        </nav>
        <div className="text-right text-xs text-slate-400">
          <p>Signed in as</p>
          <p className="font-semibold text-white">{email || "Guest"}</p>
        </div>
      </div>
    </header>
  );
}

