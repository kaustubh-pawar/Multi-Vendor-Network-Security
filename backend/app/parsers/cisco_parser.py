from typing import List
from app.parsers.ir_models import ConfigurationIR, IRNode, SourceSpan

def parse_cisco_config(config_text: str, device_ref: str = "cisco-device") -> ConfigurationIR:
    lines = config_text.splitlines()
    nodes: List[IRNode] = []
    
    current_parent: List[IRNode] = []
    
    for idx, raw_line in enumerate(lines, start=1):
        line = raw_line.rstrip()
        if not line or line.strip().startswith("!") or line.strip().startswith("#"):
            continue

        indent = len(line) - len(line.lstrip())
        parts = line.strip().split()
        if not parts:
            continue

        key = parts[0]
        value = parts[1:]
        
        span = SourceSpan(start_line=idx, end_line=idx, raw=raw_line)
        node = IRNode(
            path=f"{key}.{'.'.join(value)}" if value else key,
            key=key,
            value=value,
            source=span
        )

        if indent == 0:
            nodes.append(node)
            current_parent = [node]
        else:
            if current_parent:
                current_parent[-1].children.append(node)
                current_parent[-1].source.end_line = idx

    return ConfigurationIR(
        device_ref=device_ref,
        vendor="cisco",
        os_family="ios",
        detection_method="syntax_fingerprint",
        detection_confidence=0.98,
        raw_lines=lines,
        nodes=nodes
    )
