import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  ChevronLeft, 
  Activity, 
  Clock,
  User,
  Shield,
  Zap,
  AlertTriangle,
  Ban
} from "lucide-react";

type MatchEvent = {
  id: number;
  event_type: string;
  minute: number;
  player_name: string | null;
  team_name: string;
  description: string | null;
  created_at: string;
};

type MatchDetails = {
  id: number;
  team_a_name: string;
  team_b_name: string;
  team_a_score: number;
  team_b_score: number;
  match_date: string;
  venue: string;
  status: string;
  events: MatchEvent[];
};

export function MatchDetailsPage() {
  const { id } = useParams();
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      api.get<MatchDetails>(`/matches/${id}`).then((r) => {
        setMatch(r.data);
        setLoading(false);
      });
    };
    load();
    const timer = setInterval(load, 30000); // Poll every 30s
    return () => clearInterval(timer);
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full" /></div>;
  if (!match) return <div className="text-center py-20 text-white/40 italic">Match not found.</div>;

  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal": return <Zap className="h-4 w-4 text-accent" />;
      case "assist": return <Activity className="h-4 w-4 text-gold" />;
      case "yellow_card": return <div className="h-4 w-3 bg-gold rounded-sm" />;
      case "red_card": return <div className="h-4 w-3 bg-red-500 rounded-sm" />;
      case "foul": return <AlertTriangle className="h-4 w-4 text-gold" />;
      default: return <Activity className="h-4 w-4 text-white/40" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Link to="/schedule">
        <Button variant="ghost" size="sm" className="gap-2 text-white/40">
          <ChevronLeft className="h-4 w-4" /> Back to Schedule
        </Button>
      </Link>

      {/* Hero Scoreboard */}
      <Card className="relative overflow-hidden p-0 border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-gold/5" />
        <div className="relative z-10 p-8 md:p-12">
          <div className="text-center mb-10">
            <Badge variant={match.status === 'live' ? 'accent' : 'outline'} className={match.status === 'live' ? 'animate-pulse' : ''}>
              {match.status.toUpperCase()}
            </Badge>
            <div className="flex items-center justify-center gap-4 mt-4 text-white/40 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(match.match_date).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {match.venue}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-8 max-w-2xl mx-auto">
            <div className="flex-1 text-center">
              <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <Shield className="h-10 w-10 text-white/20" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">{match.team_a_name}</h2>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-6xl md:text-8xl font-black text-white tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                {match.team_a_score}
              </span>
              <span className="text-2xl font-black text-white/10 italic">VS</span>
              <span className="text-6xl md:text-8xl font-black text-white tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                {match.team_b_score}
              </span>
            </div>

            <div className="flex-1 text-center">
              <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <Shield className="h-10 w-10 text-white/20" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">{match.team_b_name}</h2>
            </div>
          </div>
        </div>
      </Card>

      {/* Match Timeline */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          Match Timeline
        </h3>

        <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          <AnimatePresence initial={false}>
            {match.events.length > 0 ? (
              match.events.map((ev, i) => (
                <motion.div 
                  key={ev.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                >
                  {/* Dot */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-navy-dark shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="text-[10px] font-black text-accent">{ev.minute}'</span>
                  </div>

                  {/* Content */}
                  <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5">
                        {getEventIcon(ev.event_type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white capitalize">{ev.event_type.replace('_', ' ')}</span>
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{ev.team_name}</span>
                        </div>
                        <p className="text-sm text-white/60">
                          {ev.player_name ? <span className="text-accent font-bold">{ev.player_name}</span> : 'Match Event'}
                          {ev.description && <span className="ml-2 italic text-white/30 text-xs">- {ev.description}</span>}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10">
                <Activity className="h-10 w-10 text-white/5 mx-auto mb-4" />
                <p className="text-sm text-white/20 italic">The match has no recorded events yet.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
