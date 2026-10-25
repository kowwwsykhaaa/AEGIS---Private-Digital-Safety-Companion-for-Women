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

