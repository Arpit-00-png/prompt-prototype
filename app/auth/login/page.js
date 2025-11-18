"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  const ensureProfile = async (session, profileData = {}) => {
    if (!session?.access_token) return;
    await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify(profileData)
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      let authResponse;
      if (mode === "login") {
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password
        });
      } else {
        authResponse = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name
            }
          }
        });
      }
      if (authResponse.error) {
        setError(authResponse.error.message);
        setLoading(false);
        return;
      }

      const session =
        authResponse.data.session ||
        (await supabase.auth.getSession()).data.session;
      const profileData =
        mode === "register"
          ? {
              name,
              skills
            }
          : {};
      await ensureProfile(session, profileData);
      router.replace("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    const { data, error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (googleError) {
      setError(googleError.message);
    } else if (data?.url) {
      window.location.assign(data.url);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4">
      <div className="glass-panel">
        <p className="text-xs uppercase tracking-widest text-brand-200">
          Welcome to TBM
        </p>
        <h1 className="mb-6 text-3xl font-bold">Stake hours. Earn trust.</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label className="text-sm">
                <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
                  Name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-3"
                  placeholder="Asha Kano"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
                  Skills
                </span>
                <input
                  type="text"
                  value={skills}
                  onChange={(event) => setSkills(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-3"
                  placeholder="Design, Writing"
                />
              </label>
            </>
          )}
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 p-3"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-300">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 p-3"
              placeholder="••••••••"
              required
            />
          </label>
          {error && (
            <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? "One sec…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
          <button
            type="button"
            onClick={handleGoogle}
            className="btn-secondary"
          >
            Continue with Google
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-400">
          {mode === "login" ? "New to TBM?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() =>
              setMode((prev) => (prev === "login" ? "register" : "login"))
            }
            className="font-semibold text-brand-200"
          >
            {mode === "login" ? "Create an account" : "Back to login"}
          </button>
        </p>
      </div>
    </div>
  );
}

