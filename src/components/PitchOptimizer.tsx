import React, { useState } from 'react';
import { Sparkles, AlertTriangle, Check, Copy, ShieldAlert, Award, ChevronRight, HelpCircle } from 'lucide-react';

export default function PitchOptimizer() {
  // Pitch Critique States
  const [pitchText, setPitchText] = useState(
    "Hi,\n\nI am a freelance React and Node.js developer with 5 years of experience. I saw your website and would love to build a web application or mobile app for your company. I have flexible rates and can start immediately.\n\nLet me know if you want to hop on a call next week to discuss this.\n\nBest,\n[Name]"
  );
  const [pitchNiche, setPitchNiche] = useState("SaaS Founders");
  const [critiqueLoading, setCritiqueLoading] = useState(false);
  const [critiqueError, setCritiqueError] = useState<string | null>(null);
  
  // Critique results
  const [critiqueScore, setCritiqueScore] = useState<number | null>(null);
  const [critiquePoints, setCritiquePoints] = useState<string[]>([]);
  const [optimizedVersion, setOptimizedVersion] = useState('');
  const [subjectSuggestion, setSubjectSuggestion] = useState('');
  const [copiedRewrite, setCopiedRewrite] = useState(false);

  // Niche Recommendations States
  const [developerSkills, setDeveloperSkills] = useState("Next.js, React, Tailwind, PostgreSQL, Serverless Node, Supabase");
  const [nicheLoading, setNicheLoading] = useState(false);
  const [nicheError, setNicheError] = useState<string | null>(null);
  const [nicheRecommendations, setNicheRecommendations] = useState<Array<{
    name: string;
    opportunity: string;
    painPoints: string;
    angle: string;
  }>>([]);

  // 1. Submit Pitch Critique
  const handleCritiqueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchText) return;

    setCritiqueLoading(true);
    setCritiqueError(null);
    setCopiedRewrite(false);

    try {
      const response = await fetch('/api/optimize-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pitch: pitchText,
          niche: pitchNiche
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze outreach.');
      }

      const data = await response.json();
      setCritiqueScore(data.score || 70);
      setCritiquePoints(data.critiquePoints || []);
      setOptimizedVersion(data.optimizedVersion || '');
      setSubjectSuggestion(data.subjectSuggestion || '');
    } catch (err: any) {
      console.error(err);
      setCritiqueError(err.message || 'Error connecting to pitch analysis engine.');
    } finally {
      setCritiqueLoading(false);
    }
  };

  // 2. Submit Niche Recommendations
  const handleNicheSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!developerSkills) return;

    setNicheLoading(true);
    setNicheError(null);

    try {
      const response = await fetch('/api/recommend-niches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: developerSkills
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to suggest niches.');
      }

      const data = await response.json();
      setNicheRecommendations(data.niches || []);
    } catch (err: any) {
      console.error(err);
      setNicheError(err.message || 'Error connecting to niche analyzer.');
    } finally {
      setNicheLoading(false);
    }
  };

  const handleCopyRewrite = () => {
    const fullText = subjectSuggestion ? `Subject: ${subjectSuggestion}\n\n${optimizedVersion}` : optimizedVersion;
    navigator.clipboard.writeText(fullText);
    setCopiedRewrite(true);
    setTimeout(() => setCopiedRewrite(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30';
    if (score >= 70) return 'text-amber-400 bg-amber-950/20 border-amber-900/30';
    return 'text-rose-400 bg-rose-950/20 border-rose-900/30';
  };

  return (
    <div className="space-y-12 animate-fade-in" id="optimizer-tab">
      
      {/* SECTION 1: Pitch Critique and Optimize */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-850 shadow-xl space-y-4">
          <div className="text-left">
            <h3 className="text-base font-display font-bold text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />
              <span>Pitch Critique Coach</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Paste a draft message, and the AI coach will evaluate hook strength and rewrite it to double response rates.</p>
          </div>

          <form onSubmit={handleCritiqueSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Persona / Niche</label>
              <input
                type="text"
                placeholder="e.g. Shopify Store Owners, SaaS Founders"
                value={pitchNiche}
                onChange={e => setPitchNiche(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-950 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Outreach Draft Pitch *</label>
              <textarea
                required
                rows={10}
                value={pitchText}
                onChange={e => setPitchText(e.target.value)}
                className="w-full p-3.5 text-xs border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-950 text-slate-100 leading-relaxed font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={critiqueLoading || !pitchText}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 disabled:from-slate-800 disabled:to-slate-850 disabled:text-slate-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition cursor-pointer text-xs"
              id="btn-critique-pitch"
            >
              <span>{critiqueLoading ? 'Critiquing Pitch...' : 'Analyze & Rewrite Pitch'}</span>
            </button>
          </form>
        </div>

        {/* Results panel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl border border-slate-850 shadow-xl flex flex-col justify-between h-auto min-h-[450px]">
          {critiqueError && (
            <div className="p-4 bg-rose-950/20 border border-rose-900/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold">Analysis Error</h4>
                <p>{critiqueError}</p>
              </div>
            </div>
          )}

          {critiqueLoading ? (
            <div className="my-auto py-16 flex flex-col items-center justify-center space-y-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-xs text-slate-400 font-medium">Deconstructing hook patterns, value propositions, and phrasing...</p>
            </div>
          ) : critiqueScore !== null ? (
            <div className="space-y-6 text-left">
              
              {/* Header metrics */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-200">Coach Feedback Report</h4>
                  <p className="text-[11px] text-slate-400">Calculated based on outbound reply triggers.</p>
                </div>
                
                <div className={`px-4 py-2 rounded-xl border text-center flex items-center gap-2.5 ${getScoreColor(critiqueScore)}`}>
                  <div className="text-left">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Persuasion</p>
                    <p className="text-xs font-bold leading-none text-slate-300">Score Index</p>
                  </div>
                  <span className="text-3xl font-display font-black">{critiqueScore}%</span>
                </div>
              </div>

              {/* Actionable Critiques */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-300">3 Key Areas of Improvement:</h5>
                <ul className="space-y-2">
                  {critiquePoints.map((pt, idx) => (
                    <li key={idx} className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
                      <span className="w-5 h-5 bg-slate-800 text-pink-400 font-bold font-mono rounded-full flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rewritten output */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-bold text-slate-300">High-Converting Version Rewrite:</h5>
                  <button
                    onClick={handleCopyRewrite}
                    className="flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 font-semibold cursor-pointer"
                  >
                    {copiedRewrite ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Pitch</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 space-y-3">
                  {subjectSuggestion && (
                    <div className="text-xs pb-2 border-b border-slate-800">
                      <span className="text-slate-400 font-medium">Suggested Subject Line:</span>{' '}
                      <strong className="text-pink-300">{subjectSuggestion}</strong>
                    </div>
                  )}
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {optimizedVersion}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="my-auto py-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
              <HelpCircle className="w-8 h-8 text-pink-400" />
              <div>
                <h4 className="font-semibold text-slate-300">Awaiting Pitch Draft</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">Paste a standard cold email or message on the left to analyze layout issues, CTAs, and generate an elite rewrite.</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* SECTION 2: Tech-Stack Niche Suggestor */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-850 shadow-xl text-left text-white">
        <div className="mb-6 pb-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-display font-bold text-slate-100 flex items-center gap-1.5">
              <Award className="w-5 h-5 text-pink-500" />
              <span>Niche Finder & Positioning Planner</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Define your engineering skills, and AI will map out 3 high-paying outbound niches, listing primary client pain points and angles.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Skill Input (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <form onSubmit={handleNicheSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Developer Skills / Stack *</label>
                <textarea
                  required
                  rows={4}
                  value={developerSkills}
                  onChange={e => setDeveloperSkills(e.target.value)}
                  placeholder="e.g. Next.js performance, WebGL custom charts, API integrations, Headless e-commerce Shopify liquid"
                  className="w-full p-3 text-xs border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-950 text-slate-100 leading-relaxed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block leading-normal">
                  List tools, libraries, or specific results (like page load speed, checkout performance) you excel in.
                </span>
              </div>

              <button
                type="submit"
                disabled={nicheLoading || !developerSkills}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 disabled:from-slate-800 disabled:to-slate-850 disabled:text-slate-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow transition cursor-pointer text-xs"
                id="btn-suggest-niches"
              >
                <span>{nicheLoading ? 'Scouting Opportunities...' : 'Identify Lucrative Niches'}</span>
              </button>
            </form>
          </div>

          {/* Suggested Niches (8 cols) */}
          <div className="lg:col-span-8">
            {nicheError && (
              <div className="p-4 bg-rose-950/20 border border-rose-900/30 rounded-xl text-xs text-rose-300 mb-4">
                {nicheError}
              </div>
            )}

            {nicheLoading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                  <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-xs text-slate-400 font-medium">Scouting current tech bottlenecks in the SaaS, finance, and agency landscapes...</p>
              </div>
            ) : nicheRecommendations.length > 0 ? (
              <div className="space-y-4">
                {nicheRecommendations.map((niche, idx) => (
                  <div key={idx} className="bg-slate-950/40 p-5 rounded-2xl border border-slate-850 flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-slate-850 text-pink-400 font-bold text-xs rounded-full flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-slate-200">{niche.name}</h4>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-900/30">Recommended Target</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
                      <div>
                        <h5 className="font-bold text-pink-400 mb-1 text-[11px]">Opportunity</h5>
                        <p className="text-slate-300 text-[11px]">{niche.opportunity}</p>
                      </div>
                      <div>
                        <h5 className="font-bold text-pink-400 mb-1 text-[11px]">Target Client Pain Points</h5>
                        <p className="text-slate-300 text-[11px]">{niche.painPoints}</p>
                      </div>
                      <div>
                        <h5 className="font-bold text-indigo-400 mb-1 text-[11px]">Outbound Pitch Hook / Offer</h5>
                        <p className="text-indigo-200 font-medium text-[11px] bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-900/20">{niche.angle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 text-sm flex flex-col items-center justify-center space-y-2">
                <p>Niche opportunities will appear here.</p>
                <p className="text-xs text-slate-500 max-w-sm">Provide your software skill parameters on the left to calculate the best target markets for client acquisition.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
