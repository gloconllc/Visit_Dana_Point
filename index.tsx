/**
 * VISIT DANA POINT STRATEGIC DASHBOARD
 * 
 * Copyright © 2025 Visit Dana Point
 * Dashboard Technology & Code Protected by GloCon Solutions LLC
 * All Rights Reserved.
 * 
 * Unauthorized copying, modification, or distribution of this code is strictly prohibited.
 */

import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- ICONS (SVG) ---
const Icons = {
  Pulse: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  Hotel: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-8a2 2 0 012-2h4a2 2 0 012 2v8"/></svg>,
  Money: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  Growth: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  Digital: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  Event: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Strategy: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  Protected: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Info: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Image: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Refresh: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Live: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><circle cx="12" cy="12" r="3" fill="currentColor"><animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" /></circle></svg>,
  Analytics: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>,
  Upload: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Download: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Spark: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>,
  Movie: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Brain: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  Bolt: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Map: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
};

// --- DATA ---
const TOOLTIPS = {
  OCCUPANCY: "Percent of hotel rooms filled. High occupancy proves VDP is driving demand, which generates Transient Occupancy Tax (TOT) to fund City parks, safety, and services.",
  ADR: "Average Daily Rate (Price per room). VDP markets to high-value visitors to increase this rate, which boosts local business revenue without adding crowd congestion.",
  REVPAR: "Revenue Per Available Room. The gold standard for hotel success. It combines occupancy and price to show the true financial health of our lodging partners.",
  DAY_TRIPPER: "Visitors who visit for the day but don't stay overnight. VDP's goal is to convert them into overnight guests, as overnight guests spend 3x more in the community.",
  REPEAT_VISITOR: "Percentage of visitors who return within 12 months. This measures loyalty. High repeat rates mean our brand is strong and marketing costs are lower.",
  WEB_CONVERSION: "Percentage of website visitors who click 'Book Now'. This shows if our marketing is actually driving sales leads to hotel partners.",
  TOT: "Transient Occupancy Tax (10%). This is the tax paid by overnight guests. It goes 100% to the City budget. VDP marketing fills the rooms that pay this tax.",
  JOBS: "Estimated local jobs supported by tourism. Visitor spending at hotels, restaurants, and shops directly pays the wages for these community roles.",
  SPEND_IMPACT: "Total money spent by visitors at Dana Point businesses. This revenue supports local shops, restaurants, and creates a vibrant economy.",
  PARTNER_REV: "Total room revenue earned by our hotel partners. VDP's primary job is to grow this number to ensure a healthy local tourism industry.",
  MARKET_VISITORS: "Growth in visitors from key cities (like LA). We track this to ensure our ad campaigns are reaching the right people."
};

const INITIAL_DATA = {
  pulse: {
    kpis: [
      { label: 'Hotel Occupancy', value: '64.2%', trend: '-5.8 pts', status: 'yellow', sub: 'Target 70%', tooltip: TOOLTIPS.OCCUPANCY, source: 'STR', icon: 'Hotel' },
      { label: 'Visitor Spending', value: '$481M', trend: '+$204M', status: 'green', sub: 'On Track', tooltip: TOOLTIPS.SPEND_IMPACT, source: 'Datafy', icon: 'Money' },
      { label: 'Partner Revenue', value: '$65.6M', trend: '+$9.8M', status: 'green', sub: 'On Track', tooltip: TOOLTIPS.PARTNER_REV, source: 'STR', icon: 'Analytics' },
      { label: 'LA Visitors', value: '+17.1%', trend: 'Growth', status: 'green', sub: 'Target 17.5%', tooltip: TOOLTIPS.MARKET_VISITORS, source: 'Datafy', icon: 'Growth' },
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
    dataSources: [
      { name: 'Oracle Opera (PMS)', type: 'Internal', status: 'Active', records: '450k+' },
      { name: 'Revinate (CRM)', type: 'Guest Data', status: 'Active', records: '120k+' },
      { name: 'TripAdvisor', type: 'Reviews', status: 'Active', records: 'Real-time' },
      { name: 'CrowdRiff', type: 'Social/UGC', status: 'Active', records: 'Daily' },
      { name: 'Google Travel', type: 'Demand', status: 'Active', records: 'Live' }
    ],
    sentiment: [
      { cat: 'Service', pos: 88, neg: 12 },
      { cat: 'Cleanliness', pos: 94, neg: 6 },
      { cat: 'Value', pos: 72, neg: 28 },
      { cat: 'Location', pos: 98, neg: 2 }
    ],
    guestSegments: [
      { name: 'Families', val: 45, color: '#38A169' },
      { name: 'Couples', val: 30, color: '#3182CE' },
      { name: 'Business', val: 15, color: '#D69E2E' },
      { name: 'Solo', val: 10, color: '#805AD5' }
    ],
    sources: [
      { name: 'Organic', x: 145, y: 76, z: 40, color: '#38A169' },
      { name: 'Direct', x: 80, y: 79, z: 25, color: '#3182CE' },
      { name: 'Social', x: 110, y: 68, z: 30, color: '#D69E2E' },
      { name: 'Email', x: 45, y: 75, z: 15, color: '#805AD5' },
      { name: 'Display', x: 130, y: 66, z: 20, color: '#E53E3E' }
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

// Persistent Top Banner with Glassmorphism
const TopBanner = ({ data, onHomeClick }) => {
  // Safe extraction of high-level metrics from dynamic data
  const spendVal = data?.pulse?.kpis?.find(k => k.label.includes("Spending"))?.value || '$0M';
  const tripVal = '2.3M'; // Usually fixed or needs a specific field in data structure if dynamic

  return (
    <div style={{ 
        background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)', 
        padding: '16px 40px', 
        flexShrink: 0, 
        zIndex: 40,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={onHomeClick} title="Return to Dashboard Home">
        <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1A365D', fontFamily: "'Playfair Display', serif", display: 'flex', alignItems: 'center', gap: '8px' }}>
          VISIT DANA POINT <span style={{color: '#006B76', fontWeight: '400', fontSize: '1rem', fontFamily: 'Segoe UI'}}>| Strategic Intelligence</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '2px' }}>
          Live Data Feed • Protected View
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px', fontSize: '0.9rem', color: '#4A5568', fontWeight: '500', alignItems: 'center' }}>
        <div style={{display:'flex', alignItems:'center', gap:'8px', background: 'rgba(0,107,118,0.05)', padding: '6px 12px', borderRadius: '8px'}}>
          <span style={{fontSize:'1.1rem'}}>💰</span> 
          <span><strong style={{color: '#006B76'}}>{spendVal}</strong> spending</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'8px', background: 'rgba(26,54,93,0.05)', padding: '6px 12px', borderRadius: '8px'}}>
          <span style={{fontSize:'1.1rem'}}>👥</span>
          <span><strong style={{color: '#1A365D'}}>{tripVal}</strong> trips</span>
        </div>
        <div style={{ fontSize: '0.75rem', background: '#2D3748', color: 'white', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
          Next Review: Jan 15
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <div className="app-footer">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px', color: '#1A365D', fontWeight: '700' }}>
      <Icons.Protected />
      <span>Protected by GloCon Solutions LLC</span>
    </div>
    <div>&copy; 2025 Visit Dana Point. All Rights Reserved.</div>
  </div>
);

const KPICard = ({ data }) => {
  const isGreen = data.status === 'green';
  const isRed = data.status === 'red';
  const color = isGreen ? '#38A169' : isRed ? '#E53E3E' : '#D69E2E';
  // Dynamic icon mapping
  const IconComponent = Icons[data.icon] || Icons.Analytics;
  
  return (
    <div className="card" style={{ borderTop: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
         <div style={{ background: isGreen ? '#F0FFF4' : '#FFFFF0', padding: '10px', borderRadius: '12px', color: color }}>
            <IconComponent />
         </div>
         <div style={{ textAlign: 'right' }}>
            {data.source && <span className="source-label" style={{ display: 'block', fontSize: '0.65rem', color: '#A0AEC0' }}>{data.source}</span>}
            {data.tooltip && <Tooltip text={data.tooltip} />}
         </div>
      </div>
      
      <div style={{ fontSize: '0.85rem', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {data.label}
      </div>
      
      <div className="kpi-value" style={{ marginTop: '4px', fontSize: '2.5rem' }}>{data.value}</div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px', gap: '8px', padding: '8px 0 0', borderTop: '1px solid #F7FAFC' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: color, background: isGreen ? 'rgba(56, 161, 105, 0.1)' : 'rgba(214, 158, 46, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
          {data.trend}
        </span>
        <span style={{ fontSize: '0.75rem', color: '#A0AEC0' }}>{data.sub}</span>
      </div>
    </div>
  );
};

const DmoImpactPanel = ({ data }) => {
  // Extract dynamic values from data prop, fallback to defaults if structure varies
  const revenueKPI = data.pulse?.kpis?.find(k => k.label.includes('Partner Revenue'));
  const revenueStr = revenueKPI ? revenueKPI.value : '$65.6M';
  const revenue = parseFloat(revenueStr.replace(/[^0-9.]/g, '')) || 65.6; 
  
  const totRate = 0.10;
  const totGenerated = (revenue * totRate).toFixed(1);
  const jobsSupported = "2,400"; // Estimate based on standard multiplier

  const spendKPI = data.pulse?.kpis?.find(k => k.label.includes('Visitor Spending'));
  const spendVal = spendKPI ? spendKPI.value : '$481M';

  const handleDownloadReport = () => {
    const reportDate = new Date().toLocaleDateString();
    const clean = (text) => text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/[*#]/g, '');

    const content = `
VISIT DANA POINT
STRATEGIC IMPACT REPORT 2025
Generated: ${reportDate}
============================================================

EXECUTIVE SUMMARY
-----------------
${clean(data.pulse.headline.text)}

ECONOMIC IMPACT VERIFICATION
Verified by: Tourism Economics
----------------------------
Tax Revenue Generated: $${totGenerated}M (Direct TOT)
Jobs Supported: ${jobsSupported} (Direct Hospitality)
Economic Multiplier: ${spendVal} Total Visitor Spend
ROI Estimate: ~11x (Spend vs Budget)

KEY PERFORMANCE INDICATORS (Current Status)
-------------------------------------------
${data.pulse.kpis.map(k => `${k.label}: ${k.value} (Trend: ${k.trend}) - ${k.sub}`).join('\n')}

STRATEGIC INITIATIVES & ACTIONS
-------------------------------
${data.pulse.actions.map(a => `[${a.title}]
   Description: ${a.desc}
   Est. Impact: ${a.impact}
`).join('\n')}

MARKET RISKS & MONITORS
-----------------------
- Mobile Experience: 58% traffic mobile
- Occupancy Softening: Monitoring shoulder season gap
- Conversion: Focusing on 1% -> 5% lift

============================================================
CONFIDENTIAL & PROPRIETARY
Protected by GloCon Solutions LLC
`.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VDP_Impact_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="impact-hero" style={{ padding: '60px 48px', marginBottom: '40px', backgroundImage: 'url("https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2070&auto=format&fit=crop")', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '64px', flexWrap: 'wrap', gap: '32px', position: 'relative', zIndex: 2 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
             <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                Official DMO Authority
             </div>
             <div style={{ fontSize: '0.85rem', opacity: 0.95, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                <Icons.Protected /> Verified by Tourism Economics
             </div>
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', margin: 0, color: 'white', lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.4)', maxWidth: '800px' }}>
            Fueling Dana Point's <br/><span style={{color: '#81E6D9'}}>Economic Vitality</span>
          </h2>
          <p style={{ margin: '24px 0 0 0', fontSize: '1.2rem', opacity: 0.95, maxWidth: '750px', fontWeight: '400', lineHeight: '1.6', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            Visit Dana Point is the economic engine that transforms global visitor interest into essential funding for city services, local jobs, and community prosperity. We curate the brand that pays the bills.
          </p>
        </div>
        <button className="cta-button" onClick={handleDownloadReport} style={{alignSelf: 'flex-start'}}>
           Download 2025 Impact Report <span>↓</span>
        </button>
      </div>

      <div className="impact-grid">
        {/* Card 1: Tax Revenue */}
        <div className="impact-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
             <div style={{ background: 'linear-gradient(135deg, #81E6D9 0%, #4FD1C5 100%)', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 15px rgba(79, 209, 197, 0.4)' }}>
                <div style={{ color: '#004E56' }}><Icons.Money /></div>
             </div>
             <Tooltip text={TOOLTIPS.TOT} />
          </div>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#81E6D9', fontWeight: '800' }}>
            Funding City Services
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', margin: '8px 0', fontFamily: 'Segoe UI, sans-serif', letterSpacing: '-0.02em', textShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
            ${totGenerated}M
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.5, fontWeight: '500' }}>
            In direct Transient Occupancy Tax (TOT) collected for the City General Fund.
          </div>
        </div>

        {/* Card 2: Jobs */}
        <div className="impact-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
             <div style={{ background: 'linear-gradient(135deg, #FBD38D 0%, #F6AD55 100%)', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 15px rgba(246, 173, 85, 0.4)' }}>
                 <div style={{ color: '#744210' }}><Icons.Growth /></div>
             </div>
             <Tooltip text={TOOLTIPS.JOBS} />
          </div>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FBD38D', fontWeight: '800' }}>
            Fueling Local Livelihoods
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', margin: '8px 0', fontFamily: 'Segoe UI, sans-serif', letterSpacing: '-0.02em', textShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
            {jobsSupported}
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.5, fontWeight: '500' }}>
            Local jobs directly supported by visitor spending in hotels, dining, and retail.
          </div>
        </div>

        {/* Card 3: Multiplier */}
        <div className="impact-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
             <div style={{ background: 'linear-gradient(135deg, #63B3ED 0%, #3182CE 100%)', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 15px rgba(49, 130, 206, 0.4)' }}>
                 <div style={{ color: '#1A365D' }}><Icons.Strategy /></div>
             </div>
             <div style={{ fontSize: '0.75rem', background: 'white', color: '#1A365D', padding: '6px 12px', borderRadius: '20px', fontWeight: '800', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>11x ROI</div>
          </div>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#63B3ED', fontWeight: '800' }}>
            Economic Multiplier
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', margin: '8px 0', fontFamily: 'Segoe UI, sans-serif', letterSpacing: '-0.02em', textShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
            {spendVal}
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.5, fontWeight: '500' }}>
            Total visitor spending pumped into the Dana Point economy annually.
          </div>
        </div>
      </div>
    </div>
  );
};

const HeadlineInsight = ({ headline }) => (
  <div className="card" style={{ background: 'linear-gradient(to right, #2D3748, #1A202C)', color: 'white', borderLeft: '6px solid #F6AD55', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '10rem', opacity: 0.05, color: '#F6AD55' }}>
       <Icons.Pulse />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', position: 'relative', zIndex: 1 }}>
      <h3 style={{ color: '#F6AD55', margin: 0, border: 'none', padding: 0 }}>📊 STRATEGIC HEADLINE</h3>
      <span style={{ fontSize: '0.75rem', opacity: 0.7, fontStyle: 'italic' }}>Updated: {headline.updated}</span>
    </div>
    <p style={{ fontSize: '1.2rem', lineHeight: '1.7', margin: 0, fontWeight: '300', color: '#E2E8F0', position: 'relative', zIndex: 1 }}>
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

const IndustryNewsSection = () => {
  const [news, setNews] = useState<{ text: string; chunks: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNews = async () => {
      setLoading(true);
      setError(false);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: 'Search for recent articles and research from CoStar, Tourism Economics, Destinations International, Brand USA, and Visit California regarding travel trends, hotel performance, and economic outlooks for 2024-2025. Select 4 distinct high-impact updates. For each, strictly format the output to include: 1) The Source & Date, 2) The Headline, 3) The core insight, and 4) A "VDP Connection" explaining how this impacts Dana Point\'s specific metrics ($481M spend, 64.2% Occupancy, $262 ADR).',
          config: {
            tools: [{ googleSearch: {} }]
          }
        });
        
        setNews({
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
    fetchNews();
  }, []);

  if (error) return null;

  return (
    <div className="card" style={{ borderTop: '4px solid #006B76' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #EDF2F7', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Latest Industry News</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#718096' }}>Curated insights from vetted tourism sources.</p>
            </div>
            <button 
              onClick={fetchNews} 
              disabled={loading}
              style={{
                background: loading ? '#EDF2F7' : 'white',
                border: '1px solid #CBD5E0',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: '#2D3748',
                fontWeight: '600',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <Icons.Refresh /> {loading ? 'Scanning Sources...' : 'Refresh Feed'}
            </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
             {['CoStar', 'Tourism Economics', 'Destinations Intl', 'Brand USA', 'Visit California'].map(src => (
                 <span key={src} className="badge badge-green">
                    {src}
                 </span>
             ))}
        </div>
        
        {loading ? (
             <div style={{ padding: '60px', textAlign: 'center', color: '#718096', fontStyle: 'italic', background: '#F7FAFC', borderRadius: '12px' }}>
                 <div style={{ marginBottom: '16px', fontWeight: '500' }}>Scanning vetted industry sources...</div>
                 <div style={{ width: '40px', height: '40px', border: '3px solid #CBD5E0', borderTop: '3px solid #006B76', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
             </div>
        ) : (
            <>
                <div style={{ fontSize: '1rem', lineHeight: '1.7', color: '#2D3748' }}>
                    {news?.text.split('\n').map((line, i) => {
                        const cleanLine = line.trim();
                        if (!cleanLine) return null;
                        
                        const isHeader = cleanLine.startsWith('**') && cleanLine.endsWith('**');
                        const isList = cleanLine.startsWith('* ') || cleanLine.startsWith('- ') || cleanLine.startsWith('• ');
                        const content = isList ? cleanLine.substring(1).trim() : cleanLine;

                        return (
                            <div key={i} style={{ marginBottom: isHeader ? '8px' : '16px', display: isList ? 'flex' : 'block', gap: '10px' }}>
                                {isList && <span style={{color:'#006B76', marginTop:'6px', flexShrink: 0}}>●</span>}
                                <div style={{ fontWeight: isHeader ? '700' : '400', color: isHeader ? '#1A365D' : 'inherit', fontSize: isHeader ? '1.05rem' : '1rem' }}>{parseBold(content)}</div>
                            </div>
                        );
                    })}
                </div>
                {news?.chunks && news.chunks.length > 0 && (
                    <div style={{ marginTop: '32px', borderTop: '1px solid #EDF2F7', paddingTop: '20px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Source Links</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {news.chunks.map((chunk, i) => {
                                if (chunk.web?.uri) {
                                    return (
                                        <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" 
                                           style={{ fontSize: '0.8rem', color: '#006B76', textDecoration: 'none', background: '#E6FFFA', padding: '6px 12px', borderRadius: '6px', border: '1px solid #B2F5EA', transition: 'all 0.2s', fontWeight: '500' }}>
                                            {chunk.web.title || 'Source ' + (i + 1)} ↗
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {actions.map((action, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < actions.length -1 ? '20px' : 0, borderBottom: i < actions.length -1 ? '1px dashed #E2E8F0' : 'none' }}>
          <div>
            <div style={{ fontWeight: '700', color: '#2D3748', fontSize: '1rem' }}>{action.title}</div>
            <div style={{ fontSize: '0.9rem', color: '#718096', marginTop: '4px' }}>{action.desc}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
             <div style={{ fontSize: '0.7rem', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Impact</div>
             <div style={{ fontWeight: '800', color: '#38A169', fontSize: '1.2rem' }}>{action.impact}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// State-of-the-Art Glowing Trend Chart
const TrendChart = ({ data, target }) => {
  const max = 80; const min = 50; const range = max - min;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  const targetY = 100 - ((target - min) / range) * 100;

  return (
    <div style={{ height: '240px', width: '100%', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{overflow: 'visible'}}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#006B76" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#006B76" stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#EDF2F7" strokeWidth="0.5" />)}
        
        {/* Target Band */}
        <rect x="0" y="0" width="100" height={targetY} fill="#F0FFF4" opacity="0.5" />
        <line x1="0" y1={targetY} x2="100" y2={targetY} stroke="#48BB78" strokeWidth="1" strokeDasharray="4,4" />
        
        {/* Area Fill */}
        <polygon points={`0,100 ${points} 100,100`} fill="url(#chartGradient)" />

        {/* Main Line with Glow */}
        <polyline points={points} fill="none" stroke="#006B76" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 3px rgba(0,107,118,0.5))'}} />
        
        {/* Animated Data Points */}
        {data.map((val, i) => {
           const x = (i / (data.length - 1)) * 100;
           const y = 100 - ((val - min) / range) * 100;
           return (
             <g key={i} className="chart-point">
               <circle cx={x} cy={y} r="3" fill="white" stroke="#006B76" strokeWidth="2" vectorEffect="non-scaling-stroke" />
               <circle cx={x} cy={y} r="10" fill="transparent" stroke="none" style={{cursor:'pointer'}}>
                  <title>{val}%</title>
               </circle>
             </g>
           )
        })}
      </svg>
      <div style={{ position: 'absolute', top: `${targetY}%`, right: '0', transform: 'translateY(-120%)', fontSize: '0.75rem', color: '#48BB78', fontWeight: 'bold', background: 'rgba(240, 255, 244, 0.9)', padding: '4px 8px', borderRadius: '6px', backdropFilter: 'blur(4px)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>Target {target}%</div>
    </div>
  );
};

const BenchmarkChart = ({ items }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    {items.map((item, i) => (
      <div key={i}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '8px' }}>
          <span style={{ fontWeight: item.name === 'Visit Dana Point' ? '700' : '500', color: item.name === 'Visit Dana Point' ? '#006B76' : '#4A5568' }}>{item.name}</span>
          <span style={{ fontWeight: '700', color: '#2D3748' }}>{item.label}</span>
        </div>
        <div style={{ height: '20px', background: '#EDF2F7', borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: `${(item.value / 150) * 100}%`, height: '100%', background: item.color, borderRadius: '10px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }} />
          {item.name === 'Orange County Avg' && (
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${(100/150)*100}%`, borderLeft: '2px dashed #718096', zIndex: 2 }} />
          )}
        </div>
      </div>
    ))}
    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#718096', marginTop: '12px' }}>100 = Market Average (Orange County)</div>
  </div>
);

const ScenarioSlider = ({ data }) => {
  const [conversion, setConversion] = useState(0);
  const baseSpend = data.economics.spend; 
  
  // Vetted calc: ~2.95M gain per 1% conversion based on $29.5M for 10%
  const gainPer1Pct = 2.95; 
  const currentGain = conversion * gainPer1Pct;
  const total = baseSpend + currentGain;

  return (
    <div style={{ padding: '24px', background: 'linear-gradient(to bottom right, #FFFFFF, #F7FAFC)', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)' }}>
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
        style={{ marginBottom: '16px' }} 
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

const HeatMap = ({ data }) => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const max = Math.max(...data);
  const min = Math.min(...data);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(30px, 1fr))', gap: '6px' }}>
        {data.map((val, i) => {
          const intensity = (val - min) / (max - min);
          let bg = intensity < 0.3 ? '#FEFCBF' : intensity < 0.7 ? '#FBD38D' : '#F6AD55'; 
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
               <div style={{ width: '100%', height: '48px', background: bg, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', color: '#2D3748', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }} className="heatmap-cell">
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            opacity: 1 - (i * 0.1),
            boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1)'
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

const BubbleChart = ({ data }) => {
  // X: Volume (0-200k), Y: Engagement (60-80), Z: Size
  return (
    <div style={{ height: '240px', position: 'relative', borderLeft: '1px solid #CBD5E0', borderBottom: '1px solid #CBD5E0', margin: '20px 0 20px 20px' }}>
      {data.map((d, i) => {
        const left = (d.x / 180) * 100; // max volume approx 180k
        const bottom = ((d.y - 65) / 15) * 100; // engagement 65-80
        const size = Math.max(30, d.z * 1.5); 
        return (
          <div key={i} style={{ 
            position: 'absolute', left: `${left}%`, bottom: `${bottom}%`, 
            width: size, height: size, borderRadius: '50%', background: d.color, opacity: 0.8,
            transform: 'translate(-50%, 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)', color: 'white', fontSize: '0.65rem', textAlign: 'center', fontWeight: '600',
            border: '2px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(2px)'
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

// --- DATA UPLOAD TAB ---
const DataUploadTab = ({ currentData, onUpdate }) => {
  const fileInputRef = useRef(null);

  const downloadTemplate = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "vdp_data_template.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result === 'string') {
            const json = JSON.parse(result);
            onUpdate(json);
            alert("Data successfully updated!");
        }
      } catch (err) {
        console.error("Error parsing JSON:", err);
        alert("Error parsing JSON file. Please ensure it matches the template format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="tab-content fade-in">
      <div className="card">
        <h3 style={{ color: '#006B76' }}>Data Management Center</h3>
        <p style={{ fontSize: '1rem', color: '#4A5568', marginBottom: '24px' }}>
          This dashboard is powered by verified data from STR, Datafy, and GA4. Use this section to update the dataset.
          The file uploaded here acts as the single source of truth for the entire application.
        </p>

        <div className="grid-2">
           <div style={{ padding: '32px', border: '2px dashed #CBD5E0', borderRadius: '16px', textAlign: 'center', background: '#F7FAFC' }}>
              <div style={{ color: '#006B76', marginBottom: '16px' }}><Icons.Download /></div>
              <h4 style={{ margin: '0 0 8px 0', color: '#2D3748' }}>Step 1: Get Template</h4>
              <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '24px' }}>Download the current data structure as a JSON file.</p>
              <button onClick={downloadTemplate} className="cta-button" style={{ background: 'white', color: '#006B76', border: '1px solid #006B76', boxShadow: 'none' }}>
                Download JSON Template
              </button>
           </div>

           <div style={{ padding: '32px', border: '2px dashed #006B76', borderRadius: '16px', textAlign: 'center', background: '#F0FFF4' }}>
              <div style={{ color: '#006B76', marginBottom: '16px' }}><Icons.Upload /></div>
              <h4 style={{ margin: '0 0 8px 0', color: '#2D3748' }}>Step 2: Upload Data</h4>
              <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '24px' }}>Upload your updated JSON file to populate the dashboard.</p>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                style={{ display: 'none' }}
              />
              <button onClick={() => fileInputRef.current?.click()} className="cta-button">
                Select & Upload JSON
              </button>
           </div>
        </div>

        <div style={{ marginTop: '32px', padding: '16px', background: '#FFF5F5', borderRadius: '8px', borderLeft: '4px solid #C53030' }}>
           <strong style={{ color: '#C53030' }}>Warning:</strong> Uploading new data will instantly override all metrics, charts, and text in the dashboard for this session. Ensure your JSON is validated.
        </div>
      </div>
    </div>
  );
};

// --- CREATIVE STUDIO (IMAGE GEN, EDIT, VIDEO) ---
const CreativeStudio = () => {
    const [mode, setMode] = useState('generate'); // generate, edit, video
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [imageSize, setImageSize] = useState('1K');
    const [loading, setLoading] = useState(false);
    const [resultUrl, setResultUrl] = useState(null);
    const [uploadImage, setUploadImage] = useState(null); // base64 string
    const [uploadPreview, setUploadPreview] = useState(null);
    const fileRef = useRef(null);

    // Helpers
    const handleFile = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const base64Raw = evt.target?.result;
            // Fix: Check if base64Raw is a string before splitting, as FileReader result can be ArrayBuffer
            if (typeof base64Raw === 'string') {
                setUploadPreview(base64Raw);
                // strip header for API
                const base64Data = base64Raw.split(',')[1];
                const mimeType = base64Raw.split(';')[0].split(':')[1];
                setUploadImage({ data: base64Data, mimeType });
            }
        };
        reader.readAsDataURL(file);
    };

    // Actions
    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setResultUrl(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            if (mode === 'generate') {
                // Nano Banana Pro
                const response = await ai.models.generateContent({
                    model: 'gemini-3-pro-image-preview',
                    contents: { parts: [{ text: prompt }] },
                    config: { imageConfig: { aspectRatio, imageSize } }
                });
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        setResultUrl(`data:image/png;base64,${part.inlineData.data}`);
                        break;
                    }
                }
            } 
            else if (mode === 'edit') {
                if (!uploadImage) { alert("Upload an image first"); return; }
                // Nano Banana (Gemini 2.5 Flash Image)
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: {
                        parts: [
                            { inlineData: uploadImage },
                            { text: prompt }
                        ]
                    }
                });
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        setResultUrl(`data:image/png;base64,${part.inlineData.data}`);
                        break;
                    }
                }
            }
            else if (mode === 'video') {
                // Veo
                let operation = await ai.models.generateVideos({
                    model: 'veo-3.1-fast-generate-preview',
                    prompt: prompt,
                    image: uploadImage ? { imageBytes: uploadImage.data, mimeType: uploadImage.mimeType } : undefined,
                    config: {
                        numberOfVideos: 1,
                        resolution: '720p',
                        aspectRatio: aspectRatio === '1:1' ? '16:9' : aspectRatio // Veo only 16:9 or 9:16
                    }
                });
                // Poll
                while (!operation.done) {
                    await new Promise(r => setTimeout(r, 5000));
                    operation = await ai.operations.getVideosOperation({operation});
                }
                const vidUri = operation.response?.generatedVideos?.[0]?.video?.uri;
                if (vidUri) {
                    // Fetch with API key appended
                    const vidRes = await fetch(`${vidUri}&key=${process.env.API_KEY}`);
                    const blob = await vidRes.blob();
                    setResultUrl(URL.createObjectURL(blob));
                }
            }

        } catch (e) {
            console.error(e);
            alert("Generation failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-content fade-in">
            <div className="card">
                <div style={{marginBottom: '24px', borderBottom: '1px solid #EDF2F7', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <h3 style={{margin:0, color:'#1A365D'}}>Creative Studio</h3>
                        <p style={{margin:'4px 0 0 0', color:'#718096'}}>Powered by Nano Banana Pro & Veo</p>
                    </div>
                    <div style={{display: 'flex', gap: '8px'}}>
                        {['generate', 'edit', 'video'].map(m => (
                            <button 
                                key={m}
                                onClick={() => {setMode(m); setResultUrl(null);}}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: mode === m ? '#006B76' : '#EDF2F7',
                                    color: mode === m ? 'white' : '#4A5568',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid-2">
                    <div>
                        {/* INPUTS */}
                        <div style={{marginBottom: '20px'}}>
                            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#2D3748'}}>Prompt</label>
                            <textarea 
                                value={prompt} 
                                onChange={e => setPrompt(e.target.value)} 
                                placeholder={mode === 'edit' ? "e.g., Add a retro filter, remove the person..." : "Describe the image or video..."}
                                style={{width: '100%', height: '100px'}}
                            />
                        </div>

                        {/* UPLOAD (Edit/Video) */}
                        {(mode === 'edit' || mode === 'video') && (
                            <div style={{marginBottom: '20px'}}>
                                <label style={{display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#2D3748'}}>Source Image {mode === 'video' && '(Optional)'}</label>
                                <div 
                                    onClick={() => fileRef.current.click()}
                                    style={{
                                        border: '2px dashed #CBD5E0', 
                                        borderRadius: '12px', 
                                        padding: '20px', 
                                        textAlign: 'center', 
                                        cursor: 'pointer',
                                        background: uploadPreview ? `url(${uploadPreview}) center/cover` : '#F7FAFC',
                                        height: '120px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    {!uploadPreview && <span style={{color: '#718096'}}>Click to Upload</span>}
                                </div>
                                <input type="file" ref={fileRef} onChange={handleFile} style={{display: 'none'}} accept="image/*" />
                            </div>
                        )}

                        {/* CONTROLS */}
                        <div className="grid-2" style={{gap: '16px', marginBottom: '24px'}}>
                            <div>
                                <label style={{fontSize: '0.8rem', fontWeight: 'bold', color: '#718096'}}>Aspect Ratio</label>
                                <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} style={{width: '100%'}}>
                                    <option value="1:1">Square (1:1)</option>
                                    <option value="16:9">Landscape (16:9)</option>
                                    <option value="9:16">Portrait (9:16)</option>
                                    <option value="4:3">Standard (4:3)</option>
                                    <option value="3:4">Vertical (3:4)</option>
                                </select>
                            </div>
                            {mode === 'generate' && (
                                <div>
                                    <label style={{fontSize: '0.8rem', fontWeight: 'bold', color: '#718096'}}>Size</label>
                                    <select value={imageSize} onChange={e => setImageSize(e.target.value)} style={{width: '100%'}}>
                                        <option value="1K">HD (1K)</option>
                                        <option value="2K">2K</option>
                                        <option value="4K">4K</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <button onClick={handleGenerate} disabled={loading} className="cta-button" style={{width: '100%', justifyContent: 'center'}}>
                            {loading ? 'Processing...' : (
                                <>
                                    {mode === 'generate' && <Icons.Image />}
                                    {mode === 'edit' && <Icons.Spark />}
                                    {mode === 'video' && <Icons.Movie />}
                                    <span>{mode === 'edit' ? 'Transform' : 'Generate'}</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* PREVIEW AREA */}
                    <div style={{background: '#1A202C', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', overflow: 'hidden'}}>
                        {loading ? (
                            <div style={{color: 'white', textAlign: 'center'}}>
                                <Icons.Live />
                                <div style={{marginTop: '12px'}}>Creating Magic...</div>
                            </div>
                        ) : resultUrl ? (
                            mode === 'video' ? (
                                <video src={resultUrl} controls autoPlay loop style={{maxWidth: '100%', maxHeight: '400px'}} />
                            ) : (
                                <img src={resultUrl} alt="Result" style={{maxWidth: '100%', maxHeight: '400px'}} />
                            )
                        ) : (
                            <div style={{color: '#718096', textAlign: 'center'}}>
                                <div style={{fontSize: '3rem', opacity: 0.3, marginBottom: '10px'}}><Icons.Image /></div>
                                Output Preview
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- AI ANALYST (SEARCH, MAPS, THINKING) ---
const AIAnalystTab = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState(null); // { text, sources }
    const [mode, setMode] = useState('fast'); // fast, search, maps, deep
    const [loading, setLoading] = useState(false);
    const [uploadImage, setUploadImage] = useState(null); // For image analysis
    const fileRef = useRef(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const base64Raw = evt.target?.result;
            // Fix: Check if base64Raw is a string before splitting, as FileReader result can be ArrayBuffer
            if (typeof base64Raw === 'string') {
                const base64Data = base64Raw.split(',')[1];
                const mimeType = base64Raw.split(';')[0].split(':')[1];
                setUploadImage({ data: base64Data, mimeType });
            }
        };
        reader.readAsDataURL(file);
    };

    const askGemini = async () => {
        if (!query && !uploadImage) return;
        setLoading(true);
        setResponse(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            let res;
            let sources = [];

            if (mode === 'fast') {
                // Flash Lite
                res = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-lite',
                    contents: query
                });
            } else if (mode === 'search') {
                // Search Grounding
                res = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: query,
                    config: { tools: [{ googleSearch: {} }] }
                });
                sources = res.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            } else if (mode === 'maps') {
                // Maps Grounding
                res = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: query,
                    config: { tools: [{ googleMaps: {} }] }
                });
                // Maps sources are also in groundingChunks
                sources = res.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            } else if (mode === 'deep') {
                // Thinking Mode (Gemini 3 Pro)
                res = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: uploadImage ? { parts: [{inlineData: uploadImage}, {text: query}] } : query,
                    config: { thinkingConfig: { thinkingBudget: 32768 } } // Max thinking
                });
            }

            setResponse({
                text: res.text,
                sources: sources
            });

        } catch (e) {
            setResponse({ text: "Error: " + e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-content fade-in">
            <div className="card" style={{minHeight: '600px', display: 'flex', flexDirection: 'column'}}>
                <div style={{marginBottom: '24px', borderBottom: '1px solid #EDF2F7', paddingBottom: '16px'}}>
                    <h3 style={{margin: 0, color: '#1A365D'}}>Market Intelligence Analyst</h3>
                    <p style={{margin: '4px 0 0 0', color: '#718096'}}>Real-time research, map data, and strategic reasoning.</p>
                </div>

                {/* MODE TOGGLES */}
                <div style={{display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap'}}>
                    {[
                        {id: 'fast', label: 'Fast Chat', icon: Icons.Bolt},
                        {id: 'search', label: 'Web Research', icon: Icons.Search},
                        {id: 'maps', label: 'Location Scout', icon: Icons.Map},
                        {id: 'deep', label: 'Deep Strategy', icon: Icons.Brain}
                    ].map(m => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 20px', borderRadius: '30px',
                                border: mode === m.id ? '2px solid #006B76' : '1px solid #E2E8F0',
                                background: mode === m.id ? '#E6FFFA' : 'white',
                                color: mode === m.id ? '#006B76' : '#718096',
                                fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <m.icon /> {m.label}
                        </button>
                    ))}
                </div>

                {/* RESPONSE AREA */}
                <div style={{flex: 1, background: '#F7FAFC', borderRadius: '12px', padding: '24px', overflowY: 'auto', border: '1px solid #EDF2F7', marginBottom: '24px'}}>
                    {loading ? (
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', color: '#006B76', fontWeight: '600'}}>
                            <div className="spinner" style={{width:'20px', height:'20px', border:'3px solid #CBD5E0', borderTop:'3px solid #006B76', borderRadius:'50%'}}></div>
                            {mode === 'deep' ? 'Thinking deeply (this may take a moment)...' : 'Analyzing...'}
                        </div>
                    ) : response ? (
                        <div>
                            <div style={{whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#2D3748', fontSize: '1rem'}}>
                                {response.text ? parseBold(response.text) : 'No response content.'}
                            </div>
                            {/* Sources / Grounding */}
                            {response.sources && response.sources.length > 0 && (
                                <div style={{marginTop: '24px', borderTop: '1px solid #E2E8F0', paddingTop: '16px'}}>
                                    <div style={{fontSize: '0.75rem', fontWeight: 'bold', color: '#718096', marginBottom: '8px', textTransform: 'uppercase'}}>Verified Sources</div>
                                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                                        {response.sources.map((s, i) => {
                                            if (s.web?.uri) {
                                                return (
                                                    <a key={i} href={s.web.uri} target="_blank" rel="noreferrer" style={{fontSize: '0.8rem', color: '#006B76', background: 'white', padding: '4px 10px', borderRadius: '4px', border: '1px solid #B2F5EA', textDecoration: 'none'}}>
                                                        {s.web.title || 'Web Source'} ↗
                                                    </a>
                                                )
                                            }
                                            if (s.maps?.placeId) { // Basic map check
                                                return (
                                                    <span key={i} style={{fontSize: '0.8rem', color: '#C53030', background: '#FFF5F5', padding: '4px 10px', borderRadius: '4px', border: '1px solid #FED7D7'}}>
                                                        📍 {s.maps.title}
                                                    </span>
                                                )
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{textAlign: 'center', marginTop: '80px', color: '#A0AEC0'}}>
                            <Icons.Brain />
                            <p>Select a mode and ask a question to begin.</p>
                        </div>
                    )}
                </div>

                {/* INPUT AREA */}
                <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                    {mode === 'deep' && (
                        <>
                            <input type="file" ref={fileRef} onChange={handleFile} style={{display:'none'}} accept="image/*" />
                            <button onClick={() => fileRef.current.click()} style={{padding: '12px', borderRadius: '50%', border: '1px solid #E2E8F0', background: uploadImage ? '#E6FFFA' : 'white', cursor: 'pointer', color: uploadImage ? '#006B76' : '#718096'}}>
                                <Icons.Image />
                            </button>
                        </>
                    )}
                    <input 
                        type="text" 
                        value={query} 
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && askGemini()}
                        placeholder={mode === 'deep' ? "Ask a complex strategic question (or upload image to analyze)..." : mode === 'search' ? "Search for latest trends..." : "Type your query..."}
                        style={{flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '1rem'}}
                    />
                    <button onClick={askGemini} disabled={loading} className="cta-button" style={{padding: '16px 24px', borderRadius: '12px'}}>
                        <Icons.Spark /> Send
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- TABS ---

const TabPulse = ({ data, onHomeClick }) => (
  <div className="tab-content fade-in">
    <DmoImpactPanel data={data} />
    <HeadlineInsight headline={data.pulse.headline} />
    
    <div style={{ margin: '32px 0' }}>
       <IndustryNewsSection />
    </div>

    <div className="grid-4" style={{ marginTop: '32px' }}>
      {data.pulse.kpis.map((kpi, i) => <KPICard key={i} data={kpi} />)}
    </div>
    <div className="grid-2" style={{ marginTop: '32px' }}>
      <ActionItems actions={data.pulse.actions} />
      <div className="card">
        <h3 style={{ color: '#D69E2E', borderBottomColor: '#FEFCBF' }}>⚠️ RISK MONITOR</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '1rem', color: '#2D3748', lineHeight: '1.8' }}>
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
        <div style={{ marginTop: '24px', padding: '12px', borderRadius: '8px', background: 'rgba(56, 161, 105, 0.1)', fontSize: '0.9rem', fontWeight: 'bold', color: '#2F855A', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✅</span> STATUS: No Critical Red Flags. All KPIs positive YoY.
        </div>
      </div>
    </div>
  </div>
);

const TabHospitality = ({ data }) => (
  <div className="tab-content fade-in">
    <div className="grid-2">
      <div className="card">
        <h3>Occupancy Trend (Trailing 12 Months)</h3>
        <TrendChart data={data.hospitality.occupancyTrend} target={70} />
      </div>
      <div className="card">
        <h3>Competitive Benchmarks</h3>
        <BenchmarkChart items={data.hospitality.benchmarks} />
      </div>
    </div>
    
    <h3 style={{marginTop: '32px', color: '#2D3748'}}>Property Class Performance</h3>
    <div className="grid-4">
      {data.hospitality.propertyClass.map((prop, i) => (
        <div key={i} className="card" style={{borderTop: '4px solid #3182CE'}}>
           <div style={{fontWeight: '700', color: '#2D3748', fontSize: '1.1rem', marginBottom: '8px'}}>{prop.name}</div>
           <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
             <span style={{color:'#718096', fontSize:'0.9rem'}}>Occupancy</span>
             <span style={{fontWeight:'700'}}>{prop.occ}</span>
           </div>
           <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
             <span style={{color:'#718096', fontSize:'0.9rem'}}>ADR</span>
             <span style={{fontWeight:'700'}}>{prop.adr}</span>
           </div>
           <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
             <span style={{color:'#718096', fontSize:'0.9rem'}}>RevPAR</span>
             <span style={{fontWeight:'700'}}>{prop.revpar}</span>
           </div>
           <div style={{marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #E2E8F0', color: '#38A169', fontSize: '0.85rem', fontWeight: '700'}}>
             {prop.growth} YoY
           </div>
        </div>
      ))}
    </div>

    <div className="card" style={{marginTop: '32px'}}>
      <h3>Revenue Seasonality (Waterfall)</h3>
      <HeatMap data={data.hospitality.revenueWaterfall.map(d => d.val)} />
    </div>
  </div>
);

const TabEconomics = ({ data }) => (
  <div className="tab-content fade-in">
    <div className="grid-2">
       <ScenarioSlider data={data} />
       <div className="card">
          <h3>Visitor Spending Categories</h3>
          <div style={{display:'flex', flexDirection:'column', gap:'16px', justifyContent:'center', height:'100%'}}>
             {data.economics.categories.map((cat, i) => (
               <div key={i}>
                 <div style={{display:'flex', justifyContent:'space-between', marginBottom:'6px', fontWeight:'600'}}>
                   <span>{cat.name}</span>
                   <span>${cat.val}M ({cat.pct}%)</span>
                 </div>
                 <div style={{width:'100%', height:'12px', background:'#EDF2F7', borderRadius:'6px', overflow:'hidden'}}>
                   <div style={{width:`${cat.pct}%`, height:'100%', background:'#38A169'}} />
                 </div>
               </div>
             ))}
          </div>
       </div>
    </div>
    
    <div style={{marginTop:'32px', textAlign:'center', padding:'40px', background:'white', borderRadius:'16px', border:'1px solid #E2E8F0'}}>
        <h2 style={{color: '#2D3748', margin: '0 0 16px 0'}}>Total Economic Impact Goal</h2>
        <div style={{fontSize: '4rem', fontWeight: '800', color: '#006B76'}}>${data.economics.spend}M</div>
        <div style={{color: '#718096', fontSize: '1.2rem'}}>Current Annual Visitor Spending</div>
        <div style={{marginTop: '24px'}}>
           <span style={{background:'#EDF2F7', padding:'8px 16px', borderRadius:'20px', color:'#4A5568', fontWeight:'600'}}>
              Target: ${data.economics.target}M by 2026
           </span>
        </div>
    </div>
  </div>
);

const TabGrowth = ({ data }) => (
  <div className="tab-content fade-in">
    <div className="grid-2">
      <div className="card">
        <h3>Key Feeder Markets</h3>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:'2px solid #E2E8F0', textAlign:'left'}}>
              <th style={{padding:'8px'}}>Market</th>
              <th style={{padding:'8px'}}>Share</th>
              <th style={{padding:'8px'}}>Volume</th>
              <th style={{padding:'8px'}}>Growth</th>
            </tr>
          </thead>
          <tbody>
            {data.growth.markets.map((m, i) => (
              <tr key={i} style={{borderBottom:'1px solid #EDF2F7'}}>
                <td style={{padding:'12px 8px', fontWeight:'600'}}>{m.name}</td>
                <td style={{padding:'12px 8px'}}>{m.share}%</td>
                <td style={{padding:'12px 8px'}}>{m.val}</td>
                <td style={{padding:'12px 8px', color:'#38A169', fontWeight:'700'}}>{m.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
         <h3>Visitor Demographics</h3>
         <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
            {data.growth.demographics.map((d, i) => (
               <div key={i} style={{padding:'16px', background:'#F7FAFC', borderRadius:'8px', textAlign:'center'}}>
                  <div style={{fontSize:'1.5rem', fontWeight:'800', color:'#2C5282'}}>{d.value}</div>
                  <div style={{fontSize:'0.85rem', color:'#718096'}}>{d.label}</div>
               </div>
            ))}
         </div>
      </div>
    </div>

    <div className="card" style={{marginTop:'32px'}}>
       <h3>Growth Trajectory</h3>
       <div style={{display:'flex', alignItems:'flex-end', height:'200px', gap:'40px', padding:'20px 0'}}>
          {data.growth.growthTrend.map((t, i) => (
             <div key={i} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', height:'100%'}}>
                <div style={{
                   width:'60px', 
                   height:`${(t.val / 3) * 100}%`, 
                   background: i === 2 ? '#4FD1C5' : '#006B76', 
                   borderRadius:'8px 8px 0 0',
                   display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold'
                }}>
                  {t.val}M
                </div>
                <div style={{marginTop:'12px', fontWeight:'600', color:'#4A5568'}}>{t.year}</div>
             </div>
          ))}
       </div>
    </div>
  </div>
);

const TabDigital = ({ data }) => (
  <div className="tab-content fade-in">
    <div className="grid-2">
       <div className="card">
          <h3>Website Funnel Efficiency</h3>
          <FunnelChart stages={data.digital.funnel} />
       </div>
       <div className="card">
          <h3>Traffic Sources & Engagement</h3>
          <BubbleChart data={data.digital.sources} />
       </div>
    </div>

    <div className="grid-2" style={{marginTop:'32px'}}>
       <div className="card">
          <h3>Guest Sentiment</h3>
          {data.digital.sentiment.map((s, i) => (
             <div key={i} style={{marginBottom:'12px'}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'4px'}}>
                   <span style={{fontWeight:'600'}}>{s.cat}</span>
                   <span style={{color:'#38A169'}}>{s.pos}% Positive</span>
                </div>
                <div style={{width:'100%', height:'8px', background:'#FED7D7', borderRadius:'4px', overflow:'hidden'}}>
                   <div style={{width:`${s.pos}%`, height:'100%', background:'#38A169'}} />
                </div>
             </div>
          ))}
       </div>
       <div className="card">
          <h3>Data Sources Status</h3>
          <table style={{width:'100%', fontSize:'0.9rem'}}>
             <thead>
                <tr style={{textAlign:'left', color:'#718096'}}>
                   <th style={{paddingBottom:'8px'}}>Source</th>
                   <th style={{paddingBottom:'8px'}}>Type</th>
                   <th style={{paddingBottom:'8px'}}>Status</th>
                </tr>
             </thead>
             <tbody>
                {data.digital.dataSources.map((ds, i) => (
                   <tr key={i}>
                      <td style={{padding:'8px 0', fontWeight:'600'}}>{ds.name}</td>
                      <td style={{color:'#718096'}}>{ds.type}</td>
                      <td><span className="badge badge-green">{ds.status}</span></td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  </div>
);

const TabEvents = ({ data }) => (
  <div className="tab-content fade-in">
    <div className="card">
       <h3>Signature Event Impact: Ohana Festival</h3>
       <div style={{overflowX: 'auto'}}>
       <table style={{width:'100%', borderCollapse:'collapse', marginTop:'16px'}}>
          <thead>
             <tr style={{background:'#F7FAFC', textAlign:'left'}}>
                <th style={{padding:'12px'}}>Year</th>
                <th style={{padding:'12px'}}>Attendance (k)</th>
                <th style={{padding:'12px'}}>Econ Impact ($M)</th>
                <th style={{padding:'12px'}}>Trend</th>
             </tr>
          </thead>
          <tbody>
             {data.events.ohana.map((e, i) => (
                <tr key={i} style={{borderBottom:'1px solid #EDF2F7'}}>
                   <td style={{padding:'12px', fontWeight:'700'}}>{e.year}</td>
                   <td style={{padding:'12px'}}>{e.att}k</td>
                   <td style={{padding:'12px'}}>${e.spend}M</td>
                   <td style={{padding:'12px'}}>
                      {i > 0 && e.spend > data.events.ohana[i-1].spend ? <span style={{color:'#38A169'}}>↑ Growth</span> : '-'}
                   </td>
                </tr>
             ))}
          </tbody>
       </table>
       </div>
    </div>

    <div className="grid-2" style={{marginTop:'32px'}}>
       <div className="card">
          <h3>Seasonality Gap Analysis</h3>
          <div style={{display:'flex', justifyContent:'space-around', alignItems:'center', padding:'20px'}}>
             <div style={{textAlign:'center'}}>
                <div style={{fontSize:'0.9rem', color:'#718096'}}>Peak Spend</div>
                <div style={{fontSize:'1.5rem', fontWeight:'bold', color:'#38A169'}}>${data.events.gapAnalysis.peak}M</div>
             </div>
             <div style={{fontSize:'1.5rem', color:'#CBD5E0'}}>vs</div>
             <div style={{textAlign:'center'}}>
                <div style={{fontSize:'0.9rem', color:'#718096'}}>Low Season</div>
                <div style={{fontSize:'1.5rem', fontWeight:'bold', color:'#E53E3E'}}>${data.events.gapAnalysis.low}M</div>
             </div>
          </div>
          <div style={{textAlign:'center', marginTop:'16px', padding:'12px', background:'#FFF5F5', color:'#C53030', borderRadius:'8px', fontWeight:'600'}}>
             Opportunity Gap: ${data.events.gapAnalysis.gap}M
          </div>
       </div>
       <div className="card">
          <h3>Monthly Spend Intensity</h3>
          <HeatMap data={data.events.seasonality} />
       </div>
    </div>
  </div>
);

const TabStrategic = ({ data }) => (
  <div className="tab-content fade-in">
    <h3 style={{color:'#1A365D'}}>2026 Strategic Scorecard</h3>
    <div className="grid-4" style={{marginBottom:'32px'}}>
       {data.strategic.scorecard.map((s, i) => (
          <div key={i} className="card" style={{borderLeft:`4px solid ${s.status === 'green' ? '#38A169' : s.status === 'yellow' ? '#D69E2E' : '#E53E3E'}`}}>
             <div style={{fontSize:'0.9rem', color:'#718096'}}>{s.name}</div>
             <div style={{fontSize:'1.8rem', fontWeight:'800', color:'#2D3748', margin:'8px 0'}}>{s.current}</div>
             <div style={{fontSize:'0.8rem', color:'#A0AEC0'}}>Target: {s.target}</div>
          </div>
       ))}
    </div>

    <div className="card">
       <h3>Strategic Initiatives Roadmap</h3>
       <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
             <tr style={{borderBottom:'2px solid #E2E8F0', textAlign:'left'}}>
                <th style={{padding:'12px'}}>Initiative</th>
                <th style={{padding:'12px'}}>Status</th>
                <th style={{padding:'12px'}}>Owner</th>
                <th style={{padding:'12px'}}>Est. ROI</th>
             </tr>
          </thead>
          <tbody>
             {data.strategic.initiatives.map((item, i) => (
                <tr key={i} style={{borderBottom:'1px solid #EDF2F7'}}>
                   <td style={{padding:'16px 12px', fontWeight:'600'}}>{item.name}</td>
                   <td style={{padding:'16px 12px'}}>
                      <span style={{
                         padding:'4px 12px', borderRadius:'12px', fontSize:'0.8rem', fontWeight:'600',
                         background: item.status === 'Urgent' ? '#FED7D7' : item.status === 'Planned' ? '#C6F6D5' : '#FEFCBF',
                         color: item.status === 'Urgent' ? '#C53030' : item.status === 'Planned' ? '#2F855A' : '#744210'
                      }}>
                         {item.status}
                      </span>
                   </td>
                   <td style={{padding:'16px 12px', color:'#718096'}}>{item.owner}</td>
                   <td style={{padding:'16px 12px', fontWeight:'700', color:'#38A169'}}>{item.roi}</td>
                </tr>
             ))}
          </tbody>
       </table>
    </div>
  </div>
);

const TabGlossary = () => (
   <div className="tab-content fade-in">
      <div className="card">
         <h3 style={{color:'#006B76'}}>Metrics Glossary & Data Sources</h3>
         <div style={{display:'grid', gap:'20px'}}>
            {glossaryTerms.map((term, i) => (
               <div key={i} style={{paddingBottom:'20px', borderBottom: i < glossaryTerms.length-1 ? '1px solid #EDF2F7' : 'none'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                     <h4 style={{margin:'0 0 8px 0', color:'#2D3748'}}>{term.term}</h4>
                     <span style={{fontSize:'0.75rem', background:'#E6FFFA', color:'#006B76', padding:'2px 8px', borderRadius:'4px'}}>{term.source}</span>
                  </div>
                  <p style={{margin:0, color:'#4A5568', lineHeight:'1.6'}}>{term.def}</p>
               </div>
            ))}
         </div>
      </div>
   </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('pulse');
  const [dashboardData, setDashboardData] = useState(INITIAL_DATA);
  const [viewOptimization, setViewOptimization] = useState('');

  // Best Viewing Option Detection
  useEffect(() => {
    const checkViewport = () => {
        const width = window.innerWidth;
        if (width < 768) {
            setViewOptimization('Mobile View: Analytics summarized for speed.');
        } else if (width > 1600) {
            setViewOptimization('Ultra-Wide View: Enhanced data density enabled.');
        } else {
            setViewOptimization('');
        }
    };
    window.addEventListener('resize', checkViewport);
    checkViewport(); // Initial check
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Groups for better sidebar organization
  const tabGroups = {
    overview: [
        { id: 'pulse', label: 'Impact Overview', icon: Icons.Pulse },
    ],
    performance: [
        { id: 'hospitality', label: 'Hotel & Revenue', icon: Icons.Hotel },
        { id: 'economics', label: 'Economic Engine', icon: Icons.Money },
        { id: 'growth', label: 'Visitor Origins', icon: Icons.Growth },
    ],
    marketing: [
        { id: 'digital', label: 'Market Intelligence', icon: Icons.Analytics },
        { id: 'events', label: 'Signature Events', icon: Icons.Event },
    ],
    innovation: [
        { id: 'strategic', label: '2026 Strategy', icon: Icons.Strategy },
        { id: 'analyst', label: 'AI Analyst', icon: Icons.Brain },
        { id: 'creative', label: 'Creative Studio', icon: Icons.Image }, 
        { id: 'upload', label: 'Data Management', icon: Icons.Upload },
        { id: 'glossary', label: 'Data Sources', icon: Icons.Info },
    ]
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pulse': return <TabPulse data={dashboardData} onHomeClick={() => setActiveTab('pulse')} />;
      case 'hospitality': return <TabHospitality data={dashboardData} />;
      case 'economics': return <TabEconomics data={dashboardData} />;
      case 'growth': return <TabGrowth data={dashboardData} />;
      case 'digital': return <TabDigital data={dashboardData} />;
      case 'events': return <TabEvents data={dashboardData} />;
      case 'strategic': return <TabStrategic data={dashboardData} />;
      case 'analyst': return <AIAnalystTab />;
      case 'creative': return <CreativeStudio />;
      case 'upload': return <DataUploadTab currentData={dashboardData} onUpdate={setDashboardData} />;
      case 'glossary': return <TabGlossary />;
      default: return <TabPulse data={dashboardData} onHomeClick={() => setActiveTab('pulse')} />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-text">VISIT<br/>DANA POINT</div>
          <div className="logo-sub">Strategic Intelligence</div>
        </div>
        
        <nav className="nav-links">
            {/* Render Groups */}
            <div className="nav-group-label">Executive Summary</div>
            {tabGroups.overview.map(tab => (
                 <div key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                    <div style={{ color: activeTab === tab.id ? '#4FD1C5' : 'rgba(255,255,255,0.7)' }}><tab.icon /></div>
                    {tab.label}
                 </div>
            ))}
            
            <div className="nav-group-label" style={{marginTop: '24px'}}>Performance Data</div>
            {tabGroups.performance.map(tab => (
                 <div key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                    <div style={{ color: activeTab === tab.id ? '#4FD1C5' : 'rgba(255,255,255,0.7)' }}><tab.icon /></div>
                    {tab.label}
                 </div>
            ))}

            <div className="nav-group-label" style={{marginTop: '24px'}}>Marketing & Events</div>
            {tabGroups.marketing.map(tab => (
                 <div key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                    <div style={{ color: activeTab === tab.id ? '#4FD1C5' : 'rgba(255,255,255,0.7)' }}><tab.icon /></div>
                    {tab.label}
                 </div>
            ))}

             <div className="nav-group-label" style={{marginTop: '24px'}}>Tools</div>
            {tabGroups.innovation.map(tab => (
                 <div key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                    <div style={{ color: activeTab === tab.id ? '#4FD1C5' : 'rgba(255,255,255,0.7)' }}><tab.icon /></div>
                    {tab.label}
                 </div>
            ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <TopBanner data={dashboardData} onHomeClick={() => setActiveTab('pulse')} />
        
        {viewOptimization && (
            <div style={{ background: '#2D3748', color: 'white', padding: '8px 48px', fontSize: '0.75rem', textAlign: 'center', letterSpacing: '0.05em' }}>
                ℹ️ {viewOptimization}
            </div>
        )}

        <div className="content-wrapper">
             {renderContent()}
        </div>
        <Footer />
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);