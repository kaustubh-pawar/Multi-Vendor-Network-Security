const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function fetchAuditJobs() {
  const res = await fetch(`${API_BASE}/audit/jobs`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch audit jobs');
  return res.json();
}

export async function fetchAuditJobById(id: string | number) {
  const res = await fetch(`${API_BASE}/audit/jobs/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch audit job');
  return res.json();
}

export async function uploadAuditConfig(formData: FormData) {
  const res = await fetch(`${API_BASE}/audit/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload audit file');
  return res.json();
}

export async function connectSSHAudit(payload: any) {
  const res = await fetch(`${API_BASE}/audit/ssh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed SSH device connection');
  return res.json();
}

export async function fetchMonitoredDevices() {
  const res = await fetch(`${API_BASE}/devices`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch monitored devices');
  return res.json();
}

export async function fetchAllFindings(severity?: string, vendor?: string, status?: string) {
  const params = new URLSearchParams();
  if (severity) params.append('severity', severity);
  if (vendor) params.append('vendor', vendor);
  if (status) params.append('status', status);

  const res = await fetch(`${API_BASE}/findings/?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch findings');
  return res.json();
}

export async function fetchFindingsSummary() {
  const res = await fetch(`${API_BASE}/findings/summary`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch findings summary');
  return res.json();
}

export async function fetchRemediationItems(vendor?: string) {
  const params = new URLSearchParams();
  if (vendor) params.append('vendor', vendor);

  const res = await fetch(`${API_BASE}/remediation/?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch remediation items');
  return res.json();
}

export async function fetchRulesCatalog(vendor?: string, category?: string) {
  const params = new URLSearchParams();
  if (vendor) params.append('vendor', vendor);
  if (category) params.append('category', category);
  
  const res = await fetch(`${API_BASE}/rules/?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch rules catalog');
  return res.json();
}

export async function fetchFrameworkStats() {
  const res = await fetch(`${API_BASE}/rules/frameworks`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch framework stats');
  return res.json();
}

export async function fetchReviewQueue() {
  const res = await fetch(`${API_BASE}/review/queue`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch review queue');
  return res.json();
}

export async function submitReviewDecision(payload: any) {
  const res = await fetch(`${API_BASE}/review/decide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to record review decision');
  return res.json();
}

export async function fetchMLTelemetry() {
  const res = await fetch(`${API_BASE}/ml/metrics`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch ML metrics');
  return res.json();
}

export async function predictMLPattern(snippet: string, vendor: string = 'cisco') {
  const res = await fetch(`${API_BASE}/ml/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ snippet, vendor }),
  });
  if (!res.ok) throw new Error('Failed to predict ML pattern');
  return res.json();
}

export async function retrainMLModel() {
  const res = await fetch(`${API_BASE}/ml/retrain`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to trigger retraining');
  return res.json();
}
