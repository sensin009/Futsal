export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-white/10 bg-navy/60 p-8">
      <h1 className="text-3xl font-black text-white">About the club</h1>
      <p className="text-white/80">
        We run a seasonal futsal league with verified player profiles, live match statuses, and
        automated statistics. Facilities include a competition-grade court, locker rooms, and
        first-aid on match days.
      </p>
      <div className="rounded-xl border border-accent/30 bg-pitch/50 p-4">
        <h2 className="font-bold text-gold">Rules (short)</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-white/75">
          <li>Respect referees and opponents — cards are tracked on your profile.</li>
          <li>Arrive 20 minutes before kickoff for kit check.</li>
          <li>Only approved players appear on the public squad list.</li>
        </ul>
      </div>
    </div>
  );
}
