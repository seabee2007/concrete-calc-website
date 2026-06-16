import type { TopicLandingPageProps } from '../components/marketing/TopicLandingPage'

const related = {
  core: [
    { href: '/construction-project-management-software', label: 'Construction project management' },
    { href: '/construction-estimating-software', label: 'Construction estimating software' },
    { href: '/construction-scheduling-software', label: 'Construction scheduling software' },
    { href: '/pricing', label: 'Pricing' },
  ],
}

export const constructionProjectManagementPage: Omit<TopicLandingPageProps, never> = {
  path: '/construction-project-management-software',
  title: 'Construction Project Management Software for Contractors | Arden Project OS',
  description:
    'Manage estimates, schedules, change orders, field work, and client approvals in one construction project management workspace built for contractors.',
  h1: 'Construction Project Management Software for Contractors',
  intro:
    'Arden Project OS gives contractors one workspace for estimates, proposals, schedules, change orders, daily reports, RFIs, and client visibility — without juggling spreadsheets, email threads, and disconnected apps.',
  sections: [
    {
      heading: 'One workspace for the full project lifecycle',
      paragraphs: [
        'Most contractors lose time switching between estimating spreadsheets, scheduling tools, shared drives, and text messages. Arden Project OS connects preconstruction, field execution, and client communication in a single project record so your team always works from the same numbers and timeline.',
        'From the first conceptual estimate through final closeout, project data stays linked. When a scope change affects cost, schedule, or client approval, you can see the impact without rebuilding files in three different systems.',
      ],
    },
    {
      heading: 'Built for how construction teams actually work',
      paragraphs: [
        'General contractors, subcontractors, estimators, and project managers need different views of the same job. Arden Project OS supports activity-based estimating, logic networks, Gantt schedules, field portals, and document exports without forcing every role into a generic task list.',
        'Office teams can build proposals and schedules while field staff submit daily reports, QC notes, and change requests from the jobsite. Approvals, RFIs, and client updates stay tied to the project instead of scattered across inboxes.',
      ],
    },
    {
      heading: 'Replace disconnected tools without losing control',
      paragraphs: [
        'You do not need a separate app for estimates, another for schedules, and another for change orders. Arden Project OS keeps project financials, production assumptions, and schedule logic in one place so revisions are faster and less error-prone.',
        'Export professional PDFs for clients, maintain audit-friendly records, and give stakeholders visibility through controlled portals rather than unsecured file shares.',
      ],
    },
    {
      heading: 'Visibility for owners, PMs, and field crews',
      paragraphs: [
        'Project dashboards summarize active work, pending approvals, schedule risk, and field activity so leaders can spot issues early. Crew and client visibility can be scoped appropriately without exposing sensitive internal pricing.',
        'Whether you manage one active job or a portfolio of projects, Arden Project OS helps your team stay aligned on scope, cost, schedule, and communication.',
      ],
    },
    {
      heading: 'Start with a platform designed for construction',
      paragraphs: [
        'Arden Project OS is cloud-based construction project management software — no installs, no per-device sync headaches. Start a free trial, set up your first project, and see how much cleaner your estimating, scheduling, and field workflow can be.',
      ],
    },
  ],
  relatedLinks: related.core,
}

export const constructionEstimatingPage: Omit<TopicLandingPageProps, never> = {
  path: '/construction-estimating-software',
  title: 'Construction Estimating Software for Contractors | Arden Project OS',
  description:
    'Build detailed construction estimates with activities, labor rates, markup, and export-ready proposals in Arden Project OS estimating software for contractors.',
  h1: 'Construction Estimating Software for Contractors',
  intro:
    'Create accurate, defensible estimates faster with activity-based estimating, labor rate schedules, production assumptions, and proposal-ready outputs in one contractor workspace.',
  sections: [
    {
      heading: 'Activity-based estimating that scales with your jobs',
      paragraphs: [
        'Flat spreadsheet formulas break down when projects grow in scope and complexity. Arden Project OS supports construction activities, production rates, crew assumptions, and cost rollups so estimators can build bids that reflect how work is actually performed.',
        'Line items, assemblies, indirect costs, markup, overhead, and profit settings stay organized in a structured estimate you can revise as supplier pricing, labor rates, or scope changes.',
      ],
    },
    {
      heading: 'From takeoff assumptions to client-ready proposals',
      paragraphs: [
        'Estimators should not rebuild the same bid in Word, Excel, and email attachments. Generate polished proposals directly from your estimate with consistent scope language, pricing, and branding.',
        'When the client asks for a revision, update the estimate once and refresh the proposal instead of hunting through outdated file versions.',
      ],
    },
    {
      heading: 'Labor, equipment, and production-rate control',
      paragraphs: [
        'Labor rate schedules, man-hour calculations, and production-rate libraries help teams standardize estimating while still allowing project-specific adjustments. Roll up labor, material, equipment, subcontractor, and indirect costs with clear visibility into margin.',
        'Arden Project OS helps estimators compare alternatives, document assumptions, and produce exports that are easier to review before bid day.',
      ],
    },
    {
      heading: 'Estimate with schedule context in mind',
      paragraphs: [
        'Estimating and scheduling should not live in separate silos. When your estimate feeds project planning, durations, sequencing, and resource assumptions become easier to validate before work starts.',
        'Link estimating outputs to downstream schedule and field workflows so the numbers your team bids are the numbers your PMs and supers plan against.',
      ],
    },
    {
      heading: 'Try estimating software built for contractors',
      paragraphs: [
        'Stop rebuilding bids from scratch every time scope shifts. Arden Project OS gives contractors a dedicated estimating workspace inside a broader construction project management platform.',
      ],
    },
  ],
  relatedLinks: related.core,
}

export const constructionSchedulingPage: Omit<TopicLandingPageProps, never> = {
  path: '/construction-scheduling-software',
  title: 'Construction Scheduling Software with CPM & Gantt | Arden Project OS',
  description:
    'Plan construction schedules with logic networks, CPM, Level III Gantt charts, and crew demand views in Arden Project OS scheduling software.',
  h1: 'Construction Scheduling Software with CPM, Gantt, and Logic Networks',
  intro:
    'Build realistic construction schedules with activity logic, critical path analysis, Gantt visualization, and crew demand planning tied to your project data.',
  sections: [
    {
      heading: 'Logic networks that reflect real sequencing',
      paragraphs: [
        'Construction schedules fail when dependencies are vague or buried in spreadsheet rows. Arden Project OS includes logic network tools so planners can define predecessor and successor relationships before running CPM calculations.',
        'Activity links, constraints, and sequencing decisions stay visible to the team instead of hidden inside one scheduler’s local file.',
      ],
    },
    {
      heading: 'CPM and Level III Gantt in one workspace',
      paragraphs: [
        'Critical path method analysis helps teams understand which activities drive the finish date. Level III Gantt views make schedule flow readable for supers, PMs, owners, and subcontractors who need more than a task list.',
        'Review float, milestones, and schedule risk with charts connected to the same project record used for estimating and field reporting.',
      ],
    },
    {
      heading: 'Crew demand and resource planning',
      paragraphs: [
        'Schedules are not just dates — they imply crew loading, equipment usage, and trade stacking. Arden Project OS helps teams review crew demand and resource assumptions alongside the schedule so conflicts surface earlier.',
        'When field conditions change, update durations and logic links and see how downstream activities and resource plans shift.',
      ],
    },
    {
      heading: 'Schedule updates tied to project execution',
      paragraphs: [
        'A schedule locked in preconstruction goes stale quickly once work starts. Connect schedule planning to change orders, daily reports, and field updates so the project timeline reflects reality.',
        'Export schedule views for client meetings, coordination sessions, and internal reviews without rebuilding charts manually.',
      ],
    },
    {
      heading: 'Plan smarter with contractor scheduling software',
      paragraphs: [
        'Arden Project OS combines scheduling with estimating, proposals, and field records so your team plans from one source of truth.',
      ],
    },
  ],
  relatedLinks: related.core,
}

export const contractorProposalPage: Omit<TopicLandingPageProps, never> = {
  path: '/contractor-proposal-software',
  title: 'Contractor Proposal Software | Arden Project OS',
  description:
    'Create polished contractor proposals from estimates with branding, scope clarity, and PDF exports in Arden Project OS.',
  h1: 'Contractor Proposal Software',
  intro:
    'Turn detailed estimates into professional client proposals with consistent scope language, pricing, branding, and export-ready documents.',
  sections: [
    {
      heading: 'Proposals that match your estimate',
      paragraphs: [
        'Manual proposal assembly invites errors when pricing, exclusions, and scope notes drift away from the underlying bid. Arden Project OS generates proposals from your estimate so numbers and scope stay aligned.',
        'Review terms, assumptions, and client details before sending so your team presents a cohesive, professional package.',
      ],
    },
    {
      heading: 'Branded documents clients can understand',
      paragraphs: [
        'Include your business logo, contact information, and structured scope sections so proposals look consistent across every job. Clear formatting helps owners and GCs compare options faster and with less back-and-forth.',
        'Export PDFs ready to email or share through controlled client links.',
      ],
    },
    {
      heading: 'Faster revisions when scope changes',
      paragraphs: [
        'Clients rarely accept the first version unchanged. When pricing or scope shifts, update the estimate and refresh the proposal instead of rebuilding documents from scratch.',
        'Keep a record of what was sent, when, and to whom so your team maintains a reliable proposal history.',
      ],
    },
    {
      heading: 'Connected to approvals and project setup',
      paragraphs: [
        'Winning work is only the start. Approved proposals can feed project setup, schedule planning, and field workflows inside the same platform.',
        'Reduce the handoff friction between estimating, sales, and project management teams.',
      ],
    },
    {
      heading: 'Send better proposals with less rework',
      paragraphs: [
        'Arden Project OS helps contractors present accurate, polished bids without maintaining a separate proposal template stack.',
      ],
    },
  ],
  relatedLinks: related.core,
}

export const changeOrderManagementPage: Omit<TopicLandingPageProps, never> = {
  path: '/change-order-management-software',
  title: 'Change Order Management Software for Contractors | Arden Project OS',
  description:
    'Track construction change orders with scope, cost, schedule impact, and approval history in Arden Project OS.',
  h1: 'Change Order Management Software for Contractors',
  intro:
    'Document scope changes, pricing impacts, schedule effects, and approval status so change orders do not get lost in email or informal field notes.',
  sections: [
    {
      heading: 'Capture scope changes before they become disputes',
      paragraphs: [
        'Unrecorded changes erode margin fast. Arden Project OS gives teams a structured place to log change order requests with scope description, cost impact, supporting notes, and approval status.',
        'Link changes to the project record so PMs, estimators, and clients review the same information.',
      ],
    },
    {
      heading: 'Cost and schedule impact in one place',
      paragraphs: [
        'A change order is never just a dollar amount. It can affect sequencing, crew loading, procurement, and the critical path. Track financial and schedule implications together instead of in disconnected files.',
        'Maintain a clear history of revisions and approvals for internal review and client communication.',
      ],
    },
    {
      heading: 'Approval workflows clients can follow',
      paragraphs: [
        'Clients need visibility into pending changes without access to your entire internal system. Controlled sharing and approval records help keep projects moving while protecting sensitive data.',
        'Reduce delays caused by unclear change documentation or missing signatures.',
      ],
    },
    {
      heading: 'Connected to estimates and field records',
      paragraphs: [
        'When field teams identify a change, office teams should not rebuild context from memory. Arden Project OS connects change orders to project estimates, daily reports, RFIs, and schedule data.',
        'Give leadership a clearer picture of approved, pending, and rejected changes across active jobs.',
      ],
    },
    {
      heading: 'Control change order chaos',
      paragraphs: [
        'Replace informal change tracking with software built for construction project execution.',
      ],
    },
  ],
  relatedLinks: related.core,
}

export const constructionClientPortalPage: Omit<TopicLandingPageProps, never> = {
  path: '/construction-client-portal',
  title: 'Construction Client Portal for Approvals & Visibility | Arden Project OS',
  description:
    'Give clients controlled visibility into proposals, approvals, schedule updates, and project records with an Arden Project OS client portal.',
  h1: 'Construction Client Portal for Approvals & Project Visibility',
  intro:
    'Share the right project information with clients and owners through secure, controlled access — without emailing sensitive files or losing approval history.',
  sections: [
    {
      heading: 'Client visibility without losing control',
      paragraphs: [
        'Owners and clients need updates, but they should not see every internal cost assumption. Arden Project OS supports controlled sharing so you decide what clients can view and approve.',
        'Keep communication professional and organized instead of buried in long email chains.',
      ],
    },
    {
      heading: 'Approvals that stay on record',
      paragraphs: [
        'Proposals, change orders, and key decisions should not rely on verbal confirmation alone. Client portals help teams capture approval events and maintain a reliable project history.',
        'Reduce disputes by documenting who approved what and when.',
      ],
    },
    {
      heading: 'Better collaboration during active work',
      paragraphs: [
        'Clients often ask for schedule updates, document copies, and status summaries. A portal gives them a consistent place to find approved information while your team keeps working in the same project workspace.',
        'Improve responsiveness without giving away unnecessary internal detail.',
      ],
    },
    {
      heading: 'Connected to proposals and field activity',
      paragraphs: [
        'Client-facing information stays linked to the same records your estimators, PMs, and field teams use internally. That means fewer mismatches between what the office sends and what the field executes.',
        'Use portals as part of a broader construction project management workflow, not as a standalone file share.',
      ],
    },
    {
      heading: 'Give clients clarity, not chaos',
      paragraphs: [
        'Arden Project OS helps contractors present a professional client experience while protecting internal project data.',
      ],
    },
  ],
  relatedLinks: related.core,
}

export const constructionDailyReportsPage: Omit<TopicLandingPageProps, never> = {
  path: '/construction-daily-reports',
  title: 'Construction Daily Reports & Field Updates | Arden Project OS',
  description:
    'Capture construction daily reports, field notes, labor, equipment, and jobsite activity in Arden Project OS.',
  h1: 'Construction Daily Reports & Field Updates',
  intro:
    'Record jobsite activity, labor, equipment, delays, and field notes in daily reports connected to the same project record used for estimating and scheduling.',
  sections: [
    {
      heading: 'Daily reports that stay tied to the project',
      paragraphs: [
        'Paper logs and text messages disappear. Arden Project OS gives field teams a structured way to submit daily reports with labor, equipment, weather notes, delays, and work completed.',
        'Office teams review field activity in context instead of reconstructing the day from photos and phone calls.',
      ],
    },
    {
      heading: 'Field updates PMs can actually use',
      paragraphs: [
        'Daily reports should inform schedule updates, change orders, and client communication. When field data lives inside the project workspace, PMs can spot trends and respond faster.',
        'Maintain a searchable history of jobsite conditions and production for future estimates and dispute prevention.',
      ],
    },
    {
      heading: 'Better handoff between field and office',
      paragraphs: [
        'Supers, foremen, and field staff need simple workflows. Office teams need reliable records. Arden Project OS connects both sides without forcing field users into heavy ERP screens.',
        'Reduce duplicate data entry between the jobsite and project management workflows.',
      ],
    },
    {
      heading: 'Support QC, safety, and production tracking',
      paragraphs: [
        'Daily reporting often captures more than labor hours. Use structured field records to support QC notes, production tracking, and coordination with other project documents.',
        'Give leadership better visibility into what happened on site each day.',
      ],
    },
    {
      heading: 'Modern daily reporting for contractors',
      paragraphs: [
        'Replace scattered field notes with daily reports inside a construction project management platform.',
      ],
    },
  ],
  relatedLinks: related.core,
}

export const rfiFarQcPage: Omit<TopicLandingPageProps, never> = {
  path: '/rfi-far-qc-construction-software',
  title: 'RFI, FAR, and QC Software for Construction | Arden Project OS',
  description:
    'Manage RFIs, field action requests, and QC records in one construction project workspace with Arden Project OS.',
  h1: 'RFI, FAR, and QC Software for Construction Projects',
  intro:
    'Track RFIs, field action requests, and quality control records alongside estimates, schedules, change orders, and daily reports.',
  sections: [
    {
      heading: 'RFIs organized by project, not inbox',
      paragraphs: [
        'Requests for information often get lost when they live only in email threads. Arden Project OS helps teams log RFIs with status, responsibility, and project context so answers do not delay field work.',
        'Maintain a record of questions, responses, and related documents for coordination meetings and closeout.',
      ],
    },
    {
      heading: 'Field action requests with clear ownership',
      paragraphs: [
        'Field action requests need owners, due dates, and visibility. Structured FAR tracking helps supers and PMs close loops faster instead of relying on verbal follow-up.',
        'Connect field actions to daily reports, schedule impacts, and change documentation when needed.',
      ],
    },
    {
      heading: 'QC records that support project quality',
      paragraphs: [
        'Quality control is easier to defend when inspections, notes, and corrective actions are stored in the project record. Arden Project OS helps teams maintain QC history without separate binders or ad hoc folders.',
        'Give owners and internal reviewers clearer documentation of quality-related activity.',
      ],
    },
    {
      heading: 'One platform for field and office coordination',
      paragraphs: [
        'RFIs, FARs, and QC should not sit apart from the rest of the job. When these records connect to schedules, change orders, and client communication, teams resolve issues with less friction.',
        'Reduce the risk of unresolved field issues affecting cost, schedule, or client trust.',
      ],
    },
    {
      heading: 'Field documentation built for construction teams',
      paragraphs: [
        'Arden Project OS combines RFIs, FARs, QC, and broader project management in one contractor workspace.',
      ],
    },
  ],
  relatedLinks: related.core,
}
