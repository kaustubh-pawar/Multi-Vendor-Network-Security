export interface FindingItem {
  id: number;
  job_id: number;
  rule_code: string;
  rule_title: string;
  title: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PASS' | 'FAIL';
  evidence_start_line: number;
  evidence_end_line: number;
  evidence_raw: string;
  description: string;
  remediation_cli: string;
  framework: string;
  cis_mapping: string;
  nist_mapping: string;
  stig_mapping: string;
  iso_mapping: string;
}

export interface EvaluatedAuditJob {
  id: number;
  job_number: string;
  hostname: string;
  vendor: string;
  ip_address: string;
  compliance_score: number;
  status: 'COMPLETED';
  created_at: string;
  total_rules_evaluated: number;
  passed_rules: number;
  failed_rules: number;
  file_path: string;
  file_hash: string;
  findings: FindingItem[];
}

interface RuleDefinition {
  rule_code: string;
  title: string;
  category: string;
  vendor: 'cisco' | 'junos' | 'fortios' | 'all';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  pass_pattern: RegExp;
  fail_pattern: RegExp;
  remediation: string;
  cis: string;
  nist: string;
  stig: string;
  iso: string;
}

const RULES_CATALOG: RuleDefinition[] = [
  // --- Cisco IOS Rules ---
  {
    rule_code: "SEC-AUTH-001",
    title: "Enable Password Encryption / Hashing",
    category: "Authentication",
    vendor: "cisco",
    severity: "CRITICAL",
    pass_pattern: /^\s*(?!no\s+)(service password-encryption|enable secret|username .* secret)/i,
    fail_pattern: /^\s*(no service password-encryption|enable password\b|username .* password\s+0)/i,
    remediation: "enable secret <STRONG_PASSWORD>\nservice password-encryption",
    cis: "CIS Cisco IOS Benchmark 1.1.1 (L1)",
    nist: "NIST SP 800-53 IA-5(1)",
    stig: "DISA STIG NET-0410",
    iso: "ISO 27001 A.9.4.3"
  },
  {
    rule_code: "SEC-AUTH-002",
    title: "AAA Authentication Model Enabled",
    category: "Authentication",
    vendor: "cisco",
    severity: "HIGH",
    pass_pattern: /^\s*(?!no\s+)aaa new-model/i,
    fail_pattern: /^\s*no aaa new-model/i,
    remediation: "aaa new-model\naaa authentication login default local group radius",
    cis: "CIS Cisco IOS Benchmark 1.2.1 (L1)",
    nist: "NIST SP 800-53 AC-2, IA-2",
    stig: "DISA STIG NET-0420",
    iso: "ISO 27001 A.9.2.1"
  },
  {
    rule_code: "SEC-RMT-001",
    title: "Enforce SSH Version 2 Only",
    category: "Remote Access",
    vendor: "cisco",
    severity: "CRITICAL",
    pass_pattern: /^\s*(?!no\s+)ip ssh version 2/i,
    fail_pattern: /^\s*(ip ssh version 1|no ip ssh version 2)/i,
    remediation: "ip ssh version 2\ncrypto key generate rsa modulus 2048",
    cis: "CIS Cisco IOS Benchmark 2.1.1 (L1)",
    nist: "NIST SP 800-53 AC-17, IA-5",
    stig: "DISA STIG NET-0600",
    iso: "ISO 27001 A.13.1.1"
  },
  {
    rule_code: "SEC-RMT-002",
    title: "Disable Unencrypted Telnet Access",
    category: "Remote Access",
    vendor: "cisco",
    severity: "CRITICAL",
    pass_pattern: /^\s*transport input ssh\s*$/i,
    fail_pattern: /^\s*transport input .*(telnet|all)/i,
    remediation: "line vty 0 15\n transport input ssh",
    cis: "CIS Cisco IOS Benchmark 2.1.2 (L1)",
    nist: "NIST SP 800-53 AC-17(2)",
    stig: "DISA STIG NET-0610",
    iso: "ISO 27001 A.13.1.2"
  },
  {
    rule_code: "SEC-LOG-001",
    title: "Centralized Remote Syslog Server",
    category: "Logging",
    vendor: "cisco",
    severity: "HIGH",
    pass_pattern: /^\s*(?!no\s+)logging host \d+\.\d+\.\d+\.\d+/i,
    fail_pattern: /^\s*no logging (console|buffered|host)/i,
    remediation: "logging host 10.10.10.50\nlogging trap informational",
    cis: "CIS Cisco IOS Benchmark 3.1.1 (L1)",
    nist: "NIST SP 800-53 AU-3, AU-6",
    stig: "DISA STIG NET-0700",
    iso: "ISO 27001 A.12.4.1"
  },
  {
    rule_code: "SEC-LOG-002",
    title: "Millisecond Timestamping for Log Messages",
    category: "Logging",
    vendor: "cisco",
    severity: "MEDIUM",
    pass_pattern: /^\s*(?!no\s+)service timestamps log datetime msec/i,
    fail_pattern: /^\s*(no service timestamps|service timestamps log uptime)/i,
    remediation: "service timestamps log datetime msec show-timezone localtime",
    cis: "CIS Cisco IOS Benchmark 3.1.2 (L1)",
    nist: "NIST SP 800-53 AU-8",
    stig: "DISA STIG NET-0710",
    iso: "ISO 27001 A.12.4.4"
  },
  {
    rule_code: "SEC-SNMP-001",
    title: "Disable Default SNMP Community Strings",
    category: "SNMP",
    vendor: "cisco",
    severity: "CRITICAL",
    pass_pattern: /^\s*no snmp-server community (public|private)/i,
    fail_pattern: /^\s*(?!no\s+)snmp-server community (public|private)/i,
    remediation: "no snmp-server community public\nno snmp-server community private",
    cis: "CIS Cisco IOS Benchmark 4.1.1 (L1)",
    nist: "NIST SP 800-53 IA-2, SC-7",
    stig: "DISA STIG NET-0800",
    iso: "ISO 27001 A.13.1.3"
  },
  {
    rule_code: "SEC-SNMP-002",
    title: "Enforce SNMP v3 Security Group",
    category: "SNMP",
    vendor: "cisco",
    severity: "HIGH",
    pass_pattern: /^\s*(?!no\s+)snmp-server group .* v3 priv/i,
    fail_pattern: /^\s*(?!no\s+)snmp-server community (public|private)/i,
    remediation: "snmp-server group SECGROUP v3 priv\nsnmp-server user SECUSER SECGROUP v3 auth sha <pass> priv aes 128 <pass>",
    cis: "CIS Cisco IOS Benchmark 4.1.2 (L1)",
    nist: "NIST SP 800-53 SC-8, IA-2",
    stig: "DISA STIG NET-0810",
    iso: "ISO 27001 A.13.2.1"
  },
  {
    rule_code: "SEC-NTP-001",
    title: "NTP Server Synchronization & Authentication",
    category: "NTP",
    vendor: "cisco",
    severity: "MEDIUM",
    pass_pattern: /^\s*(?!no\s+)(ntp server|system ntp server)\s+[^\s]+/i,
    fail_pattern: /^\s*no ntp server/i,
    remediation: "ntp authenticate\nntp server 10.100.1.1 key 1",
    cis: "CIS Cisco IOS Benchmark 5.1.1 (L1)",
    nist: "NIST SP 800-53 AU-8(1)",
    stig: "DISA STIG NET-0900",
    iso: "ISO 27001 A.12.4.4"
  },
  {
    rule_code: "SEC-ADM-001",
    title: "VTY Exec Timeout Limit",
    category: "Admin Access",
    vendor: "cisco",
    severity: "HIGH",
    pass_pattern: /^\s*(?!no\s+)exec-timeout (0?[1-9]|10) 0/i,
    fail_pattern: /^\s*exec-timeout 0 0/i,
    remediation: "line vty 0 15\n exec-timeout 10 0",
    cis: "CIS Cisco IOS Benchmark 1.3.1 (L1)",
    nist: "NIST SP 800-53 AC-12",
    stig: "DISA STIG NET-0500",
    iso: "ISO 27001 A.11.2.9"
  },
  {
    rule_code: "SEC-ADM-002",
    title: "Login Unauthorized Access Warning Banner",
    category: "Admin Access",
    vendor: "cisco",
    severity: "LOW",
    pass_pattern: /^\s*(?!no\s+)banner (motd|login)/i,
    fail_pattern: /^\s*no banner (motd|login)/i,
    remediation: "banner motd ^C Unauthorized access is strictly prohibited. ^C",
    cis: "CIS Cisco IOS Benchmark 1.4.1 (L1)",
    nist: "NIST SP 800-53 AC-8",
    stig: "DISA STIG NET-0510",
    iso: "ISO 27001 A.13.1.1"
  },
  {
    rule_code: "SEC-ACL-001",
    title: "Explicit Deny and Logging on Access Lists",
    category: "Firewall ACL",
    vendor: "cisco",
    severity: "HIGH",
    pass_pattern: /^\s*deny ip any any log/i,
    fail_pattern: /^\s*permit ip any any/i,
    remediation: "access-list 100 deny ip any any log",
    cis: "CIS Cisco IOS Benchmark 6.1.1 (L2)",
    nist: "NIST SP 800-53 SC-7, AU-2",
    stig: "DISA STIG NET-1000",
    iso: "ISO 27001 A.13.1.1"
  },

  // --- Juniper Junos Rules ---
  {
    rule_code: "JUN-AUTH-001",
    title: "Encrypted Root Authentication (SHA-512)",
    category: "Authentication",
    vendor: "junos",
    severity: "CRITICAL",
    pass_pattern: /encrypted-password "\$6\$/i,
    fail_pattern: /(plain-text-password|encrypted-password "\$1\$)/i,
    remediation: "set system root-authentication plain-text-password (uses SHA-512 $6$ hashing)",
    cis: "CIS Juniper Junos Benchmark 1.1 (L1)",
    nist: "NIST SP 800-53 IA-5(2)",
    stig: "DISA STIG JUN-0010",
    iso: "ISO 27001 A.9.4.3"
  },
  {
    rule_code: "JUN-RMT-001",
    title: "Enforce SSH v2 & Restrict Root Login",
    category: "Remote Access",
    vendor: "junos",
    severity: "CRITICAL",
    pass_pattern: /(protocol-version v2|root-login deny)/i,
    fail_pattern: /(protocol-version v1|telnet;|ftp;|root-login allow)/i,
    remediation: "set system services ssh protocol-version v2\nset system services ssh root-login deny",
    cis: "CIS Juniper Junos Benchmark 2.2.1 (L1)",
    nist: "NIST SP 800-53 AC-17, IA-2",
    stig: "DISA STIG JUN-0120",
    iso: "ISO 27001 A.9.4.2"
  },
  {
    rule_code: "JUN-LOG-001",
    title: "Remote Syslog Host Configured",
    category: "Logging",
    vendor: "junos",
    severity: "HIGH",
    pass_pattern: /host \d+\.\d+\.\d+\.\d+/i,
    fail_pattern: /no remote syslog/i,
    remediation: "set system syslog host 10.0.0.5 any notice structured-data",
    cis: "CIS Juniper Junos Benchmark 3.1 (L1)",
    nist: "NIST SP 800-53 AU-3",
    stig: "DISA STIG JUN-0200",
    iso: "ISO 27001 A.12.4.1"
  },

  // --- Fortinet FortiOS Rules ---
  {
    rule_code: "FGT-ADM-001",
    title: "Disable Insecure HTTP Admin & Redirect to HTTPS",
    category: "Admin Access",
    vendor: "fortios",
    severity: "CRITICAL",
    pass_pattern: /(set admin-https-redirect enable|set admin-port disable|set admin-sport 8443|set admin-port 8080)/i,
    fail_pattern: /(set admin-port 80\b|set admin-https-redirect disable)/i,
    remediation: "set admin-https-redirect enable\nset admin-port disable\nset admin-sport 8443",
    cis: "CIS Fortinet FortiOS Benchmark 2.1.3 (L1)",
    nist: "NIST SP 800-53 AC-17(1)",
    stig: "DISA STIG FGT-0050",
    iso: "ISO 27001 A.13.1.1"
  },
  {
    rule_code: "FGT-RMT-001",
    title: "Restrict Interface Administrative Access",
    category: "Remote Access",
    vendor: "fortios",
    severity: "CRITICAL",
    pass_pattern: /set allowaccess (ping|https|ssh)/i,
    fail_pattern: /set allowaccess .*(http|telnet)/i,
    remediation: "set allowaccess ping https ssh",
    cis: "CIS Fortinet FortiOS Benchmark 2.2 (L1)",
    nist: "NIST SP 800-53 AC-17",
    stig: "DISA STIG FGT-0060",
    iso: "ISO 27001 A.13.1.2"
  },
  {
    rule_code: "FGT-LOG-001",
    title: "Enable Syslog Event Logging",
    category: "Logging",
    vendor: "fortios",
    severity: "HIGH",
    pass_pattern: /config log syslogd setting[\s\S]*?set status enable/i,
    fail_pattern: /config log syslogd setting[\s\S]*?set status disable/i,
    remediation: "config log syslogd setting\n set status enable\n set server 10.0.0.5\nend",
    cis: "CIS Fortinet FortiOS Benchmark 3.2 (L1)",
    nist: "NIST SP 800-53 AU-2",
    stig: "DISA STIG FGT-0110",
    iso: "ISO 27001 A.12.4.1"
  }
];

export function evaluateConfigurationText(
  configText: string,
  userHostname?: string,
  vendorHint: string = 'auto'
): EvaluatedAuditJob {
  const lines = configText.split(/\r?\n/);

  // 1. Extract Hostname
  let hostname = userHostname && userHostname.trim() ? userHostname.trim() : '';
  const hostMatch = configText.match(/^\s*(?:hostname|host-name|set hostname)\s+([^\s;\r\n]+)/m);
  if (hostMatch && hostMatch[1]) {
    hostname = hostMatch[1].replace(/["']/g, '');
  }
  if (!hostname) {
    hostname = `Device-${Math.floor(100 + Math.random() * 900)}`;
  }

  // 2. Extract IP Address
  let ipAddress = '192.168.1.1';
  const ipMatch = configText.match(/ip address\s+(\d+\.\d+\.\d+\.\d+)/i) ||
                  configText.match(/address\s+(\d+\.\d+\.\d+\.\d+)/i) ||
                  configText.match(/set ip\s+(\d+\.\d+\.\d+\.\d+)/i);
  if (ipMatch && ipMatch[1]) {
    ipAddress = ipMatch[1];
  }

  // 3. Auto-Detect Vendor OS
  let vendor = vendorHint;
  if (vendor === 'auto') {
    if (/system\s*\{|root-authentication/i.test(configText)) {
      vendor = 'junos';
    } else if (/config system global|set allowaccess/i.test(configText)) {
      vendor = 'fortios';
    } else {
      vendor = 'cisco';
    }
  }

  const jobId = Date.now();
  const findings: FindingItem[] = [];
  let passedCount = 0;
  let failedCount = 0;

  // Filter rules relevant to detected vendor
  const applicableRules = RULES_CATALOG.filter(
    (r) => r.vendor === 'all' || r.vendor === vendor
  );

  // 4. Evaluate Deterministic Rules
  applicableRules.forEach((rule, idx) => {
    let status: 'PASS' | 'FAIL' = 'FAIL';
    let lineNo = 1;
    let evidenceText = `Missing required configuration directive for ${rule.title}`;

    // A. Check explicit FAIL pattern match
    let matchedFailLine = -1;
    lines.forEach((lineStr, lineIdx) => {
      if (rule.fail_pattern.test(lineStr) && matchedFailLine === -1) {
        matchedFailLine = lineIdx + 1;
      }
    });

    // B. Check PASS pattern match
    let matchedPassLine = -1;
    lines.forEach((lineStr, lineIdx) => {
      if (rule.pass_pattern.test(lineStr) && matchedPassLine === -1) {
        matchedPassLine = lineIdx + 1;
      }
    });

    // C. Multiline pattern match check if line-by-line didn't find pass line
    if (matchedFailLine === -1 && matchedPassLine === -1) {
      if (rule.pass_pattern.test(configText)) {
        matchedPassLine = 1;
      } else if (rule.fail_pattern.test(configText)) {
        matchedFailLine = 1;
      }
    }

    if (matchedFailLine !== -1 && matchedPassLine === -1) {
      status = 'FAIL';
      lineNo = matchedFailLine;
      evidenceText = matchedFailLine > 0 && lines[matchedFailLine - 1]
        ? `Line ${matchedFailLine}: ${lines[matchedFailLine - 1].trim()}`
        : `Non-compliant directive detected for ${rule.title}`;
    } else if (matchedPassLine !== -1 && matchedFailLine === -1) {
      status = 'PASS';
      lineNo = matchedPassLine;
      evidenceText = matchedPassLine > 0 && lines[matchedPassLine - 1]
        ? `Line ${matchedPassLine}: ${lines[matchedPassLine - 1].trim()}`
        : `Compliant directive present for ${rule.title}`;
    } else if (matchedPassLine !== -1 && matchedFailLine !== -1) {
      // Both matched, check precedence or line position
      status = matchedPassLine < matchedFailLine ? 'PASS' : 'FAIL';
      lineNo = status === 'PASS' ? matchedPassLine : matchedFailLine;
      evidenceText = lineNo > 0 && lines[lineNo - 1] ? `Line ${lineNo}: ${lines[lineNo - 1].trim()}` : rule.title;
    } else {
      status = 'FAIL';
      lineNo = 1;
      evidenceText = `Missing required configuration directive for ${rule.title}`;
    }

    if (status === 'PASS') passedCount++;
    else failedCount++;

    findings.push({
      id: jobId + idx + 1,
      job_id: jobId,
      rule_code: rule.rule_code,
      rule_title: rule.title,
      title: rule.title,
      category: rule.category,
      severity: rule.severity,
      status: status,
      evidence_start_line: lineNo,
      evidence_end_line: lineNo,
      evidence_raw: evidenceText,
      description: status === 'PASS'
        ? `Control is compliant. Evidence: '${evidenceText}'`
        : `Control non-compliance detected. Directive requires configuration update.`,
      remediation_cli: rule.remediation,
      framework: `${rule.cis} / ${rule.stig}`,
      cis_mapping: rule.cis,
      nist_mapping: rule.nist,
      stig_mapping: rule.stig,
      iso_mapping: rule.iso
    });
  });

  const totalRules = applicableRules.length;
  const complianceScore = totalRules > 0 ? Number(((passedCount / totalRules) * 100).toFixed(1)) : 100;

  return {
    id: jobId,
    job_number: `JOB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    hostname: hostname,
    vendor: vendor.toLowerCase(),
    ip_address: ipAddress,
    compliance_score: complianceScore,
    status: 'COMPLETED',
    created_at: new Date().toISOString(),
    total_rules_evaluated: totalRules,
    passed_rules: passedCount,
    failed_rules: failedCount,
    file_path: `/configs/${hostname}.cfg`,
    file_hash: 'a1b2c3d4e5f6a1b2c3d4e5f6',
    findings: findings
  };
}
