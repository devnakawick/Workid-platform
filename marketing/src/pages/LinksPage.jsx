import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Facebook, Twitter, Instagram, Linkedin, Youtube, Github,
  Mail, Globe, Smartphone, Users, Briefcase, BookOpen,
  MessageCircle, ArrowRight, TrendingUp, ShieldCheck,
} from "lucide-react";

function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let v = 0;
    const step = Math.ceil(to / 50);
    const id = setInterval(() => {
      v += step;
      if (v >= to) { setVal(to); clearInterval(id); }
      else setVal(v);
    }, 24);
    return () => clearInterval(id);
  }, [to]);
  return <>{to >= 1000 ? val.toLocaleString() : val}{suffix}</>;
}

export default function LinksPage() {
  const navigate = useNavigate();

  const mainLinks = [
    { title: "Visit Our Website",  desc: "Explore features, how it works & more",   icon: Globe,      bg: "linear-gradient(135deg,#6D28D9,#8B5CF6)", glow: "rgba(109,40,217,0.28)", internal: true },
    { title: "Launch WorkID App",  desc: "Find work or hire workers instantly",       icon: Smartphone, bg: "linear-gradient(135deg,#1D4ED8,#38BDF8)", glow: "rgba(29,78,216,0.25)" },
    { title: "For Workers",        desc: "Create profile & get AI-matched to jobs",   icon: Users,      bg: "linear-gradient(135deg,#7C3AED,#C084FC)", glow: "rgba(124,58,237,0.25)" },
    { title: "For Employers",      desc: "Post jobs & hire verified workers",          icon: Briefcase,  bg: "linear-gradient(135deg,#0891B2,#34D399)", glow: "rgba(8,145,178,0.25)" },
  ];

  const secondaryLinks = [
    { title: "Documentation",  url: "https://docs.workid.lk",    icon: BookOpen },
    { title: "Support Center", url: "https://support.workid.lk", icon: MessageCircle },
  ];

  const socials = [
    { name: "Facebook",  url: "https://facebook.com/workid",          icon: Facebook,  color: "#1877F2" },
    { name: "Instagram", url: "https://instagram.com/workid",         icon: Instagram, color: "#E4405F" },
    { name: "Twitter",   url: "https://twitter.com/workid",           icon: Twitter,   color: "#1DA1F2" },
    { name: "LinkedIn",  url: "https://linkedin.com/company/workid",  icon: Linkedin,  color: "#0A66C2" },
    { name: "YouTube",   url: "https://youtube.com/@workid",          icon: Youtube,   color: "#FF0000" },
    { name: "GitHub",    url: "https://github.com/workid",            icon: Github,    color: "#24292E" },
  ];

  const c = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const u = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } } };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { background: #F4F1FF; }

        /* ── Page shell ── */
        .p { min-height: 100vh; background: linear-gradient(160deg, #FAF8FF 0%, #F0EBFF 45%, #EBF3FF 100%); font-family: 'Inter', sans-serif; position: relative; overflow: hidden; display: flex; justify-content: center; }

        /* ── Background blobs — exactly marketing page ── */
        .blob { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }

        /* ── Content ── */
        .w { position: relative; z-index: 1; width: 100%; max-width: 580px; padding: 52px 22px 68px; display: flex; flex-direction: column; align-items: center; }

        /* ── Logo ── */
        .logo-shell {
          position: relative;
          width: 108px;
          height: 108px;
          margin-bottom: 22px;
        }
        /* Spinning gradient border */
        @keyframes spin { to { transform: rotate(360deg); } }
        .logo-ring {
          position: absolute;
          inset: -4px;
          border-radius: 36px;
          background: conic-gradient(#7C3AED, #38BDF8, #C084FC, #7C3AED);
          animation: spin 4s linear infinite;
          opacity: 0.7;
        }
        .logo-ring-mask {
          position: absolute;
          inset: -4px;
          border-radius: 36px;
          background: conic-gradient(#7C3AED, #38BDF8, #C084FC, #7C3AED);
          animation: spin 4s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 3px;
          opacity: 0.8;
        }
        .logo-box {
          position: relative;
          z-index: 2;
          width: 108px;
          height: 108px;
          border-radius: 32px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(109,40,217,0.15), 0 2px 8px rgba(0,0,0,0.06);
        }
        .logo-img { width: 82px; height: 82px; object-fit: contain; }
        /* Glow drop shadow */
        .logo-glow {
          position: absolute;
          bottom: -16px; left: 50%;
          transform: translateX(-50%);
          width: 72px; height: 18px;
          background: rgba(109,40,217,0.22);
          filter: blur(14px);
          border-radius: 50%;
          z-index: 1;
        }

        /* ── Badge ── */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #F3F0FF;
          border-radius: 100px;
          padding: 7px 18px;
          font-size: 12.5px;
          font-weight: 600;
          color: #6D28D9;
          margin-bottom: 20px;
        }
        .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #7C3AED; }

        /* ── Heading ── matches marketing page font weight / size ── */
        .h1 {
          font-size: clamp(50px, 11vw, 68px);
          font-weight: 900;
          letter-spacing: -3.5px;
          line-height: 1;
          text-align: center;
          color: #0A0720;
          margin-bottom: 12px;
        }
        .tagline {
          font-size: clamp(17px, 3.8vw, 21px);
          font-weight: 700;
          color: #1E1245;
          text-align: center;
          letter-spacing: -0.3px;
          margin-bottom: 10px;
        }
        .tagline .v { color: #7C3AED; }
        .desc {
          font-size: 14px;
          font-weight: 450;
          color: #64748B;
          text-align: center;
          line-height: 1.75;
          max-width: 370px;
          margin-bottom: 36px;
        }

        /* ── CTA buttons — matching marketing page pill style ── */
        .cta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 40px;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #1D4ED8, #38BDF8);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          padding: 13px 26px;
          border-radius: 100px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(29,78,216,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
          border: none;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(29,78,216,0.45); }
        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          color: #1D4ED8;
          font-size: 14px;
          font-weight: 700;
          padding: 12px 26px;
          border-radius: 100px;
          text-decoration: none;
          border: 2px solid #BFDBFE;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .btn-outline:hover { transform: translateY(-2px); border-color: #93C5FD; box-shadow: 0 6px 20px rgba(29,78,216,0.12); }

        /* ── Stats — borderless matching marketing page ── */
        .stats { display: flex; gap: 44px; justify-content: center; flex-wrap: wrap; margin-bottom: 48px; }
        .stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .stat-icon { width: 40px; height: 40px; border-radius: 13px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
        .stat-num { font-size: 26px; font-weight: 900; color: #0A0720; letter-spacing: -1px; line-height: 1; }
        .stat-lbl { font-size: 13px; font-weight: 500; color: #94A3B8; }

        /* ── Divider ── */
        .divider { width: 100%; display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #E2E8F0; }
        .divider span { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94A3B8; white-space: nowrap; }

        /* ── Link cards ── clean white like marketing page cards ── */
        .links { width: 100%; display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }

        .card {
          width: 100%;
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #F1F5F9;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          cursor: pointer;
          overflow: hidden;
          position: relative;
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s, border-color 0.2s;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.1);
          border-color: #E0E7FF;
        }
        .card:hover .card-icon { transform: scale(1.1) rotate(-6deg); }
        .card:hover .card-title { color: #6D28D9; }
        .card:hover .arrow { transform: translate(3px, -3px) scale(1.1); background: #EDE9FE; }

        /* Featured top card gets a gradient left border */
        .card.featured { border-left: 4px solid #7C3AED; }

        .card a { text-decoration: none; color: inherit; display: block; }
        .card-row { display: flex; align-items: center; gap: 16px; padding: 18px 20px; }
        .card-icon {
          width: 52px; height: 52px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .card-title { font-size: 15px; font-weight: 800; color: #0A0720; letter-spacing: -0.2px; margin-bottom: 3px; transition: color 0.2s; }
        .card-desc { font-size: 13px; font-weight: 500; color: #94A3B8; }
        .arrow {
          margin-left: auto;
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #F8FAFC;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.2s;
          color: #7C3AED;
        }

        /* ── Secondary ── */
        .sec-grid { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 40px; }
        .sec-card {
          background: #fff;
          border: 1.5px solid #F1F5F9;
          border-radius: 18px;
          padding: 22px 16px;
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          text-decoration: none;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s, border-color 0.2s;
        }
        .sec-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.09); border-color: #E0E7FF; }
        .sec-card:hover .sec-icon { transform: scale(1.12) rotate(-8deg); }
        .sec-icon { width: 46px; height: 46px; border-radius: 14px; background: #F5F3FF; display: flex; align-items: center; justify-content: center; transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .sec-card span { font-size: 13.5px; font-weight: 700; color: #1E1245; }

        /* ── Socials ── */
        .connect-lbl { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94A3B8; margin-bottom: 14px; }
        .socials { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; }
        .soc {
          width: 48px; height: 48px;
          background: #fff;
          border: 1.5px solid #F1F5F9;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          overflow: hidden; position: relative;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
        }
        .soc::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--c);
          transform: translateY(100%);
          transition: transform 0.28s cubic-bezier(0.34,1.2,0.64,1);
          border-radius: inherit;
        }
        .soc:hover { transform: translateY(-5px); box-shadow: 0 10px 28px rgba(0,0,0,0.14); }
        .soc:hover::before { transform: translateY(0); }
        .soc svg { position: relative; z-index: 1; transition: color 0.25s; }
        .soc:hover svg { color: #fff !important; }

        /* ── Bottom ── */
        .email-row { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
        .email-row a { font-size: 14px; font-weight: 600; color: #94A3B8; text-decoration: none; transition: color 0.2s; }
        .email-row a:hover { color: #7C3AED; }
        .footer { font-size: 12px; color: #CBD5E1; }
      `}</style>

      {/* Blobs */}
      <div className="blob" style={{ width:960, height:960, top:-260, right:-280, background:"radial-gradient(circle, rgba(216,180,254,0.82) 0%, rgba(192,150,250,0.4) 38%, transparent 65%)" }} />
      <div className="blob" style={{ width:720, height:720, bottom:-160, left:-220, background:"radial-gradient(circle, rgba(147,197,253,0.72) 0%, rgba(120,200,250,0.3) 38%, transparent 65%)" }} />
      <div className="blob" style={{ width:440, height:440, top:"35%", left:"40%", background:"radial-gradient(circle, rgba(233,213,255,0.32) 0%, transparent 65%)" }} />

      <div className="p">
        <motion.div className="w" variants={c} initial="hidden" animate="show">

          {/* Logo with spinning ring */}
          <motion.div variants={u} style={{ marginBottom: 22 }}>
            <motion.div
              className="logo-shell"
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              <div className="logo-ring-mask" />
              <div className="logo-box">
                <img src="/workIDLogo.JPG" alt="WorkID" className="logo-img" />
              </div>
              <div className="logo-glow" />
            </motion.div>
          </motion.div>

          {/* Badge */}
          <motion.div variants={u} className="badge">
            <span className="badge-dot" />
            Empowering Sri Lanka's Workforce
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={u} className="h1">WorkID</motion.h1>
          <motion.p variants={u} className="tagline">Your Digital <span className="v">Identity.</span> Your Future.</motion.p>
          <motion.p variants={u} className="desc">
            WorkID connects informal workers with fair job opportunities through{" "}
            <strong style={{ color:"#2563EB" }}>AI-powered matching</strong>,{" "}
            <strong style={{ color:"#7C3AED" }}>digital wallets</strong>, and{" "}
            <strong style={{ color:"#7C3AED" }}>verified credentials</strong>.
          </motion.p>

          {/* CTA buttons — matching marketing page */}
          <motion.div variants={u} className="cta-row">
            <a href="https://workid-app.vercel.app/signup/worker" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Find Work Now <ArrowRight size={16} />
            </a>
            <a href="https://workid-app.vercel.app/signup/employer" target="_blank" rel="noopener noreferrer" className="btn-outline">
              Hire Workers
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={u} className="stats">
            {[
              { icon: Users,       color:"#7C3AED", bg:"rgba(124,58,237,0.09)", to:10000, suffix:"+", label:"Workers"  },
              { icon: TrendingUp,  color:"#2563EB", bg:"rgba(37,99,235,0.09)",  to:95,    suffix:"%", label:"Success"  },
              { icon: ShieldCheck, color:"#0891B2", bg:"rgba(8,145,178,0.09)",  to:100,   suffix:"%", label:"Verified" },
            ].map(({ icon:Icon, color, bg, to, suffix, label }) => (
              <div key={label} className="stat">
                <div className="stat-icon" style={{ background: bg }}><Icon size={20} color={color} /></div>
                <span className="stat-num"><Counter to={to} suffix={suffix} /></span>
                <span className="stat-lbl">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div variants={u} className="divider" style={{ width:"100%" }}>
            <span>Quick Links</span>
          </motion.div>

          {/* Link cards */}
          <div className="links">
            {mainLinks.map((link, i) => {
              const inner = (
                <div className="card-row">
                  <div className="card-icon" style={{ background: link.bg, boxShadow: `0 8px 20px ${link.glow}` }}>
                    <link.icon size={22} color="#fff" />
                  </div>
                  <div>
                    <div className="card-title">{link.title}</div>
                    <div className="card-desc">{link.desc}</div>
                  </div>
                  <div className="arrow"><ArrowRight size={16} /></div>
                </div>
              );
              return (
                <motion.div
                  key={link.title}
                  variants={u}
                  className={`card${i === 0 ? " featured" : ""}`}
                  onClick={link.internal ? () => navigate("/website") : undefined}
                  whileTap={{ scale: 0.99 }}
                >
                  {link.internal ? inner : <a href={`https://workid-app.vercel.app${i === 2 ? "/signup/worker" : i === 3 ? "/signup/employer" : ""}`} target="_blank" rel="noopener noreferrer">{inner}</a>}
                </motion.div>
              );
            })}
          </div>

          {/* Secondary */}
          <motion.div variants={u} className="sec-grid">
            {secondaryLinks.map(l => (
              <a key={l.title} href={l.url} target="_blank" rel="noopener noreferrer" className="sec-card">
                <div className="sec-icon"><l.icon size={22} color="#7C3AED" /></div>
                <span>{l.title}</span>
              </a>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div variants={u} className="divider" style={{ width:"100%", marginBottom: 14 }}>
            <span>Connect With Us</span>
          </motion.div>

          {/* Socials */}
          <motion.div variants={u} className="socials">
            {socials.map(s => (
              <motion.a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                aria-label={s.name} className="soc" style={{ "--c": s.color }} whileTap={{ scale:0.9 }}>
                <s.icon size={19} color="#64748B" />
              </motion.a>
            ))}
          </motion.div>

          {/* Email */}
          <motion.div variants={u} className="email-row">
            <Mail size={14} color="#CBD5E1" />
            <a href="mailto:hello@workid.lk">hello@workid.lk</a>
          </motion.div>

          <motion.p variants={u} className="footer">© 2026 WorkID · All rights reserved.</motion.p>

        </motion.div>
      </div>
    </>
  );
}