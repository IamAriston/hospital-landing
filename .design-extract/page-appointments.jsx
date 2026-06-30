// Appointments page — list / calendar view, filters.

const PageAppointments = ({onNewAppt, searchTerm}) => {
  const [dateFilter, setDateFilter] = useState("today"); // today | tomorrow | week | all
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [view, setView] = useState("list"); // list | calendar

  const filtered = useMemo(()=>{
    let r = APPOINTMENTS;
    if (dateFilter !== "all") r = r.filter(a => a.date === dateFilter || (dateFilter==="week" && (a.date==="today"||a.date==="tomorrow"||a.date==="week")));
    if (statusFilter !== "all") r = r.filter(a => a.status === statusFilter);
    if (deptFilter !== "all") r = r.filter(a => a.dept === deptFilter);
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      r = r.filter(a =>
        a.patient.toLowerCase().includes(s) ||
        a.doctor.toLowerCase().includes(s) ||
        a.id.toLowerCase().includes(s)
      );
    }
    return r;
  }, [dateFilter, statusFilter, deptFilter, searchTerm]);

  const stats = useMemo(()=>{
    const r = APPOINTMENTS.filter(a=>a.date==="today");
    return {
      total: r.length,
      completed: r.filter(a=>a.status==="completed").length,
      waiting: r.filter(a=>a.status==="waiting").length,
      scheduled: r.filter(a=>a.status==="scheduled").length,
    };
  }, []);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-sub">{filtered.length} appointments · {todayLabel()}</p>
        </div>
        <div className="page-actions">
          <div className="chip-row">
            <button className={"chip" + (view==="list"?" active":"")} onClick={()=>setView("list")}>
              <DashIcon name="list" size={14} stroke={2.2} style={{marginRight:4, verticalAlign:"-2px"}}/>List
            </button>
            <button className={"chip" + (view==="calendar"?" active":"")} onClick={()=>setView("calendar")}>
              <DashIcon name="grid" size={14} stroke={2.2} style={{marginRight:4, verticalAlign:"-2px"}}/>Calendar
            </button>
          </div>
          <button className="btn btn-outline"><DashIcon name="download" size={15}/> Export</button>
          <button className="btn btn-primary" onClick={onNewAppt}>
            <DashIcon name="plus" size={15} stroke={2.4}/> New Appointment
          </button>
        </div>
      </div>

      {/* Mini stats */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20}} className="apt-mini">
        {[
          {l:"Total Today",  v:stats.total,     c:"var(--teal)"},
          {l:"Completed",    v:stats.completed, c:"var(--green)"},
          {l:"In Waiting",   v:stats.waiting,   c:"var(--amber)"},
          {l:"Upcoming",     v:stats.scheduled, c:"var(--sky)"},
        ].map((s,i)=>(
          <div key={i} className="card" style={{padding:"14px 18px", display:"flex", alignItems:"center", gap:14}}>
            <div style={{width:3, alignSelf:"stretch", background:s.c, borderRadius:3}}/>
            <div>
              <div style={{fontFamily:'"Plus Jakarta Sans"', fontSize:24, fontWeight:800, color:"var(--text)", lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:12.5, color:"var(--text-mute)", marginTop:3}}>{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{padding:"14px 18px", marginBottom:18, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap"}}>
        <div className="chip-row">
          {[["today","Today"],["tomorrow","Tomorrow"],["week","This Week"],["all","All"]].map(([v,l])=>(
            <button key={v} className={"chip" + (dateFilter===v?" active":"")} onClick={()=>setDateFilter(v)}>{l}</button>
          ))}
        </div>
        <div style={{width:1, height:24, background:"var(--border)"}}/>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
                style={{padding:"7px 12px", borderRadius:8, border:"1px solid var(--border)", background:"var(--surface)", fontSize:13, fontWeight:500, cursor:"pointer"}}>
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_PILL).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}
                style={{padding:"7px 12px", borderRadius:8, border:"1px solid var(--border)", background:"var(--surface)", fontSize:13, fontWeight:500, cursor:"pointer"}}>
          <option value="all">All Departments</option>
          {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
        </select>
        <button className="btn btn-ghost" style={{marginLeft:"auto"}}
                onClick={()=>{setDateFilter("today");setStatusFilter("all");setDeptFilter("all")}}>
          <DashIcon name="x" size={14}/> Clear filters
        </button>
      </div>

      {view==="list" ? <ApptList list={filtered}/> : <ApptCalendar list={filtered}/>}
    </div>
  );
};

const ApptList = ({list}) => {
  if (list.length === 0) {
    return (
      <div className="card" style={{padding:"60px 20px", textAlign:"center"}}>
        <div style={{
          width:60, height:60, margin:"0 auto 16px",
          borderRadius:999, background:"var(--surface-3)",
          display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text-mute)"
        }}><DashIcon name="calendar" size={28} stroke={1.6}/></div>
        <h3 style={{fontSize:16}}>No appointments match your filters</h3>
        <p style={{fontSize:13.5, color:"var(--text-mute)", marginTop:6}}>Try a different date range or clear filters.</p>
      </div>
    );
  }
  return (
    <div className="card" style={{overflowX:"auto"}} className="card dash-scroller">
      <table className="t">
        <thead>
          <tr>
            <th>ID</th><th>Time</th><th>Patient</th><th>Doctor / Dept</th>
            <th>Reason</th><th>Type</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          {list.map(a=>(
            <tr key={a.id}>
              <td><span className="mono" style={{color:"var(--text-mute)"}}>{a.id}</span></td>
              <td>
                <div style={{fontFamily:'"JetBrains Mono", monospace', fontWeight:700, fontSize:13.5, color:"var(--text)"}}>{a.time}</div>
                <div style={{fontSize:11.5, color:"var(--text-mute)"}}>{a.date==="today"?"Today":a.date==="tomorrow"?"Tomorrow":"This week"}</div>
              </td>
              <td>
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <Avatar name={a.patient} size={32}/>
                  <div>
                    <div style={{fontWeight:600, color:"var(--text)"}}>{a.patient}</div>
                    <div style={{fontSize:11.5, color:"var(--text-mute)"}}>{a.patientId}</div>
                  </div>
                </div>
              </td>
              <td>
                <div style={{fontWeight:500, color:"var(--text)"}}>{a.doctor}</div>
                <div style={{fontSize:12, color:"var(--text-mute)"}}>{a.dept}</div>
              </td>
              <td style={{maxWidth:240}}>
                <div style={{fontSize:13, color:"var(--text)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{a.reason}</div>
                <div style={{fontSize:11.5, color:"var(--text-mute)"}}>via {a.source}</div>
              </td>
              <td>
                <span className={"pill " + (a.type==="Video" ? "pill-sky" : "pill-slate")}>
                  {a.type}
                </span>
              </td>
              <td><span className={"pill " + STATUS_PILL[a.status].cls}>{STATUS_PILL[a.status].label}</span></td>
              <td style={{textAlign:"right", whiteSpace:"nowrap"}}>
                <button className="btn btn-ghost" style={{padding:"6px 8px"}} title="View"><DashIcon name="eye" size={15}/></button>
                <button className="btn btn-ghost" style={{padding:"6px 8px"}} title="Edit"><DashIcon name="edit" size={15}/></button>
                <button className="btn btn-ghost" style={{padding:"6px 8px"}} title="More"><DashIcon name="moreV" size={15}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ApptCalendar = ({list}) => {
  // Simple week-view by hour
  const hours = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00"];
  const days = ["Mon 19","Tue 20","Wed 21","Thu 22","Fri 23","Sat 24"];

  // Distribute appointments across visible week
  const grid = {};
  list.forEach((a,i)=>{
    const dayIdx = a.date==="today" ? 0 : a.date==="tomorrow" ? 1 : 2 + (i%4);
    const day = days[dayIdx % days.length];
    grid[day] = grid[day] || {};
    grid[day][a.time] = a;
  });

  return (
    <div className="card" style={{padding:0, overflow:"hidden"}}>
      <div style={{padding:"14px 18px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <button className="btn btn-outline" style={{padding:"6px 10px"}}><DashIcon name="chevronLeft" size={15}/></button>
          <div style={{fontFamily:'"Plus Jakarta Sans"', fontWeight:700, fontSize:15, color:"var(--text)"}}>May 19 – 24, 2026</div>
          <button className="btn btn-outline" style={{padding:"6px 10px"}}><DashIcon name="chevronRight" size={15}/></button>
        </div>
        <div className="chip-row">
          {["Day","Week","Month"].map((v,i)=>(
            <button key={v} className={"chip" + (i===1?" active":"")}>{v}</button>
          ))}
        </div>
      </div>

      <div style={{overflowX:"auto"}} className="dash-scroller">
        <div style={{minWidth:900, display:"grid", gridTemplateColumns:"60px repeat(6, 1fr)"}}>
          <div style={{background:"var(--surface)"}}></div>
          {days.map(d=>(
            <div key={d} style={{
              padding:"12px 8px", textAlign:"center",
              borderBottom:"1px solid var(--border)",
              fontFamily:'"Plus Jakarta Sans"', fontWeight:600, fontSize:13, color:"var(--text)",
              background:"var(--surface)"
            }}>{d}</div>
          ))}
          {hours.map(h=>(
            <React.Fragment key={h}>
              <div style={{
                padding:"10px 10px", borderBottom:"1px solid var(--border)",
                fontFamily:'"JetBrains Mono", monospace', fontSize:11, color:"var(--text-mute)",
                textAlign:"right", background:"var(--surface)"
              }}>{h}</div>
              {days.map((d,di)=>{
                const a = grid[d]?.[h];
                return (
                  <div key={d+h} style={{
                    minHeight:50, borderLeft:"1px solid var(--border)",
                    borderBottom:"1px solid var(--border)", padding:4,
                    cursor:"pointer"
                  }}>
                    {a && (
                      <div style={{
                        background:"var(--teal-50)", color:"var(--teal-700)",
                        borderLeft:"3px solid var(--teal)",
                        padding:"5px 8px", borderRadius:6, height:"100%",
                        fontSize:11.5, lineHeight:1.3,
                        cursor:"pointer", transition:"background .15s"
                      }}>
                        <div style={{fontWeight:700, color:"var(--teal-700)"}}>{a.patient.split(" ")[0]}</div>
                        <div style={{fontSize:10.5, color:"var(--text-mute)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{a.doctor.replace(/^Dr\. /,"Dr ")}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

window.PageAppointments = PageAppointments;
