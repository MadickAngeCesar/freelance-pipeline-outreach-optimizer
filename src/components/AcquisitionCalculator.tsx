import React, { useState, useMemo } from 'react';
import { Target, TrendingUp, AlertCircle, HelpCircle, BarChart3, Settings, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AcquisitionCalculator() {
  // Input parameters
  const [mrrGoal, setMrrGoal] = useState(10000);
  const [avgDealSize, setAvgDealSize] = useState(5000);
  const [replyRate, setReplyRate] = useState(15); // 15% reply on cold outreaches
  const [meetingRate, setMeetingRate] = useState(40); // 40% of replies agree to meet
  const [closeRate, setCloseRate] = useState(25); // 25% of meetings close successfully

  // Calculated pipeline requirements
  const metrics = useMemo(() => {
    // 1. Deals needed
    const dealsNeeded = Math.ceil(mrrGoal / avgDealSize);
    
    // 2. Discovery meetings needed
    const meetingsNeeded = Math.ceil(dealsNeeded / (closeRate / 100));
    
    // 3. Positive replies needed
    const repliesNeeded = Math.ceil(meetingsNeeded / (meetingRate / 100));
    
    // 4. Outreach pitches sent
    const pitchesNeeded = Math.ceil(repliesNeeded / (replyRate / 100));

    // Daily & Weekly targets (assuming 20 working days, 4 weeks)
    const dailyPitches = Math.ceil(pitchesNeeded / 20);
    const weeklyPitches = Math.ceil(pitchesNeeded / 4);

    return {
      dealsNeeded,
      meetingsNeeded,
      repliesNeeded,
      pitchesNeeded,
      dailyPitches,
      weeklyPitches
    };
  }, [mrrGoal, avgDealSize, replyRate, meetingRate, closeRate]);

  return (
    <div className="space-y-8 text-left animate-fade-in" id="calculator-tab">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight text-white">
          Client Acquisition Planner & Optimizer
        </h2>
        <p className="text-slate-400 mt-1 font-sans">
          Reverse-engineer your income goals into tangible pipeline activities. Optimize parameters to lower your outreach workload.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sliders Control Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-850 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Settings className="w-5 h-5 text-pink-500" />
            <h3 className="font-display font-bold text-slate-200 text-sm uppercase tracking-wide">Acquisition Variables</h3>
          </div>

          <div className="space-y-5">
            {/* Target MRR */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-300">Target Monthly Income Goal</span>
                <span className="text-pink-400 font-mono font-bold">${mrrGoal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="50000"
                step="1000"
                value={mrrGoal}
                onChange={e => setMrrGoal(Number(e.target.value))}
                className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$2,000</span>
                <span>$50,000 / mo</span>
              </div>
            </div>

            {/* Average Deal Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-300">Average Project / Deal Size</span>
                <span className="text-pink-400 font-mono font-bold">${avgDealSize.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={avgDealSize}
                onChange={e => setAvgDealSize(Number(e.target.value))}
                className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$1,000</span>
                <span>$25,000 / deal</span>
              </div>
            </div>

            {/* Cold Email Reply Rate */}
            <div className="space-y-1.5 border-t border-slate-800 pt-4">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-300">Outreach Reply Rate</span>
                <span className="text-indigo-400 font-mono font-bold">{replyRate}%</span>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                step="1"
                value={replyRate}
                onChange={e => setReplyRate(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>2% (Low)</span>
                <span>40% (Expert)</span>
              </div>
            </div>

            {/* Meeting Conversion Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-300">Reply → Meeting Scheduled Rate</span>
                <span className="text-indigo-400 font-mono font-bold">{meetingRate}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={meetingRate}
                onChange={e => setMeetingRate(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10% (Passive)</span>
                <span>80% (Highly Persuasive)</span>
              </div>
            </div>

            {/* Proposal Close Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-300">Discovery → Deal Closed-Won Rate</span>
                <span className="text-indigo-400 font-mono font-bold">{closeRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={closeRate}
                onChange={e => setCloseRate(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5%</span>
                <span>60% (High Trust)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Metrics & Funnel Visualization (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Daily / Weekly targets cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-pink-950/15 via-slate-900 to-slate-900 text-white p-5 rounded-2xl border border-slate-850 shadow-lg relative overflow-hidden">
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest block">Daily Outreach Quota</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-display font-black text-white">{metrics.dailyPitches}</span>
                <span className="text-xs text-slate-400">custom pitches / day</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">Assumes 20 workdays a month. Extremely achievable with AI-tailored template automation.</p>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-850 shadow-lg">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Weekly Pipeline Quota</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-display font-black text-white">{metrics.weeklyPitches}</span>
                <span className="text-xs text-slate-400">custom pitches / week</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">Weekly batch pipeline requirement. Maintaining this volume keeps your business growing.</p>
            </div>
          </div>

          {/* Reverse Funnel visualization */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-850 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-display font-bold text-slate-200">Your Reverse-Engineered Acquisition Pipeline</h3>
              <p className="text-xs text-slate-400 mt-0.5">Required monthly workload targets to land {metrics.dealsNeeded} client contract(s).</p>
            </div>

            <div className="space-y-4">
              {/* Funnel row 1: Outreach pitches */}
              <div className="flex items-center gap-4 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                <div className="w-10 h-10 bg-slate-800 text-slate-200 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                  {metrics.pitchesNeeded}
                </div>
                <div className="grow text-xs">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>1. High-Value Custom Outreaches Sent</span>
                    <span className="font-mono text-slate-400">{replyRate}% Reply Rate</span>
                  </div>
                  <p className="text-slate-400 mt-0.5 text-[11px]">Identify target prospects and dispatch highly bespoke, personalized cold pitches.</p>
                </div>
              </div>

              {/* Funnel row 2: Replies */}
              <div className="flex items-center gap-4 bg-indigo-950/10 p-3 rounded-xl border border-indigo-900/30">
                <div className="w-10 h-10 bg-indigo-950/40 text-indigo-400 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                  {metrics.repliesNeeded}
                </div>
                <div className="grow text-xs">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>2. Warm Positive Responses Secured</span>
                    <span className="font-mono text-indigo-400">{meetingRate}% Booking Success</span>
                  </div>
                  <p className="text-slate-400 mt-0.5 text-[11px]">Replies expressing curiosity. Follow up instantly with a brief calendar link.</p>
                </div>
              </div>

              {/* Funnel row 3: Meetings */}
              <div className="flex items-center gap-4 bg-purple-950/10 p-3 rounded-xl border border-purple-900/30">
                <div className="w-10 h-10 bg-purple-950/40 text-purple-400 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                  {metrics.meetingsNeeded}
                </div>
                <div className="grow text-xs">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>3. Discovery Consultation Calls Hosted</span>
                    <span className="font-mono text-purple-400">{closeRate}% Close Ratio</span>
                  </div>
                  <p className="text-slate-400 mt-0.5 text-[11px]">Met via Zoom/Meet, analyzed system bottlenecks, and delivered a bespoke proposal.</p>
                </div>
              </div>

              {/* Funnel row 4: Contracts Won */}
              <div className="flex items-center gap-4 bg-emerald-950/10 p-3.5 rounded-xl border border-emerald-900/30">
                <div className="w-10 h-10 bg-emerald-950/40 text-emerald-400 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                  {metrics.dealsNeeded}
                </div>
                <div className="grow text-xs">
                  <div className="flex justify-between font-bold text-white">
                    <span>4. Deals Signed & Contracts Won!</span>
                    <span className="text-emerald-400 font-mono">${(metrics.dealsNeeded * avgDealSize).toLocaleString()} Revenue / Mo</span>
                  </div>
                  <p className="text-slate-300 mt-0.5 text-[11px]">Success! Down payments collected, timelines locked, and contract initiated.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Optimization advice */}
          <div className="bg-amber-950/15 p-5 rounded-2xl border border-amber-900/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-amber-200">Strategic Acquisition Optimization Advice:</h4>
              <p className="text-slate-300 leading-relaxed">
                By increasing your <strong>Average Deal Size</strong> to <strong>${Math.round(avgDealSize * 1.3).toLocaleString()}</strong> and utilizing our AI Personalization Generator to bump your <strong>Reply Rate</strong> to <strong>{Math.min(replyRate + 5, 40)}%</strong>, your required monthly outreach volume would collapse by over <strong>30%</strong> while maintaining the exact same income goal!
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
