import { FormEvent, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  AlertTriangle, 
  Clock, 
  Users, 
  Shield, 
  Trophy,
  CheckCircle2,
  XCircle,
  Plus,
  LayoutDashboard,
  UserCheck,
  Flag,
  Calendar,
  Activity,
  UserPlus,
  MapPin,
  Trash2,
  RefreshCw,
  LogOut,
  ChevronRight,
  TrendingUp,
  Search,
  Filter
} from "lucide-react";
import { getImageUrl } from "../../utils/images";

const navCls = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-2xl px-6 py-4 text-sm font-black tracking-tight transition-all duration-500 ${
    isActive 
      ? "bg-accent text-navy shadow-[0_20px_40px_rgba(0,200,83,0.3)] scale-[1.02]" 
      : "text-white/40 hover:text-white hover:bg-white/5"
  }`;

export function AdminLayout() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-navy text-white font-outfit gradient-mesh">
      <aside className="w-72 shrink-0 border-r border-white/5 bg-navy-dark/40 backdrop-blur-3xl p-8 flex flex-col h-screen sticky top-0">
        <div className="mb-12 px-2">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-navy shadow-[0_0_20px_rgba(0,200,83,0.2)] group-hover:scale-110 transition-all duration-500">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tighter uppercase italic block leading-none">SENSIN<span className="text-accent">009</span></span>
              <span className="text-[9px] font-bold text-accent tracking-[0.3em] uppercase opacity-50 mt-1 block">Management</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5">
          <NavLink to="/admin" end className={navCls}>
            <LayoutDashboard className="h-4 w-4" /> <span className="tracking-tight">Overview</span>
          </NavLink>
          <NavLink to="/admin/pending" className={navCls}>
            <UserCheck className="h-4 w-4" /> <span className="tracking-tight">Verifications</span>
          </NavLink>
          <NavLink to="/admin/players" className={navCls}>
            <Users className="h-4 w-4" /> <span className="tracking-tight">Players</span>
          </NavLink>
          <NavLink to="/admin/teams" className={navCls}>
            <Flag className="h-4 w-4" /> <span className="tracking-tight">Squads</span>
          </NavLink>
          <NavLink to="/admin/matches" className={navCls}>
            <Calendar className="h-4 w-4" /> <span className="tracking-tight">Schedule</span>
          </NavLink>
          <NavLink to="/admin/scores" className={navCls}>
            <Activity className="h-4 w-4" /> <span className="tracking-tight">Live Center</span>
          </NavLink>
        </nav>

        <div className="mt-8 pt-8 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-bold text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all w-full group"
          >
            <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            Exit Session
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 scroll-smooth relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <Outlet />
        </div>
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] -z-10 rounded-full" />
        <div className="fixed top-0 left-72 w-[300px] h-[300px] bg-gold/5 blur-[100px] -z-10 rounded-full" />
      </main>
    </div>
  );
}

export function AdminDashboardHome() {
  const [stats, setStats] = useState({ players: 0, teams: 0, pending: 0, matches: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uRes, tRes, mRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/teams"),
          api.get("/admin/matches")
        ]);
        setStats({
          players: uRes.data.length,
          pending: uRes.data.filter((u: any) => u.status === 'pending').length,
          teams: tRes.data.length,
          matches: mRes.data.length
        });
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
        <Badge variant="accent" className="mb-4">System Overview</Badge>
        <h1 className="text-gradient text-6xl font-black tracking-tighter leading-none mb-4">Command Center</h1>
        <p className="text-white/40 text-lg max-w-xl font-medium leading-relaxed">Centralized management of the Futsal Arena ecosystem.</p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Players", val: stats.players, icon: Users, accent: "text-accent" },
          { label: "Pending", val: stats.pending, icon: UserCheck, accent: "text-gold" },
          { label: "Squads", val: stats.teams, icon: Flag, accent: "text-white" },
          { label: "Fixtures", val: stats.matches, icon: Calendar, accent: "text-blue-400" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="p-8 border-white/5 bg-white/[0.01] backdrop-blur-2xl group hover:bg-white/[0.03] transition-all duration-500 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <s.icon className="h-20 w-20" />
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">{s.label}</p>
              <div className="flex items-end justify-between">
                <p className={`text-5xl font-black ${s.accent} tracking-tighter`}>{s.val}</p>
                <div className={`h-1.5 w-1.5 rounded-full ${s.accent} opacity-50`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

type UserRow = { id: number; name: string; email: string; role: string; status: string; is_blocked: boolean; photo: string | null; team_id: number | null };

export function AdminPlayersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const load = () => void api.get<UserRow[]>("/admin/users").then((r) => setRows(r.data));
  useEffect(() => { load(); }, []);

  const patch = async (id: number, data: any) => {
    await api.patch(`/admin/users/${id}`, data);
    load();
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <Badge variant="accent" className="mb-4">Personnel Registry</Badge>
          <h1 className="text-gradient text-5xl font-black tracking-tighter leading-none">Player Base</h1>
          <p className="mt-4 text-white/40 font-medium">Manage and monitor official tournament participants.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/10 group-focus-within:text-accent transition-colors" />
            <input className="bg-white/[0.02] border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-white outline-none focus:border-accent/30 w-72 transition-all shadow-inner" placeholder="Search roster..." />
          </div>
          <Button variant="secondary" className="h-[52px] px-8 font-black text-[10px] tracking-widest"><Filter className="h-4 w-4 mr-2" /> FILTER</Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-white/5 bg-white/[0.01] backdrop-blur-2xl shadow-2xl rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Athlete</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Permission</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((u) => (
                <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-white/5 overflow-hidden flex items-center justify-center font-black text-white/20 border border-white/5 group-hover:border-accent/20 transition-all duration-500">
                        {u.photo ? <img src={getImageUrl(u.photo)!} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" /> : u.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-white group-hover:text-accent transition-colors tracking-tight">{u.name}</p>
                        <p className="text-xs text-white/20 font-medium">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <Badge variant={u.role === 'admin' ? 'gold' : 'outline'} className="text-[9px] px-3 font-black tracking-widest">{u.role}</Badge>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <div className={`h-1.5 w-1.5 rounded-full ${u.status === 'approved' ? 'bg-accent shadow-[0_0_8px_rgba(0,200,83,0.5)]' : u.status === 'pending' ? 'bg-gold shadow-[0_0_8px_rgba(255,193,7,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{u.status}</span>
                      {u.is_blocked && <span className="text-[9px] font-black text-red-400/50 bg-red-400/5 px-2 py-0.5 rounded-full border border-red-400/10">RESTRICTED</span>}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => patch(u.id, { is_blocked: !u.is_blocked })}
                      className={`text-[9px] font-black tracking-[0.2em] px-6 h-10 rounded-xl transition-all ${u.is_blocked ? 'bg-accent/10 text-accent hover:bg-accent hover:text-navy' : 'text-white/20 hover:text-red-400 hover:bg-red-400/5'}`}
                    >
                      {u.is_blocked ? "AUTHORIZE" : "RESTRICT"}
                    </Button>
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
  const load = () => void api.get<UserRow[]>("/admin/users").then((r) => setRows(r.data.filter((x: any) => x.status === 'pending')));
  useEffect(() => { load(); }, []);

  const patch = async (id: number, status: string) => {
    await api.patch(`/admin/users/${id}`, { status });
    load();
  };

  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Badge variant="gold" className="mb-4">Verification Queue</Badge>
        <h1 className="text-gradient text-5xl font-black tracking-tighter leading-none">Pending Approvals</h1>
        <p className="mt-4 text-white/40 font-medium">Verify athlete identities to grant tournament access.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {rows.map((u) => (
          <motion.div key={u.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8 border-white/5 bg-white/[0.01] backdrop-blur-2xl hover:bg-white/[0.02] transition-all duration-500 group rounded-[2rem] shadow-xl">
              <div className="flex items-center gap-6 mb-8">
                <div className="h-20 w-20 rounded-[2rem] bg-white/5 overflow-hidden flex items-center justify-center font-black text-white/10 border border-white/5 group-hover:border-gold/30 transition-all duration-700">
                  {u.photo ? <img src={getImageUrl(u.photo)!} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" /> : u.name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">{u.name}</h3>
                  <p className="text-xs text-white/20 font-medium">{u.email}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button size="sm" variant="accent" className="flex-1 h-12 font-black text-[10px] tracking-widest rounded-xl shadow-lg shadow-accent/10" onClick={() => patch(u.id, 'approved')}>
                  <CheckCircle2 className="h-4 w-4 mr-2" /> APPROVE
                </Button>
                <Button size="sm" variant="ghost" className="flex-1 h-12 font-black text-[10px] tracking-widest rounded-xl text-white/20 hover:text-red-400 hover:bg-red-400/5" onClick={() => patch(u.id, 'rejected')}>
                  <XCircle className="h-4 w-4 mr-2" /> DECLINE
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
        {rows.length === 0 && (
          <div className="col-span-full py-40 text-center rounded-[3rem] border-2 border-dashed border-white/[0.02] bg-white/[0.01]">
            <CheckCircle2 className="h-20 w-20 text-accent/20 mx-auto mb-6 opacity-50" />
            <p className="text-white/20 text-xl font-black italic tracking-tighter uppercase opacity-30">Queue is empty. All athletes verified.</p>
          </div>
        )}
      </div>
    </div>
  );
}

type TeamAdmin = { id: number; team_name: string; points: number; photo: string | null };

export function AdminTeamsPage() {
  const [rows, setRows] = useState<TeamAdmin[]>([]);
  const [unassignedPlayers, setUnassignedPlayers] = useState<UserRow[]>([]);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<{ [id: number]: any[] }>({});

  const load = async () => {
    try {
      const [tRes, uRes] = await Promise.all([
        api.get<TeamAdmin[]>("/admin/teams"),
        api.get<UserRow[]>("/admin/users")
      ]);
      setRows(tRes.data);
      setUnassignedPlayers(uRes.data.filter(u => u.status === 'approved' && u.team_id === null));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const loadTeamPlayers = async (tid: number) => {
    const res = await api.get<any[]>(`/admin/teams/${tid}/players`);
    setTeamPlayers(prev => ({ ...prev, [tid]: res.data }));
  };

  const toggleTeam = (tid: number) => {
    if (expandedTeam === tid) setExpandedTeam(null);
    else {
      setExpandedTeam(tid);
      loadTeamPlayers(tid);
    }
  };

  const assign = async (uid: number, tid: number) => {
    await api.patch(`/admin/users/${uid}`, { team_id: tid });
    load();
    loadTeamPlayers(tid);
  };

  const remove = async (uid: number, tid: number) => {
    await api.patch(`/admin/users/${uid}`, { team_id: null });
    load();
    loadTeamPlayers(tid);
  };

  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Badge variant="accent" className="mb-4">Operational Matrix</Badge>
        <h1 className="text-gradient text-5xl font-black tracking-tighter leading-none">Squad Management</h1>
        <p className="mt-4 text-white/40 font-medium">Allocate personnel and optimize squad distribution.</p>
      </motion.div>

      <div className="grid gap-6">
        {rows.map(t => (
          <Card key={t.id} className="p-0 overflow-hidden border-white/5 bg-white/[0.01] backdrop-blur-2xl shadow-xl hover:bg-white/[0.02] transition-all duration-500 rounded-[2rem]">
            <div className="p-8 flex items-center justify-between cursor-pointer group" onClick={() => toggleTeam(t.id)}>
              <div className="flex items-center gap-8">
                <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-inner">
                  <Flag className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tighter leading-none mb-2">{t.team_name}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                    <span className="flex items-center gap-1.5"><Trophy className="h-3 w-3" /> {t.points} Points</span>
                    <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> {teamPlayers[t.id]?.length || 0} Members</span>
                  </div>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="rounded-xl h-10 px-6 font-black text-[10px] tracking-widest">
                {expandedTeam === t.id ? "CLOSE ROSTER" : "VIEW ROSTER"}
              </Button>
            </div>

            <AnimatePresence>
              {expandedTeam === t.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white/[0.01] border-t border-white/5">
                  <div className="p-10 space-y-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 flex items-center gap-4">
                        Active Personnel <div className="h-[1px] flex-1 bg-white/5" />
                      </p>
                      <div className="grid gap-4 md:grid-cols-2">
                        {teamPlayers[t.id]?.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group/row">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-white/5 overflow-hidden flex items-center justify-center text-xs font-bold text-white/20 border border-white/5">
                                {p.photo ? <img src={getImageUrl(p.photo)!} className="h-full w-full object-cover" /> : p.name[0]}
                              </div>
                              <span className="font-bold text-sm text-white/70">{p.name}</span>
                            </div>
                            <button onClick={() => remove(p.id, t.id)} className="text-[9px] font-black text-white/20 hover:text-red-400 transition-colors uppercase tracking-widest px-4">RECALL</button>
                          </div>
                        ))}
                        {(!teamPlayers[t.id] || teamPlayers[t.id].length === 0) && <p className="text-white/20 italic text-xs py-4">No active personnel assigned to this squad.</p>}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/50 mb-6 flex items-center gap-4">
                        Available for Assignment <div className="h-[1px] flex-1 bg-accent/10" />
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {unassignedPlayers.map(p => (
                          <button 
                            key={p.id} 
                            onClick={() => assign(p.id, t.id)}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-accent/5 border border-accent/10 hover:bg-accent/10 hover:border-accent/30 transition-all group/btn"
                          >
                            <span className="text-[11px] font-black text-accent tracking-tight">{p.name}</span>
                            <Plus className="h-3 w-3 text-accent/50 group-hover/btn:rotate-90 transition-transform" />
                          </button>
                        ))}
                        {unassignedPlayers.length === 0 && <p className="text-white/20 italic text-xs">All approved personnel are currently assigned.</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  );
}

type MatchAdmin = { id: number; team_a_id: number; team_b_id: number; match_date: string; venue: string; status: string; team_a_score: number; team_b_score: number; team_a_name?: string; team_b_name?: string };

export function AdminMatchesPage() {
  const [rows, setRows] = useState<MatchAdmin[]>([]);
  const [teams, setTeams] = useState<{ id: number; team_name: string }[]>([]);
  const [form, setForm] = useState({ team_a_id: 0, team_b_id: 0, venue: "Main Arena", match_date: "" });
  const [msg, setMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const load = async () => {
    try {
      const [mRes, tRes] = await Promise.all([
        api.get<MatchAdmin[]>("/admin/matches"),
        api.get<{ id: number; team_name: string }[]>("/admin/teams")
      ]);
      setRows(mRes.data);
      setTeams(tRes.data);
    } catch (e) { console.error(e); }
  };
  useEffect(() => { load(); }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    if (form.team_a_id === 0 || form.team_b_id === 0) return setMsg({ text: "Select opposing squads", type: "error" });
    const d = new Date(form.match_date);
    if (isNaN(d.getTime())) return setMsg({ text: "Invalid temporal configuration", type: "error" });

    setIsSubmitting(true);
    setMsg(null);
    try {
      await api.post("/admin/matches", { ...form, match_date: d.toISOString() });
      setMsg({ text: "FIXTURE INITIALIZED", type: "success" });
      setForm({ ...form, match_date: "" });
      load();
    } catch (err: any) { setMsg({ text: "Operation Failed", type: "error" }); }
    finally { setIsSubmitting(false); }
  }

  async function setStatus(id: number, status: string) {
    await api.patch(`/admin/matches/${id}`, { status });
    load();
  }

  async function removeMatch(id: number) {
    if (!confirm("Confirm fixture deletion?")) return;
    await api.delete(`/admin/matches/${id}`);
    load();
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <Badge variant="accent" className="mb-4">Tournament Logistics</Badge>
          <h1 className="text-gradient text-5xl font-black tracking-tighter leading-none">Fixture Planning</h1>
          <p className="mt-4 text-white/40 text-lg">Coordinate matches and manage stadium logistics.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={load} className="gap-3 h-12 px-6 font-black text-[10px] tracking-widest"><RefreshCw className="h-4 w-4" /> REFRESH CACHE</Button>
      </div>

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Card className="p-10 border-white/5 bg-white/[0.01] backdrop-blur-2xl sticky top-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
            <h2 className="text-xl font-black text-white mb-10 flex items-center gap-3 italic uppercase tracking-tighter"><Plus className="h-6 w-6 text-accent" /> New Fixture</h2>
            <form onSubmit={create} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-white/20 ml-2 tracking-[0.2em]">Home Side</label>
                <select className="w-full rounded-[1.25rem] border border-white/5 bg-navy-dark px-6 py-5 text-white font-black outline-none focus:border-accent/50 appearance-none shadow-inner" value={form.team_a_id} onChange={(e) => setForm({ ...form, team_a_id: Number(e.target.value) })} required>
                  <option value="0">SELECT HOME</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-white/20 ml-2 tracking-[0.2em]">Opposing Side</label>
                <select className="w-full rounded-[1.25rem] border border-white/5 bg-navy-dark px-6 py-5 text-white font-black outline-none focus:border-accent/50 appearance-none shadow-inner" value={form.team_b_id} onChange={(e) => setForm({ ...form, team_b_id: Number(e.target.value) })} required>
                  <option value="0">SELECT AWAY</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-white/20 ml-2 tracking-[0.2em]">Match Venue</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10" />
                  <input className="w-full rounded-[1.25rem] border border-white/5 bg-navy-dark pl-16 pr-6 py-5 text-white font-black outline-none focus:border-accent/50 shadow-inner" placeholder="Stadium / Arena Name" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-white/20 ml-2 tracking-[0.2em]">Kick-off Time</label>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10 pointer-events-none" />
                  <input type="datetime-local" className="w-full rounded-[1.25rem] border border-white/5 bg-navy-dark pl-16 pr-6 py-5 text-white font-black outline-none focus:border-accent/50 shadow-inner [color-scheme:dark]" value={form.match_date} onChange={(e) => setForm({ ...form, match_date: e.target.value })} required />
                </div>
              </div>

              <AnimatePresence>
                {msg && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`flex items-center gap-4 p-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] ${msg.type === 'success' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {msg.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    {msg.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" className="w-full py-6 text-xs font-black uppercase tracking-[0.5em] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] bg-gradient-to-r from-accent to-accent-dark group" isLoading={isSubmitting}>
                SCHEDULE <ChevronRight className="inline h-4 w-4 group-hover:translate-x-1 transition-transform ml-2" />
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {rows.map(m => (
            <motion.div key={m.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="p-8 flex flex-col sm:flex-row items-center justify-between gap-10 border-white/5 bg-white/[0.01] backdrop-blur-xl hover:bg-white/[0.03] transition-all duration-500 group shadow-xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">REF_ID:{m.id}</span>
                    <Badge variant={m.status === 'live' ? 'accent' : m.status === 'finished' ? 'white' : 'gold'} className={`text-[9px] tracking-[0.2em] px-3 py-0.5 font-black ${m.status === 'live' ? 'animate-pulse' : ''}`}>{m.status.toUpperCase()}</Badge>
                  </div>
                  <div className="flex items-center gap-6">
                    <h3 className="text-4xl font-black text-white tracking-tighter leading-none truncate group-hover:text-accent transition-colors duration-500">
                      {m.team_a_name} <span className="text-white/5 text-xl font-normal italic lowercase tracking-tighter mx-2">vs</span> {m.team_b_name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-8 mt-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-3"><Clock className="h-4 w-4 text-accent/30" /> {new Date(m.match_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    <span className="flex items-center gap-3"><MapPin className="h-4 w-4 text-gold/30" /> {m.venue}</span>
                    {m.status !== 'upcoming' && <span className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl text-white shadow-inner"><Activity className="h-3.5 w-3.5 text-accent" /> {m.team_a_score} : {m.team_b_score}</span>}
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  {m.status === 'upcoming' && <Button size="sm" className="flex-1 sm:flex-none h-14 px-8 font-black text-[10px] tracking-[0.2em] shadow-2xl" onClick={() => setStatus(m.id, 'live')}>START</Button>}
                  {m.status === 'live' && <Button size="sm" variant="accent" className="flex-1 sm:flex-none h-14 px-8 font-black text-[10px] tracking-[0.2em] shadow-2xl shadow-accent/20 animate-pulse" onClick={() => setStatus(m.id, 'finished')}>FINISH</Button>}
                  <Link to="/admin/scores" className="flex-1 sm:flex-none"><Button variant="secondary" size="sm" className="w-full h-14 px-8 font-black text-[10px] tracking-[0.2em] shadow-2xl">CONTROL</Button></Link>
                  <Button variant="ghost" size="sm" className="h-14 w-14 p-0 text-white/5 hover:text-red-400 hover:bg-red-400/5 transition-all rounded-2xl" onClick={() => removeMatch(m.id)}><Trash2 className="h-6 w-6" /></Button>
                </div>
              </Card>
            </motion.div>
          ))}
          {rows.length === 0 && <div className="text-center py-40 rounded-[4rem] border-4 border-dashed border-white/[0.02] bg-white/[0.01]"><Shield className="h-24 w-24 text-white/5 mx-auto mb-8 opacity-50" /><p className="text-white/20 text-xl font-black italic tracking-tighter uppercase opacity-30">Operational queue cleared. No active fixtures.</p></div>}
        </div>
      </div>
    </div>
  );
}

type MatchEvent = { id: number; event_type: string; minute: number; player_name: string | null; team_name: string };
type PlayerOption = { id: number; name: string };

export function AdminScoresPage() {
  const [matches, setMatches] = useState<MatchAdmin[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchAdmin | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [playersA, setPlayersA] = useState<PlayerOption[]>([]);
  const [playersB, setPlayersB] = useState<PlayerOption[]>([]);
  const [form, setForm] = useState({ team_id: 0, player_id: 0, event_type: "goal", minute: 0 });
  const [msg, setMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void api.get<MatchAdmin[]>("/admin/matches").then((r) => setMatches(r.data.filter(m => m.status === 'live' || m.status === 'upcoming')));
  }, []);

  const loadMatchDetails = async (m: MatchAdmin) => {
    setSelectedMatch(m);
    setForm({ ...form, team_id: m.team_a_id, player_id: 0 });
    try {
      const [evRes, plARes, plBRes] = await Promise.all([
        api.get<{ events: MatchEvent[] }>(`/matches/${m.id}`),
        api.get<PlayerOption[]>(`/admin/teams/${m.team_a_id}/players`),
        api.get<PlayerOption[]>(`/admin/teams/${m.team_b_id}/players`)
      ]);
      setEvents(evRes.data.events);
      setPlayersA(plARes.data);
      setPlayersB(plBRes.data);
    } catch (e) { console.error(e); }
  };

  const submitEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;
    setLoading(true);
    setMsg(null);
    try {
      await api.post(`/admin/matches/${selectedMatch.id}/events`, { ...form, player_id: form.player_id === 0 ? null : form.player_id });
      setMsg({ text: "EVENT BROADCASTED", type: "success" });
      const res = await api.get<MatchAdmin & { events: MatchEvent[] }>(`/matches/${selectedMatch.id}`);
      setEvents(res.data.events);
      // Update local match score
      setSelectedMatch(prev => prev ? { ...prev, team_a_score: res.data.team_a_score, team_b_score: res.data.team_b_score } : null);
    } catch (err) {
      setMsg({ text: "TRANSMISSION ERROR", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="accent" className="mb-4">Live Hub</Badge>
        <h1 className="text-gradient text-5xl font-black tracking-tighter leading-none">Operational Center</h1>
        <p className="mt-4 text-white/40 font-medium">Real-time telemetry and event logging for active fixtures.</p>
      </motion.div>

      {!selectedMatch ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map(m => (
            <Card key={m.id} className="p-8 border-white/5 bg-white/[0.01] backdrop-blur-2xl hover:bg-accent/5 hover:border-accent/30 transition-all duration-500 cursor-pointer group rounded-[2rem] shadow-xl" onClick={() => loadMatchDetails(m)}>
              <div className="flex items-center justify-between mb-6">
                <Badge variant={m.status === 'live' ? 'accent' : 'gold'}>{m.status}</Badge>
                <Zap className={`h-5 w-5 ${m.status === 'live' ? 'text-accent animate-pulse' : 'text-white/10'}`} />
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-accent transition-colors leading-tight mb-6">
                {m.team_a_name} <br/> <span className="text-xs font-normal lowercase italic opacity-50">vs</span> <br/> {m.team_b_name}
              </h3>
              <Button variant="secondary" className="w-full rounded-xl font-black text-[10px] tracking-widest h-10 group-hover:bg-accent group-hover:text-navy transition-all">ENTER COMMAND</Button>
            </Card>
          ))}
          {matches.length === 0 && <div className="col-span-full py-40 text-center opacity-30"><Activity className="h-20 w-20 mx-auto mb-6" /><p className="text-xl font-black italic">No active matches detected.</p></div>}
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <Button variant="ghost" className="text-white/30 hover:text-white mb-4 px-0 flex items-center gap-2" onClick={() => setSelectedMatch(null)}>
              <ChevronRight className="h-4 w-4 rotate-180" /> Back to Selection
            </Button>
            
            <Card className="p-8 border-white/5 bg-white/[0.01] backdrop-blur-2xl rounded-[2rem] shadow-2xl sticky top-8">
              <h2 className="text-xl font-black text-white mb-8 uppercase tracking-tighter italic">Log Event</h2>
              <form onSubmit={submitEvent} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Event Category</label>
                  <select className="w-full bg-navy/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-accent/30 transition-all appearance-none cursor-pointer shadow-inner" value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })}>
                    <option value="goal" className="bg-navy">Goal Scored</option>
                    <option value="assist" className="bg-navy">Assist Credited</option>
                    <option value="yellow_card" className="bg-navy">Caution (Yellow)</option>
                    <option value="red_card" className="bg-navy">Dismissal (Red)</option>
                    <option value="foul" className="bg-navy">Rule Infraction</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Affiliation</label>
                  <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                    <button type="button" className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.team_id === selectedMatch.team_a_id ? 'bg-accent text-navy shadow-lg' : 'text-white/20 hover:text-white'}`} onClick={() => setForm({ ...form, team_id: selectedMatch.team_a_id, player_id: 0 })}>{selectedMatch.team_a_name}</button>
                    <button type="button" className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.team_id === selectedMatch.team_b_id ? 'bg-accent text-navy shadow-lg' : 'text-white/20 hover:text-white'}`} onClick={() => setForm({ ...form, team_id: selectedMatch.team_b_id, player_id: 0 })}>{selectedMatch.team_b_name}</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Athlete</label>
                  <select className="w-full bg-navy/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-accent/30 transition-all appearance-none cursor-pointer shadow-inner" value={form.player_id} onChange={(e) => setForm({ ...form, player_id: Number(e.target.value) })}>
                    <option value="0" className="bg-navy">Select Personnel...</option>
                    {(form.team_id === selectedMatch.team_a_id ? playersA : playersB).map(p => <option key={p.id} value={p.id} className="bg-navy">{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Time (Minute)</label>
                  <input type="number" min="0" max="120" className="w-full bg-navy/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-accent/30 transition-all shadow-inner" value={form.minute} onChange={(e) => setForm({ ...form, minute: Number(e.target.value) })} />
                </div>

                {msg && <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center ${msg.type === 'success' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{msg.text}</motion.div>}

                <Button disabled={loading} type="submit" className="w-full h-14 font-black tracking-[0.3em] text-[10px] rounded-2xl shadow-2xl shadow-accent/20">
                  {loading ? "TRANSMITTING..." : "LOG EVENT"}
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <Card className="p-12 border-white/5 bg-accent/5 backdrop-blur-2xl rounded-[3rem] overflow-hidden relative border border-accent/20">
              <div className="absolute top-0 right-0 p-12 opacity-5"><Zap className="h-32 w-32" /></div>
              <div className="flex items-center justify-center gap-12 relative z-10">
                <div className="text-center flex-1">
                  <h3 className="text-4xl font-black text-white tracking-tighter mb-4">{selectedMatch.team_a_name}</h3>
                  <Badge variant="accent">HOME SQUAD</Badge>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="text-8xl font-black text-white tracking-tighter italic flex items-center gap-8">
                    <span>{selectedMatch.team_a_score}</span>
                    <span className="text-white/10 text-4xl">:</span>
                    <span>{selectedMatch.team_b_score}</span>
                  </div>
                  <Badge variant="outline" className="px-6 py-2 animate-pulse font-black italic tracking-widest bg-navy/50">LIVE TELEMETRY</Badge>
                </div>
                <div className="text-center flex-1">
                  <h3 className="text-4xl font-black text-white tracking-tighter mb-4">{selectedMatch.team_b_name}</h3>
                  <Badge variant="outline">AWAY SQUAD</Badge>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic flex items-center gap-4 px-4">Event Timeline <div className="h-[1px] flex-1 bg-white/5" /></p>
              <div className="space-y-3">
                {events.slice().reverse().map((ev, i) => (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={ev.id} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.01] border border-white/5 group hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center gap-6">
                      <span className="text-2xl font-black text-accent tracking-tighter italic w-10">{ev.minute}'</span>
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        {ev.event_type === 'goal' ? <Trophy className="h-5 w-5 text-gold" /> : <Activity className="h-5 w-5 text-accent" />}
                      </div>
                      <div>
                        <span className="font-black text-white text-lg tracking-tight group-hover:text-accent transition-colors">{ev.player_name || "Unknown"}</span>
                        <span className="text-[10px] font-black uppercase text-white/20 ml-4 tracking-widest">{ev.event_type.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-black uppercase text-white/10 tracking-[0.3em] group-hover:text-white/30 transition-colors">{ev.team_name}</span>
                  </motion.div>
                ))}
                {events.length === 0 && <div className="text-center py-20 bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5"><p className="text-white/10 font-black italic tracking-tighter uppercase text-xl opacity-50">Awaiting Signal...</p></div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminLeaderboardPage() {
  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="accent" className="mb-4">Global Data</Badge>
        <h1 className="text-gradient text-5xl font-black tracking-tighter leading-none">Statistical Hierarchy</h1>
      </motion.div>
      <Card className="p-40 text-center border-4 border-dashed border-white/[0.02] bg-transparent rounded-[5rem] backdrop-blur-sm">
        <Trophy className="h-32 w-32 text-white/5 mx-auto mb-10 opacity-30" />
        <p className="text-white/20 text-2xl font-black italic max-w-xl mx-auto uppercase tracking-tighter leading-tight opacity-40">Hierarchy synchronization in progress. Tournament standings are computed dynamically from validated match outcomes.</p>
      </Card>
    </div>
  );
}
