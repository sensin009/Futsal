import { FormEvent, useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const navCls = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? "bg-accent/20 text-accent" : "text-white/75 hover:bg-white/5 hover:text-white"
  }`;

export function AdminLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen bg-navy">
      <aside className="w-56 shrink-0 border-r border-white/10 bg-pitch/80 p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">Admin</p>
        <p className="mt-1 font-semibold text-white">{user?.name}</p>
        <nav className="mt-6 flex flex-col gap-1">
          <NavLink to="/admin" end className={navCls}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/players" className={navCls}>
            Manage players
          </NavLink>
          <NavLink to="/admin/pending" className={navCls}>
            Pending approvals
          </NavLink>
          <NavLink to="/admin/teams" className={navCls}>
            Manage teams
          </NavLink>
          <NavLink to="/admin/matches" className={navCls}>
            Manage matches
          </NavLink>
          <NavLink to="/admin/scores" className={navCls}>
            Match scores
          </NavLink>
          <NavLink to="/admin/leaderboard" className={navCls}>
            Leaderboard
          </NavLink>
        </nav>
        <button
          type="button"
          onClick={logout}
          className="mt-8 w-full rounded-lg border border-white/15 py-2 text-sm text-white/80 hover:bg-white/5"
        >
          Logout
        </button>
      </aside>
      <div className="flex-1 overflow-auto p-8">
        <Outlet />
      </div>
    </div>
  );
}

export function AdminDashboardHome() {
  const [counts, setCounts] = useState({ users: 0, teams: 0, matches: 0 });
  useEffect(() => {
    const run = async () => {
      const [u, t, m] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/teams"),
        api.get("/admin/matches"),
      ]);
      setCounts({ users: u.data.length, teams: t.data.length, matches: m.data.length });
    };
    void run();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-black text-white">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Users", counts.users],
          ["Teams", counts.teams],
          ["Matches", counts.matches],
        ].map(([label, n]) => (
          <div key={String(label)} className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">{label}</p>
            <p className="mt-2 text-4xl font-black text-accent">{n}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  is_blocked: boolean;
};

export function AdminPlayersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const load = () => void api.get<UserRow[]>("/admin/users").then((r) => setRows(r.data));
  useEffect(() => {
    load();
  }, []);

  async function patch(id: number, body: object) {
    await api.patch(`/admin/users/${id}`, body);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-white">All users</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t border-white/10 text-white/90">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.status}</td>
                <td className="flex flex-wrap gap-2 p-3">
                  <button
                    type="button"
                    className="rounded bg-accent/20 px-2 py-1 text-xs text-accent"
                    onClick={() => patch(u.id, { status: "approved" })}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-300"
                    onClick={() => patch(u.id, { status: "rejected" })}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="rounded bg-gold/20 px-2 py-1 text-xs text-gold"
                    onClick={() => patch(u.id, { is_blocked: !u.is_blocked })}
                  >
                    {u.is_blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminPendingPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const load = () =>
    void api.get<UserRow[]>("/admin/users").then((r) => setRows(r.data.filter((x) => x.status === "pending")));
  useEffect(() => {
    load();
  }, []);
  async function patch(id: number, body: object) {
    await api.patch(`/admin/users/${id}`, body);
    load();
  }
  return (
    <div>
      <h1 className="text-2xl font-black text-white">Pending approvals</h1>
      <ul className="mt-6 space-y-3">
        {rows.map((u) => (
          <li
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div>
              <p className="font-bold text-white">{u.name}</p>
              <p className="text-sm text-white/60">{u.email}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-navy"
                onClick={() => patch(u.id, { status: "approved" })}
              >
                Approve
              </button>
              <button
                type="button"
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white"
                onClick={() => patch(u.id, { status: "rejected" })}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
        {rows.length === 0 && <p className="text-white/60">No pending players.</p>}
      </ul>
    </div>
  );
}

export function AdminTeamsPage() {
  const [rows, setRows] = useState<{ id: number; team_name: string }[]>([]);
  const [name, setName] = useState("");
  const load = () => void api.get("/admin/teams").then((r) => setRows(r.data));
  useEffect(() => {
    load();
  }, []);
  async function add(e: FormEvent) {
    e.preventDefault();
    await api.post("/admin/teams", { team_name: name });
    setName("");
    load();
  }
  return (
    <div>
      <h1 className="text-2xl font-black text-white">Teams</h1>
      <form onSubmit={add} className="mt-4 flex max-w-md gap-2">
        <input
          className="flex-1 rounded-lg border border-white/15 bg-navy px-3 py-2 text-white"
          placeholder="New team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" className="rounded-lg bg-accent px-4 font-bold text-navy">
          Add
        </button>
      </form>
      <ul className="mt-6 space-y-2">
        {rows.map((t) => (
          <li key={t.id} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white">
            {t.team_name} <span className="text-white/40">#{t.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type MatchAdmin = {
  id: number;
  team_a_id: number;
  team_b_id: number;
  match_date: string;
  venue: string;
  status: string;
};

export function AdminMatchesPage() {
  const [rows, setRows] = useState<MatchAdmin[]>([]);
  const [form, setForm] = useState({ team_a_id: 1, team_b_id: 2, venue: "Main court", match_date: "" });
  const load = () => void api.get<MatchAdmin[]>("/admin/matches").then((r) => setRows(r.data));
  useEffect(() => {
    load();
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    const iso = new Date(form.match_date).toISOString();
    await api.post("/admin/matches", {
      team_a_id: form.team_a_id,
      team_b_id: form.team_b_id,
      venue: form.venue,
      match_date: iso,
      status: "upcoming",
    });
    load();
  }

  async function setStatus(id: number, status: string) {
    await api.patch(`/admin/matches/${id}`, { status });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-white">Matches</h1>
      <form onSubmit={create} className="mt-4 grid max-w-lg gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-white/70">Use team IDs from the teams list.</p>
        <input
          type="number"
          className="rounded border border-white/15 bg-navy px-3 py-2 text-white"
          placeholder="Team A id"
          value={form.team_a_id}
          onChange={(e) => setForm({ ...form, team_a_id: Number(e.target.value) })}
        />
        <input
          type="number"
          className="rounded border border-white/15 bg-navy px-3 py-2 text-white"
          placeholder="Team B id"
          value={form.team_b_id}
          onChange={(e) => setForm({ ...form, team_b_id: Number(e.target.value) })}
        />
        <input
          className="rounded border border-white/15 bg-navy px-3 py-2 text-white"
          placeholder="Venue"
          value={form.venue}
          onChange={(e) => setForm({ ...form, venue: e.target.value })}
        />
        <input
          type="datetime-local"
          className="rounded border border-white/15 bg-navy px-3 py-2 text-white"
          value={form.match_date}
          onChange={(e) => setForm({ ...form, match_date: e.target.value })}
          required
        />
        <button type="submit" className="rounded-lg bg-accent py-2 font-bold text-navy">
          Create match
        </button>
      </form>
      <ul className="mt-8 space-y-2">
        {rows.map((m) => (
          <li
            key={m.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
          >
            <span>
              #{m.id} — {m.team_a_id} vs {m.team_b_id} — {new Date(m.match_date).toLocaleString()}
            </span>
            <span className="text-gold">{m.status}</span>
            <div className="flex gap-1">
              {(["upcoming", "live", "finished"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className="rounded bg-navy px-2 py-1 text-xs capitalize"
                  onClick={() => setStatus(m.id, s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminScoresPage() {
  const [matchId, setMatchId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [yc, setYc] = useState(0);
  const [rc, setRc] = useState(0);
  const [motm, setMotm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function save(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    const mid = Number(matchId);
    await api.put(`/admin/matches/${mid}/scores`, {
      player_id: Number(playerId),
      goals,
      assists,
      yellow_card: yc,
      red_card: rc,
      performance_rating: null,
    });
    if (motm) {
      await api.patch(`/admin/matches/${mid}`, {
        man_of_the_match_user_id: Number(motm),
      });
    }
    setMsg("Saved (player stats recomputed).");
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-white">Match scores</h1>
      <p className="mt-2 max-w-xl text-sm text-white/65">
        Enter per-player lines. Set final scores on the match when status is finished. Man of the
        match is stored on the match record.
      </p>
      <form onSubmit={save} className="mt-6 grid max-w-md gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
        <input
          className="rounded border border-white/15 bg-navy px-3 py-2 text-white"
          placeholder="Match id"
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          required
        />
        <input
          className="rounded border border-white/15 bg-navy px-3 py-2 text-white"
          placeholder="Player user id"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            className="rounded border border-white/15 bg-navy px-3 py-2 text-white"
            placeholder="Goals"
            value={goals}
            onChange={(e) => setGoals(Number(e.target.value))}
          />
          <input
            type="number"
            className="rounded border border-white/15 bg-navy px-3 py-2 text-white"
            placeholder="Assists"
            value={assists}
            onChange={(e) => setAssists(Number(e.target.value))}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            className="rounded border border-white/15 bg-navy px-3 py-2 text-white"
            placeholder="Yellow"
            value={yc}
            onChange={(e) => setYc(Number(e.target.value))}
          />
          <input
            type="number"
            className="rounded border border-white/15 bg-navy px-3 py-2 text-white"
            placeholder="Red"
            value={rc}
            onChange={(e) => setRc(Number(e.target.value))}
          />
        </div>
        <input
          className="rounded border border-white/15 bg-navy px-3 py-2 text-white"
          placeholder="Man of the match (user id), optional"
          value={motm}
          onChange={(e) => setMotm(e.target.value)}
        />
        {msg && <p className="text-sm text-accent">{msg}</p>}
        <button type="submit" className="rounded-lg bg-accent py-2 font-bold text-navy">
          Save line
        </button>
      </form>
    </div>
  );
}

export function AdminLeaderboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-black text-white">Leaderboard (public data)</h1>
      <p className="mt-2 text-white/65">
        <Link className="text-accent underline" to="/leaderboard">
          Open public leaderboard
        </Link>
      </p>
    </div>
  );
}
