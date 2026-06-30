// Patient Records page — searchable table with detail drawer

const PagePatients = ({searchTerm}) => {
  const [selected, setSelected] = useState(null);
  const [localSearch, setLocalSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");

  const term = (localSearch || searchTerm || "").toLowerCase();

  const filtered = PATIENTS.filter(p=>{
    if (genderFilter !== "all" && p.sex !== genderFilter) return false;
    if (!term) return true;
    return p.name.toLowerCase().includes(term)
        || p.id.toLowerCase().includes(term)
        || p.phone.includes(term)
        || p.city.toLowerCase().includes(term);
  });

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Patient Records</h1>
          <p className="page-sub">{filtered.length} patients · search by name, ID, phone or city</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline"><DashIcon name="download" size={15}/> Export CSV</button>
          <button className="btn btn-primary"><DashIcon name="plus" size={15} stroke={2.4}/> Register Patient</button>
        </div>
      </div>

      {/* Search & filter row */}
      <div className="card" style={{padding:"14px 18px", marginBottom:18, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap"}}>
        <div style={{position:"relative", flex:1, minWidth:240, maxWidth:480}}>
          <DashIcon name="search" size={16} style={{position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text-mute)"}}/>
          <input value={localSearch} onChange={e=>setLocalSearch(e.target.value)}
                 placeholder="Search name, ID, phone, city…"
                 style={{
                   width:"100%", padding:"9px 14px 9px 38px",
                   border:"1px solid var(--border)", borderRadius:9,
                   background:"var(--surface)", outline:"none", fontSize:14
                 }}/>
        </div>
        <div className="chip-row">
          {[["all","All"],["M","Male"],["F","Female"]].map(([v,l])=>(
            <button key={v} className={"chip" + (genderFilter===v?" active":"")} onClick={()=>setGenderFilter(v)}>{l}</button>
          ))}
        </div>
        <span className="pill pill-slate" style={{padding:"5px 10px"}}>
          Showing <b style={{margin:"0 4px"}}>{filtered.length}</b> of {PATIENTS.length}
        </span>
      </div>

      <div style={{display:"grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap:18}}>
        {/* Table */}
        <div className="card dash-scroller" style={{overflowX:"auto"}}>
          <table className="t">
            <thead>
              <tr>
                <th>Patient ID</th><th>Name</th><th>Age / Sex</th><th>Phone</th>
                <th>City</th><th>Blood</th><th>Last Visit</th><th>Insurance</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p=>(
                <tr key={p.id}
                    onClick={()=>setSelected(p)}
                    style={{cursor:"pointer", background: selected?.id===p.id ? "var(--surface-3)" : "transparent"}}>
                  <td className="mono" style={{color:"var(--text-mute)", fontSize:12.5}}>{p.id}</td>
                  <td>
                    <div style={{display:"flex", alignItems:"center", gap:10}}>
                      <Avatar name={p.name} size={32}/>
                      <span style={{fontWeight:600, color:"var(--text)"}}>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.age} · {p.sex==="M"?"Male":"Female"}</td>
                  <td className="mono" style={{fontSize:13}}>{p.phone}</td>
                  <td>{p.city}</td>
                  <td>
                    <span className="pill" style={{
                      background:"#FEE2E2", color:"#991B1B", border:"1px solid #FECACA",
                      fontFamily:'"JetBrains Mono",monospace', fontWeight:700, padding:"2px 9px"
                    }}>{p.blood}</span>
                  </td>
                  <td style={{fontSize:13, color:"var(--text-dim)"}}>{p.last}</td>
                  <td style={{fontSize:13, color:"var(--text-dim)"}}>{p.insurance}</td>
                  <td><DashIcon name="chevronRight" size={15} style={{color:"var(--text-mute)"}}/></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{padding:"50px 20px", textAlign:"center", color:"var(--text-mute)"}}>
              No patients match your search.
            </div>
          )}
        </div>

        {/* Detail drawer */}
        {selected && <PatientDrawer p={selected} onClose={()=>setSelected(null)}/>}
      </div>
    </div>
  );
};

const PatientDrawer = ({p, onClose}) => {
  // pull this patient's appointments
  const appts = APPOINTMENTS.filter(a => a.patientId === p.id);
  return (
    <div className="card" style={{padding:0, overflow:"hidden", position:"sticky", top:88, alignSelf:"start"}}>
      <div style={{
        padding:"22px 22px 18px",
        background:"linear-gradient(135deg, var(--teal) 0%, #0F766E 100%)",
        color:"#fff",
        position:"relative"
      }}>
        <button onClick={onClose} style={{
          position:"absolute", top:14, right:14,
          width:30, height:30, borderRadius:8,
          background:"rgba(255,255,255,.15)", color:"#fff",
          display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"
        }}><DashIcon name="x" size={16}/></button>
        <Avatar name={p.name} size={64}/>
        <h3 style={{color:"#fff", fontSize:20, marginTop:12}}>{p.name}</h3>
        <div style={{fontSize:13, color:"rgba(255,255,255,.85)", marginTop:4}}>
          {p.id} · {p.age} yrs · {p.sex==="M"?"Male":"Female"}
        </div>
        <div style={{display:"flex", gap:6, marginTop:14}}>
          <button className="btn" style={{background:"rgba(255,255,255,.18)", color:"#fff", padding:"7px 12px"}}>
            <DashIcon name="calendar" size={14}/> Book
          </button>
          <button className="btn" style={{background:"rgba(255,255,255,.18)", color:"#fff", padding:"7px 12px"}}>
            <DashIcon name="phone" size={14}/> Call
          </button>
          <button className="btn" style={{background:"rgba(255,255,255,.18)", color:"#fff", padding:"7px 12px"}}>
            <DashIcon name="edit" size={14}/> Edit
          </button>
        </div>
      </div>

      <div style={{padding:"18px 22px"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18}}>
          <DrawerStat label="Blood Group" value={p.blood} mono/>
          <DrawerStat label="City" value={p.city}/>
          <DrawerStat label="Phone" value={p.phone} mono/>
          <DrawerStat label="Insurance" value={p.insurance}/>
          <DrawerStat label="Registered" value={p.reg}/>
          <DrawerStat label="Last Visit" value={p.last}/>
        </div>

        <div style={{
          padding:"10px 12px", background:"var(--amber-50)",
          border:"1px solid #FDE68A", borderRadius:9,
          fontSize:12.5, color:"#B45309",
          display:"flex", gap:8, alignItems:"flex-start"
        }}>
          <DashIcon name="activity" size={14} stroke={2} style={{marginTop:1, flexShrink:0}}/>
          <div>
            <b style={{color:"#92400E"}}>Allergies:</b> {p.allergies}
          </div>
        </div>

        <h4 style={{fontSize:13, textTransform:"uppercase", letterSpacing:".1em", color:"var(--text-mute)", margin:"22px 0 10px", fontWeight:700}}>
          Recent Appointments
        </h4>
        {appts.length === 0 && <div style={{fontSize:13, color:"var(--text-mute)", padding:"12px 0"}}>No appointments on record.</div>}
        <div style={{display:"flex", flexDirection:"column", gap:8}}>
          {appts.slice(0,4).map(a=>(
            <div key={a.id} style={{
              display:"flex", gap:10, alignItems:"center",
              padding:"10px 12px", background:"var(--surface-3)", borderRadius:9
            }}>
              <div style={{
                width:36, height:36, borderRadius:8,
                background:"var(--teal-50)", color:"var(--teal-700)",
                display:"flex", alignItems:"center", justifyContent:"center"
              }}><DashIcon name="calendar" size={16}/></div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:13, fontWeight:600, color:"var(--text)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{a.doctor}</div>
                <div style={{fontSize:11.5, color:"var(--text-mute)"}}>{a.dept} · {a.time}</div>
              </div>
              <span className={"pill " + STATUS_PILL[a.status].cls} style={{fontSize:10.5, padding:"2px 7px"}}>{STATUS_PILL[a.status].label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DrawerStat = ({label, value, mono}) => (
  <div>
    <div style={{fontSize:10.5, color:"var(--text-mute)", textTransform:"uppercase", letterSpacing:".1em", fontWeight:700}}>{label}</div>
    <div style={{fontSize:13.5, color:"var(--text)", marginTop:3, fontWeight:500, fontFamily: mono?'"JetBrains Mono", monospace':"inherit"}}>{value}</div>
  </div>
);

window.PagePatients = PagePatients;
