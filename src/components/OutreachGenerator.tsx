import React, { useState, useEffect } from 'react';
import { Lead, OutreachSequence, OutreachStep } from '../types';
import { Sparkles, Mail, Linkedin, Copy, Check, Send, AlertTriangle, SendHorizontal, Edit3, ArrowRight } from 'lucide-react';

interface OutreachGeneratorProps {
  leads: Lead[];
  sequences: OutreachSequence[];
  onUpdateLead: (lead: Lead) => void;
  onNavigate: (tab: string) => void;
}

export default function OutreachGenerator({ leads, sequences, onUpdateLead, onNavigate }: OutreachGeneratorProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>('');
  const [selectedStepId, setSelectedStepId] = useState<string>('');

  // Generation state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Results
  const [customSubject, setCustomSubject] = useState('');
  const [customText, setCustomText] = useState('');
  const [persuasionScore, setPersuasionScore] = useState<number | null>(null);
  const [optimizationTip, setOptimizationTip] = useState('');

  // Copy success indicator
  const [copied, setCopied] = useState(false);
  // Mark sent success indicator
  const [markedSent, setMarkedSent] = useState(false);

  const selectedLead = leads.find(l => l.id === selectedLeadId);
  const selectedSequence = sequences.find(s => s.id === selectedSequenceId);

  // Auto-select first lead and sequence on mount
  useEffect(() => {
    if (leads.length > 0 && !selectedLeadId) {
      // Prefer leads that haven't been won/lost
      const activeLeads = leads.filter(l => l.currentStage !== 'won' && l.currentStage !== 'lost');
      setSelectedLeadId(activeLeads[0]?.id || leads[0].id);
    }
    if (sequences.length > 0 && !selectedSequenceId) {
      setSelectedSequenceId(sequences[0].id);
    }
  }, [leads, sequences, selectedLeadId, selectedSequenceId]);

  // Auto-select first step when sequence changes
  useEffect(() => {
    if (selectedSequence && selectedSequence.steps.length > 0) {
      setSelectedStepId(selectedSequence.steps[0].id);
    } else {
      setSelectedStepId('');
    }
    // Clear old generation results
    setCustomSubject('');
    setCustomText('');
    setPersuasionScore(null);
    setOptimizationTip('');
    setError(null);
  }, [selectedSequenceId]);

  const activeStep = selectedSequence?.steps.find(s => s.id === selectedStepId);

  const triggerAIGenerate = async () => {
    if (!selectedLead || !activeStep) {
      setError('Please select a client lead and an outreach step first.');
      return;
    }

    setLoading(true);
    setError(null);
    setCopied(false);
    setMarkedSent(false);

    try {
      const response = await fetch('/api/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: selectedLead,
          sequenceName: selectedSequence?.name,
          stepType: activeStep.type,
          stepBodyTemplate: activeStep.bodyTemplate,
          subjectTemplate: activeStep.subjectTemplate
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate personalized pitch.');
      }

      const data = await response.json();
      setCustomText(data.customizedText || '');
      setCustomSubject(data.customizedSubject || '');
      setPersuasionScore(data.score || 80);
      setOptimizationTip(data.optimisationTip || '');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while connecting to the AI Optimizer server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const fullText = customSubject ? `Subject: ${customSubject}\n\n${customText}` : customText;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkAsSent = () => {
    if (!selectedLead) return;

    // Increment outreach, update last outreach date, move stage to contacted if still in lead
    const updatedStage = selectedLead.currentStage === 'lead' ? 'contacted' : selectedLead.currentStage;
    
    onUpdateLead({
      ...selectedLead,
      currentStage: updatedStage,
      lastOutreachDate: new Date().toISOString(),
      outreachCount: selectedLead.outreachCount + 1,
      customPitch: customSubject ? `Subject: ${customSubject}\n\n${customText}` : customText,
      updatedAt: new Date().toISOString()
    });

    setMarkedSent(true);
  };

  // Score styling color helper
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30';
    if (score >= 70) return 'text-amber-400 bg-amber-950/20 border-amber-900/30';
    return 'text-rose-400 bg-rose-950/20 border-rose-900/30';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="generator-tab">
      
      {/* 1. SELECTION SIDEBAR (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">1. Target Recipient</h3>
          {leads.length === 0 ? (
            <div className="bg-slate-950/40 p-4 rounded-xl border border-dashed border-slate-800 text-center">
              <p className="text-xs text-slate-400">Please add some leads first.</p>
              <button 
                onClick={() => onNavigate('leads')}
                className="mt-2 text-xs font-semibold text-pink-400 hover:underline cursor-pointer"
              >
                Go to Leads Board
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <select
                value={selectedLeadId}
                onChange={e => setSelectedLeadId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-950 text-slate-100 shadow-xs focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                id="sel-target-lead"
              >
                {leads.map(l => (
                  <option key={l.id} value={l.id} className="bg-slate-900 text-white">
                    {l.companyName} ({l.contactPerson})
                  </option>
                ))}
              </select>

              {selectedLead && (
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 space-y-2 text-left">
                  <h4 className="font-bold text-xs text-slate-200">Prospect Context</h4>
                  <div className="text-xs text-slate-300 space-y-1 font-sans">
                    <p><span className="text-pink-400 font-semibold text-[11px]">Niche Stack:</span> <code className="font-mono bg-slate-800 px-1 py-0.5 rounded text-pink-300 text-[10px]">{selectedLead.techStack || 'Not mapped'}</code></p>
                    {selectedLead.website && <p className="truncate"><span className="text-pink-400 font-semibold text-[11px]">Site:</span> <a href={selectedLead.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline truncate inline-flex items-center gap-0.5">{selectedLead.website}</a></p>}
                    {selectedLead.painPoints && <p className="line-clamp-2"><span className="text-pink-400 font-semibold text-[11px]">Pain Point:</span> {selectedLead.painPoints}</p>}
                    {selectedLead.notes && <p className="line-clamp-3 text-slate-400 border-t border-slate-800/60 pt-1.5 mt-1.5"><span className="text-pink-400 font-semibold text-[11px]">Notes:</span> {selectedLead.notes}</p>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">2. Pitch Sequence Campaign</h3>
          {sequences.length === 0 ? (
            <div className="bg-slate-950/40 p-4 rounded-xl border border-dashed border-slate-800 text-center">
              <p className="text-xs text-slate-400">Please define some sequences first.</p>
              <button 
                onClick={() => onNavigate('sequences')}
                className="mt-2 text-xs font-semibold text-pink-400 hover:underline cursor-pointer"
              >
                Go to Sequences Designer
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <select
                value={selectedSequenceId}
                onChange={e => setSelectedSequenceId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-800 rounded-xl bg-slate-950 text-slate-100 shadow-xs focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                id="sel-target-sequence"
              >
                {sequences.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.name}
                  </option>
                ))}
              </select>

              {selectedSequence && (
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 space-y-2 text-left">
                  <h4 className="font-bold text-xs text-slate-200">Touchpoint Sequence Steps</h4>
                  <div className="space-y-2">
                    {selectedSequence.steps.map((step, idx) => (
                      <label 
                        key={step.id} 
                        className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition text-xs ${
                          selectedStepId === step.id 
                            ? 'bg-pink-950/20 border-pink-500/40 font-semibold text-white' 
                            : 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="outreach_step"
                          checked={selectedStepId === step.id}
                          onChange={() => setSelectedStepId(step.id)}
                          className="text-pink-500 focus:ring-pink-500 accent-pink-500"
                        />
                        <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">D{step.dayDelay}</span>
                        <span className="capitalize">{step.type.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action button */}
        <button
          onClick={triggerAIGenerate}
          disabled={loading || !selectedLeadId || !selectedStepId}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 disabled:from-slate-800 disabled:to-slate-850 disabled:text-slate-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-950/20 transition duration-200 cursor-pointer text-sm"
          id="btn-trigger-generation"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>{loading ? 'Personalizing Pitch...' : 'AI Personalize Pitch!'}</span>
        </button>
      </div>

      {/* 2. PITCH PREVIEW & GENERATION AREA (8 cols) */}
      <div className="lg:col-span-8 bg-slate-900 p-6 rounded-2xl border border-slate-850 shadow-xl flex flex-col justify-between h-auto gap-6 text-white">
        <div>
          <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display font-bold text-slate-100">Personalized Outbound Draft</h3>
              <p className="text-xs text-slate-400 mt-0.5">The custom AI outreach pitch engineered specifically for this prospect.</p>
            </div>
            
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md">
              {activeStep ? activeStep.type.toUpperCase().replace('_', ' ') : 'NO STEP SELECTED'}
            </span>
          </div>

          {error && (
            <div className="my-4 p-4 bg-rose-950/20 border border-rose-900/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold">Generation Failed</h4>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Prompt warning if no API key */}
          {!leads.length ? (
            <div className="my-12 text-center text-slate-500 text-sm">
              Please enter target prospects in the Leads Board first to trigger AI personalization.
            </div>
          ) : loading ? (
            <div className="my-16 flex flex-col items-center justify-center space-y-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-xs text-slate-400 animate-pulse font-medium">Gemini is analyzing tech stack, company context, and personalizing variables...</p>
            </div>
          ) : customText ? (
            <div className="my-6 space-y-6">
              
              {/* Pitch Subject and Body */}
              <div className="space-y-4 text-left">
                {customSubject && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject Line</label>
                    <input
                      type="text"
                      value={customSubject}
                      onChange={e => setCustomSubject(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-950/80 text-slate-100"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Message Body</label>
                  <textarea
                    rows={12}
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    className="w-full p-4 text-xs border border-slate-800 rounded-2xl focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-950/80 leading-relaxed font-sans text-slate-200"
                  />
                </div>
              </div>

              {/* Feedback Metrics & Tips Panel */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
                
                {/* Score */}
                {persuasionScore !== null && (
                  <div className={`p-4 rounded-2xl border text-center flex flex-col justify-center items-center ${getScoreColor(persuasionScore)}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Response Likelihood</span>
                    <span className="text-4xl font-display font-black mt-1">{persuasionScore}%</span>
                    <span className="text-[9px] mt-1 text-slate-400 font-medium">Bespoke Cold Index</span>
                  </div>
                )}

                {/* Tip */}
                {optimizationTip && (
                  <div className="bg-slate-955/40 p-4 rounded-2xl border border-slate-850 md:col-span-3 text-left">
                    <h4 className="text-xs font-bold text-pink-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Personalization Play</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {optimizationTip}
                    </p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="my-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center space-y-3">
              <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
              <div>
                <h4 className="font-semibold text-slate-300">Ready to Personalize</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">Select your prospect and sequence step on the left, then click "AI Personalize Pitch" to compose a highly research-backed customized email.</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        {customText && !loading && (
          <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-[11px] text-slate-500 text-left">
              * Tweak and refine this copy before copying to clipboard to dispatch manually via Email or LinkedIn.
            </span>

            <div className="flex gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={handleCopy}
                className="grow sm:grow-0 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer border border-slate-700/50"
                id="btn-copy-draft"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied Pitch</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>

              <button
                onClick={handleMarkAsSent}
                disabled={markedSent}
                className="grow sm:grow-0 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-950/30 disabled:text-emerald-400 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
                id="btn-mark-sent"
              >
                {markedSent ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Logged in CRM!</span>
                  </>
                ) : (
                  <>
                    <SendHorizontal className="w-4 h-4" />
                    <span>Mark Sent & Log Outreach</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
