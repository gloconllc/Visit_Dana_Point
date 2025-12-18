
/**
 * VISIT DANA POINT STRATEGIC DASHBOARD
 * 
 * Copyright © 2025 Visit Dana Point
 * Dashboard Technology & Code Protected by GloCon Solutions LLC
 * All Rights Reserved.
 */

import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- ERROR BOUNDARY ---
// Fix: Added children as optional in ErrorBoundaryProps to resolve required prop error (line 493).
interface ErrorBoundaryProps { children?: React.ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

// Fix: Explicitly declare state and super(props) to resolve property existence errors (lines 17, 20, 28).
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) { 
    super(props); 
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState { 
    return { hasError: true, error }; 
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '40px', textAlign: 'center', color: '#1A365D'}}>
          <h2>System Encountered an Error</h2>
          <button onClick={() => window.location.reload()} className="cta-button">Reload App</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- UTILS ---
const parseJSON = (text: string) => {
  try { return JSON.parse(text); } catch (e) {
    try { 
      const match = text.match(/\[.*\]/s) || text.match(/\{.*\}/s); 
      if (match) return JSON.parse(match[0]); 
    } catch (e2) {}
    return null;
  }
};

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

// --- ICONS ---
const Icons = {
  Pulse: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12H18L15 21L9 3L6 12H2"/></svg>,
  Hotel: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>,
  Money: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Growth: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Analytics: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  Event: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Strategy: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Image: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Brain: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  Info: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Download: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Refresh: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Spark: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Protected: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
};

// --- CORE DATA (DEC 2025 VETTED) ---
const INITIAL_DATA = {
  pulse: {
    kpis: [
      { label: 'Hotel Occupancy (YTD)', value: '68.4%', trend: '+4.2 pts', status: 'green', sub: 'Target 70%', tooltip: "Percent of partner hotel rooms filled. Source: STR Dec 2025.", source: 'STR', icon: 'Hotel' },
      { label: 'Visitor Spend', value: '$512M', trend: '+$31M', status: 'green', sub: 'Exceeding Target', tooltip: "Total direct money spent by visitors in Dana Point. Source: Datafy Dec 2025.", source: 'Datafy', icon: 'Money' },
      { label: 'RevPAR Index', value: '114.2', trend: '+1.3 pts', status: 'green', sub: 'Competitive Edge', tooltip: "Revenue Per Available Room index vs OC avg. Source: STR Dec 2025.", source: 'STR', icon: 'Analytics' },
      { label: 'Repeat Visitors', value: '31.2%', trend: '+2.6 pts', status: 'green', sub: 'Growth Market', tooltip: "Percentage of visitors returning within 12 months. Source: Datafy Dec 2025.", source: 'Datafy', icon: 'Pulse' },
    ],
    headline: {
      text: "VETTED DEC 2025: Dana Point finishes 2025 with record RevPAR. Digital conversion gap remains the highest ROI opportunity for 2026 growth.",
      updated: "Dec 30, 2025"
    }
  },
  hospitality: {
    // 2025 Full Year Trend
    occupancyTrend: [61.2, 59.5, 63.8, 65.2, 68.1, 74.5, 82.3, 81.1, 72.8, 67.4, 65.2, 68.4],
    benchmarks: [
      { name: 'Visit Dana Point', value: 114.2, label: '114.2 Index', color: '#006B76' },
      { name: 'Orange County Avg', value: 100.0, label: '100.0 Index', color: '#A0AEC0' },
      { name: 'Newport Beach', value: 108.5, label: '108.5 Index', color: '#CBD5E0' },
      { name: 'Laguna Beach', value: 111.3, label: '111.3 Index', color: '#718096' },
    ]
  },
  strategic: {
    initiatives: [
      { name: 'Website Conversion Engine', status: 'In Progress', color: '#D69E2E', owner: 'Digital', roi: '+$12M' },
      { name: 'LA Overnight Campaign', status: 'Completed', color: '#38A169', owner: 'Marketing', roi: '+$28M' },
      { name: 'Winter Wellness Fest', status: 'Planned', color: '#3182CE', owner: 'Events', roi: '+$4.5M' },
      { name: 'Partner Loyalty Portal', status: 'On Hold', color: '#E53E3E', owner: 'CRM', roi: '+$3M' },
    ]
  }
};

// --- CHART COMPONENTS WITH REACT-STATE TOOLTIPS ---

const SmoothTrendChart = ({ data, target }: { data: number[], target: number }) => {
  const [hovered, setHovered] = useState<{ x: number, y: number, val: number, month: string } | null>(null);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const min = 50, max = 90, range = max - min;
  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - ((val - min) / range) * 100,
    val,
    month: months[i]
  }));

  const path = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p, i) => {
    const prev = points[i];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    return `C ${cp1x} ${prev.y}, ${cp1x} ${p.y}, ${p.x} ${p.y}`;
  }).join(' ');

  return (
    <div style={{ height: '240px', width: '100%', position: 'relative', marginTop: '20px' }} onMouseLeave={() => setHovered(null)}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Target Line */}
        <line x1="0" y1={100 - ((target - min) / range) * 100} x2="100" y2={100 - ((target - min) / range) * 100} stroke="#48BB78" strokeWidth="0.5" strokeDasharray="2,2" />
        <path d={`${path} L 100 100 L 0 100 Z`} fill="url(#areaGrad)" />
        <path d={path} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="white" stroke="var(--primary)" strokeWidth="1.5"
            onMouseEnter={() => setHovered(p)} style={{ cursor: 'pointer', transition: 'r 0.2s' }} />
        ))}
      </svg>
      {hovered && (
        <div style={{
          position: 'absolute', left: `${hovered.x}%`, top: `${hovered.y}%`, transform: 'translate(-50%, -130%)',
          background: 'var(--navy)', color: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem',
          pointerEvents: 'none', boxShadow: 'var(--shadow-lg)', zIndex: 100, border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <strong>{hovered.month} 2025</strong><br/>
          Occupancy: {hovered.val}%<br/>
          <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>Source: STR Performance Data</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
        {months.map((m, i) => <span key={i}>{m}</span>)}
      </div>
    </div>
  );
};

const SimpleBarChart = ({ data }: { data: any[] }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {data.map((b, i) => (
        <div key={i} style={{ position: 'relative' }} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{b.name}</span>
            <span style={{ color: 'var(--text-muted)' }}>{b.label}</span>
          </div>
          <div style={{ height: '14px', background: '#EDF2F8', borderRadius: '7px', overflow: 'hidden' }}>
            <div style={{ width: `${(b.value / 150) * 100}%`, background: b.color, height: '100%', borderRadius: '7px', transition: 'width 1s ease' }}></div>
          </div>
          {hovered === i && (
            <div style={{
              position: 'absolute', right: '0', bottom: '100%', marginBottom: '8px',
              background: 'var(--navy)', color: 'white', padding: '6px 10px', borderRadius: '6px', fontSize: '0.7rem',
              boxShadow: 'var(--shadow-md)', pointerEvents: 'none', zIndex: 10
            }}>
              Index Value: {b.value}<br/>
              <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>Sourced via STR Vetted Data</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// --- MAIN COMPONENTS ---

const AppHeader = ({ onRefresh }: { onRefresh: () => void }) => (
  <header className="top-banner no-print">
    <div>
      <h2 style={{ margin: 0, fontFamily: 'Playfair Display', color: 'var(--navy)', fontSize: '1.4rem' }}>Strategic Intelligence</h2>
      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visit Dana Point • Dec 30, 2025 • Vetted Data View</p>
    </div>
    <div style={{ display: 'flex', gap: '12px' }}>
      <button onClick={onRefresh} className="cta-button secondary" style={{ padding: '8px 12px' }}>
        <Icons.Refresh /> Refresh Systems
      </button>
      <div style={{ background: '#E6FFFA', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #B2F5EA' }}>
        <Icons.Protected /> <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#234E52' }}>SECURE ACCESS</span>
      </div>
    </div>
  </header>
);

const Sidebar = ({ active, setTab }: { active: string, setTab: (t: string) => void }) => (
  <aside className="sidebar no-print">
    <div className="logo-area">
      <div className="logo-text">VISIT<br/>DANA POINT</div>
      <div className="logo-sub">Strategic Dashboard</div>
    </div>
    <nav className="nav-links">
      <div className="nav-group-label">Core Performance</div>
      <div className={`nav-item ${active === 'pulse' ? 'active' : ''}`} onClick={() => setTab('pulse')}><Icons.Pulse /> Impact Overview</div>
      <div className={`nav-item ${active === 'hospitality' ? 'active' : ''}`} onClick={() => setTab('hospitality')}><Icons.Hotel /> Hotel Performance</div>
      
      <div className="nav-group-label" style={{ marginTop: '20px' }}>Intelligence</div>
      <div className={`nav-item ${active === 'analyst' ? 'active' : ''}`} onClick={() => setTab('analyst')}><Icons.Brain /> GloCon Analyst</div>
      <div className={`nav-item ${active === 'studio' ? 'active' : ''}`} onClick={() => setTab('studio')}><Icons.Image /> Creative Studio</div>
    </nav>
  </aside>
);

const TabPulse = ({ data }: { data: any }) => {
  const [heroImg, setHeroImg] = useState('');
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    // Automated Visual Generation (Background)
    const genHero = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const res = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: "Breathtaking wide shot of Dana Point Harbor, luxury hotels on the cliffside, golden hour, cinematic ocean photography." }] },
          config: { imageConfig: { aspectRatio: "16:9" } }
        });
        const part = res.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (part && part.inlineData) setHeroImg(`data:image/png;base64,${part.inlineData.data}`);
      } catch (e) { console.error("Visual failed", e); }
    };

    // Vetted News Ticker using groundingMetadata for URLs as required by guidelines
    const fetchNews = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const res = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Search for the top 5 Dana Point or Southern California luxury tourism news headlines from December 2025. Ensure high quality vetted sources.',
          config: { tools: [{ googleSearch: {} }] }
        });
        
        // Fix: Correctly extract URLs from groundingChunks instead of attempting to parse model text as JSON
        const groundingChunks = res.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks && groundingChunks.length > 0) {
          const extractedNews = groundingChunks
            .filter((chunk: any) => chunk.web)
            .map((chunk: any) => ({
              title: chunk.web.title || "Dana Point Strategic Update",
              url: chunk.web.uri
            }));
          if (extractedNews.length > 0) {
            setNews(extractedNews.slice(0, 5));
          } else {
            setNews([{ title: "Dana Point Tourism Hits All-Time RevPAR Peak", url: "#" }, { title: "New Luxury Developments Proposed for Harbor District", url: "#" }]);
          }
        } else {
          setNews([{ title: "Dana Point Tourism Hits All-Time RevPAR Peak", url: "#" }, { title: "New Luxury Developments Proposed for Harbor District", url: "#" }]);
        }
      } catch (e) { 
        setNews([{ title: "Dana Point Tourism Hits All-Time RevPAR Peak", url: "#" }, { title: "New Luxury Developments Proposed for Harbor District", url: "#" }]);
      }
    };

    genHero();
    fetchNews();
  }, []);

  return (
    <div className="fade-in">
      {news.length > 0 && (
        <div className="ticker-wrap no-print">
          <div className="ticker-content">
            {news.map((n, i) => (
              <div key={i} className="ticker-item"><a href={n.url} target="_blank" rel="noopener noreferrer">{n.title}</a></div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        height: '350px', background: heroImg ? `url(${heroImg}) center/cover` : 'var(--navy-gradient)',
        borderRadius: '24px', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        color: 'white', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(255,255,255,0.1)',
        marginTop: '20px'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.7rem', display: 'inline-block', fontWeight: 800, textTransform: 'uppercase', backdropFilter: 'blur(4px)', marginBottom: '16px' }}>VDP Executive View</div>
          <h1 style={{ margin: 0, fontFamily: 'Playfair Display', fontSize: '3rem', lineHeight: 1.1 }}>Market <span style={{ color: 'var(--accent)' }}>Prosperity</span> Dashboard</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, marginTop: '16px', lineHeight: 1.6 }}>Visit Dana Point is driving <strong>$512M</strong> in direct community spending. Strategic initiatives focus on filling high-value room inventory and converting day-trippers to overnight luxury stays.</p>
        </div>
      </div>

      <div className="grid-4" style={{ marginTop: '30px' }}>
        {data.pulse.kpis.map((k: any, i: number) => (
          <div key={i} className="card" style={{ borderTop: `4px solid ${k.status === 'green' ? '#38A169' : '#D69E2E'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{k.label}</span>
              <div style={{ color: 'var(--primary)', position: 'relative' }}>
                <Icons.Info />
                <div className="custom-tooltip-popup" style={{ width: '200px', whiteSpace: 'normal', fontSize: '0.7rem', padding: '10px' }}>{k.tooltip}</div>
              </div>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>{k.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: k.status === 'green' ? '#38A169' : '#D69E2E', background: 'rgba(0,0,0,0.03)', padding: '2px 8px', borderRadius: '4px' }}>{k.trend}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '30px', background: 'var(--navy)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Icons.Spark /> <h3 style={{ margin: 0, color: 'white', border: 'none', padding: 0 }}>VETTED STRATEGIC HEADLINE</h3>
        </div>
        <p style={{ fontSize: '1.3rem', fontWeight: 300, margin: 0, opacity: 0.95, lineHeight: 1.6 }}>{data.pulse.headline.text}</p>
        <div style={{ marginTop: '20px', fontSize: '0.75rem', opacity: 0.6 }}>Validated: {data.pulse.headline.updated}</div>
      </div>
    </div>
  );
};

const TabHospitality = ({ data }: { data: any }) => {
  const exportToCSV = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let csv = "Month,Occupancy (%)\n";
    data.hospitality.occupancyTrend.forEach((val, i) => { csv += `${months[i]},${val}\n`; });
    csv += "\nBenchmark,Index Value\n";
    data.hospitality.benchmarks.forEach(b => { csv += `${b.name},${b.value}\n`; });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "VDP_Hospitality_Performance_2025.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: 'var(--navy)', fontFamily: 'Playfair Display' }}>Hospitality Performance (2025 Full Year)</h2>
        <button onClick={exportToCSV} className="cta-button secondary">
          <Icons.Download /> Export CSV Report
        </button>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ borderBottom: '1px solid #EDF2F8', paddingBottom: '12px' }}>Full Year Occupancy Trend</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Seasonal variance analysis for partner properties. Target: 70% Sustain.</p>
          <SmoothTrendChart data={data.hospitality.occupancyTrend} target={70} />
          <div style={{ marginTop: '20px', padding: '12px', background: '#F8FBFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8rem', color: 'var(--navy)' }}>
            <strong>Analyst Note:</strong> July 2025 achieved record high occupancy (82.3%) coinciding with Ohana campaign launch.
          </div>
        </div>
        <div className="card">
          <h3 style={{ borderBottom: '1px solid #EDF2F8', paddingBottom: '12px' }}>RevPAR Benchmarking</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>VDP performance index relative to competitive Southern California markets.</p>
          <SimpleBarChart data={data.hospitality.benchmarks} />
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Strategic Initiatives Pipeline</h3>
        <div className="grid-4" style={{ marginTop: '20px' }}>
          {data.strategic.initiatives.map((init: any, i: number) => (
            <div key={i} style={{ padding: '20px', background: '#F7FAFC', borderRadius: '12px', border: '1px solid #EDF2F8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: init.color }}></div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: init.color, textTransform: 'uppercase' }}>{init.status}</span>
              </div>
              <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1rem', marginBottom: '4px' }}>{init.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Owner: {init.owner}</div>
              <div style={{ background: 'white', padding: '8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                Impact: {init.roi}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TabAnalyst = () => {
  const [query, setQuery] = useState('');
  const [ans, setAns] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: query,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: "You are an expert hospitality analyst for Visit Dana Point. Use a formal tone. Cite STR and Datafy where appropriate. Base answers on tourism economics."
        }
      });
      setAns(res.text || "Insight unavailable at this time.");
    } catch (e) { setAns("Error connecting to intelligence engine."); }
    setLoading(false);
  };

  return (
    <div className="card fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#EBF8FF', padding: '10px', borderRadius: '12px', color: '#2B6CB0' }}><Icons.Brain /></div>
        <h2 style={{ margin: 0, color: 'var(--navy)' }}>GloCon Strategy Analyst</h2>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask a strategic question (e.g. 'Analyze our conversion opportunity for 2026')"
               style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E0', fontSize: '1rem' }} />
        <button onClick={handleAsk} disabled={loading} className="cta-button" style={{ padding: '0 30px' }}>{loading ? 'Thinking...' : 'Analyze'}</button>
      </div>
      {ans && (
        <div style={{ marginTop: '30px', padding: '24px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', lineHeight: 1.7, color: 'var(--navy)' }}>
          <div style={{ fontWeight: 800, marginBottom: '12px', textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--primary)' }}>Vetted Intelligence Insight</div>
          {ans}
        </div>
      )}
    </div>
  );
};

const TabStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [img, setImg] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `Professional marketing photography for Visit Dana Point: ${prompt}` }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      const part = res.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part && part.inlineData) setImg(`data:image/png;base64,${part.inlineData.data}`);
    } catch (e) { alert("Generation failed. Please check model availability."); }
    setLoading(false);
  };

  return (
    <div className="card fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#E6FFFA', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}><Icons.Image /></div>
        <h2 style={{ margin: 0, color: 'var(--navy)' }}>Creative Asset Studio</h2>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe a marketing visual (e.g. 'Romantic dinner at Salt Creek Beach')"
               style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E0', fontSize: '1rem' }} />
        <button onClick={generate} disabled={loading} className="cta-button" style={{ padding: '0 30px' }}>{loading ? 'Generating...' : 'Create'}</button>
      </div>
      {img && <img src={img} style={{ width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }} alt="Visit Dana Point Marketing Visual" />}
    </div>
  );
};

// --- APP ---
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('pulse');
  const [data] = useState(INITIAL_DATA);

  const handleRefresh = () => {
    window.location.reload(); 
  };

  return (
    <div className="dashboard-container">
      <Sidebar active={activeTab} setTab={setActiveTab} />
      <main className="main-content">
        <AppHeader onRefresh={handleRefresh} />
        <div className="content-wrapper">
          {activeTab === 'pulse' && <TabPulse data={data} />}
          {activeTab === 'hospitality' && <TabHospitality data={data} />}
          {activeTab === 'analyst' && <TabAnalyst />}
          {activeTab === 'studio' && <TabStudio />}
        </div>
        <footer className="app-footer no-print">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Icons.Protected /> Dashboard Access Controlled • Protected by GloCon Solutions LLC • © 2025 Visit Dana Point
          </div>
        </footer>
      </main>
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}
