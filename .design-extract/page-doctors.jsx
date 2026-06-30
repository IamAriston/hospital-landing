// Doctor Roster — grid of cards with availability

const PageDoctors = ({searchTerm}) => {
  const [filter, setFilter] = useState("all"); // all | in-opd | in-surgery | off | etc
  const [deptFilter, setDeptFilter] = useState("all");

  const filtered = DOCTORS_DATA.filter(d=>{
    if (filter !== "all" && d.status !== filter) return false;
    if (deptFilter !== "all" && d.dept !== deptFilter) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      if (!d.name.toLowerCase().includes(s) && !d.spec.toLowerCase().includes(s) && !d.dept.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const counts = {
    on: DOCTORS_DATA.filter(d=>d.status==="in-opd" || d.status==="in-surgery" || d.status==="break").length,
    off: DOCTORS_DATA.filter(d=>d.status==="off").length,
    onCall: DOCTORS_DATA.filter(d=>d.status==="on-call").length,
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Doctor Roster</h1>
          <p className="page-sub">{filtered.length} doctors · live availability and today's schedule</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline"><DashIcon name="print" size={15}/> Roster Sheet</button>
          <button className="btn btn-primary"><DashIcon name="plus" size={15} stroke={2.4}/> Add Doctor</button>
        </div>
      </div>

      {/* Mini stats */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20}} className="opd-mini">
        <KpiTile label="On Duty Now"  value={counts.on}    icon="stethoscope" tone="teal" live/>
        <KpiTile label="On Call"      value={counts.onCall} icon="phone"       tone="sky"/>
        <KpiTile label="Off Today"    value={counts.off}   icon="user"        tone="slate"/>
        <KpiTile label="Total Staff"  value={DOCTORS_DATA.length} icon="users" tone="amber"/>
      </div>

      {/* Filters */}
      <div className="card" style={{padding:"14px 18px", marginBottom:18, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap"}}>
        <div className="chip-row">
          {[["all","All"],["in-opd","In OPD"],["in-surgery","Surgery"],["on-call","On Call"],["off","Off"]].map(([v,l])=>(
            <button key={v} className={"chip" + (filter===v?" active":"")} onClick={()=>setFilter(v)}>{l}</button>
          ))}
        </div>
        <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}
                style={{padding:"7px 12px", borderRadius:8, border:"1px solid var(--border)", background:"var(--surface)", fontSize:13, fontWeight:500, cursor:"pointer"}}>
          <option value="all">All Departments</option>
          {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
        </select>
        <button className="btn btn-ghost" style={{marginLeft:"auto"}}
                onClick={()=>{setFilter("all"); setDeptFilter("all")}}>
          <DashIcon name="x" size={14}/> Clear filters
        </button>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:18}}>
        {filtered.map(d=><DoctorCard key={d.id} d={d}/>)}
      </div>
      {filtered.length === 0 && (
        <div className="card" style={{padding:"60px 20px", textAlign:"center", color:"var(--text-mute)"}}>
          No doctors match the current filters.
        </div>
      )}
    </div>
  );
};

const DoctorCard = ({d}) => {
  const status = DOCTOR_STATUS_PILL[d.status];
  const onDuty = d.status !== "off";
  return (
    <div className="card" style={{padding:0, overflow:"hidden", transition:"transform .15s, box-shadow .2s"}}
         onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 24px -16px rgba(13,148,136,.3)"}}
         onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="var(--shadow-card)"}}>
      <div style={{
        padding:"20px 20px 16px",
        borderBottom:"1px solid var(--border)",
        display:"flex", gap:14
      }}>
        <Avatar name={d.name} size={54}/>
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:"flex", justifyContent:"space-between", gap:6}}>
            <h3 style={{fontSize:15.5}}>{d.name}</h3>
            <span className={"pill " + status.cls} style={{fontSize:10.5, padding:"2px 8px", flexShrink:0}}>
              {onDuty && d.status!=="off" && <span style={{width:6, height:6, borderRadius:999, background:"#16A34A", animation:"pulse 1.5s infinite"}}/>}
              {status.label}
            </span>
          </div>
          <div style={{fontSize:13, color:"var(--teal)", fontWeight:600, marginTop:3}}>{d.spec}</div>
          <div style={{display:"flex", gap:10, marginTop:8, fontSize:11.5, color:"var(--text-mute)"}}>
            <span style={{display:"inline-flex", alignItems:"center", gap:4}}>
              <DashIcon name="star" size={11} fill="#F59E0B" stroke={1.5} style={{color:"#F59E0B"}}/> {d.rating}
            </span>
            <span>·</span>
            <span>{d.yrs} yrs exp</span>
            <span>·</span>
            <span>{d.room}</span>
          </div>
        </div>
      </div>

      <div style={{padding:"14px 20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
        <div>
          <div style={{fontSize:10.5, color:"var(--text-mute)", textTransform:"uppercase", letterSpacing:".1em", fontWeight:700}}>Today</div>
          <div style={{fontSize:13, color:"var(--text)", marginTop:3, fontWeight:500}}>{d.today}</div>
        </div>
        <div>
          <div style={{fontSize:10.5, color:"var(--text-mute)", textTransform:"uppercase", letterSpacing:".1em", fontWeight:700}}>Patients Today</div>
          <div style={{fontSize:13, color:"var(--text)", marginTop:3, fontWeight:500}}>{d.patients_today}</div>
        </div>
      </div>

      <div style={{padding:"12px 16px", borderTop:"1px solid var(--border)", background:"var(--surface-3)",
                   display:"flex", gap:6}}>
        <button className="btn btn-outline" style={{flex:1, justifyContent:"center", padding:"7px 10px", fontSize:12.5}}>
          <DashIcon name="calendar" size={14}/> Schedule
        </button>
        <button className="btn btn-outline" style={{padding:"7px 10px"}}><DashIcon name="phone" size={14}/></button>
        <button className="btn btn-outline" style={{padding:"7px 10px"}}><DashIcon name="mail" size={14}/></button>
        <button className="btn btn-outline" style={{padding:"7px 10px"}}><DashIcon name="moreV" size={14}/></button>
      </div>
    </div>
  );
};

window.PageDoctors = PageDoctors;
