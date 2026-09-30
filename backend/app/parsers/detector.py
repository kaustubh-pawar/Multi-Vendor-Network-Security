import re
from typing import Dict, Any, Tuple

CISCO_KEYWORDS = [
    r"^version\s+\d+\.\d+",
    r"^hostname\s+",
    r"^line\s+(vty|console|aux)",
    r"^interface\s+(GigabitEthernet|FastEthernet|TenGigabitEthernet|Loopback|Vlan)",
    r"^ip\s+domain-name",
    r"^service\s+password-encryption",
    r"^enable\s+(secret|password)",
    r"^aaa\s+new-model"
]

JUNOS_KEYWORDS = [
    r"^version\s+[0-9\.]+[R\-A-Z0-9]+;",
    r"^system\s*\{",
    r"^interfaces\s*\{",
    r"^protocols\s*\{",
    r"^security\s*\{",
    r"^set\s+system\s+",
    r"^set\s+interfaces\s+",
    r"^set\s+security\s+"
]

FORTIOS_KEYWORDS = [
    r"^config\s+system\s+global",
    r"^config\s+system\s+interface",
    r"^config\s+firewall\s+policy",
    r"^config\s+system\s+admin",
    r"^config\s+router\s+",
    r"#\s*build\d*",
    r"^set\s+hostname\s+"
]

def detect_vendor(config_text: str, hint: str = "auto") -> Tuple[str, str, float]:
    """
    Detects vendor and OS family from config text.
    Returns: (vendor, os_family, confidence)
    vendor: 'cisco', 'junos', 'fortios', or 'unknown'
    """
    if hint and hint.lower() in ["cisco", "junos", "fortios"]:
        return hint.lower(), f"{hint.lower()}_os", 1.0

    lines = [line.strip() for line in config_text.splitlines() if line.strip()]
    sample_text = "\n".join(lines[:100])

    cisco_score = sum(1 for kw in CISCO_KEYWORDS if re.search(kw, sample_text, re.MULTILINE | re.IGNORECASE))
    junos_score = sum(1 for kw in JUNOS_KEYWORDS if re.search(kw, sample_text, re.MULTILINE | re.IGNORECASE))
    fortios_score = sum(1 for kw in FORTIOS_KEYWORDS if re.search(kw, sample_text, re.MULTILINE | re.IGNORECASE))

    scores = {
        "cisco": (cisco_score, "ios"),
        "junos": (junos_score, "junos"),
        "fortios": (fortios_score, "fortios")
    }

    best_vendor = max(scores.items(), key=lambda x: x[1][0])
    max_score = best_vendor[1][0]

    if max_score == 0:
        return "cisco", "ios", 0.50 # Fallback default

    confidence = min(0.99, 0.60 + (max_score * 0.10))
    vendor_name = best_vendor[0]
    os_family = best_vendor[1][1]

    return vendor_name, os_family, round(confidence, 2)
