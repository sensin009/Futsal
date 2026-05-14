import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { motion } from "framer-motion";
import { Info, Shield, CheckCircle2, MapPin } from "lucide-react";

export function AboutPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl space-y-12"
    >
      <div className="text-center">
        <Badge variant="accent" className="mb-4">Our Mission</Badge>
        <h1 className="text-gradient text-5xl font-black">Professional Futsal</h1>
        <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
          We provide a high-performance environment for futsal enthusiasts to compete, 
          grow, and showcase their skills in a professionally managed tournament.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Elite Facilities</h2>
          <p className="text-white/60 leading-relaxed">
            Our arena features a competition-grade court surface optimized for fast-paced 
            futsal. We provide professional-level locker rooms, high-intensity lighting, 
            and on-site first-aid support during all match days.
          </p>
          <div className="flex items-center gap-2 text-sm text-accent font-bold">
            <MapPin className="h-4 w-4" />
            Premier Sports Complex, Sector 4
          </div>
        </Card>

        <Card className="space-y-4 border-gold/20 bg-gold/[0.02]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Code of Conduct</h2>
          <ul className="space-y-3">
            {[
              "Respect referees and opponents — cards are tracked on your profile.",
              "Arrive 20 minutes before kickoff for mandatory kit check.",
              "Only approved players appear on the public squad list.",
              "Fair play and sportsmanship are our top priorities."
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {rule}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card glass={false} className="bg-white/[0.02] border-white/5 p-12 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Have questions?</h3>
        <p className="text-white/40 mb-6">Our administration team is here to help you with registration and match queries.</p>
        <div className="flex justify-center gap-4">
          <Badge variant="outline" className="px-4 py-1.5">contact@futsalarena.com</Badge>
          <Badge variant="outline" className="px-4 py-1.5">+1 (555) 123-4567</Badge>
        </div>
      </Card>
    </motion.div>
  );
}
