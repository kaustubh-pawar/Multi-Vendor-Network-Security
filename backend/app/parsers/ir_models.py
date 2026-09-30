from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class SourceSpan:
    start_line: int
    end_line: int
    raw: str

@dataclass
class IRNode:
    path: str
    key: str
    value: List[str] = field(default_factory=list)
    source: Optional[SourceSpan] = None
    children: List['IRNode'] = field(default_factory=list)

@dataclass
class ConfigurationIR:
    device_ref: str
    vendor: str
    os_family: str
    detection_method: str
    detection_confidence: float
    raw_lines: List[str]
    nodes: List[IRNode]
    parse_warnings: List[str] = field(default_factory=list)
