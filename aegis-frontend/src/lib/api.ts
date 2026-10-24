const API_BASE = '/api';

export interface IncidentData {
  id: string;
  title: string;
  description: string;
  status: string;
  current_stage: string;
  risk_level: string;
  created_at: string;
  updated_at: string;
  events: Array<{
    id: string;
    timestamp: string;
    stage: string;
    summary: string;
    raw_content: string;
    source_platform: string;
    account_handle?: string;
    evidence_id?: string;
  }>;
  evidence_items: Array<{
    id: string;
    file_name: string;
    file_hash_sha256: string;
    mime_type: string;
    file_size_bytes: number;
    source_platform: string;
    captured_at: string;
    is_sensitive: boolean;
    excerpt_text?: string;
    notes?: string;
  }>;
  accounts: Array<{
    id: string;
    platform: string;
    handle: string;
    notes?: string;
    first_seen: string;
    last_seen: string;
  }>;
  threat_signals: Array<{
    id: string;
    signal_type: string;
    severity: string;
    rationale: string;
    excerpt?: string;
    detected_at: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    action_type: string;
    description: string;
    priority: string;
    is_completed: boolean;
  }>;
}

export interface TrajectoryStageInfo {
  stage_key: string;
  stage_name: string;
  order: number;
  is_reached: boolean;
  is_current: boolean;
  milestone_summary?: string;
  reached_at?: string;
  evidence_id?: string;
}

export interface EscalationReport {
  incident_id: string;
  current_stage: string;
  risk_level: string;
  trajectory: TrajectoryStageInfo[];
  why_it_escalated: string;
  escalation_velocity: string;
  key_drivers: string[];
  disclaimer: string;
}

export interface ChangeComparison {
  incident_id: string;
  event_id?: string;
  before_stage: string;
  after_stage: string;
  before_risk: string;
  after_risk: string;
  is_escalated: boolean;
  new_threat_signals: string[];
  new_exposure_elements: string[];
  new_accounts_detected: string[];
  delta_summary: string;
  why_it_changed: string;
  recommended_priority_action: string;
  created_at: string;
}

export interface ThreatLinkageData {
  incident_id: string;
  accounts_evaluated: number;
  connections_found: Array<{
    account_a: string;
    account_b: string;
    verdict: string;
    confidence_level: string;
    metrics: Array<{
      name: string;
      level: string;
      score: number;
      description: string;
    }>;
    shared_signals: string[];
    plain_explanation: string;
  }>;
  disclaimer: string;
}

export interface ExposureGraphData {
  incident_id: string;
  nodes: Array<{
    id: string;
    label: string;
    value: string;
    type: string;
    exposure_level: string;
    description: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
    relation: string;
  }>;
  summary: {
    total_nodes: number;
    exposed_vectors: number;
    protected_vectors: number;
    overall_exposure_risk: string;
    key_vulnerability: string;
    remediation_steps: string[];
  };
  disclaimer: string;
}

export interface CaseReconstructionData {
  incident_id: string;
  title: string;
  current_status: string;
  total_events: number;
  total_evidence_pieces: number;
  formal_narrative: string;
  chronological_milestones: Array<{
    sequence_number: number;
    event_id: string;
    timestamp: string;
    date_label: string;
    stage: string;
    summary: string;
    raw_excerpt: string;
    source_platform: string;
    account_handle: string;
    evidence_ref: string;
    evidence_hash?: string;
    is_sensitive: boolean;
  }>;
  attribution_note: string;
}

export interface ComplaintPackData {
  incident_id: string;
  title: string;
  generated_at: string;
  case_summary: string;
  user_statement?: string;
  suspect_identifiers?: string;
  chronological_timeline: any[];
  evidence_index: any[];
  threat_indicators: string[];
  connection_signals: string[];
  legal_provisions: Array<{
    act: string;
    section: string;
    offense: string;
    description: string;
  }>;
  submission_instructions: Record<string, string>;
  formatted_dossier_text: string;
  disclaimer: string;
}

export async function fetchAllIncidents(): Promise<Array<{
  id: string;
  title: string;
  description: string;
  status: string;
  current_stage: string;
  risk_level: string;
  created_at: string;
  updated_at: string;
}>> {
  const res = await fetch(`${API_BASE}/incidents`);
  if (!res.ok) throw new Error('Failed to fetch cases list.');
  return res.json();
}

export async function fetchIncidentById(incidentId: string): Promise<IncidentData> {
  const res = await fetch(`${API_BASE}/incidents/${incidentId}`);
  if (!res.ok) throw new Error(`Case ${incidentId} not found.`);
  return res.json();
}

export async function createIncident(title: string, description: string = ''): Promise<{ id: string; title: string }> {
  const res = await fetch(`${API_BASE}/incidents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });
  if (!res.ok) throw new Error('Failed to create new case.');
  return res.json();
}

export async function deleteIncident(incidentId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/incidents/${incidentId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete case.');
  return res.json();
}

export async function fetchActiveIncident(): Promise<IncidentData> {
  const res = await fetch(`${API_BASE}/incidents/active`);
  if (!res.ok) throw new Error('No active incident found.');
  return res.json();
}

export async function fetchEscalation(incidentId: string): Promise<EscalationReport> {
  const res = await fetch(`${API_BASE}/escalation/${incidentId}`);
  if (!res.ok) throw new Error('Failed to fetch escalation report.');
  return res.json();
}

export async function fetchChanges(incidentId: string): Promise<ChangeComparison> {
  const res = await fetch(`${API_BASE}/changes/${incidentId}`);
  if (!res.ok) throw new Error('Failed to fetch change diff.');
  return res.json();
}

export async function fetchLinkage(incidentId: string): Promise<ThreatLinkageData> {
  const res = await fetch(`${API_BASE}/linkage/${incidentId}`);
  if (!res.ok) throw new Error('Failed to fetch threat linkage.');
  return res.json();
}

export async function fetchExposure(incidentId: string): Promise<ExposureGraphData> {
  const res = await fetch(`${API_BASE}/exposure/${incidentId}`);
  if (!res.ok) throw new Error('Failed to fetch exposure graph.');
  return res.json();
}

export async function fetchReconstruction(incidentId: string): Promise<CaseReconstructionData> {
  const res = await fetch(`${API_BASE}/reconstruction/${incidentId}`);
  if (!res.ok) throw new Error('Failed to fetch case reconstruction.');
  return res.json();
}

export async function fetchEvidenceList(incidentId: string) {
  const res = await fetch(`${API_BASE}/evidence/${incidentId}`);
  if (!res.ok) throw new Error('Failed to fetch evidence.');
  return res.json();
}

export async function fetchComplaintPack(incidentId: string): Promise<ComplaintPackData> {
  const res = await fetch(`${API_BASE}/complaint/${incidentId}`);
  if (!res.ok) throw new Error('Failed to fetch complaint pack.');
  return res.json();
}

export async function generateCustomComplaint(incidentId: string, payload: any): Promise<ComplaintPackData> {
  const res = await fetch(`${API_BASE}/complaint/${incidentId}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to generate customized complaint.');
  return res.json();
}

export async function analyzeInput(payload: {
  content: string;
  content_type: string;
  source_platform: string;
  account_handle?: string;
  incident_id?: string;
  auto_add_to_case: boolean;
}) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Analysis request failed.');
  return res.json();
}

export async function loadDemoCase(full: boolean = true) {
  const res = await fetch(`${API_BASE}/demo/load?full=${full}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to seed demo case.');
  return res.json();
}

export async function injectDay7() {
  const res = await fetch(`${API_BASE}/demo/inject-day7`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to inject Day 7 evidence.');
  return res.json();
}

export async function wipeAllData() {
  const res = await fetch(`${API_BASE}/privacy/wipe`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to wipe data.');
  return res.json();
}

export async function fetchHelplines() {
  const res = await fetch(`${API_BASE}/help/helplines`);
  if (!res.ok) throw new Error('Failed to fetch helplines.');
  return res.json();
}
