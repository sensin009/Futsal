import { FormEvent, useEffect, useState } from "react";
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
  UserCheck
} from "lucide-react";
import { Badge, Button, Card } from "../../components/ui";

import { Link, NavLink, Outlet } from "react-router-dom";
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
      <aside className="w-72 shrink-0 border-r border-white/5 bg-navy-dark/50 backdrop-blur-xl p-6 flex flex-col">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent shadow-lg shadow-accent/20">
            <Activity className="h-6 w-6 text-navy" />
          </div>
          <div>
            <p className="text-sm font-black tracking-tighter text-white uppercase">Player</p>
            <p className="text-[10px] font-bold tracking-[0.2em] text-accent">DASHBOARD</p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-white/5 p-4 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
              <span className="font-bold text-accent">{user?.name?.[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-bold text-white">{user?.name}</p>
              <p className="truncate text-[10px] text-white/40 uppercase tracking-widest">{user?.status}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <NavLink to="/dashboard" end className={navCls}>
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </NavLink>
          <NavLink to="/dashboard/profile" className={navCls}>
            <User className="h-4 w-4" />
            My Profile
          </NavLink>
          <NavLink to="/dashboard/scores" className={navCls}>
            <Activity className="h-4 w-4" />
            My Scores
          </NavLink>
          <NavLink to="/dashboard/stats" className={navCls}>
            <TrendingUp className="h-4 w-4" />
            Statistics
          </NavLink>
          <NavLink to="/dashboard/edit" className={navCls}>
            <Plus className="h-4 w-4" />
            Edit Profile
          </NavLink>
          
          <div className="mt-8 pt-8 border-t border-white/5">
            <Link to="/leaderboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gold hover:text-gold-light transition-colors">
              <Trophy className="h-4 w-4" />
              Global Leaderboard
            </Link>
          </div>
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
          <Badge variant="accent" className="mb-2">Player Overview</Badge>
          <h1 className="text-gradient text-5xl font-black">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="mt-2 text-white/50">Your performance tracking and match insights are ready.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-widest text-white/30">Player Status</p>
            <p className={`text-sm font-bold ${user?.status === 'approved' ? 'text-accent' : 'text-gold'}`}>
              {user?.status.toUpperCase()}
            </p>
          </div>
          <div className={`h-3 w-3 rounded-full ${user?.status === 'approved' ? 'bg-accent animate-pulse' : 'bg-gold'}`} />
        </div>
      </div>

      <AnimatePresence>
        {user?.status === "pending" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
          >
            <Card className="border-gold/20 bg-gold/5 flex items-center gap-4 py-4">
              <Shield className="h-6 w-6 text-gold" />
              <p className="text-sm text-gold-light">
                Your account is currently <span className="font-bold underline">pending approval</span>. 
                Complete your profile and wait for an admin to verify your registration.
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Stats Card */}
        <Card className="lg:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
            <Activity className="h-40 w-40 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Performance Radar
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { label: "Goals", value: profile?.total_goals ?? 0, color: "text-accent" },
              { label: "Assists", value: profile?.total_assists ?? 0, color: "text-gold" },
              { label: "Matches", value: profile?.total_matches ?? 0, color: "text-white" },
              { label: "Rating", value: "8.4", color: "text-blue-400" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{stat.label}</p>
                <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              className="h-full bg-accent shadow-[0_0_10px_rgba(0,200,83,0.5)]"
            />
          </div>
          <p className="mt-4 text-xs text-white/40 italic">You are in the top 15% of attackers this season!</p>
        </Card>

        {/* Action Card */}
        <Card className="bg-accent/5 border-accent/20 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Next Arena</h2>
            <p className="text-sm text-white/60 mb-6">Check your upcoming schedule and prepare for the next match.</p>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl bg-navy/50 p-4 border border-white/5">
              <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-2">Upcoming</p>
              <p className="font-bold text-white">Thunder FC vs Blaze SC</p>
              <p className="text-xs text-accent mt-1">Tomorrow, 18:00</p>
            </div>
            <Link to="/schedule">
              <Button className="w-full">View Schedule</Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Shield, label: "Defensive Mastery", desc: "Clean sheet bonus active" },
          { icon: Trophy, label: "MVP Status", desc: "2 Man of the Match awards" },
          { icon: Activity, label: "High Stamina", desc: "90% match completion rate" },
          { icon: Plus, label: "New Skill", desc: "Unlock with 5 more assists" },
        ].map((feat, i) => (
          <Card key={i} className="p-4 flex items-start gap-4 hover:bg-white/[0.03] transition-colors cursor-default">
            <div className="p-2 rounded-lg bg-white/5 text-accent">
              <feat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{feat.label}</p>
              <p className="text-[10px] text-white/40 mt-1">{feat.desc}</p>
            </div>
          </Card>
        ))}
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

  if (!p) return (
    <Card className="text-center py-20">
      <User className="mx-auto h-12 w-12 text-white/10 mb-4" />
      <p className="text-white/40 italic">No profile data found. Please complete your profile in settings.</p>
      <Link to="/dashboard/edit" className="mt-4 inline-block">
        <Button variant="secondary" size="sm">Edit Profile</Button>
      </Link>
    </Card>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="h-32 w-32 rounded-3xl bg-accent/20 border border-accent/30 flex items-center justify-center text-5xl font-black text-accent shadow-2xl shadow-accent/10">
          {p.photo ? <img src={p.photo} alt="Profile" className="h-full w-full object-cover rounded-3xl" /> : "⚽"}
        </div>
        <div className="flex-1">
          <Badge variant="accent" className="mb-2">Verified Player</Badge>
          <h1 className="text-4xl font-black text-white mb-2">Member Profile</h1>
          <div className="flex flex-wrap gap-4 text-white/40 font-bold text-sm">
            <span className="flex items-center gap-1"><Shield className="h-4 w-4" /> {p.position?.toUpperCase() ?? "UNASSIGNED"}</span>
            <span className="flex items-center gap-1"><Trophy className="h-4 w-4" /> JERSEY #{p.jersey_number ?? "00"}</span>
          </div>
        </div>
        <Link to="/dashboard/edit">
          <Button variant="secondary" className="gap-2">
            <Plus className="h-4 w-4" />
            Update Profile
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="text-lg font-bold text-white mb-6">Personal Details</h3>
          <div className="space-y-4">
            {[
              { label: "Age", value: p.age ? `${p.age} Years` : "Not set", icon: Calendar },
              { label: "Phone", value: p.phone ?? "Not set", icon: Activity },
              { label: "Preferred Position", value: p.position ?? "Not set", icon: Shield },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-accent" />
                  <span className="text-sm text-white/40">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-white/[0.02]">
          <h3 className="text-lg font-bold text-white mb-6">Career Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Goals", value: p.total_goals },
              { label: "Assists", value: p.total_assists },
              { label: "Matches", value: p.total_matches },
              { label: "Win Rate", value: "68%" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl bg-navy/50 border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function UserStatsPage() {
  const [p, setP] = useState<Profile | null>(null);
  useEffect(() => {
    void api.get<Profile | null>("/me/player-profile").then((r) => setP(r.data));
  }, []);

  if (!p) return (
    <Card className="text-center py-20">
      <TrendingUp className="mx-auto h-12 w-12 text-white/10 mb-4" />
      <p className="text-white/40 italic">No statistics available yet.</p>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="accent" className="mb-2">Performance Tracking</Badge>
        <h1 className="text-gradient text-4xl font-black">Career Statistics</h1>
        <p className="mt-2 text-white/50">Comprehensive breakdown of your contribution to the team.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Goals", value: p.total_goals, color: "text-accent" },
          { label: "Assists", value: p.total_assists, color: "text-gold" },
          { label: "Matches", value: p.total_matches, color: "text-white" },
          { label: "Yellow", value: p.yellow_cards, color: "text-orange-400" },
          { label: "Red", value: p.red_cards, color: "text-red-500" },
        ].map((stat) => (
          <Card key={stat.label} className="text-center group transition-all hover:border-accent/30">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">{stat.label}</p>
            <p className={`text-4xl font-black ${stat.color} transition-transform group-hover:scale-110`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="flex flex-col justify-center">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Contributions Ratio
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-white/40">Goals vs Matches</span>
                <span className="text-accent">{((p.total_goals / (p.total_matches || 1)) * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(p.total_goals / (p.total_matches || 1)) * 100}%` }}
                  className="h-full bg-accent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-white/40">Assists vs Matches</span>
                <span className="text-gold">{((p.total_assists / (p.total_matches || 1)) * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(p.total_assists / (p.total_matches || 1)) * 100}%` }}
                  className="h-full bg-gold"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-accent/5 border-accent/20">
          <h3 className="text-lg font-bold text-white mb-4">Milestone Progress</h3>
          <p className="text-sm text-white/60 mb-6 leading-relaxed">
            You are 5 goals away from reaching the <span className="text-white font-bold">100-goal club</span>. 
            Keep up the performance in the upcoming matches!
          </p>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            <div>
              <p className="text-sm font-bold text-white">Next Achievement</p>
              <p className="text-xs text-accent">Centurion Scorer (95/100)</p>
            </div>
          </div>
        </Card>
      </div>
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
    <div className="space-y-8">
      <div>
        <Badge variant="accent" className="mb-2">Match History</Badge>
        <h1 className="text-gradient text-4xl font-black">Performance Records</h1>
        <p className="mt-2 text-white/50">Detailed breakdown of your performance in every match played.</p>
      </div>

      <div className="grid gap-4">
        {rows.map((r) => (
          <motion.div
            key={r.match_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="hover:bg-white/[0.02] transition-colors border-white/5 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-widest text-white/30">
                    <Calendar className="h-3 w-3" />
                    {new Date(r.match_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-accent transition-colors">
                    {r.team_a_name} <span className="text-gold italic mx-1">VS</span> {r.team_b_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">
                    <MapPin className="h-3 w-3" /> Main Stadium Arena
                  </div>
                </div>

                <div className="flex items-center gap-4 py-3 px-6 rounded-2xl bg-navy/50 border border-white/5">
                  <div className="text-center px-4 border-r border-white/5">
                    <p className="text-[10px] font-black text-white/20 mb-1">GOALS</p>
                    <p className="text-2xl font-black text-accent">{r.goals}</p>
                  </div>
                  <div className="text-center px-4 border-r border-white/5">
                    <p className="text-[10px] font-black text-white/20 mb-1">ASSISTS</p>
                    <p className="text-2xl font-black text-gold">{r.assists}</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-[10px] font-black text-white/20 mb-1">CARDS</p>
                    <div className="flex gap-2">
                      <div className={`h-4 w-3 rounded-sm ${r.yellow_card > 0 ? "bg-gold shadow-[0_0_10px_rgba(255,193,7,0.5)]" : "bg-white/5"}`} />
                      <div className={`h-4 w-3 rounded-sm ${r.red_card > 0 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-white/5"}`} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {rows.length === 0 && (
          <Card className="text-center py-20 bg-white/[0.01] border-dashed border-white/10">
            <Activity className="mx-auto h-12 w-12 text-white/10 mb-4" />
            <p className="text-white/40 italic">No score records found. Play a match to see your stats here!</p>
          </Card>
        )}
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
  const [msg, setMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      await api.put("/me/player-profile", {
        photo: photo || null,
        age: age === "" ? null : age,
        phone: phone || null,
        position,
        jersey_number: jersey === "" ? null : jersey,
      });
      setMsg("Profile successfully updated.");
    } catch {
      setMsg("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Badge variant="accent" className="mb-2">Account Settings</Badge>
        <h1 className="text-gradient text-4xl font-black">Edit Player Profile</h1>
        <p className="mt-2 text-white/50">Update your on-field details and contact information.</p>
      </div>

      <Card className="p-8">
        <form className="space-y-6" onSubmit={save}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Photo URL</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white outline-none focus:border-accent/50 transition-all"
                  placeholder="https://example.com/photo.jpg"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Jersey Number</label>
              <div className="relative">
                <Trophy className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                <input
                  type="number"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white outline-none focus:border-accent/50 transition-all"
                  placeholder="07"
                  value={jersey}
                  onChange={(e) => setJersey(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Age</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                <input
                  type="number"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white outline-none focus:border-accent/50 transition-all"
                  placeholder="24"
                  value={age}
                  onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Phone Number</label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white outline-none focus:border-accent/50 transition-all"
                  placeholder="+1 234 567 890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Preferred Position</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
              <select
                className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white outline-none focus:border-accent/50 transition-all"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                {["goalkeeper", "defender", "midfielder", "attacker"].map((pos) => (
                  <option key={pos} value={pos} className="bg-navy">
                    {pos.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <AnimatePresence>
            {msg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl text-sm font-bold ${msg.includes('success') ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
              >
                {msg}
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" className="w-full py-4 text-base" isLoading={isSubmitting}>
            Save Profile Data
          </Button>
        </form>
      </Card>
    </div>
  );
}
