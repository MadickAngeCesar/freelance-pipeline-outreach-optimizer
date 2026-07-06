import React, { useState, useEffect } from 'react';
import { Lead, OutreachSequence, OutreachStep } from './types';
import { INITIAL_LEADS, INITIAL_SEQUENCES } from './data';
import Dashboard from './components/Dashboard';
import LeadBoard from './components/LeadBoard';
import OutreachSequences from './components/OutreachSequences';
import OutreachGenerator from './components/OutreachGenerator';
import PitchOptimizer from './components/PitchOptimizer';
import AcquisitionCalculator from './components/AcquisitionCalculator';

import { 
  LayoutDashboard, Users, Layers, Wand2, Compass, 
  TrendingUp, Sparkles, Download, Upload, HelpCircle, Laptop, Menu, X
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sequences, setSequences] = useState<OutreachSequence[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Notification banner state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // 1. Initial State Load from LocalStorage
  useEffect(() => {
    try {
      const storedLeads = localStorage.getItem('freelance_crm_leads');
      const storedSequences = localStorage.getItem('freelance_crm_sequences');
      
      if (storedLeads) {
        setLeads(JSON.parse(storedLeads));
      } else {
        setLeads(INITIAL_LEADS);
        localStorage.setItem('freelance_crm_leads', JSON.stringify(INITIAL_LEADS));
      }

      if (storedSequences) {
        setSequences(JSON.parse(storedSequences));
      } else {
        setSequences(INITIAL_SEQUENCES);
        localStorage.setItem('freelance_crm_sequences', JSON.stringify(INITIAL_SEQUENCES));
      }
    } catch (e) {
      console.error('Failed to load CRM data from localStorage', e);
      setLeads(INITIAL_LEADS);
      setSequences(INITIAL_SEQUENCES);
    }
  }, []);

  // Show notification alert
  const triggerNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 2. LocalStorage Sync helpers
  const saveLeads = (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem('freelance_crm_leads', JSON.stringify(updatedLeads));
  };

  const saveSequences = (updatedSequences: OutreachSequence[]) => {
    setSequences(updatedSequences);
    localStorage.setItem('freelance_crm_sequences', JSON.stringify(updatedSequences));
  };

  // 3. Lead Board Actions
  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'outreachCount'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      outreachCount: 0
    };
    const updated = [newLead, ...leads];
    saveLeads(updated);
    triggerNotification(`Lead "${newLead.companyName}" added successfully.`);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    const updated = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    saveLeads(updated);
    triggerNotification(`Lead "${updatedLead.companyName}" updated.`);
  };

  const handleDeleteLead = (id: string) => {
    const leadToDelete = leads.find(l => l.id === id);
    const updated = leads.filter(l => l.id !== id);
    saveLeads(updated);
    if (leadToDelete) {
      triggerNotification(`Lead "${leadToDelete.companyName}" deleted.`, 'info');
    }
  };

  // 4. Sequence Builder Actions
  const handleAddSequence = (newSeqData: Omit<OutreachSequence, 'id'>) => {
    const newSeq: OutreachSequence = {
      ...newSeqData,
      id: `seq-${Date.now()}`
    };
    const updated = [newSeq, ...sequences];
    saveSequences(updated);
    triggerNotification(`Campaign "${newSeq.name}" created.`);
  };

  const handleUpdateSequence = (updatedSeq: OutreachSequence) => {
    const updated = sequences.map(s => s.id === updatedSeq.id ? updatedSeq : s);
    saveSequences(updated);
  };

  const handleDeleteSequence = (id: string) => {
    const seqToDelete = sequences.find(s => s.id === id);
    const updated = sequences.filter(s => s.id !== id);
    saveSequences(updated);
    if (seqToDelete) {
      triggerNotification(`Campaign "${seqToDelete.name}" removed.`, 'info');
    }
  };

  // 5. Backup & Restore (JSON Export/Import)
  const handleExportData = () => {
    const dataStr = JSON.stringify({ leads, sequences }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `freelance_pipeline_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    triggerNotification('CRM database backup file downloaded successfully.');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.leads && parsed.sequences) {
          saveLeads(parsed.leads);
          saveSequences(parsed.sequences);
          triggerNotification('CRM database imported and synchronized successfully!', 'success');
        } else {
          throw new Error('Invalid database format. Missing leads or sequences lists.');
        }
      } catch (err: any) {
        triggerNotification(err.message || 'Failed to import backup file.', 'error');
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 antialiased selection:bg-pink-500 selection:text-white">
      
      {/* 1. TOP HEADER BRANDING */}
      <header className="sticky top-0 z-40 bg-slate-900/80 border-b border-slate-850 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger menu toggler button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            id="mobile-hamburger-btn"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
          </button>

          <div className="p-2 bg-gradient-to-tr from-pink-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-900/30">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-display font-black tracking-tight leading-none bg-gradient-to-r from-pink-400 via-indigo-400 to-emerald-400 text-transparent bg-clip-text">
              Acquire
            </h1>
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Freelance Pipeline OS</span>
          </div>
        </div>

        {/* Sync backup actions */}
        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white font-semibold py-2 px-3 rounded-xl transition cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Import OS</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white font-semibold py-2 px-3 rounded-xl transition cursor-pointer"
            id="btn-export-backup"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export Backup</span>
          </button>
        </div>
      </header>

      {/* 2. PERSISTENT NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in flex items-center gap-2.5 px-4.5 py-3 rounded-xl shadow-2xl text-xs font-semibold bg-slate-900 text-white border border-slate-800 neon-glow-indigo">
          <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* 3. APP NAVIGATION BAR & CONTAINER */}
      <div className="grow flex flex-col lg:flex-row relative">
        
        {/* Navigation Sidebar (Desktop + Mobile Drawer) */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-850 p-4 flex flex-col justify-between shrink-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-69px)] lg:top-[69px] lg:z-auto
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="space-y-6">
            <div className="flex items-center justify-between lg:hidden pb-4 border-b border-slate-800">
              <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-pink-400 to-indigo-400 text-transparent bg-clip-text">Navigation</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 block">Outbound Command</span>
              <nav className="space-y-1 mt-2">
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-900/50 shadow-md neon-glow-indigo'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                  }`}
                  id="tab-dashboard"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span>Acquisition Cockpit</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('leads');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    activeTab === 'leads'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/50 shadow-md neon-glow-emerald'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                  }`}
                  id="tab-leads"
                >
                  <Users className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>CRM Lead Pipeline</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('sequences');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    activeTab === 'sequences'
                      ? 'bg-pink-950/60 text-pink-400 border border-pink-900/50 shadow-md neon-glow-pink'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                  }`}
                  id="tab-sequences"
                >
                  <Layers className="w-4 h-4 shrink-0 text-pink-400" />
                  <span>Sequence Campaigns</span>
                </button>
              </nav>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 block">AI Optimizer Tools</span>
              <nav className="space-y-1 mt-2">
                <button
                  onClick={() => {
                    setActiveTab('generator');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    activeTab === 'generator'
                      ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-900/50 shadow-md'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                  }`}
                  id="tab-generator"
                >
                  <Wand2 className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span>AI Pitch Personalizer</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('optimizer');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    activeTab === 'optimizer'
                      ? 'bg-purple-950/60 text-purple-400 border border-purple-900/50 shadow-md'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                  }`}
                  id="tab-optimizer"
                >
                  <Compass className="w-4 h-4 shrink-0 text-purple-400" />
                  <span>AI Critique & Niches</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('calculator');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    activeTab === 'calculator'
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-900/50 shadow-md'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                  }`}
                  id="tab-calculator"
                >
                  <TrendingUp className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Goal Activity Planner</span>
                </button>
              </nav>
            </div>
          </div>

          {/* User Email Footer metadata */}
          <div className="pt-4 border-t border-slate-800 hidden lg:block text-left">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Developer Workspace</p>
            <p className="text-xs font-medium text-slate-300 truncate mt-1">madickangecesar59@gmail.com</p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>Local Storage SQL</span>
              <span className="text-emerald-500 font-bold font-sans">OFFLINE SYNC</span>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* 4. MAIN VIEWS SWITCHER */}
        <main className="grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-opacity duration-300 overflow-x-hidden">
          
          {activeTab === 'dashboard' && (
            <Dashboard 
              leads={leads} 
              onNavigate={setActiveTab} 
            />
          )}

          {activeTab === 'leads' && (
            <LeadBoard 
              leads={leads}
              onAddLead={handleAddLead}
              onUpdateLead={handleUpdateLead}
              onDeleteLead={handleDeleteLead}
            />
          )}

          {activeTab === 'sequences' && (
            <OutreachSequences 
              sequences={sequences}
              onAddSequence={handleAddSequence}
              onDeleteSequence={handleDeleteSequence}
              onUpdateSequence={handleUpdateSequence}
            />
          )}

          {activeTab === 'generator' && (
            <OutreachGenerator 
              leads={leads}
              sequences={sequences}
              onUpdateLead={handleUpdateLead}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'optimizer' && (
            <PitchOptimizer />
          )}

          {activeTab === 'calculator' && (
            <AcquisitionCalculator />
          )}

        </main>
      </div>

      {/* 5. APP FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-850 py-6 px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Acquire Freelance Pipeline OS. Optimized with React + Vite + server-side Gemini AI.</p>
          <div className="flex gap-4">
            <a href="#leads" onClick={() => { setActiveTab('leads'); setIsMobileMenuOpen(false); }} className="hover:text-pink-400 transition">CRM Pipeline</a>
            <a href="#sequences" onClick={() => { setActiveTab('sequences'); setIsMobileMenuOpen(false); }} className="hover:text-pink-400 transition">Outbound Sequences</a>
            <a href="#optimizer" onClick={() => { setActiveTab('optimizer'); setIsMobileMenuOpen(false); }} className="hover:text-pink-400 transition">AI Copywriting Coach</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
