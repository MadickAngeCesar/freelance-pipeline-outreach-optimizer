import React, { useState } from 'react';
import { OutreachSequence, OutreachStep } from '../types';
import { Plus, Trash2, Edit, Calendar, Mail, Linkedin, Phone, MessageSquare, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface OutreachSequencesProps {
  sequences: OutreachSequence[];
  onAddSequence: (seq: Omit<OutreachSequence, 'id'>) => void;
  onDeleteSequence: (id: string) => void;
  onUpdateSequence: (seq: OutreachSequence) => void;
}

export default function OutreachSequences({ sequences, onAddSequence, onDeleteSequence, onUpdateSequence }: OutreachSequencesProps) {
  const [activeSeqId, setActiveSeqId] = useState<string>(sequences[0]?.id || '');
  
  // Create sequence state
  const [isCreatingSeq, setIsCreatingSeq] = useState(false);
  const [newSeqName, setNewSeqName] = useState('');
  const [newSeqNiche, setNewSeqNiche] = useState('');
  const [newSeqDesc, setNewSeqDesc] = useState('');

  // Add step state
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [stepDayDelay, setStepDayDelay] = useState(2);
  const [stepType, setStepType] = useState<'linkedin_connect' | 'linkedin_message' | 'email' | 'phone' | 'other'>('email');
  const [stepSubject, setStepSubject] = useState('');
  const [stepBody, setStepBody] = useState('');

  const activeSequence = sequences.find(s => s.id === activeSeqId);

  const handleCreateSequence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeqName || !newSeqNiche) return;
    
    onAddSequence({
      name: newSeqName,
      targetNiche: newSeqNiche,
      description: newSeqDesc,
      steps: []
    });

    setIsCreatingSeq(false);
    setNewSeqName('');
    setNewSeqNiche('');
    setNewSeqDesc('');
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSequence || !stepBody) return;

    const newStep: OutreachStep = {
      id: `step-${Date.now()}`,
      dayDelay: Number(stepDayDelay),
      type: stepType,
      subjectTemplate: stepType === 'email' ? stepSubject : undefined,
      bodyTemplate: stepBody
    };

    const updatedSteps = [...activeSequence.steps, newStep].sort((a, b) => a.dayDelay - b.dayDelay);
    onUpdateSequence({
      ...activeSequence,
      steps: updatedSteps
    });

    setIsAddingStep(false);
    setStepDayDelay(2);
    setStepSubject('');
    setStepBody('');
  };

  const handleDeleteStep = (stepId: string) => {
    if (!activeSequence) return;
    onUpdateSequence({
      ...activeSequence,
      steps: activeSequence.steps.filter(s => s.id !== stepId)
    });
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'linkedin_connect':
        return <Linkedin className="w-4 h-4 text-sky-400" />;
      case 'linkedin_message':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-pink-400" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-emerald-400" />;
      default:
        return <Calendar className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStepLabel = (type: string) => {
    switch (type) {
      case 'linkedin_connect': return 'LinkedIn Connection';
      case 'linkedin_message': return 'LinkedIn Direct Message';
      case 'email': return 'Outbound Email';
      case 'phone': return 'Direct Phone Dial';
      default: return 'Custom Outreach';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fade-in" id="sequences-tab">
      
      {/* LEFT COLUMN: Sequence list (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outbound Campaigns</h3>
          <button
            onClick={() => setIsCreatingSeq(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition cursor-pointer border border-slate-700"
            id="btn-new-sequence"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </button>
        </div>

        {/* Create Form */}
        {isCreatingSeq && (
          <form onSubmit={handleCreateSequence} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase">New Campaign Profile</h4>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Campaign Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Speed optimization pitch"
                value={newSeqName}
                onChange={e => setNewSeqName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-950 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Target Niche *</label>
              <input
                type="text"
                required
                placeholder="e.g. Next.js SaaS companies"
                value={newSeqNiche}
                onChange={e => setNewSeqNiche(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-950 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Description</label>
              <textarea
                placeholder="Targeting strategy, hook suggestions, and context."
                value={newSeqDesc}
                onChange={e => setNewSeqDesc(e.target.value)}
                rows={2}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-950 text-slate-100"
              />
            </div>
            <div className="flex gap-2 justify-end text-xs pt-1">
              <button
                type="button"
                onClick={() => setIsCreatingSeq(false)}
                className="px-2.5 py-1.5 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-400 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
                id="btn-create-sequence-submit"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {/* Sequences list */}
        <div className="space-y-2.5">
          {sequences.map(seq => (
            <div
              key={seq.id}
              onClick={() => {
                setActiveSeqId(seq.id);
                setIsAddingStep(false);
              }}
              className={`p-4 rounded-xl border transition duration-200 cursor-pointer text-left ${
                activeSeqId === seq.id 
                  ? 'bg-indigo-950/20 border-indigo-500/60 shadow-md' 
                  : 'bg-slate-900/40 border-slate-850 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-semibold text-sm text-slate-200 leading-snug">{seq.name}</h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm(`Delete outreach campaign "${seq.name}"?`)) {
                      onDeleteSequence(seq.id);
                      if (activeSeqId === seq.id) {
                        const remaining = sequences.filter(s => s.id !== seq.id);
                        setActiveSeqId(remaining[0]?.id || '');
                      }
                    }
                  }}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded transition shrink-0 cursor-pointer"
                  title="Delete sequence"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-pink-400 font-semibold mt-1">{seq.targetNiche}</p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{seq.description}</p>
              <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-850 text-[10px] text-slate-500">
                <Calendar className="w-3 h-3 text-slate-600" />
                <span>{seq.steps.length} touchpoint steps</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Campaign steps details (8 cols) */}
      <div className="lg:col-span-8 bg-slate-900 p-6 rounded-2xl border border-slate-850 shadow-xl">
        {activeSequence ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-850">
              <div>
                <h2 className="text-lg font-display font-bold text-white">{activeSequence.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Campaign profile mapping out steps & templates for cold outreach.</p>
              </div>
              
              <button
                onClick={() => setIsAddingStep(true)}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-md cursor-pointer"
                id="btn-add-step-modal"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>Add Touchpoint Step</span>
              </button>
            </div>

            {/* Add Step Form */}
            {isAddingStep && (
              <form onSubmit={handleAddStep} className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-pink-400 uppercase">Configure Outreach Touchpoint</h4>
                  <button 
                    type="button"
                    onClick={() => setIsAddingStep(false)}
                    className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Time Delay *</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 shrink-0 font-medium">Day</span>
                      <input
                        type="number"
                        required
                        min="1"
                        value={stepDayDelay}
                        onChange={e => setStepDayDelay(Number(e.target.value))}
                        className="w-20 px-2.5 py-1.5 text-xs border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-900 text-slate-100 font-mono"
                      />
                      <span className="text-xs text-slate-500 leading-normal font-medium">(Timeline index of sequence)</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Outreach Channel *</label>
                    <select
                      value={stepType}
                      onChange={e => setStepType(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-900 text-slate-200 cursor-pointer"
                    >
                      <option value="linkedin_connect">LinkedIn Connect Request</option>
                      <option value="linkedin_message">LinkedIn Direct Message</option>
                      <option value="email">Outbound Email Message</option>
                      <option value="phone">Phone Call Target</option>
                      <option value="other">Other Touchpoint</option>
                    </select>
                  </div>
                </div>

                {stepType === 'email' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Line Template</label>
                    <input
                      type="text"
                      placeholder="e.g. Quick speed test for {{companyName}}"
                      value={stepSubject}
                      onChange={e => setStepSubject(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-900 text-slate-100"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Use dynamic tokens: <strong className="text-pink-400 font-mono">{"{{companyName}}"}</strong>, <strong className="text-pink-400 font-mono">{"{{contactPerson}}"}</strong></span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Body Text Template *</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Write the core pitch template. You can use tokens: {{companyName}}, {{contactPerson}}. Keep it short, casual and focused on discovery."
                    value={stepBody}
                    onChange={e => setStepBody(e.target.value)}
                    className="w-full p-3 text-xs border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-900 text-slate-100 leading-relaxed font-sans"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-500">Tokens replaced automatically by AI generator.</span>
                    <span className="text-[10px] text-slate-500">{stepBody.length} characters</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingStep(false)}
                    className="px-3 py-1.5 border border-slate-800 text-slate-400 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg shadow-lg transition cursor-pointer"
                    id="btn-add-step-submit"
                  >
                    Save Step
                  </button>
                </div>
              </form>
            )}

            {/* Steps Timeline Visualization */}
            <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {activeSequence.steps.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
                  This campaign has no outreach steps. Click "Add Touchpoint Step" to outline your timeline!
                </div>
              ) : (
                activeSequence.steps.map((step, idx) => (
                  <div key={step.id} className="relative pl-14 flex flex-col sm:flex-row gap-4 justify-between items-start group/step">
                    
                    {/* Time indicator pill on left */}
                    <div className="absolute left-1.5 top-1 w-9 h-9 bg-slate-900 border-2 border-indigo-500 text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold font-mono shadow-md">
                      D{step.dayDelay}
                    </div>

                    {/* Step Card Content */}
                    <div className="grow bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-2.5 text-left w-full">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          {getStepIcon(step.type)}
                          <span className="text-xs font-bold text-slate-200 uppercase tracking-tight">
                            Step {idx + 1}: {getStepLabel(step.type)}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteStep(step.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer md:opacity-0 group-hover/step:opacity-100"
                          title="Remove step"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {step.subjectTemplate && (
                        <div className="text-xs bg-slate-900 py-1 px-2 border border-slate-850 rounded-md">
                          <span className="text-slate-500 font-medium">Subject:</span>{' '}
                          <strong className="text-slate-300">{step.subjectTemplate}</strong>
                        </div>
                      )}

                      <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-3 border border-slate-850 rounded-lg">
                        {step.bodyTemplate}
                      </p>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 font-medium">
            Select a campaign on the left to review sequence templates, or create a brand new outbound sequence.
          </div>
        )}
      </div>

    </div>
  );
}
