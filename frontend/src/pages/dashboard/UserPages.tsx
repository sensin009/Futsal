import { FormEvent, useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const navCls = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? "bg-accent/20 text-accent" : "text-white/75 hover:bg-white/5 hover:text-white"
  }`;

export function UserDashboardLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen bg-navy">
      <aside className="w-52 shrink-0 border-r border-white/10 bg-pitch/80 p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">Player</p>
        <p className="mt-1 font-semibold text-white">{user?.name}</p>
        <nav className="mt-6 flex flex-col gap-1">
          <NavLink to="/dashboard" end className={navCls}>
            Overview
          </NavLink>
          <NavLink to="/dashboard/profile" className={navCls}>
            My profile
          </NavLink>
          <NavLink to="/dashboard/scores" className={navCls}>
            My scores
          </NavLink>
          <NavLink to="/dashboard/stats" className={navCls}>
            My statistics
          </NavLink>
          <NavLink to="/dashboard/edit" className={navCls}>
            Edit profile
          </NavLink>
          <Link to="/leaderboard" className="mt-4 block rounded-lg px-3 py-2 text-sm text-gold hover:bg-white/5">
            Leaderboard
          </Link>
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

export function UserDashboardHome() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-3xl font-black text-white">Welcome back</h1>
      {user?.status === "pending" && (
        <div className="mt-4 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
          Your account is <strong>pending</strong>. Complete your profile — you will appear publicly
          after an admin approves you.
        </div>
      )}
      {user?.status === "rejected" && (
        <div className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Your registration was rejected. Contact the club for details.
        </div>
      )}
      <p className="mt-6 max-w-xl text-white/75">
        Use the menu to update your profile, review match lines, and track goals and assists from
        finished games.
      </p>
    </div>
  );
}

type Profile = {
  user_id: number;
  photo: string | null;
  age: number | null;
  phone: string | null;
  position: string | null;
  jersey_number: number | null;
  total_goals: number;
  total_assists: number;
  total_matches: number;
  yellow_cards: number;
  red_cards: number;
};

export function UserProfilePage() {
  const [p, setP] = useState<Profile | null>(null);
  useEffect(() => {
    void api.get<Profile | null>("/me/player-profile").then((r) => setP(r.data));
  }, []);
  if (!p) return <p className="text-white/60">No profile yet — create one under Edit profile.</p>;
  return (
    <div className="max-w-lg space-y-2 rounded-xl border border-white/10 bg-white/5 p-6 text-white/90">
      <h1 className="text-2xl font-black text-white">My profile</h1>
      <p>Position: {p.position ?? "—"}</p>
      <p>Jersey: {p.jersey_number ?? "—"}</p>
      <p>Age: {p.age ?? "—"}</p>
      <p>Phone: {p.phone ?? "—"}</p>
    </div>
  );
}

export function UserStatsPage() {
  const [p, setP] = useState<Profile | null>(null);
  useEffect(() => {
    void api.get<Profile | null>("/me/player-profile").then((r) => setP(r.data));
  }, []);
  if (!p) return <p className="text-white/60">No statistics yet.</p>;
  return (
    <div>
      <h1 className="text-2xl font-black text-white">Statistics</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          ["Goals", p.total_goals],
          ["Assists", p.total_assists],
          ["Matches", p.total_matches],
          ["Yellow", p.yellow_cards],
          ["Red", p.red_cards],
        ].map(([k, v]) => (
          <div key={String(k)} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-xs uppercase text-white/50">{k}</p>
            <p className="mt-1 text-3xl font-black text-accent">{v}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-white/55">Totals are summed from finished matches only.</p>
    </div>
  );
}

export function UserScoresPage() {
  const [rows, setRows] = useState<
    {
      match_id: number;
      match_date: string;
      team_a_name: string;
      team_b_name: string;
      goals: number;
      assists: number;
      yellow_card: number;
      red_card: number;
    }[]
  >([]);
  useEffect(() => {
    void api.get("/me/match-scores").then((r) => setRows(r.data));
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-black text-white">My match scores</h1>
      <ul className="mt-6 space-y-3">
        {rows.map((r) => (
          <li key={r.match_id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/90">
            <p className="font-bold text-white">
              {r.team_a_name} vs {r.team_b_name}
            </p>
            <p className="text-white/55">{new Date(r.match_date).toLocaleString()}</p>
            <p className="mt-2 text-accent">
              {r.goals}G {r.assists}A · Y{r.yellow_card} R{r.red_card}
            </p>
          </li>
        ))}
        {rows.length === 0 && <p className="text-white/60">No score rows yet.</p>}
      </ul>
    </div>
  );
}

export function UserEditProfilePage() {
  const [photo, setPhoto] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("midfielder");
  const [jersey, setJersey] = useState<number | "">("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    void api.get<Profile | null>("/me/player-profile").then((r) => {
      const d = r.data;
      if (!d) return;
      setPhoto(d.photo ?? "");
      setAge(d.age ?? "");
      setPhone(d.phone ?? "");
      setPosition(d.position ?? "midfielder");
      setJersey(d.jersey_number ?? "");
    });
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    await api.put("/me/player-profile", {
      photo: photo || null,
      age: age === "" ? null : age,
      phone: phone || null,
      position,
      jersey_number: jersey === "" ? null : jersey,
    });
    setMsg("Profile saved.");
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-black text-white">Edit profile</h1>
      <form className="mt-6 space-y-3" onSubmit={save}>
        <input
          className="w-full rounded border border-white/15 bg-navy px-3 py-2 text-white"
          placeholder="Photo URL"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
        />
        <input
          type="number"
          className="w-full rounded border border-white/15 bg-navy px-3 py-2 text-white"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <input
          className="w-full rounded border border-white/15 bg-navy px-3 py-2 text-white"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <select
          className="w-full rounded border border-white/15 bg-navy px-3 py-2 text-white"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          {["goalkeeper", "defender", "midfielder", "attacker"].map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="w-full rounded border border-white/15 bg-navy px-3 py-2 text-white"
          placeholder="Jersey number"
          value={jersey}
          onChange={(e) => setJersey(e.target.value === "" ? "" : Number(e.target.value))}
        />
        {msg && <p className="text-sm text-accent">{msg}</p>}
        <button type="submit" className="w-full rounded-lg bg-accent py-2 font-bold text-navy">
          Save
        </button>
      </form>
    </div>
  );
}
