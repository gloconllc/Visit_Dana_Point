/**
 * VISIT DANA POINT STRATEGIC DASHBOARD
 * 
 * Copyright © 2025 Visit Dana Point
 * Dashboard Technology & Code Protected by GloCon Solutions LLC
 * All Rights Reserved.
 * 
 * Unauthorized copying, modification, or distribution of this code is strictly prohibited.
 */

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- ICONS (SVG) ---
const Icons = {
  Pulse: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  Hotel: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-8a2 2 0 012-2h4a2 2 0 012 2v8"/></svg>,
  Money: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  Growth: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  Digital: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  Event: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Strategy: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  Protected: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Info: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Image: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Refresh: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
};

// --- DATA ---
const TOOLTIPS = {
  OCCUPANCY: "Percentage of hotel rooms sold. Higher occupancy generates more tax revenue (TOT) for the City to fund services like parks and safety. (Source: STR)",
  ADR: "Average Daily Rate (Price per room). VDP markets to high-value visitors to increase this rate, boosting partner revenue without adding congestion. (Source: STR)",
  REVPAR: "Revenue Per Available Room. The best single measure of hotel health. Calculated by multiplying Occupancy by ADR. (Source: STR)",
  DAY_TRIPPER: "Visitors who do not stay overnight. VDP's goal is to convert them into overnight guests to generate tax revenue. (Source: Datafy)",
  REPEAT_VISITOR: "Percentage of visitors returning to Dana Point within 12 months. Proves destination brand strength. (Source: Datafy)",
  WEB_CONVERSION: "Percentage of VDP website visitors who click 'Book Now'. Measures how well our marketing drives real sales leads. (Source: GA4)",
  TOT: "Transient Occupancy Tax (10%). A tax on overnight guests that goes directly to the City budget. VDP marketing fills the rooms that pay this tax. (Source: City Finance)",
  JOBS: "Estimated local employment supported by tourism spending. Based on industry multipliers (approx $90k spend = 1 job). (Source: Dean Runyan/Calculated)",
  SPEND_IMPACT: "Total direct spending by visitors at local businesses. This revenue supports shops, restaurants, and jobs. (Source: Datafy)",
  PARTNER_REV: "Gross room revenue generated for hotel partners. VDP's primary commercial goal is to grow this number. (Source: STR)",
  MARKET_VISITORS: "Growth in visitors from our top feeder markets (like LA) directly attributed to VDP campaigns. (Source: Datafy)"
};

// --- VETTED DATA UPDATES ---
// Ref: Honest Data Vetting Analysis
// ROI reduced from $89.5-169.5M to $31.8M-$84M (47x-124x)
// Day-tripper conversion impact reduced from $75-150M to $29.5M-$78.8M
// Tax revenue framed as "Estimated Impact"

const executiveData = {
  pulse: {
    kpis: [
      { label: 'Partner Hotel Occupancy', value: '64.2%', trend: '-5.8 pts', status: 'yellow', sub: 'Target 70%', tooltip: TOOLTIPS.OCCUPANCY, source: 'STR' },
      { label: 'Visitor Spending Driven by VDP', value: '$481M', trend: '+$204M', status: 'green', sub: 'On Track', tooltip: TOOLTIPS.SPEND_IMPACT, source: 'Datafy' },
      { label: 'Partner Hotel Revenue', value: '$65.6M', trend: '+$9.8M', status: 'green', sub: 'On Track', tooltip: TOOLTIPS.PARTNER_REV, source: 'STR' },
      { label: 'LA Market Visitors', value: '+17.1%', trend: 'Growth', status: 'green', sub: 'Target 17.5%', tooltip: TOOLTIPS.MARKET_VISITORS, source: 'Datafy' },
    ],
    headline: {
      text: "VETTED INSIGHT: Visit Dana Point's marketing drives PREMIUM pricing (RevPAR 13% > OC), but OCCUPANCY lags peers. Our initiatives target a $7.4M revenue opportunity for hotel partners. CONVERSION SCENARIO: Converting 10-20% of day-trippers could add $29.5M-$78.8M to the local economy (Conservative Estimate).",
      updated: "Dec 10, 2025"
    },
    actions: [
      { title: "OCCUPANCY GAP CLOSURE", impact: "$7.4M", desc: "Drive midweek demand via VDP packages." },
      { title: "DAY-TRIPPER CONVERSION", impact: "$29.5M+", desc: "Launch 'Weekend Escape' campaign Q1 (Conservative)." },
      { title: "WINTER EVENT DEVELOPMENT", impact: "$2-3M", desc: "VDP investment in Winter Wellness Festival." }
    ]
  },
  hospitality: {
    occupancyTrend: [61.2, 62.1, 63.4, 63.8, 65.2, 67.1, 70.3, 69.8, 66.5, 64.2, 62.8, 61.5], // Jan-Dec
    benchmarks: [
      { name: 'Newport/DP Submarket', value: 133.0, label: '133.0 Index', color: '#CBD5E0' },
      { name: 'Visit Dana Point', value: 112.9, label: '112.9 Index', color: '#006B76' }, // VDP Teal
      { name: 'Orange County Avg', value: 100.0, label: '100.0 Index', color: '#A0AEC0' },
      { name: 'National Avg', value: 83.8, label: '83.8 Index', color: '#718096' },
    ],
    revenueWaterfall: [
      { month: 'Jan', val: 5.1 }, { month: 'Feb', val: 5.3 }, { month: 'Mar', val: 5.6 },
      { month: 'Apr', val: 5.7 }, { month: 'May', val: 6.0 }, { month: 'Jun', val: 6.3 },
      { month: 'Jul', val: 6.8 }, { month: 'Aug', val: 6.7 }, { month: 'Sep', val: 6.2 },
      { month: 'Oct', val: 5.8 }, { month: 'Nov', val: 5.6 }, { month: 'Dec', val: 5.5 }
    ],
    propertyClass: [
      { name: 'Luxury', occ: '68.1%', adr: '$542', revpar: '$369', growth: '+8.2%' },
      { name: 'Upper Upscale', occ: '66.3%', adr: '$312', revpar: '$207', growth: '+4.1%' },
      { name: 'Upscale', occ: '61.2%', adr: '$198', revpar: '$121', growth: '+9.3%' },
      { name: 'Midscale', occ: '58.9%', adr: '$89', revpar: '$52', growth: '+3.1%' },
    ]
  },
  economics: {
    spend: 481,
    target: 685,
    categories: [
      { name: 'Accommodations', val: 205, pct: 42.6 },
      { name: 'Dining & Nightlife', val: 112, pct: 23.2 },
      { name: 'Grocery & Dept', val: 53, pct: 11.0 },
      { name: 'Specialty Retail', val: 34, pct: 7.1 },
    ],
    scenarios: [
      { label: 'Current (85.6% Day)', spend: 287, gain: 0 },
      { label: '10% Conversion', spend: 316.5, gain: 29.5 },
      { label: '20% Conversion', spend: 365.8, gain: 78.8 },
      { label: 'Max Potential', spend: 400, gain: 113 },
    ]
  },
  growth: {
    markets: [
      { name: 'Los Angeles', share: 32.7, val: '750k', growth: '+18.9%' },
      { name: 'San Diego', share: 13.8, val: '317k', growth: '+12.3%' },
      { name: 'Phoenix', share: 13.5, val: '310k', growth: '+14.1%' },
      { name: 'SF Bay Area', share: 8.3, val: '191k', growth: '+9.8%' },
    ],
    demographics: [
      { label: 'Income $100k+', value: '60.8%' },
      { label: 'Income $150k+', value: '46.8%' },
      { label: 'Age 45-64', value: '39.6%' },
      { label: 'Age 65+', value: '25.4%' },
    ],
    growthTrend: [
      { year: '2024', val: 1.96 },
      { year: '2025', val: 2.29 },
      { year: '2026 Target', val: 2.69 },
    ]
  },
  digital: {
    funnel: [
      { stage: 'Site Visitors', count: 207600, rate: '100%', note: 'Mobile: 58%' },
      { stage: 'Engaged', count: 152831, rate: '73.8%', note: '2+ mins' },
      { stage: 'Activity Interest', count: 98280, rate: '47.4%', note: 'Trolley/Events' },
      { stage: 'Lodging Interest', count: 2076, rate: '1.0%', alert: true, note: 'CRITICAL GAP', tooltip: TOOLTIPS.WEB_CONVERSION },
      { stage: 'Est. Booked', count: 1038, rate: '0.5%', note: '$2.1M Direct' },
    ],
    sources: [
      // x: volume, y: engagement, z: revenue/size
      { name: 'Google Organic', x: 85, y: 74, z: 45, color: '#4299E1' },
      { name: 'Direct', x: 25, y: 75, z: 12, color: '#9F7AEA' },
      { name: 'Bing', x: 10, y: 78, z: 5, color: '#48BB78' },
      { name: 'Display', x: 12, y: 70, z: 8, color: '#ED8936' },
      { name: 'Paid Search', x: 8, y: 72, z: 6, color: '#F56565' },
    ],
    pages: [
      { name: 'Home', views: 73449 },
      { name: 'Trolley', views: 28158 },
      { name: 'Concerts', views: 24996 },
      { name: 'Events', views: 23203 },
      { name: 'Lodging', views: 2076, alert: true },
    ]
  },
  events: {
    ohana: [
      { year: 2021, att: 42.4, spend: 157 },
      { year: 2022, att: 45.0, spend: 186 },
      { year: 2023, att: 43.5, spend: 190 },
      { year: 2024, att: 45.0, spend: 219 },
      { year: 2025, att: 45.0, spend: 210 },
    ],
    seasonality: [ // Monthly spend M$
      4.0, 4.0, 4.4, 4.9, 6.0, 6.5, 6.9, 6.8, 6.2, 5.2, 4.5, 4.8
    ],
    gapAnalysis: { peak: 6.9, low: 4.0, gap: 3.1 }
  },
  strategic: {
    scorecard: [
      { name: 'Grow Spending', current: '$481M', target: '$685M', status: 'yellow', source: 'Datafy' },
      { name: 'Occupancy Gap', current: '64.2%', target: '70.0%', status: 'yellow', tooltip: TOOLTIPS.OCCUPANCY, source: 'STR' },
      { name: 'Web Conversion', current: '1.0%', target: '5.0%', status: 'red', tooltip: TOOLTIPS.WEB_CONVERSION, source: 'GA4' },
      { name: 'Winter Events', current: 'None', target: '3 Events', status: 'yellow', source: 'Project Mgmt' },
    ],
    initiatives: [
      { name: 'Website Booking Fix', status: 'Urgent', owner: 'Digital Dir', roi: '$5-9M' },
      { name: 'Day-Tripper Campaign', status: 'Planned', owner: 'Marketing', roi: '$29.5-79M' },
      { name: 'Winter Wellness Fest', status: 'Budgeting', owner: 'Events Mgr', roi: '$5.5M' },
      { name: 'Loyalty Program', status: 'Design', owner: 'CRM Mgr', roi: '$4-5M' },
    ]
  }
};

const glossaryTerms = [
  { term: "ADR (Average Daily Rate)", def: "The average price paid for each hotel room sold. High ADR indicates VDP is attracting high-value visitors, not just bargain hunters.", source: "STR STAR Report" },
  { term: "DMO (Destination Marketing Organization)", def: "Visit Dana Point. We are the non-profit responsible for driving visitor demand. We are separate from the City government.", source: "Destinations International" },
  { term: "Occupancy %", def: "The percentage of available hotel rooms that were sold. This is the primary measure of how well VDP marketing generates demand.", source: "STR STAR Report" },
  { term: "RevPAR (Revenue Per Available Room)", def: "Total room revenue divided by total available rooms. This is the gold standard for measuring hotel financial success.", source: "STR STAR Report" },
  { term: "TOT (Transient Occupancy Tax)", def: "10% tax collected by the City from hotel guests. VDP marketing fills the rooms that generate this revenue for City services.", source: "City Municipal Code" },
  { term: "Visitor Spending", def: "Estimated total direct spending by visitors at local businesses (hotels, dining, retail). Supports local jobs.", source: "Datafy" },
  { term: "Day-Tripper", def: "Visitors who come for the day but don't stay overnight. VDP campaigns target converting them into overnight guests.", source: "Datafy Geolocation" },
  { term: "Website Hotel Conversion", def: "The percentage of 'Visit Dana Point' website visitors who click 'Book Now'. A key measure of marketing effectiveness.", source: "Google Analytics 4" },
];

// --- COMPONENTS ---

const Tooltip = ({ text }) => {
  if (!text) return null;
  return (
    <span className="tooltip-icon">
      ?
      <span className="tooltip-content">{text}</span>
    </span>
  );
};

const TopBanner = () => (
  <div style={{ background: '#1A365D', color: 'white', padding: '16px 40px', borderBottom: '1px solid #2A4365', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <div style={{ fontWeight: '700', fontSize: '1.2rem', letterSpacing: '0.02em', color: '#fff' }}>
        VISIT DANA POINT <span style={{color: '#4FD1C5', fontWeight: '400', fontSize: '1rem', marginLeft: '8px'}}>| Marketing Results & Destination Impact</span>
      </div>
      <div style={{ fontSize: '0.75rem', color: '#A0AEC0', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '4px' }}>
        Next Review: <strong style={{color: 'white'}}>Jan 15, 2026</strong>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '32px', fontSize: '0.9rem', color: '#E2E8F0', fontWeight: '500', alignItems: 'center' }}>
      <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
        <span style={{fontSize:'1.1rem'}}>💰</span> 
        <span><strong style={{color: '#4FD1C5'}}>$481M</strong> spending</span>
      </div>
      <div style={{width:'1px', height:'16px', background:'#2A4365'}}></div>
      <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
        <span style={{fontSize:'1.1rem'}}>👥</span>
        <span><strong style={{color: '#4FD1C5'}}>2.3M</strong> trips</span>
      </div>
      <div style={{width:'1px', height:'16px', background:'#2A4365'}}></div>
      <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
        <span style={{fontSize:'1.1rem'}}>🏨</span>
        <span><strong style={{color: '#4FD1C5'}}>$65.6M</strong> partner revenue</span>
      </div>
      <div style={{width:'1px', height:'16px', background:'#2A4365'}}></div>
      <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
        <span style={{fontSize:'1.1rem'}}>📈</span>
        <span><strong style={{color: '#4FD1C5'}}>64.2%</strong> occupancy</span>
      </div>
    </div>
  </div>
);

const Footer = () => (
  <div className="app-footer">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px', color: '#2D3748', fontWeight: '600' }}>
      <Icons.Protected />
      <span>Protected by GloCon Solutions LLC</span>
    </div>
    <div>&copy; 2025 Visit Dana Point. All Rights Reserved.</div>
    <div style={{ marginTop: '4px', fontSize: '0.7rem', color: '#A0AEC0' }}>Confidential & Proprietary Data</div>
  </div>
);

const KPICard: React.FC<{data: any}> = ({ data }) => {
  const isGreen = data.status === 'green';
  const isRed = data.status === 'red';
  const color = isGreen ? '#38A169' : isRed ? '#E53E3E' : '#D69E2E';
  
  return (
    <div className="card" style={{ borderTop: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '8px', border: 'none', padding: 0 }}>
          {data.label}
          {data.tooltip && <Tooltip text={data.tooltip} />}
        </h3>
        {data.source && <span className="source-label" style={{ marginTop: 0 }}>Src: {data.source}</span>}
      </div>
      <div className="kpi-value">{data.value}</div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px', gap: '8px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: color }}>{data.trend}</span>
        <span style={{ fontSize: '0.75rem', color: '#A0AEC0' }}>{data.sub}</span>
      </div>
    </div>
  );
};

const DmoImpactPanel = () => {
  const revenue = 65.6; // Million
  const totRate = 0.10;
  const totGenerated = (revenue * totRate).toFixed(1);
  const jobsSupported = "2,400"; // Updated based on honest data industry estimate
  
  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, #006B76 0%, #004E56 100%)', color: 'white', border: 'none', marginBottom: '24px', boxShadow: '0 10px 15px -3px rgba(0, 107, 118, 0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
        <h3 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', border: 'none', padding: 0 }}>
          Visit Dana Point DMO Impact
        </h3>
        <span style={{ fontSize: '0.7rem', opacity: 0.9, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '4px', fontWeight: '600' }}>VDP Attributed</span>
      </div>
      <div className="grid-3">
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.9rem', color: '#81E6D9', marginBottom: '8px', fontWeight: 'bold' }}>
            Estimated Tax Impact
            <Tooltip text={TOOLTIPS.TOT} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>${totGenerated}M</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>Calculated from Hotel Revenue (10% TOT)</div>
          <div className="source-label" style={{color: 'rgba(255,255,255,0.5)', textAlign: 'left', marginTop: '8px'}}>Source: City Finance / Municipal Code</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.9rem', color: '#81E6D9', marginBottom: '8px', fontWeight: 'bold' }}>
            Jobs Supported
            <Tooltip text={TOOLTIPS.JOBS} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{jobsSupported}</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>Estimated via Industry Multipliers</div>
          <div className="source-label" style={{color: 'rgba(255,255,255,0.5)', textAlign: 'left', marginTop: '8px'}}>Source: Bureau of Labor Statistics</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.9rem', color: '#81E6D9', marginBottom: '8px', fontWeight: 'bold' }}>
            Visitor Spending vs. City Budget
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>~11x</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>Visitor Spend ($481M) vs City Budget (~$44M)</div>
          <div className="source-label" style={{color: 'rgba(255,255,255,0.5)', textAlign: 'left', marginTop: '8px'}}>Source: City Annual Budget Report</div>
        </div>
      </div>
    </div>
  );
};

const HeadlineInsight = ({ headline }) => (
  <div className="card" style={{ background: '#2D3748', color: 'white', border: 'none', borderLeft: '6px solid #F6AD55' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
      <h3 style={{ color: '#F6AD55', margin: 0, border: 'none', padding: 0 }}>📊 STRATEGIC HEADLINE</h3>
      <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>Updated: {headline.updated}</span>
    </div>
    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', margin: 0, fontWeight: '400', color: '#E2E8F0' }}>
      {headline.text}
    </p>
  </div>
);

// Formats text by parsing bold markdown syntax **text**
const parseBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} style={{fontWeight: '700', color: '#2D3748'}}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const LiveIntelligenceCard = () => {
  const [insight, setInsight] = useState<{ text: string; chunks: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchIntel = async () => {
      setLoading(true);
      setError(false);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: 'Perform a targeted search for the latest hospitality industry news and tourism data relevant to Dana Point, CA. You MUST prioritize information from: CoStar, Tourism Economics, Destinations International, Brand USA, Visit California, and State of California sources. Summarize 3-4 key trends, reports, or economic indicators that impact the local hotel and tourism market. Format strictly as a bulleted list.',
          config: {
            tools: [{ googleSearch: {} }]
          }
        });
        
        setInsight({
            text: response.text,
            chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
        });
      } catch (e) {
        console.error("AI Fetch Error", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchIntel();
  }, []);

  if (error) return null;

  return (
    <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
            <h3 style={{ color: '#276749', margin: 0, border: 'none', padding: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icons.Strategy /> HOSPITALITY & MARKET INTELLIGENCE RADAR
            </h3>
            <button 
              onClick={fetchIntel} 
              disabled={loading}
              style={{
                background: 'transparent',
                border: '1px solid #C6F6D5',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: '#276749',
                fontWeight: '600'
              }}
            >
              <Icons.Refresh /> {loading ? 'Scanning...' : 'Refresh Intelligence'}
            </button>
        </div>

        {/* Targeted Sources Indicator */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
             {['CoStar', 'Tourism Economics', 'Destinations Intl', 'Brand USA', 'Visit California', 'State Data'].map(src => (
                 <span key={src} style={{fontSize: '0.65rem', background: '#E6FFFA', color: '#234E52', padding: '2px 8px', borderRadius: '12px', border: '1px solid #B2F5EA', fontWeight: '600'}}>
                    {src}
                 </span>
             ))}
        </div>
        
        {loading ? (
             <div style={{ padding: '20px', textAlign: 'center', color: '#4A5568', fontStyle: 'italic', fontSize: '0.9rem', background: '#F7FAFC', borderRadius: '8px' }}>
                 Scanning industry reports and local data sources...
             </div>
        ) : (
            <>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4A5568' }}>
                    {insight?.text.split('\n').map((line, i) => {
                        const cleanLine = line.trim();
                        if (!cleanLine) return null;
                        
                        // Check for bullet points/lists
                        const isList = cleanLine.startsWith('* ') || cleanLine.startsWith('- ') || cleanLine.startsWith('• ');
                        const content = isList ? cleanLine.substring(1).trim() : cleanLine;

                        return (
                            <div key={i} style={{ marginBottom: '8px', display: isList ? 'flex' : 'block', gap: '8px' }}>
                                {isList && <span style={{color:'#38A169', marginTop:'2px', flexShrink: 0}}>●</span>}
                                <div>{parseBold(content)}</div>
                            </div>
                        );
                    })}
                </div>
                {insight?.chunks && insight.chunks.length > 0 && (
                    <div style={{ marginTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '8px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#718096', marginBottom: '4px', fontWeight: 'bold' }}>VERIFIED SOURCES:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {insight.chunks.map((chunk, i) => {
                                if (chunk.web?.uri) {
                                    return (
                                        <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" 
                                           style={{ fontSize: '0.7rem', color: '#3182CE', textDecoration: 'none', background: 'white', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                                            {chunk.web.title || 'Source ' + (i + 1)}
                                        </a>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                )}
            </>
        )}
    </div>
  );
};

const ActionItems = ({ actions }) => (
  <div className="card">
    <h3 style={{ color: '#E53E3E', borderBottomColor: '#FED7D7' }}>🎯 CRITICAL ACTION ITEMS</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {actions.map((action, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < actions.length -1 ? '16px' : 0, borderBottom: i < actions.length -1 ? '1px dashed #E2E8F0' : 'none' }}>
          <div>
            <div style={{ fontWeight: '700', color: '#2D3748', fontSize: '0.95rem' }}>{action.title}</div>
            <div style={{ fontSize: '0.85rem', color: '#718096', marginTop: '2px' }}>{action.desc}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
             <div style={{ fontSize: '0.7rem', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Impact</div>
             <div style={{ fontWeight: 'bold', color: '#38A169', fontSize: '1rem' }}>{action.impact}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TrendChart = ({ data, target }) => {
  const max = 80; const min = 50; const range = max - min;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  const targetY = 100 - ((target - min) / range) * 100;

  return (
    <div style={{ height: '200px', width: '100%', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{overflow: 'visible'}}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#EDF2F7" strokeWidth="0.5" />)}
        {/* Target Band */}
        <rect x="0" y="0" width="100" height={targetY} fill="#F0FFF4" />
        <line x1="0" y1={targetY} x2="100" y2={targetY} stroke="#48BB78" strokeWidth="0.5" strokeDasharray="3,3" />
        {/* Forecast area */}
        <rect x="85" y="0" width="15" height="100" fill="#EBF8FF" opacity="0.3" />
        
        {/* Main Line */}
        <polyline points={points} fill="none" stroke="#006B76" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Data Points */}
        {data.map((val, i) => {
           const x = (i / (data.length - 1)) * 100;
           const y = 100 - ((val - min) / range) * 100;
           return (
             <g key={i}>
               <circle cx={x} cy={y} r="2.5" fill={i > 9 ? "white" : "#006B76"} stroke="#006B76" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
             </g>
           )
        })}
      </svg>
      <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.7rem', color: '#3182ce', fontStyle: 'italic', background: 'white', padding: '2px 6px', borderRadius: '4px' }}>Forecast →</div>
      <div style={{ position: 'absolute', top: `${targetY}%`, right: '0', transform: 'translateY(-100%)', fontSize: '0.7rem', color: '#48BB78', fontWeight: 'bold', background: '#F0FFF4', padding: '2px 4px', borderRadius: '4px' }}>Target {target}%</div>
      <div className="source-label" style={{ position: 'absolute', bottom: '-20px', right: 0 }}>Source: STR</div>
    </div>
  );
};

const BenchmarkChart = ({ items }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    {items.map((item, i) => (
      <div key={i}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
          <span style={{ fontWeight: item.name === 'Visit Dana Point' ? '700' : '400', color: item.name === 'Visit Dana Point' ? '#006B76' : '#4A5568' }}>{item.name}</span>
          <span style={{ fontWeight: '700', color: '#2D3748' }}>{item.label}</span>
        </div>
        <div style={{ height: '16px', background: '#EDF2F7', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: `${(item.value / 150) * 100}%`, height: '100%', background: item.color, borderRadius: '8px' }} />
          {item.name === 'Orange County Avg' && (
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${(100/150)*100}%`, borderLeft: '2px dashed #718096', zIndex: 2 }} />
          )}
        </div>
      </div>
    ))}
    <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#718096', marginTop: '8px' }}>100 = Market Average (Orange County)</div>
    <div className="source-label">Source: CoStar Market Report</div>
  </div>
);

const WaterfallChart = ({ data }) => {
  const max = 75; // Target is 75.4
  let currentTotal = 0;
  
  return (
    <div style={{position: 'relative'}}>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '220px', gap: '6px', paddingTop: '20px', paddingBottom: '10px' }}>
        {data.map((d, i) => {
          currentTotal += d.val;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', background: i===6 ? '#38A169' : '#3182CE', borderRadius: '4px', height: `${(d.val / 8) * 100}%`, minHeight: '1px', opacity: 0.8 }} />
              <div style={{ fontSize: '0.7rem', marginTop: '6px', color: '#718096' }}>{d.month}</div>
            </div>
          )
        })}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '12px' }}>
          <div style={{ width: '100%', background: '#1A365D', borderRadius: '4px', height: `${(65.6 / 75.4) * 100}%` }} />
          <div style={{ fontSize: '0.7rem', marginTop: '6px', fontWeight: 'bold' }}>Total</div>
        </div>
      </div>
      <div className="source-label" style={{textAlign: 'right'}}>Source: STR</div>
    </div>
  );
};

const ScenarioSlider = () => {
  const [conversion, setConversion] = useState(0);
  const baseSpend = 287; // M
  
  // Vetted calc: ~2.95M gain per 1% conversion based on $29.5M for 10%
  const gainPer1Pct = 2.95; 
  const currentGain = conversion * gainPer1Pct;
  const total = baseSpend + currentGain;

  return (
    <div style={{ padding: '24px', background: '#F7FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h4 style={{ margin: '0 0 4px 0', color: '#2D3748', fontSize: '1.1rem' }}>
            Day-Tripper Conversion Model (Vetted)
            <Tooltip text={TOOLTIPS.DAY_TRIPPER} />
          </h4>
          <div style={{ fontSize: '0.9rem', color: '#718096' }}>Current: 85.6% Day / 14.4% Overnight</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Est. New Spending</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#38A169' }}>+${currentGain.toFixed(1)}M</div>
        </div>
      </div>
      
      <input 
        type="range" min="0" max="20" step="5" 
        value={conversion} onChange={(e) => setConversion(parseInt(e.target.value))}
        style={{ width: '100%', cursor: 'pointer', accentColor: '#006B76', marginBottom: '16px', height: '6px', borderRadius: '3px' }} 
      />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#4A5568', fontWeight: '600' }}>
        <span>Current (0%)</span>
        <span>5%</span>
        <span>Target (10%)</span>
        <span>15%</span>
        <span>Max (20%)</span>
      </div>

      <div style={{ marginTop: '24px', padding: '16px', background: '#E6FFFA', borderRadius: '8px', borderLeft: '4px solid #38A169' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#234E52', lineHeight: '1.5' }}>
          <strong>Vetted Insight:</strong> Converting <strong>{conversion || '10'}%</strong> of day-trippers to overnight guests could generate <strong>${conversion ? currentGain.toFixed(1) : '29.5'}M</strong> in new revenue. This is a conservative estimate based on current ADR.
        </p>
      </div>
      <div className="source-label" style={{textAlign: 'right', marginTop: '8px'}}>Source: Datafy + Economic Impact Model</div>
    </div>
  );
};

const BubbleChart = ({ data }) => {
  // X: Volume (0-200k), Y: Engagement (60-80), Z: Size
  return (
    <div style={{ height: '240px', position: 'relative', borderLeft: '1px solid #CBD5E0', borderBottom: '1px solid #CBD5E0', margin: '20px 0 20px 20px' }}>
      {data.map((d, i) => {
        const left = (d.x / 180) * 100; // max volume approx 180k
        const bottom = ((d.y - 65) / 15) * 100; // engagement 65-80
        const size = Math.max(20, d.z * 1.5); 
        return (
          <div key={i} style={{ 
            position: 'absolute', left: `${left}%`, bottom: `${bottom}%`, 
            width: size, height: size, borderRadius: '50%', background: d.color, opacity: 0.8,
            transform: 'translate(-50%, 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.15)', color: 'white', fontSize: '0.65rem', textAlign: 'center', fontWeight: '600',
            border: '1px solid rgba(255,255,255,0.5)'
          }} title={`${d.name}: ${d.x}k sessions`}>
            {size > 30 && d.name.split(' ')[0]}
          </div>
        )
      })}
      <div style={{ position: 'absolute', bottom: '-30px', width: '100%', textAlign: 'center', fontSize: '0.75rem', color: '#718096' }}>Volume (Sessions) →</div>
      <div style={{ position: 'absolute', left: '-35px', bottom: '0', width: '200px', transform: 'rotate(-90deg)', transformOrigin: '0 100%', textAlign: 'center', fontSize: '0.75rem', color: '#718096' }}>Engagement Rate % →</div>
      <div className="source-label" style={{position: 'absolute', bottom: '-45px', right: 0}}>Source: GA4</div>
    </div>
  )
};

const HeatMap = ({ data }) => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const max = Math.max(...data);
  const min = Math.min(...data);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '6px' }}>
        {data.map((val, i) => {
          const intensity = (val - min) / (max - min);
          let bg = intensity < 0.3 ? '#FEFCBF' : intensity < 0.7 ? '#FBD38D' : '#F6AD55'; 
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
               <div style={{ width: '100%', height: '48px', background: bg, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', color: '#2D3748' }}>
                  ${val.toFixed(1)}
                </div>
               <span style={{ fontSize: '0.7rem', color: '#718096' }}>{months[i]}</span>
            </div>
          )
        })}
      </div>
      <div className="source-label" style={{textAlign: 'right', marginTop: '8px'}}>Source: Datafy</div>
    </div>
  )
};

const FunnelChart = ({ stages }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    {stages.map((stage, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '130px', fontSize: '0.85rem', fontWeight: stage.alert ? '700' : '500', color: stage.alert ? '#E53E3E' : '#2D3748' }}>
          {stage.stage} {stage.alert && '⚠️'}
        </div>
        <div style={{ flex: 1, height: '32px', background: '#EDF2F7', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ 
            width: parseFloat(stage.rate) < 2 ? '5px' : `${parseFloat(stage.rate)}%`, 
            height: '100%', 
            background: stage.alert ? '#E53E3E' : '#006B76',
            opacity: 1 - (i * 0.1)
          }} />
          <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: '#4A5568' }}>{stage.note}</div>
        </div>
        <div style={{ width: '80px', textAlign: 'right', fontWeight: 'bold' }}>{stage.count.toLocaleString()}</div>
        <div style={{ width: '50px', textAlign: 'right', fontSize: '0.85rem', color: '#718096' }}>{stage.rate}</div>
        {stage.tooltip && <Tooltip text={stage.tooltip} />}
      </div>
    ))}
    <div className="source-label" style={{textAlign: 'right'}}>Source: GA4</div>
  </div>
);

const VisualIntelligenceTab = () => {
    const [prompt, setPrompt] = useState('');
    const [size, setSize] = useState('1K');
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    
    // Enhanced Controls State
    const [selectedInitiative, setSelectedInitiative] = useState('');
    const [style, setStyle] = useState('Photorealistic');
    const [lighting, setLighting] = useState('Natural Light');
    const [camera, setCamera] = useState('Eye Level');

    const handleInitiativeChange = (e) => {
        const name = e.target.value;
        setSelectedInitiative(name);
        if (name) {
            const init = executiveData.strategic.initiatives.find(i => i.name === name);
            let context = "";
            if (init.name === 'Website Booking Fix') {
                context = "Show a modern, sleek website interface on a mobile device showing a completed hotel booking confirmation for a luxury Dana Point resort. High conversion, clean UX.";
            } else if (init.name === 'Day-Tripper Campaign') {
                context = "A vibrant lifestyle shot of a young couple checking into a boutique hotel in Dana Point at sunset, transitioning from day-trip to overnight stay. Warm, inviting atmosphere.";
            } else if (init.name === 'Winter Wellness Fest') {
                context = "A serene outdoor yoga session overlooking the Dana Point ocean cliffs during winter, sunny but crisp, wellness festival atmosphere, healthy and active.";
            } else if (init.name === 'Loyalty Program') {
                context = "A premium loyalty card or mobile app screen showing 'Visit Dana Point Rewards' with exclusive perks, gold and teal color palette, feeling of exclusivity.";
            } else {
                 context = `Visual representation of the '${init.name}' initiative, aiming for an ROI of ${init.roi}. Professional business context.`;
            }
            setPrompt(context);
        }
    };

    const generateImage = async () => {
        if (!prompt) return;
        setLoading(true);
        setImageUrl(null);
        
        // Construct enhanced prompt
        const enhancedPrompt = `${prompt} \n\nStyle Attributes: ${style} style, ${lighting} lighting, ${camera} view. High resolution, professional commercial photography.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: {
                    parts: [{ text: enhancedPrompt }]
                },
                config: {
                    imageConfig: {
                        imageSize: size,
                        aspectRatio: "16:9" 
                    }
                }
            });

            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
                    break;
                }
            }
        } catch (e) {
            console.error(e);
            alert("Image generation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = (format) => {
        if (!imageUrl) return;
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const link = document.createElement('a');
            link.download = `vdp-visual-${Date.now()}.${format.toLowerCase()}`;
            link.href = canvas.toDataURL(`image/${format === 'JPG' ? 'jpeg' : 'png'}`, 0.9);
            link.click();
        };
    };

    const shareImage = async () => {
        if (!imageUrl) return;
        try {
            const res = await fetch(imageUrl);
            const blob = await res.blob();
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            alert("Image copied to clipboard!");
        } catch (e) {
            alert("Unable to copy to clipboard.");
        }
    };

    return (
        <div className="tab-content fade-in">
            <div className="card">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #E2E8F0', paddingBottom:'16px', marginBottom:'20px'}}>
                   <div>
                       <h3 style={{margin:0, color:'#1A365D'}}>Visual Intelligence Studio</h3>
                       <p style={{margin:'4px 0 0 0', color:'#718096', fontSize:'0.9rem'}}>Create vetted, on-brand visualizations of visitor personas and data stories.</p>
                   </div>
                   <div className="badge badge-green">Gemini 3 Pro</div>
                </div>

                <div className="grid-2">
                    <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                        
                        {/* Initiative Selector */}
                        <div>
                            <label style={{fontSize:'0.85rem', fontWeight:'bold', color:'#2D3748', display:'block', marginBottom:'8px'}}>Strategic Context (Optional)</label>
                            <select 
                                value={selectedInitiative} 
                                onChange={handleInitiativeChange}
                                style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #CBD5E0', background:'white', color: '#2D3748'}}
                            >
                                <option value="">Select an Initiative...</option>
                                {executiveData.strategic.initiatives.map((init, i) => (
                                    <option key={i} value={init.name}>{init.name} (ROI: {init.roi})</option>
                                ))}
                            </select>
                        </div>

                        {/* Prompt */}
                        <div>
                            <label style={{fontSize:'0.85rem', fontWeight:'bold', color:'#2D3748', display:'block', marginBottom:'8px'}}>Visual Prompt</label>
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the visualization..."
                                style={{width:'100%', height:'100px', padding:'12px', borderRadius:'8px', border:'1px solid #CBD5E0', fontFamily:'inherit', resize:'none'}}
                            />
                        </div>

                        {/* Style Controls */}
                        <div className="grid-2" style={{gap: '12px'}}>
                             <div>
                                <label style={{fontSize:'0.75rem', fontWeight:'bold', color:'#718096', marginBottom:'4px', display:'block'}}>Style</label>
                                <select value={style} onChange={(e)=>setStyle(e.target.value)} style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #CBD5E0'}}>
                                    <option>Photorealistic</option>
                                    <option>Vector Art</option>
                                    <option>Infographic</option>
                                    <option>Cinematic</option>
                                </select>
                             </div>
                             <div>
                                <label style={{fontSize:'0.75rem', fontWeight:'bold', color:'#718096', marginBottom:'4px', display:'block'}}>Lighting</label>
                                <select value={lighting} onChange={(e)=>setLighting(e.target.value)} style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #CBD5E0'}}>
                                    <option>Natural Light</option>
                                    <option>Golden Hour</option>
                                    <option>Studio Lighting</option>
                                    <option>Moody</option>
                                </select>
                             </div>
                             <div>
                                <label style={{fontSize:'0.75rem', fontWeight:'bold', color:'#718096', marginBottom:'4px', display:'block'}}>Camera</label>
                                <select value={camera} onChange={(e)=>setCamera(e.target.value)} style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #CBD5E0'}}>
                                    <option>Eye Level</option>
                                    <option>Wide Angle</option>
                                    <option>Drone / Aerial</option>
                                    <option>Macro / Close-up</option>
                                </select>
                             </div>
                             <div>
                                 <label style={{fontSize:'0.75rem', fontWeight:'bold', color:'#718096', marginBottom:'4px', display:'block'}}>Resolution</label>
                                 <select value={size} onChange={(e)=>setSize(e.target.value)} style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #CBD5E0'}}>
                                     <option value="1K">1K</option>
                                     <option value="2K">2K</option>
                                     <option value="4K">4K</option>
                                 </select>
                             </div>
                        </div>

                        <button 
                            onClick={generateImage}
                            disabled={loading || !prompt}
                            style={{
                                marginTop:'8px',
                                padding:'12px',
                                background: loading ? '#CBD5E0' : '#006B76',
                                color:'white',
                                border:'none',
                                borderRadius:'8px',
                                fontWeight:'bold',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                gap:'8px'
                            }}
                        >
                            {loading ? 'Generating...' : <><span>✨</span> Generate Visualization</>}
                        </button>
                    </div>

                    <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                        <div style={{background:'#F7FAFC', borderRadius:'8px', border:'1px dashed #CBD5E0', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'300px', flex: 1, overflow:'hidden', position:'relative'}}>
                            {imageUrl ? (
                                <img src={imageUrl} alt="Generated Visualization" style={{maxWidth:'100%', borderRadius:'4px', boxShadow:'0 4px 6px rgba(0,0,0,0.1)'}} />
                            ) : (
                                <div style={{textAlign:'center', color:'#A0AEC0'}}>
                                    <div style={{fontSize:'2rem', marginBottom:'8px'}}>🖼️</div>
                                    <div>Preview Area</div>
                                </div>
                            )}
                        </div>
                        
                        {imageUrl && (
                            <div style={{display:'flex', gap:'12px', justifyContent:'flex-end'}}>
                                <button onClick={shareImage} style={{padding:'8px 16px', background:'white', border:'1px solid #CBD5E0', borderRadius:'6px', color:'#2D3748', cursor:'pointer', fontWeight:'600'}}>
                                    Copy to Clipboard
                                </button>
                                <button onClick={() => downloadImage('JPG')} style={{padding:'8px 16px', background:'white', border:'1px solid #CBD5E0', borderRadius:'6px', color:'#2D3748', cursor:'pointer', fontWeight:'600'}}>
                                    Download JPG
                                </button>
                                <button onClick={() => downloadImage('PNG')} style={{padding:'8px 16px', background:'#2D3748', border:'none', borderRadius:'6px', color:'white', cursor:'pointer', fontWeight:'600'}}>
                                    Download PNG
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- TABS ---

const TabPulse = () => (
  <div className="tab-content fade-in">
    <DmoImpactPanel />
    <HeadlineInsight headline={executiveData.pulse.headline} />
    <LiveIntelligenceCard />
    <div className="grid-4" style={{ marginTop: '28px' }}>
      {executiveData.pulse.kpis.map((kpi, i) => <KPICard key={i} data={kpi} />)}
    </div>
    <div className="grid-2" style={{ marginTop: '28px' }}>
      <ActionItems actions={executiveData.pulse.actions} />
      <div className="card">
        <h3 style={{ color: '#D69E2E', borderBottomColor: '#FEFCBF' }}>⚠️ RISK MONITOR</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', color: '#2D3748', lineHeight: '1.8' }}>
          <li>
            <strong>Mobile Experience:</strong> 58% of traffic is mobile, but Calendar page has "browser not supported" warning.
          </li>
          <li>
            <strong>Booking Gap:</strong> Activity pages (47% traffic) do not link to hotel booking engine (1% traffic).
          </li>
          <li>
            <strong>Occupancy Softening:</strong> Oct occupancy (64.2%) dropped from peak July (70.3%).
          </li>
        </ul>
        <div style={{ marginTop: '20px', fontSize: '0.85rem', fontWeight: 'bold', color: '#38A169', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✅</span> STATUS: No Critical Red Flags. All KPIs positive YoY.
        </div>
        <div className="source-label" style={{marginTop: '16px'}}>Source: Internal Audit</div>
      </div>
    </div>
  </div>
);

const TabHospitality = () => (
  <div className="tab-content fade-in">
    <div className="grid-2">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3>
            Occupancy Trend & Forecast
            <Tooltip text={TOOLTIPS.OCCUPANCY} />
          </h3>
          <span className="badge badge-yellow">Target 70%</span>
        </div>
        <TrendChart data={executiveData.hospitality.occupancyTrend} target={70} />
      </div>
      <div className="card">
        <h3>
          RevPAR Performance vs Benchmarks
          <Tooltip text={TOOLTIPS.REVPAR} />
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '20px' }}>VDP commands a premium over the county, but trails the submarket occupancy leaders.</p>
        <BenchmarkChart items={executiveData.hospitality.benchmarks} />
      </div>
    </div>
    
    <div className="grid-2" style={{ marginTop: '28px' }}>
      <div className="card">
        <h3>Monthly Revenue Waterfall</h3>
        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1A365D', marginBottom: '8px' }}>$65.6M <span style={{fontSize: '0.9rem', color: '#718096', fontWeight: '400'}}>YTD Revenue</span></div>
        <WaterfallChart data={executiveData.hospitality.revenueWaterfall} />
      </div>
      <div className="card">
        <h3>Property Class Performance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {executiveData.hospitality.propertyClass.map((cls, i) => (
            <div key={i} style={{ padding: '16px', background: '#F7FAFC', borderRadius: '8px', borderLeft: i === 0 ? '4px solid #006B76' : '4px solid #CBD5E0' }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#2D3748' }}>{cls.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '8px' }}>
                <span style={{color: '#718096'}}>Occ: {cls.occ}</span>
                <span style={{color: '#718096'}}>ADR: {cls.adr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '4px', fontWeight: '600' }}>
                <span>Rev: {cls.revpar}</span>
                <span style={{color: '#38A169'}}>{cls.growth}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="source-label" style={{marginTop: '16px', textAlign: 'right'}}>Source: STR Property Report</div>
      </div>
    </div>
  </div>
);

const TabEconomics = () => (
  <div className="tab-content fade-in">
    <div className="grid-3">
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '12px' }}>Total Visitor Spend</div>
        <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#006B76' }}>${executiveData.economics.spend}M</div>
        <div style={{ width: '100%', height: '8px', background: '#EDF2F7', borderRadius: '4px', margin: '20px 0', position: 'relative' }}>
          <div style={{ width: '70%', height: '100%', background: '#006B76', borderRadius: '4px' }} />
          <div style={{ position: 'absolute', right: '0', top: '-20px', fontSize: '0.75rem', color: '#718096' }}>Target $685M</div>
        </div>
        <div style={{ fontSize: '0.9rem', color: '#38A169', fontWeight: 'bold' }}>+$204M Opportunity</div>
        <div className="source-label" style={{marginTop: '12px'}}>Source: Datafy</div>
      </div>
      
      <div className="card" style={{ gridColumn: 'span 2' }}>
        <ScenarioSlider />
      </div>
    </div>

    <div className="grid-2" style={{ marginTop: '28px' }}>
      <div className="card">
        <h3>Spending by Category</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {executiveData.economics.categories.map((cat, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                <span>{cat.name}</span>
                <span style={{ fontWeight: 'bold' }}>${cat.val}M</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#EDF2F7', borderRadius: '5px' }}>
                <div style={{ width: `${cat.pct}%`, height: '100%', background: i===0 ? '#3182CE' : '#63B3ED', borderRadius: '5px' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="source-label" style={{marginTop: '16px', textAlign: 'right'}}>Source: Datafy Spend Analysis</div>
      </div>
      <div className="card">
        <h3>Strategic Insight: Economics</h3>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#2D3748' }}>
          Accommodations & Dining account for <strong>66%</strong> of all visitor spending. While average spend per visitor is healthy ($160.60), the <strong>Length of Stay</strong> leverage is massive. A shift from 1-day to 2-day stays drives a 3x multiplier on economic impact without needing to acquire new visitors.
        </p>
      </div>
    </div>
  </div>
);

const TabGrowth = () => (
  <div className="tab-content fade-in">
    <div className="grid-2">
      <div className="card">
        <h3>Market Distribution (Top 4)</h3>
        <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '20px' }}>Los Angeles remains the dominant feeder market (33%), with strongest growth.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {executiveData.growth.markets.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '100px', fontWeight: 'bold', fontSize: '0.9rem' }}>{m.name}</div>
              <div style={{ flex: 1, height: '14px', background: '#EDF2F7', borderRadius: '7px' }}>
                <div style={{ width: `${(m.share / 35) * 100}%`, height: '100%', background: i===0 ? '#006B76' : '#4FD1C5', borderRadius: '7px' }} />
              </div>
              <div style={{ width: '60px', textAlign: 'right', fontWeight: 'bold', fontSize: '0.9rem' }}>{m.share}%</div>
              <div style={{ width: '60px', textAlign: 'right', fontSize: '0.85rem', color: '#38A169' }}>{m.growth}</div>
            </div>
          ))}
        </div>
        <div className="source-label" style={{marginTop: '16px', textAlign: 'right'}}>Source: Datafy Visitation</div>
      </div>
      
      <div className="card">
        <h3>Visitor Profile & Demographics</h3>
        <div className="grid-2">
          {executiveData.growth.demographics.map((d, i) => (
             <div key={i} style={{ padding: '20px', border: '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center' }}>
               <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#2D3748' }}>{d.value}</div>
               <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '4px' }}>{d.label}</div>
             </div>
          ))}
        </div>
        <div style={{ marginTop: '28px', padding: '16px', background: '#F7FAFC', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.85rem', color: '#4A5568', fontStyle: 'italic' }}>
            <strong>Targeting Implication:</strong> High-income ($150k+) mature audience (45+) aligns perfectly with luxury/wellness positioning.
          </div>
        </div>
        <div className="source-label" style={{marginTop: '16px', textAlign: 'right'}}>Source: Datafy / GA4 Aggregated</div>
      </div>
    </div>

    <div className="card" style={{ marginTop: '28px' }}>
      <h3>Visitor Growth Tracking</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '32px', height: '140px', paddingTop: '20px' }}>
        {executiveData.growth.growthTrend.map((t, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>{t.val}M</div>
            <div style={{ width: '100%', background: i===2 ? '#EDF2F7' : '#38B2AC', height: `${(t.val/3)*100}%`, borderRadius: '6px 6px 0 0', border: i===2 ? '2px dashed #38B2AC' : 'none' }} />
            <div style={{ fontSize: '0.85rem', marginTop: '12px', color: '#718096' }}>{t.year}</div>
          </div>
        ))}
      </div>
      <div className="source-label" style={{textAlign: 'right'}}>Source: Datafy + Forecast</div>
    </div>
  </div>
);

const TabDigital = () => (
  <div className="tab-content fade-in">
    <div className="grid-2">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>
            Conversion Funnel
            <Tooltip text={TOOLTIPS.WEB_CONVERSION} />
          </h3>
          <span className="badge badge-red">Critical Gap</span>
        </div>
        <FunnelChart stages={executiveData.digital.funnel} />
      </div>
      
      <div className="card">
        <h3>Channel Efficiency Matrix</h3>
        <p style={{ fontSize: '0.85rem', color: '#718096' }}>High volume (Google) vs High engagement (Bing/Direct)</p>
        <BubbleChart data={executiveData.digital.sources} />
      </div>
    </div>

    <div className="grid-2" style={{ marginTop: '28px' }}>
      <div className="card">
        <h3>Mobile Optimization Status</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px', background: '#FFF5F5', borderRadius: '8px', borderLeft: '4px solid #E53E3E' }}>
           <div style={{ fontSize: '2.5rem' }}>📱</div>
           <div>
             <div style={{ fontWeight: 'bold', color: '#C53030', fontSize: '1.1rem' }}>58% Traffic is Mobile</div>
             <div style={{ fontSize: '0.9rem', color: '#2D3748', marginTop: '4px' }}>Calendar page shows "browser not supported" warning. Booking flow takes 6 clicks.</div>
             <div style={{ marginTop: '12px', fontSize: '0.85rem', fontWeight: 'bold', color: '#C53030' }}>PRIORITY FIX: Q1 2026</div>
           </div>
        </div>
        <div className="source-label" style={{marginTop: '16px', textAlign: 'right'}}>Source: GA4 Device Report</div>
      </div>
      <div className="card">
        <h3>Top Content & Opportunities</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
           {executiveData.digital.pages.map((p, i) => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
               <span>{p.name}</span>
               <div style={{ display: 'flex', gap: '16px' }}>
                 <span style={{ fontWeight: 'bold' }}>{p.views.toLocaleString()}</span>
                 {p.alert && <span style={{ color: '#E53E3E', fontWeight: 'bold', fontSize: '0.8rem' }}>⚠️ LOW</span>}
               </div>
             </div>
           ))}
        </div>
        <div style={{ marginTop: '20px', fontSize: '0.85rem', fontStyle: 'italic', color: '#718096', padding: '12px', background: '#F7FAFC', borderRadius: '6px' }}>
           Action: Add "Book Now" CTA to Trolley & Events pages to capture high intent traffic.
        </div>
        <div className="source-label" style={{marginTop: '12px', textAlign: 'right'}}>Source: GA4 Pageviews</div>
      </div>
    </div>
  </div>
);

const TabEvents = () => (
  <div className="tab-content fade-in">
    <div className="grid-2">
      <div className="card">
        <h3>Ohana Fest Impact (5-Year)</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '20px', paddingTop: '20px' }}>
           {executiveData.events.ohana.map((d, i) => (
             <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>${d.spend}</div>
               <div style={{ width: '100%', background: '#B2F5EA', borderRadius: '4px 4px 0 0', flex: 1, position: 'relative' }}>
                 <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${(d.spend / 250) * 100}%`, background: '#006B76', borderRadius: '4px 4px 0 0' }} />
               </div>
               <div style={{ fontSize: '0.8rem', marginTop: '8px' }}>{d.year}</div>
             </div>
           ))}
        </div>
        <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#718096' }}>
          Attendance stable (45k), but per-visitor spend +33% since 2021.
        </div>
        <div className="source-label" style={{textAlign: 'right'}}>Source: Datafy + Internal Report</div>
      </div>

      <div className="card">
        <h3>Seasonality Gap Analysis</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
           <div>Peak: <strong style={{color: '#E53E3E'}}>${executiveData.events.gapAnalysis.peak}M</strong></div>
           <div>Low: <strong style={{color: '#D69E2E'}}>${executiveData.events.gapAnalysis.low}M</strong></div>
           <div>Gap: <strong>${executiveData.events.gapAnalysis.gap}M</strong></div>
        </div>
        <HeatMap data={executiveData.events.seasonality} />
        <div style={{ marginTop: '24px', padding: '16px', background: '#F0FFF4', border: '1px solid #C6F6D5', borderRadius: '8px' }}>
          <strong style={{ color: '#276749', fontSize: '0.9rem' }}>Opportunity: Winter Wellness Festival</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#2F855A' }}>
            Proposed for Jan/Feb. Est Impact: +$2-3M. Reduces seasonal gap by ~50%.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const TabStrategic = () => (
  <div className="tab-content fade-in">
    <div className="card">
      <h3>2026 Strategic Scorecard</h3>
      <div className="grid-4">
        {executiveData.strategic.scorecard.map((item, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '20px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', color: '#718096', textTransform: 'uppercase', marginBottom: '8px' }}>
              {item.name}
              {item.tooltip && <Tooltip text={item.tooltip} />}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>{item.current}</div>
            <div style={{ fontSize: '0.85rem', color: '#718096' }}>Target: {item.target}</div>
            <span className={`badge badge-${item.status}`} style={{ marginTop: '12px' }}>{item.status.toUpperCase()}</span>
            {item.source && <div className="source-label" style={{marginTop: '8px', textAlign: 'center'}}>Src: {item.source}</div>}
          </div>
        ))}
      </div>
    </div>

    <div className="grid-2" style={{ marginTop: '28px' }}>
      <div className="card">
        <h3>Initiative Status & ROI</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {executiveData.strategic.initiatives.map((init, i) => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F7FAFC', borderRadius: '8px' }}>
               <div>
                 <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{init.name}</div>
                 <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '2px' }}>Owner: {init.owner}</div>
               </div>
               <div style={{ textAlign: 'right' }}>
                 <div style={{ fontWeight: 'bold', color: '#38A169', fontSize: '1.1rem' }}>{init.roi}</div>
                 <div style={{ fontSize: '0.75rem', background: init.status === 'Urgent' ? '#FED7D7' : '#FEFCBF', color: init.status === 'Urgent' ? '#C53030' : '#744210', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>{init.status}</div>
               </div>
             </div>
          ))}
        </div>
        <div className="source-label" style={{marginTop: '16px', textAlign: 'right'}}>Source: Project Mgmt / Finance</div>
      </div>
      
      <div className="card">
        <h3>Risk & Opportunity Matrix</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '12px', height: '280px' }}>
          {/* Top Left: High Impact / Low Risk (Do First) */}
          <div style={{ background: '#F0FFF4', padding: '16px', borderRadius: '8px', border: '1px solid #C6F6D5' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#276749', marginBottom: '8px' }}>QUICK WINS</div>
            <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', margin: '0', color: '#2F855A' }}>
              <li>Website Booking Fix</li>
              <li>Email Marketing</li>
            </ul>
          </div>
          {/* Top Right: High Impact / High Risk (Plan) */}
          <div style={{ background: '#FFFFF0', padding: '16px', borderRadius: '8px', border: '1px solid #F6E05E' }}>
             <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#744210', marginBottom: '8px' }}>STRATEGIC BETS</div>
             <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', margin: '0', color: '#975A16' }}>
               <li>Day-Tripper Conv.</li>
               <li>Winter Events</li>
             </ul>
          </div>
          {/* Bottom Left: Low Impact / Low Risk */}
          <div style={{ background: '#F7FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #EDF2F7' }}>
             <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#4A5568', marginBottom: '8px' }}>MAINTENANCE</div>
             <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', margin: '0', color: '#4A5568' }}>
               <li>Social Content</li>
               <li>Partner Updates</li>
             </ul>
          </div>
          {/* Bottom Right: Low Impact / High Risk (Avoid) */}
          <div style={{ background: '#FFF5F5', padding: '16px', borderRadius: '8px', border: '1px solid #FEB2B2' }}>
             <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#C53030', marginBottom: '8px' }}>MONITOR</div>
             <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', margin: '0', color: '#C53030' }}>
               <li>Economic Downturn</li>
               <li>Weather</li>
             </ul>
          </div>
        </div>
        <div className="source-label" style={{marginTop: '16px', textAlign: 'right'}}>Source: Internal Risk Register</div>
      </div>
    </div>
  </div>
);

const TabGlossary = () => (
  <div className="tab-content fade-in">
    <div className="card">
      <div style={{ borderBottom: '1px solid #E2E8F0', marginBottom: '20px', paddingBottom: '12px' }}>
         <h3 style={{ margin: 0, color: '#1A365D' }}>Data Glossary & Sources</h3>
         <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#718096' }}>Definitions of key industry metrics and data sources used in this dashboard.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {glossaryTerms.map((term, i) => (
          <div key={i} style={{ padding: '16px', background: '#F7FAFC', borderRadius: '8px', borderLeft: '3px solid #006B76' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
               <div style={{ fontWeight: 'bold', color: '#2D3748', fontSize: '0.95rem' }}>{term.term}</div>
               <span style={{ fontSize: '0.7rem', background: '#EDF2F7', padding: '2px 8px', borderRadius: '4px', color: '#4A5568' }}>{term.source}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#4A5568', lineHeight: '1.5' }}>{term.def}</div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '28px', padding: '20px', background: '#EBF8FF', borderRadius: '8px', border: '1px solid #BEE3F8' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#2C5282' }}>About Visit Dana Point (DMO)</h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#2A4365', lineHeight: '1.6' }}>
          Visit Dana Point is the non-profit Destination Marketing Organization (DMO) responsible for marketing Dana Point as a premier destination. 
          Our mission is to drive visitor demand that generates economic impact for local businesses, supports jobs, and contributes to the quality of life 
          in our community through tax revenue. We are a distinct entity from the City of Dana Point government.
        </p>
      </div>
    </div>
  </div>
);

// --- MAIN APP ---

const App = () => {
  const [activeTab, setActiveTab] = useState('pulse');

  const tabs = [
    { id: 'pulse', label: 'Visit Dana Point Impact Overview', icon: Icons.Pulse },
    { id: 'hospitality', label: 'Hotel Partnership Health & Revenue', icon: Icons.Hotel },
    { id: 'economics', label: 'Destination Economic Engine', icon: Icons.Money },
    { id: 'growth', label: 'Target Market Visitor Origins', icon: Icons.Growth },
    { id: 'digital', label: 'Marketing Funnel & Conversion', icon: Icons.Digital },
    { id: 'events', label: 'Signature Events & Community Activation', icon: Icons.Event },
    { id: 'strategic', label: '2026 Strategic Initiative Roadmap', icon: Icons.Strategy },
    { id: 'creative', label: 'Visual Intelligence Studio', icon: Icons.Image }, // New Tab
    { id: 'glossary', label: 'Data Glossary & Sources', icon: Icons.Info },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'pulse': return <TabPulse />;
      case 'hospitality': return <TabHospitality />;
      case 'economics': return <TabEconomics />;
      case 'growth': return <TabGrowth />;
      case 'digital': return <TabDigital />;
      case 'events': return <TabEvents />;
      case 'strategic': return <TabStrategic />;
      case 'creative': return <VisualIntelligenceTab />;
      case 'glossary': return <TabGlossary />;
      default: return <TabPulse />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Disclaimer Modal (Simulated as part of Sidebar for now) */}
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo-area">
            <div className="logo-text">VISIT<br/>DANA POINT</div>
            <div className="logo-sub">Strategic Intelligence</div>
          </div>
          <nav className="nav-links">
            {tabs.map(tab => (
              <div 
                key={tab.id} 
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div style={{ color: activeTab === tab.id ? '#4FD1C5' : '#A0AEC0' }}><tab.icon /></div>
                {tab.label}
              </div>
            ))}
          </nav>
          <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{fontSize: '0.65rem', color: '#A0AEC0', lineHeight: '1.4'}}>
              <strong>CONFIDENTIAL</strong><br/>
              For Board & City Leadership Use Only.
              <br/><br/>
              Protected by GloCon Solutions LLC
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <TopBanner />
          {renderContent()}
          <Footer />
        </main>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);