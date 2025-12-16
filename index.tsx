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
  Map: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  Share: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Print: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
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

// --- EXPORT UTILS ---
const ExportMenu = ({ title, data, type = 'report' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePrint = () => {
    window.print();
    setIsOpen(false);
  };

  const handleDownloadCSV = () => {
    // Basic CSV flattener
    const flatten = (obj, prefix = '') => {
      return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
          Object.assign(acc, flatten(obj[k], pre + k));
        } else {
          acc[pre + k] = JSON.stringify(obj[k]);
        }
        return acc;
      }, {});
    };

    const flatData = Array.isArray(data) ? data.map(d => flatten(d)) : [flatten(data)];
    if(flatData.length === 0) return;
    
    const headers = Object.keys(flatData[0]);
    const csvContent = [
      headers.join(','),
      ...flatData.map(row => headers.map(fieldName => row[fieldName]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, '_')}_data.csv`;
    link.click();
    setIsOpen(false);
  };

  const handleShareEmail = () => {
    const subject = `VDP Dashboard Report: ${title}`;
    const body = `Here is the ${title} report from the Visit Dana Point Dashboard.\n\nLink: ${window.location.href}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setIsOpen(false);
  };

  return (
    <div className="no-print" style={{position: 'relative', display: 'inline-block'}}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="cta-button secondary"
        style={{padding: '6px 12px', fontSize: '0.8rem', gap: '6px'}}
      >
        <Icons.Share /> Export / Share
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: '8px',
          background: 'white', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          padding: '8px', width: '180px', zIndex: 100, border: '1px solid #EDF2F7'
        }}>
          <div onClick={handlePrint} style={{padding: '8px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#2D3748', transition: 'background 0.2s'}} onMouseOver={e=>e.currentTarget.style.background='#EDF2F7'} onMouseOut={e=>e.currentTarget.style.background='white'}>
            <Icons.Print /> Print PDF Report
          </div>
          <div onClick={handleDownloadCSV} style={{padding: '8px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#2D3748', transition: 'background 0.2s'}} onMouseOver={e=>e.currentTarget.style.background='#EDF2F7'} onMouseOut={e=>e.currentTarget.style.background='white'}>
            <Icons.Download /> Download CSV
          </div>
          <div onClick={handleShareEmail} style={{padding: '8px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#2D3748', transition: 'background 0.2s'}} onMouseOver={e=>e.currentTarget.style.background='#EDF2F7'} onMouseOut={e=>e.currentTarget.style.background='white'}>
            <Icons.Share /> Email Link
          </div>
        </div>
      )}
    </div>
  );
};

// --- NEWS TICKER ---
const NewsTicker = () => {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: 'Find the 5 most recent and impactful news headlines related to Dana Point tourism, events from visitdanapoint.com and danapoint.org, and general California hospitality trends from CoStar or Tourism Economics. Return ONLY a single line of pipe-separated headlines. Example: "Event A announced | Trend B is up | Hotel C opens". Do NOT use markdown.',
          config: { tools: [{ googleSearch: {} }] }
        });
        const text = response.text || "";
        setItems(text.split('|').map(s => s.trim()).filter(s => s.length > 0));
      } catch (e) {
        setItems(["Welcome to Visit Dana Point Strategic Dashboard", "Live Data Feed Active", "Monitoring Industry Trends"]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="ticker-wrap">
      <div className="ticker-content">
        {items.map((item, i) => (
          <div key={i} className="ticker-item">
            <span style={{color: '#81E6D9', fontWeight: 'bold', marginRight: '8px'}}>LATEST:</span>
            {item}
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {items.map((item, i) => (
          <div key={`dup-${i}`} className="ticker-item">
            <span style={{color: '#81E6D9', fontWeight: 'bold', marginRight: '8px'}}>LATEST:</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

// Persistent Top Banner with Glassmorphism
const TopBanner = ({ data, onHomeClick }) => {
  const spendVal = data?.pulse?.kpis?.find(k => k.label.includes("Spending"))?.value || '$0M';
  const tripVal = '2.3M'; 

  return (
    <div className="no-print" style={{ 
        background: 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.4)', 
        padding: '16px 40px', 
        flexShrink: 0, 
        zIndex: 40,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
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
  const IconComponent = Icons[data.icon] || Icons.Analytics;
  
  return (
    <div className="card" style={{ borderTop: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
         <div style={{ background: isGreen ? '#F0FFF4' : '#FFFFF0', padding: '10px', borderRadius: '12px', color: color }}>
            <IconComponent />
         </div>
         <div style={{ textAlign: 'right' }}>
            {data.source && <span style={{ display: 'block', fontSize: '0.65rem', color: '#A0AEC0', fontWeight: '600' }}>{data.source}</span>}
            {data.tooltip && <Tooltip text={data.tooltip} />}
         </div>
      </div>
      
      <div style={{ fontSize: '0.85rem', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {data.label}
      </div>
      
      <div className="kpi-value" style={{ marginTop: '4px', fontSize: '2.5rem', fontWeight: '700', color: '#2D3748' }}>{data.value}</div>
      
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
  const revenueKPI = data.pulse?.kpis?.find(k => k.label.includes('Partner Revenue'));
  const revenueStr = revenueKPI ? revenueKPI.value : '$65.6M';
  const revenue = parseFloat(revenueStr.replace(/[^0-9.]/g, '')) || 65.6; 
  const totGenerated = (revenue * 0.10).toFixed(1);
  const spendKPI = data.pulse?.kpis?.find(k => k.label.includes('Visitor Spending'));
  const spendValStr = spendKPI ? spendKPI.value : '$481M';
  const spendVal = parseFloat(spendValStr.replace(/[^0-9.]/g, '')) || 481;
  const jobsSupported = Math.round((spendVal * 1000000) / 200000).toLocaleString();
  const budgetEst = 48; // $48M est
  const budgetRatio = (spendVal / budgetEst).toFixed(1);

  return (
    <div className="impact-hero" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', background: 'white' }}>
      <NewsTicker />
      <div style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(26, 54, 93, 0.95) 0%, rgba(0, 107, 118, 0.85) 100%), url("https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '48px',
          color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ maxWidth: '700px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', backdropFilter: 'blur(4px)' }}>
                        Official DMO Authority
                    </span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Icons.Protected /> Verified Data Sources: STR, Datafy, City of DP
                    </span>
                </div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', margin: '0 0 16px 0', lineHeight: 1.1 }}>
                    Driving Dana Point's <span style={{color: '#81E6D9'}}>Economic Vitality</span>
                </h2>
                <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9, lineHeight: '1.6' }}>
                    Visit Dana Point's marketing engine transforms global interest into verifiable community prosperity. We fill the rooms that fund the City.
                </p>
            </div>
            <div className="no-print">
               <ExportMenu title="Executive Impact Report" data={data} />
            </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', background: 'white' }}>
          <div style={{ padding: '32px', borderRight: '1px solid #EDF2F7' }}>
              <div style={{ color: '#718096', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icons.Money /> Est. Tax Impact
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1A365D', fontFamily: 'Segoe UI' }}>${totGenerated}M</div>
              <div style={{ fontSize: '0.9rem', color: '#4A5568', marginTop: '4px' }}>Generated in TOT for City General Fund</div>
              <div style={{ fontSize: '0.75rem', color: '#A0AEC0', marginTop: '12px' }}>Source: 10% of STR Revenue</div>
          </div>
          <div style={{ padding: '32px', borderRight: '1px solid #EDF2F7' }}>
              <div style={{ color: '#718096', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icons.Growth /> Jobs Supported
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#D69E2E', fontFamily: 'Segoe UI' }}>{jobsSupported}</div>
              <div style={{ fontSize: '0.9rem', color: '#4A5568', marginTop: '4px' }}>Local livelihoods fueled by tourism</div>
              <div style={{ fontSize: '0.75rem', color: '#A0AEC0', marginTop: '12px' }}>Source: Est. 1 Job / $200k Spend</div>
          </div>
          <div style={{ padding: '32px' }}>
              <div style={{ color: '#718096', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icons.Strategy /> Econ. Multiplier
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#006B76', fontFamily: 'Segoe UI' }}>{budgetRatio}x</div>
              <div style={{ fontSize: '0.9rem', color: '#4A5568', marginTop: '4px' }}>Visitor Spend vs. Est. City Budget</div>
              <div style={{ fontSize: '0.75rem', color: '#A0AEC0', marginTop: '12px' }}>Source: Datafy Spend / City Budget</div>
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
          contents: 'Search for the latest 2024-2025 tourism industry news ONLY from these vetted sources: CoStar, Tourism Economics, Destinations International, Brand USA, and Visit California. Also check "site:visitdanapoint.com" and "site:danapoint.org" for recent events. Find 3-4 key trends regarding hotel occupancy, visitor spending, or drive-market travel in California. For EACH item, explicitly explain how it relates to Visit Dana Point data ($481M spend, $262 ADR, 64% Occupancy). Strictly format: **Source & Date** | **Headline** | **Insight** | **VDP Connection**. Do NOT invent news.',
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
              <h3 style={{ margin: 0, border: 'none', padding: 0, color: '#1A365D' }}>Latest Industry Intelligence</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#718096' }}>Curated insights from vetted tourism sources & Local Feeds.</p>
            </div>
            <div style={{display: 'flex', gap: '8px'}}>
                 <ExportMenu title="Industry News Feed" data={{newsText: news?.text}} />
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
                  <Icons.Refresh /> {loading ? 'Scanning...' : 'Refresh'}
                </button>
            </div>
        </div>
        
        {loading ? (
             <div style={{ padding: '60px', textAlign: 'center', color: '#718096', fontStyle: 'italic', background: '#F7FAFC', borderRadius: '12px' }}>
                 <div style={{ marginBottom: '16px', fontWeight: '500' }}>Scanning vetted industry sources...</div>
                 <div style={{ width: '40px', height: '40px', border: '3px solid #CBD5E0', borderTop: '3px solid #006B76', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
             </div>
        ) : (
            <>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#2D3748' }}>
                    {news?.text.split('\n').map((line, i) => {
                        const cleanLine = line.trim();
                        if (!cleanLine) return null;
                        
                        const isHeader = cleanLine.startsWith('**') && cleanLine.endsWith('**');
                        const isList = cleanLine.startsWith('* ') || cleanLine.startsWith('- ') || cleanLine.startsWith('• ');
                        const content = isList ? cleanLine.substring(1).trim() : cleanLine;

                        return (
                            <div key={i} style={{ marginBottom: isHeader ? '8px' : '12px', display: isList ? 'flex' : 'block', gap: '10px' }}>
                                {isList && <span style={{color:'#006B76', marginTop:'6px', flexShrink: 0}}>●</span>}
                                <div style={{ fontWeight: isHeader ? '700' : '400', color: isHeader ? '#1A365D' : 'inherit', fontSize: isHeader ? '1.05rem' : '0.95rem' }}>{parseBold(content)}</div>
                            </div>
                        );
                    })}
                </div>
                {news?.chunks && news.chunks.length > 0 && (
                    <div style={{ marginTop: '24px', borderTop: '1px solid #EDF2F7', paddingTop: '16px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#718096', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Source Links</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {news.chunks.map((chunk, i) => {
                                if (chunk.web?.uri) {
                                    return (
                                        <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" 
                                           style={{ fontSize: '0.75rem', color: '#006B76', textDecoration: 'none', background: '#E6FFFA', padding: '4px 10px', borderRadius: '4px', border: '1px solid #B2F5EA', transition: 'all 0.2s', fontWeight: '500' }}>
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
    <h3 style={{ color: '#006B76', borderBottomColor: '#B2F5EA' }}>🚀 PRIORITY ACTIONS</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {actions.map((action, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < actions.length - 1 ? '1px solid #EDF2F7' : 'none', paddingBottom: i < actions.length - 1 ? '12px' : '0' }}>
          <div>
            <div style={{ fontWeight: '700', color: '#2D3748' }}>{action.title}</div>
            <div style={{ fontSize: '0.85rem', color: '#718096' }}>{action.desc}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
             <div style={{ fontWeight: '800', color: '#006B76', fontSize: '1.1rem' }}>{action.impact}</div>
             <div style={{ fontSize: '0.7rem', color: '#A0AEC0', textTransform: 'uppercase' }}>Est. Impact</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TabPulse = ({ data, onHomeClick }) => {
  return (
    <div className="tab-content fade-in">
      <DmoImpactPanel data={data} />
      
      <div style={{ marginTop: '24px' }}>
        <HeadlineInsight headline={data.pulse.headline} />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '24px', 
        marginTop: '24px' 
      }}>
        {data.pulse.kpis.map((kpi, i) => (
          <KPICard key={i} data={kpi} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '24px' }}>
         <IndustryNewsSection />
         <ActionItems actions={data.pulse.actions} />
      </div>
    </div>
  );
};

// --- VISUALIZATIONS ---
const SmoothTrendChart = ({ data, target }) => {
    // Generate smooth bezier curve path
    const max = 80; const min = 50; const range = max - min;
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return {x, y, val};
    });

    // Simple smooth curve generator
    const generatePath = (pts) => {
        let path = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const curr = pts[i];
            const next = pts[i + 1];
            // Control points for bezier (simple smoothing)
            const cp1x = curr.x + (next.x - curr.x) / 2;
            const cp1y = curr.y;
            const cp2x = curr.x + (next.x - curr.x) / 2;
            const cp2y = next.y;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
        }
        return path;
    };

    const linePath = generatePath(points);
    const areaPath = `${linePath} L 100 100 L 0 100 Z`;
    const targetY = 100 - ((target - min) / range) * 100;

    return (
        <div style={{ height: '240px', width: '100%', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{overflow: 'visible'}}>
                <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#006B76" stopOpacity="0.5"/>
                        <stop offset="100%" stopColor="#006B76" stopOpacity="0"/>
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                
                {/* Grid */}
                {[0, 25, 50, 75, 100].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#E2E8F0" strokeWidth="0.5" />)}
                
                {/* Target Line */}
                <line x1="0" y1={targetY} x2="100" y2={targetY} stroke="#48BB78" strokeWidth="1" strokeDasharray="4,4" />
                
                {/* Area & Line */}
                <path d={areaPath} fill="url(#chartGradient)" />
                <path d={linePath} fill="none" stroke="#006B76" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)" />
                
                {/* Points */}
                {points.map((p, i) => (
                    <g key={i}>
                         <circle cx={p.x} cy={p.y} r="2" fill="white" stroke="#006B76" strokeWidth="1.5" />
                    </g>
                ))}
            </svg>
            <div style={{ position: 'absolute', top: `${targetY}%`, right: '0', transform: 'translateY(-140%)', fontSize: '0.7rem', color: '#48BB78', fontWeight: 'bold', background: '#F0FFF4', padding: '2px 6px', borderRadius: '4px', border: '1px solid #C6F6D5' }}>Target {target}%</div>
        </div>
    );
};

const TabHospitality = ({ data }) => {
    const h = data.hospitality;
    return (
        <div className="tab-content fade-in">
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '16px'}}>
                <h2 style={{fontSize: '1.5rem', margin:0, color: '#1A365D'}}>Hospitality Performance</h2>
                <ExportMenu title="Hospitality Report" data={h} />
             </div>
            <div className="grid-2">
                <div className="card">
                    <h3>Occupancy Trend (2024)</h3>
                    <SmoothTrendChart data={h.occupancyTrend} target={70} />
                </div>
                <div className="card">
                    <h3>RevPAR Benchmarks</h3>
                     <div style={{display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '10px'}}>
                        {h.benchmarks.map((b, i) => (
                            <div key={i}>
                                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px'}}>
                                    <span style={{fontWeight: '600', color: '#2D3748'}}>{b.name}</span>
                                    <span style={{color: '#718096'}}>{b.label}</span>
                                </div>
                                <div style={{height: '16px', background: '#EDF2F7', borderRadius: '8px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'}}>
                                    <div style={{width: `${(b.value/150)*100}%`, background: b.color, height: '100%', borderRadius: '0 8px 8px 0', transition: 'width 1s ease-out'}}></div>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
             <div className="card" style={{marginTop: '24px'}}>
                <h3>Property Class Performance</h3>
                <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem'}}>
                    <thead>
                        <tr style={{borderBottom: '2px solid #EDF2F7', textAlign: 'left'}}>
                            <th style={{padding: '16px', color: '#718096'}}>Class</th>
                            <th style={{padding: '16px', color: '#718096'}}>Occupancy</th>
                            <th style={{padding: '16px', color: '#718096'}}>ADR</th>
                            <th style={{padding: '16px', color: '#718096'}}>RevPAR</th>
                            <th style={{padding: '16px', color: '#718096'}}>YoY Growth</th>
                        </tr>
                    </thead>
                    <tbody>
                        {h.propertyClass.map((p, i) => (
                            <tr key={i} style={{borderBottom: '1px solid #EDF2F7'}}>
                                <td style={{padding: '16px', fontWeight: '600', color: '#2D3748'}}>{p.name}</td>
                                <td style={{padding: '16px'}}>{p.occ}</td>
                                <td style={{padding: '16px'}}>{p.adr}</td>
                                <td style={{padding: '16px'}}>{p.revpar}</td>
                                <td style={{padding: '16px', fontWeight: 'bold', color: p.growth.includes('+') ? '#38A169' : '#E53E3E'}}>{p.growth}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
};

const TabEconomics = ({ data }) => {
    const e = data.economics;
    return (
        <div className="tab-content fade-in">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '16px'}}>
                <h2 style={{fontSize: '1.5rem', margin:0, color: '#1A365D'}}>Economic Impact</h2>
                <ExportMenu title="Economic Report" data={e} />
            </div>
            <div className="card">
                <h3>Visitor Spend Distribution</h3>
                 <div style={{display: 'flex', gap: '4px', height: '36px', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                    {e.categories.map((c, i) => (
                        <div key={i} style={{width: `${c.pct}%`, background: ['#3182CE', '#38A169', '#D69E2E', '#805AD5'][i], position: 'relative'}} title={`${c.name}: ${c.pct}%`}></div>
                    ))}
                </div>
                <div className="grid-2">
                    {e.categories.map((c, i) => (
                        <div key={i} style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: '#F7FAFC', borderRadius: '8px'}}>
                            <div style={{width: '16px', height: '16px', borderRadius: '4px', background: ['#3182CE', '#38A169', '#D69E2E', '#805AD5'][i]}}></div>
                            <div style={{flex: 1}}>
                                <div style={{fontWeight: '700', fontSize: '0.95rem', color: '#2D3748'}}>{c.name}</div>
                                <div style={{color: '#718096', fontSize: '0.85rem'}}>${c.val}M ({c.pct}%)</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <div className="card" style={{marginTop: '24px'}}>
                <h3>Conversion Scenarios (Day-Tripper to Overnight)</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px'}}>
                    {e.scenarios.map((s, i) => (
                        <div key={i} style={{padding: '24px', background: i === 0 ? 'white' : '#F0FFF4', borderRadius: '16px', border: i === 0 ? '1px solid #E2E8F0' : '1px solid #C6F6D5', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'}}>
                            <div style={{fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px', color: '#718096', textTransform: 'uppercase'}}>{s.label}</div>
                            <div style={{fontSize: '2rem', fontWeight: '800', color: '#1A365D'}}>${s.spend}M</div>
                            {s.gain > 0 && <div style={{fontSize: '0.9rem', color: '#38A169', fontWeight: '700', marginTop: '4px'}}>+${s.gain}M Impact</div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TabGrowth = ({ data }) => {
    const g = data.growth;
    return (
        <div className="tab-content fade-in">
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '16px'}}>
                <h2 style={{fontSize: '1.5rem', margin:0, color: '#1A365D'}}>Visitor Origins</h2>
                <ExportMenu title="Growth Report" data={g} />
            </div>
             <div className="grid-2">
                 <div className="card">
                    <h3>Key Source Markets</h3>
                    {g.markets.map((m, i) => (
                        <div key={i} style={{marginBottom: '20px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
                                <span style={{fontWeight: '700', color: '#2D3748'}}>{m.name}</span>
                                <span style={{color: '#38A169', fontSize: '0.85rem', fontWeight: '600'}}>{m.growth}</span>
                            </div>
                            <div style={{height: '10px', background: '#EDF2F7', borderRadius: '5px', overflow: 'hidden'}}>
                                <div style={{width: `${m.share * 2}%`, background: 'linear-gradient(90deg, #4299E1, #3182CE)', height: '100%', borderRadius: '5px'}}></div>
                            </div>
                            <div style={{textAlign: 'right', fontSize: '0.75rem', color: '#718096', marginTop: '4px'}}>{m.val} visitors</div>
                        </div>
                    ))}
                 </div>
                 <div className="card">
                     <h3>Demographic Profile</h3>
                     <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                         {g.demographics.map((d, i) => (
                             <div key={i} style={{padding: '20px', background: '#F7FAFC', borderRadius: '16px', textAlign: 'center', border: '1px solid #EDF2F7'}}>
                                 <div style={{fontSize: '1.8rem', fontWeight: '800', color: '#1A365D'}}>{d.value}</div>
                                 <div style={{fontSize: '0.85rem', color: '#718096', fontWeight: '500'}}>{d.label}</div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
        </div>
    );
};

const TabDigital = ({ data }) => {
    const d = data.digital;
    return (
        <div className="tab-content fade-in">
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '16px'}}>
                <h2 style={{fontSize: '1.5rem', margin:0, color: '#1A365D'}}>Digital Intelligence</h2>
                <ExportMenu title="Digital Report" data={d} />
            </div>
            <div className="card">
                <h3>Website Conversion Funnel</h3>
                {d.funnel.map((step, i) => (
                     <div key={i} style={{display: 'flex', alignItems: 'center', marginBottom: '16px', opacity: 1 - i*0.1}}>
                        <div style={{width: '140px', fontWeight: '600', fontSize: '0.9rem', color: '#2D3748'}}>{step.stage}</div>
                        <div style={{flex: 1, background: '#EDF2F7', height: '32px', margin: '0 16px', borderRadius: '6px', position: 'relative', overflow: 'hidden'}}>
                            <div style={{width: step.rate, background: step.alert ? '#E53E3E' : '#006B76', height: '100%', borderRadius: '6px', transition: 'width 1s'}}></div>
                        </div>
                        <div style={{width: '100px', textAlign: 'right', fontWeight: '700', fontSize: '1rem'}}>{step.count.toLocaleString()}</div>
                     </div>
                ))}
            </div>
            <div className="grid-2" style={{marginTop: '24px'}}>
                <div className="card">
                     <h3>Top Pages</h3>
                     <ul style={{listStyle: 'none', padding: 0}}>
                         {d.pages.map((p, i) => (
                             <li key={i} style={{padding: '12px 0', borderBottom: '1px solid #EDF2F7', display: 'flex', justifyContent: 'space-between', color: p.alert ? '#E53E3E' : 'inherit'}}>
                                 <span style={{fontWeight: '500'}}>{p.name}</span>
                                 <span style={{background: '#F7FAFC', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem'}}>{p.views.toLocaleString()}</span>
                             </li>
                         ))}
                     </ul>
                </div>
                 <div className="card">
                     <h3>Sentiment Analysis</h3>
                     {d.sentiment.map((s, i) => (
                         <div key={i} style={{marginBottom: '16px'}}>
                             <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px'}}>
                                 <span style={{fontWeight: '600'}}>{s.cat}</span>
                                 <span style={{color: '#38A169', fontWeight: 'bold'}}>{s.pos}% Pos</span>
                             </div>
                             <div style={{height: '8px', background: '#FED7D7', borderRadius: '4px', overflow: 'hidden'}}>
                                 <div style={{width: `${s.pos}%`, background: '#38A169', height: '100%', borderRadius: '4px'}}></div>
                             </div>
                         </div>
                     ))}
                </div>
            </div>
        </div>
    );
};

const TabEvents = ({ data }) => {
    const e = data.events;
    return (
        <div className="tab-content fade-in">
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '16px'}}>
                <h2 style={{fontSize: '1.5rem', margin:0, color: '#1A365D'}}>Event Strategy</h2>
                <ExportMenu title="Events Report" data={e} />
            </div>
            <div className="card">
                <h3>Signature Event: Ohana Festival Impact</h3>
                <div style={{display: 'flex', alignItems: 'flex-end', gap: '24px', height: '240px', marginTop: '24px', paddingBottom: '20px'}}>
                    {e.ohana.map((o, i) => (
                        <div key={i} style={{flex: 1, textAlign: 'center'}}>
                            <div style={{height: `${(o.spend/220)*100}%`, background: 'linear-gradient(180deg, #9F7AEA, #805AD5)', borderRadius: '8px 8px 0 0', position: 'relative', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
                                <span style={{position: 'absolute', top: '-25px', width: '100%', left: 0, fontSize: '0.85rem', fontWeight: '800', color: '#553C9A'}}>${o.spend}M</span>
                            </div>
                            <div style={{marginTop: '12px', fontSize: '0.9rem', fontWeight: '700', color: '#2D3748'}}>{o.year}</div>
                            <div style={{fontSize: '0.8rem', color: '#718096'}}>{o.att}k Attn</div>
                        </div>
                    ))}
                </div>
            </div>
             <div className="card" style={{marginTop: '24px'}}>
                 <h3>Seasonality & Gap Analysis</h3>
                 <p style={{fontSize: '0.9rem', color: '#718096'}}>Identifying low-season opportunities for new event development.</p>
                 <div style={{display: 'flex', gap: '6px', height: '180px', alignItems: 'flex-end', marginTop: '24px'}}>
                     {e.seasonality.map((val, i) => (
                         <div key={i} style={{flex: 1, background: val < 5 ? '#FC8181' : '#63B3ED', height: `${(val/8)*100}%`, borderRadius: '4px', position: 'relative', opacity: 0.9}} title={`Month ${i+1}: $${val}M`}>
                         </div>
                     ))}
                 </div>
                 <div style={{marginTop: '16px', display: 'flex', gap: '24px', fontSize: '0.85rem'}}>
                     <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><div style={{width: '12px', height: '12px', background: '#FC8181', borderRadius: '2px'}}></div> Need Period</div>
                     <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><div style={{width: '12px', height: '12px', background: '#63B3ED', borderRadius: '2px'}}></div> Peak Season</div>
                 </div>
             </div>
        </div>
    );
};

const TabStrategic = ({ data }) => {
    const s = data.strategic;
    return (
        <div className="tab-content fade-in">
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '16px'}}>
                <h2 style={{fontSize: '1.5rem', margin:0, color: '#1A365D'}}>2026 Strategy</h2>
                <ExportMenu title="Strategy Scorecard" data={s} />
            </div>
             <div className="card">
                 <h3>Strategic Scorecard</h3>
                 <div style={{overflowX: 'auto'}}>
                     <table style={{width: '100%', borderCollapse: 'collapse'}}>
                         <thead>
                             <tr style={{textAlign: 'left', borderBottom: '2px solid #EDF2F7'}}>
                                 <th style={{padding: '16px', color: '#718096'}}>Metric</th>
                                 <th style={{padding: '16px', color: '#718096'}}>Current</th>
                                 <th style={{padding: '16px', color: '#718096'}}>2026 Target</th>
                                 <th style={{padding: '16px', color: '#718096'}}>Status</th>
                             </tr>
                         </thead>
                         <tbody>
                             {s.scorecard.map((row, i) => (
                                 <tr key={i} style={{borderBottom: '1px solid #EDF2F7'}}>
                                     <td style={{padding: '16px', fontWeight: '600', color: '#2D3748'}}>{row.name}</td>
                                     <td style={{padding: '16px'}}>{row.current}</td>
                                     <td style={{padding: '16px'}}>{row.target}</td>
                                     <td style={{padding: '16px'}}>
                                         <span style={{
                                             padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                                             background: row.status === 'green' ? '#C6F6D5' : row.status === 'yellow' ? '#FEFCBF' : '#FED7D7',
                                             color: row.status === 'green' ? '#22543D' : row.status === 'yellow' ? '#744210' : '#822727'
                                         }}>
                                             {row.status.toUpperCase()}
                                         </span>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
             <div className="card" style={{marginTop: '24px'}}>
                 <h3>Strategic Initiatives</h3>
                 <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
                     {s.initiatives.map((init, i) => (
                         <div key={i} style={{padding: '24px', border: '1px solid #E2E8F0', borderRadius: '12px', background: '#F7FAFC'}}>
                             <div style={{fontWeight: '700', color: '#1A365D', marginBottom: '8px', fontSize: '1.05rem'}}>{init.name}</div>
                             <div style={{fontSize: '0.9rem', color: '#718096', marginBottom: '4px'}}>Owner: {init.owner}</div>
                             <div style={{fontSize: '0.9rem', color: '#006B76', fontWeight: '700'}}>ROI: {init.roi}</div>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    );
};

const AIAnalystTab = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
            systemInstruction: "You are an expert Data Analyst for Visit Dana Point. Answer questions based on tourism data.",
        }
      });
      setResponse(result.text);
    } catch (e) {
      setResponse("Error analyzing data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content fade-in">
        <div className="card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
                <h3 style={{margin:0}}>🤖 AI Strategic Analyst</h3>
                {response && <ExportMenu title="AI Analysis" data={{query, response}} />}
            </div>
            
            <div style={{display:'flex', gap: '10px'}}>
                <input 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Ask about occupancy trends, visitor spending, or marketing ROI..."
                    style={{flex:1, padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E0'}}
                />
                <button onClick={handleAsk} disabled={loading} className="cta-button">
                    {loading ? 'Analyzing...' : 'Ask Analyst'}
                </button>
            </div>
            {response && (
                <div style={{marginTop: '20px', padding: '24px', background: '#F7FAFC', borderRadius: '12px', lineHeight: '1.7', border: '1px solid #E2E8F0'}}>
                    <div style={{fontWeight: 'bold', marginBottom: '12px', color: '#006B76', fontSize: '1.1rem'}}>Analyst Insight:</div>
                    <div style={{color: '#2D3748'}}>{parseBold(response)}</div>
                </div>
            )}
        </div>
    </div>
  );
};

const CreativeStudio = () => {
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setImage('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: prompt }]
                },
                config: {
                    imageConfig: {
                         aspectRatio: "16:9",
                    }
                }
            });
            
             for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setImage(`data:image/png;base64,${part.inlineData.data}`);
                }
            }
        } catch (e) {
            console.error(e);
            alert("Error generating image");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-content fade-in">
            <div className="card">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
                    <div>
                        <h3 style={{margin:0}}>🎨 Marketing Creative Studio</h3>
                        <p style={{margin: '4px 0 0', color: '#718096'}}>Generate concept art for campaigns.</p>
                    </div>
                    {image && <ExportMenu title="Creative Asset" data={{prompt, imageUrl: image}} />}
                </div>

                <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                    <input 
                        type="text" 
                        value={prompt} 
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="e.g., A luxury family picnic on Dana Point beach at sunset..."
                        style={{flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E0'}} 
                    />
                    <button onClick={handleGenerate} disabled={loading} className="cta-button">
                        {loading ? 'Generating...' : 'Create Visual'}
                    </button>
                </div>
                {image && (
                    <div style={{textAlign: 'center', background: '#2D3748', padding: '30px', borderRadius: '16px'}}>
                        <img src={image} alt="Generated Creative" style={{maxWidth: '100%', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'}} />
                    </div>
                )}
            </div>
        </div>
    );
};

// ... (DataUploadTab, TabGlossary remain similar) ...
const DataUploadTab = ({ currentData, onUpdate }) => {
    const [jsonText, setJsonText] = useState(JSON.stringify(currentData, null, 2));
    const [error, setError] = useState('');

    const handleSave = () => {
        try {
            const parsed = JSON.parse(jsonText);
            onUpdate(parsed);
            setError('');
            alert('Data updated successfully!');
        } catch (e) {
            setError('Invalid JSON format.');
        }
    };

    return (
        <div className="tab-content fade-in">
            <div className="card">
                <h3>💾 Data Management</h3>
                <p style={{fontSize: '0.9rem', color: '#718096'}}>Directly edit the JSON data powering this dashboard.</p>
                <textarea 
                    value={jsonText} 
                    onChange={e => setJsonText(e.target.value)}
                    style={{width: '100%', height: '400px', fontFamily: 'monospace', padding: '12px', border: '1px solid #CBD5E0', borderRadius: '8px', fontSize: '0.85rem'}}
                />
                {error && <div style={{color: 'red', marginTop: '8px'}}>{error}</div>}
                <div style={{marginTop: '16px', textAlign: 'right'}}>
                    <button onClick={handleSave} className="cta-button">Update Dashboard Data</button>
                </div>
            </div>
        </div>
    );
};

const TabGlossary = () => (
    <div className="tab-content fade-in">
        <div className="card">
            <h3>Metric Definitions & Sources</h3>
            <div style={{display: 'grid', gap: '24px'}}>
                {glossaryTerms.map((term, i) => (
                    <div key={i}>
                        <div style={{fontWeight: '700', color: '#2D3748'}}>{term.term}</div>
                        <div style={{fontSize: '0.95rem', color: '#4A5568', marginTop: '4px'}}>{term.def}</div>
                        <div style={{fontSize: '0.8rem', color: '#718096', marginTop: '4px', fontStyle: 'italic'}}>Source: {term.source}</div>
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
            <div className="no-print" style={{ background: '#2D3748', color: 'white', padding: '8px 48px', fontSize: '0.75rem', textAlign: 'center', letterSpacing: '0.05em' }}>
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