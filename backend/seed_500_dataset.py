import sys
import random
import uuid
import hashlib
from datetime import datetime, timedelta
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.database import engine, SessionLocal, Base
from app.models.models import AuditJob, Finding
from app.parsers.detector import detect_vendor
from app.parsers.cisco_parser import parse_cisco_config
from app.parsers.junos_parser import parse_junos_config
from app.parsers.fortios_parser import parse_fortios_config
from app.engine.rule_engine import evaluate_compliance
from app.ml.train_model import train_and_save_models

CISCO_TEMPLATES = [
    # Hardened Cisco Template
    """version 15.6
hostname {hostname}
service password-encryption
enable secret 9 $9$K2h9j0x10L1m2N
aaa new-model
aaa authentication login default local group radius
ip domain-name enterprise.local
ip ssh version 2
username admin secret 8 $8$a1b2c3d4e5f6g7
interface GigabitEthernet0/0
 description Uplink {hostname}
 ip address 10.{subnet}.1.1 255.255.255.0
logging host 10.100.1.50
service timestamps log datetime msec show-timezone
snmp-server group SECGROUP v3 priv
snmp-server user SECADMIN SECGROUP v3 auth sha AuthPass123 priv aes 128 EncPass123
ntp server 10.100.1.1
line vty 0 4
 exec-timeout 10 0
 transport input ssh
banner motd # Authorized Access Only #
ip access-list extended FW_IN
 deny ip any any log
end""",

    # Insecure Cisco Template
    """version 15.2
hostname {hostname}
no service password-encryption
enable password cisco123
no aaa new-model
ip domain-name company.com
ip ssh version 1
username admin password 0 unhashedpass
interface GigabitEthernet0/1
 ip address 172.16.{subnet}.1 255.255.255.0
no logging host
no service timestamps
snmp-server community public RO
snmp-server community private RW
no ntp server
line vty 0 15
 exec-timeout 0 0
 transport input telnet ssh
no banner motd
end""",

    # Moderate Cisco Template
    """version 15.4
hostname {hostname}
service password-encryption
enable secret 5 $1$mERr$hx5rVt7rPNoS4wWKn8rW0.
aaa new-model
ip ssh version 2
username admin secret 5 $1$mERr$hx5rVt7rPNoS4wWKn8rW0.
interface TenGigabitEthernet1/0/1
 ip address 192.168.{subnet}.254 255.255.255.0
logging host 10.100.1.50
snmp-server community customstr RO
ntp server 10.100.1.1
line vty 0 4
 exec-timeout 15 0
 transport input ssh
end"""
]

JUNOS_TEMPLATES = [
    # Hardened Junos Template
    """## Junos OS 21.4R1
system {{
    host-name {hostname};
    root-authentication {{
        encrypted-password "$6$securehash$1234567890";
    }}
    services {{
        ssh {{
            protocol-version v2;
            root-login deny;
        }}
    }}
    syslog {{
        host 10.200.1.10 {{
            any notice;
        }}
    }}
    ntp {{
        server 10.200.1.1;
    }}
}}""",

    # Insecure Junos Template
    """## Junos OS 19.2R1
system {{
    host-name {hostname};
    root-authentication {{
        plain-text-password;
    }}
    services {{
        ssh {{
            root-login allow;
        }}
    }}
    syslog {{
        file messages {{
            any info;
        }}
    }}
}}"""
]

FORTIOS_TEMPLATES = [
    # Hardened FortiOS Template
    """# FortiOS v7.2.4
config system global
    set hostname {hostname}
end
config system admin
    edit "admin"
        set password ENC $6$secureadminhash
    end
end
config system interface
    edit "mgmt"
        set allowaccess https ssh ping
    end
end
config log syslogd setting
    set status enable
    set server "10.50.1.1"
end
config firewall policy
    edit 1
        set logtraffic all
    end
end""",

    # Insecure FortiOS Template
    """# FortiOS v6.4.2
config system global
    set hostname {hostname}
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
config log syslogd setting
    set status disable
end"""
]

def generate_500_dataset():
    print("[+] Re-creating database schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    print("[+] Training AI/ML classifier model...")
    train_and_save_models()

    db = SessionLocal()
    try:
        print("[+] Ingesting real dataset files from /Users/kaustubhmanoharpawar/Desktop/dataset & 500 multi-vendor configurations...")
        random.seed(42)

        dataset_dir = Path("/Users/kaustubhmanoharpawar/Desktop/dataset")
        ds_files = [
            ("cisco_ios_HARDENED.cfg", "cisco", "EDGE-RTR-01", "Edge Router", "ISR 4451"),
            ("cisco_ios_INSECURE.cfg", "cisco", "EDGE-RTR-01-INSECURE", "Edge Router", "ISR 4451"),
            ("fortinet_fortios_HARDENED.conf", "fortios", "FortiGate-HARDENED-01", "Next-Gen Firewall", "FortiGate 200E"),
            ("fortinet_fortios_INSECURE.conf", "fortios", "FortiGate-INSECURE-01", "Next-Gen Firewall", "FortiGate 200E"),
            ("fortios_hardened_sample-2.conf.txt", "fortios", "FortiGate-HARDENED-02", "Next-Gen Firewall", "FortiGate 600E"),
            ("juniper_junos_HARDENED.conf", "junos", "EDGE-JNPR-01", "Core Router", "MX240"),
            ("juniper_junos_INSECURE.conf", "junos", "EDGE-JNPR-01-INSECURE", "Core Router", "MX240"),
            ("sample-cisco-ios-config.txt", "cisco", "EdgeRouter-01-BASELINE", "Edge Router", "C2900"),
        ]

        vendors = ["cisco"] * 216 + ["junos"] * 138 + ["fortios"] * 138
        random.shuffle(vendors)

        now = datetime.utcnow()

        for idx in range(1, 501):
            subnet = (idx % 250) + 1
            if idx <= len(ds_files):
                fname, vendor, hostname, dtype, dmodel = ds_files[idx - 1]
                fpath = dataset_dir / fname
                if fpath.exists():
                    config_text = fpath.read_text(encoding="utf-8", errors="ignore")
                else:
                    config_text = f"! Fallback config for {hostname}\nhostname {hostname}\n"
                
                if vendor == "cisco":
                    ir = parse_cisco_config(config_text, device_ref=hostname)
                elif vendor == "junos":
                    ir = parse_junos_config(config_text, device_ref=hostname)
                else:
                    ir = parse_fortios_config(config_text, device_ref=hostname)
            else:
                vendor = vendors[idx - len(ds_files) - 1]
                if vendor == "cisco":
                    hostname = f"Cisco-Device-{idx:03d}"
                    tmpl = random.choice(CISCO_TEMPLATES)
                    config_text = tmpl.format(hostname=hostname, subnet=subnet)
                    ir = parse_cisco_config(config_text, device_ref=hostname)
                    dtype = random.choice(["Core Switch", "Distribution Switch", "Edge Router", "Access Switch"])
                    dmodel = random.choice(["Catalyst 9300", "Catalyst 9500", "ISR 4451", "Nexus 9300", "ASR 1001-X"])
                elif vendor == "junos":
                    hostname = f"Junos-Router-{idx:03d}"
                    tmpl = random.choice(JUNOS_TEMPLATES)
                    config_text = tmpl.format(hostname=hostname)
                    ir = parse_junos_config(config_text, device_ref=hostname)
                    dtype = random.choice(["Core Router", "Next-Gen Firewall", "DC Leaf Switch"])
                    dmodel = random.choice(["MX240", "MX480", "SRX300", "SRX1500", "QFX5120"])
                else:
                    hostname = f"FortiGate-FW-{idx:03d}"
                    tmpl = random.choice(FORTIOS_TEMPLATES)
                    config_text = tmpl.format(hostname=hostname)
                    ir = parse_fortios_config(config_text, device_ref=hostname)
                    dtype = "Next-Gen Firewall"
                    dmodel = random.choice(["FortiGate 60F", "FortiGate 100F", "FortiGate 200E", "FortiGate 600E"])

            raw_findings = evaluate_compliance(ir)

            total_rules = len(raw_findings)
            passed_count = sum(1 for f in raw_findings if f["status"] == "PASS")
            failed_count = sum(1 for f in raw_findings if f["status"] == "FAIL")
            na_count = sum(1 for f in raw_findings if f["status"] == "N_A")
            score = round((passed_count / total_rules * 100.0), 1) if total_rules > 0 else 100.0

            created_time = now - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))

            job = AuditJob(
                job_number=f"JOB-{idx:04d}-{uuid.uuid4().hex[:4].upper()}",
                status="COMPLETED",
                vendor=vendor,
                hostname=hostname,
                device_type=dtype,
                device_model=dmodel,
                total_rules=total_rules,
                passed_rules=passed_count,
                failed_rules=failed_count,
                na_rules=na_count,
                compliance_score=score,
                created_at=created_time,
                file_hash=hashlib.sha256(config_text.encode()).hexdigest(),
                raw_config=config_text
            )
            db.add(job)
            db.commit()
            db.refresh(job)

            for rf in raw_findings:
                finding = Finding(
                    job_id=job.id,
                    rule_code=rf["rule_code"],
                    title=rf["title"],
                    category=rf["category"],
                    severity=rf["severity"],
                    status=rf["status"],
                    evidence_start_line=rf["evidence_start_line"],
                    evidence_end_line=rf["evidence_end_line"],
                    evidence_raw=rf["evidence_raw"],
                    remediation=rf["remediation"],
                    cis_mapping=rf.get("cis_mapping"),
                    nist_mapping=rf.get("nist_mapping"),
                    stig_mapping=rf.get("stig_mapping"),
                    iso_mapping=rf.get("iso_mapping"),
                    ai_confidence=rf["ai_confidence"],
                    is_ai_assisted=rf["is_ai_assisted"],
                    requires_review=rf["requires_review"]
                )
                db.add(finding)

            if idx % 100 == 0 or idx == 500:
                db.commit()
                print(f"    -> Audited and stored {idx}/500 device configurations...")

        print("[SUCCESS] 500 Real Device Audits Seeding Complete!")
    finally:
        db.close()

if __name__ == "__main__":
    generate_500_dataset()
