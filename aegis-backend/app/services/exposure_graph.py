from typing import List, Dict, Any, Optional
from app.models.identity import IdentityNode, Relationship

class DigitalExposureGraphEngine:
    """
    Digital Exposure Graph Engine.
    Maps how user-provided digital identity signals connect.
    Answers: 'What pieces of my digital identity may be connected?'
    Uses cautious phrasing: 'Potentially exposed information' (never 'Attacker has this').
    """

    def get_default_graph(self, incident_id: str) -> Dict[str, Any]:
        """Returns standard exposure graph for the incident scenario."""
        nodes = [
            {
                "id": "node-root",
                "label": "Identity Root",
                "value": "You (Private)",
                "type": "root",
                "exposure_level": "PROTECTED",
                "description": "Your core persona. Keep primary phone, recovery email, and national ID decoupled."
            },
            {
                "id": "node-insta",
                "label": "Platform",
                "value": "Instagram Account",
                "type": "platform",
                "exposure_level": "MODERATE",
                "description": "Primary channel through which unsolicited messages were received."
            },
            {
                "id": "node-handle",
                "label": "Public Handle",
                "value": "@ananya_s",
                "type": "identifier",
                "exposure_level": "EXPOSED",
                "description": "Public social handle visible to general followers and search engines."
            },
            {
                "id": "node-college",
                "label": "Institution",
                "value": "Engineering College, Pune",
                "type": "institution",
                "exposure_level": "HIGH",
                "description": "Referenced in Day 5 message ('Tell me where you study')."
            },
            {
                "id": "node-location",
                "label": "Geographic Area",
                "value": "Kothrud, Pune",
                "type": "location",
                "exposure_level": "HIGH",
                "description": "Referenced in Day 6 intimidation ('I know where you live')."
            },
            {
                "id": "node-email",
                "label": "Email Address",
                "value": "ananya.s***@gmail.com",
                "type": "contact",
                "exposure_level": "MODERATE",
                "description": "Linked recovery email on shared platform directory."
            },
            {
                "id": "node-phone",
                "label": "Phone Number",
                "value": "+91 98******10",
                "type": "contact",
                "exposure_level": "PROTECTED",
                "description": "Currently unexposed in logged messages."
            }
        ]

        edges = [
            {"source": "node-root", "target": "node-insta", "relation": "maintains_profile"},
            {"source": "node-root", "target": "node-email", "relation": "recovery_contact"},
            {"source": "node-root", "target": "node-phone", "relation": "private_contact"},
            {"source": "node-insta", "target": "node-handle", "relation": "displays_publicly"},
            {"source": "node-handle", "target": "node-college", "relation": "inferred_via_tagged_photo"},
            {"source": "node-college", "target": "node-location", "relation": "local_proximity"},
        ]

        exposure_summary = {
            "total_nodes": len(nodes),
            "exposed_vectors": 3,
            "protected_vectors": 2,
            "overall_exposure_risk": "ELEVATED",
            "key_vulnerability": "College tagging and campus check-ins allow third parties to deduce local residential perimeter.",
            "remediation_steps": [
                "Remove institutional affiliation tags from public bios.",
                "Review and untag tagged photos on public Instagram accounts.",
                "Disable location services on direct camera and social stories.",
                "Ensure recovery phone number is hidden from account search lookups."
            ]
        }

        return {
            "incident_id": incident_id,
            "nodes": nodes,
            "edges": edges,
            "summary": exposure_summary,
            "disclaimer": "This graph illustrates potential identity vectors based strictly on information provided to AEGIS. No external OSINT web scanning was performed."
        }

exposure_engine = DigitalExposureGraphEngine()
