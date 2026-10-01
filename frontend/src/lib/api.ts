export function getApiBase(): string {
  // 1. If explicit environment variable is set at build/runtime
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== '') {
    const url = process.env.NEXT_PUBLIC_API_URL.trim();
    return url.endsWith('/api') ? url : `${url.replace(/\/$/, '')}/api`;
  }

  // 2. Browser context auto-discovery
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Railway Deployment Auto-Mapping:
    // e.g., multi-vendor-network-security-frontend-production.up.railway.app
    // -> https://multi-vendor-network-security-backend-production.up.railway.app/api
    if (hostname.includes('railway.app')) {
      const backendHost = hostname
        .replace('-frontend-', '-backend-')
        .replace('-frontend.', '-backend.');
      return `${protocol}//${backendHost}/api`;
    }

    // Localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8000/api';
    }

    // LAN / Custom Hostname
    return `${protocol}//${hostname}:8000/api`;
  }

  return 'http://127.0.0.1:8000/api';
}

export async function loginUserApi(email: string, accessKey: string) {
  const base = getApiBase();
  const res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, accessKey }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Authentication failed');
  }
  return res.json();
}

export async function registerUserApi(userData: {
  name: string;
  email: string;
  accessKey: string;
  clearance?: string;
  role?: string;
}) {
  const base = getApiBase();
  const res = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Registration failed');
  }
  return res.json();
}

export async function fetchAuditJobs() {
  const base = getApiBase();
  const res = await fetch(`${base}/audit/jobs`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch audit jobs');
  return res.json();
}

export async function fetchAuditJobById(id: string | number) {
  const base = getApiBase();
  const res = await fetch(`${base}/audit/jobs/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch audit job');
  return res.json();
}

export async function uploadAuditConfig(formData: FormData) {
  const base = getApiBase();
  const res = await fetch(`${base}/audit/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload audit file');
  return res.json();
}

export async function connectSSHAudit(payload: any) {
  const base = getApiBase();
  const res = await fetch(`${base}/audit/ssh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed SSH device connection');
  return res.json();
}

export async function fetchMonitoredDevices() {
  const base = getApiBase();
  const res = await fetch(`${base}/devices`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch monitored devices');
  return res.json();
}

export async function fetchAllFindings(severity?: string, vendor?: string, status?: string) {
  const base = getApiBase();
  const params = new URLSearchParams();
  if (severity) params.append('severity', severity);
  if (vendor) params.append('vendor', vendor);
  if (status) params.append('status', status);

  const res = await fetch(`${base}/findings/?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch findings');
  return res.json();
}

export async function fetchFindingsSummary() {
  const base = getApiBase();
  const res = await fetch(`${base}/findings/summary`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch findings summary');
  return res.json();
}

export async function fetchRemediationItems(vendor?: string) {
  const base = getApiBase();
  const params = new URLSearchParams();
  if (vendor) params.append('vendor', vendor);

  const res = await fetch(`${base}/remediation/?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch remediation items');
  return res.json();
}

export async function fetchRulesCatalog(vendor?: string, category?: string) {
  const base = getApiBase();
  const params = new URLSearchParams();
  if (vendor) params.append('vendor', vendor);
  if (category) params.append('category', category);
  
  const res = await fetch(`${base}/rules/?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch rules catalog');
  return res.json();
}

export async function fetchFrameworkStats() {
  const base = getApiBase();
  const res = await fetch(`${base}/rules/frameworks`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch framework stats');
  return res.json();
}

export async function fetchReviewQueue() {
  const base = getApiBase();
  const res = await fetch(`${base}/review/queue`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch review queue');
  return res.json();
}

export async function submitReviewDecision(payload: any) {
  const base = getApiBase();
  const res = await fetch(`${base}/review/decide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to record review decision');
  return res.json();
}

export async function fetchMLTelemetry() {
  const base = getApiBase();
  const res = await fetch(`${base}/ml/metrics`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch ML metrics');
  return res.json();
}

export async function predictMLPattern(snippet: string, vendor: string = 'cisco') {
  const base = getApiBase();
  const res = await fetch(`${base}/ml/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ snippet, vendor }),
  });
  if (!res.ok) throw new Error('Failed to predict ML pattern');
  return res.json();
}

export async function retrainMLModel() {
  const base = getApiBase();
  const res = await fetch(`${base}/ml/retrain`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to trigger retraining');
  return res.json();
}
