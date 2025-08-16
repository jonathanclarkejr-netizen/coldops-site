'use client'

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Target,
  Send,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Linkedin,
} from "lucide-react";

// =============================================================
// ColdOps.ai — One‑page React site (FULL FILE)
// Tweaks implemented:
// - No "boutique" wording
// - Full-width header underlines + inline underline utility
// - Results metric: 20+ qualified meetings / month
// - Pricing: Pilot / Growth / Scale with subtitles
// - Neater pricing; consistent tick icon size; hover highlight
// - Sticky nav, particle bg, Calendly modal, HubSpot form placeholder
// =============================================================

// Brand palette + utilities
const BrandCSS = () => (
  <style>{`
    :root {
      --deep-space: #0B1B2B;      /* Primary background */
      --midnight:   #1F2A36;      /* Section alternation */
      --frost:      #A7B1BA;      /* Secondary text */
      --white:      #FFFFFF;      /* Primary text */
      --icy:        #33F3FF;      /* Highlight/Primary CTA */
      --luminous:   #00C4FF;      /* Glow/hover accents */
    }
    html { scroll-behavior: smooth; }
    body { background: var(--deep-space); color: var(--white); }

    .neon-text { text-shadow: 0 0 10px rgba(0,196,255,0.35); }
    .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }

    /* Section title underline — spans full width of heading text */
    .title-underline { position: relative; display: inline-block; }
    .title-underline::after {
      content: ""; position: absolute; left: 0; bottom: -8px; height: 3px; width: 100%;
      background: linear-gradient(90deg, var(--icy), var(--luminous)); border-radius: 999px;
    }

    /* Inline underline for specific words (e.g., “Precision”) */
    .u-underline {
      background-image: linear-gradient(90deg, var(--icy), var(--luminous));
      background-repeat: no-repeat; background-position: 0 calc(100% + 4px);
      background-size: 100% 3px; padding-bottom: 2px; border-radius: 1px;
    }

    :focus-visible { outline: 2px solid var(--luminous); outline-offset: 2px; }
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 999px; }
  `}</style>
);

// Lightweight particle background
const ParticleField: React.FC<{ density?: number }> = ({ density = 48 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    window.addEventListener("resize", onResize);

    const count = density;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.6,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      a: Math.random() * 0.5 + 0.3,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const g = ctx.createRadialGradient(width*0.7, height*0.2, 10, width*0.7, height*0.2, Math.max(width, height));
      g.addColorStop(0, "rgba(0,196,255,0.05)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(51,243,255,${p.a})`; ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(draw);
    };

    if (!mq.matches) draw();
    return () => { window.removeEventListener("resize", onResize); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [density]);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full block"/>;
};

// CTA Button
const CTAButton: React.FC<{ children: React.ReactNode; onClick?: () => void; href?: string; size?: "sm"|"md"|"lg"; variant?: "solid"|"outline"; }>
= ({ children, onClick, href, size = "md", variant = "solid" }) => {
  const sizes = { sm: "px-4 py-2 text-sm", md: "px-5 py-2.5 text-base", lg: "px-6 py-3 text-lg" }[size];
  const base = variant === "solid"
    ? "bg-[var(--icy)] text-[var(--deep-space)] hover:bg-[var(--luminous)] shadow-[0_0_20px_rgba(0,196,255,0.35)]"
    : "border border-[var(--icy)] text-[var(--icy)] hover:bg-[var(--icy)] hover:text-[var(--deep-space)]";
  const Comp: any = href ? "a" : "button";
  return (
    <Comp {...(href ? { href } : { onClick })} className={`inline-flex items-center gap-2 rounded-xl font-semibold transition ${sizes} ${base}`}>
      {children}<ArrowRight size={18} className="opacity-80"/>
    </Comp>
  );
};

// Header with scrollspy
const Header: React.FC<{ sections: { id: string; label: string }[]; onOpenCalendly: () => void; active: string }>
= ({ sections, onOpenCalendly, active }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 8); onScroll(); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition backdrop-blur ${scrolled ? "bg-[rgba(11,27,43,0.75)] border-b border-white/10" : "bg-transparent"}`} aria-label="Site header">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex h-16 items-center justify-between">
          <a href="#hero" className="font-black tracking-wide text-xl neon-text">ColdOps<span className="text-[var(--icy)]">.ai</span></a>
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={`text-sm tracking-widest uppercase hover:text-[var(--luminous)] transition ${active === s.id ? "text-[var(--icy)]" : "text-white"}`}>{s.label}</a>
            ))}
            <CTAButton size="sm" onClick={onOpenCalendly}>Schedule a Call</CTAButton>
          </nav>
          <button className="md:hidden p-2 rounded-lg hover:bg-white/5" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(v=>!v)}>{open ? <X/> : <Menu/>}</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[rgba(11,27,43,0.9)]">
          <div className="mx-auto max-w-[1200px] px-4 py-4 flex flex-col gap-2">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="py-3 text-sm tracking-widest uppercase hover:text-[var(--luminous)]" onClick={() => setOpen(false)}>{s.label}</a>
            ))}
            <div className="pt-2"><CTAButton size="md" onClick={() => { setOpen(false); onOpenCalendly(); }}>Schedule a Call</CTAButton></div>
          </div>
        </div>
      )}
    </header>
  );
};

// Hero
const Hero: React.FC<{ onOpenCalendly: () => void }> = ({ onOpenCalendly }) => (
  <section id="hero" className="relative isolate overflow-hidden">
    <ParticleField />
    <div className="mx-auto max-w-[1200px] px-4 pt-32 pb-24 md:pt-36 md:pb-32">
      <motion.h1 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-4xl md:text-6xl font-extrabold">
        Outbound Leads, Delivered with <span className="text-[var(--icy)] neon-text u-underline">Precision</span>.
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-6 text-lg md:text-xl text-[var(--frost)] max-w-2xl">
        We help B2B teams secure more sales meetings with ideal clients through data‑driven cold outreach — so your team can focus on closing deals.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-10 flex flex-wrap items-center gap-4">
        <CTAButton size="lg" onClick={onOpenCalendly}>Schedule a Call</CTAButton>
        <CTAButton size="lg" variant="outline" href="#how-it-works">How it Works</CTAButton>
      </motion.div>
      <a href="#how-it-works" className="group mt-16 inline-flex items-center gap-2 text-[var(--frost)]"><span>Scroll</span><ChevronDown className="group-hover:translate-y-0.5 transition"/></a>
    </div>
  </section>
);

// Section wrapper
const Section: React.FC<{ id: string; title: string; subtitle?: string; alt?: boolean; children: React.ReactNode }>
= ({ id, title, subtitle, alt, children }) => (
  <section id={id} className={`${alt ? "bg-[var(--midnight)]" : "bg-transparent"}`}>
    <div className="mx-auto max-w-[1100px] px-4 py-20 md:py-24">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold title-underline">{title}</h2>
        {subtitle && <p className="mt-4 text-[var(--frost)] max-w-2xl">{subtitle}</p>}
      </div>
      {children}
    </div>
  </section>
);

// How It Works
const HowItWorks: React.FC = () => {
  const items = [
    { icon: <Target className="text-[var(--luminous)]" size={32} />, title: "1. Target & Research", text: "Identify your ICP and build precise lead lists using proprietary data and AI insights." },
    { icon: <Send className="text-[var(--luminous)]" size={32} />, title: "2. Outreach & Engage", text: "Multi‑channel campaigns (email + LinkedIn) with personalized messaging that sparks replies." },
    { icon: <CalendarCheck className="text-[var(--luminous)]" size={32} />, title: "3. Deliver & Optimize", text: "Qualified meetings land in your inbox & calendar. We iterate for continuous improvement." },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {items.map((it, i) => (
        <motion.div key={it.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="panel rounded-2xl p-6 md:p-7 hover:shadow-[0_0_30px_rgba(0,196,255,0.15)] transition">
          <div className="mb-4 w-12 h-12 rounded-full bg-white/5 grid place-items-center">{it.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{it.title}</h3>
          <p className="text-[var(--frost)]">{it.text}</p>
        </motion.div>
      ))}
    </div>
  );
};

// Results
const Results: React.FC = () => {
  const metrics = [
    { k: "8×", v: "Avg. ROI per campaign" },
    { k: "20+", v: "Qualified meetings / month" },
    { k: "2×", v: "Sales productivity boost" },
    { k: "95%", v: "Meeting show‑up rate" },
  ];
  return (
    <div>
      <div className="grid md:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <motion.div key={m.v} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="panel rounded-2xl p-6 text-center">
            <div className="text-4xl font-extrabold text-[var(--icy)] mb-2">{m.k}</div>
            <div className="text-[var(--frost)]">{m.v}</div>
          </motion.div>
        ))}
      </div>
      <div className="mt-10 panel rounded-2xl p-6 md:p-8">
        <blockquote className="text-lg md:text-xl italic">“ColdOps helped us triple our pipeline in 90 days. Every meeting landed was on‑profile — and showed up.”</blockquote>
        <div className="mt-3 text-sm text-[var(--frost)]">— Jane Carter, VP Sales, TechCorp</div>
      </div>
      <div className="mt-8"><CTAButton href="#contact">Ready to see this for your team?</CTAButton></div>
    </div>
  );
};

// Pricing (cleaner layout, hover-highlight per card)
const Pricing: React.FC<{ onOpenCalendly: () => void }> = ({ onOpenCalendly }) => {
  type Plan = {
    title: string;
    subtitle: string;
    price: string;
    blurb: string;
    features: string[];
  };

  const plans: Plan[] = [
    {
      title: "Pilot",
      subtitle: "Prove It",
      price: "£2,500 one‑off",
      blurb: "Low‑risk trial to show ROI before committing long term.",
      features: [
        "Duration: 4–6 weeks",
        "Outreach volume: 100–200 prospects",
        "Channels: Email + LinkedIn",
        "End‑to‑end setup (domains, inboxes, copy, automations)",
        "Multi‑touch personalized sequences",
        "Weekly reporting + live dashboard",
        "Minimum 5 qualified meetings (extended at no cost if not hit)",
      ],
    },
    {
      title: "Growth",
      subtitle: "Steady Flow",
      price: "£4,000 / month",
      blurb: "Predictable pipeline without hiring SDRs.",
      features: [
        "Rolling monthly (3‑month minimum)",
        "Outreach volume: 200–400 prospects / month",
        "Expected results: 8–12 qualified meetings / month",
        "Continuous list building & enrichment",
        "Email + LinkedIn sequences optimised weekly",
        "Reply handling & meeting scheduling to your calendar",
        "Weekly reports + bi‑weekly check‑in calls",
        "SLA: Minimum 6 meetings / month (we add outreach if under‑delivered)",
      ],
    },
    {
      title: "Scale",
      subtitle: "Outbound Engine",
      price: "£6,000–£7,000 / month",
      blurb: "For companies ready to dominate their market with multi‑channel outbound.",
      features: [
        "Rolling monthly (3‑month minimum)",
        "Outreach volume: 400–700 prospects / month",
        "Expected results: 12–20 qualified meetings / month",
        "Dedicated domain + 10+ inboxes managed",
        "Advanced segmentation (by ICP, region, or trigger event)",
        "Multi‑channel (Email, LinkedIn, optional calling partner integration)",
        "Weekly reports + strategy reviews + Quarterly Business Review (QBR)",
        "SLA: Minimum 10 meetings / month (extended outreach if under‑delivered)",
      ],
    },
  ];

  const [hovered, setHovered] = useState<number | null>(null);

  const cardClass = (i: number) => {
    const isHighlighted = hovered === i || (hovered === null && i === 1); // middle highlighted by default
    return `rounded-2xl p-6 md:p-7 border panel h-full flex flex-col transition ${
      isHighlighted
        ? 'border-[var(--luminous)] shadow-[0_0_40px_rgba(0,196,255,0.25)] bg-white/5'
        : 'border-white/10'
    }`;
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((p, i) => (
        <motion.div
          key={p.title}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className={cardClass(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{p.title}</h3>
              <span className="text-sm text-[var(--frost)]">— {p.subtitle}</span>
            </div>
            <div className="mt-2 text-[var(--icy)] font-extrabold">{p.price}</div>
            <p className="mt-1 text-[var(--frost)]">{p.blurb}</p>
            <ul className="mt-4 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="shrink-0 text-[var(--icy)]" />
                  <span className="text-sm text-[var(--frost)]">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 pt-2">
            <CTAButton onClick={onOpenCalendly}>Discuss This Plan</CTAButton>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// About (no "boutique")
const About: React.FC = () => (
  <div className="grid md:grid-cols-5 gap-8 items-start">
    <div className="md:col-span-3">
      <p className="text-lg mb-4">ColdOps.ai helps B2B companies connect with hard‑to‑reach prospects through precise, personalized outreach.</p>
      <p className="text-[var(--frost)] mb-4">You get senior experts dedicated to your account. We blend human sales craft with <span className="text-[var(--icy)]">AI‑driven tooling</span> to maximize response rates and optimize every campaign.</p>
      <p className="text-[var(--frost)]">We operate as an extension of your team — handling top‑of‑funnel so you can focus on closing. Transparent process, quality over quantity, continuous improvement.</p>
    </div>
    <div className="md:col-span-2">
      <div className="panel rounded-2xl p-6">
        <h4 className="font-semibold mb-4">At‑a‑glance</h4>
        <ul className="space-y-3 text-sm text-[var(--frost)]">
          <li className="flex items-center gap-2"><CheckCircle2 size={16}/> 10+ years combined B2B experience</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={16}/> 100% focus on outbound</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Serving SaaS, Cyber, Finance & more</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Based in the UK — working globally</li>
        </ul>
      </div>
    </div>
  </div>
);

// Contact + HubSpot placeholder
const Contact: React.FC<{ onOpenCalendly: () => void }> = ({ onOpenCalendly }) => {
  const [sent, setSent] = useState(false);
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => { e.preventDefault(); setSent(true); };
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="panel rounded-2xl p-6 md:p-8">
        <h3 className="text-xl font-semibold mb-4">Let’s Talk</h3>
        {!sent ? (
          <form onSubmit={onSubmit} className="space-y-4" aria-label="Contact form">
            <div><label className="block text-sm mb-1" htmlFor="name">Full Name</label><input id="name" name="name" required className="w-full rounded-lg bg-[var(--midnight)] border border-white/10 px-3 py-2 focus:border-[var(--luminous)]"/></div>
            <div><label className="block text-sm mb-1" htmlFor="email">Work Email</label><input id="email" name="email" type="email" required className="w-full rounded-lg bg-[var(--midnight)] border border-white/10 px-3 py-2 focus:border-[var(--luminous)]"/></div>
            <div><label className="block text-sm mb-1" htmlFor="company">Company</label><input id="company" name="company" className="w-full rounded-lg bg-[var(--midnight)] border border-white/10 px-3 py-2 focus:border-[var(--luminous)]"/></div>
            <div><label className="block text-sm mb-1" htmlFor="message">Message</label><textarea id="message" name="message" rows={4} className="w-full rounded-lg bg-[var(--midnight)] border border-white/10 px-3 py-2 focus:border-[var(--luminous)]" placeholder="Your goals, timeline, anything helpful…"/></div>
            <div className="flex flex-wrap items-center gap-3">
              <CTAButton>Send Message</CTAButton>
              <button type="button" onClick={onOpenCalendly} className="text-[var(--icy)] underline underline-offset-4 hover:text-[var(--luminous)]">Or schedule via Calendly</button>
            </div>
            <p className="text-xs text-[var(--frost)]">We’ll reply within one business day.</p>
          </form>
        ) : (
          <div className="text-[var(--icy)] font-semibold">Thanks — we’ll be in touch shortly.</div>
        )}
      </div>
      <div className="panel rounded-2xl p-6 md:p-8 h-full">
        <h3 className="text-xl font-semibold mb-4">Contact</h3>
        <div className="space-y-3 text-[var(--frost)]">
          <div className="flex items-center gap-3"><Mail/> <a className="hover:text-[var(--icy)]" href="mailto:hello@coldops.ai">hello@coldops.ai</a></div>
          <div className="flex items-center gap-3"><Phone/> <a className="hover:text-[var(--icy)]" href="tel:+44XXXXXXXXXX">+44 XXXXXXXXXX</a></div>
          <div className="flex items-center gap-3"><MapPin/> United Kingdom</div>
          <div className="flex items-center gap-3"><Linkedin/> <a className="hover:text-[var(--icy)]" href="#" onClick={(e)=>e.preventDefault()}>LinkedIn</a></div>
        </div>
        <div className="mt-6"><CTAButton onClick={onOpenCalendly}>Schedule a Call</CTAButton></div>
        <div className="mt-6 text-xs text-[var(--frost)]"><p><strong>HubSpot users:</strong> replace the form on the left with your HubSpot form embed code. Add the global tracking script once per site.</p></div>
      </div>
    </div>
  );
};

// Calendly Modal
const CalendlyModal: React.FC<{ open: boolean; onClose: () => void; url?: string }>
= ({ open, onClose, url = "https://calendly.com/" }) => {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-3xl h-[70vh] bg-[var(--midnight)] border border-white/10 rounded-2xl overflow-hidden" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="font-semibold">Schedule a Call</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10" aria-label="Close scheduling modal"><X/></button>
        </div>
        <div className="w-full h-full">
          <iframe title="Calendly" src={url} className="w-full h-full"/>
        </div>
      </div>
    </div>
  );
};

// Footer
const Footer: React.FC = () => (
  <footer className="bg-[var(--midnight)] border-top border-white/10">
    <div className="mx-auto max-w-[1100px] px-4 py-10 grid md:grid-cols-3 gap-8 items-start">
      <div>
        <div className="font-black tracking-wide text-xl neon-text">ColdOps<span className="text-[var(--icy)]">.ai</span></div>
        <p className="mt-3 text-sm text-[var(--frost)]">Precision outreach, measurable growth.</p>
      </div>
      <nav className="text-sm">
        <ul className="grid grid-cols-2 gap-2 text-[var(--frost)]">
          <li><a href="#hero" className="hover:text-[var(--icy)]">Home</a></li>
          <li><a href="#how-it-works" className="hover:text-[var(--icy)]">How It Works</a></li>
          <li><a href="#results" className="hover:text-[var(--icy)]">Results</a></li>
          <li><a href="#pricing" className="hover:text-[var(--icy)]">Pricing</a></li>
          <li><a href="#about" className="hover:text-[var(--icy)]">About</a></li>
          <li><a href="#contact" className="hover:text-[var(--icy)]">Contact</a></li>
        </ul>
      </nav>
      <div className="text-sm text-[var(--frost)] space-y-2">
        <div className="flex items-center gap-2"><Mail size={16}/> <a href="mailto:hello@coldops.ai" className="hover:text-[var(--icy)]">hello@coldops.ai</a></div>
        <div className="flex items-center gap-2"><Phone size={16}/> <a href="tel:+44XXXXXXXXXX" className="hover:text-[var(--icy)]">+44 XXXXXXXXXX</a></div>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="mx-auto max-w-[1100px] px-4 py-6 text-xs text-[var(--frost)] flex flex-wrap items-center justify-between gap-3">
        <div>© 2025 ColdOps.ai. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-[var(--icy)]">Privacy</a>
          <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-[var(--icy)]">Terms</a>
        </div>
      </div>
    </div>
  </footer>
);

// Main App
export default function ColdOpsSite() {
  const sections = useMemo(() => ([
    { id: "how-it-works", label: "How It Works" },
    { id: "results", label: "Results" },
    { id: "pricing", label: "Pricing" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ]), []);

  const [active, setActive] = useState<string>("hero");
  const [calOpen, setCalOpen] = useState(false);

  useEffect(() => {
    const opts = { root: null, rootMargin: "-40% 0px -55% 0px", threshold: 0 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, opts);
    ["hero", ...sections.map((s) => s.id)].forEach((id) => {
      const el = document.getElementById(id); if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen font-sans relative">
      <BrandCSS />
      <Header sections={sections} onOpenCalendly={() => setCalOpen(true)} active={active} />
      <main>
        <Hero onOpenCalendly={() => setCalOpen(true)} />
        <Section id="how-it-works" title="How It Works" subtitle="A proven 3‑step outreach strategy" alt>
          <HowItWorks />
        </Section>
        <Section id="results" title="Results" subtitle="Driving tangible growth for our clients.">
          <Results />
        </Section>
        <Section id="pricing" title="Pricing" subtitle="Flexible plans for every growth stage" alt>
          <Pricing onOpenCalendly={() => setCalOpen(true)} />
        </Section>
        <Section id="about" title="About Us" subtitle="Senior experts dedicated to your success.">
          <About />
        </Section>
        <Section id="contact" title="Contact Us" subtitle="Ready to supercharge your pipeline? Send a message or book a call." alt>
          <Contact onOpenCalendly={() => setCalOpen(true)} />
        </Section>
      </main>
      <Footer />
      <CalendlyModal open={calOpen} onClose={() => setCalOpen(false)} url="https://calendly.com/your-handle/30min" />
    </div>
  );
}
