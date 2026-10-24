import re
from typing import List, Dict, Any, Tuple
from app.schemas.analysis import DetectedSignal, AnalyzeResult

class AnalysisEngine:
    """
    Deterministic Threat Signal Extraction & Hybrid Linguistic Reasoning.
    Explains WHAT was detected, WHY it matters, and WHAT the user can do next.
    Never outputs arbitrary black-box risk numbers without concrete evidence.
    """

    COERCION_PATTERNS = [
        (r"\b(send|give|transfer|pay)\b.*(photo|pic|video|money|\$|₹|rupee|cash).*or\b", "Explicit demand paired with conditional consequence"),
        (r"\b(expose|leak|post|share|upload|ruin)\b.*(photo|pic|video|chat|secret|online)", "Threat of non-consensual disclosure or exposure"),
        (r"\b(or else|you'?ll regret|last chance|pay or|send the)\b", "Ultimatum / coercive pressure"),
    ]

    INTIMIDATION_PATTERNS = [
        (r"\b(i know where you (live|study|work|stay))\b", "Direct claim of tracking physical residence or routine"),
        (r"\b(watch your back|can'?t hide|see what happens|find you)\b", "Implicit physical or psychological intimidation"),
        (r"\b(dare you|destroy your life|humiliate you)\b", "Vindictive intimidation"),
    ]

    PII_PATTERNS = [
        (r"\b(tell me where you (study|work|live)|what is your address|give me your number)\b", "Direct solicitation of sensitive offline location/contact"),
        (r"\b(your college|your school|your hostel|your office|your flat|your parents)\b", "Reference to victim's specific offline institutional anchors"),
    ]

    PERSISTENCE_PATTERNS = [
        (r"\b(why (aren'?t you|not) replying|answer me|reply to me|pick up|ignoring me)\b", "Unsolicited persistence following non-response"),
        (r"\b(hello\?+|hey\?+|don'?t ignore|read my message)\b", "Repetitive nagging pressure"),
    ]

    CONTACT_PATTERNS = [
        (r"\b(hey,? you'?re cute|dm me|be friends|wanna meet|send a smile)\b", "Unsolicited romantic or personal overture"),
    ]

    def analyze_text(self, text: str, source_platform: str = "Instagram") -> AnalyzeResult:
        signals: List[DetectedSignal] = []
        lower = text.lower()

        # 1. Coercion
        for pattern, explanation in self.COERCION_PATTERNS:
            match = re.search(pattern, lower)
            if match:
                signals.append(DetectedSignal(
                    signal_type="Coercion / Extortion",
                    severity="CRITICAL",
                    rationale=explanation,
                    excerpt=match.group(0)
                ))
                break

        # 2. Intimidation
        for pattern, explanation in self.INTIMIDATION_PATTERNS:
            match = re.search(pattern, lower)
            if match:
                signals.append(DetectedSignal(
                    signal_type="Intimidation / Stalking",
                    severity="HIGH",
                    rationale=explanation,
                    excerpt=match.group(0)
                ))
                break

        # 3. PII solicitation or reference
        for pattern, explanation in self.PII_PATTERNS:
            match = re.search(pattern, lower)
            if match:
                signals.append(DetectedSignal(
                    signal_type="Personal Information Solicitation",
                    severity="HIGH",
                    rationale=explanation,
                    excerpt=match.group(0)
                ))
                break

        # 4. Persistence
        for pattern, explanation in self.PERSISTENCE_PATTERNS:
            match = re.search(pattern, lower)
            if match:
                signals.append(DetectedSignal(
                    signal_type="Unwanted Persistence",
                    severity="MODERATE",
                    rationale=explanation,
                    excerpt=match.group(0)
                ))
                break

        # 5. Unwanted contact
        if not signals:
            for pattern, explanation in self.CONTACT_PATTERNS:
                match = re.search(pattern, lower)
                if match:
                    signals.append(DetectedSignal(
                        signal_type="Unwanted Overture",
                        severity="LOW",
                        rationale=explanation,
                        excerpt=match.group(0)
                    ))
                    break

        # Default fallback if no regex hit
        if not signals:
            signals.append(DetectedSignal(
                signal_type="Unverified Interaction",
                severity="LOW",
                rationale="No overt harassment keyword triggers detected in isolated message.",
                excerpt=text[:60]
            ))

        # Determine Stage & Risk Level
        has_coercion = any(s.signal_type.startswith("Coercion") for s in signals)
        has_intimidation = any(s.signal_type.startswith("Intimidation") for s in signals)
        has_pii = any(s.signal_type.startswith("Personal") for s in signals)
        has_persistence = any(s.signal_type.startswith("Unwanted Persistence") for s in signals)

        if has_coercion:
            stage = "COERCION"
            risk_level = "CRITICAL"
            primary_reason = "Potential coercion detected: The message pairs an ultimatum with a threat of exposure."
            why_it_matters = "Demands conditioned on threats to leak private material constitute an acute threat under Indian cyber laws (IT Act Sec 66E/67A & BNS Sec 351). Immediate preservation is vital."
            recommended_actions = [
                "Preserve original evidence immediately (do not alter, edit or delete).",
                "Do not comply with demands or send further material.",
                "Avoid further engagement with the sender.",
                "Review the generated Complaint Pack for official helpline 1930."
            ]
            is_sensitive = True

        elif has_intimidation:
            stage = "INTIMIDATION"
            risk_level = "HIGH"
            primary_reason = "Potential intimidation detected: Sender indicates awareness of your physical location or daily routine."
            why_it_matters = "Bridging digital contact to real-world location elevates safety concern from nuisance to targeted stalking."
            recommended_actions = [
                "Preserve the message and timestamp.",
                "Audit profile privacy settings (remove location tags and institution mentions).",
                "Inform a trusted friend or helpline (181 / 112).",
                "Document any correlated offline sightings."
            ]
            is_sensitive = False

        elif has_pii:
            stage = "PII_REFERENCE"
            risk_level = "HIGH"
            primary_reason = "Inquiry regarding personal offline identifiers (study/work location)."
            why_it_matters = "Harassers frequently probe for institutional or geographical anchors before escalating intimidation."
            recommended_actions = [
                "Do not disclose or confirm college or workplace details.",
                "Restrict public account visibility to private.",
                "Log the account identifier in AEGIS."
            ]
            is_sensitive = False

        elif has_persistence:
            stage = "PERSISTENCE"
            risk_level = "MODERATE"
            primary_reason = "Repeated outreach ignoring lack of response or clear disinterest."
            why_it_matters = "Persistent one-way contact establishes a documented pattern of boundary violations under cyberstalking criteria."
            recommended_actions = [
                "Maintain non-engagement (do not respond to questions).",
                "Keep records of each consecutive unsolicited attempt.",
                "Consider platform mute or report options."
            ]
            is_sensitive = False

        else:
            stage = "UNWANTED_CONTACT"
            risk_level = "LOW"
            primary_reason = "Initial unsolicited contact with low apparent hostility."
            why_it_matters = "While currently low severity, early documentation provides crucial baseline context if the interaction persists."
            recommended_actions = [
                "Keep a timestamped record if contact continues.",
                "Check account privacy to prevent unwanted direct messages."
            ]
            is_sensitive = False

        return AnalyzeResult(
            content_preview=text if len(text) <= 120 else text[:117] + "...",
            risk_level=risk_level,
            current_stage=stage,
            signals=signals,
            primary_reason=primary_reason,
            why_it_matters=why_it_matters,
            recommended_actions=recommended_actions,
            is_sensitive=is_sensitive
        )

analysis_engine = AnalysisEngine()
