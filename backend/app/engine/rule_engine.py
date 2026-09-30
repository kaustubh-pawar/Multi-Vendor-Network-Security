import re
from typing import List, Dict, Any, Tuple
from app.parsers.ir_models import ConfigurationIR
from app.engine.rules_catalog import RULES_CATALOG

def evaluate_compliance(ir: ConfigurationIR) -> List[Dict[str, Any]]:
    """
    Evaluates ConfigurationIR against deterministic rules catalog.
    Returns list of finding dictionaries with status PASS, FAIL, or N_A,
    remediation guidance, line spans, and multi-framework mappings.
    """
    findings: List[Dict[str, Any]] = []
    config_text = "\n".join(ir.raw_lines)
    lines = ir.raw_lines

    vendor = ir.vendor.lower()

    for rule in RULES_CATALOG:
        rule_vendor = rule["vendor"].lower()
        if rule_vendor != "all" and rule_vendor != vendor:
            continue

        pass_re = re.compile(rule["pass_pattern"], re.IGNORECASE | re.MULTILINE)
        fail_re = re.compile(rule["fail_pattern"], re.IGNORECASE | re.MULTILINE)

        pass_match = pass_re.search(config_text)
        fail_match = fail_re.search(config_text)

        if pass_match:
            # Find evidence line number
            start_line, end_line, raw_snippet = find_line_span(lines, pass_match.group(0))
            findings.append({
                "rule_code": rule["rule_code"],
                "title": rule["title"],
                "category": rule["category"],
                "severity": rule["default_severity"],
                "status": "PASS",
                "evidence_start_line": start_line,
                "evidence_end_line": end_line,
                "evidence_raw": raw_snippet,
                "remediation": f"Control is Compliant. Evidence: '{raw_snippet}'",
                "cis_mapping": rule.get("cis_mapping"),
                "nist_mapping": rule.get("nist_mapping"),
                "stig_mapping": rule.get("stig_mapping"),
                "iso_mapping": rule.get("iso_mapping"),
                "ai_confidence": 1.0,
                "is_ai_assisted": False,
                "requires_review": False
            })
        elif fail_match:
            start_line, end_line, raw_snippet = find_line_span(lines, fail_match.group(0))
            findings.append({
                "rule_code": rule["rule_code"],
                "title": rule["title"],
                "category": rule["category"],
                "severity": rule["default_severity"],
                "status": "FAIL",
                "evidence_start_line": start_line,
                "evidence_end_line": end_line,
                "evidence_raw": raw_snippet,
                "remediation": rule["remediation_guidance"],
                "cis_mapping": rule.get("cis_mapping"),
                "nist_mapping": rule.get("nist_mapping"),
                "stig_mapping": rule.get("stig_mapping"),
                "iso_mapping": rule.get("iso_mapping"),
                "ai_confidence": 1.0,
                "is_ai_assisted": False,
                "requires_review": False
            })
        else:
            # Not explicitly passed, failed, or missing required control
            findings.append({
                "rule_code": rule["rule_code"],
                "title": rule["title"],
                "category": rule["category"],
                "severity": rule["default_severity"],
                "status": "FAIL",
                "evidence_start_line": 1,
                "evidence_end_line": 1,
                "evidence_raw": f"Missing required configuration directive for {rule['title']}",
                "remediation": rule["remediation_guidance"],
                "cis_mapping": rule.get("cis_mapping"),
                "nist_mapping": rule.get("nist_mapping"),
                "stig_mapping": rule.get("stig_mapping"),
                "iso_mapping": rule.get("iso_mapping"),
                "ai_confidence": 1.0,
                "is_ai_assisted": False,
                "requires_review": False
            })

    return findings

def find_line_span(lines: List[str], snippet: str) -> Tuple[int, int, str]:
    clean_snippet = snippet.strip()
    for idx, line in enumerate(lines, start=1):
        if clean_snippet in line:
            return idx, idx, line.strip()
    return 1, 1, snippet
