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
  vendor: string;
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
  {
    rule_code: "SEC-AUTH-001",
    title: "Enable Password Encryption / Hashing",
    category: "Authentication",
    vendor: "cisco",
    severity: "CRITICAL",
    pass_pattern: /(service password-encryption|enable secret \d|username .* secret \d)/i,
    fail_pattern: /(no service password-encryption|enable password [^\d]|username .* password [^\d])/i,
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
    pass_pattern: /\baaa new-model\b/i,
    fail_pattern: /\bno aaa new-model\b/i,
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
    pass_pattern: /\bip ssh version 2\b/i,
    fail_pattern: /\b(ip ssh version 1|no ip ssh version 2)\b/i,
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
    pass_pattern: /transport input ssh$/i,
    fail_pattern: /transport input (telnet|all|telnet ssh)/i,
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
    pass_pattern: /\blogging host \d+\.\d+\.\d+\.\d+/i,
    fail_pattern: /\bno logging (console|buffered|host)\b/i,
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
    pass_pattern: /\bservice timestamps log datetime msec\b/i,
    fail_pattern: /\b(no service timestamps|service timestamps log uptime)\b/i,
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
    pass_pattern: /\bno snmp-server community (public|private)\b/i,
    fail_pattern: /\bsnmp-server community (public|private)\b/i,
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
    pass_pattern: /\bsnmp-server group .* v3 priv\b/i,
    fail_pattern: /\bsnmp-server group .* (v1|v2c)\b/i,
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
    pass_pattern: /\b(ntp server|system ntp server) [^\s]+/i,
    fail_pattern: /\bno ntp server\b/i,
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
    pass_pattern: /\bexec-timeout (0?[1-9]|10) 0\b/i,
    fail_pattern: /\bexec-timeout 0 0\b/i,
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
    pass_pattern: /\bbanner (motd|login)\b/i,
    fail_pattern: /\bno banner (motd|login)\b/i,
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
    pass_pattern: /\bdeny ip any any log\b/i,
    fail_pattern: /\bpermit ip any any\b/i,
    remediation: "access-list 100 deny ip any any log",
    cis: "CIS Cisco IOS Benchmark 6.1.1 (L2)",
    nist: "NIST SP 800-53 SC-7, AU-2",
    stig: "DISA STIG NET-1000",
    iso: "ISO 27001 A.13.1.1"
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
  const ipMatch = configText.match(/ip address\s+(\d+\.\d+\.\d+\.\d+)/i);
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

  // 4. Evaluate Deterministic Rules
  RULES_CATALOG.forEach((rule, idx) => {
    let status: 'PASS' | 'FAIL' = 'FAIL';
    let lineNo = 1;
    let evidenceText = `Missing required configuration directive for ${rule.title}`;

    // Search for pass pattern match across lines
    let matchedPassLine = -1;
    lines.forEach((lineStr, lineIdx) => {
      if (rule.pass_pattern.test(lineStr) && matchedPassLine === -1) {
        matchedPassLine = lineIdx + 1;
        evidenceText = `Line ${lineIdx + 1}: ${lineStr.trim()}`;
      }
    });

    if (matchedPassLine !== -1) {
      // Checked if superseded by explicit fail pattern
      let matchedFailLine = -1;
      lines.forEach((lineStr, lineIdx) => {
        if (rule.fail_pattern.test(lineStr) && matchedFailLine === -1) {
          matchedFailLine = lineIdx + 1;
        }
      });

      if (matchedFailLine !== -1 && matchedFailLine > matchedPassLine) {
        status = 'FAIL';
        lineNo = matchedFailLine;
        evidenceText = `Line ${matchedFailLine}: ${lines[matchedFailLine - 1].trim()}`;
      } else {
        status = 'PASS';
        lineNo = matchedPassLine;
      }
    } else {
      // Check fail pattern match
      lines.forEach((lineStr, lineIdx) => {
        if (rule.fail_pattern.test(lineStr) && lineNo === 1) {
          lineNo = lineIdx + 1;
          evidenceText = `Line ${lineIdx + 1}: ${lineStr.trim()}`;
        }
      });
      status = 'FAIL';
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

  const totalRules = RULES_CATALOG.length;
  const complianceScore = Number(((passedCount / totalRules) * 100).toFixed(1));

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
