"""
LockedIn Link Scraper Service
Scrapes professional profile links to validate user claims.
GitHub: uses public API
Portfolio/Freelance: uses httpx + BeautifulSoup
LinkedIn: extracts from public pages (with limitations)
"""
import httpx
from bs4 import BeautifulSoup
from typing import Optional
from datetime import datetime, timezone

from app.core.config import get_settings

settings = get_settings()


async def scrape_github_profile(github_url: str) -> Optional[dict]:
    """
    Scrape GitHub profile using public API.
    Extracts: bio, repos, languages, contribution activity.
    """
    try:
        # Extract username from URL
        username = github_url.rstrip("/").split("/")[-1]
        if not username:
            return None

        headers = {"Accept": "application/vnd.github.v3+json"}
        if settings.GITHUB_TOKEN:
            headers["Authorization"] = f"token {settings.GITHUB_TOKEN}"

        async with httpx.AsyncClient(timeout=15) as client:
            # Get user profile
            user_resp = await client.get(
                f"https://api.github.com/users/{username}",
                headers=headers,
            )
            if user_resp.status_code != 200:
                return None

            user_data = user_resp.json()

            # Get repos (top 30 by stars)
            repos_resp = await client.get(
                f"https://api.github.com/users/{username}/repos",
                params={"sort": "stars", "per_page": 30},
                headers=headers,
            )
            repos_data = repos_resp.json() if repos_resp.status_code == 200 else []

            # Extract languages from repos
            languages = set()
            repo_names = []
            for repo in repos_data:
                if isinstance(repo, dict):
                    if repo.get("language"):
                        languages.add(repo["language"])
                    repo_names.append({
                        "name": repo.get("name", ""),
                        "description": repo.get("description", ""),
                        "language": repo.get("language", ""),
                        "stars": repo.get("stargazers_count", 0),
                        "url": repo.get("html_url", ""),
                    })

            return {
                "platform": "github",
                "name": user_data.get("name", ""),
                "bio": user_data.get("bio", ""),
                "company": user_data.get("company", ""),
                "location": user_data.get("location", ""),
                "public_repos": user_data.get("public_repos", 0),
                "followers": user_data.get("followers", 0),
                "following": user_data.get("following", 0),
                "languages": list(languages),
                "top_repos": repo_names[:10],
                "profile_url": user_data.get("html_url", ""),
                "created_at": user_data.get("created_at", ""),
            }

    except Exception as e:
        print(f"GitHub scrape error: {e}")
        return None


async def scrape_portfolio(portfolio_url: str) -> Optional[dict]:
    """
    Scrape a portfolio website for professional information.
    Extracts: title, description, technologies mentioned, project links.
    """
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(portfolio_url, headers={
                "User-Agent": "Mozilla/5.0 (compatible; LockedIn/1.0)"
            })
            if resp.status_code != 200:
                return None

            soup = BeautifulSoup(resp.text, "html.parser")

            # Extract basic info
            title = soup.title.string if soup.title else ""
            meta_desc = ""
            meta_tag = soup.find("meta", attrs={"name": "description"})
            if meta_tag:
                meta_desc = meta_tag.get("content", "")

            # Extract all text for keyword analysis
            body_text = soup.get_text(separator=" ", strip=True)[:5000]

            # Find technology keywords
            tech_keywords = [
                "python", "javascript", "typescript", "react", "node.js", "vue",
                "angular", "django", "fastapi", "flask", "next.js", "tailwind",
                "postgresql", "mongodb", "aws", "docker", "kubernetes",
                "machine learning", "data science", "figma", "ui/ux",
            ]
            found_techs = [
                tech for tech in tech_keywords
                if tech.lower() in body_text.lower()
            ]

            # Extract links
            links = []
            for a in soup.find_all("a", href=True)[:20]:
                href = a["href"]
                if href.startswith("http"):
                    links.append({
                        "text": a.get_text(strip=True)[:100],
                        "url": href,
                    })

            return {
                "platform": "portfolio",
                "title": title,
                "description": meta_desc,
                "technologies": found_techs,
                "links": links,
                "text_preview": body_text[:2000],
            }

    except Exception as e:
        print(f"Portfolio scrape error: {e}")
        return None


async def scrape_linkedin_public(linkedin_url: str) -> Optional[dict]:
    """
    Attempt to extract basic info from LinkedIn public profile.
    Note: LinkedIn heavily restricts scraping. This provides limited data.
    For full LinkedIn data, users should export their data via LinkedIn settings.
    """
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(linkedin_url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            })
            if resp.status_code != 200:
                return {"platform": "linkedin", "url": linkedin_url, "status": "limited_access"}

            soup = BeautifulSoup(resp.text, "html.parser")
            title = soup.title.string if soup.title else ""

            # LinkedIn public pages have limited info
            return {
                "platform": "linkedin",
                "url": linkedin_url,
                "page_title": title,
                "status": "scraped_limited",
            }

    except Exception as e:
        print(f"LinkedIn scrape error: {e}")
        return {"platform": "linkedin", "url": linkedin_url, "status": "error"}


def calculate_match_score(scraped_data: dict, user_claims: list, user_skills: list) -> int:
    """
    Calculate how well scraped profile data matches user's claims.
    Returns score 0-100.
    """
    if not scraped_data:
        return 0

    matches = 0
    total_checks = 0

    platform = scraped_data.get("platform", "")

    if platform == "github":
        # Check if GitHub languages match claimed skills
        github_langs = [l.lower() for l in scraped_data.get("languages", [])]
        for skill in user_skills:
            total_checks += 1
            if skill.name.lower() in github_langs:
                matches += 1

        # Check if repos match claimed projects
        repo_names = [r["name"].lower() for r in scraped_data.get("top_repos", [])]
        for claim in user_claims:
            if claim.type == "repository":
                total_checks += 1
                if any(claim.title.lower() in name for name in repo_names):
                    matches += 1

    elif platform == "portfolio":
        # Check if portfolio mentions claimed technologies
        found_techs = [t.lower() for t in scraped_data.get("technologies", [])]
        for skill in user_skills:
            total_checks += 1
            if skill.name.lower() in found_techs:
                matches += 1

    if total_checks == 0:
        return 50  # Neutral if we can't compare

    return min(int((matches / total_checks) * 100), 100)
