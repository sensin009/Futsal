import { FormEvent, useEffect, useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  LayoutDashboard, 
  User, 
  TrendingUp, 
  Plus, 
  Trophy, 
  LogOut, 
  Shield, 
  Calendar, 
  MapPin,
  Users,
  Camera,
  CheckCircle2,
  Zap,
  ChevronRight,
  Clock,
  XCircle
} from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { getImageUrl } from "../../utils/images";

import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const navCls = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
    isActive 
      ? "bg-accent/10 text-accent shadow-[0_0_20px_rgba(0,200,83,0.1)]" 
      : "text-white/50 hover:text-white hover:bg-white/5"
  }`;

export function UserDashboardLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen bg-navy gradient-mesh">
      <aside className="w-72 shrink-0 border-r border-white/5 bg-navy-dark/50 backdrop-blur-xl p-6 flex flex-col h-screen sticky top-0">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent shadow-lg shadow-accent/20">
            <Activity className="h-6 w-6 text-navy" />
          </div>
          <div>
            <p className="text-sm font-black tracking-tighter text-white uppercase leading-none">Player</p>
            <p className="text-[10px] font-bold tracking-[0.2em] text-accent leading-none mt-1">DASHBOARD</p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-white/5 p-4 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center overflow-hidden">
              {user?.photo ? (
                <img src={getImageUrl(user.photo)!} className="h-full w-full object-cover" />
              ) : (
                <span className="font-bold text-accent">{user?.name?.[0]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-bold text-white leading-none mb-1">{user?.name}</p>
              <p className="truncate text-[9px] text-white/40 uppercase tracking-widest font-black">{user?.status}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <NavLink to="/dashboard" end className={navCls}>
            <LayoutDashboard className="h-4 w-4" /> Overview
          </NavLink>
          <NavLink to="/dashboard/profile" className={navCls}>
            <User className="h-4 w-4" /> My Profile
          </NavLink>
          <NavLink to="/dashboard/scores" className={navCls}>
            <Activity className="h-4 w-4" /> Match Performance
          </NavLink>
          <NavLink to="/dashboard/stats" className={navCls}>
            <TrendingUp className="h-4 w-4" /> Statistics
          </NavLink>
          <NavLink to="/dashboard/edit" className={navCls}>
            <Plus className="h-4 w-4" /> Edit Profile
          </NavLink>
          
          <div className="mt-8 pt-8 border-t border-white/5">
            <Link to="/leaderboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gold hover:text-gold-light transition-colors">
              <Trophy className="h-4 w-4" /> Global Ranking
            </Link>
          </div>
        </nav>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout} 
          className="mt-8 justify-start gap-3 w-full text-white/40 hover:text-red-400 hover:bg-red-400/5"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </aside>
      
      <main className="flex-1 overflow-auto p-10 h-screen scroll-smooth">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

export function UserDashboardHome() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    void api.get<Profile | null>("/me/player-profile").then((r) => setProfile(r.data));
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Badge variant="accent" className="mb-2">Player Portal</Badge>
          <h1 className="text-gradient text-5xl font-black">Welcome back, {(user?.name ?? 'Player').split(' ')[0]}!</h1>
          <p className="mt-2 text-white/50">Everything is in place. Track your stats and view upcoming fixtures.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Current Squad</p>
            <p className="text-sm font-bold text-accent">{profile?.team_name ?? "Free Agent"}</p>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Eligibility</p>
            <p className={`text-sm font-bold ${user?.status === 'approved' ? 'text-accent' : 'text-gold'}`}>{user?.status.toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 relative overflow-hidden group border-white/5 bg-navy-dark/30 backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
            <Activity className="h-40 w-40 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2 tracking-tight">
            <TrendingUp className="h-5 w-5 text-accent" /> Performance Pulse
          </h2>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { label: "Goals", value: profile?.total_goals ?? 0, color: "text-accent" },
              { label: "Assists", value: profile?.total_assists ?? 0, color: "text-gold" },
              { label: "Caps", value: profile?.total_matches ?? 0, color: "text-white" },
              { label: "Form", value: "8.4", color: "text-blue-400" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{stat.label}</p>
                <p className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "75%" }} className="h-full bg-accent shadow-[0_0_15px_rgba(0,200,83,0.6)]" />
          </div>
          <p className="mt-4 text-[11px] text-white/40 italic font-medium">Elevate your game. You're outperforming 85% of peers in your position.</p>
        </Card>

        <Card className="bg-accent/5 border-accent/20 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
          <div>
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Live Action</h2>
            <p className="text-sm text-white/60 mb-8 leading-relaxed">Active fixtures and real-time reporting center.</p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-navy/80 p-5 border border-white/10 shadow-inner">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-3">Next Matchup</p>
              <p className="font-bold text-white text-lg leading-tight">View live scores and reporting options</p>
              <div className="h-1 w-full bg-white/5 mt-4 rounded-full" />
            </div>
            <Link to="/dashboard/scores">
              <Button className="w-full h-12 font-black uppercase tracking-widest text-[10px]">Go to Records</Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Shield, label: "Defensive Rock", desc: "Clean sheet streak active" },
          { icon: Trophy, label: "MVP Status", desc: "Most improved this month" },
          { icon: Activity, label: "Peak Fitness", desc: "95% match completion" },
          { icon: Plus, label: "Goal Hungry", desc: "Next goal unlocks badge" },
        ].map((feat, i) => (
          <Card key={i} className="p-5 flex items-start gap-4 hover:bg-white/[0.05] transition-all cursor-default border-white/5 bg-navy-dark/20">
            <div className="p-3 rounded-xl bg-white/5 text-accent shadow-inner">
              <feat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight">{feat.label}</p>
              <p className="text-[10px] text-white/40 mt-1 font-medium">{feat.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function UserScoresPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportMatch, setReportMatch] = useState<any | null>(null);
  const [form, setForm] = useState({ event_type: "goal", minute: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const load = async () => {
    try {
      const r = await api.get("/me/match-scores");
      setRows(r.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleReport = async (e: FormEvent) => {
    e.preventDefault();
    if (!reportMatch) return;
    setSubmitting(true);
    setMsg(null);
    try {
      await api.post(`/me/match-scores/${reportMatch.match_id}/report`, form);
      setMsg({ text: "PERFORMANCE REPORTED SUCCESSFULLY!", type: "success" });
      setTimeout(() => {
        setReportMatch(null);
        load();
      }, 2000);
    } catch (err: any) {
      setMsg({ text: err.response?.data?.detail || "FAILED TO REPORT PERFORMANCE", type: "error" });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <Badge variant="accent" className="mb-2">Performance Center</Badge>
          <h1 className="text-gradient text-4xl font-black tracking-tight leading-none">Match Records</h1>
          <p className="mt-2 text-white/50">View your contributions and self-report your on-field achievements.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {rows.map((r) => (
          <motion.div key={r.match_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="hover:bg-white/[0.02] transition-all border-white/5 group bg-navy-dark/20 backdrop-blur-xl p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant={r.status === 'live' ? 'accent' : 'outline'} className={r.status === 'live' ? 'animate-pulse' : 'opacity-40'}>
                      {r.status.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{new Date(r.match_date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-3xl font-black text-white group-hover:text-accent transition-colors tracking-tighter leading-none mb-4">
                    {r.team_a_name} <span className="text-white/10 text-xl font-normal italic mx-2">vs</span> {r.team_b_name}
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] text-white/30 font-black uppercase tracking-widest">
                      <MapPin className="h-3.5 w-3.5 text-accent/50" /> {r.venue || "Stadium Arena"}
                    </div>
                    <div className="h-4 w-[1px] bg-white/5" />
                    <div className="flex items-center gap-2 text-[10px] text-accent font-black uppercase tracking-widest">
                      Final: {r.team_a_score} - {r.team_b_score}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-navy/40 p-4 rounded-[2rem] border border-white/5 shadow-inner">
                  <div className="text-center px-6 border-r border-white/10">
                    <p className="text-[9px] font-black text-white/20 mb-2 uppercase tracking-widest">GOALS</p>
                    <p className="text-3xl font-black text-accent tabular-nums">{r.goals}</p>
                  </div>
                  <div className="text-center px-6 border-r border-white/10">
                    <p className="text-[9px] font-black text-white/20 mb-2 uppercase tracking-widest">ASSISTS</p>
                    <p className="text-3xl font-black text-gold tabular-nums">{r.assists}</p>
                  </div>
                  <div className="text-center px-6">
                    <p className="text-[9px] font-black text-white/20 mb-2 uppercase tracking-widest">DISCIPLINE</p>
                    <div className="flex gap-2 justify-center">
                      <div className={`h-5 w-4 rounded-sm ${r.yellow_card > 0 ? "bg-gold shadow-[0_0_15px_rgba(255,193,7,0.5)]" : "bg-white/5"}`} />
                      <div className={`h-5 w-4 rounded-sm ${r.red_card > 0 ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-white/5"}`} />
                    </div>
                  </div>
                  <div className="ml-4 pl-4 border-l border-white/10">
                    {r.status !== 'finished' && (
                      <Button variant="secondary" size="sm" onClick={() => setReportMatch(r)} className="h-12 px-6 font-black text-[10px] tracking-widest uppercase">
                        Self-Report Goal
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {rows.length === 0 && !loading && (
          <Card className="text-center py-32 bg-white/[0.01] border-dashed border-white/10 rounded-[3rem]">
            <Activity className="mx-auto h-16 w-16 text-white/5 mb-6" />
            <p className="text-lg text-white/20 font-black italic tracking-tight uppercase">Operational silence. No match history found.</p>
          </Card>
        )}
      </div>

      <AnimatePresence>
        {reportMatch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-navy/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-lg">
              <Card className="p-10 border-accent/20 bg-navy shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none mb-2">Self-Reporting Tool</h2>
                    <p className="text-sm text-white/40 italic">Report your goal or assist for official verification.</p>
                  </div>
                  <button onClick={() => setReportMatch(null)} className="text-white/20 hover:text-white"><XCircle className="h-6 w-6" /></button>
                </div>

                <form onSubmit={handleReport} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Event Classification</label>
                    <div className="flex p-2 rounded-2xl bg-navy-dark border border-white/5 shadow-inner">
                      <button type="button" onClick={() => setForm({ ...form, event_type: 'goal' })} className={`flex-1 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all ${form.event_type === 'goal' ? 'bg-accent text-navy shadow-lg' : 'text-white/30 hover:text-white'}`}>GOAL</button>
                      <button type="button" onClick={() => setForm({ ...form, event_type: 'assist' })} className={`flex-1 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all ${form.event_type === 'assist' ? 'bg-gold text-navy shadow-lg' : 'text-white/30 hover:text-white'}`}>ASSIST</button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Match Minute (Approx.)</label>
                    <div className="relative">
                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <input type="number" className="w-full rounded-2xl border border-white/5 bg-navy-dark pl-12 pr-6 py-5 text-white font-black outline-none focus:border-accent/50" value={form.minute} onChange={(e) => setForm({ ...form, minute: Number(e.target.value) })} required />
                    </div>
                  </div>

                  <AnimatePresence>
                    {msg && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`flex items-center gap-4 p-5 rounded-2xl text-[10px] font-black tracking-widest uppercase ${msg.type === 'success' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {msg.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        {msg.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button type="submit" className="w-full py-6 text-xs font-black uppercase tracking-[0.3em] shadow-2xl" isLoading={submitting}>SUBMIT REPORT</Button>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function UserStatsPage() {
  const [p, setP] = useState<Profile | null>(null);
  useEffect(() => {
    void api.get<Profile | null>("/me/player-profile").then((r) => setP(r.data));
  }, []);

  if (!p) return (
    <Card className="text-center py-32 bg-white/[0.01] border-dashed border-white/10 rounded-[3rem]">
      <TrendingUp className="mx-auto h-16 w-16 text-white/5 mb-6" />
      <p className="text-lg text-white/20 font-black italic tracking-tight uppercase">Statistical data pending initialization.</p>
    </Card>
  );

  return (
    <div className="space-y-10">
      <div>
        <Badge variant="accent" className="mb-2">Advanced Metrics</Badge>
        <h1 className="text-gradient text-4xl font-black">Performance Analytics</h1>
        <p className="mt-2 text-white/50">In-depth breakdown of your professional trajectory and on-field efficiency.</p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Goals", value: p.total_goals, color: "text-accent", icon: Zap },
          { label: "Assists", value: p.total_assists, color: "text-gold", icon: Activity },
          { label: "Matches", value: p.total_matches, color: "text-white", icon: Calendar },
          { label: "Yellow", value: p.yellow_cards, color: "text-orange-400", icon: Shield },
          { label: "Red", value: p.red_cards, color: "text-red-500", icon: Shield },
        ].map((stat) => (
          <Card key={stat.label} className="text-center group transition-all hover:border-accent/30 bg-navy-dark/20 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -top-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="h-12 w-12" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">{stat.label}</p>
            <p className={`text-5xl font-black ${stat.color} transition-transform group-hover:scale-110 tracking-tighter`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <Card className="p-10 border-white/5 bg-navy-dark/30 backdrop-blur-xl">
          <h3 className="text-lg font-black text-white mb-10 flex items-center gap-3 italic uppercase tracking-tighter leading-none">
            <Activity className="h-5 w-5 text-accent" /> Efficiency Matrix
          </h3>
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest leading-none">
                <span className="text-white/30">Goal Production (per match)</span>
                <span className="text-accent">{((p.total_goals / (p.total_matches || 1)) * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(p.total_goals / (p.total_matches || 1)) * 100}%` }} className="h-full bg-accent shadow-[0_0_15px_rgba(0,200,83,0.5)]" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest leading-none">
                <span className="text-white/30">Assist Conversion (per match)</span>
                <span className="text-gold">{((p.total_assists / (p.total_matches || 1)) * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(p.total_assists / (p.total_matches || 1)) * 100}%` }} className="h-full bg-gold shadow-[0_0_15px_rgba(255,193,7,0.5)]" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-10 bg-accent/5 border-accent/20 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <Trophy className="h-40 w-40 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white mb-6 tracking-tight uppercase leading-none">Elite Milestones</h3>
            <p className="text-sm text-white/50 mb-10 leading-relaxed font-medium italic">
              Computational projection: You are approximately <span className="text-white font-black underline">4 goal-contributions</span> away from the "Elite Playmaker" status. 
              Consistent performance in upcoming fixtures will bridge this gap.
            </p>
          </div>
          <div className="flex items-center gap-6 p-6 rounded-3xl bg-navy/40 border border-white/5 shadow-inner">
            <div className="h-16 w-16 rounded-full border-4 border-accent border-t-transparent animate-spin-slow" />
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Current Objective</p>
              <p className="text-lg font-black text-accent tracking-tighter leading-none">Apex Striker Phase II (96/100)</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function UserEditProfilePage() {
  const [photo, setPhoto] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("midfielder");
  const [jersey, setJersey] = useState<number | "">("");
  const [msg, setMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post<{ url: string }>("/uploads/image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setPhoto(res.data.url);
      setMsg({ text: "IMAGE UPLOADED", type: "success" });
    } catch { setMsg({ text: "UPLOAD FAILURE", type: "error" }); }
    finally { setUploading(false); }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setIsSubmitting(true);
    try {
      await api.put("/me/player-profile", {
        photo: photo || null,
        age: age === "" ? null : age,
        phone: phone || null,
        position,
        jersey_number: jersey === "" ? null : jersey,
      });
      setMsg({ text: "PROFILE CALIBRATED", type: "success" });
    } catch { setMsg({ text: "MODIFICATION FAILURE", type: "error" }); }
    finally { setIsSubmitting(false); }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div>
        <Badge variant="accent" className="mb-2">Identity Hub</Badge>
        <h1 className="text-gradient text-5xl font-black tracking-tighter leading-none">Edit Player Identity</h1>
        <p className="mt-4 text-white/50 text-lg">Calibrate your professional details and field preferences.</p>
      </div>

      <Card className="p-12 border-white/5 bg-navy-dark/30 backdrop-blur-xl shadow-2xl">
        <form className="space-y-12" onSubmit={save}>
          <div className="flex flex-col items-center gap-8 pb-12 border-b border-white/5">
            <div className="relative group">
              <div className="h-40 w-40 rounded-[3rem] bg-white/5 border-2 border-dashed border-accent/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-accent shadow-inner">
                {photo ? (
                  <img src={getImageUrl(photo)!} alt="Preview" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <Camera className="h-10 w-10 text-white/10" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-3 -right-3 h-14 w-14 rounded-2xl bg-accent text-navy flex items-center justify-center cursor-pointer shadow-[0_20px_40px_rgba(0,200,83,0.3)] hover:scale-110 transition-transform duration-500">
                <Plus className="h-7 w-7" />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-white tracking-tight uppercase leading-none mb-2">Visual Identity</p>
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Maximum fidelity: 5MB</p>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Official Jersey #</label>
              <div className="relative">
                <Trophy className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10" />
                <input type="number" className="w-full rounded-2xl border border-white/5 bg-navy/50 pl-16 pr-6 py-5 text-white font-black outline-none focus:border-accent/50 shadow-inner" placeholder="99" value={jersey} onChange={(e) => setJersey(e.target.value === "" ? "" : Number(e.target.value))} />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Chrono Age</label>
              <div className="relative">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10" />
                <input type="number" className="w-full rounded-2xl border border-white/5 bg-navy/50 pl-16 pr-6 py-5 text-white font-black outline-none focus:border-accent/50 shadow-inner" placeholder="24" value={age} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))} />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Communication Channel</label>
              <div className="relative">
                <Activity className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10" />
                <input className="w-full rounded-2xl border border-white/5 bg-navy/50 pl-16 pr-6 py-5 text-white font-black outline-none focus:border-accent/50 shadow-inner" placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Field Specialization</label>
              <div className="relative">
                <Shield className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10" />
                <select className="w-full appearance-none rounded-2xl border border-white/5 bg-navy/50 pl-16 pr-6 py-5 text-white font-black outline-none focus:border-accent/50 uppercase tracking-widest shadow-inner cursor-pointer" value={position} onChange={(e) => setPosition(e.target.value)}>
                  {["goalkeeper", "defender", "midfielder", "attacker"].map((pos) => <option key={pos} value={pos} className="bg-navy">{pos.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {msg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`flex items-center gap-5 p-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] ${msg.type === 'success' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {msg.type === 'success' ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                {msg.text}
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" className="w-full py-6 text-xs font-black uppercase tracking-[0.6em] shadow-[0_32px_64px_-16px_rgba(0,200,83,0.3)] bg-gradient-to-r from-accent to-accent-dark rounded-3xl" isLoading={isSubmitting || uploading}>COMMIT CHANGES</Button>
        </form>
      </Card>
    </div>
  );
}

export function UserProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    void api.get<Profile | null>("/me/player-profile").then((r) => setProfile(r.data));
  }, []);

  if (!profile) return <div className="p-20 text-center text-white/20">Loading profile identity...</div>;

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12 items-center md:items-end">
        <div className="h-48 w-48 rounded-[4rem] bg-white/5 border-2 border-accent/20 overflow-hidden shadow-2xl">
          {profile.photo ? (
            <img src={getImageUrl(profile.photo)!} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-6xl font-black text-white/10 uppercase">{profile.team_name?.[0] || 'P'}</div>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <Badge variant="accent" className="mb-4">Verified Athlete</Badge>
          <h1 className="text-6xl font-black text-white tracking-tighter leading-none mb-4 uppercase italic">Pro Identity</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
            <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-accent" /> {profile.team_name || "Free Agent"}</span>
            <span className="flex items-center gap-2"><Trophy className="h-4 w-4 text-gold" /> #{profile.jersey_number || "00"}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-10 border-white/5 bg-white/[0.01] backdrop-blur-xl">
          <h3 className="text-xs font-black uppercase text-accent mb-8 tracking-[0.5em] flex items-center gap-4 italic"><User className="h-5 w-5" /> Biological Data</h3>
          <div className="space-y-6">
            {[
              { label: "Designation", val: profile.position || "Undisclosed" },
              { label: "Chrono Age", val: profile.age ? `${profile.age} Years` : "Unknown" },
              { label: "Contact Hash", val: profile.phone || "Private" },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{item.label}</span>
                <span className="text-sm font-bold text-white tracking-tight">{item.val}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-10 border-white/5 bg-accent/5 relative overflow-hidden flex flex-col justify-center text-center">
          <div className="absolute inset-0 bg-pitch-pattern opacity-5" />
          <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-4">Current Form</p>
          <p className="text-7xl font-black text-white tracking-tighter mb-4 italic uppercase">Elite</p>
          <p className="text-xs text-white/40 font-medium italic">Validated performance metrics indicate peak physical condition and tactical awareness.</p>
        </Card>
      </div>
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
  team_id: number | null;
  team_name: string | null;
  total_goals: number;
  total_assists: number;
  total_matches: number;
  yellow_cards: number;
  red_cards: number;
};
