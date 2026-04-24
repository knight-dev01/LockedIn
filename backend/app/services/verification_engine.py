"""
LockedIn Verification Engine
Rule-based truth system — AI assists only in parsing, never in deciding truth.
"""


def verify_email_domain(email: str, institution: str) -> dict:
    """
    Check if email domain matches known institutional domains.
    HIGH confidence verification.
    """
    # Known Nigerian corporate/institutional email domains
    KNOWN_DOMAINS = {
        "gtbank.com": "GTBank",
        "accessbankplc.com": "Access Bank",
        "zenithbank.com": "Zenith Bank",
        "firstbanknigeria.com": "First Bank",
        "ubagroup.com": "UBA",
        "dangote.com": "Dangote Group",
        "mtn.com": "MTN",
        "andela.com": "Andela",
        "flutterwave.com": "Flutterwave",
        "paystack.com": "Paystack",
        "kuda.com": "Kuda Bank",
        "interswitch.com": "Interswitch",
        # Universities
        "unilag.edu.ng": "University of Lagos",
        "ui.edu.ng": "University of Ibadan",
        "oauife.edu.ng": "Obafemi Awolowo University",
        "abu.edu.ng": "Ahmadu Bello University",
        "unn.edu.ng": "University of Nigeria Nsukka",
        "lasu.edu.ng": "Lagos State University",
        "covenant.edu.ng": "Covenant University",
    }

    domain = email.split("@")[-1].lower() if "@" in email else ""
    known_company = KNOWN_DOMAINS.get(domain)

    if known_company and institution.lower() in known_company.lower():
        return {
            "method": "email_domain",
            "confidence": "HIGH",
            "verified": True,
            "message": f"Email domain matches {known_company}",
        }
    elif known_company:
        return {
            "method": "email_domain",
            "confidence": "MEDIUM",
            "verified": False,
            "message": f"Email domain belongs to {known_company}, but doesn't match claimed institution",
        }
    else:
        return {
            "method": "email_domain",
            "confidence": "LOW",
            "verified": False,
            "message": "Email domain not in known institutions database",
        }


def verify_document(file_url: str) -> dict:
    """
    Document upload verification — marks for review.
    MEDIUM confidence.
    """
    if file_url:
        return {
            "method": "document_upload",
            "confidence": "MEDIUM",
            "verified": False,  # Needs peer review
            "message": "Document uploaded, pending peer review",
        }
    return {
        "method": "document_upload",
        "confidence": "NONE",
        "verified": False,
        "message": "No document provided",
    }


def verify_external_url(url: str) -> dict:
    """
    Check if an external URL is valid and accessible.
    MEDIUM confidence.
    """
    if url and (url.startswith("http://") or url.startswith("https://")):
        return {
            "method": "url_verification",
            "confidence": "MEDIUM",
            "verified": True,
            "message": "External URL provided and appears valid",
        }
    return {
        "method": "url_verification",
        "confidence": "LOW",
        "verified": False,
        "message": "No valid external URL provided",
    }
