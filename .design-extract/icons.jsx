// Reusable icon set for dashboard.
const DashIcon = ({name, size=18, stroke=1.8, fill="none", className, style, onClick}) => {
  const common = {
    width:size, height:size, viewBox:"0 0 24 24",
    fill, stroke:"currentColor", strokeWidth:stroke,
    strokeLinecap:"round", strokeLinejoin:"round",
    className, style, onClick
  };
  const P = {
    grid:<><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></>,
    calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    users:<><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M22 20a6 6 0 0 0-4-5.6"/></>,
    user:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    stethoscope:<><path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M10 13v3a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="14" r="2"/></>,
    search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    bell:<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    plus:<><path d="M12 5v14M5 12h14"/></>,
    chevron:<><path d="m6 9 6 6 6-6"/></>,
    chevronRight:<><path d="m9 6 6 6-6 6"/></>,
    chevronLeft:<><path d="m15 6-6 6 6 6"/></>,
    moreH:<><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></>,
    moreV:<><circle cx="12" cy="5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="19" r="1.4" fill="currentColor"/></>,
    sidebar:<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></>,
    sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    moon:<><path d="M21 13A9 9 0 0 1 11 3a8 8 0 1 0 10 10z"/></>,
    logout:<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    arrow:<><path d="M5 12h14M13 5l7 7-7 7"/></>,
    arrowSmall:<><path d="M5 12h12M11 6l6 6-6 6"/></>,
    arrowUp:<><path d="M12 19V5M5 12l7-7 7 7"/></>,
    arrowDown:<><path d="M12 5v14M19 12l-7 7-7-7"/></>,
    check:<><path d="m5 13 4 4L20 6"/></>,
    x:<><path d="M6 6l12 12M18 6 6 18"/></>,
    phone:<><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></>,
    mail:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    pin:<><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></>,
    filter:<><path d="M3 4h18l-7 9v6l-4 2v-8z"/></>,
    download:<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></>,
    eye:<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    edit:<><path d="M11 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4z"/></>,
    bed:<><path d="M3 18V8M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/></>,
    heart:<><path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z"/></>,
    ambulance:<><rect x="2" y="8" width="14" height="9" rx="1"/><path d="M16 11h3l3 3v3h-6"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M9 11h2m-1-1v2"/></>,
    flask:<><path d="M9 3h6M10 3v6L4 19a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 19l-6-10V3"/><path d="M7.5 14h9"/></>,
    blood:<><path d="M12 3s-6 7-6 12a6 6 0 0 0 12 0c0-5-6-12-6-12z"/></>,
    activity:<><path d="M3 12h4l3-7 4 14 3-7h4"/></>,
    siren:<><path d="M5 18h14M6 18a6 6 0 0 1 12 0M12 4v3M19 7l-2 2M5 7l2 2"/></>,
    list:<><path d="M3 6h18M3 12h18M3 18h18"/></>,
    columns:<><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/></>,
    cmd:<><path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z"/></>,
    upload:<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></>,
    star:<><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.9z"/></>,
    pill:<><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-45 12 12)"/><path d="M8.5 8.5l7 7"/></>,
    mountain:<><path d="m3 20 6-9 4 5 3-4 5 8z"/><circle cx="17" cy="6" r="1.5"/></>,
    refresh:<><path d="M3 12a9 9 0 0 1 15.4-6.4L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.4 6.4L3 16M3 21v-5h5"/></>,
    print:<><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/></>,
  };
  return <svg {...common}>{P[name]||P.check}</svg>;
};

// Avatar tone palette — deterministic per name
const AV_TONES = [
  ["#F59E0B","#DC2626"], ["#0D9488","#38BDF8"], ["#7C3AED","#EC4899"],
  ["#0891B2","#0D9488"], ["#E11D48","#F97316"], ["#15803D","#65A30D"],
  ["#2563EB","#7C3AED"], ["#DB2777","#E11D48"], ["#0369A1","#06B6D4"],
];
const avatarTone = (name) => {
  let h=0; for (let i=0;i<name.length;i++) h = (h*31 + name.charCodeAt(i)) % AV_TONES.length;
  return AV_TONES[Math.abs(h)];
};
const initials = (name) => {
  const p = name.replace(/^Dr\.\s*/,"").split(" ");
  return ((p[0]?.[0]||"") + (p[1]?.[0]||"")).toUpperCase();
};
const Avatar = ({name, size=34, fontSize}) => {
  const [a,b] = avatarTone(name);
  return <div style={{
    width:size, height:size, borderRadius:999,
    background:`linear-gradient(135deg, ${a}, ${b})`,
    color:"#fff", fontFamily:'"Plus Jakarta Sans"', fontWeight:700,
    fontSize: fontSize ?? Math.max(11, size*0.36),
    display:"flex", alignItems:"center", justifyContent:"center",
    flexShrink:0
  }}>{initials(name)}</div>;
};

window.DashIcon = DashIcon;
window.Avatar = Avatar;
window.initials = initials;
window.avatarTone = avatarTone;
