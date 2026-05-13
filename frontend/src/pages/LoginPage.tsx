import { FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!loading && user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch {
      setError("Invalid credentials or blocked account.");
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-navy/70 p-8 shadow-xl">
      <h1 className="text-2xl font-black text-white">Login</h1>
      <p className="mt-2 text-sm text-white/65">Players and admins use the same login form.</p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm text-white/80">
          Email
          <input
            className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-white outline-none focus:border-accent"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm text-white/80">
          Password
          <input
            className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-white outline-none focus:border-accent"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-accent py-3 font-bold text-navy hover:brightness-110"
        >
          Sign in
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-white/60">
        New player?{" "}
        <Link className="text-accent hover:underline" to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}
