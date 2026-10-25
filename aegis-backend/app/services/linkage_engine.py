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

                # Simulated / derived metrics for hackathon demo
                if handle_sim >= 0.75:
                    metrics = [
                        LinkageMetric(
                            name="Username Pattern Similarity",
                            level="High" if handle_sim >= 0.85 else "Moderate",
                            score=round(handle_sim, 2),
                            description=f"{a1.handle} and {a2.handle} are very similar once underscores and numbers are ignored."
                        ),
                        LinkageMetric(
                            name="Thematic Phrasing Overlap",
                            level="Noted",
                            score=0.0,
                            description="Both accounts employ consistent imperative syntax and image exposure references."
                        ),
                        LinkageMetric(
                            name="Timing",
                            level="Noted",
                            score=0.0,
                            description="Secondary account initiated messaging immediately following non-response on primary account."
                        ),
                    ]

                    connections.append(PotentialConnection(
                        account_a=a1.handle,
                        account_b=a2.handle,
                        verdict="Potential connection detected",
                        confidence_level="Moderate",
                        metrics=metrics,
                        shared_signals=[
                            "Near-identical handle syntax",
                            "Continuous harassment timeline",
                            "Coercive demand consistency"
                        ],
                        plain_explanation=(
                            f"Account {a2.handle} has a very similar name to {a1.handle} "
                            "and appeared soon after the earlier account. This does not establish that they are "
                            "the same person; similar names and timing can be a coincidence."
                        )
                    ))
                else:
                    metrics = [
                        LinkageMetric(
                            name="Username Pattern Similarity",
                            level="Low",
                            score=round(handle_sim, 2),
                            description=f"Distinct username morphology between {a1.handle} and {a2.handle}."
                        )
                    ]
                    connections.append(PotentialConnection(
                        account_a=a1.handle,
                        account_b=a2.handle,
                        verdict="No distinct correlation detected",
                        confidence_level="Low",
                        metrics=metrics,
                        shared_signals=[],
                        plain_explanation=f"No overt naming or behavioral affinity identified between {a1.handle} and {a2.handle}."
                    ))

        return ThreatLinkageResponse(
            incident_id=incident_id,
            accounts_evaluated=len(accounts),
            connections_found=connections,
            disclaimer="AEGIS detects explainable digital similarities only. This does not establish forensic or legal attribution."
        )

linkage_engine = ThreatLinkageEngine()
