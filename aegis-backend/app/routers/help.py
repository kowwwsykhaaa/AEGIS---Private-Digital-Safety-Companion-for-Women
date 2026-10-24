from fastapi import APIRouter
from app.config import HELPLINES

router = APIRouter(prefix="/help", tags=["Immediate Help"])

@router.get("/helplines")
def get_verified_helplines():
    return {
        "title": "Verified Indian Emergency & Cyber Safety Helplines",
        "guidance": "AEGIS is a personal intelligence desk, not an emergency dispatch provider. If you are in immediate physical danger, dial 112 directly.",
        "helplines": HELPLINES,
        "online_portals": [
            {
                "name": "National Cyber Crime Reporting Portal",
                "url": "https://cybercrime.gov.in",
                "notes": "Official portal for reporting online harassment, financial fraud, and non-consensual intimate imagery (NCII)."
            },
            {
                "name": "StopNCII.org",
                "url": "https://stopncii.org",
                "notes": "Platform to create on-device cryptographic hash fingerprints of intimate images to prevent sharing across participating social platforms."
            }
        ]
    }
