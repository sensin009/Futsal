import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    try {
      await register(name, email, password);
      setMsg("Account created — status is pending until an admin approves you.");
      setTimeout(() => nav("/login"), 1500);
    } catch {
      setError("Could not register (email may already exist).");
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-navy/70 p-8 shadow-xl">
      <h1 className="text-2xl font-black text-white">Player registration</h1>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm text-white/80">
          Full name
          <input
            className="mt-1 w-full rounded-lg border border-white/15 bg-navy px-3 py-2 text-white outline-none focus:border-accent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
          />
        </label>
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
        {msg && <p className="text-sm text-accent">{msg}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-accent py-3 font-bold text-navy hover:brightness-110"
        >
          Create account
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-white/60">
        Already have an account?{" "}
        <Link className="text-accent hover:underline" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
