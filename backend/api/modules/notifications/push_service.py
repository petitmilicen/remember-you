"""
Push Notification Service using Expo Push API
"""
import requests
from typing import Optional, Dict, Any


EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"


def send_push_notification(
    push_token: str,
    title: str,
    body: str,
    data: Optional[Dict[str, Any]] = None,
    sound: str = "default",
    priority: str = "high"
) -> bool:
    """
    Send a push notification via Expo Push Service
    
    Args:
        push_token: Expo push token (starts with ExponentPushToken[...])
        title: Notification title
        body: Notification body/message
        data: Optional dictionary of additional data
        sound: Notification sound (default: "default")
        priority: Notification priority (default: "high")
    
    Returns:
        bool: True if sent successfully, False otherwise
    """
    if not push_token or not push_token.startswith("ExponentPushToken"):
        print(f"Invalid push token: {push_token}")
        return False
    
    payload = {
        "to": push_token,
        "sound": sound,
        "title": title,
        "body": body,
        "data": data or {},
        "priority": priority,
        "channelId": "emergency-alerts"  # Custom channel for emergency alerts
    }
    
    try:
        response = requests.post(
            EXPO_PUSH_URL,
            json=payload,
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get("data") and result["data"][0].get("status") == "ok":
                print(f"✅ Push notification sent successfully to {push_token[:20]}...")
                return True
            else:
                error = result.get("data", [{}])[0].get("message", "Unknown error")
                print(f"❌ Push notification failed: {error}")
                return False
        else:
            print(f"❌ Push API error: {response.status_code} - {response.text}")
            return False
            
    except requests.RequestException as e:
        print(f"❌ Network error sending push notification: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error sending push notification: {str(e)}")
        return False


def send_emergency_alert(caregiver_token: str, patient_name: str, latitude: float, longitude: float) -> bool:
    """
    Send emergency alert when patient exits safe zone
    
    Args:
        caregiver_token: Caregiver's Expo push token
        patient_name: Name of the patient
        latitude: Patient's current latitude
        longitude: Patient's current longitude
    
    Returns:
        bool: True if sent successfully
    """
    return send_push_notification(
        push_token=caregiver_token,
        title="🚨 ALERTA: Paciente fuera de zona segura",
        body=f"{patient_name} ha salido del área segura",
        data={
            "type": "zone_exit",
            "latitude": latitude,
            "longitude": longitude,
            "timestamp": str(requests.utils.default_headers())  # Current timestamp
        },
        sound="default",
        priority="high"
    )
