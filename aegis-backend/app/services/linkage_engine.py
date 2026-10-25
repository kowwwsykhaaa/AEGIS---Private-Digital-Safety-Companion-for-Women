import difflib
from typing import List, Dict, Any, Optional
from app.models.account import Account
from app.schemas.linkage import ThreatLinkageResponse, PotentialConnection, LinkageMetric

class ThreatLinkageEngine:
    """
    Threat Linkage Engine: Detects explainable correlations between accounts/events.
    Crucial boundary: Never asserts definitive legal attribution. Always labels as 'Potential connection detected'.
    """

    def calculate_handle_similarity(self, h1: str, h2: str) -> float:
        clean1 = h1.lower().lstrip("@").strip()
        clean2 = h2.lower().lstrip("@").strip()
        return difflib.SequenceMatcher(None, clean1, clean2).ratio()

    def evaluate_accounts(self, incident_id: str, accounts: List[Account]) -> ThreatLinkageResponse:
        if len(accounts) < 2:
            return ThreatLinkageResponse(
                incident_id=incident_id,
                accounts_evaluated=len(accounts),
                connections_found=[],
                disclaimer="At least two accounts are required to evaluate potential cross-account correlation."
            )

        connections: List[PotentialConnection] = []

        # Compare pairs
        for i in range(len(accounts)):
            for j in range(i + 1, len(accounts)):
                a1 = accounts[i]
                a2 = accounts[j]

                handle_sim = self.calculate_handle_similarity(a1.handle, a2.handle)

                # Check platform correlation
                same_platform = (a1.platform and a2.platform and a1.platform.lower() == a2.platform.lower())
                
                # Check timing correlation
                timing_gap_hours = None
                if a1.last_seen and a2.first_seen:
                    diff_seconds = abs((a2.first_seen - a1.last_seen).total_seconds())
                    timing_gap_hours = round(diff_seconds / 3600.0, 1)

                metrics = [
                    LinkageMetric(
                        name="Username Pattern Similarity",
                        level="High" if handle_sim >= 0.8 else "Moderate" if handle_sim >= 0.6 else "Low",
                        score=round(handle_sim, 2),
                        description=f"Observable character overlap between {a1.handle} and {a2.handle}."
                    )
                ]

                shared_signals = []
                if handle_sim >= 0.7:
                    shared_signals.append("High handle syntax similarity")
                if same_platform:
                    metrics.append(LinkageMetric(
                        name="Platform Consistency",
                        level="High",
                        score=1.0,
                        description=f"Both accounts active on {a1.platform}."
                    ))
                    shared_signals.append(f"Shared platform ({a1.platform})")
                if timing_gap_hours is not None and timing_gap_hours <= 48:
                    metrics.append(LinkageMetric(
                        name="Sequential Timing",
                        level="High" if timing_gap_hours <= 12 else "Moderate",
                        score=float(timing_gap_hours),
                        description=f"Account {a2.handle} was active within {timing_gap_hours}h of {a1.handle}."
                    ))
                    shared_signals.append(f"Close timing interval ({timing_gap_hours}h)")

                if handle_sim >= 0.7 or (same_platform and timing_gap_hours is not None and timing_gap_hours <= 24):
                    verdict = "Potential connection detected"
                    conf = "Moderate" if handle_sim >= 0.8 else "Low-Moderate"
                    plain_expl = (
                        f"Account {a2.handle} shares notable naming or timing patterns with {a1.handle}. "
                        "This indicates a potential connection and does not establish attribution. The correlation warrants preserving messages from both handles."
                    )
                else:
                    verdict = "No distinct correlation detected"
                    conf = "Low"
                    plain_expl = f"Handles {a1.handle} and {a2.handle} do not exhibit immediate structural naming patterns."

                connections.append(PotentialConnection(
                    account_a=a1.handle,
                    account_b=a2.handle,
                    verdict=verdict,
                    confidence_level=conf,
                    metrics=metrics,
                    shared_signals=shared_signals,
                    plain_explanation=plain_expl
                ))

        return ThreatLinkageResponse(
            incident_id=incident_id,
            accounts_evaluated=len(accounts),
            connections_found=connections,
            disclaimer="AEGIS detects explainable patterns between accounts. This indicates a potential connection and does not establish attribution."
        )

linkage_engine = ThreatLinkageEngine()
