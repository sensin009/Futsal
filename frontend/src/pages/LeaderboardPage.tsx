import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { motion } from "framer-motion";
import { Trophy, Target, TrendingUp } from "lucide-react";

type Scorer = {
  user_id: number;
  name: string;
  goals: number;
  assists: number;
  position: string | null;
  photo: string | null;
};

type TeamRow = {
  id: number;
  team_name: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export function LeaderboardPage() {
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [teams, setTeams] = useState<TeamRow[]>([]);

  useEffect(() => {
    void Promise.all([
      api.get<Scorer[]>("/leaderboard/top-scorers?limit=15").then((r) => setScorers(r.data)),
      api.get<TeamRow[]>("/leaderboard/teams").then((r) => setTeams(r.data)),
    ]);
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
          <Badge variant="accent" className="mb-2">Tournament Stats</Badge>
          <h1 className="text-gradient text-4xl font-black">Hall of Fame</h1>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2">
            <Trophy className="h-5 w-5 text-gold" />
            <span className="text-sm font-bold text-white/60">Season 1</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.section variants={itemVariants}>
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Top Goal Scorers</h2>
            </div>
            
            <div className="space-y-2">
              {scorers.map((s, i) => (
                <div
                  key={s.user_id}
                  className="group flex items-center justify-between rounded-xl bg-white/5 p-4 border border-transparent hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${
                      i === 0 ? "bg-gold text-navy" : "bg-navy-light text-white/40"
                    }`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-white group-hover:text-accent transition-colors">{s.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-white/30">{s.position || "Player"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs font-bold text-white/40 uppercase">Goals</p>
                      <p className="text-lg font-black text-accent leading-none">{s.goals}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white/40 uppercase">Assists</p>
                      <p className="text-lg font-black text-white/60 leading-none">{s.assists}</p>
                    </div>
                  </div>
                </div>
              ))}
              {scorers.length === 0 && <p className="text-white/40 italic py-8 text-center">No scores recorded yet.</p>}
            </div>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants}>
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">League Standings</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/30">
                    <th className="pb-4 pr-4">Pos</th>
                    <th className="pb-4">Team Name</th>
                    <th className="pb-4 text-center">P</th>
                    <th className="pb-4 text-center">W</th>
                    <th className="pb-4 text-center">D</th>
                    <th className="pb-4 text-center">L</th>
                    <th className="pb-4 text-center">GD</th>
                    <th className="pb-4 text-right">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {teams.map((t, idx) => (
                    <tr key={t.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pr-4 font-mono font-bold text-gold/60">{idx + 1}</td>
                      <td className="py-4 font-bold text-white group-hover:text-accent transition-colors">{t.team_name}</td>
                      <td className="py-4 text-center text-white/60 font-medium">{t.wins + t.draws + t.losses}</td>
                      <td className="py-4 text-center text-white/60 font-medium">{t.wins}</td>
                      <td className="py-4 text-center text-white/60 font-medium">{t.draws}</td>
                      <td className="py-4 text-center text-white/60 font-medium">{t.losses}</td>
                      <td className="py-4 text-center text-white/60 font-medium">{t.goal_difference}</td>
                      <td className="py-4 text-right">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 font-black text-accent">
                          {t.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {teams.length === 0 && <p className="text-white/40 italic py-8 text-center">No team data available.</p>}
            </div>
          </Card>
        </motion.section>
      </div>
    </motion.div>
  );
}
