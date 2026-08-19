# AttritionIQ — Predictive Workforce Intelligence & Flight-Risk Analytics

> **Turn raw HR telemetry into high-precision retention strategies.**  
> Powered by PostgreSQL analytical views, class-balanced machine learning models, and a distinctive claymorphism user interface.

## 🌐 Live Demo

- **Frontend Web Application**: [https://attrition-iq.vercel.app](https://attrition-iq.vercel.app) *(Replace with your Vercel URL)*
- **Interactive API & Swagger**: [https://attrition-iq-backend.up.railway.app/docs](https://attrition-iq-backend.up.railway.app/docs) *(Replace with your Railway URL)*
- **API Health Status**: [https://attrition-iq-backend.up.railway.app/health](https://attrition-iq-backend.up.railway.app/health)

---

## 🏛️ System Architecture

```
                               ┌────────────────────────────────────────┐
                               │       AttritionIQ Next.js App          │
                               │        (Port 3000 / App Router)        │
                               └──────────────────┬─────────────────────┘
                                                  │
                  ┌───────────────────────────────┼───────────────────────────────┐
                  ▼                               ▼                               ▼
       ┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
       │     Landing Page    │         │ Analytics Dashboard │         │  Risk Scanner Tool  │
       │     (Three.js/GSAP) │         │ (9 SQL Views/Rechart│         │ (Live ML Inference) │
       └─────────────────────┘         └─────────────────────┘         └─────────────────────┘
                                                  │
                                                  ▼ HTTP / JSON
                               ┌────────────────────────────────────────┐
                               │         FastAPI Backend Engine         │
                               │              (Port 8000)               │
                               └──────────────────┬─────────────────────┘
                                                  │
                     ┌────────────────────────────┴────────────────────────────┐
                     ▼                                                         ▼
       ┌───────────────────────────┐                             ┌───────────────────────────┐
       │     PostgreSQL Database   │                             │  Trained scikit-learn ML  │
       │    (1,470 IBM HR Records) │                             │   (Balanced Logistic Reg) │
       │  9 Deep Analytics Views   │                             │ 80.1% ROC-AUC / 68% Recall│
       └───────────────────────────┘                             └───────────────────────────┘
```

---

## ✨ Features

1. **Claymorphism Design System**:
   - Deep obsidian/charcoal base (`#090a0f`) with warm terracotta (`#e86034`) and slate teal (`#2a9d8f`) accents.
   - Dual directional lighting shadows with soft inner rim bevel highlights.
   - Custom font pairing: **Syne** (bold avant-garde headings) + **Plus Jakarta Sans** (clean geometric body).

2. **Interactive Three.js 3D Hero Scene**:
   - Procedural deformable clay blob geometry with real-time vertex noise displacement.
   - Orbiting satellite clay pebbles, soft lighting matching CSS drop-shadow angles, and smooth mouse cursor parallax.

3. **Analytics Intelligence Dashboard** (`/dashboard`):
   - **Top KPI Cards**: Monospace numbers, Framer Motion spring count-up, and directional trend tags.
   - **Department Distribution**: Flat bar charts & Recharts donut chart with interactive slice hover.
   - **Deep Cohort Grid**: Multi-dimensional views (Salary Band, Mandatory Overtime, Satisfaction, Work-Life Balance, Age Group, Promotion Gap).
   - **High-Risk Registry Table**: Searchable, department/overtime filterable, and sortable by Attrition %, Cohort Size, Leavers, and Salary.

4. **Real-Time Flight Risk Scanner** (`/predict`):
   - Custom clay-styled inputs, select dropdowns, sliders, and segmented toggles.
   - Quick testing presets (*Critical Flight Risk*, *Retained Senior Leader*, *Moderate Transition Case*).
   - Concentric radar scanning animation during inference.
   - Radial SVG progress gauge, per-instance mathematical factor attribution, and prescriptive mitigation playbooks.

---

## 🚀 Quick Start (Run in One Command)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose

### 1. Launch with Docker Compose
```bash
docker compose up --build
```

This starts:
- **PostgreSQL**: `localhost:5432` (auto-initializes schema & analytics views)
- **FastAPI Backend**: `http://localhost:8000` (interactive docs at `http://localhost:8000/docs`)
- **Next.js Frontend**: `http://localhost:3000`

---

## 🛠️ Local Development (Without Docker)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations & populate dataset
python -m app.scripts.load_data

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Deployment Guide

### Step 1: Deploy Backend + PostgreSQL (Railway / Render)
1. **Create PostgreSQL Database** on Railway/Render.
2. **Deploy Backend Service**:
   - Connect GitHub repository and set root directory to `backend/`.
   - Set build type to `Dockerfile` (automatically detected via `backend/railway.json` or `render.yaml`).
   - Set environment variables:
     - `DATABASE_URL`: `postgresql://<user>:<password>@<host>:<port>/<db>`
     - `ALLOWED_ORIGINS`: `https://your-vercel-app.vercel.app`
3. **Seed Database Schema & IBM Dataset**:
   - Open Railway web terminal or run locally against production DB:
     ```bash
     export DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<db>"
     psql $DATABASE_URL -f backend/app/sql/01_schema.sql
     psql $DATABASE_URL -f backend/app/sql/03_analytics_views.sql
     python -m app.scripts.load_data
     ```

### Step 2: Deploy Frontend (Vercel)
1. **Import Repository on Vercel**:
   - Set **Root Directory** to `frontend/`.
   - Framework preset: `Next.js`.
2. **Configure Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-service.railway.app`
3. Click **Deploy**. Vercel will build and host the landing page, dashboard, and real-time scanner.

---

## 📡 API Reference

### Health & Meta
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Liveness probe and PostgreSQL connectivity check |
| `GET` | `/info` | API service metadata and registered view catalog |
| `GET` | `/docs` | Interactive Swagger API documentation |

### Analytics Endpoints (`/analytics`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/analytics/overview` | Total headcount, leavers count, and baseline attrition % (16.12%) |
| `GET` | `/analytics/by-department` | Attrition % and headcount breakdown per department |
| `GET` | `/analytics/by-salary` | Attrition % across 4 monthly income bands (<$3k, $3k-$6k, $6k-$10k, ≥$10k) |
| `GET` | `/analytics/by-overtime` | Comparison between Overtime: Yes (30.5%) vs Overtime: No (10.4%) |
| `GET` | `/analytics/by-satisfaction` | Attrition % mapped across satisfaction levels (1 to 4) |
| `GET` | `/analytics/by-worklife-balance` | Attrition % across Work-Life Balance levels (Bad to Best) |
| `GET` | `/analytics/by-age-group` | Attrition % and salary by career stage (Under 25, 25-34, 35-44, Over 44) |
| `GET` | `/analytics/by-promotion-gap` | Attrition % by years since last promotion (0y, 1-2y, 3-5y, 6+y) |
| `GET` | `/analytics/high-risk-profiles` | Cohorts (Department × Role × OverTime, N≥10) sorted by risk |

### Risk Prediction Endpoint (`/predict`)
| Method | Endpoint | Payload | Response |
|---|---|---|---|
| `POST` | `/predict/risk` | `PredictionRequest` (all fields optional with medians) | `risk_score`, `risk_label` (Low/Med/High), `top_contributing_factors` |

---

## 🧪 Testing & CI

Continuous Integration is configured via GitHub Actions (`.github/workflows/ci.yml`):
- **Backend**: Runs PostgreSQL service container, schema initialization, dataset loader, and full `pytest` suite.
- **Frontend**: Runs `npm ci` and production Next.js build (`npm run build`).

Run tests locally:
```bash
# Backend pytest suite
cd backend
source venv/bin/activate
pytest -v

# Frontend build check
cd frontend
npm run build
```

---

## 📸 Screenshots

| Landing Page (Three.js Hero) | Analytics Dashboard |
|:---:|:---:|
| *(Three.js 3D Clay Scene, GSAP staggered reveal, telemetry simulator)* | *(KPI row, department distribution donut, 6 cohort bar charts, sortable table)* |

| Risk Scanner (Form & Presets) | High-Risk Scan Result |
|:---:|:---:|
| *(Multi-section clay controls with one-click presets)* | *(Radial SVG gauge, factor attribution bars, retention playbooks)* |

*(Visual recordings and full walkthrough available in `brain/.../walkthrough.md`)*
