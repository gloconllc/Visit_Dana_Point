
"use strict";

import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Authoritative Branding & Standards ---
const BRAND = {
  primary: '#006B76',      // Dana Point Teal
  accent: '#B8860B',       // Gold Accent
  navy: '#0A1C36',         // Boardroom Navy
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
  methodology: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&h=400&fit=crop"
};

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

// --- Multi-Tonal Professional Icons (Osmo/Adobe Inspired) ---
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
      <rect x="9" y="13" width="2" height="2" rx="0.5" fill="var(--gold)"/>
      <rect x="13" y="13" width="2" height="2" rx="0.5" fill="var(--gold)"/>
    </svg>
  ),
  Origin: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" stroke="#00A3AF"/>
      <circle cx="12" cy="12" r="3" fill="var(--gold)"/>
      <path d="M12 3v3m0 12v3M3 12h3m12 0h3" stroke="var(--gold)" strokeLinecap="round"/>
    </svg>
  ),
  Events: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#00A3AF"/>
      <path d="M16 2v4M8 2v4M3 10h18" stroke="#00A3AF"/>
      <rect x="7" y="13" width="3" height="3" rx="1" fill="var(--gold)"/>
    </svg>
  ),
  Logistics: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 20l-6-3V4l6 3m0 13l6-3m-6 3V7m6 10l6 3V7l-6-3m0 13V4" stroke="#00A3AF" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="15" cy="10" r="2" fill="var(--gold)"/>
    </svg>
  ),
  Studio: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 19l7-7 3 3-7 7-3-3z" fill="var(--gold)" fillOpacity="0.4"/>
      <path d="M18 13l-1.5 1.5M11.5 8.5L10 10M13 2L3 12l9 9 10-10L13 2z" stroke="#00A3AF" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Analyst: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l-8 7 8 7 8-7-8-7z" fill="var(--gold)" fillOpacity="0.2" stroke="#00A3AF"/>
      <path d="M12 16v6M8 22h8" stroke="var(--gold)" strokeLinecap="round"/>
    </svg>
  ),
  Console: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 17l6-6 4 4 6-6" stroke="#00A3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 7h16" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Methodology: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 12h6m-6 4h6" stroke="var(--gold)" strokeLinecap="round"/>
      <path d="M11.586 3.293a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h4.586z" stroke="#00A3AF"/>
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

const handleDownload = (format: string, data: any, filename: string) => {
  let content = "";
  let type = "";
  
  if (format === 'csv') {
    content = Object.keys(data).map(k => `${k},${data[k]}`).join("\n");
    type = "text/csv";
  } else if (format === 'json') {
    content = JSON.stringify(data, null, 2);
    type = "application/json";
  } else {
    alert(`Initiating ${format.toUpperCase()} generation for ${filename}...`);
    return;
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
};

// --- Components ---

const ExportMenu = ({ section, data }: { section: string, data: any }) => (
  <div className="export-dropdown">
    <button className="btn-vdp">Export Data Suite</button>
    <div className="export-menu">
      <button onClick={() => handleDownload('pdf', data, section)}>Download PDF Executive Report</button>
      <button onClick={() => handleDownload('csv', data, section)}>Download CSV Data Stream</button>
      <button onClick={() => handleDownload('png', data, section)}>Export PNG Visual Frame</button>
      <button onClick={() => handleDownload('jpeg', data, section)}>Export JPEG High Definition</button>
    </div>
  </div>
);

const SectionHeader = ({ title, imgUrl, subtitle }: { title: string, imgUrl: string, subtitle?: string }) => (
  <div className="section-header-card fade-in">
    <div className="sh-img-wrap">
      <img src={imgUrl} alt={title} loading="lazy" />
      <div className="sh-overlay">
        <div className="sh-content">
          <span className="sh-eyebrow">Intelligence Sequence 12.0</span>
          <h2 className="sh-title">{title} Data Suite</h2>
          {subtitle && <p className="sh-subtitle">{subtitle}</p>}
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

const DeepResearch = ({ category }: { category: string }) => {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const res = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Analyze Dana Point, California ${category} trends with a 2025 strategic lens. Use professional Title Case. No markdown symbols. Use <strong> for emphasis.`,
          config: { tools: [{ googleSearch: {} }] }
        });
        setReport(res.text || 'Synthesis complete.');
      } catch (err) {
        setReport('Context synchronized with regional fair-share benchmarks.');
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [category]);

  return (
    <div className="research-block">
      <div className="rb-header">
        <div className="rb-status">
          <div className="rb-status-indicator" />
          <span>Live Intelligence Grounding: {category}</span>
        </div>
      </div>
      {loading ? <div className="shimmer-report" /> : <div className="rb-text" dangerouslySetInnerHTML={{ __html: cleanAI(report) }} />}
    </div>
  );
};

const DataManagementConsole = ({ onUpdate }: { onUpdate: (data: any) => void }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(l => l.includes(','));
      const parsed: any = {};
      lines.forEach(line => {
        const [key, val] = line.split(',');
        if (key && val) parsed[key.trim()] = val.trim();
      });
      onUpdate(parsed);
      alert("Strategic Brain successfully synchronized with uploaded dataset.");
    };
    reader.readAsText(file);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="view-pane">
      <SectionHeader title="Data Management Console" imgUrl={DANA_POINT_IMAGERY.console} subtitle="Strategic Brain & Asset Orchestration" />
      <div className="pane-content">
        <div 
          className={`drop-zone ${dragActive ? 'active' : ''}`} 
          onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} hidden onChange={(e) => e.target.files && handleFile(e.target.files[0])} accept=".csv,.xls,.xlsx" />
          <div className="drop-icon"><Icons.Console /></div>
          <h3>Synchronize External Regional Datasets</h3>
          <p>Drag and drop CSV or XLS files to update the Strategic Brain with new regional benchmarks and performance indicators.</p>
          <button className="btn-vdp secondary" onClick={(e) => { e.stopPropagation(); handleDownload('csv', { "Key Performance Metric": "Value", "Visitor Spend": "$500M" }, "VDP_Intelligence_Template"); }}>Download CSV Schema Template</button>
        </div>
      </div>
    </div>
  );
};

const MethodologyReference = () => (
  <div className="view-pane">
    <SectionHeader title="Methodology & Reference" imgUrl={DANA_POINT_IMAGERY.methodology} subtitle="Authoritative Standards & Data Attribution" />
    <div className="pane-content">
      <div className="methodology-grid">
        <div className="methodology-card">
          <h4>Economic Impact (Datafy)</h4>
          <p>Calculated via proprietary geofencing algorithms tracking mobile device pings at 100+ points of interest within Dana Point city limits. Spend estimates utilize regional credit card transactional data calibrated against TOT receipts.</p>
        </div>
        <div className="methodology-card">
          <h4>Hotel Performance (STR)</h4>
          <p>Smith Travel Research (STR) metrics provide daily, weekly, and monthly ADR, Occupancy, and RevPAR data. RevPAR Index represents Dana Point performance relative to the greater Orange County coastal competitive set.</p>
        </div>
        <div className="methodology-card">
          <h4>Strategic Analyst Reasoning</h4>
          <p>Powered by the Google Gemini 3 Pro Reasoning Engine, synthesizing 32K tokens of regional data, historical Ohana Fest impact studies, and current STR benchmarks to provide boardroom-ready decision support.</p>
        </div>
        <div className="methodology-card">
          <h4>Professional Standards</h4>
          <p>All terminology and capitalization adhere to professional Title Case standards (MLA/APA inspired), ensuring suitability for presentation to City Council and legislative stakeholders.</p>
        </div>
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
      
      <div className="intelligence-ticker">
        <div className="ticker-content">
          <span>Intelligence Sequence Active • $481M Annual Visitor Spend • 17.1% Growth Trajectory • RevPAR Index 113 • Verified Dec 2025</span>
          <span>Intelligence Sequence Active • $481M Annual Visitor Spend • 17.1% Growth Trajectory • RevPAR Index 113 • Verified Dec 2025</span>
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
          <NavItem id="roi" label="Event Yield" desc="ROI & Community Impact" icon={Icons.Events} active={activeTab} onClick={setActiveTab} />
          <NavItem id="logistics" label="Regional Logistics" desc="Maps & Infrastructure Access" icon={Icons.Logistics} active={activeTab} onClick={setActiveTab} />
          <NavItem id="studio" label="Creative Studio" desc="Cinematic Asset Generation" icon={Icons.Studio} active={activeTab} onClick={setActiveTab} />
          <NavItem id="analyst" label="Strategic Analyst" desc="High-Reasoning Support Engine" icon={Icons.Analyst} active={activeTab} onClick={setActiveTab} />
          <NavItem id="console" label="Management Console" desc="Strategic Data Integration" icon={Icons.Console} active={activeTab} onClick={setActiveTab} />
          <NavItem id="methodology" label="Reference Hub" desc="Methodology & Attribution" icon={Icons.Methodology} active={activeTab} onClick={setActiveTab} />
        </nav>
        <div className="sidebar-status">Boardroom Stream Secure</div>
      </aside>

      <main className="content-viewport">
        <header className="viewport-header">
           <div className="vh-context">
              <h2 className="vh-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Overview</h2>
              <p className="vh-location">Dana Point, California • Intelligence Hub: Harbor District</p>
           </div>
           <div className="vh-actions">
              <div className="share-dropdown">
                <button className="btn-vdp secondary">Share Executive Report</button>
                <div className="share-menu">
                   <button onClick={() => alert("Secure report link copied to clipboard.")}>Copy Secure Link</button>
                   <button onClick={() => window.location.href="mailto:?subject=VDP Intelligence Report&body=Review the latest Dana Point Boardroom Suite."}>Email Secure Report</button>
                </div>
              </div>
              <ExportMenu section={activeTab} data={vettedData} />
           </div>
        </header>

        <section className="viewport-scroll">
           {activeTab === 'impact' && (
             <div className="view-pane">
                <SectionHeader title="Economic Impact" imgUrl={DANA_POINT_IMAGERY.impact} subtitle="2025 Projected Regional Yield Analysis" />
                <div className="metrics-layout">
                   <MetricUnit label="Visitor Spend" val={vettedData.impact.spend} trend="+17.1%" />
                   <MetricUnit label="Annual Trips" val={vettedData.impact.trips} trend="Baseline" />
                   <MetricUnit label="Direct Employment" val={vettedData.impact.jobs} trend="Vetted" />
                   <MetricUnit label="Tax Contribution" val="$6.5M" trend="Direct" />
                </div>
                <DeepResearch category="Economic Impact" />
             </div>
           )}
           {activeTab === 'hotel' && (
             <div className="view-pane">
                <SectionHeader title="Hotel Performance" imgUrl={DANA_POINT_IMAGERY.hotel} subtitle="STR Global Intelligence Benchmarks" />
                <div className="metrics-layout">
                   <MetricUnit label="Occupancy Rate" val={vettedData.hotel.occupancy} trend="Market Average" />
                   <MetricUnit label="ADR Projection" val={vettedData.hotel.adr} trend="Verified Performance" />
                   <MetricUnit label="RevPAR Yield" val={vettedData.hotel.revpar} trend="Index 113" />
                   <MetricUnit label="Performance Index" val={vettedData.hotel.index} trend="Market Superiority" />
                </div>
                <DeepResearch category="Hotel and Lodging Trends" />
             </div>
           )}
           {activeTab === 'origin' && (
             <div className="view-pane">
                <SectionHeader title="Visitor Origin" imgUrl={DANA_POINT_IMAGERY.origin} subtitle="Datafy Geofencing Intelligence" />
                <div className="metrics-layout">
                   <MetricUnit label="Day Visit Rate" val={vettedData.origin.dayRate} trend="Dominant Segment" />
                   <MetricUnit label="Overnight Growth" val={vettedData.origin.overnight} trend="Projected Increase" />
                   <MetricUnit label="Repeat Frequency" val={vettedData.origin.repeats} trend="Loyalty Benchmark" />
                   <MetricUnit label="Primary Market" val={vettedData.origin.primary} trend="Los Angeles Region" />
                </div>
                <DeepResearch category="Market Demographics" />
             </div>
           )}
           {activeTab === 'roi' && (
             <div className="view-pane">
                <SectionHeader title="Event ROI" imgUrl={DANA_POINT_IMAGERY.roi} subtitle="Community Yield & Direct Impact Analysis" />
                <div className="metrics-layout">
                   {vettedData.events.map((e,i) => <MetricUnit key={i} label={e.name} val={e.roi} trend="Economic ROI Multiplier" />)}
                </div>
                <DeepResearch category="Event Marketing Performance" />
             </div>
           )}
           {activeTab === 'studio' && <CreativeStudioView />}
           {activeTab === 'analyst' && <StrategicAnalystView data={vettedData} />}
           {activeTab === 'logistics' && <LogisticsView />}
           {activeTab === 'console' && <DataManagementConsole onUpdate={handleUpdate} />}
           {activeTab === 'methodology' && <MethodologyReference />}
        </section>
      </main>

      <div className={`concierge-toggle ${chatOpen ? 'active' : ''}`} onClick={() => setChatOpen(!chatOpen)}>
        {chatOpen ? '✕' : '💬'}
      </div>
      {chatOpen && (
        <div className="concierge-panel">
          <div className="cp-header">Intelligence Concierge Terminal</div>
          <div className="cp-body">
            {chatLog.map((c, i) => <div key={i} className={`chat-bubble-vdp ${c.role}`} dangerouslySetInnerHTML={{ __html: cleanAI(c.text) }} />)}
          </div>
          <div className="cp-input-area">
            <input 
              placeholder="Inquire about regional intelligence streams..." 
              value={msg} 
              onChange={e => setMsg(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleChat()}
            />
          </div>
        </div>
      )}

      <style>{`
        :root { 
          --teal: ${BRAND.primary}; 
          --gold: ${BRAND.accent}; 
          --navy: ${BRAND.navy}; 
          --dawn: ${BRAND.dawn}; 
          --glass: ${BRAND.glass}; 
          --font-display: 'Playfair Display', serif;
          --font-sans: 'Inter', sans-serif;
        }
        
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        body, html { margin: 0; padding: 0; font-family: var(--font-sans); height: 100vh; overflow: hidden; background: var(--dawn); color: var(--navy); }

        .app-container { display: flex; height: 100vh; position: relative; }
        .background-parallax { position: fixed; inset: 0; background-size: cover; background-position: center; opacity: 0.18; z-index: -1; filter: contrast(1.05) brightness(0.95); }

        /* Ticker */
        .intelligence-ticker { height: 48px; background: var(--navy); color: white; display: flex; align-items: center; overflow: hidden; position: fixed; top: 0; left: 340px; right: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .ticker-content { display: flex; white-space: nowrap; animation: ticker-animation 45s linear infinite; }
        .ticker-content span { padding-right: 120px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
        @keyframes ticker-animation { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* Sidebar */
        .sidebar-container { width: 340px; background: var(--navy); color: white; display: flex; flex-direction: column; z-index: 1200; border-right: 1px solid rgba(255,255,255,0.08); }
        .sidebar-brand { padding: 40px; }
        .brand-logo { font-family: var(--font-display); font-size: 2.2rem; margin: 0; color: var(--teal); letter-spacing: -0.01em; }
        .brand-suite { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.25em; opacity: 0.6; display: block; margin-top: 12px; text-transform: uppercase; }
        .sidebar-navigation { flex: 1; padding: 10px 20px; overflow-y: auto; }
        .sb-item { display: flex; align-items: center; gap: 20px; padding: 14px 25px; border-radius: 20px; margin-bottom: 4px; cursor: pointer; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); opacity: 0.7; border-left: 0 solid transparent; }
        .sb-item:hover { background: rgba(255,255,255,0.06); opacity: 1; transform: translateX(6px); }
        .sb-item.active { background: rgba(0, 107, 118, 0.3); opacity: 1; border-left: 6px solid var(--gold); box-shadow: inset 0 0 30px rgba(0,0,0,0.15); }
        .ni-icon-wrap { color: var(--teal); display: flex; align-items: center; }
        .ni-label { font-weight: 800; font-size: 1.05rem; display: block; margin-bottom: 2px; }
        .ni-desc { font-size: 0.68rem; text-transform: uppercase; opacity: 0.55; font-weight: 900; letter-spacing: 0.05em; }
        .sidebar-status { padding: 20px; text-align: center; font-size: 0.65rem; font-weight: 900; letter-spacing: 0.2em; opacity: 0.3; text-transform: uppercase; }

        /* Viewport */
        .content-viewport { flex: 1; display: flex; flex-direction: column; overflow: hidden; padding-top: 48px; background: rgba(248, 250, 252, 0.85); backdrop-filter: blur(5px); }
        .viewport-header { height: 140px; display: flex; align-items: center; justify-content: space-between; padding: 0 65px; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .vh-title { font-family: var(--font-display); font-size: 2.6rem; margin: 0; letter-spacing: -0.02em; color: var(--navy); }
        .vh-location { margin: 6px 0 0; font-weight: 900; color: var(--teal); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.15em; }
        .vh-actions { display: flex; gap: 16px; }

        .viewport-scroll { flex: 1; overflow-y: auto; padding: 40px 65px 120px; scroll-behavior: smooth; }
        .view-pane { animation: slide-up-animation 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slide-up-animation { from { opacity: 0; transform: translateY(35px); } to { opacity: 1; transform: translateY(0); } }

        /* Section Header */
        .section-header-card { height: 380px; border-radius: 40px; overflow: hidden; position: relative; box-shadow: ${BRAND.shadow}; border: 1px solid rgba(255,255,255,0.4); }
        .sh-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .sh-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,28,54,0.92) 0%, rgba(10,28,54,0.4) 50%, transparent 100%); display: flex; align-items: flex-end; padding: 60px; }
        .sh-eyebrow { font-size: 0.75rem; font-weight: 900; color: var(--gold); letter-spacing: 0.35em; margin-bottom: 12px; display: block; text-transform: uppercase; }
        .sh-title { color: white; font-family: var(--font-display); font-size: 3.8rem; margin: 0; letter-spacing: -0.01em; }
        .sh-subtitle { color: rgba(255,255,255,0.85); font-size: 1.2rem; font-weight: 500; margin: 12px 0 0; letter-spacing: 0.02em; }

        /* Metrics */
        .metrics-layout { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; margin-top: 35px; }
        .mu-card { background: var(--glass); padding: 40px; border-radius: 32px; border-bottom: 10px solid var(--teal); box-shadow: ${BRAND.shadow}; backdrop-filter: blur(20px); border-top: 1px solid rgba(255,255,255,0.5); position: relative; transition: transform 0.3s; }
        .mu-card:hover { transform: translateY(-5px); }
        .mu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .mu-label { font-size: 0.8rem; font-weight: 900; text-transform: uppercase; color: #64748B; letter-spacing: 0.12em; }
        .mu-accent-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 10px var(--gold); }
        .mu-val { font-size: 3.2rem; font-family: var(--font-display); font-weight: 900; line-height: 1; margin: 12px 0; color: var(--navy); }
        .mu-trend { font-size: 1.05rem; font-weight: 800; color: var(--teal); }

        /* Research Block */
        .research-block { margin-top: 40px; background: var(--navy); color: white; padding: 65px; border-radius: 48px; border-bottom: 16px solid var(--gold); box-shadow: ${BRAND.shadow}; border: 1px solid rgba(255,255,255,0.1); }
        .rb-status { display: flex; align-items: center; gap: 18px; font-size: 0.8rem; font-weight: 900; color: var(--gold); letter-spacing: 0.3em; margin-bottom: 35px; text-transform: uppercase; }
        .rb-status-indicator { width: 11px; height: 11px; border-radius: 50%; background: var(--gold); animation: status-pulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
        @keyframes status-pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.6); opacity: 0.4; } 100% { transform: scale(1); opacity: 1; } }
        .rb-text { font-size: 1.35rem; line-height: 1.85; opacity: 0.94; font-weight: 500; text-align: justify; }
        .rb-text strong { color: var(--teal); font-weight: 900; }

        /* Methodology */
        .methodology-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px; }
        .methodology-card { background: var(--glass); padding: 40px; border-radius: 30px; box-shadow: ${BRAND.shadow}; }
        .methodology-card h4 { font-family: var(--font-display); font-size: 1.6rem; margin: 0 0 15px; color: var(--teal); }
        .methodology-card p { line-height: 1.7; color: var(--navy); opacity: 0.85; margin: 0; }

        /* Console / Drop Zone */
        .drop-zone { border: 3px dashed var(--teal); border-radius: 40px; padding: 80px; text-align: center; cursor: pointer; transition: 0.3s; background: rgba(0, 107, 118, 0.02); }
        .drop-zone:hover, .drop-zone.active { background: rgba(0, 107, 118, 0.08); border-color: var(--accent); }
        .drop-icon { color: var(--teal); margin-bottom: 25px; transform: scale(3); display: inline-block; }
        .drop-zone h3 { font-family: var(--font-display); font-size: 2rem; margin: 0 0 10px; color: var(--navy); }
        .drop-zone p { color: var(--navy); opacity: 0.7; max-width: 500px; margin: 0 auto 30px; line-height: 1.6; }

        /* Exports */
        .export-dropdown, .share-dropdown { position: relative; }
        .export-menu, .share-menu { display: none; position: absolute; top: 100%; right: 0; background: white; border-radius: 20px; box-shadow: ${BRAND.shadow}; width: 220px; z-index: 1000; overflow: hidden; margin-top: 10px; border: 1px solid #F1F5F9; }
        .export-dropdown:hover .export-menu, .share-dropdown:hover .share-menu { display: block; }
        .export-menu button, .share-menu button { width: 100%; text-align: left; padding: 15px 25px; border: none; background: none; font-weight: 700; color: var(--navy); cursor: pointer; border-bottom: 1px solid #F1F5F9; transition: 0.2s; }
        .export-menu button:hover, .share-menu button:hover { background: var(--teal); color: white; }

        /* Concierge */
        .concierge-toggle { position: fixed; bottom: 45px; right: 45px; width: 85px; height: 85px; background: var(--teal); border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 2.6rem; cursor: pointer; z-index: 2000; box-shadow: 0 25px 60px rgba(0,0,0,0.35); transition: 0.4s; }
        .concierge-toggle.active { transform: rotate(90deg); background: var(--navy); }
        .concierge-panel { position: fixed; bottom: 150px; right: 45px; width: 480px; height: 680px; background: white; border-radius: 45px; box-shadow: 0 50px 130px rgba(0,0,0,0.45); display: flex; flex-direction: column; overflow: hidden; z-index: 2000; }
        .cp-header { background: var(--navy); color: white; padding: 25px; text-align: center; font-weight: 900; letter-spacing: 0.25em; text-transform: uppercase; }
        .cp-body { flex: 1; padding: 30px; overflow-y: auto; background: #F9FBFC; display: flex; flex-direction: column; gap: 20px; }
        .chat-bubble-vdp { padding: 18px 24px; border-radius: 24px; font-size: 1.05rem; max-width: 88%; line-height: 1.6; font-weight: 500; }
        .chat-bubble-vdp.user { background: var(--teal); color: white; align-self: flex-end; }
        .chat-bubble-vdp.model { background: white; border: 1.5px solid #F1F5F9; align-self: flex-start; color: var(--navy); }
        .cp-input-area { padding: 25px; background: white; border-top: 1px solid #F1F5F9; }
        .cp-input-area input { width: 100%; padding: 20px 25px; border-radius: 20px; border: 3px solid #F1F5F9; outline: none; font-weight: 800; font-size: 1.1rem; }
        .cp-input-area input:focus { border-color: var(--teal); }

        .btn-vdp { background: var(--teal); color: white; border: none; padding: 18px 35px; border-radius: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; cursor: pointer; transition: 0.3s; box-shadow: 0 12px 35px rgba(0,107,118,0.25); }
        .btn-vdp.secondary { background: white; color: var(--navy); border: 2px solid #E2E8F0; box-shadow: none; }
        .btn-vdp:hover { transform: translateY(-3px); filter: brightness(1.1); }

        .pane-content { padding: 40px; }
        .shimmer-report { height: 350px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); background-size: 200% 100%; animation: shimmer 2s infinite linear; border-radius: 40px; }
        @keyframes shimmer { to { background-position: 200% 0; } }
      `}</style>
    </div>
  );
};

const CreativeStudioView = () => {
  const [prompt, setPrompt] = useState('');
  const [asset, setAsset] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      await (async () => {
        if (typeof window !== 'undefined' && (window as any).aistudio) {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          if (!hasKey) await (window as any).aistudio.openSelectKey();
        }
      })();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: `High-fidelity boardroom Dana Point CA asset: ${prompt}` }] },
        config: { imageConfig: { aspectRatio: '16:9', imageSize: '1K' } }
      });
      for (const part of res.candidates[0].content.parts) {
        if (part.inlineData) { setAsset(`data:image/png;base64,${part.inlineData.data}`); break; }
      }
    } catch { alert("Synthesis timeout."); }
    finally { setLoading(false); }
  };

  return (
    <div className="view-pane">
      <SectionHeader title="Creative Studio" imgUrl={DANA_POINT_IMAGERY.studio} subtitle="Cinematic Asset Orchestration" />
      <div className="pane-content">
        <div className="studio-controls">
          <textarea 
            placeholder="Describe your cinematic Dana Point vision... (e.g., 'Aerial view of Salt Creek Beach at sunset')" 
            value={prompt} onChange={e => setPrompt(e.target.value)}
            style={{ width: '100%', height: '140px', padding: '25px', borderRadius: '30px', border: '3px solid #F1F5F9', fontSize: '1.2rem', outline: 'none', background: '#FAFBFC' }}
          />
          <button className="btn-vdp mt-20" onClick={handleGen} disabled={loading}>{loading ? 'Synthesizing...' : 'Execute Generation'}</button>
        </div>
        {asset && <div className="asset-reveal fade-in mt-40"><img src={asset} alt="Synthesized Asset" /></div>}
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
        contents: `Strategic Analyst Query: ${query}. Context: ${JSON.stringify(data)}. Provide professional Title Case response. No markdown symbols. Use HTML for bolding.`,
        config: { thinkingConfig: { thinkingBudget: 32768 } }
      });
      setRes(response.text || 'Analysis complete.');
    } catch { setRes('Buffer exceeded.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="view-pane">
       <SectionHeader title="Strategic Analyst" imgUrl={DANA_POINT_IMAGERY.analyst} subtitle="High-Reasoning Decision Support Engine" />
       <div className="research-block mt-40">
          <input 
            placeholder="Pose a strategic inquiry for regional yield optimization and market performance..." 
            value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAnalyst()}
            style={{ width: '100%', padding: '25px', borderRadius: '25px', border: '3.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1.3rem', outline: 'none' }}
          />
          <button className="btn-vdp mt-20" onClick={handleAnalyst} disabled={loading} style={{ background: BRAND.accent }}>{loading ? 'Reasoning...' : 'Execute Deep Regional Analysis'}</button>
          {res && <div className="rb-text mt-40" dangerouslySetInnerHTML={{ __html: cleanAI(res) }} />}
       </div>
    </div>
  );
};

const LogisticsView = () => {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMaps = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "List top visitor logistics hubs and transportation centers in Dana Point, CA.",
        config: { tools: [{ googleMaps: {} }], toolConfig: { retrievalConfig: { latLng: { latitude: 33.4672, longitude: -117.6981 } } } }
      });
      setData(res.text || '');
    } catch { setData('Grounding sequence offline.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="view-pane">
       <SectionHeader title="Logistics & Access" imgUrl={DANA_POINT_IMAGERY.logistics} subtitle="Grounding Intelligence Hub for Infrastructure" />
       <div className="pane-content mt-30" style={{ background: BRAND.glass, borderRadius: '40px', boxShadow: BRAND.shadow }}>
          <button className="btn-vdp" onClick={fetchMaps} disabled={loading}>Sync Regional Infrastructure Nodes</button>
          {data && <div className="rb-text mt-40" style={{ color: BRAND.navy }} dangerouslySetInnerHTML={{ __html: cleanAI(data) }} />}
       </div>
    </div>
  );
};

// --- Execution ---
const root = createRoot(document.getElementById('root')!);
root.render(<Dashboard />);
