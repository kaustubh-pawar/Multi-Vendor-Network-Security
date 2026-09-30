import time
from typing import Dict, Any

SAMPLE_CISCO_LIVE = """!
version 15.6
hostname Core-RTR-01
!
service password-encryption
enable secret 9 $9$K2h9j0x10L1m2N
!
aaa new-model
aaa authentication login default local
!
ip domain-name enterprise.local
ip ssh version 2
!
username admin secret 8 $8$a1b2c3d4e5f6g7
!
interface GigabitEthernet0/0
 description WAN Uplink
 ip address 198.51.100.1 255.255.255.252
!
logging host 10.10.10.50
service timestamps log datetime msec
!
snmp-server group SECGROUP v3 priv
snmp-server user SECADMIN SECGROUP v3 auth sha AuthPass123 priv aes 128 EncPass123
!
line vty 0 4
 exec-timeout 10 0
 transport input ssh
!
end"""

SAMPLE_JUNOS_LIVE = """## Junos OS 21.4R1
system {
    host-name Edge-FW-Junos;
    root-authentication {
        encrypted-password "$6$securehash$1234567890";
    }
    services {
        ssh {
            protocol-version v2;
            root-login deny;
        }
    }
    syslog {
        host 10.200.1.10 {
            any notice;
        }
    }
    ntp {
        server 10.200.1.1;
    }
}"""

SAMPLE_FORTIOS_LIVE = """# FortiOS v7.2.4
config system global
    set hostname FortiGate-500E
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
end"""

def fetch_ssh_configuration(
    hostname: str,
    ip_address: str,
    port: int,
    vendor: str,
    username: str,
    password: str
) -> str:
    """
    Simulates / Executes authorized SSH device collection using Netmiko/Paramiko.
    """
    time.sleep(1.0) # Simulate SSH connection delay

    v = vendor.lower()
    if v == "junos":
        return SAMPLE_JUNOS_LIVE
    elif v == "fortios":
        return SAMPLE_FORTIOS_LIVE
    else:
        return SAMPLE_CISCO_LIVE
