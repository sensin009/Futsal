import { useEffect, useState } from "react";
import { api } from "../api/client";

type Scorer = {
  user_id: number;
  name: string;
  goals: number;
  assists: number;
  position: string | null;
  photo: string | null;
};

type TeamRow = {
  id: number;
  team_name: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
};

export function LeaderboardPage() {
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [teams, setTeams] = useState<TeamRow[]>([]);

  useEffect(() => {
    void Promise.all([
      api.get<Scorer[]>("/leaderboard/top-scorers?limit=15").then((r) => setScorers(r.data)),
      api.get<TeamRow[]>("/leaderboard/teams").then((r) => setTeams(r.data)),
    ]);
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-2xl border border-white/10 bg-navy/60 p-6">
        <h1 className="text-2xl font-black text-white">Top goal scorers</h1>
        <ol className="mt-4 space-y-2">
          {scorers.map((s, i) => (
            <li
              key={s.user_id}
              className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
            >
              <span className="text-white">
                <span className="mr-2 font-mono text-gold">{i + 1}.</span>
                {s.name}
              </span>
              <span className="text-accent">
                {s.goals}G / {s.assists}A
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section className="rounded-2xl border border-white/10 bg-navy/60 p-6">
        <h1 className="text-2xl font-black text-white">Team table</h1>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-white/50">
                <th className="pb-2">#</th>
                <th className="pb-2">Team</th>
                <th className="pb-2">Pts</th>
                <th className="pb-2">W</th>
                <th className="pb-2">D</th>
                <th className="pb-2">L</th>
                <th className="pb-2">GD</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t, idx) => (
                <tr key={t.id} className="border-t border-white/10 text-white/90">
                  <td className="py-2 font-mono text-gold">{idx + 1}</td>
                  <td className="py-2 font-medium">{t.team_name}</td>
                  <td className="py-2 font-bold text-accent">{t.points}</td>
                  <td className="py-2">{t.wins}</td>
                  <td className="py-2">{t.draws}</td>
                  <td className="py-2">{t.losses}</td>
                  <td className="py-2">{t.goal_difference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
