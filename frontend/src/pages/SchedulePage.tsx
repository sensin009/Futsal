import { useEffect, useState } from "react";
import { api } from "../api/client";

type MatchRow = {
  id: number;
  team_a_name: string;
  team_b_name: string;
  match_date: string;
  venue: string;
  status: string;
  team_a_score: number | null;
  team_b_score: number | null;
  is_today: boolean;
};

export function SchedulePage() {
  const [rows, setRows] = useState<MatchRow[]>([]);
  useEffect(() => {
    void api.get<MatchRow[]>("/matches").then((r) => setRows(r.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black text-white">Match schedule</h1>
      <div className="mt-8 space-y-4">
        {rows.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col gap-2 rounded-xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${
              m.is_today ? "border-gold bg-gold/10" : "border-white/10 bg-navy/60"
            }`}
          >
            <div>
              <p className="text-lg font-bold text-white">
                {m.team_a_name} <span className="text-gold">vs</span> {m.team_b_name}
              </p>
              <p className="text-sm text-white/65">
                {new Date(m.match_date).toLocaleString()} · {m.venue}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                  m.status === "live"
                    ? "bg-red-500/20 text-red-300"
                    : m.status === "finished"
                      ? "bg-white/10 text-white/80"
                      : "bg-accent/20 text-accent"
                }`}
              >
                {m.status}
              </span>
              {m.status === "finished" && (
                <span className="font-mono text-xl font-black text-accent">
                  {m.team_a_score} - {m.team_b_score}
                </span>
              )}
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-white/60">No matches scheduled.</p>}
      </div>
    </div>
  );
}
