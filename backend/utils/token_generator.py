import uuid
from datetime import datetime, timedelta


def generate_download_token() -> str:
    """
    Generate a secure random token for downloads

    Returns:
        UUID v4 string
    """
    return str(uuid.uuid4())


def generate_token_expiry(hours: int = 48) -> datetime:
    """
    Generate expiry timestamp for download token

    Args:
        hours: Number of hours until expiry (default: 48)

    Returns:
        datetime object representing expiry time
    """
    return datetime.utcnow() + timedelta(hours=hours)


def is_token_expired(expiry: datetime) -> bool:
    """
    Check if a token has expired

    Args:
        expiry: Token expiry datetime

    Returns:
        True if expired, False otherwise
    """
    return datetime.utcnow() > expiry


def generate_receipt_number() -> str:
    """
    Generate a unique receipt number for orders

    Returns:
        Receipt string in format: receipt_<timestamp>_<uuid>
    """
    timestamp = int(datetime.utcnow().timestamp())
    short_uuid = str(uuid.uuid4())[:8]
    return f"receipt_{timestamp}_{short_uuid}"
