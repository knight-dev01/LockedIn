"""
LockedIn ID Generator
Creates unique, readable professional IDs.
"""
import random
import string
import re


def generate_lockedin_id(name: str) -> str:
    """
    Generate a unique LockedIn ID from user's name.
    Format: firstname-lastname-XXXX (4 random alphanumeric chars)
    Example: john-doe-a7x3
    """
    # Clean the name
    clean_name = re.sub(r'[^a-zA-Z\s]', '', name.strip().lower())
    parts = clean_name.split()

    if len(parts) >= 2:
        base = f"{parts[0]}-{parts[-1]}"
    elif len(parts) == 1:
        base = parts[0]
    else:
        base = "user"

    # Add random suffix
    suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
    return f"{base}-{suffix}"
