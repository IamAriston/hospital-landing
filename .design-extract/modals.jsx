// New Appointment modal.

const NewAppointmentModal = ({onClose, onSubmit}) => {
  const [form, setForm] = useState({
    patient:"", phone:"", dept:"", doctor:"", date:"", time:"Morning", type:"In-person", reason:""
  });
  const [step, setStep] = useState(1); // 1 = patient, 2 = scheduling, 3 = confirm
  const [done, setDone] = useState(false);
  const update = (k,v)=>setForm(f=>({...f,[k]:v}));

  const docsInDept = DOCTORS_DATA.filter(d=>d.dept===form.dept);

  if (done) {
    return (
      <div className="modal-bg" onClick={onClose}>
        <div className="modal" onClick={e=>e.stopPropagation()}>
          <div className="modal-body" style={{textAlign:"center", padding:"50px 30px"}}>
            <div style={{
              width:72, height:72, margin:"0 auto 18px",
              borderRadius:999, background:"var(--green-50)", color:"#15803D",
              display:"flex", alignItems:"center", justifyContent:"center"
            }}><DashIcon name="check" size={36} stroke={2.5}/></div>
            <h3 style={{fontSize:22, fontWeight:800, color:"var(--text)"}}>Appointment Booked!</h3>
            <p style={{fontSize:14, color:"var(--text-dim)", marginTop:8, maxWidth:340, margin:"8px auto 0"}}>
              {form.patient || "Patient"}'s appointment with {form.doctor || "doctor"} is confirmed for {form.date || "selected date"}.
              SMS sent to {form.phone || "phone"}.
            </p>
            <button className="btn btn-primary" style={{marginTop:24}} onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3 style={{fontSize:18, fontWeight:700, color:"var(--text)"}}>New Appointment</h3>
            <p style={{fontSize:12.5, color:"var(--text-mute)", marginTop:3}}>Step {step} of 3 · {step===1?"Patient details":step===2?"Schedule":"Confirm"}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{padding:8}}>
            <DashIcon name="x" size={18}/>
          </button>
        </div>

        {/* Stepper */}
        <div style={{padding:"14px 24px 0", display:"flex", alignItems:"center", gap:6}}>
          {[1,2,3].map(n=>(
            <React.Fragment key={n}>
              <div style={{
                width:26, height:26, borderRadius:999,
                background: step>=n ? "var(--teal)" : "var(--surface-3)",
                color: step>=n ? "#fff" : "var(--text-mute)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:'"Plus Jakarta Sans"', fontWeight:700, fontSize:12.5,
                transition:"all .2s"
              }}>{step>n ? <DashIcon name="check" size={13} stroke={3}/> : n}</div>
              {n<3 && <div style={{
                flex:1, height:2, background: step>n ? "var(--teal)" : "var(--surface-3)",
                transition:"background .2s"
              }}/>}
            </React.Fragment>
          ))}
        </div>

        <div className="modal-body">
          {step===1 && (
            <>
              <div className="f-row">
                <div className="f-col">
                  <label>Patient Name *</label>
                  <input value={form.patient} onChange={e=>update("patient", e.target.value)} placeholder="Full name"/>
                </div>
                <div className="f-col">
                  <label>Phone (+91) *</label>
                  <input value={form.phone} onChange={e=>update("phone", e.target.value)} placeholder="98765 43210"/>
                </div>
              </div>
              <div className="f-col">
                <label style={{marginBottom:6}}>Or pick existing patient</label>
                <select onChange={e=>{
                  const p = PATIENTS.find(x=>x.id===e.target.value);
                  if (p) { update("patient", p.name); update("phone", p.phone); }
                }} defaultValue="">
                  <option value="">Type to search or pick from list…</option>
                  {PATIENTS.slice(0,8).map(p=><option key={p.id} value={p.id}>{p.name} · {p.id}</option>)}
                </select>
              </div>
            </>
          )}

          {step===2 && (
            <>
              <div className="f-row">
                <div className="f-col">
                  <label>Department *</label>
                  <select value={form.dept} onChange={e=>{ update("dept", e.target.value); update("doctor",""); }}>
                    <option value="">Choose…</option>
                    {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="f-col">
                  <label>Doctor</label>
                  <select value={form.doctor} onChange={e=>update("doctor", e.target.value)} disabled={!form.dept}>
                    <option value="">Any available</option>
                    {docsInDept.map(d=><option key={d.id} value={d.name}>{d.name} {d.status==="off" && "(Off today)"}</option>)}
                  </select>
                </div>
              </div>
              <div className="f-row">
                <div className="f-col">
                  <label>Date *</label>
                  <input type="date" value={form.date} onChange={e=>update("date", e.target.value)}/>
                </div>
                <div className="f-col">
                  <label>Time Slot</label>
                  <div className="f-segment">
                    {["Morning","Afternoon","Evening"].map(t=>(
                      <button key={t} type="button" className={form.time===t?"on":""} onClick={()=>update("time", t)}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="f-col" style={{marginBottom:14}}>
                <label>Visit Type</label>
                <div className="f-segment">
                  {["In-person","Video","Home Visit"].map(t=>(
                    <button key={t} type="button" className={form.type===t?"on":""} onClick={()=>update("type", t)}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="f-col">
                <label>Reason / Symptoms</label>
                <textarea rows={3} value={form.reason} onChange={e=>update("reason", e.target.value)}
                          placeholder="Brief reason for visit" style={{resize:"vertical", minHeight:72}}/>
              </div>
            </>
          )}

          {step===3 && (
            <div style={{display:"flex", flexDirection:"column", gap:12}}>
              <ConfirmRow label="Patient"   value={form.patient || "—"} />
              <ConfirmRow label="Phone"     value={"+91 " + (form.phone || "—")} mono/>
              <ConfirmRow label="Department" value={form.dept || "—"} />
              <ConfirmRow label="Doctor"    value={form.doctor || "Any available"}/>
              <ConfirmRow label="Date / Slot" value={(form.date || "—") + " · " + form.time}/>
              <ConfirmRow label="Visit Type" value={form.type}/>
              {form.reason && <ConfirmRow label="Reason" value={form.reason}/>}
              <div style={{
                padding:"10px 12px",
                background:"var(--sky-50)", color:"#0369A1",
                border:"1px solid #BAE6FD", borderRadius:9,
                fontSize:12.5, display:"flex", gap:8
              }}>
                <DashIcon name="bell" size={14} stroke={2} style={{flexShrink:0, marginTop:1}}/>
                <div>Confirmation will be sent via SMS and WhatsApp to the patient's phone.</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          {step>1 && <button className="btn btn-outline" onClick={()=>setStep(s=>s-1)}>
            <DashIcon name="chevronLeft" size={15}/> Back
          </button>}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          {step<3 ? (
            <button className="btn btn-primary" onClick={()=>setStep(s=>s+1)}
                    disabled={step===1 && (!form.patient || !form.phone)}>
              Continue <DashIcon name="chevronRight" size={15}/>
            </button>
          ) : (
            <button className="btn btn-primary" onClick={()=>{ onSubmit?.(form); setDone(true); }}>
              <DashIcon name="check" size={15} stroke={2.4}/> Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ConfirmRow = ({label, value, mono}) => (
  <div style={{
    display:"grid", gridTemplateColumns:"140px 1fr",
    padding:"8px 0", borderBottom:"1px solid var(--border)",
    fontSize:13.5
  }}>
    <span style={{color:"var(--text-mute)", fontWeight:500}}>{label}</span>
    <span style={{color:"var(--text)", fontWeight:600, fontFamily: mono?'"JetBrains Mono", monospace':"inherit"}}>{value}</span>
  </div>
);

window.NewAppointmentModal = NewAppointmentModal;
