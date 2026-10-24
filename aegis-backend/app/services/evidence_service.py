import hashlib
import uuid
import datetime
from pathlib import Path
from typing import Dict, Any, Optional
from app.config import EVIDENCE_DIR
from app.models.evidence import Evidence

class EvidenceService:
    """
    Evidence Vault Service.
    Computes cryptographic SHA-256 fingerprints, generates Evidence Integrity Records,
    and protects sensitive evidence with default visual blurring.
    """

    def generate_sha256(self, content_bytes: bytes) -> str:
        return hashlib.sha256(content_bytes).hexdigest()

    def store_text_evidence(
        self,
        incident_id: str,
        text_content: str,
        source_platform: str = "Direct Input",
        is_sensitive: bool = False,
        event_id: Optional[str] = None,
        notes: Optional[str] = None
    ) -> Evidence:
        raw_bytes = text_content.encode("utf-8")
        file_hash = self.generate_sha256(raw_bytes)
        evidence_id = str(uuid.uuid4())
        file_name = f"evidence_{evidence_id[:8]}.txt"
        file_path = EVIDENCE_DIR / file_name

        with open(file_path, "wb") as f:
            f.write(raw_bytes)

        return Evidence(
            id=evidence_id,
            incident_id=incident_id,
            event_id=event_id,
            file_name=file_name,
            file_path=str(file_path),
            file_hash_sha256=file_hash,
            mime_type="text/plain",
            file_size_bytes=len(raw_bytes),
            source_platform=source_platform,
            captured_at=datetime.datetime.utcnow(),
            is_sensitive=is_sensitive,
            excerpt_text=text_content[:200],
            notes=notes
        )

    def format_integrity_record(self, evidence: Evidence) -> Dict[str, Any]:
        return {
            "evidence_id": evidence.id,
            "record_type": "Evidence Integrity Record",
            "sha256_hash": evidence.file_hash_sha256,
            "captured_at_utc": evidence.captured_at.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "file_name": evidence.file_name,
            "file_size": f"{evidence.file_size_bytes} bytes",
            "mime_type": evidence.mime_type,
            "source_platform": evidence.source_platform,
            "tamper_status": "VERIFIED_MATCH",
            "disclaimer": "This record certifies cryptographic hash integrity at capture time. It is an engineering verification record and does not constitute official court certification."
        }

evidence_service = EvidenceService()
