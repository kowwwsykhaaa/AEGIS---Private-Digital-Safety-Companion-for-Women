import pytest
import datetime
from app.services.analysis_engine import analysis_engine
from app.services.escalation_engine import escalation_engine
from app.services.change_detection import change_engine
from app.services.linkage_engine import linkage_engine
from app.services.evidence_service import evidence_service
from app.models.incident import Incident
from app.models.event import Event
from app.models.account import Account

def test_analysis_engine_coercion():
    result = analysis_engine.analyze_text("Send the photos or I'll expose you.")
    assert result.risk_level == "CRITICAL"
    assert result.current_stage == "COERCION"
    assert result.is_sensitive is True
    assert any("Coercion" in s.signal_type for s in result.signals)

def test_analysis_engine_intimidation():
    result = analysis_engine.analyze_text("I know where you live.")
    assert result.risk_level == "HIGH"
    assert result.current_stage == "INTIMIDATION"
    assert any("Intimidation" in s.signal_type for s in result.signals)

def test_analysis_engine_pii():
    result = analysis_engine.analyze_text("Tell me where you study.")
    assert result.risk_level == "HIGH"
    assert result.current_stage == "PII_REFERENCE"

def test_analysis_engine_persistence():
    result = analysis_engine.analyze_text("Why aren't you replying? Answer me.")
    assert result.risk_level == "MODERATE"
    assert result.current_stage == "PERSISTENCE"

def test_escalation_engine():
    now = datetime.datetime.utcnow()
    incident = Incident(id="test-inc", title="Test", status="active", current_stage="COERCION", risk_level="CRITICAL")
    events = [
        Event(id="e1", incident_id="test-inc", timestamp=now - datetime.timedelta(days=6), stage="UNWANTED_CONTACT", summary="Hey", raw_content="Hey"),
        Event(id="e2", incident_id="test-inc", timestamp=now - datetime.timedelta(days=4), stage="PERSISTENCE", summary="Reply", raw_content="Reply"),
        Event(id="e3", incident_id="test-inc", timestamp=now - datetime.timedelta(days=2), stage="PII_REFERENCE", summary="Where study", raw_content="Study"),
        Event(id="e4", incident_id="test-inc", timestamp=now - datetime.timedelta(days=1), stage="INTIMIDATION", summary="Know address", raw_content="Address"),
        Event(id="e5", incident_id="test-inc", timestamp=now, stage="COERCION", summary="Send photos", raw_content="Photos"),
    ]
    report = escalation_engine.evaluate_trajectory(incident, events)
    assert report.current_stage == "COERCION"
    assert report.risk_level == "CRITICAL"
    assert len(report.trajectory) == 5
    assert all(t.is_reached for t in report.trajectory)
    assert "extortion" in report.why_it_escalated.lower() or "coercive" in report.why_it_escalated.lower()

def test_change_detection_engine():
    incident = Incident(id="test-inc", title="Test", current_stage="COERCION", risk_level="CRITICAL")
    new_event = Event(id="e5", incident_id="test-inc", timestamp=datetime.datetime.utcnow(), stage="COERCION", summary="Photos", raw_content="Send the photos or I'll expose you.")
    
    diff = change_engine.detect_changes(
        incident=incident,
        new_event=new_event,
        previous_stage="INTIMIDATION",
        previous_risk="HIGH",
        newly_detected_signals=["Coercive Demand (Image distribution threat)"],
        new_accounts=["@unknown_user_01"]
    )
    assert diff.before_risk == "HIGH"
    assert diff.after_risk == "CRITICAL"
    assert diff.is_escalated is True
    assert "@unknown_user_01" in diff.new_accounts_detected
    assert "coercive demand" in diff.why_it_changed.lower()

def test_threat_linkage_engine():
    a1 = Account(id="a1", incident_id="inc", handle="@unknown_user01", platform="Instagram")
    a2 = Account(id="a2", incident_id="inc", handle="@unknown_user_01", platform="Instagram")
    
    linkage = linkage_engine.evaluate_accounts("inc", [a1, a2])
    assert len(linkage.connections_found) == 1
    conn = linkage.connections_found[0]
    assert conn.verdict == "Potential connection detected"
    assert conn.confidence_level == "High"
    assert any("Username Pattern Similarity" in m.name for m in conn.metrics)

def test_evidence_service_sha256():
    sample_text = "Important evidence content"
    ev = evidence_service.store_text_evidence(
        incident_id="inc-test",
        text_content=sample_text,
        source_platform="Instagram",
        is_sensitive=True
    )
    assert len(ev.file_hash_sha256) == 64  # Valid SHA-256 hex string length
    record = evidence_service.format_integrity_record(ev)
    assert record["record_type"] == "Evidence Integrity Record"
    assert record["sha256_hash"] == ev.file_hash_sha256
    assert record["tamper_status"] == "VERIFIED_MATCH"
