
"use strict";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- PROFESSIONAL DESIGN TOKENS ---
const BRAND = {
  primary: '#005860',      // Deep Dana Point Teal
  accent: '#A67C00',       // Rich Coastal Gold
  brightGold: '#FFD700',   // Vivid Strategic Gold
  navy: '#061226',         // Intense Pacific Navy
  sand: '#F4F7F9',         // Premium Canvas Grey
  danger: '#FF4D4D',       // Market Deficit Red
  success: '#2DCE89',      // Growth Node Green
  shadow: '0 30px 100px -20px rgba(6, 18, 38, 0.3)',
  glass: 'rgba(255, 255, 255, 0.98)',
};

const LANDMARKS = {
  economic: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1920&auto=format&fit=crop", 
  market: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1920&auto=format&fit=crop", 
  advisor: "https://images.unsplash.com/photo-1555909712-4351fad34df3?q=80&w=1920&auto=format&fit=crop", 
  resident: "https://images.unsplash.com/photo-1445013111723-99ff2c5df85d?q=80&w=1920&auto=format&fit=crop",
  mobility: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1920&auto=format&fit=crop",
  brand: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1920&auto=format&fit=crop",
  registry: "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?q=80&w=1920&auto=format&fit=crop",
  simulation: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop"
};

const SECTION_FILTER_CONFIG: Record<string, { label: string, options: string[] }> = {
  economic: { label: 'ECONOMIC PRIORITY', options: ['Yield Focus', 'Volume Focus', 'ADR Tiering'] },
  resident: { label: 'RESIDENT BENEFIT', options: ['Tax Relief', 'Fiscal Offset', 'Community ROI'] },
  market: { label: 'MARKET POSITION', options: ['RevPAR Dominance', 'Share Parity', 'Peer Benchmarks'] },
  advisor: { label: 'ADVISORY NODE', options: ['Market SWOT', 'Strategic Forecast', 'Risk Sentiment'] },
  mobility: { label: 'VISITOR FLOW', options: ['Trip Volume', 'Origin Penetration', 'Loyalty Tracking'] },
  brand: { label: 'DIGITAL VELOCITY', options: ['Conversion Funnel', 'Sentiment Score', 'Traffic Yield'] },
  simulation: { label: 'SIMULATION TYPE', options: ['Event Impact', 'Seasonal Surge', 'Policy Shift'] },
  registry: { label: 'AUDIT SCOPE', options: ['Full Metadata', 'Verified Nodes Only', 'Historical Sync'] }
};

const DEFAULT_FILTERS = {
  time: 'Annual 2024',
  segment: 'Total Submarket',
  metric: 'Yield Focus'
};

// --- INTELLIGENCE CONFIG ---
const HEALTH_CHECKS: Record<string, { sources: string[], missing: string[] }> = {
  economic: { sources: ['STR Global', 'Datafy Spend Node'], missing: ['Q4 Parking Ancillary Revenue'] },
  resident: { sources: ['DP City Finance', 'Resident Audit Node 2.1'], missing: ['Neighborhood specific noise impact data'] },
  market: { sources: ['STR Comp Set', 'GA4 Benchmark API'], missing: ['Vacation Rental Unofficial Share'] },
  mobility: { sources: ['Datafy Origin Node', 'Mobile Signal Aggregator'], missing: ['EV Charger Usage Data'] },
  brand: { sources: ['GA4 Traffic Node', 'AdWords Performance'], missing: ['Social Sentiment Correlation Index'] },
  simulation: { sources: ['Historical Event Logs', 'STR Delta Analysis'], missing: ['Traffic Congestion Multiplier'] }
};

interface Preset {
  id: string;
  name: string;
  time: string;
  segment: string;
  metric: string;
}

const GET_VETTED_INTELLIGENCE = (filters: any) => {
  const isForecast = filters.time.includes('Forecast');
  const isLuxury = filters.segment === 'Luxury Tier';
  const mult = isLuxury ? 1.42 : 1.0;
  const growth = isForecast ? 1.18 : 1.0;
  const priorityModifier = filters.metric.includes('Focus') || filters.metric.includes('Relief') ? 1.05 : 0.95;
  const prevMult = 0.92;

  return {
    economic: {
      adr: { value: `$${(262 * mult * growth * priorityModifier).toFixed(2)}`, prev: `$${(262 * mult * prevMult).toFixed(2)}`, trend: isForecast ? "+14.8%" : "STABLE", source: "STR Verified", date: filters.time },
      yield: { value: `$${(481 * mult * growth * priorityModifier).toFixed(1)}M`, prev: `$${(481 * mult * prevMult).toFixed(1)}M`, trend: "+17.1%", source: "Datafy Intelligence", date: filters.time },
      revpar: { value: (113 * (isLuxury ? 1.1 : 1)).toFixed(1), prev: (113 * 0.92).toFixed(1), trend: "PREMIUM", source: "STR Submarket", date: filters.time },
      originData: [
        { label: 'Los Angeles', value: 32.7, color: BRAND.primary },
        { label: 'San Diego', value: 18.4, color: BRAND.accent },
        { label: 'Riverside', value: 12.1, color: BRAND.navy },
        { label: 'Phoenix', value: 8.5, color: BRAND.brightGold },
        { label: 'Other', value: 28.3, color: '#CBD5E1' }
      ]
    },
    resident: {
      savings: { value: `$${(1240 * growth * priorityModifier).toFixed(0)}`, prev: "$1,120", trend: "VERIFIED", source: "DP City Finance", date: "FY 2024" },
      totShare: { value: `$${(32.4 * growth).toFixed(1)}M`, prev: "$29.1M", trend: "+7.6%", source: "City Audit Node", date: "Annual 2024" },
      qolRatio: { visitor: 68.2, resident: 31.8, offset: 1240 }
    },
    market: {
      benchmarks: [
        { market: 'Dana Point', index: isLuxury ? 124 : 113, prev: 105, traffic: 207600, conversion: 1.0, color: BRAND.primary },
        { market: 'Laguna Beach', index: isLuxury ? 119 : 108, prev: 102, traffic: 185200, conversion: 1.2, color: BRAND.accent },
        { market: 'Newport Beach', index: isLuxury ? 112 : 105, prev: 100, traffic: 312400, conversion: 0.8, color: BRAND.navy }
      ],
      source: "STR & Datafy Competitive Aggregator",
      date: filters.time
    },
    mobility: {
      trips: { value: (2.3 * growth * priorityModifier).toFixed(1) + "M", prev: "2.1M", trend: "+5.8%", source: "Datafy Intelligence", date: filters.time },
      laMarketShare: { value: "32.7%", trips: "750K", source: "Datafy Origin Node", date: filters.time }
    },
    brand: {
      visitors: { value: (207600 * growth).toFixed(0), prev: "191,500", trend: "+8.4%", source: "GA4 Traffic Node", date: filters.time },
      conversion: { value: (1.0 * (isForecast ? 1.5 : 1)).toFixed(1) + "%", prev: "0.9%", benchmark: "5.0%", source: "GA4 Web Node", date: filters.time }
    }
  };
};

// --- CANVAS & SVG COMPONENTS ---

const TrendLine = ({ color = BRAND.primary }: { color?: string }) => (
  <div className="mini-trend">
    <svg width="80" height="24" viewBox="0 0 80 24" fill="none" preserveAspectRatio="none">
      <path 
        d="M2 20C10 16 15 22 25 15C35 8 45 18 55 10C65 2 75 10 78 5" 
        stroke={color} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const OriginFlowChart = ({ data, source, date }: { data: any[], source: string, date: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      const w = canvas.width = canvas.offsetWidth * 2;
      const h = canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      let currentX = 0;
      const total = data.reduce((acc, d) => acc + d.value, 0);
      const chartWidth = canvas.offsetWidth;
      const chartHeight = canvas.offsetHeight;

      data.forEach((segment) => {
        const segmentWidth = (segment.value / total) * chartWidth;
        
        ctx.fillStyle = segment.color;
        ctx.beginPath();
        ctx.moveTo(currentX, 0);

        for (let x = currentX; x <= currentX + segmentWidth; x++) {
          const y = 10 * Math.sin((x / 40) + offset);
          ctx.lineTo(x, 20 + y);
        }

        ctx.lineTo(currentX + segmentWidth, chartHeight);
        ctx.lineTo(currentX, chartHeight);
        ctx.closePath();
        ctx.fill();

        if (segmentWidth > 50) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = 'bold 12px Inter';
          ctx.fillText(`${segment.label}`, currentX + 10, chartHeight - 40);
          ctx.fillText(`${segment.value}%`, currentX + 10, chartHeight - 20);
        }

        currentX += segmentWidth;
      });

      offset += 0.05;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [data]);

  return (
    <div className="origin-flow-container glass fade-in">
      <div className="chart-header"><span className="chart-title">VISITOR ORIGIN FLOW</span><div className="vetted-badge-mini">VETTED</div></div>
      <canvas ref={canvasRef} className="origin-canvas" />
      <div className="chart-footer"><SourceTag source={source} date={date} /></div>
    </div>
  );
};

const ADRSparkline = ({ value, label, source, date }: { value: string, label: string, source: string, date: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const points = [40, 35, 50, 45, 65, 55, 75];
    const w = canvas.width = 300 * 2;
    const h = canvas.height = 80 * 2;
    ctx.scale(2, 2);
    
    ctx.clearRect(0, 0, 300, 80);
    ctx.strokeStyle = BRAND.primary;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    points.forEach((p, i) => {
      const x = (i / (points.length - 1)) * 300;
      const y = 80 - p;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = BRAND.navy;
    ctx.font = 'bold 10px Inter';
    points.forEach((p, i) => {
        const x = (i / (points.length - 1)) * 300;
        const y = 80 - p - 10;
        if (i === points.length - 1) ctx.fillText(`$${(parseFloat(value.replace('$', ''))).toFixed(0)}`, x - 35, y);
    });

  }, [value]);

  return (
    <div className="spark-node glass fade-in">
      <div className="spark-meta">
        <span className="kpi-lbl">{label}</span>
        <span className="kpi-val-hero">{value}</span>
      </div>
      <canvas ref={canvasRef} className="spark-canvas" style={{ width: '100%', height: '80px' }} />
      <SourceTag source={source} date={date} />
    </div>
  );
};

// --- ATOMIC UI COMPONENTS ---

const DataHealthCheck = ({ moduleId }: { moduleId: string }) => {
  const check = HEALTH_CHECKS[moduleId] || { sources: ['General Audit'], missing: ['N/A'] };
  return (
    <div className="health-check glass fade-in">
      <div className="health-head"><span className="health-title">DATA HEALTH AUDIT</span><span className="health-status">NODE ACTIVE</span></div>
      <div className="health-content">
        <div className="health-node"><label>VETTED SOURCES</label><div className="health-tags">{check.sources.map(s => <span key={s} className="health-tag source">{s}</span>)}</div></div>
        <div className="health-node"><label>GAP DETECTION</label><div className="health-tags">{check.missing.map(m => <span key={m} className="health-tag missing">{m}</span>)}</div></div>
      </div>
    </div>
  );
};

const SourceTag = ({ source, date }: { source: string, date: string }) => (
  <div className="kpi-source"><span className="source-lbl">SOURCE:</span><span className="source-val">{source} | {date}</span></div>
);

const KPICard = ({ label, value, prevValue, trend, showCompare, source, showTrend = false }: any) => {
  const delta = useMemo(() => {
    if (!showCompare || !prevValue) return null;
    const v = parseFloat(value.replace(/[$,M%]/g, ''));
    const p = parseFloat(prevValue.replace(/[$,M%]/g, ''));
    return ((v - p) / p * 100).toFixed(1);
  }, [value, prevValue, showCompare]);

  return (
    <div className="kpi-node glass fade-in">
      <div className="kpi-head">
        <span className="kpi-lbl">{label}</span>
        {trend && <span className="kpi-trend-pill">{trend}</span>}
      </div>
      <div className="kpi-hero-wrap">
        <div className="kpi-val-hero">{value}</div>
        {showTrend && <TrendLine color={BRAND.primary} />}
      </div>
      {showCompare && prevValue && (
        <div className="kpi-compare-cluster">
          <div className="kpi-val-prev">PREV: <span className="prev-data">{prevValue}</span></div>
          <div className={`kpi-delta ${parseFloat(delta || '0') >= 0 ? 'pos' : 'neg'}`}>
            {parseFloat(delta || '0') >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(delta || '0'))}%
          </div>
        </div>
      )}
      {source && <SourceTag {...source} />}
    </div>
  );
};

// --- MAIN DASHBOARD APP ---

const Dashboard = () => {
  const [tab, setTab] = useState('economic');
  const [sidebar, setSidebar] = useState(false);
  const [infographic, setInfographic] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [advisorBrief, setAdvisorBrief] = useState<string>('');
  const [loadingAdvisor, setLoadingAdvisor] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [searchRegistry, setSearchRegistry] = useState('');
  const [registryTypeFilter, setRegistryTypeFilter] = useState('ALL');
  const [simParams, setSimParams] = useState({ month: 'October', duration: 3, attendance: 25000 });
  const [presets, setPresets] = useState<Preset[]>(() => {
    const saved = localStorage.getItem('vdp_presets');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });

  useEffect(() => {
    setFilters(prev => ({ ...prev, metric: SECTION_FILTER_CONFIG[tab]?.options[0] || 'Yield Focus' }));
  }, [tab]);

  const intelligence = useMemo(() => GET_VETTED_INTELLIGENCE(filters), [filters]);

  const simResults = useMemo(() => {
    const baseOcc = 0.642;
    const attendeeStayRate = 0.18; 
    const roomNights = (simParams.attendance * attendeeStayRate * simParams.duration);
    const totalRooms = 3200 * simParams.duration;
    const occLift = (roomNights / totalRooms) * 100;
    const diningRevenue = simParams.attendance * 45 * simParams.duration; 

    return {
      occLift: occLift.toFixed(1),
      finalOcc: (baseOcc * 100 + occLift).toFixed(1),
      diningImpact: (diningRevenue / 1000000).toFixed(2)
    };
  }, [simParams]);

  const registryData = useMemo(() => {
    const base = [
      { node: 'ANNUAL YIELD', value: intelligence.economic.yield.value, source: 'Datafy Intelligence', type: 'ECONOMIC' },
      { node: 'ADR ANCHOR', value: intelligence.economic.adr.value, source: 'STR Verified', type: 'ECONOMIC' },
      { node: 'REVPAR INDEX', value: intelligence.economic.revpar.value, source: 'STR Submarket', type: 'MARKET' },
      { node: 'VISITOR TRIPS', value: intelligence.mobility.trips.value, source: 'Datafy Intelligence', type: 'MOBILITY' },
      { node: 'TAX RELIEF', value: intelligence.resident.savings.value, source: 'DP City Finance', type: 'RESIDENT' },
      { node: 'WEB VISITORS', value: intelligence.brand.visitors.value, source: 'GA4 Traffic Node', type: 'BRAND' },
      { node: 'WEB CONVERSION', value: intelligence.brand.conversion.value, source: 'GA4 Web Node', type: 'BRAND' },
    ];
    return base.filter(d => 
      (registryTypeFilter === 'ALL' || d.type === registryTypeFilter) &&
      (d.node.toLowerCase().includes(searchRegistry.toLowerCase()) || d.source.toLowerCase().includes(searchRegistry.toLowerCase()))
    );
  }, [intelligence, searchRegistry, registryTypeFilter]);

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setCompareMode(false);
  };

  const applyPreset = (p: Preset) => {
    setFilters({ time: p.time, segment: p.segment, metric: p.metric });
  };

  const deletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    localStorage.setItem('vdp_presets', JSON.stringify(updated));
  };

  const savePreset = () => {
    const name = prompt("Enter a name for this intelligence preset:");
    if (!name) return;
    const newPreset: Preset = { id: Date.now().toString(), name, ...filters };
    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem('vdp_presets', JSON.stringify(updated));
  };

  const getAdvisorBriefing = async () => {
    if (tab !== 'advisor') return;
    setLoadingAdvisor(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const compBench = intelligence.market.benchmarks.map(b => `${b.market}: Index ${b.index}`).join(', ');
      const prompt = `Provide a boardroom briefing for Visit Dana Point. 
      Focus: ${filters.metric}. 
      RevPAR Index: ${intelligence.economic.revpar.value}. 
      Competitive Benchmarks: ${compBench}.
      Digital Velocity (Dana Point): ${intelligence.brand.visitors.value} visitors, ${intelligence.brand.conversion.value} conversion.
      Professional and data-centric. Use markdown for structure.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
      setAdvisorBrief(response.text || "Strategic synthesis unavailable.");
    } catch (err) { console.error(err); } finally { setLoadingAdvisor(false); }
  };

  useEffect(() => { getAdvisorBriefing(); }, [tab, filters]);

  const generateInfographic = async () => {
    setGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      let visualHint = "Include a clean summary table and coastal imagery.";
      if (tab === 'market') visualHint = "Include a prominent comparative bar chart showing Market Share vs regional peers.";
      if (tab === 'economic') visualHint = "Include an elegant line graph showing revenue yield trajectory.";
      if (tab === 'mobility') visualHint = "Include a sophisticated flow diagram or heat map of visitor origins.";
      if (tab === 'resident') visualHint = "Include a circular diagram showing the tax-offset ratio breakdown.";

      const prompt = `Synthesize a professional executive dashboard infographic for Visit Dana Point: ${tab.toUpperCase()}. 
      Vetted Context: ${JSON.stringify(intelligence[tab as keyof typeof intelligence])}. 
      Design: Coastal luxury aesthetic, deep teals and soft golds.
      Visual Requirement: ${visualHint}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) { setInfographic(`data:image/png;base64,${part.inlineData.data}`); break; }
      }
    } catch (err) { console.error(err); } finally { setGenerating(false); }
  };

  const menu = [
    { id: 'economic', label: 'Economic Performance' },
    { id: 'resident', label: 'Resident Benefit' },
    { id: 'market', label: 'Competitive Share' },
    { id: 'simulation', label: 'Impact Simulation' },
    { id: 'advisor', label: 'Strategic Advisor' },
    { id: 'mobility', label: 'Mobility Intel' },
    { id: 'brand', label: 'Brand Velocity' },
    { id: 'registry', label: 'Data Registry' }
  ];

  return (
    <div className={`app-shell ${sidebar ? 'sb-open' : ''}`}>
      <aside className="sidebar">
        <div className="sb-header"><h1 className="brand-logo">Visit Dana Point</h1><span className="brand-intel">INTELLIGENCE SUITE</span></div>
        <nav className="sb-nav">
          {menu.map(m => (
            <div key={m.id} className={`nav-node ${tab === m.id ? 'active' : ''}`} onClick={() => { setTab(m.id); setSidebar(false); }}>
              <span className="nav-label">{m.label}</span><div className="nav-bar" />
            </div>
          ))}
        </nav>
        <div className="presets-section">
          <div className="presets-header"><span>SAVED PRESETS</span><button className="add-preset-btn" onClick={savePreset}>+</button></div>
          <div className="presets-list">
            {presets.length === 0 ? <div className="preset-empty">No presets saved</div> : 
              presets.map(p => (
                <div key={p.id} className="preset-item" onClick={() => applyPreset(p)}>
                  <span className="preset-name">{p.name}</span><button className="preset-del" onClick={(e) => deletePreset(p.id, e)}>✕</button>
                </div>
              ))}
          </div>
        </div>
        <div className="sb-footer"><div className="secure-badge"><div className="pulse-dot" /> ENCRYPTED VETTED LINK</div></div>
      </aside>

      <main className="main-content">
        <header className="global-header glass">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebar(true)}>☰</button>
            <div className="intel-command-hub">
              <div className="hub-info"><span className="hub-cat-label">ACTIVE NODE</span><span className="hub-cat-val">{tab.toUpperCase()}</span></div>
              <div className="hub-filters">
                <div className="hub-field"><label>TIME</label><select value={filters.time} onChange={e => setFilters({...filters, time: e.target.value})}><option>Annual 2024</option><option>Q1 2025 Forecast</option></select></div>
                <div className="hub-field"><label>SEGMENT</label><select value={filters.segment} onChange={e => setFilters({...filters, segment: e.target.value})}><option>Total Submarket</option><option>Luxury Tier</option></select></div>
                <div className="hub-field"><label>{SECTION_FILTER_CONFIG[tab]?.label || 'METRIC'}</label><select value={filters.metric} onChange={e => setFilters({...filters, metric: e.target.value})}>
                  {SECTION_FILTER_CONFIG[tab]?.options.map(o => <option key={o}>{o}</option>)}
                </select></div>
                <div className="toggle-box" onClick={() => setCompareMode(!compareMode)}>
                    <label>YOY PARITY</label>
                    <div className={`toggle-switch ${compareMode ? 'active' : ''}`}><div className="toggle-slider" /></div>
                </div>
              </div>
              <button className="reset-hub-btn" onClick={resetFilters}>RESET FILTERS</button>
            </div>
          </div>
          <div className="header-right"><button className={`gen-ai-btn ${generating ? 'loading' : ''}`} onClick={generateInfographic}>{generating ? 'SYNTHESIZING...' : 'AI INFOGRAPHIC'}</button></div>
        </header>

        <section className="viewport">
          <div className="viewport-inner">
            
            {/* Economic Module */}
            {tab === 'economic' && (
              <div className="module fade-in">
                <header className="hero-box" style={{ backgroundImage: `url(${LANDMARKS.economic})` }}><div className="hero-overlay" /><div className="hero-content"><h2 className="hero-title">Economic Performance</h2></div></header>
                <div className="economic-canvas-grid">
                    <ADRSparkline label="ADR PERFORMANCE" value={intelligence.economic.adr.value} source="STR Global" date={filters.time} />
                    <OriginFlowChart data={intelligence.economic.originData} source="Datafy Intelligence" date={filters.time} />
                </div>
                <div className="data-grid" style={{ marginTop: '25px' }}>
                  <KPICard 
                    label="ANNUAL YIELD" 
                    value={intelligence.economic.yield.value} 
                    prevValue={intelligence.economic.yield.prev} 
                    trend={intelligence.economic.yield.trend} 
                    showCompare={compareMode} 
                    source={intelligence.economic.yield} 
                    showTrend={true}
                  />
                  <KPICard 
                    label="REVPAR INDEX" 
                    value={intelligence.economic.revpar.value} 
                    prevValue={intelligence.economic.revpar.prev} 
                    trend={intelligence.economic.revpar.trend} 
                    showCompare={compareMode} 
                    source={intelligence.economic.revpar} 
                    showTrend={true}
                  />
                </div>
                <DataHealthCheck moduleId="economic" />
              </div>
            )}

            {/* Resident Module */}
            {tab === 'resident' && (
              <div className="module fade-in">
                <header className="hero-box" style={{ backgroundImage: `url(${LANDMARKS.resident})` }}><div className="hero-overlay" /><div className="hero-content"><h2 className="hero-title">Resident Benefit</h2></div></header>
                <div className="resident-layout-grid">
                  <div className="glass panel-hero">
                    <div className="val-giant">{intelligence.resident.savings.value}</div>
                    <div className="lbl-giant">ANNUAL TAX RELIEF OFFSET</div>
                    <SourceTag {...intelligence.resident.savings} />
                  </div>
                  <div className="qol-box glass">
                     <h3 className="sim-title">Quality of Life Ratio</h3>
                     <div className="qol-visual">
                        <div className="qol-center">
                            <span className="qol-ratio-val">{intelligence.resident.qolRatio.visitor}%</span>
                            <span className="qol-ratio-lbl">VISITOR LOAD</span>
                        </div>
                        <svg className="qol-ring-svg" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                          <circle cx="50" cy="50" r="45" fill="none" stroke={BRAND.primary} strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - intelligence.resident.qolRatio.visitor / 100)} transform="rotate(-90 50 50)" strokeLinecap="round" />
                        </svg>
                     </div>
                     <p className="analysis-text">Tourism revenue maintains <strong>$1,240</strong> in essential city services per household without local fiscal burden.</p>
                  </div>
                </div>
                <DataHealthCheck moduleId="resident" />
              </div>
            )}

            {/* Competitive Share Module */}
            {tab === 'market' && (
              <div className="module fade-in">
                <header className="hero-box" style={{ backgroundImage: `url(${LANDMARKS.market})` }}><div className="hero-overlay" /><div className="hero-content"><h2 className="hero-title">Competitive Share</h2></div></header>
                <div className="market-comparative-grid">
                   <div className="glass bench-container">
                      <h3 className="bench-title">STR RevPAR Index</h3>
                      {intelligence.market.benchmarks.map(b => (
                        <div key={b.market} className="bench-row">
                          <div className="bench-meta"><span>{b.market}</span><span>{b.index}.0 {compareMode && <span className="prev-val-chip">vs {b.prev}.0</span>}</span></div>
                          <div className="bench-rail-composite"><div className="bench-bar current" style={{ width: `${(b.index/135)*100}%`, backgroundColor: b.color }} /></div>
                        </div>
                      ))}
                   </div>
                   <div className="glass bench-container">
                      <h3 className="bench-title">Digital Velocity (GA4)</h3>
                      {intelligence.market.benchmarks.map(b => (
                        <div key={`${b.market}-digital`} className="bench-row">
                          <div className="bench-meta"><span>{b.market}</span><span className="digital-stats">Traffic: {(b.traffic/1000).toFixed(1)}K | {b.conversion}% Conv</span></div>
                          <div className="bench-rail-composite"><div className="bench-bar current" style={{ width: `${(b.traffic/350000)*100}%`, backgroundColor: b.color }} /></div>
                        </div>
                      ))}
                   </div>
                </div>
                <DataHealthCheck moduleId="market" />
              </div>
            )}

            {/* Simulation Module */}
            {tab === 'simulation' && (
              <div className="module fade-in">
                <header className="hero-box" style={{ backgroundImage: `url(${LANDMARKS.simulation})` }}><div className="hero-overlay" /><div className="hero-content"><h2 className="hero-title">Impact Simulation</h2></div></header>
                <div className="sim-container glass">
                  <div className="sim-controls">
                    <h3 className="sim-title">Event Scenario Parameters</h3>
                    <div className="sim-field"><label>MONTH</label><select value={simParams.month} onChange={e => setSimParams({...simParams, month: e.target.value})}><option>February</option><option>March</option><option>October</option></select></div>
                    <div className="sim-field"><label>DURATION (DAYS)</label><input type="range" min="1" max="7" value={simParams.duration} onChange={e => setSimParams({...simParams, duration: parseInt(e.target.value)})} /><span className="range-val">{simParams.duration} Days</span></div>
                    <div className="sim-field"><label>EST. ATTENDANCE</label><input type="number" step="5000" value={simParams.attendance} onChange={e => setSimParams({...simParams, attendance: parseInt(e.target.value)})} /></div>
                  </div>
                  <div className="sim-output">
                    <div className="sim-result-node">
                      <span className="sim-res-lbl">EST. OCCUPANCY LIFT</span>
                      <span className="sim-res-val">+{simResults.occLift}%</span>
                      <span className="sim-res-sub">TARGET OCCUPANCY: {simResults.finalOcc}%</span>
                    </div>
                    <div className="sim-result-node">
                      <span className="sim-res-lbl">PROJECTED DINING SPEND</span>
                      <span className="sim-res-val">${simResults.diningImpact}M</span>
                    </div>
                  </div>
                </div>
                <DataHealthCheck moduleId="simulation" />
              </div>
            )}

            {/* Strategic Advisor Module */}
            {tab === 'advisor' && (
              <div className="module fade-in">
                <header className="hero-box" style={{ backgroundImage: `url(${LANDMARKS.advisor})` }}><div className="hero-overlay" /><div className="hero-content"><h2 className="hero-title">Strategic Advisor</h2></div></header>
                <div className="glass briefing-panel">
                  {loadingAdvisor ? (
                    <div className="advisor-load">
                      <div className="advisor-spinner" />
                      Synthesizing vetted data nodes...
                    </div>
                  ) : (
                    <div className="brief-content">{advisorBrief}</div>
                  )}
                </div>
              </div>
            )}

            {/* Mobility Module */}
            {tab === 'mobility' && (
              <div className="module fade-in">
                <header className="hero-box" style={{ backgroundImage: `url(${LANDMARKS.mobility})` }}><div className="hero-overlay" /><div className="hero-content"><h2 className="hero-title">Mobility Intel</h2></div></header>
                <div className="data-grid">
                  <KPICard label="TOTAL VISITOR TRIPS" value={intelligence.mobility.trips.value} prevValue={intelligence.mobility.trips.prev} trend={intelligence.mobility.trips.trend} showCompare={compareMode} source={intelligence.mobility.trips} />
                  <KPICard label="LA MARKET SHARE" value={intelligence.mobility.laMarketShare.value} trend="DOMINANT" source={intelligence.mobility.laMarketShare} />
                </div>
                <DataHealthCheck moduleId="mobility" />
              </div>
            )}

            {/* Brand Module */}
            {tab === 'brand' && (
              <div className="module fade-in">
                <header className="hero-box" style={{ backgroundImage: `url(${LANDMARKS.brand})` }}><div className="hero-overlay" /><div className="hero-content"><h2 className="hero-title">Brand Velocity</h2></div></header>
                <div className="data-grid">
                  <KPICard label="ANNUAL WEB VISITORS" value={intelligence.brand.visitors.value} prevValue={intelligence.brand.visitors.prev} trend={intelligence.brand.visitors.trend} showCompare={compareMode} source={intelligence.brand.visitors} />
                  <KPICard label="CONVERSION RATE" value={intelligence.brand.conversion.value} prevValue={intelligence.brand.conversion.prev} trend="GAP IDENTIFIED" showCompare={compareMode} source={intelligence.brand.conversion} />
                </div>
                <DataHealthCheck moduleId="brand" />
              </div>
            )}

            {/* Data Registry Module */}
            {tab === 'registry' && (
              <div className="module fade-in">
                <header className="hero-box" style={{ backgroundImage: `url(${LANDMARKS.registry})` }}><div className="hero-overlay" /><div className="hero-content"><h2 className="hero-title">Data Registry</h2></div></header>
                <div className="glass table-wrap">
                  <div className="registry-controls">
                    <input className="registry-search" placeholder="Search nodes or sources..." value={searchRegistry} onChange={e => setSearchRegistry(e.target.value)} />
                    <select className="registry-type-filter" value={registryTypeFilter} onChange={e => setRegistryTypeFilter(e.target.value)}>
                      <option value="ALL">All Node Types</option><option value="ECONOMIC">Economic</option><option value="MARKET">Market</option><option value="RESIDENT">Resident</option><option value="MOBILITY">Mobility</option><option value="BRAND">Brand</option>
                    </select>
                  </div>
                  <table className="registry-table">
                    <thead><tr><th>NODE</th><th>VALUE</th><th>TYPE</th><th>SOURCE</th></tr></thead>
                    <tbody>
                      {registryData.map((d, i) => (
                        <tr key={i}><td className="node-name">{d.node}</td><td className="node-val">{d.value}</td><td><span className={`type-tag ${d.type}`}>{d.type}</span></td><td>{d.source}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </section>

        {infographic && (
          <div className="modal-overlay" onClick={() => setInfographic(null)}>
            <div className="modal-content glass">
              <div className="modal-head">
                <h3>Synthesis Report: {tab.toUpperCase()}</h3>
                <button onClick={() => setInfographic(null)}>✕</button>
              </div>
              <img src={infographic} alt="AI Summary" className="img-infographic" />
              <div className="modal-footer">
                <p>Synthesized via Gemini Vision Node. For internal executive presentation only.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        :root { --display: 'Playfair Display', serif; --ui: 'Inter', sans-serif; }
        body, html { margin: 0; padding: 0; font-family: var(--ui); color: ${BRAND.navy}; background: ${BRAND.sand}; overflow-x: hidden; }
        .app-shell { display: flex; height: 100vh; width: 100vw; }
        .sidebar { width: 340px; background: ${BRAND.navy}; color: white; display: flex; flex-direction: column; transition: 0.4s; z-index: 1000; box-shadow: 10px 0 50px rgba(0,0,0,0.2); }
        .sb-header { padding: 40px; }
        .brand-logo { font-family: var(--display); font-size: 2.1rem; margin: 0; color: ${BRAND.primary}; }
        .brand-intel { font-size: 0.65rem; opacity: 0.5; letter-spacing: 0.3em; display: block; margin-top: 15px; }
        .sb-nav { padding: 15px; flex: 1; overflow-y: auto; }
        .nav-node { padding: 14px 25px; cursor: pointer; opacity: 0.4; transition: 0.3s; position: relative; border-radius: 14px; margin-bottom: 5px; }
        .nav-node.active { opacity: 1; background: rgba(255,255,255,0.08); }
        .nav-bar { position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 4px; height: 0; background: ${BRAND.brightGold}; transition: 0.4s; }
        .nav-node.active .nav-bar { height: 60%; }
        .presets-section { padding: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
        .presets-header { display: flex; justify-content: space-between; align-items: center; font-size: 0.6rem; font-weight: 900; color: rgba(255,255,255,0.4); margin-bottom: 10px; }
        .add-preset-btn { background: none; border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; }
        .preset-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; margin-bottom: 5px; }
        .preset-item:hover { background: rgba(255,255,255,0.05); }
        .preset-del { background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; }
        .sb-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
        .secure-badge { display: flex; align-items: center; gap: 8px; font-size: 0.55rem; color: rgba(255,255,255,0.4); font-weight: 900; }
        .pulse-dot { width: 6px; height: 6px; background: ${BRAND.success}; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

        .main-content { flex: 1; display: flex; flex-direction: column; overflow-y: auto; background: ${BRAND.sand}; }
        .global-header { height: 100px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; position: sticky; top: 0; z-index: 500; }
        .intel-command-hub { display: flex; align-items: center; padding: 10px 20px; border-radius: 20px; border: 1.5px solid #E2E8F0; gap: 30px; }
        .hub-info { border-right: 1.5px solid #E2E8F0; padding-right: 20px; }
        .hub-cat-label { font-size: 0.5rem; font-weight: 900; color: #94A3B8; }
        .hub-cat-val { font-size: 0.9rem; font-weight: 900; color: ${BRAND.primary}; }
        .hub-filters { display: flex; gap: 20px; align-items: center; }
        .hub-field label { font-size: 0.5rem; color: #94A3B8; display: block; font-weight: 900; }
        .hub-field select { border: none; font-weight: 700; outline: none; background: transparent; cursor: pointer; font-size: 0.8rem; }
        .reset-hub-btn { background: ${BRAND.sand}; color: ${BRAND.primary}; border: 1.5px solid #E2E8F0; padding: 8px 16px; border-radius: 10px; font-size: 0.65rem; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .reset-hub-btn:hover { background: #F1F5F9; border-color: ${BRAND.primary}; }
        
        .viewport-inner { max-width: 1400px; margin: 0 auto; padding: 40px; }
        .hero-box { height: 280px; border-radius: 35px; overflow: hidden; position: relative; display: flex; align-items: flex-end; padding: 50px; color: white; background-size: cover; background-position: center; margin-bottom: 40px; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, ${BRAND.navy} 15%, transparent 100%); opacity: 0.8; }
        .hero-content { position: relative; z-index: 10; }
        .hero-title { font-family: var(--display); font-size: 3.5rem; margin: 0; }
        .glass { background: ${BRAND.glass}; backdrop-filter: blur(40px); border: 1.5px solid rgba(255,255,255,0.8); border-radius: 30px; box-shadow: ${BRAND.shadow}; }
        
        .economic-canvas-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 25px; }
        .origin-flow-container { padding: 30px; display: flex; flex-direction: column; }
        .origin-canvas { width: 100%; height: 220px; }
        .spark-node { padding: 30px; display: flex; flex-direction: column; gap: 20px; }
        .spark-canvas { width: 100%; height: 80px; }

        .data-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; }
        .kpi-node { padding: 40px; border-top: 6px solid ${BRAND.primary}; position: relative; }
        .kpi-hero-wrap { display: flex; align-items: flex-end; justify-content: space-between; }
        .mini-trend { margin-bottom: 12px; opacity: 0.7; }
        .kpi-val-hero { font-family: var(--display); font-size: 2.8rem; color: ${BRAND.navy}; margin: 10px 0; display: block; }
        .kpi-lbl { font-size: 0.65rem; color: #94A3B8; letter-spacing: 0.15em; font-weight: 900; }
        .kpi-trend-pill { position: absolute; top: 40px; right: 40px; background: ${BRAND.success}; color: white; font-size: 0.55rem; font-weight: 900; padding: 4px 10px; border-radius: 20px; }
        .kpi-compare-cluster { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
        .kpi-val-prev { font-size: 0.75rem; color: #94A3B8; font-weight: 700; }
        .kpi-delta { font-size: 0.75rem; font-weight: 900; padding: 2px 8px; border-radius: 4px; }
        .kpi-delta.pos { color: ${BRAND.success}; background: rgba(45, 206, 137, 0.1); }
        .kpi-delta.neg { color: ${BRAND.danger}; background: rgba(255, 77, 77, 0.1); }
        .kpi-source { margin-top: 20px; font-size: 0.55rem; color: #94A3B8; font-weight: 700; border-top: 1px solid #F1F5F9; padding-top: 10px; }
        
        .health-check { margin-top: 40px; padding: 30px; }
        .health-head { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1.5px solid #F1F5F9; padding-bottom: 10px; }
        .health-title { font-size: 0.7rem; font-weight: 900; color: #94A3B8; letter-spacing: 0.1em; }
        .health-status { font-size: 0.6rem; font-weight: 900; color: ${BRAND.success}; }
        .health-content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .health-node label { font-size: 0.55rem; font-weight: 900; color: #94A3B8; display: block; margin-bottom: 8px; }
        .health-tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .health-tag { font-size: 0.6rem; font-weight: 900; padding: 4px 10px; border-radius: 6px; }
        .health-tag.source { background: rgba(0, 107, 118, 0.1); color: ${BRAND.primary}; }
        .health-tag.missing { background: rgba(255, 77, 77, 0.1); color: ${BRAND.danger}; }

        .resident-layout-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        .val-giant { font-family: var(--display); font-size: 6rem; color: ${BRAND.primary}; }
        .lbl-giant { font-size: 1rem; font-weight: 900; color: ${BRAND.accent}; letter-spacing: 0.2em; margin-bottom: 30px; }
        .panel-hero { padding: 50px; text-align: center; }
        .qol-box { padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .qol-visual { width: 180px; height: 180px; position: relative; display: flex; align-items: center; justify-content: center; }
        .qol-ring-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .qol-center { text-align: center; z-index: 5; }
        .qol-ratio-val { font-family: var(--display); font-size: 2.5rem; color: ${BRAND.primary}; display: block; }
        .qol-ratio-lbl { font-size: 0.6rem; font-weight: 900; color: #94A3B8; }
        .analysis-text { color: #64748B; line-height: 1.6; margin-top: 30px; text-align: center; }

        .market-comparative-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        .bench-container { padding: 40px; }
        .bench-title { font-family: var(--display); font-size: 1.5rem; margin-bottom: 30px; color: ${BRAND.primary}; }
        .bench-row { margin-bottom: 25px; }
        .bench-meta { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 900; margin-bottom: 8px; }
        .bench-rail-composite { height: 12px; background: #E2E8F0; border-radius: 6px; overflow: hidden; }
        .bench-bar { height: 100%; transition: 1s cubic-bezier(0.19, 1, 0.22, 1); }
        .digital-stats { color: #94A3B8; font-size: 0.7rem; }

        .sim-container { padding: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
        .sim-title { font-family: var(--display); font-size: 1.5rem; margin-bottom: 30px; color: ${BRAND.primary}; }
        .sim-field { margin-bottom: 20px; }
        .sim-field label { font-size: 0.6rem; font-weight: 900; color: #94A3B8; display: block; margin-bottom: 8px; }
        .sim-field select, .sim-field input { width: 100%; padding: 12px; border-radius: 8px; border: 1.5px solid #E2E8F0; font-weight: 700; background: white; }
        .range-val { font-size: 0.8rem; font-weight: 700; color: ${BRAND.primary}; display: block; margin-top: 5px; }
        .sim-output { display: flex; flex-direction: column; gap: 20px; justify-content: center; }
        .sim-result-node { padding: 30px; background: #F8FAFC; border-left: 8px solid ${BRAND.primary}; border-radius: 15px; }
        .sim-res-lbl { font-size: 0.6rem; font-weight: 900; color: #94A3B8; }
        .sim-res-val { display: block; font-family: var(--display); font-size: 2.5rem; color: ${BRAND.primary}; margin: 10px 0; }
        .sim-res-sub { font-size: 0.75rem; color: #64748B; font-weight: 800; }

        .briefing-panel { padding: 50px; min-height: 400px; display: flex; flex-direction: column; }
        .advisor-load { color: #94A3B8; font-style: italic; display: flex; align-items: center; gap: 15px; }
        .advisor-spinner { width: 24px; height: 24px; border: 3px solid #E2E8F0; border-top-color: ${BRAND.primary}; border-radius: 50%; animation: spin 1s infinite linear; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .brief-content { line-height: 1.8; font-size: 1.1rem; color: #334155; white-space: pre-wrap; }

        .table-wrap { overflow: hidden; }
        .registry-controls { padding: 30px 40px; display: flex; gap: 15px; }
        .registry-search { flex: 1; padding: 12px 20px; border-radius: 12px; border: 1.5px solid #E2E8F0; font-weight: 600; }
        .registry-type-filter { padding: 12px; border-radius: 12px; border: 1.5px solid #E2E8F0; font-weight: 700; background: white; cursor: pointer; }
        .registry-table { width: 100%; border-collapse: collapse; }
        .registry-table th { text-align: left; padding: 20px; border-bottom: 2px solid #F1F5F9; font-size: 0.65rem; color: #94A3B8; text-transform: uppercase; }
        .registry-table td { padding: 20px; border-bottom: 1px solid #F1F5F9; font-weight: 600; font-size: 0.9rem; }
        .node-name { color: ${BRAND.navy}; font-weight: 900; }
        .node-val { color: ${BRAND.primary}; }
        .type-tag { font-size: 0.6rem; font-weight: 900; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; }
        .type-tag.ECONOMIC { background: #E0F2F1; color: #00796B; }
        .type-tag.MARKET { background: #F3E5F5; color: #7B1FA2; }
        .type-tag.MOBILITY { background: #E3F2FD; color: #1976D2; }
        .type-tag.RESIDENT { background: #FFF3E0; color: #E65100; }
        .type-tag.BRAND { background: #F1F8E9; color: #33691E; }

        .toggle-box { display: flex; flex-direction: column; gap: 4px; cursor: pointer; }
        .toggle-box label { font-size: 0.5rem; font-weight: 900; color: #A67C00; text-transform: uppercase; }
        .toggle-switch { width: 40px; height: 20px; background: #E2E8F0; border-radius: 20px; position: relative; transition: 0.3s; }
        .toggle-switch.active { background: ${BRAND.primary}; }
        .toggle-slider { width: 14px; height: 14px; background: white; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: 0.3s; }
        .toggle-switch.active .toggle-slider { left: 23px; }

        .gen-ai-btn { background: ${BRAND.navy}; color: ${BRAND.brightGold}; border: 1.5px solid ${BRAND.brightGold}; padding: 12px 24px; border-radius: 12px; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .gen-ai-btn:hover { background: ${BRAND.primary}; }
        .gen-ai-btn.loading { opacity: 0.7; cursor: wait; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { max-width: 90%; max-height: 90%; padding: 40px; overflow-y: auto; display: flex; flex-direction: column; align-items: center; }
        .modal-head { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #E2E8F0; padding-bottom: 15px; }
        .modal-head h3 { font-family: var(--display); color: ${BRAND.primary}; margin: 0; }
        .modal-head button { background: none; border: none; font-size: 2rem; cursor: pointer; color: ${BRAND.navy}; }
        .img-infographic { max-width: 100%; border-radius: 15px; box-shadow: 0 25px 60px rgba(0,0,0,0.4); }
        .modal-footer { margin-top: 20px; font-size: 0.75rem; color: #94A3B8; }

        .fade-in { animation: enter 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        @keyframes enter { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .menu-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; display: none; margin-right: 15px; }

        @media (max-width: 1100px) {
          .sidebar { width: 0; position: fixed; left: -340px; height: 100%; }
          .app-shell.sb-open .sidebar { width: 340px; left: 0; }
          .menu-btn { display: block; }
          .data-grid, .resident-layout-grid, .market-comparative-grid, .sim-container, .economic-canvas-grid { grid-template-columns: 1fr; }
          .intel-command-hub { flex-wrap: wrap; gap: 15px; padding: 15px; }
          .global-header { height: auto; padding: 20px; }
        }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<Dashboard />);
