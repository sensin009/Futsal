import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, Trophy, Play } from "lucide-react";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

export function SchedulePage() {
  const [rows, setRows] = useState<MatchRow[]>([]);
  useEffect(() => {
    void api.get<MatchRow[]>("/matches").then((r) => setRows(r.data));
  }, []);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="accent" className="mb-2">Match Schedule</Badge>
          <h1 className="text-gradient text-4xl font-black">Fixtures & Results</h1>
          <p className="mt-2 text-white/50 max-w-xl">Stay updated with the latest match schedules, live scores, and tournament results.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2">
          <Calendar className="h-5 w-5 text-accent" />
          <span className="text-sm font-bold text-white/60">{rows.length} Total Matches</span>
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((m) => (
          <motion.div key={m.id} variants={itemVariants}>
            <Link to={`/matches/${m.id}`}>
              <Card 
                className={`group overflow-hidden transition-all hover:translate-x-1 hover:border-accent/50 ${
                  m.is_today ? "border-accent/30 bg-accent/[0.02]" : ""
                }`}
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                  {/* Date/Time Column */}
                  <div className="flex flex-row items-center gap-4 lg:flex-col lg:items-start lg:gap-1 lg:w-40 lg:shrink-0">
                    <div className="flex items-center gap-2 text-white/40">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {new Date(m.match_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-sm font-bold">
                        {new Date(m.match_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Matchup Column */}
                  <div className="flex-1 flex items-center justify-between gap-4 py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                    <div className="flex-1 text-center lg:text-left">
                      <p className="text-sm font-bold text-white/40 uppercase mb-1">Team A</p>
                      <p className="text-xl font-black text-white group-hover:text-accent transition-colors">{m.team_a_name}</p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 px-6">
                      {m.status === "finished" || m.status === "live" ? (
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-black text-white">{m.team_a_score}</span>
                          <span className="text-white/20 font-black">-</span>
                          <span className="text-3xl font-black text-white">{m.team_b_score}</span>
                        </div>
                      ) : (
                        <div className="px-4 py-1.5 rounded-lg bg-navy border border-white/10 font-black text-gold italic text-sm">VS</div>
                      )}
                    </div>

                    <div className="flex-1 text-center lg:text-right">
                      <p className="text-sm font-bold text-white/40 uppercase mb-1">Team B</p>
                      <p className="text-xl font-black text-white group-hover:text-accent transition-colors">{m.team_b_name}</p>
                    </div>
                  </div>

                  {/* Status Column */}
                  <div className="flex items-center justify-between lg:flex-col lg:items-end lg:justify-center lg:gap-3 lg:w-40 lg:shrink-0">
                    <div className="flex items-center gap-2 text-white/40">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-xs font-bold">{m.venue}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {m.is_today && m.status !== "finished" && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                        </span>
                      )}
                      <Badge variant={
                        m.status === "live" ? "accent" : 
                        m.status === "finished" ? "white" : 
                        "gold"
                      }>
                        {m.status === "live" && <Play className="mr-1 h-3 w-3 fill-current" />}
                        {m.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
        {rows.length === 0 && (
          <div className="py-20 text-center">
            <Calendar className="mx-auto h-12 w-12 text-white/10 mb-4" />
            <p className="text-white/40 italic">No matches scheduled at the moment.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
