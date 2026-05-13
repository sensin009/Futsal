import { useEffect, useState } from "react";
import { api } from "../api/client";

type PlayerRow = {
  user_id: number;
  name: string;
  photo: string | null;
  age: number | null;
  position: string | null;
  jersey_number: number | null;
  total_goals: number;
  total_assists: number;
  total_matches: number;
  yellow_cards: number;
  red_cards: number;
};

export function PlayersPage() {
  const [rows, setRows] = useState<PlayerRow[]>([]);
  useEffect(() => {
    void api.get<PlayerRow[]>("/players").then((r) => setRows(r.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black text-white">Approved players</h1>
      <p className="mt-2 text-white/70">Profiles appear here after admin approval.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((p) => (
          <article
            key={p.user_id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-navy/70 shadow-lg"
          >
            <div className="h-28 bg-gradient-to-br from-accent/30 to-navy" />
            <div className="space-y-2 px-4 pb-4 pt-2">
              <h2 className="text-lg font-bold text-white">{p.name}</h2>
              <p className="text-xs uppercase tracking-wide text-gold">{p.position ?? "—"}</p>
              <div className="flex flex-wrap gap-2 text-sm text-white/80">
                <span className="rounded bg-white/10 px-2 py-0.5">Goals {p.total_goals}</span>
                <span className="rounded bg-white/10 px-2 py-0.5">Ast {p.total_assists}</span>
                <span className="rounded bg-white/10 px-2 py-0.5">MP {p.total_matches}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
