export default function DashboardLoading() {
  return (
    <div className="p-7">
      <div className="animate-pulse">
        <div className="h-7 w-56 rounded-lg bg-dash-surface-3" />
        <div className="mt-2 h-4 w-80 rounded bg-dash-surface-3" />
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-dash-surface-3" />
          ))}
        </div>
        <div className="mt-5 h-64 rounded-2xl bg-dash-surface-3" />
      </div>
    </div>
  );
}
