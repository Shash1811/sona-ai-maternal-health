import os
from datetime import datetime
from typing import Dict, List

import httpx


CRISIS_KEYWORDS = [
    "kill myself",
    "suicide",
    "suicidal",
    "self harm",
    "hurt myself",
    "hurt my baby",
    "harm my baby",
    "can't go on",
    "want to die",
    "end my life",
    "emergency",
    "bleeding heavily",
    "severe chest pain",
    "can't breathe",
]


def detect_crisis(text: str) -> Dict[str, object]:
    lowered = text.lower()
    matches: List[str] = [keyword for keyword in CRISIS_KEYWORDS if keyword in lowered]
    return {
        "is_crisis": bool(matches),
        "matches": matches,
        "severity": "high" if matches else "none",
    }


async def send_twilio_crisis_alert(user_id: str, message: str, detection: Dict[str, object]) -> Dict[str, object]:
    """Send SMS through Twilio REST API when credentials are configured."""

    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_FROM_NUMBER")
    to_number = os.getenv("CRISIS_ALERT_TO_NUMBER")

    if not all([account_sid, auth_token, from_number, to_number]):
        return {
            "sent": False,
            "reason": "Twilio credentials not configured",
        }

    alert_body = (
        "Sona crisis alert\n"
        f"User: {user_id}\n"
        f"Time: {datetime.utcnow().isoformat()}Z\n"
        f"Signals: {', '.join(detection.get('matches', []))}\n"
        f"Message: {message[:500]}"
    )

    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(
            url,
            auth=(account_sid, auth_token),
            data={
                "From": from_number,
                "To": to_number,
                "Body": alert_body,
            },
        )

    if response.status_code >= 400:
        return {
            "sent": False,
            "status_code": response.status_code,
            "reason": response.text[:300],
        }

    payload = response.json()
    return {
        "sent": True,
        "message_sid": payload.get("sid"),
        "status": payload.get("status"),
    }
