import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
EVIDENCE_DIR = BASE_DIR / "evidence_vault"
EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'aegis_safety.db'}")
SECRET_KEY = os.getenv("SECRET_KEY", "aegis_hackathon_secure_local_key_women_safety_2026")
API_PREFIX = "/api"

HELPLINES = [
    {
        "number": "112",
        "title": "National Emergency Service",
        "description": "Immediate police, fire, or ambulance dispatch across India.",
        "type": "emergency",
        "available": "24/7",
    },
    {
        "number": "181",
        "title": "Women Helpline",
        "description": "Crisis intervention, harassment support, and confidential counseling for women.",
        "type": "support",
        "available": "24/7",
    },
    {
        "number": "1930",
        "title": "National Cyber Crime Helpline",
        "description": "Direct reporting for financial cyber fraud, online harassment, blackmail, and NCII (cybercrime.gov.in).",
        "type": "cybercrime",
        "available": "24/7",
    },
]
