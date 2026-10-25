import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db

@pytest.fixture(autouse=True)
def setup_database():
    init_db()

def test_health_check():
    with TestClient(app) as client:
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


def test_create_and_fetch_incident():
    with TestClient(app) as client:
        # Create incident
        payload = {"title": "Threatening messages from unknown user", "description": "Persistent unwanted contact"}
        create_res = client.post("/api/incidents", json=payload)
        assert create_res.status_code == 200
        inc = create_res.json()
        inc_id = inc["id"]
        assert inc["title"] == "Threatening messages from unknown user"

        # Fetch active incident
        active_res = client.get("/api/incidents/active")
        assert active_res.status_code == 200
        active_data = active_res.json()
        assert active_data["id"] == inc_id

def test_analyze_endpoint():
    with TestClient(app) as client:
        payload = {
            "content": "I know where you live.",
            "content_type": "text",
            "source_platform": "Instagram Direct",
            "auto_add_to_case": False
        }
        response = client.post("/api/analyze", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["risk_level"] == "HIGH"
        assert data["current_stage"] == "INTIMIDATION"

def test_dynamic_exposure_and_reconstruction():
    with TestClient(app) as client:
        # Create incident
        inc_res = client.post("/api/incidents", json={"title": "Instagram Stalking", "description": "Harassment sequence"})
        inc_id = inc_res.json()["id"]

        # Add Event 1: Unwanted contact
        client.post("/api/analyze", json={
            "content": "Hey, saw you at the fest. You looked great.",
            "content_type": "message",
            "source_platform": "Instagram Direct",
            "account_handle": "@user_stalker",
            "incident_id": inc_id,
            "auto_add_to_case": True
        })

        # Add Event 2: Intimidation & Location
        client.post("/api/analyze", json={
            "content": "I know where you live near Central Road.",
            "content_type": "message",
            "source_platform": "Instagram Direct",
            "account_handle": "@user_stalker_2",
            "incident_id": inc_id,
            "auto_add_to_case": True
        })

        # Test Exposure Graph
        exp_res = client.get(f"/api/exposure/{inc_id}")
        assert exp_res.status_code == 200
        exp_data = exp_res.json()
        assert exp_data["incident_id"] == inc_id
        node_values = [n["value"] for n in exp_data["nodes"]]
        assert "Instagram Direct" in node_values
        assert "@user_stalker" in node_values
        assert "Physical Vicinity Referenced" in node_values

        # Test Reconstruction
        rec_res = client.get(f"/api/reconstruction/{inc_id}")
        assert rec_res.status_code == 200
        rec_data = rec_res.json()
        assert rec_data["total_events"] == 2
        assert "Instagram Direct" in rec_data["formal_narrative"]
        assert len(rec_data["chronological_milestones"]) == 2

        # Test Linkage between @user_stalker and @user_stalker_2
        link_res = client.get(f"/api/linkage/{inc_id}")
        assert link_res.status_code == 200
        link_data = link_res.json()
        assert len(link_data["connections_found"]) > 0

        # Test Complaint Pack
        comp_res = client.get(f"/api/complaint/{inc_id}")
        assert comp_res.status_code == 200
        comp_data = comp_res.json()
        assert "Bharatiya Nyaya Sanhita" in comp_data["formatted_dossier_text"]
        assert "@user_stalker" in comp_data["formatted_dossier_text"]

def test_helplines_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/help/helplines")
        assert response.status_code == 200
        data = response.json()
        numbers = [h["number"] for h in data["helplines"]]
        assert "112" in numbers
        assert "181" in numbers
        assert "1930" in numbers

def test_full_lifecycle_from_empty_database():
    with TestClient(app) as client:
        # 1. Start from an empty database
        res_list = client.get("/api/incidents")
        assert res_list.status_code == 200

        # 2. Create a new incident through normal API
        inc_payload = {
            "title": "Online harassment and coercion",
            "description": "Suspicious anonymous messages demanding photos"
        }
        res_create = client.post("/api/incidents", json=inc_payload)
        assert res_create.status_code == 200
        incident_id = res_create.json()["id"]

        # 3. Verify all endpoints handle 0-evidence case gracefully
        exp_empty = client.get(f"/api/exposure/{incident_id}")
        assert exp_empty.status_code == 200

        rec_empty = client.get(f"/api/reconstruction/{incident_id}")
        assert rec_empty.status_code == 200
        assert rec_empty.json()["total_events"] == 0

        link_empty = client.get(f"/api/linkage/{incident_id}")
        assert link_empty.status_code == 200
        assert link_empty.json()["accounts_evaluated"] == 0
        assert link_empty.json()["connections_found"] == []

        comp_empty = client.get(f"/api/complaint/{incident_id}")
        assert comp_empty.status_code == 200

        chg_empty = client.get(f"/api/changes/{incident_id}")
        assert chg_empty.status_code == 200

        # 4. Add Day 1 evidence
        p1 = {
            "content": "Hey cute girl, why aren't you replying to my DMs?",
            "content_type": "message",
            "source_platform": "Instagram Direct",
            "account_handle": "@stalker_alpha",
            "incident_id": incident_id,
            "auto_add_to_case": True
        }
        r1 = client.post("/api/analyze", json=p1)
        assert r1.status_code == 200
        assert r1.json()["current_stage"] in ["APPROACH", "PERSISTENCE"]

        # Check evidence has 1 item with SHA-256
        vault_res = client.get(f"/api/evidence/{incident_id}")
        assert vault_res.status_code == 200
        vault_items = vault_res.json()
        assert len(vault_items) == 1
        assert len(vault_items[0]["file_hash_sha256"]) == 64

        # 5. Add Day 3 escalating evidence from similar handle
        p2 = {
            "content": "I know you study at Delhi University. Send your private photos or I will expose you to your class.",
            "content_type": "message",
            "source_platform": "Instagram Direct",
            "account_handle": "@stalker_alpha_2",
            "incident_id": incident_id,
            "auto_add_to_case": True
        }
        r2 = client.post("/api/analyze", json=p2)
        assert r2.status_code == 200
        assert r2.json()["current_stage"] in ["COERCION", "INTIMIDATION", "BLACKMAIL"]

        # 6. Verify What Changed reflects transition
        chg_res = client.get(f"/api/changes/{incident_id}")
        assert chg_res.status_code == 200
        chg_data = chg_res.json()
        assert chg_data["is_escalated"] is True
        assert chg_data["before_stage"] != chg_data["after_stage"]
        assert "@stalker_alpha_2" in chg_data["new_accounts_detected"]

        # 7. Verify Threat Linkage detects potential connection with attribution guardrails
        link_res = client.get(f"/api/linkage/{incident_id}")
        assert link_res.status_code == 200
        link_data = link_res.json()
        assert link_data["accounts_evaluated"] == 2
        assert len(link_data["connections_found"]) == 1
        conn = link_data["connections_found"][0]
        assert conn["verdict"] == "Potential connection detected"
        assert "does not establish attribution" in conn["plain_explanation"]
        assert "does not establish attribution" in link_data["disclaimer"]

        # 8. Verify Complaint Pack includes both handles and legal provisions
        comp_res = client.get(f"/api/complaint/{incident_id}")
        assert comp_res.status_code == 200
        comp_text = comp_res.json()["formatted_dossier_text"]
        assert "@stalker_alpha" in comp_text
        assert "@stalker_alpha_2" in comp_text

        # 9. Clean up via DELETE /api/incidents/{id}
        del_res = client.delete(f"/api/incidents/{incident_id}")
        assert del_res.status_code == 200

        # Verify incident is deleted
        get_res = client.get(f"/api/incidents/{incident_id}")
        assert get_res.status_code == 404


