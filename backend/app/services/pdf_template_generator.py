import io
import re
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def generate_pdf_config_template(hostname: str = "Cisco-Core-Switch-01", vendor: str = "cisco") -> bytes:
    """
    Generates a professional sample PDF Configuration Template containing
    valid CLI configuration commands for Cisco, Junos, or FortiOS.
    """
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    
    # Header Banner
    c.setFillColorRGB(0.06, 0.07, 0.1) # Obsidian dark background
    c.rect(0, 720, 612, 72, fill=1, stroke=0)
    
    c.setFillColorRGB(0.96, 0.62, 0.04) # Gold text
    c.setFont("Helvetica-Bold", 14)
    c.drawString(36, 755, "OFFICIAL ANCP NETWORK CONFIGURATION TEMPLATE")
    
    c.setFillColorRGB(0.9, 0.9, 0.9)
    c.setFont("Helvetica", 10)
    c.drawString(36, 735, f"Device Hostname: {hostname} | Vendor Ecosystem: {vendor.upper()} | PDF Template v2.0")
    
    c.setStrokeColorRGB(0.96, 0.62, 0.04)
    c.setLineWidth(1.5)
    c.line(36, 715, 576, 715)
    
    # Body Title & Guidance
    c.setFillColorRGB(0.1, 0.1, 0.1)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(36, 690, "START CONFIGURATION AUDIT SCRIPT:")
    
    c.setFont("Helvetica-Oblique", 9)
    c.setFillColorRGB(0.4, 0.4, 0.4)
    c.drawString(36, 678, "Upload this PDF file directly into ANCP Auditor to execute automated compliance rule evaluation.")
    
    # Config Box
    c.setFillColorRGB(0.97, 0.97, 0.98)
    c.setStrokeColorRGB(0.8, 0.8, 0.8)
    c.rect(36, 120, 540, 540, fill=1, stroke=1)
    
    c.setFillColorRGB(0.1, 0.1, 0.1)
    c.setFont("Courier", 9.5)
    y = 645
    
    v = (vendor or "").lower()
    if "junos" in v:
        lines = [
            "## Junos OS Security Audit Template",
            "system {",
            f"    host-name {hostname};",
            "    root-authentication {",
            '        encrypted-password "$6$securehash$1234567890";',
            "    }",
            "    services {",
            "        ssh {",
            "            protocol-version v2;",
            "            root-login deny;",
            "        }",
            "    }",
            "    syslog {",
            "        host 10.100.1.50 {",
            "            any notice;",
            "        }",
            "    }",
            "}",
            "interfaces {",
            "    ge-0/0/0 {",
            "        unit 0 {",
            "            family inet {",
            "                address 10.100.1.1/24;",
            "            }",
            "        }",
            "    }",
            "}"
        ]
    elif "forti" in v:
        lines = [
            "# FortiOS Security Audit Template",
            "config system global",
            f"    set hostname {hostname}",
            "    set admin-sport 8443",
            "    set timezone 04",
            "end",
            "config system admin",
            '    edit "admin"',
            "        set password ENC $6$hash123456",
            "    end",
            "end",
            "config system interface",
            '    edit "port1"',
            "        set allowaccess ping ssh",
            "    end",
            "end",
            "config log syslogd setting",
            "    set status enable",
            "    set server 10.100.1.50",
            "end"
        ]
    else:
        lines = [
            "! Cisco IOS Security Audit Template",
            "version 15.6",
            f"hostname {hostname}",
            "service password-encryption",
            "enable secret 9 $9$K2h9j0x10L1m2N",
            "aaa new-model",
            "aaa authentication login default local group radius",
            "ip domain-name enterprise.local",
            "ip ssh version 2",
            "username admin secret 8 $8$a1b2c3d4e5f6g7",
            "interface GigabitEthernet0/0",
            " description Uplink Core Router",
            " ip address 10.100.1.1 255.255.255.0",
            "logging host 10.100.1.50",
            "service timestamps log datetime msec show-timezone",
            "snmp-server group SECGROUP v3 priv",
            "snmp-server user SECADMIN SECGROUP v3 auth sha AuthPass123 priv aes 128 EncPass123",
            "ntp server 10.100.1.1",
            "line vty 0 4",
            " exec-timeout 10 0",
            " transport input ssh",
            "banner motd # Authorized Access Only #",
            "end"
        ]
    
    for line in lines:
        c.drawString(48, y, line)
        y -= 15
        if y < 135:
            c.showPage()
            c.setFont("Courier", 9.5)
            y = 750
            
    # Footer
    c.setFont("Helvetica", 8)
    c.setFillColorRGB(0.5, 0.5, 0.5)
    c.drawString(36, 40, "ANCP Multi-Vendor Security Auditor • PDF Configuration Template v2.0")
    c.drawRightString(576, 40, "Page 1 of 1")
    
    c.save()
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """
    Extracts CLI configuration text lines from uploaded PDF bytes.
    """
    try:
        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        extracted = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                extracted.append(t)
        if extracted:
            return "\n".join(extracted)
    except Exception:
        pass

    # Pure Python stream extraction fallback
    content = pdf_bytes.decode('latin1', errors='ignore')
    text_blocks = []
    
    # 1. Match strings in (string) Tj or [(string)] TJ operators
    matches = re.findall(r'\((.*?)\)\s*(?:Tj|TJ|\')', content, re.DOTALL)
    if matches:
        for m in matches:
            cleaned = m.replace('\\n', '\n').replace('\\r', '').replace('\\(', '(').replace('\\)', ')')
            if cleaned.strip():
                text_blocks.append(cleaned)
        if text_blocks:
            return "\n".join(text_blocks)
            
    # 2. Match text between BT and ET
    bt_et_blocks = re.findall(r'BT(.*?)ET', content, re.DOTALL)
    for block in bt_et_blocks:
        strings = re.findall(r'\((.*?)\)', block)
        if strings:
            text_blocks.append("\n".join(strings))
            
    if text_blocks:
        return "\n".join(text_blocks)
        
    # 3. Fallback text lines with CLI keywords
    lines = []
    for line in content.splitlines():
        l_str = line.strip()
        if any(k in l_str.lower() for k in ["version", "hostname", "enable", "service", "aaa", "ip ", "interface", "username", "line vty", "snmp-server", "ntp ", "system", "config", "set "]):
            lines.append(l_str)
            
    return "\n".join(lines) if lines else content
