import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';

export default function LoginPage({ go }) {
  const [f, setF] = useState({ email: "", pw: "", rem: false });
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k, v) => { setF(x => ({ ...x, [k]: v })); setErrs(e => ({ ...e, [k]: "" })); };

  const submit = e => {
    e.preventDefault();
    const v = {};
    if (!f.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) v.email = "Valid email required";
    if (f.pw.length < 6) v.pw = "Password must be 6+ characters";
    setErrs(v);
    if (Object.keys(v).length) return;
    setBusy(true);
    setTimeout(() => { setBusy(false); alert("Login successful! (Demo)"); }, 1300);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px", background: "var(--bg2)", position: "relative", overflow: "hidden" }}>
      <div style={{ width: "100%", maxWidth: 440, animation: "scaleIn .5s ease" }}>
        <div className="g" style={{ borderRadius: 26, padding: 40, border: "1px solid var(--brd)" }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 800, color: "var(--w)", marginBottom: 6 }}>Welcome Back</div>
          </div>
          <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div>
              <label className="lbl">Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} color="var(--sl3)" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                <input className="inp" type="email" value={f.email} placeholder="you@example.com" onChange={e => set("email", e.target.value)} style={{ paddingLeft: 38 }} />
              </div>
              {errs.email && <div className="ferr">{errs.email}</div>}
            </div>
            <div>
              <label className="lbl">Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} color="var(--sl3)" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                <input className="inp" type="password" value={f.pw} placeholder="••••••••" onChange={e => set("pw", e.target.value)} style={{ paddingLeft: 38 }} />
              </div>
              {errs.pw && <div className="ferr">{errs.pw}</div>}
            </div>
            <button className="bo" type="submit" disabled={busy} style={{ padding: "14px", borderRadius: 10, fontSize: 15, marginTop: 4 }}>
              {busy ? "Signing in..." : <><User size={16} />Sign In</>}
            </button>
          </form>
          <p style={{ textAlign: "center", color: "var(--sl3)", fontSize: 14, marginTop: 24 }}>
            Don't have an account? <span onClick={() => go("signup")} style={{ color: "var(--o)", fontWeight: 800, cursor: "pointer" }}>Create Account</span>
          </p>
        </div>
      </div>
    </div>
  );
}