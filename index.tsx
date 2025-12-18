
"use strict";

import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Authoritative Branding & Standards ---
const BRAND = {
  primary: '#006B76',      // Dana Point Teal
  accent: '#B8860B',       // Gold Accent
  navy: '#0A1C36',         // Boardroom Navy
  danger: '#D0021B',       // Breaking News Red
  dawn: '#F8FAFC',
  glass: 'rgba(255, 255, 255, 0.96)',
  radius: '32px',
  shadow: '0 30px 60px -12px rgba(10, 28, 54, 0.25)',
};

const DANA_POINT_IMAGERY = {
  background: "https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=1974&auto=format&fit=crop", 
  impact: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&h=400&fit=crop", 
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&h=400&fit=crop", 
  origin: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&h=400&fit=crop", 
  roi: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1200&h=400&fit=crop", 
  logistics: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&h=400&fit=crop", 
  studio: "https://images.unsplash.com/photo-1537954773382-c51440b8e4b7?q=80&w=1200&h=400&fit=crop", 
  analyst: "https://images.unsplash.com/photo-1555909712-4351fad34df3?q=80&w=1200&h=400&fit=crop",
  console: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&h=400&fit=crop",
  methodology: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&h=400&fit=crop",
  newsroom: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&h=400&fit=crop"
};

// --- News & Content Data ---
const NEWS_ITEMS = [
  { id: 1, category: 'Breaking', title: 'Dana Point Harbor Revitalization Enters Phase II', desc: 'Commercial core redevelopment strategy shifts to retail and public access enhancements.', time: '12M AGO', link: 'https://danapointharbor.com' },
  { id: 2, category: 'Hospitality', title: 'Dana Point Resorts Report Record Q4 Occupancy', desc: 'Year-over-year ADR growth exceeds Orange County coastal benchmarks by 12%.', time: '2H AGO', link: 'https://visitdanapoint.com' },
  { id: 3, category: 'Environment', title: 'Whale Migration Reaches Seasonal Peak Early', desc: 'World Cetacean Alliance monitors record-breaking grey whale counts off Salt Creek.', time: '4H AGO', link: 'https://festivalofwhales.com' },
  { id: 4, category: 'Governance', title: 'City Council Approves New Tourism Business Improvement District', desc: 'Renewed funding structure to support regional destination marketing for 2026.', time: '6H AGO', link: 'https://danapoint.org' },
  { id: 5, category: 'Surfing', title: 'Surfing Heritage & Culture Center Announces New Exhibit', desc: 'Celebrating the historical impact of Dana Point’s legendary Killer Dana break.', time: '1D AGO', link: 'https://shcc.org' },
];

const TICKER_MSGS = [
  "BREAKING: Dana Point Harbor Phase II Redevelopment Greenlit",
  "DATA: RevPAR Index Reaches 113 for Q4 Cycle",
  "VDP ALERT: $481M Annual Visitor Spend Verified",
  "ECONOMY: +17.1% Growth in Regional Yield",
  "NATURE: Gray Whale Migration Hits Record Counts"
];

// --- Initial Vetted Data ---
const INITIAL_VETTED_DATA = {
  impact: { spend: "$481.0M", growth: "17.1%", trips: "2.3M", jobs: "2,138" },
  hotel: { occupancy: "64.2%", adr: "$262", revpar: "$168.25", index: "113" },
  origin: { dayRate: "85.6%", overnight: "14.4%", repeats: "28.6%", primary: "Los Angeles" },
  events: [
    { name: 'Ohana Fest', roi: '14.2x' },
    { name: 'Festival of Whales', roi: '8.5x' },
    { name: 'Wellness Week', roi: '5.2x' }
  ]
};

// --- Multi-Tonal Professional Icons ---
const Icons = {
  Impact: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 17l6-6 4 4 8-8" stroke="#00A3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 5h8v8" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="21" cy="5" r="2" fill="var(--gold)"/>
    </svg>
  ),
  Hotel: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14" stroke="#00A3AF" strokeLinecap="round"/>
      <rect x="9" y="9" width="2" height="2" rx="0.5" fill="var(--gold)"/>
      <rect x="13" y="9" width="2" height="2" rx="0.5" fill="var(--gold)"/>
    </svg>
  ),
  Origin: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" stroke="#00A3AF"/>
      <circle cx="12" cy="12" r="3" fill="var(--gold)"/>
    </svg>
  ),
  Newsroom: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" stroke="#00A3AF"/>
      <path d="M14 2v6h6" stroke="var(--gold)"/>
      <path d="M7 8h5m-5 4h10m-10 4h10" stroke="#00A3AF"/>
    </svg>
  ),
  Studio: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 19l7-7 3 3-7 7-3-3z" fill="var(--gold)" fillOpacity="0.4"/>
      <path d="M13 2L3 12l9 9 10-10L13 2z" stroke="#00A3AF"/>
    </svg>
  ),
  Analyst: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l-8 7 8 7 8-7z" fill="var(--gold)" fillOpacity="0.2" stroke="#00A3AF"/>
      <path d="M12 16v6" stroke="var(--gold)"/>
    </svg>
  ),
  Console: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 17l6-6 4 4 6-6" stroke="#00A3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 7h16" stroke="var(--gold)" strokeWidth="2"/>
    </svg>
  ),
};

// --- Utilities ---
const cleanAI = (txt: string) => {
  if (!txt) return '';
  return txt
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\s*-\s+/gm, '• ')
    .replace(/\n/g, '<br/>')
    .replace(/\*/g, '')
    .trim();
};

// --- Components ---

const SectionHeader = ({ title, imgUrl }: { title: string, imgUrl: string }) => (
  <div className="section-header-card fade-in">
    <div className="sh-img-wrap">
      <img src={imgUrl} alt={title} loading="lazy" />
      <div className="sh-overlay">
        <div className="sh-content">
          <h2 className="sh-title">{title} Data Suite</h2>
        </div>
      </div>
    </div>
  </div>
);

const NavItem = ({ id, label, desc, icon: Icon, active, onClick }: any) => (
  <div className={`sb-item ${active === id ? 'active' : ''}`} onClick={() => onClick(id)}>
    <div className="ni-icon-wrap"><Icon /></div>
    <div className="ni-text">
       <span className="ni-label">{label}</span>
       <span className="ni-desc">{desc}</span>
    </div>
  </div>
);

const MetricUnit = ({ label, val, trend }: any) => (
  <div className="mu-card">
    <div className="mu-header">
      <span className="mu-label">{label}</span>
      <div className="mu-accent-dot" />
    </div>
    <div className="mu-val">{val}</div>
    <div className="mu-trend">{trend}</div>
  </div>
);

const NewsroomView = () => (
  <div className="view-pane newsroom-pane">
    <SectionHeader title="Intelligence Newsroom" imgUrl={DANA_POINT_IMAGERY.newsroom} />
    <div className="newsroom-grid">
      <div className="news-hero">
        <div className="breaking-badge">BREAKING NEWS</div>
        <h3 className="hero-title">{NEWS_ITEMS[0].title}</h3>
        <p className="hero-desc">{NEWS_ITEMS[0].desc}</p>
        <div className="hero-meta">
          <span>{NEWS_ITEMS[0].time}</span> • <a href={NEWS_ITEMS[0].link} target="_blank" rel="noopener noreferrer">FULL REPORT</a>
        </div>
      </div>
      <div className="news-sidebar">
        <h4 className="sidebar-label">MARKET UPDATES</h4>
        {NEWS_ITEMS.slice(1).map((item) => (
          <div key={item.id} className="sidebar-news-item">
            <div className="item-cat">{item.category}</div>
            <h5 className="item-title">{item.title}</h5>
            <div className="item-meta">
              <span>{item.time}</span> • <a href={item.link} target="_blank" rel="noopener noreferrer">LINK</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('impact');
  const [vettedData, setVettedData] = useState(INITIAL_VETTED_DATA);
  const [chatOpen, setChatOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'model', text: string }[]>([]);

  const handleUpdate = (newData: any) => {
    setVettedData(prev => ({ ...prev, impact: { ...prev.impact, ...newData } }));
  };

  const handleChat = async () => {
    if (!msg.trim()) return;
    const currentMsg = msg;
    setChatLog(p => [...p, { role: 'user', text: currentMsg }]);
    setMsg('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Act as the Dana Point Intelligence Concierge. Data: ${JSON.stringify(vettedData)}. User: ${currentMsg}. Response must be Title Case, professional, and HTML formatted. No markdown symbols.`,
      });
      setChatLog(p => [...p, { role: 'model', text: res.text || 'Intelligence synchronized.' }]);
    } catch { setChatLog(p => [...p, { role: 'model', text: 'Cognitive buffer exceeded.' }]); }
  };

  return (
    <div className="app-container">
      <div className="background-parallax" style={{ backgroundImage: `url(${DANA_POINT_IMAGERY.background})` }} />
      
      {/* Clickable, Slowed Ticker linked to Newsroom */}
      <div className="intelligence-ticker" onClick={() => setActiveTab('newsroom')} title="Click to open Newsroom">
        <div className="ticker-label">LIVE DATA</div>
        <div className="ticker-viewport">
          <div className="ticker-content">
            {TICKER_MSGS.map((m, i) => (
              <span key={i} className="ticker-msg">{m}</span>
            ))}
          </div>
        </div>
      </div>

      <aside className="sidebar-container">
        <div className="sidebar-brand">
           <h1 className="brand-logo">Visit Dana Point</h1>
           <span className="brand-suite">Intelligence Suite 12.0</span>
        </div>
        <nav className="sidebar-navigation">
          <NavItem id="impact" label="Economic Impact" desc="Regional Yield Analysis" icon={Icons.Impact} active={activeTab} onClick={setActiveTab} />
          <NavItem id="hotel" label="Hotel Performance" desc="STR Performance Benchmarks" icon={Icons.Hotel} active={activeTab} onClick={setActiveTab} />
          <NavItem id="origin" label="Visitor Origin" desc="Geofencing Market Analysis" icon={Icons.Origin} active={activeTab} onClick={setActiveTab} />
          <NavItem id="newsroom" label="Newsroom" desc="Live Marketplace Intelligence" icon={Icons.Newsroom} active={activeTab} onClick={setActiveTab} />
          <NavItem id="studio" label="Creative Studio" desc="Cinematic Asset Generation" icon={Icons.Studio} active={activeTab} onClick={setActiveTab} />
          <NavItem id="analyst" label="Strategic Analyst" desc="High-Reasoning Support Engine" icon={Icons.Analyst} active={activeTab} onClick={setActiveTab} />
          <NavItem id="console" label="Management Console" desc="Strategic Data Integration" icon={Icons.Console} active={activeTab} onClick={setActiveTab} />
        </nav>
        <div className="sidebar-status">Boardroom Stream Secure</div>
      </aside>

      <main className="content-viewport">
        <header className="viewport-header">
           <div className="vh-context">
              <h2 className="vh-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('room', ' Room')} Overview</h2>
              <p className="vh-location">Dana Point, California • Verified Sequence Active</p>
           </div>
           <div className="vh-actions">
              <button className="btn-vdp secondary" onClick={() => alert("Report generated.")}>Generate Executive PDF</button>
           </div>
        </header>

        <section className="viewport-scroll">
           {activeTab === 'impact' && (
             <div className="view-pane">
                <SectionHeader title="Economic Impact" imgUrl={DANA_POINT_IMAGERY.impact} />
                <div className="metrics-layout">
                   <MetricUnit label="Visitor Spend" val={vettedData.impact.spend} trend="+17.1%" />
                   <MetricUnit label="Annual Trips" val={vettedData.impact.trips} trend="Baseline" />
                   <MetricUnit label="Direct Employment" val={vettedData.impact.jobs} trend="Vetted" />
                   <MetricUnit label="Tax Contribution" val="$6.5M" trend="Direct" />
                </div>
             </div>
           )}
           {activeTab === 'hotel' && (
             <div className="view-pane">
                <SectionHeader title="Hotel Performance" imgUrl={DANA_POINT_IMAGERY.hotel} />
                <div className="metrics-layout">
                   <MetricUnit label="Occupancy Rate" val={vettedData.hotel.occupancy} trend="Market Average" />
                   <MetricUnit label="ADR Projection" val={vettedData.hotel.adr} trend="Verified Performance" />
                   <MetricUnit label="RevPAR Yield" val={vettedData.hotel.revpar} trend="Index 113" />
                   <MetricUnit label="Performance Index" val={vettedData.hotel.index} trend="Market Superiority" />
                </div>
             </div>
           )}
           {activeTab === 'origin' && (
             <div className="view-pane">
                <SectionHeader title="Visitor Origin" imgUrl={DANA_POINT_IMAGERY.origin} />
                <div className="metrics-layout">
                   <MetricUnit label="Day Visit Rate" val={vettedData.origin.dayRate} trend="Dominant Segment" />
                   <MetricUnit label="Overnight Growth" val={vettedData.origin.overnight} trend="Projected Increase" />
                   <MetricUnit label="Repeat Frequency" val={vettedData.origin.repeats} trend="Loyalty Benchmark" />
                   <MetricUnit label="Primary Market" val={vettedData.origin.primary} trend="Los Angeles Region" />
                </div>
             </div>
           )}
           {activeTab === 'newsroom' && <NewsroomView />}
           {activeTab === 'studio' && <CreativeStudioView />}
           {activeTab === 'analyst' && <StrategicAnalystView data={vettedData} />}
           {activeTab === 'console' && <DataManagementConsole onUpdate={handleUpdate} />}
        </section>
      </main>

      {chatOpen && (
        <div className="concierge-panel">
          <div className="cp-header">Intelligence Terminal</div>
          <div className="cp-body">
            {chatLog.map((c, i) => <div key={i} className={`chat-bubble-vdp ${c.role}`} dangerouslySetInnerHTML={{ __html: cleanAI(c.text) }} />)}
          </div>
          <div className="cp-input-area">
            <input placeholder="Query intelligence sequence..." value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} />
          </div>
        </div>
      )}
      <div className={`concierge-toggle ${chatOpen ? 'active' : ''}`} onClick={() => setChatOpen(!chatOpen)}>{chatOpen ? '✕' : '💬'}</div>

      <style>{`
        :root { 
          --teal: ${BRAND.primary}; --gold: ${BRAND.accent}; --navy: ${BRAND.navy}; 
          --danger: ${BRAND.danger}; --dawn: ${BRAND.dawn}; --glass: ${BRAND.glass}; 
          --font-display: 'Playfair Display', serif; --font-sans: 'Inter', sans-serif;
        }
        
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        body, html { margin: 0; padding: 0; font-family: var(--font-sans); height: 100vh; overflow: hidden; background: var(--dawn); color: var(--navy); }

        .app-container { display: flex; height: 100vh; position: relative; }
        .background-parallax { position: fixed; inset: 0; background-size: cover; background-position: center; opacity: 0.12; z-index: -1; }

        /* Ticker - Relooping, Slowed logic */
        .intelligence-ticker { height: 48px; background: var(--navy); color: white; display: flex; align-items: center; overflow: hidden; position: fixed; top: 0; left: 340px; right: 0; z-index: 1000; cursor: pointer; border-bottom: 2px solid var(--gold); transition: background 0.3s; }
        .intelligence-ticker:hover { background: #0c2345; }
        .ticker-label { background: var(--danger); font-weight: 900; font-size: 0.65rem; height: 100%; display: flex; align-items: center; padding: 0 20px; letter-spacing: 0.1em; z-index: 2; box-shadow: 10px 0 20px rgba(0,0,0,0.5); }
        .ticker-viewport { flex: 1; overflow: hidden; position: relative; height: 100%; display: flex; align-items: center; }
        .ticker-content { display: flex; white-space: nowrap; position: absolute; left: 100%; animation: ticker-scroll 90s linear infinite; }
        .ticker-msg { padding-right: 180px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; border-right: 1px solid rgba(255,255,255,0.1); }
        
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-400%); } /* Slower, more complete scroll before relooping */
        }

        /* Sidebar */
        .sidebar-container { width: 340px; background: var(--navy); color: white; display: flex; flex-direction: column; z-index: 1200; border-right: 1px solid rgba(255,255,255,0.08); }
        .sidebar-brand { padding: 40px; }
        .brand-logo { font-family: var(--font-display); font-size: 2.2rem; margin: 0; color: var(--teal); letter-spacing: -0.01em; }
        .brand-suite { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.25em; opacity: 0.6; display: block; margin-top: 12px; text-transform: uppercase; }
        .sidebar-navigation { flex: 1; padding: 10px 20px; overflow-y: auto; }
        .sb-item { display: flex; align-items: center; gap: 20px; padding: 14px 25px; border-radius: 20px; margin-bottom: 4px; cursor: pointer; transition: 0.3s; opacity: 0.7; }
        .sb-item:hover { background: rgba(255,255,255,0.06); opacity: 1; transform: translateX(6px); }
        .sb-item.active { background: rgba(0, 107, 118, 0.3); opacity: 1; border-left: 6px solid var(--gold); }
        .ni-icon-wrap { color: var(--teal); display: flex; align-items: center; }
        .ni-label { font-weight: 800; font-size: 1.05rem; display: block; }
        .ni-desc { font-size: 0.65rem; text-transform: uppercase; opacity: 0.55; font-weight: 900; letter-spacing: 0.05em; }
        .sidebar-status { padding: 20px; text-align: center; font-size: 0.65rem; font-weight: 900; letter-spacing: 0.2em; opacity: 0.3; text-transform: uppercase; }

        /* Viewport */
        .content-viewport { flex: 1; display: flex; flex-direction: column; overflow: hidden; padding-top: 48px; background: rgba(248, 250, 252, 0.9); backdrop-filter: blur(10px); }
        .viewport-header { height: 140px; display: flex; align-items: center; justify-content: space-between; padding: 0 65px; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .vh-title { font-family: var(--font-display); font-size: 2.6rem; margin: 0; letter-spacing: -0.02em; color: var(--navy); }
        .vh-location { margin: 6px 0 0; font-weight: 900; color: var(--teal); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.15em; }

        .viewport-scroll { flex: 1; overflow-y: auto; padding: 40px 65px 120px; }
        .view-pane { animation: slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(35px); } to { opacity: 1; transform: translateY(0); } }

        /* Newsroom Design - CNBC/CNN Style */
        .newsroom-pane { background: white; border-radius: 40px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: ${BRAND.shadow}; }
        .newsroom-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 0; border-top: 1px solid #E2E8F0; }
        .news-hero { padding: 60px; border-right: 1px solid #E2E8F0; }
        .breaking-badge { background: var(--danger); color: white; display: inline-block; padding: 5px 15px; font-weight: 900; font-size: 0.7rem; letter-spacing: 0.15em; border-radius: 4px; margin-bottom: 25px; animation: blink 1.5s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .hero-title { font-family: var(--font-display); font-size: 3.2rem; line-height: 1.1; margin: 0 0 25px; color: var(--navy); }
        .hero-desc { font-size: 1.3rem; line-height: 1.6; color: #4A5568; margin-bottom: 40px; font-weight: 500; }
        .hero-meta { font-weight: 800; font-size: 0.8rem; color: #A0AEC0; }
        .hero-meta a { color: var(--teal); text-decoration: none; border-bottom: 2px solid var(--teal); margin-left: 15px; }

        .news-sidebar { background: #F8FAFC; padding: 40px; }
        .sidebar-label { font-weight: 900; font-size: 0.75rem; letter-spacing: 0.2em; color: #A0AEC0; border-bottom: 2px solid #E2E8F0; padding-bottom: 15px; margin-bottom: 30px; text-transform: uppercase; }
        .sidebar-news-item { margin-bottom: 35px; border-bottom: 1px solid #E2E8F0; padding-bottom: 20px; }
        .item-cat { color: var(--teal); font-weight: 900; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
        .item-title { font-family: var(--font-display); font-size: 1.25rem; margin: 0 0 12px; line-height: 1.3; color: var(--navy); }
        .item-meta { font-size: 0.7rem; color: #A0AEC0; font-weight: 700; }
        .item-meta a { color: var(--gold); text-decoration: none; margin-left: 10px; }

        /* Section Header - Clean, No Subheaders per Rule */
        .section-header-card { height: 380px; position: relative; overflow: hidden; border-bottom: 5px solid var(--gold); }
        .sh-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .sh-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,28,54,0.95), transparent); display: flex; align-items: flex-end; padding: 60px; }
        .sh-title { color: white; font-family: var(--font-display); font-size: 3.5rem; margin: 0; }

        /* Metrics */
        .metrics-layout { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; margin-top: 40px; }
        .mu-card { background: white; padding: 40px; border-radius: 30px; border: 1px solid #E2E8F0; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .mu-label { font-size: 0.75rem; font-weight: 900; color: #A0AEC0; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 15px; }
        .mu-val { font-size: 3rem; font-family: var(--font-display); color: var(--navy); font-weight: 800; margin-bottom: 10px; }
        .mu-trend { color: var(--teal); font-weight: 900; font-size: 0.9rem; }

        /* Buttons & Controls */
        .btn-vdp { background: var(--teal); color: white; border: none; padding: 18px 40px; border-radius: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: 0.3s; }
        .btn-vdp.secondary { background: white; color: var(--navy); border: 2px solid #E2E8F0; }
        .btn-vdp:hover { filter: brightness(1.1); transform: translateY(-2px); }

        /* Concierge */
        .concierge-toggle { position: fixed; bottom: 40px; right: 40px; width: 75px; height: 75px; background: var(--teal); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; cursor: pointer; z-index: 2000; box-shadow: 0 15px 45px rgba(0,0,0,0.2); transition: 0.3s; }
        .concierge-panel { position: fixed; bottom: 130px; right: 40px; width: 420px; height: 600px; background: white; border-radius: 40px; z-index: 2000; box-shadow: 0 30px 100px rgba(0,0,0,0.3); display: flex; flex-direction: column; overflow: hidden; }
        .cp-header { background: var(--navy); color: white; padding: 25px; text-align: center; font-weight: 900; text-transform: uppercase; }
        .cp-body { flex: 1; padding: 30px; overflow-y: auto; background: #F8FAFC; display: flex; flex-direction: column; gap: 15px; }
        .chat-bubble-vdp { padding: 15px 22px; border-radius: 20px; font-size: 1rem; max-width: 85%; }
        .chat-bubble-vdp.user { background: var(--teal); color: white; align-self: flex-end; }
        .chat-bubble-vdp.model { background: white; border: 1px solid #E2E8F0; align-self: flex-start; color: var(--navy); }
        .cp-input-area { padding: 25px; border-top: 1px solid #E2E8F0; }
        .cp-input-area input { width: 100%; padding: 18px 25px; border-radius: 15px; border: 2px solid #F1F5F9; outline: none; font-weight: 700; }
      `}</style>
    </div>
  );
};

// --- View Helpers ---

const CreativeStudioView = () => {
  const [prompt, setPrompt] = useState('');
  const [asset, setAsset] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: `Professional high-definition cinematic asset of Dana Point, California: ${prompt}` }] },
        config: { imageConfig: { aspectRatio: '16:9', imageSize: '1K' } }
      });
      for (const part of res.candidates[0].content.parts) {
        if (part.inlineData) { setAsset(`data:image/png;base64,${part.inlineData.data}`); break; }
      }
    } catch { alert("Generation timeout."); }
    finally { setLoading(false); }
  };

  return (
    <div className="view-pane">
      <SectionHeader title="Creative Studio" imgUrl={DANA_POINT_IMAGERY.studio} />
      <div className="pane-content" style={{ padding: '40px' }}>
        <textarea 
          placeholder="Describe your cinematic Dana Point vision... (e.g., 'Golden hour surf at Salt Creek Beach')" 
          value={prompt} onChange={e => setPrompt(e.target.value)}
          style={{ width: '100%', height: '140px', padding: '25px', borderRadius: '25px', border: '2px solid #E2E8F0', fontSize: '1.2rem', outline: 'none', background: '#FAFBFC', marginBottom: '20px' }}
        />
        <button className="btn-vdp" onClick={handleGen} disabled={loading}>{loading ? 'Synthesizing Asset...' : 'Execute Synthesis'}</button>
        {asset && <div className="mt-40"><img src={asset} alt="Generated Asset" style={{ width: '100%', borderRadius: '25px', boxShadow: BRAND.shadow }} /></div>}
      </div>
    </div>
  );
};

const StrategicAnalystView = ({ data }: { data: any }) => {
  const [query, setQuery] = useState('');
  const [res, setRes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyst = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyst Query: ${query}. Data: ${JSON.stringify(data)}. Response must be professional Title Case and HTML formatted. No markdown.`,
        config: { thinkingConfig: { thinkingBudget: 32768 } }
      });
      setRes(response.text || 'Analysis complete.');
    } catch { setRes('Cognitive buffer limit reached.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="view-pane">
       <SectionHeader title="Strategic Analyst" imgUrl={DANA_POINT_IMAGERY.analyst} />
       <div style={{ padding: '40px' }}>
          <input placeholder="Pose a strategic regional inquiry..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAnalyst()} style={{ width: '100%', padding: '25px', borderRadius: '25px', border: '2px solid #E2E8F0', fontSize: '1.2rem', outline: 'none' }} />
          <button className="btn-vdp mt-20" onClick={handleAnalyst} disabled={loading}>{loading ? 'Reasoning...' : 'Execute Deep Analysis'}</button>
          {res && <div className="mt-40 mu-card" style={{ fontSize: '1.2rem', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: cleanAI(res) }} />}
       </div>
    </div>
  );
};

const DataManagementConsole = ({ onUpdate }: { onUpdate: (data: any) => void }) => (
  <div className="view-pane">
    <SectionHeader title="Data Console" imgUrl={DANA_POINT_IMAGERY.console} />
    <div style={{ padding: '80px', textAlign: 'center' }}>
       <div style={{ padding: '80px', border: '3px dashed var(--teal)', borderRadius: '40px', background: '#F8FAFC' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem' }}>Synchronize Regional Datasets</h3>
          <p style={{ maxWidth: '600px', margin: '20px auto', fontSize: '1.1rem', opacity: 0.7 }}>Drag and drop secure CSV/XLS data streams to update the VDP Strategic Brain and refine regional benchmarks.</p>
          <button className="btn-vdp" onClick={() => alert("Interface ready for local file input.")}>Select Intelligence Source</button>
       </div>
    </div>
  </div>
);

// --- Execution ---
const root = createRoot(document.getElementById('root')!);
root.render(<Dashboard />);
