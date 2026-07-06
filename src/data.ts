import { Lead, OutreachSequence } from './types';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    companyName: 'Acme SaaS Solutions',
    contactPerson: 'Sarah Jenkins',
    email: 'sarah@acmesaas.io',
    website: 'https://acmesaas.io',
    linkedin: 'https://linkedin.com/in/sarah-jenkins-acme',
    source: 'linkedin',
    techStack: 'React, Node.js, Express, Postgres',
    estimatedValue: 12000,
    currentStage: 'lead',
    notes: 'Found on LinkedIn. Recently posted about scaling their web dashboard. Might need help refactoring their slow frontend.',
    createdAt: '2026-06-25T10:00:00Z',
    updatedAt: '2026-06-25T10:00:00Z',
    outreachCount: 0,
    painPoints: 'Slow dashboard rendering, high database latency.'
  },
  {
    id: 'lead-2',
    companyName: 'Apex HealthTech',
    contactPerson: 'David Chen',
    email: 'd.chen@apexhealth.co',
    website: 'https://apexhealth.co',
    linkedin: 'https://linkedin.com/in/david-chen-apex',
    source: 'cold_email',
    techStack: 'Ruby on Rails, jQuery, PostgreSQL',
    estimatedValue: 18000,
    currentStage: 'contacted',
    notes: 'Cold email sent pitching legacy modernization. David replied with some initial interest in React migration.',
    createdAt: '2026-06-20T14:30:00Z',
    updatedAt: '2026-06-22T09:15:00Z',
    lastOutreachDate: '2026-06-21T11:00:00Z',
    outreachCount: 1,
    painPoints: 'Legacy Rails code holding back mobile responsiveness. Slow development velocity.'
  },
  {
    id: 'lead-3',
    companyName: 'Zephyr Logistics',
    contactPerson: 'Marcus Vance',
    email: 'mvance@zephyrlogistics.com',
    website: 'https://zephyrlogistics.com',
    linkedin: 'https://linkedin.com/in/marcusvance',
    source: 'job_board',
    techStack: 'Next.js, Python, Django, AWS',
    estimatedValue: 24000,
    currentStage: 'meeting',
    notes: 'Discovery call completed. Extremely positive. They need a custom driver dispatch portal built using Next.js.',
    createdAt: '2026-06-15T08:00:00Z',
    updatedAt: '2026-06-28T16:40:00Z',
    lastOutreachDate: '2026-06-18T14:00:00Z',
    outreachCount: 2,
    painPoints: 'Manual driver dispatching is taking 4 hours daily. Need automation.'
  },
  {
    id: 'lead-4',
    companyName: 'Bloom e-Commerce',
    contactPerson: 'Elena Rostova',
    email: 'elena@bloomshop.net',
    website: 'https://bloomshop.net',
    linkedin: 'https://linkedin.com/in/elena-rostova-bloom',
    source: 'upwork',
    techStack: 'Shopify, Custom Liquid, React',
    estimatedValue: 8500,
    currentStage: 'proposal',
    notes: 'Sent proposal for headless Shopify frontend migration to improve lighthouse scores. Under review.',
    createdAt: '2026-06-18T11:20:00Z',
    updatedAt: '2026-07-02T15:30:00Z',
    lastOutreachDate: '2026-06-19T10:00:00Z',
    outreachCount: 1,
    painPoints: 'Low conversion rates due to mobile layout shifts and slow load speeds (Lighthouse score 32).'
  },
  {
    id: 'lead-5',
    companyName: 'Nova FinTech',
    contactPerson: 'James Sterling',
    email: 'jsterling@novafintech.app',
    website: 'https://novafintech.app',
    linkedin: 'https://linkedin.com/in/sterling-nova',
    source: 'referral',
    techStack: 'React, TypeScript, Go, PostgreSQL',
    estimatedValue: 35000,
    currentStage: 'won',
    notes: 'Referred by a previous client. Signed a 3-month contract to implement high-frequency financial charts and reports.',
    createdAt: '2026-06-10T09:00:00Z',
    updatedAt: '2026-07-04T12:00:00Z',
    lastOutreachDate: '2026-06-12T14:30:00Z',
    outreachCount: 1,
    painPoints: 'Lack of in-house React/D3 expertise to build interactive analytics boards before investor demo.'
  },
  {
    id: 'lead-6',
    companyName: 'Stellar Agency',
    contactPerson: 'Thomas Miller',
    email: 't.miller@stellaragency.com',
    website: 'https://stellaragency.com',
    linkedin: 'https://linkedin.com/in/thomasmillerstellar',
    source: 'cold_email',
    techStack: 'WordPress, Elementor, PHP',
    estimatedValue: 5000,
    currentStage: 'lost',
    notes: 'Pitched web design subcontracting. They ended up hiring an in-house designer instead.',
    createdAt: '2026-06-12T15:00:00Z',
    updatedAt: '2026-06-25T17:00:00Z',
    lastOutreachDate: '2026-06-15T09:00:00Z',
    outreachCount: 2,
    painPoints: 'Overloaded with client design requests. Slow turnaround time.'
  }
];

export const INITIAL_SEQUENCES: OutreachSequence[] = [
  {
    id: 'seq-1',
    name: 'Modern Web Performance Pitch',
    targetNiche: 'e-Commerce & Core Web Vitals',
    description: 'Perfect for targeting online stores suffering from slow load times or low mobile conversion rates. Pitches headless storefronts or performance refactoring.',
    steps: [
      {
        id: 'step-1-1',
        dayDelay: 1,
        type: 'linkedin_connect',
        bodyTemplate: 'Hi {{contactPerson}}, saw {{companyName}} is expanding your mobile catalog. Noticed a couple of visual layout shifts on the checkout page that might be dropping conversions. Would love to connect and share some performance benchmarks!'
      },
      {
        id: 'step-1-2',
        dayDelay: 3,
        type: 'email',
        subjectTemplate: 'Quick speed test for {{companyName}}',
        bodyTemplate: 'Hi {{contactPerson}},\n\nFollowing up on my LinkedIn connection. I ran a quick Lighthouse speed audit on {{companyName}} and noticed your mobile speed score is around 40/100.\n\nEvery 1s improvement in load speed has been proven to lift e-commerce conversions by 5-10%. As a freelance full-stack developer specializing in Next.js performance, I recently helped a similar brand double their speed, lifting sales by 12%.\n\nAre you open to a 10-minute chat this Thursday to see the audit breakdown?\n\nBest,\n[Your Name]\n[Your Portfolio Link]'
      },
      {
        id: 'step-1-3',
        dayDelay: 5,
        type: 'linkedin_message',
        bodyTemplate: 'Hi {{contactPerson}}, did you have a chance to look over the speed audit I emailed? No pressure at all—just wanted to make sure it didn\'t get buried in your inbox. Have a great week!'
      }
    ]
  },
  {
    id: 'seq-2',
    name: 'Legacy Tech Refactoring Pitch',
    targetNiche: 'Established SaaS Companies',
    description: 'Targeted at SaaS companies running on older tech stacks (Rails, jQuery, Angular 1) who need to update their systems or speed up feature development.',
    steps: [
      {
        id: 'step-2-1',
        dayDelay: 1,
        type: 'email',
        subjectTemplate: 'Modernizing {{companyName}}\'s web experience',
        bodyTemplate: 'Hi {{contactPerson}},\n\nI’ve been tracking {{companyName}}’s journey and love your product. Looking at your site, it seems like your platform uses a robust backend, but could benefit from a modern interactive React frontend.\n\nI’m a freelance full-stack engineer who specializes in migrating legacy platforms (like Rails/PHP/jQuery) to React/Next.js incrementally—without downtime or disrupting your existing team.\n\nThis usually boosts development speed by 3x and dramatically improves the end-user speed and UX.\n\nCould we jump on a short call next week to see if there’s a fit for some subcontracting work?\n\nBest,\n[Your Name]'
      },
      {
        id: 'step-2-2',
        dayDelay: 4,
        type: 'linkedin_connect',
        bodyTemplate: 'Hi {{contactPerson}}, sent an email about modernizing your frontend incrementally. Would love to join your network and follow along with {{companyName}}\'s growth!'
      },
      {
        id: 'step-2-3',
        dayDelay: 7,
        type: 'email',
        subjectTemplate: 'Example migration plan for {{companyName}}',
        bodyTemplate: 'Hi {{contactPerson}},\n\nJust wanted to share a 1-page roadmap of how I recently migrated another SaaS app with zero user downtime.\n\nWe did it module-by-module, upgrading high-value user areas (like dashboards and billing screens) first.\n\nWould you be open to reviewing this framework to see if it\'s relevant to {{companyName}}’s product timeline this quarter?\n\nBest,\n[Your Name]'
      }
    ]
  }
];
