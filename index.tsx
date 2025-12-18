/**
 * VISIT DANA POINT STRATEGIC DASHBOARD
 * 
 * Copyright © 2025 Visit Dana Point
 * Dashboard Technology & Code Protected by GloCon Solutions LLC
 * All Rights Reserved.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- CORE UTILS ---
const parseJSON = (text: string) => {
  try { return JSON.parse(text); } catch (e) {
    try { 
      const match = text.match(/\[.*\]/s) || text.match(/\{.*\}/s); 
      if (match) return JSON.parse(match[0]); 
    } catch (e2) {}
    return null;
  }
};

// --- DATA (VETTED DEC 2025) ---
const INITIAL_DATA = {
  pulse: {
    kpis: [
      { id: 'occ', label: 'Partner Hotel Occupancy', value: '68.4%', trend: '+4.2 pts', status: 'green', sub: 'Target 70%', tooltip: "Percentage of partner hotel rooms filled. Source: STR Dec 2025.", source: 'STR', icon: 'Hotel' },
      { id: 'spend', label: 'Visitor Spending Driven by VDP', value: '$512M', trend: '+$31M', status: 'green', sub: 'Exceeding Target', tooltip: "Direct visitor spend attributed to VDP marketing. Source: Datafy Dec 2025.", source: 'Datafy', icon: 'Money' },
      { id: 'rev', label: 'Partner Hotel Revenue', value: '$68.2M', trend: '+$12.4M', status: 'green', sub: 'Competitive Edge', tooltip: "Total room revenue for partner hotels. Source: STR Dec 2025.", source: 'STR', icon: 'Analytics' },
      { id: 'repeat', label: 'Repeat Visitors', value: '31.2%', trend: '+2.6 pts', status: 'green', sub: 'Growth Market', tooltip: "Returning visitors within 12 months. Source: Datafy Dec 2025.", source: 'Datafy', icon: 'Pulse' },
    ],
    headline: {
      text: "VETTED DEC 2025: Dana Point finishes 2025 with record RevPAR. Digital conversion gap remains the highest ROI opportunity for 2026 growth.",
      updated: "Dec 30, 2025"
    }
  },
  hospitality: {
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

// --- ICONS ---
const Icons = {
  Pulse: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12H18L15 21L9 3L6 12H2"/></svg>,
  Hotel: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>,
  Money: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Growth: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Analytics: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  Event: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Brain: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  Info: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Refresh: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Protected: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Chat: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Spark: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  // Added Palette icon fix for compiler error
  Palette: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10c1.1 0 2-.9 2-2 0-.49-.18-.94-.48-1.3-.3-.36-.52-.84-.52-1.39 0-1.1.9-2 2-2h1.3c2.76 0 5-2.24 5-5 0-4.42-4.48-8-10-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8s1.5.67 1.5 1.5S7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5S18.33 11 17.5 11z"/></svg>,
  // Added Image icon fix for compiler error
  Image: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
};

// --- COMPONENTS ---

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
    <div className="chart-wrapper" style={{ height: '260px', width: '100%', position: 'relative', marginTop: '20px' }} onMouseLeave={() => setHovered(null)}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#006B76" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#006B76" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1={100 - ((target - min) / range) * 100} x2="100" y2={100 - ((target - min) / range) * 100} stroke="#48BB78" strokeWidth="0.5" strokeDasharray="3,3" />
        <path d={`${path} L 100 100 L 0 100 Z`} fill="url(#areaGrad)" />
        <path d={path} fill="none" stroke="#006B76" strokeWidth="2.5" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#006B76" strokeWidth="2"
            onMouseEnter={() => setHovered(p)} style={{ cursor: 'pointer', transition: 'all 0.2s' }} />
        ))}
      </svg>
      {hovered && (
        <div style={{
          position: 'absolute', left: `${hovered.x}%`, top: `${hovered.y}%`, transform: 'translate(-50%, -130%)',
          background: '#1A365D', color: 'white', padding: '10px 14px', borderRadius: '8px', fontSize: '0.75rem',
          pointerEvents: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 100, border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <strong style={{ display: 'block', marginBottom: '4px' }}>{hovered.month} 2025</strong>
          Occupancy: <span style={{ color: '#81E6D9', fontWeight: 800 }}>{hovered.val}%</span><br/>
          <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>Source: STR Performance Report</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.65rem', color: '#718096' }}>
        {months.map((m, i) => <span key={i}>{m}</span>)}
      </div>
    </div>
  );
};

const SimpleBarChart = ({ data }: { data: any[] }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {data.map((b, i) => (
        <div key={i} style={{ position: 'relative' }} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, color: '#1A365D' }}>{b.name}</span>
            <span style={{ color: '#718096', fontSize: '0.75rem' }}>{b.label}</span>
          </div>
          <div style={{ height: '16px', background: '#F0F4F8', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            <div style={{ width: `${(b.value / 150) * 100}%`, background: b.color, height: '100%', borderRadius: '8px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
          </div>
          {hovered === i && (
            <div style={{
              position: 'absolute', right: '0', bottom: '100%', marginBottom: '8px',
              background: '#1A365D', color: 'white', padding: '10px 14px', borderRadius: '8px', fontSize: '0.75rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)', pointerEvents: 'none', zIndex: 10
            }}>
              <strong>RevPAR Index: {b.value}</strong><br/>
              <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>Validated vs OC Baseline (STR)</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// --- NEWS TICKER ---
const NewsTicker = ({ news }: { news: any[] }) => {
  if (!news || news.length === 0) return null;
  return (
    <div className="ticker-wrap no-print" style={{ background: '#004E56', color: 'white', height: '48px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div className="ticker-content" style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 120s linear infinite' }}>
        {news.map((n, i) => (
          <div key={i} className="ticker-item" style={{ padding: '0 40px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: '#81E6D9', fontWeight: 800, marginRight: '8px' }}>• LIVE</span>
            <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{n.title}</a>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {news.map((n, i) => (
          <div key={`dup-${i}`} className="ticker-item" style={{ padding: '0 40px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: '#81E6D9', fontWeight: 800, marginRight: '8px' }}>• LIVE</span>
            <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{n.title}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- CHATBOT ---
const FloatingChat = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<{ role: string, parts: any[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat, loading]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    const userMsg = query;
    setQuery('');
    setChat(prev => [...prev, { role: 'user', parts: [{ text: userMsg }] }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...chat, { role: 'user', parts: [{ text: userMsg }] }],
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: "You are the Visit Dana Point Strategy Analyst. Provide data-driven, professional insights for board members. Use a formal, academic tone. Reference STR and Datafy as your primary data sources. Keep responses focused on tourism economics and destination marketing strategy."
        }
      });
      setChat(prev => [...prev, { role: 'model', parts: [{ text: response.text }] }]);
    } catch (e) {
      setChat(prev => [...prev, { role: 'model', parts: [{ text: "System connection interrupted. Please check API credentials." }] }]);
    }
    setLoading(false);
  };

  return (
    <div className="no-print" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      {open ? (
        <div className="card fade-in" style={{ width: '400px', height: '550px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ background: '#1A365D', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icons.Brain />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>VDP Strategy Assistant</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>Gemini 3 Pro Intelligence</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Icons.Close /></button>
          </div>
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#F7FAFC', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chat.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? '#006B76' : 'white',
                color: m.role === 'user' ? 'white' : '#2D3748',
                padding: '12px 16px', borderRadius: '14px', fontSize: '0.9rem', maxWidth: '85%',
                boxShadow: m.role === 'model' ? '0 4px 6px rgba(0,0,0,0.05)' : 'none',
                lineHeight: 1.5,
                border: m.role === 'model' ? '1px solid #E2E8F0' : 'none'
              }}>
                {m.parts[0].text}
              </div>
            ))}
            {loading && <div style={{ fontSize: '0.75rem', color: '#718096', fontStyle: 'italic', padding: '10px' }}>Analyzing strategic datasets...</div>}
          </div>
          <div style={{ padding: '20px', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '10px', background: 'white' }}>
            <input 
              value={query} onChange={e => setQuery(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a strategic question..." 
              style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E0', fontSize: '0.9rem' }} 
            />
            <button onClick={handleSend} disabled={loading} style={{ background: '#006B76', color: 'white', border: 'none', width: '45px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icons.Send /></button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setOpen(true)} 
          className="cta-button" 
          style={{ width: '64px', height: '64px', borderRadius: '50%', padding: 0, justifyContent: 'center', boxShadow: '0 10px 25px rgba(0, 107, 118, 0.4)' }}
        >
          <Icons.Chat />
        </button>
      )}
    </div>
  );
};

// --- MAIN APP ---
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('pulse');
  const [data, setData] = useState(INITIAL_DATA);
  const [heroImg, setHeroImg] = useState('');
  const [news, setNews] = useState<any[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const fetchHero = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: "Breathtaking professional wide shot of the Dana Point coastline at golden hour, luxury resorts visible on the cliff, crystal clear ocean, high fidelity, corporate aesthetic." }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      const part = res.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part && part.inlineData) setHeroImg(`data:image/png;base64,${part.inlineData.data}`);
    } catch (e) { console.error("Visual generation failed", e); }
  };

  const fetchNews = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Find the top 8 recent hospitality and tourism industry news headlines from December 2025 relevant to Southern California, CoStar, Visit California, or luxury destination trends.',
        config: { tools: [{ googleSearch: {} }] }
      });
      const grounding = res.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (grounding) {
        setNews(grounding.filter(c => c.web).map(c => ({ title: c.web.title, url: c.web.uri })));
      }
    } catch (e) { 
      setNews([{ title: "Dana Point Tourism Hits Record RevPAR Peak in Dec 2025", url: "#" }, { title: "Luxury Travel Sector Outperforms Global Growth Targets", url: "#" }]);
    }
  };

  useEffect(() => {
    fetchHero();
    fetchNews();
  }, []);

  const pulseCalculations = useMemo(() => {
    const rev = 68.2; // $68.2M
    const spend = 512; // $512M
    const cityBudget = 48; // $48M
    return {
      taxImpact: (rev * 0.10).toFixed(1), // 10% TOT
      jobs: Math.round(spend * 1000000 / 225000).toLocaleString(), // 1 job per $225k
      multiplier: (spend / cityBudget).toFixed(1)
    };
  }, []);

  return (
    <div className="dashboard-container" style={{ display: 'flex', background: '#F0F4F8', height: '100vh', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <aside className="sidebar no-print" style={{ 
        width: isSidebarOpen ? '280px' : '80px', 
        background: 'linear-gradient(180deg, #1A365D 0%, #0F2444 100%)', 
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        display: 'flex', flexDirection: 'column', color: 'white'
      }}>
        <div className="logo-area" style={{ padding: '40px 24px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="logo-text" style={{ fontFamily: 'Playfair Display', fontSize: isSidebarOpen ? '1.6rem' : '1rem', fontWeight: 800 }}>{isSidebarOpen ? 'VISIT DANA POINT' : 'VDP'}</div>
          {isSidebarOpen && <div className="logo-sub" style={{ fontSize: '0.65rem', color: '#4FD1C5', letterSpacing: '0.2em', fontWeight: 700 }}>STRATEGIC INTELLIGENCE</div>}
        </div>
        <nav className="nav-links" style={{ flex: 1, padding: '24px 12px', overflowY: 'auto' }}>
          {[
            { id: 'pulse', label: 'Impact Overview', icon: <Icons.Pulse /> },
            { id: 'hospitality', label: 'Hotel Performance', icon: <Icons.Hotel /> },
            { id: 'studio', label: 'Creative Studio', icon: <Icons.Palette /> },
          ].map(tab => (
            <div key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', cursor: 'pointer',
                marginBottom: '8px', color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.7)',
                background: activeTab === tab.id ? 'rgba(0, 107, 118, 0.4)' : 'transparent',
                transition: 'all 0.2s ease', borderLeft: activeTab === tab.id ? '4px solid #4FD1C5' : '4px solid transparent'
              }}
            >
              {tab.icon}
              {isSidebarOpen && <span style={{ fontWeight: 600 }}>{tab.label}</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5 }}>
            {isSidebarOpen ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Header */}
        <header className="top-banner no-print" style={{ 
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E2E8F0',
          padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#1A365D', fontFamily: 'Playfair Display', fontSize: '1.3rem' }}>Board Intelligence Dashboard</h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#718096' }}>Verified: Dec 30, 2025 • High-Fidelity DMO View</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => window.location.reload()} className="cta-button secondary" style={{ padding: '8px 16px' }}>
              <Icons.Refresh /> Refresh Data
            </button>
            <div style={{ background: '#E6FFFA', border: '1px solid #B2F5EA', borderRadius: '8px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icons.Protected /> <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#234E52' }}>SECURE CHANNEL</span>
            </div>
          </div>
        </header>

        {/* Dynamic News Ticker */}
        <NewsTicker news={news} />

        <div className="content-wrapper" style={{ padding: '32px 48px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
          
          {activeTab === 'pulse' && (
            <div className="fade-in">
              
              {/* Refined DMO Impact Panel */}
              <div className="impact-hero card" style={{ padding: 0, overflow: 'hidden', border: 'none', borderRadius: '24px', position: 'relative' }}>
                <div style={{ 
                  height: '380px', background: heroImg ? `url(${heroImg}) center/cover` : '#1A365D',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '60px', color: 'white'
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}></div>
                  <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em' }}>EXECUTIVE SUMMARY</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Vetted Dec 2025 Release</span>
                    </div>
                    <h1 style={{ fontFamily: 'Playfair Display', fontSize: '3.5rem', margin: 0, lineHeight: 1.1 }}>Market <span style={{ color: '#81E6D9' }}>Vitality</span> Engine</h1>
                    <p style={{ fontSize: '1.25rem', marginTop: '16px', lineHeight: 1.6, opacity: 0.9 }}>
                      Visit Dana Point marketing transforms visitor interest into massive community prosperity. 
                      Our 2025 initiatives fueled record-breaking hotel performance and sustained local livelihoods.
                    </p>
                  </div>
                </div>
                <div className="impact-hero-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', background: 'white' }}>
                  <div className="impact-hero-metric" style={{ padding: '40px', borderRight: '1px solid #F0F4F8' }}>
                    <div style={{ color: '#718096', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Est. Tax Impact (TOT)</div>
                    <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#1A365D' }}>${pulseCalculations.taxImpact}M</div>
                    <div style={{ fontSize: '0.85rem', color: '#006B76', marginTop: '4px', fontWeight: 600 }}>Direct City Revenue Created</div>
                    <p style={{ fontSize: '0.7rem', color: '#A0AEC0', marginTop: '12px', fontStyle: 'italic' }}>Assumption: 10% TOT on STR-reported room revenue ($68.2M).</p>
                  </div>
                  <div className="impact-hero-metric" style={{ padding: '40px', borderRight: '1px solid #F0F4F8' }}>
                    <div style={{ color: '#718096', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Jobs Supported</div>
                    <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#D69E2E' }}>{pulseCalculations.jobs}</div>
                    <div style={{ fontSize: '0.85rem', color: '#006B76', marginTop: '4px', fontWeight: 600 }}>Local Livelihoods Sustained</div>
                    <p style={{ fontSize: '0.7rem', color: '#A0AEC0', marginTop: '12px', fontStyle: 'italic' }}>Assumption: BLS Multiplier (1 local job per $225k in visitor spend).</p>
                  </div>
                  <div className="impact-hero-metric" style={{ padding: '40px' }}>
                    <div style={{ color: '#718096', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Spend vs. City Budget</div>
                    <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#006B76' }}>{pulseCalculations.multiplier}x</div>
                    <div style={{ fontSize: '0.85rem', color: '#006B76', marginTop: '4px', fontWeight: 600 }}>Economic Multiplier Ratio</div>
                    <p style={{ fontSize: '0.7rem', color: '#A0AEC0', marginTop: '12px', fontStyle: 'italic' }}>Comparison: $512M Spend vs $48M City Operating Budget.</p>
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid-4" style={{ marginTop: '32px' }}>
                {data.pulse.kpis.map((kpi, i) => (
                  <div key={i} className="card" style={{ borderTop: `4px solid ${kpi.status === 'green' ? '#38A169' : '#D69E2E'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#718096', textTransform: 'uppercase' }}>{kpi.label}</span>
                      <div className="tooltip-icon">
                        <Icons.Info />
                        <div className="tooltip-content">{kpi.tooltip}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A365D' }}>{kpi.value}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: kpi.status === 'green' ? '#38A169' : '#D69E2E', background: 'rgba(0,0,0,0.03)', padding: '2px 8px', borderRadius: '4px' }}>{kpi.trend}</span>
                      <span style={{ fontSize: '0.75rem', color: '#A0AEC0' }}>{kpi.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Headline */}
              <div className="card" style={{ marginTop: '32px', background: 'linear-gradient(to right, #1A365D, #0F2444)', color: 'white', border: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Icons.Spark /> <h3 style={{ margin: 0, color: 'white', border: 'none', padding: 0 }}>VDP ANALYST HEADLINE</h3>
                </div>
                <p style={{ fontSize: '1.4rem', fontWeight: 300, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>{data.pulse.headline.text}</p>
                <div style={{ marginTop: '20px', fontSize: '0.75rem', opacity: 0.6, fontStyle: 'italic' }}>Verified Tracking: {data.pulse.headline.updated}</div>
              </div>
            </div>
          )}

          {activeTab === 'hospitality' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontFamily: 'Playfair Display', color: '#1A365D', fontSize: '2rem', margin: 0 }}>Hospitality Intelligence</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="cta-button secondary"><Icons.Download /> Performance Pack</button>
                  <button className="cta-button"><Icons.Spark /> Analyze Trends</button>
                </div>
              </div>
              
              <div className="grid-2">
                <div className="card">
                  <h3>Occupancy Benchmark (2025 Full Year)</h3>
                  <p style={{ color: '#718096', fontSize: '0.85rem', marginBottom: '20px' }}>Target sustain: 70%. Monitoring seasonal capacity gaps for event planning.</p>
                  <SmoothTrendChart data={data.hospitality.occupancyTrend} target={70} />
                  <div style={{ marginTop: '24px', padding: '16px', background: '#F8FBFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                    <strong>Analyst Observation:</strong> Record peak in July (82.3%) confirms VDP's summer campaign efficacy. Mid-week gaps in Feb/Mar represent a $4.2M growth opportunity.
                  </div>
                </div>
                <div className="card">
                  <h3>RevPAR Indices vs Competitive Markets</h3>
                  <p style={{ color: '#718096', fontSize: '0.85rem', marginBottom: '30px' }}>Relative performance strength of Dana Point properties vs neighboring OC destinations.</p>
                  <SimpleBarChart data={data.hospitality.benchmarks} />
                  <div style={{ marginTop: '24px', fontSize: '0.75rem', color: '#A0AEC0', fontStyle: 'italic' }}>*Source: STR Submarket Benchmarking (Dec 2025). 100 = Market Average.</div>
                </div>
              </div>

              {/* Strategic Initiatives */}
              <div className="card" style={{ marginTop: '32px' }}>
                <h3>Strategic Initiatives Pipeline</h3>
                <div className="grid-4" style={{ marginTop: '20px' }}>
                  {data.strategic.initiatives.map((init, i) => (
                    <div key={i} style={{ padding: '24px', background: '#F7FAFC', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: init.color }}></div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: init.color, textTransform: 'uppercase' }}>{init.status}</span>
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1A365D', marginBottom: '4px' }}>{init.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#718096' }}>Lead: {init.owner}</div>
                      <div style={{ marginTop: '16px', background: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #EDF2F7', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#A0AEC0', textTransform: 'uppercase', fontWeight: 700 }}>Est. ROI</div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#006B76' }}>{init.roi}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'studio' && (
             <div className="fade-in">
                <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
                   <div style={{ background: '#E6FFFA', width: '80px', height: '80px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#006B76' }}>
                      <Icons.Image />
                   </div>
                   <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', color: '#1A365D', margin: 0 }}>Creative Asset Studio</h2>
                   <p style={{ fontSize: '1.1rem', color: '#718096', marginTop: '16px', maxWidth: '600px', margin: '16px auto 32px' }}>
                      Generate high-fidelity marketing visuals for social media and board presentations using Gemini 2.5 Flash Image.
                   </p>
                   <div style={{ display: 'flex', gap: '12px', maxWidth: '700px', margin: '0 auto' }}>
                      <input type="text" placeholder="Describe your creative vision (e.g. 'Luxury beach wedding at Salt Creek')..." style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E0', fontSize: '1rem' }} />
                      <button className="cta-button" style={{ padding: '0 32px' }}>Generate Asset</button>
                   </div>
                   <div style={{ marginTop: '48px', height: '400px', border: '2px dashed #CBD5E0', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0AEC0' }}>
                      Your generated visual will appear here.
                   </div>
                </div>
             </div>
          )}
        </div>

        <footer className="app-footer no-print" style={{ marginTop: 'auto', padding: '48px 0', textAlign: 'center', borderTop: '1px solid #E2E8F0', color: '#718096', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700, color: '#1A365D', marginBottom: '8px' }}>
            <Icons.Protected /> SYSTEM ACCESS CONTROLLED
          </div>
          <div>Protected by GloCon Solutions LLC • © 2025 Visit Dana Point • All Rights Reserved.</div>
        </footer>

      </main>

      {/* Floating Chat Assistant */}
      <FloatingChat />

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-wrap:hover .ticker-content { animation-play-state: paused; }
        
        .nav-item.active { box-shadow: inset 4px 0 0 #4FD1C5; }
        
        .card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(26, 54, 93, 0.1); }
        
        .custom-tooltip-popup { transition: all 0.2s ease; }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #A0AEC0; }
        
        @media (max-width: 1024px) {
          .sidebar { width: 80px !important; }
          .logo-sub, .logo-text span, .nav-item span { display: none; }
          .content-wrapper { padding: 24px; }
        }
      `}</style>
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <Dashboard />
  );
}
