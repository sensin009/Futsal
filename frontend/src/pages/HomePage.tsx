import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

type HomeData = {
  upcoming_match: null | {
    id: number;
    team_a_name: string;
    team_b_name: string;
    match_date: string;
    venue: string;
    status: string;
  };
  latest_result: null | {
    id: number;
    team_a_name: string;
    team_b_name: string;
    team_a_score: number | null;
    team_b_score: number | null;
  };
  top_players: {
    user_id: number;
    name: string;
    goals: number;
    assists: number;
    photo: string | null;
    position: string | null;
  }[];
};

export function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<HomeData>("/public/home")
      .then((r) => setData(r.data))
      .catch(() => setErr("Could not load home data."));
  }, []);

  return (
    <div className="space-y-12">
      <section className="grid gap-8 rounded-2xl border border-white/10 bg-navy/70 p-8 shadow-xl md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Club night</p>
          <h1 className="mt-2 text-4xl font-black leading-tight text-white md:text-5xl">
            Fast futsal.
            <br />
            <span className="text-gold">Loud stands.</span>
          </h1>
          <p className="mt-4 max-w-md text-white/75">
            Register as a player, build your profile, and hit the court once an admin approves you.
            Live scores feed the leaderboard automatically.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-lg bg-accent px-5 py-3 text-sm font-bold text-navy shadow-lg shadow-accent/25"
            >
              Player registration
            </Link>
            <Link
              to="/schedule"
              className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
            >
              Match schedule
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-accent/30 bg-pitch/80 p-6">
          <h2 className="text-lg font-bold text-white">Upcoming match</h2>
          {err && <p className="mt-2 text-sm text-red-300">{err}</p>}
          {!data && !err && <p className="mt-4 text-white/60">Loading…</p>}
          {data?.upcoming_match && (
            <div className="mt-4 space-y-2">
              <p className="text-2xl font-black text-white">
                {data.upcoming_match.team_a_name}{" "}
                <span className="text-gold">vs</span> {data.upcoming_match.team_b_name}
              </p>
              <p className="text-sm text-white/70">
                {new Date(data.upcoming_match.match_date).toLocaleString()} ·{" "}
                {data.upcoming_match.venue}
              </p>
              <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-bold uppercase text-gold">
                {data.upcoming_match.status}
              </span>
            </div>
          )}
          {data && !data.upcoming_match && (
            <p className="mt-4 text-white/60">No upcoming fixtures yet.</p>
          )}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy/60 p-6">
          <h2 className="text-xl font-bold text-white">Latest result</h2>
          {data?.latest_result ? (
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-white/60">{data.latest_result.team_a_name}</p>
                <p className="text-3xl font-black text-accent">
                  {data.latest_result.team_a_score ?? "—"}
                </p>
              </div>
              <span className="text-gold">:</span>
              <div className="text-right">
                <p className="text-sm text-white/60">{data.latest_result.team_b_name}</p>
                <p className="text-3xl font-black text-accent">
                  {data.latest_result.team_b_score ?? "—"}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-white/60">No finished matches yet.</p>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy/60 p-6">
          <h2 className="text-xl font-bold text-white">Top players</h2>
          <ul className="mt-4 space-y-3">
            {(data?.top_players ?? []).map((p) => (
              <li
                key={p.user_id}
                className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
              >
                <span className="font-medium text-white">{p.name}</span>
                <span className="text-sm text-accent">
                  {p.goals}G · {p.assists}A
                </span>
              </li>
            ))}
            {data && data.top_players.length === 0 && (
              <li className="text-white/60">No approved players yet.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
