import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { motion } from "framer-motion";
import { Users, User, Shield, Target, Activity } from "lucide-react";
import { getImageUrl } from "../utils/images";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
};

export function PlayersPage() {
  const [rows, setRows] = useState<PlayerRow[]>([]);
  useEffect(() => {
    void api.get<PlayerRow[]>("/players").then((r) => setRows(r.data));
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
          <Badge variant="accent" className="mb-2">Player Directory</Badge>
          <h1 className="text-gradient text-4xl font-black">Professional Roster</h1>
          <p className="mt-2 text-white/50 max-w-xl">Meet the athletes competing in this season's championship. Every profile is verified by tournament officials.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2">
          <Users className="h-5 w-5 text-accent" />
          <span className="text-sm font-bold text-white/60">{rows.length} Approved Players</span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((p) => (
          <motion.div key={p.user_id} variants={itemVariants}>
            <Card className="group overflow-hidden p-0">
              <div className="relative h-32 bg-gradient-to-br from-accent/20 via-navy-light to-navy">
                <div className="absolute inset-0 bg-pitch-pattern opacity-20" />
                <div className="absolute -bottom-6 left-6 h-20 w-20 rounded-2xl bg-navy border-4 border-navy-light shadow-xl overflow-hidden flex items-center justify-center">
                  {p.photo ? (
                    <img src={getImageUrl(p.photo)!} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-white/20" />
                  )}
                </div>
                {p.jersey_number && (
                  <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-xl font-black text-gold">
                    {p.jersey_number}
                  </div>
                )}
              </div>

              <div className="px-6 pb-6 pt-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{p.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="h-3 w-3 text-gold" />
                      <span className="text-xs font-bold uppercase tracking-widest text-gold/80">{p.position ?? "Squad Member"}</span>
                    </div>
                  </div>
                  {p.age && <Badge variant="outline">{p.age} Yrs</Badge>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                    <div className="flex items-center gap-1.5 mb-1 text-white/30">
                      <Target className="h-3 w-3" />
                      <span className="text-[10px] font-black uppercase">Goals</span>
                    </div>
                    <p className="text-lg font-black text-white">{p.total_goals}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                    <div className="flex items-center gap-1.5 mb-1 text-white/30">
                      <Activity className="h-3 w-3" />
                      <span className="text-[10px] font-black uppercase">Ast</span>
                    </div>
                    <p className="text-lg font-black text-white">{p.total_assists}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                    <div className="flex items-center gap-1.5 mb-1 text-white/30">
                      <Users className="h-3 w-3" />
                      <span className="text-[10px] font-black uppercase">Caps</span>
                    </div>
                    <p className="text-lg font-black text-white">{p.total_matches}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {rows.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <Users className="mx-auto h-12 w-12 text-white/10 mb-4" />
            <p className="text-white/40 italic">No players have been approved for the roster yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
