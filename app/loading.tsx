export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-teal-600 to-sky-400 flex items-center justify-center text-white font-bold text-2xl font-display animate-pulse">
          A
        </div>
        <div className="flex gap-1.5">
          <div className="preloader-dot w-2 h-2 rounded-full bg-teal-600" />
          <div className="preloader-dot w-2 h-2 rounded-full bg-teal-600" />
          <div className="preloader-dot w-2 h-2 rounded-full bg-teal-600" />
        </div>
      </div>
    </div>
  );
}
