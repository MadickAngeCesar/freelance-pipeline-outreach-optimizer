export type LeadStage = 'lead' | 'contacted' | 'meeting' | 'proposal' | 'won' | 'lost';

export interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  website: string;
  linkedin: string;
  source: 'linkedin' | 'cold_email' | 'job_board' | 'upwork' | 'referral' | 'other';
  techStack: string;
  estimatedValue: number;
  currentStage: LeadStage;
  notes: string;
  createdAt: string;
  updatedAt: string;
  lastOutreachDate?: string;
  outreachCount: number;
  customPitch?: string;
  painPoints?: string;
}

export interface OutreachStep {
  id: string;
  dayDelay: number; // Days after the previous step
  type: 'linkedin_connect' | 'linkedin_message' | 'email' | 'phone' | 'other';
  subjectTemplate?: string;
  bodyTemplate: string;
}

export interface OutreachSequence {
  id: string;
  name: string;
  targetNiche: string;
  description: string;
  steps: OutreachStep[];
}

export interface ConversionMetric {
  stage: LeadStage;
  label: string;
  count: number;
  value: number;
  conversionFromPrevious: number; // percentage
  conversionFromStart: number; // percentage
}

export interface PipelineStats {
  totalLeads: number;
  activeLeads: number;
  wonLeads: number;
  lostLeads: number;
  totalValue: number;
  weightedValue: number; // based on stage probabilities
  averageDealSize: number;
  overallWinRate: number;
}
