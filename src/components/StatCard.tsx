interface StatCardProps {
  title: string;
  value: number;
  accent?: boolean;
}

export function StatCard({ title, value, accent = false }: StatCardProps) {
  return (
    <div
      className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl flex flex-col items-start justify-center transition-colors hover:bg-white/[0.07]"
    >
      <h3 className="text-zinc-400 text-sm font-medium mb-3">{title}</h3>
      <div
        className={`text-5xl font-bold font-space tracking-tight ${
          accent
            ? "text-lime-400 drop-shadow-[0_0_25px_rgba(163,230,53,0.6)]"
            : "text-white"
        }`}
      >
        {value}
      </div>
      {accent && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-lime-500/20 rounded-full blur-3xl pointer-events-none" />
      )}
    </div>
  );
}
