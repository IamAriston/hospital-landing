// Sidebar + Topbar + dark-mode hook.
const { useState, useEffect, useMemo, useRef } = React;

// Persistent dark mode
const useDarkMode = () => {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("astha-dark") === "1"; } catch(e) { return false; }
  });
  useEffect(()=>{
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    try { localStorage.setItem("astha-dark", dark ? "1" : "0"); } catch(e){}
  }, [dark]);
  return [dark, setDark];
};

// Time-of-day greeting
const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
};
const todayLabel = () => {
  const d = new Date();
  return d.toLocaleDateString("en-IN", {weekday:"long", day:"numeric", month:"long", year:"numeric"});
};

// --- Sidebar ---
const NAV = [
  {key:"overview",     label:"Dashboard",      icon:"grid"},
  {key:"appointments", label:"Appointments",   icon:"calendar", badge:12},
  {key:"opd",          label:"Today's OPD",    icon:"clock"},
  {key:"patients",     label:"Patient Records",icon:"users"},
  {key:"doctors",      label:"Doctor Roster",  icon:"stethoscope"},
];
const NAV_SECONDARY = [
  {key:"settings", label:"Settings", icon:"settings"},
];

const Sidebar = ({page, setPage, collapsed, setCollapsed}) => {
  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="mark">A</div>
        <div>
          <div className="sb-name">Astha</div>
          <div className="sb-sub">Staff Portal</div>
        </div>
      </div>

      <div className="sb-section-label">Main</div>
      <nav className="sb-nav">
        {NAV.map(item=>(
          <a key={item.key}
             className={"sb-item" + (page===item.key ? " active" : "")}
             onClick={()=>setPage(item.key)}
             title={item.label}>
            <DashIcon name={item.icon} size={19} stroke={1.8} className="icn"/>
            <span>{item.label}</span>
            {item.badge && <span className="badge">{item.badge}</span>}
          </a>
        ))}
      </nav>

      <div className="sb-section-label">System</div>
      <nav className="sb-nav">
        {NAV_SECONDARY.map(item=>(
          <a key={item.key}
             className={"sb-item" + (page===item.key ? " active" : "")}
             onClick={()=>setPage(item.key)}
             title={item.label}>
            <DashIcon name={item.icon} size={19} stroke={1.8} className="icn"/>
            <span>{item.label}</span>
          </a>
        ))}
        <a className="sb-item" onClick={()=>{ window.location.href = "login.html" }} title="Sign Out">
          <DashIcon name="logout" size={19} stroke={1.8} className="icn"/>
          <span>Sign Out</span>
        </a>
      </nav>

      <div className="sb-user">
        <div className="sb-user-avatar">RN</div>
        <div className="sb-user-info">
          <div className="sb-user-name">Reena Negi</div>
          <div className="sb-user-role">Reception · Front Desk</div>
        </div>
        <span className="sb-user-menu" title="Account">
          <DashIcon name="moreH" size={16}/>
        </span>
      </div>
    </aside>
  );
};

// --- Topbar ---
const Topbar = ({collapsed, setCollapsed, dark, setDark, onNewAppt, onSearch, onAdmit}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(()=>{
    const onDoc = (e)=>{ if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return ()=>document.removeEventListener("mousedown", onDoc);
  },[]);

  return (
    <header className="topbar">
      <button className="top-collapse" onClick={()=>setCollapsed(c=>!c)} title="Toggle sidebar">
        <DashIcon name="sidebar" size={18}/>
      </button>

      <div className="search">
        <DashIcon name="search" size={17} className="search-icn"/>
        <input placeholder="Search patients, doctors, appointments…"
               onChange={(e)=>onSearch(e.target.value)} />
        <div className="search-kbd"><span>⌘</span><span>K</span></div>
      </div>

      <div className="top-right">
        {/* New Appointment dropdown */}
        <div style={{position:"relative"}} ref={menuRef}>
          <button className="top-newbtn" onClick={()=>setMenuOpen(o=>!o)}>
            <DashIcon name="plus" size={16} stroke={2.4}/>
            <span>New</span>
            <DashIcon name="chevron" size={14} stroke={2.2}/>
          </button>
          {menuOpen && (
            <div style={{
              position:"absolute", right:0, top:"calc(100% + 8px)",
              background:"var(--surface)", border:"1px solid var(--border)",
              borderRadius:12, boxShadow:"var(--shadow-pop)",
              minWidth:240, padding:6, zIndex:50
            }}>
              {[
                {icon:"calendar", label:"New Appointment", sub:"Book a consultation", fn:onNewAppt},
                {icon:"user",     label:"Register Patient",  sub:"Add a new patient", fn:onAdmit},
                {icon:"bed",      label:"Admit Patient",     sub:"Allocate a bed",    fn:onAdmit},
                {icon:"upload",   label:"Upload Lab Report", sub:"Attach to patient", fn:()=>{}},
              ].map((it,i)=>(
                <button key={i} onClick={()=>{ setMenuOpen(false); it.fn?.(); }} style={{
                  width:"100%", display:"flex", alignItems:"center", gap:12,
                  padding:"10px 12px", borderRadius:9,
                  textAlign:"left", cursor:"pointer", background:"transparent",
                  transition:"background .15s"
                }}
                onMouseEnter={e=>e.currentTarget.style.background="var(--surface-3)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <div style={{
                    width:34, height:34, borderRadius:8, background:"var(--teal-50)", color:"var(--teal)",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                  }}><DashIcon name={it.icon} size={17} stroke={1.8}/></div>
                  <div style={{display:"flex", flexDirection:"column", lineHeight:1.2}}>
                    <span style={{color:"var(--text)", fontSize:13.5, fontWeight:600}}>{it.label}</span>
                    <span style={{color:"var(--text-mute)", fontSize:12}}>{it.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="top-divider"/>

        <button className="top-btn" title={dark ? "Light mode" : "Dark mode"} onClick={()=>setDark(d=>!d)}>
          <DashIcon name={dark ? "sun" : "moon"} size={17}/>
        </button>
        <button className="top-btn" title="Notifications">
          <DashIcon name="bell" size={17}/>
          <span className="dot"/>
        </button>

        <div className="top-divider"/>

        <div className="top-user" title="Account">
          <div className="avt">RN</div>
          <div className="top-user-greet">
            <span className="h">{greeting()}</span>
            <span className="n">Reena</span>
          </div>
          <DashIcon name="chevron" size={14} style={{color:"var(--text-mute)", marginRight:4}}/>
        </div>
      </div>
    </header>
  );
};

window.Sidebar = Sidebar;
window.Topbar = Topbar;
window.useDarkMode = useDarkMode;
window.greeting = greeting;
window.todayLabel = todayLabel;
