import re
from typing import List, Dict, Any, Optional, Set
from app.models.incident import Incident
from app.models.event import Event
from app.models.account import Account
from app.models.evidence import Evidence

class DigitalExposureGraphEngine:
    """
    Digital Exposure Graph Engine.
    Dynamically analyzes user-provided digital identity signals, messages, and evidence.
    Answers: 'What pieces of my digital identity or personal info may be connected or exposed?'
    Uses cautious phrasing: 'Potentially exposed information' (never 'Attacker has this').
    """

    def generate_graph(
        self,
        incident: Incident,
        events: List[Event],
        accounts: List[Account],
        evidence_items: List[Evidence]
    ) -> Dict[str, Any]:
        nodes: List[Dict[str, Any]] = [
            {
                "id": "node-root",
                "label": "Identity Root",
                "value": "You (Private)",
                "type": "root",
                "exposure_level": "PROTECTED",
                "description": "Your core personal identity. Keep primary phone, recovery email, and authentication decoupled."
            }
        ]
        edges: List[Dict[str, str]] = []

        seen_platforms: Set[str] = set()
        seen_handles: Set[str] = set()
        exposed_count = 0
        protected_count = 1  # Root is protected

        # 1. Discover platforms from events and accounts
        for ev in events:
            if ev.source_platform and ev.source_platform not in seen_platforms:
                seen_platforms.add(ev.source_platform)
        for acc in accounts:
            if acc.platform and acc.platform not in seen_platforms:
                seen_platforms.add(acc.platform)

        # If no platforms detected, add generic communication channel
        if not seen_platforms and events:
            seen_platforms.add("Digital Messaging Channel")

        for idx, plat in enumerate(sorted(seen_platforms), start=1):
            plat_id = f"node-plat-{idx}"
            nodes.append({
                "id": plat_id,
                "label": "Platform",
                "value": plat,
                "type": "platform",
                "exposure_level": "MODERATE",
                "description": f"Communication channel on which contact or proof was received."
            })
            edges.append({
                "source": "node-root",
                "target": plat_id,
                "relation": "communicated_via"
            })
            exposed_count += 1

        # 2. Discover accounts / handles
        for acc in accounts:
            if acc.handle and acc.handle not in seen_handles:
                seen_handles.add(acc.handle)
        for ev in events:
            if ev.account_handle and ev.account_handle not in seen_handles:
                seen_handles.add(ev.account_handle)

        for idx, h in enumerate(sorted(seen_handles), start=1):
            h_id = f"node-handle-{idx}"
            nodes.append({
                "id": h_id,
                "label": "Observed Handle / Account",
                "value": h,
                "type": "identifier",
                "exposure_level": "HIGH",
                "description": f"Account or handle actively logging messages in this case."
            })
            parent_id = f"node-plat-1" if seen_platforms else "node-root"
            edges.append({
                "source": parent_id,
                "target": h_id,
                "relation": "associated_handle"
            })
            exposed_count += 1

        # 3. Dynamic Text Extraction across all events
        all_text = " ".join([ev.raw_content for ev in events if ev.raw_content])

        # A. Phone number detection
        phone_matches = re.findall(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', all_text)
        for p_idx, phone in enumerate(set(phone_matches), start=1):
            p_id = f"node-phone-{p_idx}"
            masked = phone[:4] + "****" + phone[-2:] if len(phone) >= 8 else phone
            nodes.append({
                "id": p_id,
                "label": "Phone Number",
                "value": masked,
                "type": "contact",
                "exposure_level": "HIGH",
                "description": "Phone number referenced in logged messages or sender profile."
            })
            edges.append({
                "source": "node-root",
                "target": p_id,
                "relation": "referenced_contact"
            })
            exposed_count += 1

        # B. Email detection
        email_matches = re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', all_text)
        for e_idx, em in enumerate(set(email_matches), start=1):
            e_id = f"node-email-{e_idx}"
            parts = em.split('@')
            masked_em = parts[0][:2] + "***@" + parts[1] if len(parts) == 2 else em
            nodes.append({
                "id": e_id,
                "label": "Email Address",
                "value": masked_em,
                "type": "contact",
                "exposure_level": "MODERATE",
                "description": "Email address cited in message exchanges."
            })
            edges.append({
                "source": "node-root",
                "target": e_id,
                "relation": "referenced_contact"
            })
            exposed_count += 1

        # C. Location / Physical perimeter clues
        location_keywords = ["live", "stay", "near", "house", "apartment", "hostel", "campus", "college", "office", "workplace", "address", "residence"]
        loc_found = any(k in all_text.lower() for k in location_keywords)
        if loc_found:
            nodes.append({
                "id": "node-loc",
                "label": "Geographic / Location Proximity",
                "value": "Physical Vicinity Referenced",
                "type": "location",
                "exposure_level": "HIGH",
                "description": "Messages contain references claiming knowledge of residential, study, or work vicinity."
            })
            parent = f"node-handle-1" if seen_handles else "node-root"
            edges.append({
                "source": parent,
                "target": "node-loc",
                "relation": "claimed_observation"
            })
            exposed_count += 1

        # D. Sensitive Media / Extortion threats
        media_keywords = ["photo", "photos", "picture", "pictures", "video", "videos", "pics", "leak", "share", "expose", "upload", "recording"]
        media_found = any(k in all_text.lower() for k in media_keywords)
        if media_found:
            nodes.append({
                "id": "node-media",
                "label": "Intimate & Media Privacy",
                "value": "Media Exposure Threat",
                "type": "sensitive_data",
                "exposure_level": "CRITICAL" if incident.risk_level == "CRITICAL" else "HIGH",
                "description": "Sender threatened distribution or unauthorized sharing of private media."
            })
            parent = f"node-handle-1" if seen_handles else "node-root"
            edges.append({
                "source": parent,
                "target": "node-media",
                "relation": "extortion_target"
            })
            exposed_count += 1

        # Dynamic Remediation Steps
        remediation_steps = []
        if loc_found:
            remediation_steps.append("Remove location tags, college/workplace names, and check-in history from public bios and stories.")
        if media_found:
            remediation_steps.append("If private photographs or intimate media are threatened, visit StopNCII.org to generate on-device safety hashes that prevent re-uploading without sharing files.")
        if seen_platforms:
            remediation_steps.append(f"Switch privacy settings on {', '.join(seen_platforms)} to Private; restrict direct messages from unknown accounts.")
        remediation_steps.append("Save any follow-up messages here with safety stamps before blocking or unfollowing.")
        remediation_steps.append("Ensure two-factor authentication (2FA) is enabled on all primary personal email and recovery accounts.")

        overall_risk = "CRITICAL" if media_found or incident.risk_level == "CRITICAL" else "HIGH" if loc_found else "MODERATE" if seen_handles else "LOW"
        vulnerability_note = (
            "Cross-referencing multiple messages reveals potential links between online profiles and personal life."
            if (loc_found or media_found)
            else "Initial digital contact recorded. Keep personal identifiers and recovery details decoupled."
        )

        return {
            "incident_id": incident.id,
            "nodes": nodes,
            "edges": edges,
            "summary": {
                "total_nodes": len(nodes),
                "exposed_vectors": exposed_count,
                "protected_vectors": protected_count,
                "overall_exposure_risk": overall_risk,
                "key_vulnerability": vulnerability_note,
                "remediation_steps": remediation_steps
            },
            "disclaimer": "This graph illustrates potential identity vectors based strictly on information provided to AEGIS. No external web scraping is performed."
        }

    def get_default_graph(self, incident_id: str) -> Dict[str, Any]:
        """Fallback empty graph structure for an unseeded case."""
        return {
            "incident_id": incident_id,
            "nodes": [
                {
                    "id": "node-root",
                    "label": "Identity Root",
                    "value": "You (Private)",
                    "type": "root",
                    "exposure_level": "PROTECTED",
                    "description": "Your core identity. Keep recovery contacts and multi-factor authentication independent."
                }
            ],
            "edges": [],
            "summary": {
                "total_nodes": 1,
                "exposed_vectors": 0,
                "protected_vectors": 1,
                "overall_exposure_risk": "LOW",
                "key_vulnerability": "No exposed vectors detected yet.",
                "remediation_steps": [
                    "Keep your social accounts private while monitoring messages.",
                    "Save any incoming messages directly into this case."
                ]
            },
            "disclaimer": "This graph illustrates potential identity vectors based strictly on information provided to AEGIS."
        }

exposure_engine = DigitalExposureGraphEngine()
