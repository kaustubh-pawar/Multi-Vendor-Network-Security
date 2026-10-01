'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Terminal, ShieldCheck, FileText, Server, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadAuditConfig, connectSSHAudit, getApiBase } from '@/lib/api';
import { downloadPdfTemplate } from '@/lib/pdfHelper';
import { useApp } from '@/context/AppContext';

const SAMPLE_CISCO_INSECURE = `! Insecure Cisco IOS Sample
version 15.2
hostname Core-Switch-01
enable password cisco123
no service password-encryption
no aaa new-model
!
line vty 0 4
 transport input telnet
 exec-timeout 0 0
!
snmp-server community public RO
snmp-server community private RW
no logging host
`;

const SAMPLE_JUNOS_INSECURE = `## Insecure Junos OS Sample
system {
    host-name Edge-Router-Junos;
    root-authentication {
        plain-text-password;
    }
    services {
        ssh {
            root-login allow;
        }
    }
}
`;

const SAMPLE_FORTIOS_INSECURE = `# Insecure FortiOS Sample
config system global
    set hostname FortiGate-300E
end
config system admin
    edit "admin"
        set password 12345
    end
end
config system interface
    edit "mgmt"
        set allowaccess http https ssh
    end
end
`;

export default function NewAuditPage() {
  const router = useRouter();
  const { audio } = useApp();
  const [activeTab, setActiveTab] = useState<'upload' | 'ssh'>('upload');

  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [hostname, setHostname] = useState('Core-RTR-01');
  const [vendorHint, setVendorHint] = useState('auto');
  const [configText, setConfigText] = useState(SAMPLE_CISCO_INSECURE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SSH Form State
  const [sshData, setSshData] = useState({
    hostname: 'Core-Router-SSH',
    ip_address: '192.168.1.1',
    port: 22,
    vendor: 'cisco',
    username: 'admin',
    password: 'Password123!',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setHostname(f.name.replace(/\.[^/.]+$/, ""));
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setConfigText(event.target.result as string);
        }
      };
      reader.readAsText(f);
    }
  };

  const loadSample = (type: 'cisco' | 'junos' | 'fortios') => {
    if (type === 'cisco') {
      setConfigText(SAMPLE_CISCO_INSECURE);
      setHostname('Cisco-Core-Switch');
      setVendorHint('cisco');
    } else if (type === 'junos') {
      setConfigText(SAMPLE_JUNOS_INSECURE);
      setHostname('Junos-Edge-Rtr');
      setVendorHint('junos');
    } else {
      setConfigText(SAMPLE_FORTIOS_INSECURE);
      setHostname('FortiGate-300E');
      setVendorHint('fortios');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else {
        const blob = new Blob([configText], { type: 'text/plain' });
        formData.append('file', blob, `${hostname}.cfg`);
      }
      formData.append('hostname', hostname);
      formData.append('vendor_hint', vendorHint);

      const job = await uploadAuditConfig(formData);
      router.push(`/audit/${job.id}`);
    } catch (err: any) {
      setError(err.message || 'Audit execution failed');
      setLoading(false);
    }
  };

  const handleSSHSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const job = await connectSSHAudit(sshData);
      router.push(`/audit/${job.id}`);
    } catch (err: any) {
      setError(err.message || 'SSH connection failed');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-white flex items-center gap-3">
          New Security Audit Job
          <span className="px-3 py-0.5 rounded-full text-xs font-mono bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] font-bold uppercase">
            Automated Ingestion
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload network device configuration file or connect directly via authorized SSH credentials.
        </p>
      </div>

      {/* Box Buttons for Option A & Option B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Option A Box Button */}
        <button
          type="button"
          onClick={() => { setActiveTab('upload'); audio.play('click'); }}
          className={`relative p-5 rounded-2xl border text-left transition-all group ${
            activeTab === 'upload'
              ? 'bg-[#141620] border-[#f59e0b] shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-[1.01]'
              : 'bg-[#0f1016] border-[#1f222a] hover:border-[#f59e0b]/50 hover:bg-[#14151f]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl border transition-colors ${
              activeTab === 'upload'
                ? 'bg-[#f59e0b]/20 border-[#f59e0b]/50 text-[#f59e0b]'
                : 'bg-[#181922] border-[#252836] text-slate-400 group-hover:text-[#f59e0b]'
            }`}>
              <Upload className="h-5 w-5" />
            </div>
            <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
              activeTab === 'upload'
                ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40'
                : 'bg-[#161720] text-slate-500 border border-[#222533]'
            }`}>
              Option A
            </span>
          </div>

          <h3 className={`font-serif font-bold text-base mb-1 ${activeTab === 'upload' ? 'text-white' : 'text-slate-300'}`}>
            Config File Upload
          </h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Upload raw configuration scripts (.cfg, .txt) or paste multi-vendor CLI text for instant AI rule evaluation.
          </p>

          {activeTab === 'upload' && (
            <div className="mt-3 pt-2.5 border-t border-[#f59e0b]/20 flex items-center justify-between font-mono text-[11px] text-[#f59e0b] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
                Active Ingestion Mode
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#f59e0b]" />
            </div>
          )}
        </button>

        {/* Option B Box Button */}
        <button
          type="button"
          onClick={() => { setActiveTab('ssh'); audio.play('click'); }}
          className={`relative p-5 rounded-2xl border text-left transition-all group ${
            activeTab === 'ssh'
              ? 'bg-[#141620] border-[#f59e0b] shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-[1.01]'
              : 'bg-[#0f1016] border-[#1f222a] hover:border-[#f59e0b]/50 hover:bg-[#14151f]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl border transition-colors ${
              activeTab === 'ssh'
                ? 'bg-[#f59e0b]/20 border-[#f59e0b]/50 text-[#f59e0b]'
                : 'bg-[#181922] border-[#252836] text-slate-400 group-hover:text-[#f59e0b]'
            }`}>
              <Terminal className="h-5 w-5" />
            </div>
            <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
              activeTab === 'ssh'
                ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40'
                : 'bg-[#161720] text-slate-500 border border-[#222533]'
            }`}>
              Option B
            </span>
          </div>

          <h3 className={`font-serif font-bold text-base mb-1 ${activeTab === 'ssh' ? 'text-white' : 'text-slate-300'}`}>
            Live SSH Device Fetch
          </h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Connect to live routers, switches, or firewalls via encrypted SSH tunnel to retrieve active running-config.
          </p>

          {activeTab === 'ssh' && (
            <div className="mt-3 pt-2.5 border-t border-[#f59e0b]/20 flex items-center justify-between font-mono text-[11px] text-[#f59e0b] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
                Active SSH Fetch Mode
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#f59e0b]" />
            </div>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-fail/10 border border-fail/30 text-fail text-xs font-mono">
          Error: {error}
        </div>
      )}

      {activeTab === 'upload' ? (
        <form onSubmit={handleUploadSubmit} className="glass-panel p-7 rounded-3xl border border-[#1f222a] space-y-6">
          {/* Quick Preset Buttons & PDF Template Download */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Load Sample Fixtures or Download PDF Template:</span>
              <button
                type="button"
                onClick={() => downloadPdfTemplate(vendorHint === 'auto' ? 'cisco' : vendorHint)}
                className="px-3 py-1 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/50 hover:bg-[#f59e0b]/25 text-[11px] font-mono text-[#f59e0b] font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
              >
                <FileText className="h-3.5 w-3.5 text-[#f59e0b]" /> Download PDF Template (.pdf)
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => loadSample('cisco')}
                className="px-3.5 py-1.5 rounded-full bg-[#18191e] border border-[#282b36] hover:border-[#f59e0b] text-xs font-mono text-white transition-all flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#f59e0b]" /> Cisco IOS Preset
              </button>
              <button
                type="button"
                onClick={() => loadSample('junos')}
                className="px-3.5 py-1.5 rounded-full bg-[#18191e] border border-[#282b36] hover:border-[#f59e0b] text-xs font-mono text-white transition-all flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#f59e0b]" /> Juniper Junos Preset
              </button>
              <button
                type="button"
                onClick={() => loadSample('fortios')}
                className="px-3.5 py-1.5 rounded-full bg-[#18191e] border border-[#282b36] hover:border-[#f59e0b] text-xs font-mono text-white transition-all flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#f59e0b]" /> Fortinet FortiOS Preset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Target Hostname</label>
              <input
                type="text"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs focus:border-[#f59e0b] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Vendor OS Family</label>
              <select
                value={vendorHint}
                onChange={(e) => setVendorHint(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs focus:border-[#f59e0b] focus:outline-none font-mono"
              >
                <option value="auto">Auto-Detect Fingerprint (Recommended)</option>
                <option value="cisco">Cisco IOS</option>
                <option value="junos">Juniper Junos</option>
                <option value="fortios">Fortinet FortiOS</option>
              </select>
            </div>
          </div>

          {/* Drag & Drop File Input with PDF Support */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Configuration File (.pdf, .cfg, .txt, .log, .conf)
            </label>
            <div className="border-2 border-dashed border-[#22252e] hover:border-[#f59e0b]/60 rounded-2xl p-6 text-center bg-[#14151a]/40 transition-all">
              <Upload className="h-8 w-8 text-[#f59e0b] mx-auto mb-2" />
              <p className="text-xs text-white font-medium">Click to browse or drop PDF or CLI configuration file here</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports PDF Configuration Templates (.pdf) & raw Cisco, Junos, FortiOS syntax
              </p>
              <input
                type="file"
                accept=".pdf,.txt,.cfg,.conf,.log"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="mt-3 inline-block px-4 py-1.5 rounded-full bg-[#18191e] text-xs font-mono text-[#f59e0b] cursor-pointer hover:bg-[#20222a] border border-[#f59e0b]/40 font-bold"
              >
                {file ? file.name : 'Select PDF or Config File'}
              </label>

              {file && file.name.toLowerCase().endsWith('.pdf') && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-400 font-mono text-[11px] font-bold">
                  <FileText className="w-3.5 h-3.5 text-blue-400" /> PDF Template File Detected — Auto Text Extraction Active
                </div>
              )}
            </div>
          </div>

          {/* Config Editor Textarea */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Raw Configuration Editor</label>
            <textarea
              rows={10}
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#08090d] border border-[#1f222a] font-mono text-xs text-amber-200 focus:border-[#f59e0b] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-amber-pill py-3.5 text-xs font-bold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {loading ? 'Running Compliance Engine & AI Analysis...' : 'Execute Compliance Audit'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSSHSubmit} className="glass-panel p-7 rounded-3xl border border-[#1f222a] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Device Hostname</label>
              <input
                type="text"
                value={sshData.hostname}
                onChange={(e) => setSshData({ ...sshData, hostname: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs focus:border-[#f59e0b] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Target IP Address</label>
              <input
                type="text"
                value={sshData.ip_address}
                onChange={(e) => setSshData({ ...sshData, ip_address: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs focus:border-[#f59e0b] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">SSH Port</label>
              <input
                type="number"
                value={sshData.port}
                onChange={(e) => setSshData({ ...sshData, port: parseInt(e.target.value) || 22 })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs focus:border-[#f59e0b] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Vendor Ecosystem</label>
              <select
                value={sshData.vendor}
                onChange={(e) => setSshData({ ...sshData, vendor: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs focus:border-[#f59e0b] focus:outline-none font-mono"
              >
                <option value="cisco">Cisco IOS</option>
                <option value="junos">Juniper Junos</option>
                <option value="fortios">Fortinet FortiOS</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">SSH Username</label>
              <input
                type="text"
                value={sshData.username}
                onChange={(e) => setSshData({ ...sshData, username: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs focus:border-[#f59e0b] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">SSH Password / Secret</label>
              <input
                type="password"
                value={sshData.password}
                onChange={(e) => setSshData({ ...sshData, password: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#14151a] border border-[#22252e] text-white text-xs focus:border-[#f59e0b] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#14151a] border border-[#22252e] text-xs text-slate-400 flex items-center gap-3">
            <Server className="h-5 w-5 text-[#f59e0b] shrink-0" />
            <p>SSH credentials remain server-side and are used strictly to collect running configuration over encrypted SSH channel.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-amber-pill py-3.5 text-xs font-bold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Terminal className="h-4 w-4" />}
            {loading ? 'Connecting & Fetching Configuration via SSH...' : 'Connect & Audit Device'}
          </button>
        </form>
      )}
    </div>
  );
}
