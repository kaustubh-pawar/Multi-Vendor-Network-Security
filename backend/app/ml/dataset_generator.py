import random
import json
from typing import List, Dict, Any

CATEGORIES = [
    "Authentication",
    "Remote Access",
    "Logging",
    "SNMP",
    "NTP",
    "Admin Access",
    "Firewall ACL",
    "Encryption"
]

SEVERITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]

TEMPLATES = [
    # Cisco Authentication & Passwords
    {"vendor": "cisco", "category": "Authentication", "severity": "CRITICAL", "text": "enable password cisco123"},
    {"vendor": "cisco", "category": "Authentication", "severity": "CRITICAL", "text": "enable password adminpass"},
    {"vendor": "cisco", "category": "Authentication", "severity": "LOW", "text": "enable secret 9 $9$x9a2$K2h9j0x10L1m2N"},
    {"vendor": "cisco", "category": "Authentication", "severity": "LOW", "text": "service password-encryption"},
    {"vendor": "cisco", "category": "Authentication", "severity": "HIGH", "text": "username admin password 0 secretpass"},
    {"vendor": "cisco", "category": "Authentication", "severity": "LOW", "text": "username admin secret 8 $8$a1b2c3d4e5f6g7"},
    {"vendor": "cisco", "category": "Authentication", "severity": "HIGH", "text": "aaa new-model"},
    {"vendor": "cisco", "category": "Authentication", "severity": "CRITICAL", "text": "no aaa new-model"},

    # Cisco Remote Access & SSH
    {"vendor": "cisco", "category": "Remote Access", "severity": "CRITICAL", "text": "line vty 0 4\n transport input telnet"},
    {"vendor": "cisco", "category": "Remote Access", "severity": "CRITICAL", "text": "line vty 0 15\n transport input telnet ssh"},
    {"vendor": "cisco", "category": "Remote Access", "severity": "LOW", "text": "line vty 0 15\n transport input ssh"},
    {"vendor": "cisco", "category": "Remote Access", "severity": "LOW", "text": "ip ssh version 2"},
    {"vendor": "cisco", "category": "Remote Access", "severity": "CRITICAL", "text": "ip ssh version 1"},
    {"vendor": "cisco", "category": "Remote Access", "severity": "HIGH", "text": "ip ssh rsa keypair-name SSHKEY"},

    # Cisco Logging & Auditing
    {"vendor": "cisco", "category": "Logging", "severity": "LOW", "text": "logging host 10.10.10.50"},
    {"vendor": "cisco", "category": "Logging", "severity": "HIGH", "text": "no logging host"},
    {"vendor": "cisco", "category": "Logging", "severity": "MEDIUM", "text": "service timestamps log datetime msec show-timezone"},
    {"vendor": "cisco", "category": "Logging", "severity": "HIGH", "text": "no service timestamps"},
    {"vendor": "cisco", "category": "Logging", "severity": "LOW", "text": "logging trap informational"},

    # Cisco SNMP & Management
    {"vendor": "cisco", "category": "SNMP", "severity": "CRITICAL", "text": "snmp-server community public RO"},
    {"vendor": "cisco", "category": "SNMP", "severity": "CRITICAL", "text": "snmp-server community private RW"},
    {"vendor": "cisco", "category": "SNMP", "severity": "LOW", "text": "no snmp-server community public"},
    {"vendor": "cisco", "category": "SNMP", "severity": "LOW", "text": "snmp-server group SECGROUP v3 priv"},
    {"vendor": "cisco", "category": "SNMP", "severity": "LOW", "text": "snmp-server user SECADMIN SECGROUP v3 auth sha MyPass123 priv aes 128 MyEnc123"},

    # Juniper Junos Templates
    {"vendor": "junos", "category": "Authentication", "severity": "CRITICAL", "text": "set system root-authentication plain-text-password"},
    {"vendor": "junos", "category": "Authentication", "severity": "LOW", "text": "set system root-authentication encrypted-password \"$6$abcdef$123456\""},
    {"vendor": "junos", "category": "Remote Access", "severity": "HIGH", "text": "set system services ssh root-login allow"},
    {"vendor": "junos", "category": "Remote Access", "severity": "LOW", "text": "set system services ssh root-login deny"},
    {"vendor": "junos", "category": "Remote Access", "severity": "LOW", "text": "set system services ssh protocol-version v2"},
    {"vendor": "junos", "category": "Logging", "severity": "LOW", "text": "set system syslog host 10.200.1.10 any notice"},
    {"vendor": "junos", "category": "NTP", "severity": "LOW", "text": "set system ntp server 10.200.1.1"},

    # Fortinet FortiOS Templates
    {"vendor": "fortios", "category": "Authentication", "severity": "HIGH", "text": "config system admin\n edit admin\n set password 12345\n end"},
    {"vendor": "fortios", "category": "Authentication", "severity": "LOW", "text": "config system admin\n edit admin\n set password ENC $6$hashstr\n end"},
    {"vendor": "fortios", "category": "Remote Access", "severity": "HIGH", "text": "config system interface\n edit mgmt\n set allowaccess http https ssh ping\n end"},
    {"vendor": "fortios", "category": "Remote Access", "severity": "LOW", "text": "config system interface\n edit mgmt\n set allowaccess https ssh ping\n end"},
    {"vendor": "fortios", "category": "Logging", "severity": "LOW", "text": "config log syslogd setting\n set status enable\n set server 10.50.1.1\n end"},
    {"vendor": "fortios", "category": "Logging", "severity": "HIGH", "text": "config log syslogd setting\n set status disable\n end"},
    {"vendor": "fortios", "category": "Firewall ACL", "severity": "LOW", "text": "config firewall policy\n edit 1\n set action accept\n set logtraffic all\n end"},

    # Novel & Unfamiliar Edge Syntax (For testing AI confidence gate & active learning)
    {"vendor": "cisco", "category": "Encryption", "severity": "MEDIUM", "text": "crypto ikev2 proposal IKEV2-PROP\n encryption aes-gcm-256\n integrity sha384\n group 20"},
    {"vendor": "junos", "category": "Encryption", "severity": "MEDIUM", "text": "set security ike proposal IKE-PROP-01 encryption-algorithm aes-256-gcm"},
    {"vendor": "fortios", "category": "Encryption", "severity": "LOW", "text": "config vpn ipsec phase1-interface\n set suite-b suite-b-gcm-256\n end"}
]

def generate_dataset(num_samples: int = 600, seed: int = 42) -> List[Dict[str, Any]]:
    random.seed(seed)
    dataset = []

    for i in range(num_samples):
        base_template = random.choice(TEMPLATES)
        vendor = base_template["vendor"]
        category = base_template["category"]
        severity = base_template["severity"]
        text = base_template["text"]

        # Mutate line ordering, documentation IP addresses, interface names, or whitespace
        ip_sub = f"10.{random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}"
        mutated_text = text.replace("10.10.10.50", ip_sub).replace("10.200.1.10", ip_sub).replace("10.50.1.1", ip_sub)
        
        # Add slight variations
        if random.random() > 0.7:
            mutated_text += f"\n! Audit timestamp sample-{i}"

        sample = {
            "sample_id": f"SMP-{i+1:04d}",
            "vendor": vendor,
            "snippet": mutated_text,
            "category": category,
            "severity": severity,
            "is_synthetic": True
        }
        dataset.append(sample)

    return dataset

if __name__ == "__main__":
    data = generate_dataset(600)
    print(f"Generated {len(data)} dataset samples.")
