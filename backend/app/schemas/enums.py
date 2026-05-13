from enum import Enum


class OracleModule(str, Enum):
    P2P = "P2P"
    O2C = "O2C"
    R2R = "R2R"
    H2R = "H2R"
    PROJECTS = "PROJECTS"
    SCM = "SCM"
    EPM = "EPM"


class RunStatus(str, Enum):
    DRAFT = "DRAFT"
    PLANNED = "PLANNED"
    RUNNING = "RUNNING"
    PASSED = "PASSED"
    FAILED = "FAILED"
    ABORTED = "ABORTED"


class StepStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    PASSED = "PASSED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"
    RETRYING = "RETRYING"


class EventLevel(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARN = "WARN"
    ERROR = "ERROR"


class EventSource(str, Enum):
    AI = "AI"
    EXEC = "EXEC"
    SYSTEM = "SYSTEM"
    VALIDATOR = "VALIDATOR"
