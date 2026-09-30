from typing import List
from app.parsers.ir_models import ConfigurationIR, IRNode, SourceSpan

def parse_fortios_config(config_text: str, device_ref: str = "fortios-device") -> ConfigurationIR:
    lines = config_text.splitlines()
    nodes: List[IRNode] = []
    
    current_config_block = ""
    current_edit_block = ""

    for idx, raw_line in enumerate(lines, start=1):
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue

        tokens = line.split()
        if not tokens:
            continue

        if tokens[0] == "config":
            current_config_block = ".".join(tokens[1:])
        elif tokens[0] == "edit":
            current_edit_block = ".".join(tokens[1:])
        elif tokens[0] == "set":
            key = tokens[1] if len(tokens) > 1 else "unknown"
            value = tokens[2:] if len(tokens) > 2 else []
            path = f"config.{current_config_block}.edit.{current_edit_block}.set.{key}" if current_edit_block else f"config.{current_config_block}.set.{key}"
            node = IRNode(
                path=path,
                key=key,
                value=value,
                source=SourceSpan(start_line=idx, end_line=idx, raw=raw_line)
            )
            nodes.append(node)
        elif tokens[0] in ["end", "next"]:
            if tokens[0] == "end":
                current_config_block = ""
                current_edit_block = ""
            elif tokens[0] == "next":
                current_edit_block = ""

    return ConfigurationIR(
        device_ref=device_ref,
        vendor="fortios",
        os_family="fortios",
        detection_method="syntax_fingerprint",
        detection_confidence=0.98,
        raw_lines=lines,
        nodes=nodes
    )
