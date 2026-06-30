"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RouteProgress() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  // Start bar on any internal link click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      clearTimers();
      setFading(false);
      setWidth(0);
      setVisible(true);
      // Double rAF ensures width:0 renders before transition to 78 starts
      requestAnimationFrame(() => requestAnimationFrame(() => setWidth(78)));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Complete bar when pathname changes
  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;
    clearTimers();
    setWidth(100);
    timers.current.push(setTimeout(() => setFading(true), 180));
    timers.current.push(setTimeout(() => { setVisible(false); setFading(false); setWidth(0); }, 580));
    return clearTimers;
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[200] h-[3px] pointer-events-none transition-opacity duration-[400ms] ease-in-out ${fading ? "opacity-0" : "opacity-100"}`}
    >
      <div
        className="h-full bg-sky-400 shadow-progress-glow"
        style={{
          width: `${width}%`,
          transition: width === 0 ? "none" : width <= 78 ? "width 0.9s cubic-bezier(0.1,0.5,0.3,1)" : "width 0.25s ease-in",
        }}
      />
    </div>
  );
}
