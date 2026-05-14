import { FormEvent, useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Shield, 
  Calendar, 
  Trophy, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Activity,
  UserPlus,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";

const navCls = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
    isActive 
      ? "bg-accent/10 text-accent shadow-[0_0_20px_rgba(0,200,83,0.1)]" 
      : "text-white/50 hover:text-white hover:bg-white/5"
  }`;

export function AdminLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen bg-navy gradient-mesh">
      <aside className="w-72 shrink-0 border-r border-white/5 bg-navy-dark/50 backdrop-blur-xl p-6 flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold shadow-lg shadow-gold/20">
            <Shield className="h-6 w-6 text-navy" />
          </div>
          <div>
            <p className="text-sm font-black tracking-tighter text-white">ADMIN</p>
            <p className="text-[10px] font-bold tracking-[0.2em] text-gold">CONTROL</p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-white/5 p-4 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
              <span className="font-bold text-accent">{user?.name?.[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-bold text-white">{user?.name}</p>
              <p className="truncate text-[10px] text-white/40 uppercase">System Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <NavLink to="/admin" end className={navCls}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/players" className={navCls}>
            <Users className="h-4 w-4" />
            Manage Players
          </NavLink>
          <NavLink to="/admin/pending" className={navCls}>
            <UserCheck className="h-4 w-4" />
            Pending Approvals
          </NavLink>
          <NavLink to="/admin/teams" className={navCls}>
            <Users className="h-4 w-4" />
            Manage Teams
          </NavLink>
          <NavLink to="/admin/matches" className={navCls}>
            <Calendar className="h-4 w-4" />
            Manage Matches
          </NavLink>
          <NavLink to="/admin/scores" className={navCls}>
            <Activity className="h-4 w-4" />
            Match Scores
          </NavLink>
          <NavLink to="/admin/leaderboard" className={navCls}>
            <Trophy className="h-4 w-4" />
            Leaderboard
          </NavLink>
        </nav>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout} 
          className="mt-8 justify-start gap-3 w-full text-white/40 hover:text-red-400 hover:bg-red-400/5"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </aside>
      
      <main className="flex-1 overflow-auto p-10 h-screen">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
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

  const stats = [
    { label: "Total Players", value: counts.users, icon: Users, color: "text-accent", bg: "bg-accent/10" },
    { label: "Active Teams", value: counts.teams, icon: Trophy, color: "text-gold", bg: "bg-gold/10" },
    { label: "Matches Played", value: counts.matches, icon: Calendar, color: "text-blue-400", bg: "bg-blue-400/10" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <Badge variant="accent" className="mb-2">Overview</Badge>
        <h1 className="text-gradient text-4xl font-black">Admin Dashboard</h1>
        <p className="mt-2 text-white/50">Manage the tournament, players, and match schedules from one central place.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <TrendingUp className="h-4 w-4 text-white/10" />
            </div>
            <p className="text-sm font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
            <p className={`mt-1 text-5xl font-black ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl bg-white/5 p-4 border border-transparent hover:border-white/5 transition-colors">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <p className="text-sm text-white/70 flex-1">New player registered: <span className="text-white font-bold">John Doe</span></p>
                <span className="text-[10px] text-white/20 uppercase font-black">{i}h ago</span>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="bg-accent/5 border-accent/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            System Health
          </h2>
          <p className="text-sm text-white/60 leading-relaxed mb-6">
            All systems operational. Backend connected, database synced, and real-time score tracking is active.
          </p>
          <Button variant="primary" size="sm" className="w-full">System Log</Button>
        </Card>
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
  team_id: number | null;
};

export function AdminPlayersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const load = () => {
    void api.get<UserRow[]>("/admin/users").then((r) => setRows(r.data));
  };
  useEffect(() => {
    load();
  }, []);

  async function patch(id: number, body: object) {
    await api.patch(`/admin/users/${id}`, body);
    load();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="accent" className="mb-2">Member Control</Badge>
          <h1 className="text-gradient text-4xl font-black">All Registered Users</h1>
          <p className="mt-2 text-white/50">Manage roles, approval status, and security blocks for all platform members.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2">
          <Users className="h-5 w-5 text-accent" />
          <span className="text-sm font-bold text-white/60">{rows.length} Total Users</span>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
                <th className="p-4">Name & Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((u) => (
                <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-white/40">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-accent transition-colors">{u.name}</p>
                        <p className="text-xs text-white/30">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={u.role === "admin" ? "gold" : "outline"} className="scale-90 origin-left">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        u.status === "approved" ? "bg-accent" : 
                        u.status === "pending" ? "bg-gold" : "bg-red-500"
                      }`} />
                      <span className="text-sm font-semibold capitalize text-white/60">{u.status}</span>
                      {u.is_blocked && <Badge variant="outline" className="text-red-400 border-red-500/20 bg-red-500/5 py-0">Blocked</Badge>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {u.status !== "approved" && (
                        <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10" onClick={() => patch(u.id, { status: "approved" })}>
                          Approve
                        </Button>
                      )}
                      {u.status !== "rejected" && (
                        <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-400/10" onClick={() => patch(u.id, { status: "rejected" })}>
                          Reject
                        </Button>
                      )}
                      <Button variant="secondary" size="sm" onClick={() => patch(u.id, { is_blocked: !u.is_blocked })}>
                        {u.is_blocked ? "Unblock" : "Block"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
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
    <div className="space-y-8">
      <div>
        <Badge variant="accent" className="mb-2">Security Queue</Badge>
        <h1 className="text-gradient text-4xl font-black">Pending Approvals</h1>
        <p className="mt-2 text-white/50">Verify new player registrations and grant them access to the platform.</p>
      </div>

      <div className="grid gap-4">
        {rows.map((u) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-xl font-black text-gold">
                  {u.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{u.name}</h3>
                  <p className="text-sm text-white/40">{u.email}</p>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button 
                  className="flex-1 sm:flex-none bg-accent hover:bg-accent-light text-navy" 
                  onClick={() => patch(u.id, { status: "approved" })}
                >
                  Approve Player
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1 sm:flex-none border-red-500/20 text-red-400 hover:bg-red-500/5" 
                  onClick={() => patch(u.id, { status: "rejected" })}
                >
                  Reject
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
        {rows.length === 0 && (
          <Card className="text-center py-20 bg-white/[0.01] border-dashed border-white/10">
            <UserCheck className="mx-auto h-12 w-12 text-white/10 mb-4" />
            <p className="text-white/40 italic">All caught up! No pending registrations at the moment.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export function AdminTeamsPage() {
  const [rows, setRows] = useState<{ id: number; team_name: string }[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [name, setName] = useState("");
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);

  const load = () => {
    void api.get("/admin/teams").then((r) => setRows(r.data));
    void api.get<UserRow[]>("/admin/users").then((r) => setUsers(r.data));
  };

  useEffect(() => {
    load();
  }, []);

  async function addTeam(e: FormEvent) {
    e.preventDefault();
    await api.post("/admin/teams", { team_name: name });
    setName("");
    load();
  }

  async function assignPlayer(userId: number, teamId: number | null) {
    await api.patch(`/admin/users/${userId}`, { team_id: teamId });
    load();
  }

  const unassignedPlayers = users.filter(u => !u.team_id && u.role === "player" && u.status === "approved");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="accent" className="mb-2">Squad Management</Badge>
          <h1 className="text-gradient text-4xl font-black">Teams & Rosters</h1>
          <p className="mt-2 text-white/50">Create teams and assign approved players to their respective squads.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Create Team Card */}
        <Card className="lg:col-span-1 h-fit">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-accent" />
            Create New Team
          </h2>
          <form onSubmit={addTeam} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Team Name</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-accent/50"
                placeholder="e.g. Thunder FC"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Initialize Team</Button>
          </form>
        </Card>

        {/* Teams List */}
        <div className="lg:col-span-2 space-y-4">
          {rows.map((t) => {
            const teamPlayers = users.filter(u => u.team_id === t.id);
            const isExpanded = expandedTeamId === t.id;

            return (
              <Card key={t.id} className={`p-0 overflow-hidden transition-all ${isExpanded ? "ring-1 ring-accent/30" : ""}`}>
                <div 
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.02]"
                  onClick={() => setExpandedTeamId(isExpanded ? null : t.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center font-black text-accent">
                      {t.team_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">{t.team_name}</h3>
                      <p className="text-xs text-white/40 font-bold uppercase tracking-widest">{teamPlayers.length} Members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-[10px]">ID: {t.id}</Badge>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-white/20" /> : <ChevronDown className="h-5 w-5 text-white/20" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 bg-black/20"
                    >
                      <div className="p-6 space-y-6">
                        {/* Current Players */}
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Current Roster</p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {teamPlayers.map(p => (
                              <div key={p.id} className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/5">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                                    {p.name[0]}
                                  </div>
                                  <span className="text-sm font-bold text-white">{p.name}</span>
                                </div>
                                <button 
                                  onClick={() => assignPlayer(p.id, null)}
                                  className="p-2 text-white/20 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            {teamPlayers.length === 0 && <p className="text-sm text-white/20 italic">No players assigned yet.</p>}
                          </div>
                        </div>

                        {/* Assign New Players */}
                        <div className="pt-4 border-t border-white/5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Assign Available Players</p>
                          <div className="flex flex-wrap gap-2">
                            {unassignedPlayers.map(p => (
                              <button
                                key={p.id}
                                onClick={() => assignPlayer(p.id, t.id)}
                                className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-white/60 border border-white/5 hover:border-accent/50 hover:text-accent transition-all"
                              >
                                <UserPlus className="h-3 w-3" />
                                {p.name}
                              </button>
                            ))}
                            {unassignedPlayers.length === 0 && <p className="text-sm text-white/20 italic">No unassigned approved players available.</p>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </div>
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
  const [teams, setTeams] = useState<{ id: number; team_name: string }[]>([]);
  const [form, setForm] = useState({ team_a_id: 0, team_b_id: 0, venue: "Main Arena", match_date: "" });
  
  const load = () => {
    void api.get<MatchAdmin[]>("/admin/matches").then((r) => setRows(r.data));
    void api.get<{ id: number; team_name: string }[]>("/admin/teams").then((r) => setTeams(r.data));
  };

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
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="accent" className="mb-2">Match Control</Badge>
          <h1 className="text-gradient text-4xl font-black">Tournament Schedule</h1>
          <p className="mt-2 text-white/50">Schedule upcoming games, manage venues, and update live match statuses.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="h-fit">
          <h2 className="text-xl font-bold text-white mb-6">Create Match</h2>
          <form onSubmit={create} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Team A</label>
              <select 
                className="w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-accent/50"
                value={form.team_a_id}
                onChange={(e) => setForm({ ...form, team_a_id: Number(e.target.value) })}
                required
              >
                <option value="0">Select Team A</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Team B</label>
              <select 
                className="w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-accent/50"
                value={form.team_b_id}
                onChange={(e) => setForm({ ...form, team_b_id: Number(e.target.value) })}
                required
              >
                <option value="0">Select Team B</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Venue</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-accent/50"
                placeholder="Arena Name"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Date & Time</label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-accent/50"
                value={form.match_date}
                onChange={(e) => setForm({ ...form, match_date: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">Schedule Match</Button>
          </form>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {rows.map((m) => (
            <Card key={m.id} className="group">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">
                    {new Date(m.match_date).toLocaleString()} @ {m.venue}
                  </p>
                  <h3 className="text-lg font-black text-white">
                    Team {m.team_a_id} <span className="text-accent italic mx-2">VS</span> Team {m.team_b_id}
                  </h3>
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${m.status === 'live' ? 'bg-red-500 animate-pulse' : m.status === 'finished' ? 'bg-white/20' : 'bg-gold'}`} />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">{m.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(["upcoming", "live", "finished"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(m.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        m.status === s 
                          ? "bg-accent text-navy shadow-lg shadow-accent/20" 
                          : "bg-white/5 text-white/30 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setIsSubmitting(true);
    try {
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
    } catch {
      setMsg("Failed to save scores.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <Badge variant="accent" className="mb-2">Live Reporting</Badge>
        <h1 className="text-gradient text-4xl font-black">Submit Match Scores</h1>
        <p className="mt-2 text-white/50">Log individual player performance and designate the Man of the Match.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={save} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Match ID</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-accent/50"
                placeholder="e.g. 104"
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Player ID</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-accent/50"
                placeholder="e.g. 15"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Goals</label>
              <input
                type="number"
                className="w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-accent/50"
                value={goals}
                onChange={(e) => setGoals(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Assists</label>
              <input
                type="number"
                className="w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-accent/50"
                value={assists}
                onChange={(e) => setAssists(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Yellow</label>
              <input
                type="number"
                className="w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-accent/50"
                value={yc}
                onChange={(e) => setYc(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Red</label>
              <input
                type="number"
                className="w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-accent/50"
                value={rc}
                onChange={(e) => setRc(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Man of the Match (Player ID)</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-accent/50"
              placeholder="Leave empty if not applicable"
              value={motm}
              onChange={(e) => setMotm(e.target.value)}
            />
          </div>

          <AnimatePresence>
            {msg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-xl text-sm font-bold ${msg.includes('Saved') ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
              >
                {msg}
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" className="w-full py-4 text-base" isLoading={isSubmitting}>
            Log Performance Line
          </Button>
        </form>
      </Card>
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
