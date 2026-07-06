import React, { useMemo } from 'react';
import { Lead, LeadStage, PipelineStats } from '../types';
import { BarChart3, TrendingUp, DollarSign, Target, Award, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  leads: Lead[];
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ leads, onNavigate }: DashboardProps) {
  // 1. Calculate Pipeline Statistics
  const stats = useMemo((): PipelineStats => {
    const totalLeads = leads.length;
    const activeLeads = leads.filter(l => l.currentStage !== 'won' && l.currentStage !== 'lost').length;
    const wonLeads = leads.filter(l => l.currentStage === 'won');
    const lostLeads = leads.filter(l => l.currentStage === 'lost');
    
    const wonCount = wonLeads.length;
    const closedCount = wonCount + lostLeads.length;
    const overallWinRate = closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : 0;

    let totalValue = 0;
    let weightedValue = 0;

    leads.forEach(l => {
      totalValue += l.estimatedValue;
      let probability = 0;
      switch (l.currentStage) {
        case 'lead': probability = 0.1; break;
        case 'contacted': probability = 0.25; break;
        case 'meeting': probability = 0.5; break;
        case 'proposal': probability = 0.75; break;
        case 'won': probability = 1.0; break;
        case 'lost': probability = 0.0; break;
      }
      weightedValue += l.estimatedValue * probability;
    });

    const averageDealSize = wonCount > 0 
      ? Math.round(wonLeads.reduce((acc, curr) => acc + curr.estimatedValue, 0) / wonCount)
      : leads.length > 0 
        ? Math.round(leads.reduce((acc, curr) => acc + curr.estimatedValue, 0) / leads.length)
        : 0;

    return {
      totalLeads,
      activeLeads,
      wonLeads: wonCount,
      lostLeads: lostLeads.length,
      totalValue,
      weightedValue: Math.round(weightedValue),
      averageDealSize,
      overallWinRate
    };
  }, [leads]);

  // 2. Funnel Stages Definition
  const funnelStages = useMemo(() => {
    const stages: { key: LeadStage; label: string; count: number; value: number; color: string }[] = [
      { key: 'lead', label: 'Identified Leads', count: 0, value: 0, color: 'bg-slate-400' },
      { key: 'contacted', label: 'Outreach Sent', count: 0, value: 0, color: 'bg-indigo-400' },
      { key: 'meeting', label: 'Discovery Met', count: 0, value: 0, color: 'bg-purple-400' },
      { key: 'proposal', label: 'Proposal Pitched', count: 0, value: 0, color: 'bg-pink-400' },
      { key: 'won', label: 'Contracts Won', count: 0, value: 0, color: 'bg-emerald-400' }
    ];

    stages.forEach(s => {
      const stageLeads = leads.filter(l => l.currentStage === s.key);
      s.count = stageLeads.length;
      s.value = stageLeads.reduce((acc, curr) => acc + curr.estimatedValue, 0);
    });

    return stages;
  }, [leads]);

  // 3. AI Pipeline Health Diagnosis
  const pipelineAnalysis = useMemo(() => {
    const recommendations: { title: string; desc: string; type: 'warning' | 'success' | 'info' }[] = [];
    
    const leadCount = leads.filter(l => l.currentStage === 'lead').length;
    const outreachCount = leads.filter(l => l.currentStage === 'contacted').length;
    const meetingCount = leads.filter(l => l.currentStage === 'meeting').length;
    const proposalCount = leads.filter(l => l.currentStage === 'proposal').length;
    const wonCount = leads.filter(l => l.currentStage === 'won').length;

    // Diagnose Pipeline Shape
    if (leadCount <= 1) {
      recommendations.push({
        title: 'Top of Funnel is Starving',
        desc: 'You only have ' + leadCount + ' lead(s) in the cold research phase. Schedule 30 mins to scout 5 high-potential companies this week.',
        type: 'warning'
      });
    }

    if (outreachCount > leadCount * 2 && leadCount > 0) {
      recommendations.push({
        title: 'High Outreach Ratio',
        desc: 'You have plenty of contacted leads. Focus on secondary follow-ups with customized value additions to secure discovery meetings.',
        type: 'info'
      });
    }

    if (meetingCount > 0 && proposalCount === 0) {
      recommendations.push({
        title: 'Meeting Closure Gap',
        desc: 'You completed discovery calls but have 0 active proposals. Prepare highly outcome-oriented proposals to seal the deals.',
        type: 'warning'
      });
    }

    if (proposalCount >= 2) {
      recommendations.push({
        title: 'High Proposal Volume',
        desc: `You have ${proposalCount} pending proposals worth $${leads.filter(l => l.currentStage === 'proposal').reduce((a,c) => a+c.estimatedValue, 0).toLocaleString()}. Send a 48-hour gentle follow-up focusing on timeline and project kick-off details.`,
        type: 'success'
      });
    }

    if (stats.overallWinRate > 40) {
      recommendations.push({
        title: 'Elite Close Rate!',
        desc: `Your conversion from pitch to won is an outstanding ${stats.overallWinRate}%. Increase your pricing by 15-20% on the next proposal.`,
        type: 'success'
      });
    } else if (stats.overallWinRate < 15 && wonCount > 0) {
      recommendations.push({
        title: 'Low Lead Conversion',
        desc: `Your close rate is ${stats.overallWinRate}%. Try implementing shorter, highly friction-free diagnostic milestones to build client trust before pitching full contracts.`,
        type: 'warning'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Pipeline Status: Balanced',
        desc: 'Your acquisition pipeline has steady distribution. Keep launching 3 custom outreach pitches daily to maintain momentum.',
        type: 'info'
      });
    }

    return recommendations;
  }, [leads, stats]);

  return (
    <div className="space-y-8 text-left animate-fade-in" id="dashboard-tab">
      {/* 1. Header with stats overview */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-white">
            Freelance Acquisition Cockpit
          </h2>
          <p className="text-slate-400 mt-1">
            Real-time conversion metrics, deal analytics and automated outreach performance.
          </p>
        </div>
        
        <button
          onClick={() => onNavigate('leads')}
          className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg hover:shadow-pink-900/20 cursor-pointer text-sm"
          id="btn-goto-leads"
        >
          <span>Manage Leads</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Key metrics bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Deals</p>
            <h3 className="text-2xl font-display font-bold text-white">{stats.activeLeads}</h3>
            <p className="text-xs text-slate-400">{stats.totalLeads} total records</p>
          </div>
          <div className="p-3.5 bg-indigo-950/40 border border-indigo-900/30 text-indigo-400 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Pipe Value</p>
            <h3 className="text-2xl font-display font-bold text-white">${stats.totalValue.toLocaleString()}</h3>
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Full Potential</span>
            </p>
          </div>
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Weighted Pipe</p>
            <h3 className="text-2xl font-display font-bold text-white">${stats.weightedValue.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 font-medium">Based on deal stages</p>
          </div>
          <div className="p-3.5 bg-purple-950/40 border border-purple-900/30 text-purple-400 rounded-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Outreach Win Rate</p>
            <h3 className="text-2xl font-display font-bold text-white">{stats.overallWinRate}%</h3>
            <p className="text-xs text-slate-400">{stats.wonLeads} closed / won contracts</p>
          </div>
          <div className="p-3.5 bg-pink-950/40 border border-pink-900/30 text-pink-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Main Funnel Visualization and Health Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Funnel chart (8 cols) */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm lg:col-span-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-100">Acquisition Conversion Funnel</h3>
            <p className="text-xs text-slate-400 mt-0.5">Drop-off rate and value density per pipeline milestone.</p>
          </div>

          <div className="my-8 space-y-4">
            {funnelStages.map((stage, idx) => {
              // Calculate percent of leads relative to the top (first stage)
              const maxLeads = funnelStages[0].count || 1;
              const percentLeads = Math.round((stage.count / maxLeads) * 100);

              return (
                <div key={stage.key} className="flex items-center gap-4">
                  <div className="w-24 sm:w-36 text-right shrink-0">
                    <p className="text-xs font-semibold text-slate-300 truncate">{stage.label}</p>
                    <p className="text-[10px] text-indigo-400 font-mono font-medium">${stage.value.toLocaleString()}</p>
                  </div>
                  
                  <div className="grow bg-slate-950 h-10 rounded-lg flex items-center relative overflow-hidden border border-slate-850">
                    {/* Filled bar with transition */}
                    <div 
                      className={`h-full ${stage.color} opacity-85 transition-all duration-500 rounded-r-md flex items-center justify-between px-3`}
                      style={{ width: `${Math.max(percentLeads, stage.count > 0 ? 8 : 0)}%` }}
                    >
                      {stage.count > 0 && (
                        <span className="text-slate-950 text-xs font-extrabold font-mono">
                          {stage.count} {stage.count === 1 ? 'prospect' : 'prospects'}
                        </span>
                      )}
                    </div>
                    {/* Percentage indicator */}
                    <span className="absolute right-3 text-[10px] font-semibold text-slate-400 font-mono">
                      {idx === 0 ? 'Start' : `${percentLeads}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-800 pt-4 flex flex-wrap justify-between items-center text-xs text-slate-400">
            <span>Average Closed-Won Value: <strong className="text-emerald-400 font-mono">${stats.averageDealSize.toLocaleString()}</strong></span>
            <span>Total leads inside pipeline: <strong className="text-indigo-400 font-mono">{stats.totalLeads}</strong></span>
          </div>
        </div>

        {/* AI Health Advisor (4 cols) */}
        <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-xl lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-pink-500/10 text-pink-400 border border-pink-900/30 rounded-lg">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-base font-display font-bold text-white">Acquisition Advisor</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes your conversion data and triggers strategic plays to hit target goals.
            </p>

            <div className="mt-6 space-y-4">
              {pipelineAnalysis.map((tip, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 leading-relaxed border ${
                    tip.type === 'warning' 
                      ? 'bg-amber-950/50 border-amber-900/35 text-amber-300' 
                      : tip.type === 'success' 
                        ? 'bg-emerald-950/50 border-emerald-900/35 text-emerald-300' 
                        : 'bg-indigo-950/50 border-indigo-900/35 text-indigo-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0 text-slate-300">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-0.5">{tip.title}</h4>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-4">
            <button
              onClick={() => onNavigate('optimizer')}
              className="w-full flex items-center justify-between bg-slate-950 border border-slate-800 hover:bg-slate-800 text-xs font-semibold py-2.5 px-3 rounded-lg text-indigo-400 transition hover:text-white cursor-pointer"
              id="btn-suggest-niches"
            >
              <span>Explore Profitable Niches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Tips for Outbound Client Acquisition */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
        <h4 className="text-sm font-display font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>Cold Outreach Cheat Sheet for Software Freelancers</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-1.5 p-4 bg-slate-950 rounded-xl border border-slate-850">
            <h5 className="font-bold text-indigo-400">1. Focus on "Them" first</h5>
            <p className="text-slate-400">Never start with "Hi, I am a developer and I do X." Always start with a custom, highly specific observation about their company, website speed, or a specific feature they built.</p>
          </div>
          <div className="space-y-1.5 p-4 bg-slate-950 rounded-xl border border-slate-850">
            <h5 className="font-bold text-pink-400">2. Low Friction CTAs</h5>
            <p className="text-slate-400">Do not ask for a 30-minute call immediately. Ask an open, low-friction diagnostic question like "Is modernizing this client dashboard on your roadmap this quarter?" or "Open to a 5-min chat?"</p>
          </div>
          <div className="space-y-1.5 p-4 bg-slate-950 rounded-xl border border-slate-850">
            <h5 className="font-bold text-emerald-400">3. Follow up 3+ Times</h5>
            <p className="text-slate-400">Most deals are closed in follow-ups. Build a 3-4 step sequence with 3-5 days in between. Use each step to add value (e.g., sharing a performance tip, brief roadmap, or mock-up designs).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
