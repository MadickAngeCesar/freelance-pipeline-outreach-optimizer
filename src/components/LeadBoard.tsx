import React, { useState, useMemo } from 'react';
import { Lead, LeadStage } from '../types';
import { 
  Plus, Search, Building2, User, Mail, Globe, Linkedin, 
  ExternalLink, Edit2, Trash2, DollarSign, FileText, 
  AlertCircle, Check, X, Code, MessageSquare, ArrowRight 
} from 'lucide-react';

interface LeadBoardProps {
  leads: Lead[];
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'outreachCount'>) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
}

const STAGES: { key: LeadStage; label: string; color: string; bg: string; dot: string }[] = [
  { key: 'lead', label: 'Research (Lead)', color: 'text-slate-400', bg: 'bg-slate-900/60', dot: 'bg-slate-400' },
  { key: 'contacted', label: 'Outreach Sent', color: 'text-indigo-400', bg: 'bg-indigo-950/40', dot: 'bg-indigo-400' },
  { key: 'meeting', label: 'Discovery Call', color: 'text-purple-400', bg: 'bg-purple-950/40', dot: 'bg-purple-400' },
  { key: 'proposal', label: 'Proposal Sent', color: 'text-pink-400', bg: 'bg-pink-950/40', dot: 'bg-pink-400' },
  { key: 'won', label: 'Contract Won', color: 'text-emerald-400', bg: 'bg-emerald-950/40', dot: 'bg-emerald-400' },
  { key: 'lost', label: 'Closed Lost', color: 'text-rose-400', bg: 'bg-rose-950/40', dot: 'bg-rose-400' },
];

export default function LeadBoard({ leads, onAddLead, onUpdateLead, onDeleteLead }: LeadBoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  
  // Modals / forms state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Form states
  const [formCompany, setFormCompany] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formLinkedin, setFormLinkedin] = useState('');
  const [formSource, setFormSource] = useState<'linkedin' | 'cold_email' | 'job_board' | 'upwork' | 'referral' | 'other'>('linkedin');
  const [formTechStack, setFormTechStack] = useState('');
  const [formValue, setFormValue] = useState(5000);
  const [formStage, setFormStage] = useState<LeadStage>('lead');
  const [formNotes, setFormNotes] = useState('');
  const [formPainPoints, setFormPainPoints] = useState('');

  // 1. Filter Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch = 
        l.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.techStack.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.notes.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSource = selectedSourceFilter === 'all' || l.source === selectedSourceFilter;
      
      return matchesSearch && matchesSource;
    });
  }, [leads, searchTerm, selectedSourceFilter]);

  // Open Add Lead form
  const handleOpenAdd = () => {
    setFormCompany('');
    setFormContact('');
    setFormEmail('');
    setFormWebsite('');
    setFormLinkedin('');
    setFormSource('linkedin');
    setFormTechStack('');
    setFormValue(5000);
    setFormStage('lead');
    setFormNotes('');
    setFormPainPoints('');
    setIsAddOpen(true);
  };

  // Open Edit Lead form
  const handleOpenEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setFormCompany(lead.companyName);
    setFormContact(lead.contactPerson);
    setFormEmail(lead.email);
    setFormWebsite(lead.website);
    setFormLinkedin(lead.linkedin);
    setFormSource(lead.source);
    setFormTechStack(lead.techStack);
    setFormValue(lead.estimatedValue);
    setFormStage(lead.currentStage);
    setFormNotes(lead.notes);
    setFormPainPoints(lead.painPoints || '');
    setIsEditOpen(true);
  };

  // Save Add Lead
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formContact) return;
    onAddLead({
      companyName: formCompany,
      contactPerson: formContact,
      email: formEmail,
      website: formWebsite,
      linkedin: formLinkedin,
      source: formSource,
      techStack: formTechStack,
      estimatedValue: Number(formValue),
      currentStage: formStage,
      notes: formNotes,
      painPoints: formPainPoints
    });
    setIsAddOpen(false);
  };

  // Save Edit Lead
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !formCompany || !formContact) return;
    onUpdateLead({
      ...selectedLead,
      companyName: formCompany,
      contactPerson: formContact,
      email: formEmail,
      website: formWebsite,
      linkedin: formLinkedin,
      source: formSource,
      techStack: formTechStack,
      estimatedValue: Number(formValue),
      currentStage: formStage,
      notes: formNotes,
      painPoints: formPainPoints,
      updatedAt: new Date().toISOString()
    });
    setIsEditOpen(false);
  };

  // Drag and drop or quick move stages
  const moveStage = (lead: Lead, newStage: LeadStage) => {
    onUpdateLead({
      ...lead,
      currentStage: newStage,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6 text-left animate-fade-in" id="leads-tab">
      
      {/* Search and Filters and Add Button */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative grow md:grow-0 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search companies, contacts, stack..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-900 text-slate-100 shadow-sm"
              id="inp-search-leads"
            />
          </div>
          
          <select
            value={selectedSourceFilter}
            onChange={e => setSelectedSourceFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-900 text-slate-300 shadow-sm cursor-pointer"
            id="sel-source-filter"
          >
            <option value="all">All Sources</option>
            <option value="linkedin">LinkedIn</option>
            <option value="cold_email">Cold Email</option>
            <option value="job_board">Job Board</option>
            <option value="upwork">Upwork</option>
            <option value="referral">Referral</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-pink-900/10 transition cursor-pointer text-sm shrink-0"
          id="btn-add-lead-modal"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Lead / Client</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="flex flex-col md:grid md:grid-cols-3 lg:flex lg:flex-row gap-6 overflow-x-auto pb-6 custom-scrollbar -mx-4 px-4 lg:-mx-8 lg:px-8">
        {STAGES.map(stage => {
          const stageLeads = filteredLeads.filter(l => l.currentStage === stage.key);
          const stageValueTotal = stageLeads.reduce((acc, curr) => acc + curr.estimatedValue, 0);

          return (
            <div 
              key={stage.key} 
              className={`rounded-2xl p-4 min-w-[280px] lg:w-[320px] shrink-0 flex flex-col h-[750px] ${stage.bg} border border-slate-850 shadow-xl`}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.dot}`} />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-tight">{stage.label}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-md">
                  {stageLeads.length}
                </span>
              </div>
              
              {/* Stage Total Value */}
              <div className="px-1 mb-4 flex items-center justify-between border-b border-dashed border-slate-800 pb-2">
                <span className="text-[10px] font-medium text-slate-500">Total Value</span>
                <span className="text-xs font-mono font-bold text-slate-300">${stageValueTotal.toLocaleString()}</span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 overflow-y-auto grow custom-scrollbar pr-0.5">
                {stageLeads.length === 0 ? (
                  <div className="border border-dashed border-slate-800 rounded-xl p-4 text-center text-[11px] text-slate-500">
                    No leads here
                  </div>
                ) : (
                  stageLeads.map(lead => (
                    <div 
                      key={lead.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-850 shadow-md hover:border-slate-700 transition duration-200 flex flex-col justify-between h-auto gap-3 relative group text-left"
                    >
                      {/* Edit/Delete Floating Controls */}
                      <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg shadow-md border border-slate-850">
                        <button
                          onClick={() => handleOpenEdit(lead)}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-pink-400 rounded transition cursor-pointer"
                          title="Edit lead"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if(confirm(`Are you sure you want to delete ${lead.companyName}?`)) {
                              onDeleteLead(lead.id);
                            }
                          }}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded transition cursor-pointer"
                          title="Delete lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Client Header Info */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white tracking-tight leading-snug group-hover:pr-10">
                          {lead.companyName}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <User className="w-3 h-3 shrink-0 text-slate-500" />
                          <span className="truncate">{lead.contactPerson}</span>
                        </div>
                      </div>

                      {/* Deal Value */}
                      <div className="flex items-center justify-between text-xs border-y border-slate-900 py-1.5">
                        <span className="text-slate-500">Value:</span>
                        <span className="font-mono font-bold text-pink-400">${lead.estimatedValue.toLocaleString()}</span>
                      </div>

                      {/* Tech Stack & Pain Point Summary */}
                      <div className="space-y-1.5">
                        {lead.techStack && (
                          <div className="flex items-start gap-1">
                            <Code className="w-3 h-3 text-slate-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-slate-400 font-mono line-clamp-1">{lead.techStack}</p>
                          </div>
                        )}
                        {lead.painPoints && (
                          <div className="flex items-start gap-1">
                            <MessageSquare className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{lead.painPoints}</p>
                          </div>
                        )}
                      </div>

                      {/* Outreach tracking info */}
                      <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-900 pt-1.5">
                        <span>Pitch count: <strong className="text-slate-300 font-mono">{lead.outreachCount}</strong></span>
                        {lead.lastOutreachDate && (
                          <span className="truncate">Sent: {new Date(lead.lastOutreachDate).toLocaleDateString()}</span>
                        )}
                      </div>

                      {/* Dropdown to Quick Move Stage */}
                      <div className="mt-1 pt-1 border-t border-slate-900 flex items-center justify-between">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500">Move To:</label>
                        <select
                          value={lead.currentStage}
                          onChange={e => moveStage(lead, e.target.value as LeadStage)}
                          className="text-[10px] py-0.5 px-1 border border-slate-800 rounded bg-slate-900 text-slate-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-pink-500"
                        >
                          <option value="lead">Research</option>
                          <option value="contacted">Outreach</option>
                          <option value="meeting">Discovery</option>
                          <option value="proposal">Proposal</option>
                          <option value="won">Won Contract</option>
                          <option value="lost">Closed Lost</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD LEAD MODAL / DRAWER */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto custom-scrollbar text-left">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-display font-bold text-white">Add New Acquisition Lead</h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe, Acme Corp"
                    value={formCompany}
                    onChange={e => setFormCompany(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formContact}
                    onChange={e => setFormContact(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="e.g. sarah@acme.com"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Deal Value ($) *</label>
                  <input
                    type="number"
                    required
                    value={formValue}
                    onChange={e => setFormValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Website URL</label>
                  <input
                    type="url"
                    placeholder="e.g. https://acme.com"
                    value={formWebsite}
                    onChange={e => setFormWebsite(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    placeholder="e.g. https://linkedin.com/in/username"
                    value={formLinkedin}
                    onChange={e => setFormLinkedin(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lead Source *</label>
                  <select
                    value={formSource}
                    onChange={e => setFormSource(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-950 text-slate-200 cursor-pointer"
                  >
                    <option value="linkedin">LinkedIn Profile Search</option>
                    <option value="cold_email">Cold Email Campaign</option>
                    <option value="job_board">Job Board / Upwork</option>
                    <option value="upwork">Upwork platform</option>
                    <option value="referral">Client Referral</option>
                    <option value="other">Other Outbound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Stage *</label>
                  <select
                    value={formStage}
                    onChange={e => setFormStage(e.target.value as LeadStage)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-950 text-slate-200 cursor-pointer"
                  >
                    <option value="lead">Research (Lead)</option>
                    <option value="contacted">Outreach Sent</option>
                    <option value="meeting">Discovery Scheduled</option>
                    <option value="proposal">Proposal Pitched</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies / Stack they use</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, Node, PostgreSQL, Shopify, AWS"
                  value={formTechStack}
                  onChange={e => setFormTechStack(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Client Pain Points</label>
                <textarea
                  placeholder="What is slowing their business down? (e.g. Core web vitals score is 45, laggy mobile checkout, legacy system blocking product release)"
                  value={formPainPoints}
                  onChange={e => setFormPainPoints(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Context Notes & Discovery Details</label>
                <textarea
                  placeholder="Record background research, client comments, follow-up dates, or diagnostic audits."
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100 leading-relaxed"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl hover:bg-slate-800 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-lg transition text-sm cursor-pointer"
                  id="btn-add-lead-submit"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LEAD MODAL */}
      {isEditOpen && selectedLead && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto custom-scrollbar text-left">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-display font-bold text-white">Edit Lead: {selectedLead.companyName}</h3>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={e => setFormCompany(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={formContact}
                    onChange={e => setFormContact(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Deal Value ($) *</label>
                  <input
                    type="number"
                    required
                    value={formValue}
                    onChange={e => setFormValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={formWebsite}
                    onChange={e => setFormWebsite(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formLinkedin}
                    onChange={e => setFormLinkedin(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lead Source *</label>
                  <select
                    value={formSource}
                    onChange={e => setFormSource(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-950 text-slate-200 cursor-pointer"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="cold_email">Cold Email</option>
                    <option value="job_board">Job Board</option>
                    <option value="upwork">Upwork</option>
                    <option value="referral">Referral</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Stage *</label>
                  <select
                    value={formStage}
                    onChange={e => setFormStage(e.target.value as LeadStage)}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-950 text-slate-200 cursor-pointer"
                  >
                    <option value="lead">Research (Lead)</option>
                    <option value="contacted">Outreach Sent</option>
                    <option value="meeting">Discovery Scheduled</option>
                    <option value="proposal">Proposal Pitched</option>
                    <option value="won">Contract Won</option>
                    <option value="lost">Closed Lost</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies / Stack they use</label>
                <input
                  type="text"
                  value={formTechStack}
                  onChange={e => setFormTechStack(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Client Pain Points</label>
                <textarea
                  value={formPainPoints}
                  onChange={e => setFormPainPoints(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Context Notes & Discovery Details</label>
                <textarea
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-950 text-slate-100 leading-relaxed"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl hover:bg-slate-800 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-lg transition text-sm cursor-pointer"
                  id="btn-edit-lead-submit"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
