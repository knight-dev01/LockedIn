<p align="center">
  <img src="frontend/public/logo.png" alt="LockedIn" width="80" />
</p>

<h1 align="center">LockedIn</h1>
<p align="center"><strong>Proof Over Claims.</strong></p>
<p align="center">A professional network where achievements are verified, not assumed.</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.136-009688?logo=fastapi" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## What is LockedIn?

LockedIn is a **LinkedIn-style professional network** built on **proof, not claims**. Every achievement, skill, and credential must be verified through:

- **Link Scraping** — GitHub repos, LinkedIn profiles, and portfolios are automatically scraped to validate claims
- **Peer Review** — High-trust professionals (Score 70+) review and vote on claims
- **Trust Score** — A deterministic 0–100 score based on verified proofs, not self-reported data

### Key Rules
- 🔒 **No unverified visibility** — Only verified professionals gain full platform access
- 🤝 **Connections require Score 26+** — You must prove yourself before networking
- ⏰ **14-day proof deadline** — Unverified claims expire and are removed
- 🚫 **No AI truth decisions** — AI assists with parsing only; verification is rule-based

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS v4 |
| **Backend** | FastAPI, Python 3.13, SQLAlchemy |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Auth** | JWT + bcrypt |
| **State** | Zustand |
| **API Client** | Axios |
| **PWA** | Service Worker + Web Manifest |

---

## Quick Start

### Prerequisites
- **Node.js** 18+ 
- **Python** 3.10+
- **Git**

### 1. Clone

```bash
git clone https://github.com/knight-dev01/LockedIn.git
cd LockedIn
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

### 4. Run

**Option A — PowerShell script (Windows):**
```powershell
.\start.ps1
```

**Option B — Manual (two terminals):**

```bash
# Terminal 1 — Backend
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Then open **http://localhost:3000**

---

## Project Structure

```
LockedIn/
├── backend/
│   ├── app/
│   │   ├── core/           # Config, database, security (JWT)
│   │   ├── models/         # SQLAlchemy models (9 tables)
│   │   ├── routes/         # API endpoints (7 route files)
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── services/       # Trust engine, link scraper, AI parser
│   │   └── main.py         # FastAPI app entry point
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/             # Logo, icons, PWA manifest, service worker
│   └── src/
│       ├── app/            # Next.js App Router pages
│       │   ├── page.tsx          # Landing page
│       │   ├── login/            # Login
│       │   ├── register/         # Two-step registration
│       │   ├── dashboard/        # Authenticated dashboard
│       │   ├── search/           # Professional search
│       │   ├── network/          # Connections
│       │   ├── notifications/    # Alerts
│       │   ├── add-proof/        # Submit claims
│       │   └── in/[lockedin_id]/ # Public profile
│       ├── lib/            # API client, TypeScript types
│       └── stores/         # Zustand auth store
├── start.ps1               # One-click startup script
├── .gitignore
├── LICENSE
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | Public | Create account |
| POST | `/api/v1/auth/login` | Public | Get JWT token |
| GET | `/api/v1/auth/me` | Required | Current user |
| GET | `/api/v1/profile/{lockedin_id}` | Public | Public profile |
| PUT | `/api/v1/profile/update` | Required | Update profile |
| POST | `/api/v1/profile/experience` | Required | Add experience |
| POST | `/api/v1/profile/education` | Required | Add education |
| POST | `/api/v1/profile/skills` | Required | Add skills |
| POST | `/api/v1/profile/links` | Required | Submit pro links |
| POST | `/api/v1/claims/create` | Required | Submit proof |
| GET | `/api/v1/claims/my` | Required | My claims |
| POST | `/api/v1/claims/{id}/evidence` | Required | Attach evidence |
| GET | `/api/v1/trust/{user_id}` | Public | Trust score |
| GET | `/api/v1/search/professionals` | Public | Search |
| POST | `/api/v1/connections/request/{id}` | Required | Connect (26+) |
| PATCH | `/api/v1/connections/{id}/accept` | Required | Accept |
| GET | `/api/v1/notifications/` | Required | Notifications |

Full interactive docs at **http://localhost:8000/docs**

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | `sqlite:///./lockedin.db` for dev |
| `JWT_SECRET` | Yes | Random secret string |
| `OPENROUTER_API_KEY` | No | AI CV parsing |
| `GITHUB_TOKEN` | No | Higher GitHub API limits |
| `CLOUDINARY_*` | No | Image/document uploads |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:8000/api/v1` |

---

## Verification Levels

| Level | Score | Perks |
|-------|-------|-------|
| Basic | 0–25 | Profile only |
| Verified | 26–50 | Can send connections |
| Proven | 51–75 | Featured in search |
| Elite | 76–100 | Reviewer access, top visibility |

---

## Roadmap

- [x] Core auth + profiles
- [x] Trust score engine
- [x] Claims & evidence system
- [x] Link scraping (GitHub, portfolio)
- [x] Professional search with filters
- [x] Connections with score gate
- [x] Dark mode UI
- [x] PWA (installable)
- [x] Mobile-first responsive design
- [ ] Peer review panels
- [ ] Knowledge quizzes
- [ ] Real-time messaging
- [ ] For Employers portal
- [ ] Deploy (Vercel + Render)

---

## License

MIT — see [LICENSE](LICENSE)

---

<p align="center">
  <strong>Be verified. Build trust. Get discovered.</strong>
</p>
