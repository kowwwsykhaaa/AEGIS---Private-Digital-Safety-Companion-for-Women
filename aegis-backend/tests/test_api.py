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

def test_demo_load():
    with TestClient(app) as client:
        response = client.post("/api/demo/load?full=true")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["risk_level"] == "CRITICAL"
        assert data["current_stage"] == "COERCION"

def test_get_active_incident():
    with TestClient(app) as client:
        client.post("/api/demo/load?full=true")
        response = client.get("/api/incidents/active")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "inc-demo-ananya-2026"
        assert len(data["events"]) == 5
        assert len(data["accounts"]) == 2

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

def test_what_changed_endpoint():
    with TestClient(app) as client:
        client.post("/api/demo/load?full=true")
        response = client.get("/api/changes/inc-demo-ananya-2026")
        assert response.status_code == 200
        data = response.json()
        assert data["before_risk"] == "HIGH"
        assert data["after_risk"] == "CRITICAL"
        assert data["is_escalated"] is True

def test_threat_linkage_endpoint():
    with TestClient(app) as client:
        client.post("/api/demo/load?full=true")
        response = client.get("/api/linkage/inc-demo-ananya-2026")
        assert response.status_code == 200
        data = response.json()
        assert len(data["connections_found"]) > 0
        assert data["connections_found"][0]["verdict"] == "Potential connection detected"

def test_complaint_pack_endpoint():
    with TestClient(app) as client:
        client.post("/api/demo/load?full=true")
        response = client.get("/api/complaint/inc-demo-ananya-2026")
        assert response.status_code == 200
        data = response.json()
        assert "Bharatiya Nyaya Sanhita" in data["formatted_dossier_text"]
        assert "SHA-256" in data["formatted_dossier_text"]
        assert len(data["evidence_index"]) >= 4

def test_helplines_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/help/helplines")
        assert response.status_code == 200
        data = response.json()
        numbers = [h["number"] for h in data["helplines"]]
        assert "112" in numbers
        assert "181" in numbers
        assert "1930" in numbers
