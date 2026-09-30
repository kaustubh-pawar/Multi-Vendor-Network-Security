from typing import List
from app.parsers.ir_models import ConfigurationIR, IRNode, SourceSpan

def parse_junos_config(config_text: str, device_ref: str = "junos-device") -> ConfigurationIR:
    lines = config_text.splitlines()
    nodes: List[IRNode] = []
    
    # Simple line-oriented parser supporting set-commands and hierarchy blocks
    for idx, raw_line in enumerate(lines, start=1):
        line = raw_line.strip()
        if not line or line.startswith("/*") or line.startswith("#"):
            continue

        if line.startswith("set "):
            tokens = line[4:].strip().rstrip(";").split()
            if tokens:
                key = tokens[0]
                value = tokens[1:]
                node = IRNode(
                    path=f"set.{'.'.join(tokens)}",
                    key=key,
                    value=value,
                    source=SourceSpan(start_line=idx, end_line=idx, raw=raw_line)
                )
                nodes.append(node)
        else:
            # Brace line processing
            clean_line = line.rstrip(";").rstrip("{").strip()
            tokens = clean_line.split()
            if tokens:
                key = tokens[0]
                value = tokens[1:]
                node = IRNode(
                    path=f"hier.{'.'.join(tokens)}",
                    key=key,
                    value=value,
                    source=SourceSpan(start_line=idx, end_line=idx, raw=raw_line)
                )
                nodes.append(node)

    return ConfigurationIR(
        device_ref=device_ref,
        vendor="junos",
        os_family="junos",
        detection_method="syntax_fingerprint",
        detection_confidence=0.98,
        raw_lines=lines,
        nodes=nodes
    )
