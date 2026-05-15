import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Calendar, 
  Users, 
  ChevronRight, 
  Target, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  MapPin
} from "lucide-react";
import { getImageUrl } from "../utils/images";

type HomeData = {
  upcoming_match: null | {
    id: number;
    team_a_name: string;
    team_b_name: string;
    team_a_score?: number;
    team_b_score?: number;
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-24"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />
        
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div variants={itemVariants} className="relative z-10">
            <Badge variant="accent" className="mb-6 py-1 px-4">
              <Zap className="mr-2 h-3 w-3 fill-current" />
              Tournament Season 2026
            </Badge>
            <h1 className="text-gradient text-5xl font-black leading-[1.1] md:text-7xl">
              Dominate the <br />
              <span className="text-gradient-accent">Futsal Court.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/60 leading-relaxed">
              Experience the fastest game on the pitch. Join the elite community of futsal players, 
              track your stats, and compete for the championship trophy.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Get Started <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/schedule">
                <Button variant="secondary" size="lg" className="gap-2">
                  View Fixtures
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="relative lg:ml-auto"
          >
            <div className="relative z-10 rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
              <div className="overflow-hidden rounded-2xl bg-navy-light/50">
                <div className="aspect-[4/3] w-full bg-pitch-pattern bg-cover bg-center flex items-center justify-center">
                  <Trophy className="h-32 w-32 text-accent/20 animate-pulse-slow" />
                </div>
              </div>
              
              {/* Stats Overlay Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 rounded-2xl border border-white/10 bg-navy/90 p-4 shadow-2xl backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20 text-gold">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">League Leader</p>
                    <p className="font-bold text-white">Striker FC</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Info Grid */}
      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="text-accent h-5 w-5" />
                Upcoming Match
              </h2>
              <Badge variant="gold">LIVE SOON</Badge>
            </div>
            
            {err && <p className="text-sm text-red-400">{err}</p>}
            {!data && !err && <div className="h-24 animate-pulse rounded-lg bg-white/5" />}
            
            {data?.upcoming_match && (
              <Link to={`/matches/${data.upcoming_match.id}`} className="block group">
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-center flex-1">
                      <p className="text-sm font-bold text-white/40 mb-2 truncate uppercase tracking-tighter">Team A</p>
                      <p className="text-lg font-black text-white leading-tight group-hover:text-accent transition-colors">{data.upcoming_match.team_a_name}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      {data.upcoming_match.status === 'live' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-white">{data.upcoming_match.team_a_score}</span>
                          <span className="text-xs font-black text-accent animate-pulse">LIVE</span>
                          <span className="text-2xl font-black text-white">{data.upcoming_match.team_b_score}</span>
                        </div>
                      ) : (
                        <div className="px-3 py-1 rounded bg-white/5 border border-white/10 font-black text-gold italic">VS</div>
                      )}
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-sm font-bold text-white/40 mb-2 truncate uppercase tracking-tighter">Team B</p>
                      <p className="text-lg font-black text-white leading-tight group-hover:text-accent transition-colors">{data.upcoming_match.team_b_name}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-sm">
                    <span className="text-white/40">{new Date(data.upcoming_match.match_date).toLocaleDateString()}</span>
                    <span className="text-white/40 flex items-center gap-1"><MapPin className="h-3 w-3" /> {data.upcoming_match.venue}</span>
                  </div>
                </div>
              </Link>
            )}
            {data && !data.upcoming_match && (
              <p className="text-white/40 italic">No scheduled matches at the moment.</p>
            )}
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Target className="text-accent h-5 w-5" />
              Latest Result
            </h2>
            {data?.latest_result ? (
              <Link to={`/matches/${data.latest_result.id}`} className="block group">
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-white/10 transition-colors">
                    <div className="text-center">
                      <p className="text-xs font-bold text-white/40 uppercase mb-1">{data.latest_result.team_a_name}</p>
                      <span className="text-4xl font-black text-accent">{data.latest_result.team_a_score ?? "0"}</span>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10" />
                    <div className="text-center">
                      <p className="text-xs font-black text-white/40 uppercase mb-1">{data.latest_result.team_b_name}</p>
                      <span className="text-4xl font-black text-white">{data.latest_result.team_b_score ?? "0"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-white/20 uppercase tracking-widest px-1">
                    <span>Full Time</span>
                    <span>View Highlights</span>
                  </div>
                </div>
              </Link>
            ) : (
              <p className="text-white/40 italic">Waiting for the first whistle.</p>
            )}
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Users className="text-accent h-5 w-5" />
              Top Scorer
            </h2>
            <div className="space-y-3">
              {(data?.top_players ?? []).slice(0, 3).map((p, i) => (
                <div
                  key={p.user_id}
                  className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-transparent hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-navy-light overflow-hidden border border-white/10">
                      {p.photo ? (
                        <img src={getImageUrl(p.photo)!} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white/20">
                          {p.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-white/30 uppercase">{p.position || "Forward"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-accent">{p.goals}</p>
                    <p className="text-[10px] text-white/20 uppercase">Goals</p>
                  </div>
                </div>
              ))}
              {data && data.top_players.length === 0 && (
                <p className="text-white/40 italic">Competition hasn't started yet.</p>
              )}
              {data && data.top_players.length > 0 && (
                <Link to="/leaderboard" className="block text-center mt-4">
                  <Button variant="ghost" size="sm" className="w-full">View Full Leaderboard</Button>
                </Link>
              )}
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-3xl font-black text-white md:text-5xl">Why Play With Us?</h2>
          <p className="mt-4 text-white/40">Professional tournament management for the modern athlete.</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Fair Play", desc: "Strictly enforced rules and professional refereeing for every match." },
            { icon: Zap, title: "Live Updates", desc: "Real-time score tracking and automatic leaderboard updates." },
            { icon: Trophy, title: "Elite Rewards", desc: "Trophies, medals, and glory for the winning teams each season." },
          ].map((feature, i) => (
            <motion.div key={i} variants={itemVariants}>
              <div className="group relative rounded-2xl border border-white/5 bg-white/5 p-8 text-center transition-all hover:-translate-y-2 hover:bg-white/[0.07]">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-[2rem] border border-accent/20 bg-accent/5 p-12 text-center md:p-24">
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,200,83,0.1),transparent_70%)]" />
        <motion.div variants={itemVariants} className="relative z-10">
          <h2 className="text-4xl font-black text-white md:text-6xl">Ready to take the field?</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            Join hundreds of players already competing in the Futsal Arena. 
            Registration is free and takes less than 2 minutes.
          </p>
          <div className="mt-10">
            <Link to="/register">
              <Button size="lg" className="px-12 py-4 text-lg">Create Your Profile</Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
