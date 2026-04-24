"""
LockedIn Trust Score Engine
Deterministic scoring — no ML, no AI decisions.
"""


SCORE_WEIGHTS = {
    "identity_verified": 10,         # Profile complete + email verified
    "experience_verified": 20,       # Per verified work experience (max 2 counted)
    "education_verified": 15,        # Per verified education (max 1 counted)
    "skills_verified": 10,           # Skills backed by proofs
    "proofs_verified": 10,           # Per verified proof (max 4 counted)
    "linkedin_linked": 5,            # LinkedIn URL provided
    "github_linked": 5,              # GitHub URL provided
    "linkedin_data_matches": 10,     # Scraped LinkedIn data matches claims
    "github_data_matches": 10,       # GitHub repos confirm skill claims
    "portfolio_linked": 3,           # Portfolio URL provided
    "certification_url_valid": 5,    # Cert URL resolves and matches
}

LEVEL_THRESHOLDS = {
    "basic": (0, 25),
    "verified_identity": (26, 50),
    "proof_verified": (51, 75),
    "elite": (76, 100),
}


def get_verification_level(score: int) -> str:
    """Get verification level based on trust score."""
    for level, (low, high) in LEVEL_THRESHOLDS.items():
        if low <= score <= high:
            return level
    return "basic"


def calculate_trust_score(user, claims, experiences, educations, skills, scraped_profiles=None) -> dict:
    """
    Calculate trust score based on verified claims and profile completeness.
    Returns score, level, and detailed breakdown.
    """
    breakdown = {}
    score = 0

    # Identity: profile completeness
    identity_complete = all([
        user.name,
        user.email,
        user.headline,
        user.about,
    ])
    if identity_complete:
        breakdown["identity_verified"] = SCORE_WEIGHTS["identity_verified"]
        score += SCORE_WEIGHTS["identity_verified"]

    # Verified experiences (max 2 counted)
    verified_exp_count = sum(1 for exp in experiences if exp.is_verified)
    exp_score = min(verified_exp_count, 2) * SCORE_WEIGHTS["experience_verified"]
    if exp_score > 0:
        breakdown["experience_verified"] = exp_score
        score += exp_score

    # Verified education (max 1 counted)
    verified_edu_count = sum(1 for edu in educations if edu.is_verified)
    edu_score = min(verified_edu_count, 1) * SCORE_WEIGHTS["education_verified"]
    if edu_score > 0:
        breakdown["education_verified"] = edu_score
        score += edu_score

    # Verified skills
    verified_skill_count = sum(1 for skill in skills if skill.is_verified)
    if verified_skill_count > 0:
        breakdown["skills_verified"] = SCORE_WEIGHTS["skills_verified"]
        score += SCORE_WEIGHTS["skills_verified"]

    # Verified proofs/claims (max 4 counted)
    verified_claims = [c for c in claims if c.status == "verified"]
    proof_score = min(len(verified_claims), 4) * SCORE_WEIGHTS["proofs_verified"]
    if proof_score > 0:
        breakdown["proofs_verified"] = proof_score
        score += proof_score

    # Professional links bonus
    if user.linkedin_url:
        breakdown["linkedin_linked"] = SCORE_WEIGHTS["linkedin_linked"]
        score += SCORE_WEIGHTS["linkedin_linked"]

    if user.github_url:
        breakdown["github_linked"] = SCORE_WEIGHTS["github_linked"]
        score += SCORE_WEIGHTS["github_linked"]

    if user.portfolio_url:
        breakdown["portfolio_linked"] = SCORE_WEIGHTS["portfolio_linked"]
        score += SCORE_WEIGHTS["portfolio_linked"]

    # Scraped profile match bonuses
    if scraped_profiles:
        for sp in scraped_profiles:
            if sp.platform == "linkedin" and sp.match_score >= 70:
                breakdown["linkedin_data_matches"] = SCORE_WEIGHTS["linkedin_data_matches"]
                score += SCORE_WEIGHTS["linkedin_data_matches"]
            elif sp.platform == "github" and sp.match_score >= 70:
                breakdown["github_data_matches"] = SCORE_WEIGHTS["github_data_matches"]
                score += SCORE_WEIGHTS["github_data_matches"]

    # Cap at 100
    score = min(score, 100)
    level = get_verification_level(score)

    return {
        "trust_score": score,
        "verification_level": level,
        "breakdown": breakdown,
    }
