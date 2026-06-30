// Overview / Dashboard home page.

const PageOverview = ({setPage, onNewAppt}) => {
  const todayAppts = APPOINTMENTS.filter(a=>a.date==="today");
  const completed = todayAppts.filter(a=>a.status==="completed").length;
  const waiting = todayAppts.filter(a=>a.status==="waiting").length;
  const inProgress = todayAppts.filter(a=>a.status==="in-progress").length;
  const upcoming = todayAppts.filter(a=>a.status==="scheduled").length;

  const stats = [
    {label:"Appointments Today",   value:todayAppts.length, delta:"+8", up:true,  icon:"calendar",    tone:"teal"},
    {label:"In Waiting Room",      value:waiting,           delta:"3 new", up:true, icon:"clock",     tone:"amber"},
    {label:"Doctors On Duty",      value:DOCTORS_DATA.filter(d=>d.status!=="off").length, delta:"of 12", up:null, icon:"stethoscope", tone:"sky"},
    {label:"Beds Available",       value:"38 / 120",        delta:"-4", up:false, icon:"bed",         tone:"slate"},
  ];

  const queueNow = todayAppts.filter(a=>a.status==="waiting" || a.status==="in-progress").slice(0,5);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{greeting()}, Reena 👋</h1>
          <p className="page-sub">Here's what's happening at Astha today · {todayLabel()}</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline"><DashIcon name="refresh" size={16}/> Refresh</button>
          <button className="btn btn-primary" onClick={onNewAppt}>
            <DashIcon name="plus" size={16} stroke={2.4}/> New Appointment
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18, marginBottom:24}} className="ov-stats">
        {stats.map((s,i)=><StatCard key={i} {...s}/>)}
      </div>

      {/* 2-col content */}
      <div style={{display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:18}} className="ov-grid">
        {/* Today timeline */}
        <div className="card" style={{padding:0, overflow:"hidden"}}>
          <div style={{padding:"18px 22px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>
              <h3 style={{fontSize:16}}>Today's Live Queue</h3>
              <p style={{fontSize:12.5, color:"var(--text-mute)", marginTop:3}}>Patients currently waiting or in consultation</p>
            </div>
            <button className="btn btn-ghost" onClick={()=>setPage("opd")}>View Queue <DashIcon name="arrowSmall" size={14}/></button>
          </div>
          <div>
            {queueNow.length === 0 && (
              <div style={{padding:"40px 24px", textAlign:"center", color:"var(--text-mute)"}}>No patients in queue right now.</div>
            )}
            {queueNow.map((a,i)=>(
              <div key={a.id} style={{
                display:"grid", gridTemplateColumns:"56px 1fr auto auto",
                gap:14, alignItems:"center",
                padding:"14px 22px",
                borderBottom: i<queueNow.length-1 ? "1px solid var(--border)" : "none"
              }}>
                <div style={{
                  fontFamily:'"JetBrains Mono", monospace', fontSize:14,
                  fontWeight:700, color:"var(--text)",
                  background:"var(--surface-3)", padding:"6px 10px", borderRadius:7, textAlign:"center"
                }}>{a.time}</div>
                <div style={{display:"flex", alignItems:"center", gap:11}}>
                  <Avatar name={a.patient} size={36}/>
                  <div>
                    <div style={{fontWeight:600, color:"var(--text)", fontSize:14}}>{a.patient}</div>
                    <div style={{fontSize:12.5, color:"var(--text-mute)"}}>{a.doctor} · {a.dept}</div>
                  </div>
                </div>
                <span className={"pill " + STATUS_PILL[a.status].cls}>
                  {a.status==="in-progress" && <span style={{width:6, height:6, borderRadius:999, background:"var(--teal)", animation:"pulse 1.5s infinite"}}/>}
                  {STATUS_PILL[a.status].label}
                </span>
                <button className="btn btn-outline" style={{padding:"6px 10px"}}>
                  <DashIcon name="eye" size={14}/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — quick actions + dept breakdown */}
        <div style={{display:"flex", flexDirection:"column", gap:18}}>
          <div className="card" style={{padding:20}}>
            <h3 style={{fontSize:15, marginBottom:14}}>Quick Actions</h3>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
              {[
                {icon:"calendar", label:"New Appointment", fn:onNewAppt, tone:"teal"},
                {icon:"user",     label:"Register Patient", fn:()=>setPage("patients"), tone:"sky"},
                {icon:"bed",      label:"Admit Patient",   fn:()=>{}, tone:"amber"},
                {icon:"flask",    label:"Add Lab Report",  fn:()=>{}, tone:"slate"},
              ].map((q,i)=>(
                <button key={i} onClick={q.fn} className="quick-act" style={{
                  display:"flex", flexDirection:"column", alignItems:"flex-start", gap:8,
                  padding:"14px 14px",
                  background:"var(--surface)",
                  border:"1px solid var(--border)",
                  borderRadius:11, cursor:"pointer",
                  transition:"all .15s", textAlign:"left"
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--teal)"; e.currentTarget.style.transform="translateY(-2px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateY(0)"}}
                >
                  <div style={{
                    width:32, height:32, borderRadius:8,
                    background:"var(--teal-50)", color:"var(--teal)",
                    display:"flex", alignItems:"center", justifyContent:"center"
                  }}><DashIcon name={q.icon} size={16}/></div>
                  <span style={{fontSize:13, fontWeight:600, color:"var(--text)"}}>{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{padding:20}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
              <h3 style={{fontSize:15}}>Today by Department</h3>
              <span className="pill pill-teal">{todayAppts.length} total</span>
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:11}}>
              {(() => {
                const byDept = {};
                todayAppts.forEach(a=>{ byDept[a.dept] = (byDept[a.dept]||0)+1 });
                const max = Math.max(...Object.values(byDept), 1);
                return Object.entries(byDept).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([d,n],i)=>(
                  <div key={d}>
                    <div style={{display:"flex", justifyContent:"space-between", fontSize:12.5, marginBottom:4}}>
                      <span style={{color:"var(--text)", fontWeight:500}}>{d}</span>
                      <span style={{color:"var(--text-mute)", fontWeight:600}}>{n}</span>
                    </div>
                    <div style={{height:6, background:"var(--surface-3)", borderRadius:999, overflow:"hidden"}}>
                      <div style={{
                        height:"100%", width:`${(n/max)*100}%`,
                        background:`linear-gradient(90deg, var(--teal), var(--sky))`,
                        borderRadius:999, transition:"width .4s"
                      }}/>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="card" style={{padding:20, background:"linear-gradient(135deg, rgba(13,148,136,.06), rgba(56,189,248,.06))"}}>
            <div style={{display:"flex", gap:14, alignItems:"flex-start"}}>
              <div style={{
                width:40, height:40, borderRadius:10,
                background:"var(--red)", color:"#fff",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0
              }}><DashIcon name="siren" size={20} stroke={2}/></div>
              <div>
                <h3 style={{fontSize:14, marginBottom:4}}>Emergency Standby</h3>
                <p style={{fontSize:12.5, color:"var(--text-dim)", lineHeight:1.5}}>
                  2 ambulances on standby · ER staffed with 3 doctors. No active emergencies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% {opacity:1} 50% {opacity:.4} }
        @media (max-width: 1100px){
          .ov-stats{grid-template-columns:1fr 1fr !important}
          .ov-grid{grid-template-columns:1fr !important}
        }
        @media (max-width: 600px){
          .ov-stats{grid-template-columns:1fr 1fr !important}
        }
      `}</style>
    </div>
  );
};

const StatCard = ({label, value, delta, up, icon, tone}) => {
  const toneMap = {
    teal:  ["var(--teal-50)", "var(--teal-700)"],
    sky:   ["var(--sky-50)",  "#0369A1"],
    amber: ["var(--amber-50)","#B45309"],
    slate: ["var(--surface-3)","var(--text-dim)"],
  };
  const [bg, fg] = toneMap[tone] || toneMap.teal;
  return (
    <div className="card" style={{padding:20}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14}}>
        <div style={{
          width:40, height:40, borderRadius:10,
          background:bg, color:fg,
          display:"flex", alignItems:"center", justifyContent:"center"
        }}><DashIcon name={icon} size={20} stroke={1.7}/></div>
        {delta && (
          <span style={{
            display:"inline-flex", alignItems:"center", gap:3,
            fontSize:11.5, fontWeight:600,
            color: up===true ? "#15803D" : up===false ? "#B91C1C" : "var(--text-mute)",
            background: up===true ? "var(--green-50)" : up===false ? "var(--red-50)" : "var(--surface-3)",
            padding:"3px 8px", borderRadius:999
          }}>
            {up===true && <DashIcon name="arrowUp" size={11} stroke={2.4}/>}
            {up===false && <DashIcon name="arrowDown" size={11} stroke={2.4}/>}
            {delta}
          </span>
        )}
      </div>
      <div style={{fontFamily:'"Plus Jakarta Sans"', fontSize:30, fontWeight:800, color:"var(--text)", lineHeight:1.05, letterSpacing:"-0.02em"}}>{value}</div>
      <div style={{fontSize:13, color:"var(--text-dim)", marginTop:4}}>{label}</div>
    </div>
  );
};

window.PageOverview = PageOverview;
