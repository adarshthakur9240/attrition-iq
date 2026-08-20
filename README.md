# 🧠 AttritionIQ — Predictive Workforce Intelligence & Explainable Flight-Risk Platform

> **Turn raw HR telemetry into proactive, high-precision retention strategies.**  
> Powered by PostgreSQL analytical engines, class-balanced machine learning models, and an avant-garde claymorphic user experience.

---

<div align="center">

[![CI Pipeline](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](#-cicd-pipeline-flow)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 🌐 Live Production Deployments

| Component | Status | Production Endpoint | Interactive Docs |
|---|---|---|---|
| **Web Application** | ![Live](https://img.shields.io/badge/Status-Active-brightgreen) | [https://attrition-iq.vercel.app](https://attrition-iq.vercel.app) | User Interface & Risk Scanner |
| **Backend REST API** | ![Live](https://img.shields.io/badge/Status-Active-brightgreen) | [https://attrition-iq-backend.onrender.com](https://attrition-iq-backend.onrender.com) | [Swagger UI (`/docs`)](https://attrition-iq-backend.onrender.com/docs) |
| **System Health** | ![Passing](https://img.shields.io/badge/Health-200_OK-success) | [https://attrition-iq-backend.onrender.com/health](https://attrition-iq-backend.onrender.com/health) | Live DB Probe & Uptime Monitor |

---

## 💡 The "Why" — Modern Workforce Intelligence

Traditional HR systems operate **retrospectively**: by the time an exit interview appears on an executive dashboard, the organization has already incurred the replacement cost (typically **1.5x to 2x an employee's annual salary** in technical domains).

```
Traditional HR Analytics:     [Employee Resigns] ───────► [Post-Mortem SQL Report] ──► (Too Late)
AttritionIQ Architecture:     [Continuous Telemetry] ──► [Explainable ML Inference] ─► [Prescriptive Playbook]
```

### Key Differentiators:
1. **Explainable AI (XAI) over Black-Box Scoring**: Rather than generating opaque probability figures, AttritionIQ mathematically isolates the exact behavioral catalysts (e.g., `OverTime: Yes` $+1.59$ risk weight, `Travel_Frequently` $+1.42$ risk weight) driving individual flight risk.
2. **High-Recall Machine Learning**: Designed with class-balanced weighting (`class_weight='balanced'`) to optimize for recall ($~85\%$), prioritizing the elimination of false negatives (unnoticed at-risk talent).
3. **9 Deep Analytical SQL Views**: Aggregates multi-dimensional workforce cohorts (salary bands, promotion stagnation windows, satisfaction indices) directly inside PostgreSQL for sub-millisecond analytical query performance.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (Next.js 16 App Router)"]
        UI_Home["Landing Page<br/>(Tailwind / UI Primitives)"]
        UI_Dash["Analytics Dashboard<br/>(Recharts / Dynamic Cohorts)"]
        UI_Predict["Risk Scanner Tool<br/>(Interactive Forms & Gauges)"]
    end

    subgraph APILayer ["FastAPI REST Gateway (Python 3.12)"]
        Router_Health["/health & /info<br/>(DB Liveness Probes)"]
        Router_Analytics["/analytics/*<br/>(9 View Handlers)"]
        Router_Predict["/predict/risk<br/>(ML Inference Engine)"]
    end

    subgraph DataML ["Data & Intelligence Layer"]
        PG_DB[("PostgreSQL 16<br/>(1,470 Records + 9 Views)")]
        SK_Model["Trained Scikit-Learn Model<br/>(Random Forest + Scaler)"]
        XAI_Engine["XAI Decomposition<br/>(Per-Instance Feature Importance)"]
    end

    UI_Home -->|Fetch Telemetry Demo| Router_Predict
    UI_Dash -->|Fetch Cohort Aggregates| Router_Analytics
    UI_Predict -->|Submit Employee Attributes| Router_Predict
    
    Router_Analytics -->|SQL Queries| PG_DB
    Router_Predict -->|Forward Features| SK_Model
    SK_Model -->|Probability Matrix| XAI_Engine
```

---

## 🔄 Data Flow & Prediction Lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant HR as HR Leader
    participant Client as Next.js Scanner
    participant API as FastAPI Backend
    participant Engine as ML Transformer
    participant Model as Scikit-Learn Model
    participant XAI as Feature Importance

    HR->>Client: Inputs 18 employee attributes
    Client->>API: POST /predict/risk (JSON Payload)
    API->>Engine: Encode categoricals & scale features
    Engine->>Model: Compute flight-risk probability
    Model->>XAI: Extract mathematical feature weights
    XAI-->>API: Return risk_score (e.g. 0.99) & top drivers
    API-->>Client: HTTP 200 OK (Formatted JSON)
    Client-->>HR: Render Radial Gauge & Risk Factors
```

---

## 🚀 CI/CD Pipeline Flow

```mermaid
flowchart LR
    subgraph VCS ["Version Control"]
        Push["git push origin main"]
    end

    subgraph GHA ["GitHub Actions CI Pipeline"]
        subgraph BackendJob ["Backend CI (Python 3.12)"]
            PG_Service["Postgres 16 Service"]
            Init_Schema["Run 01_schema.sql & 03_views.sql"]
            Seed_Data["Execute load_data.py"]
            Run_Pytest["Run Pytest Suite"]
        end

        subgraph FrontendJob ["Frontend CI (Node.js 20)"]
            NPM_CI["npm ci dependencies"]
            Next_Build["npm run build"]
        end
    end

    subgraph Deployment ["Continuous Deployment (CD)"]
        Deploy_Render["Render Web Service<br/>(Backend API)"]
        Deploy_Vercel["Vercel Edge Network<br/>(Frontend UI)"]
    end

    Push --> GHA
    GHA --> BackendJob
    GHA --> FrontendJob
    
    BackendJob -->|If Tests Pass| Deploy_Render
    FrontendJob -->|If Build Passes| Deploy_Vercel
```

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (Strict mode)
- **Styling & Design Tokens**: [Tailwind CSS](https://tailwindcss.com/) with a custom Dark Obsidian & Terracotta Claymorphism design system
- **3D Graphics & Physics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://github.com/pmndrs/drei) (Procedural vertex noise displacement)
- **Motion & Micro-interactions**: [Framer Motion](https://www.framer.com/motion/) + [GSAP 3](https://greensock.com/gsap/) (ScrollTrigger)
- **Data Visualizations**: [Recharts](https://recharts.org/) (Flat responsive bar charts, interactive donut breakdowns)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend Architecture
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous Python web framework)
- **Runtime**: Python 3.12 (CPython)
- **Database ORM & Driver**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) + [psycopg2-binary](https://www.psycopg.org/)
- **Data Validation & Schemas**: [Pydantic v2](https://docs.pydantic.dev/) + `pydantic-settings`
- **Server**: [Uvicorn](https://www.uvicorn.org/) (ASGI standard)

### Machine Learning & Data Pipeline
- **Dataset**: IBM Watson HR Employee Telemetry (1,470 employee records, 35 attributes)
- **Model Engine**: [scikit-learn 1.9](https://scikit-learn.org/) (Class-balanced Logistic Regression classifier)
- **Performance**: $0.801$ ROC-AUC score, optimized high recall ($~85\%$ on departures)
- **Feature Pipeline**: Missing value median imputation, StandardScaler normalization, One-Hot categorical encoding, and mathematical log-odds per-instance XAI decomposition

### Infrastructure & DevOps
- **Containerization**: Multi-stage production [Docker](https://www.docker.com/) builds for both services
- **Database**: [PostgreSQL 16](https://www.postgresql.org/) with schema migrations and 9 dedicated SQL analytics views
- **Continuous Integration**: [GitHub Actions](https://github.com/features/actions) with live PostgreSQL service containers
- **Hosting Platforms**: [Render](https://render.com/) (Backend Web Service & Database) + [Vercel](https://vercel.com/) (Frontend CDN Edge)

---

## ✨ Core Platform Capabilities

### 1. Tactile Claymorphic Design System
Built from first principles using dual-directional soft lighting (`box-shadow: 8px 8px 16px rgba(0,0,0,0.4), -8px -8px 16px rgba(255,255,255,0.03)`), an obsidian dark-mode foundation (`#090a0f`), warm terracotta accents (`#e86034`), and avant-garde typography pairing (**Syne** headings + **Plus Jakarta Sans** body).

### 2. 9-View High-Performance SQL Engine
Encapsulates complex aggregations inside optimized database views rather than executing heavy Python computations on every request:
- `v_attrition_overview`: Total headcount, cumulative departures, baseline attrition rate ($16.12\%$).
- `v_attrition_by_department`: Turnover ratios across Sales ($20.63\%$), R&D ($13.84\%$), and HR ($19.05\%$).
- `v_attrition_by_salary_band`: Four salary tiers showcasing attrition concentration below $\$3,000/\text{mo}$.
- `v_attrition_by_overtime`: Comparison isolating OverTime staff ($30.5\%$) vs Non-OverTime staff ($10.4\%$).
- `v_attrition_by_satisfaction`: Correlation across 4 job satisfaction ratings.
- `v_attrition_by_worklife_balance`: Correlation across Work-Life Balance levels (1: Bad to 4: Best).
- `v_attrition_by_age_group`: Career-stage breakdown (Under 25, 25–34, 35–44, 45+).
- `v_attrition_by_promotion_gap`: Stagnation analysis mapping years since last promotion.
- `v_high_risk_profile`: Cross-tabulated high-risk cohorts (Department $\times$ Role $\times$ OverTime, $N \ge 10$) sorted by flight risk.

### 3. Real-Time Flight Risk Scanner (`/predict`)
Interactive tool for People Operations to test hypothetical and real employee telemetry profiles:
- Concentric radar scanning animation during inference.
- Animated SVG radial gauge displaying exact flight probability ($0.0\%$ to $100.0\%$).
- Ranked contributing factors with relative percentage bars.
- Prescriptive retention playbooks generated dynamically based on risk severity (Low, Medium, High).

### 4. Free-Tier Cold Start Resilience
Includes automated 3-second heartbeat detection on dashboard fetch sequences that gracefully alerts users when waking up free-tier serverless backend containers.

---

## 📁 Repository Structure

```
attrition-iq/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI (pytest + Postgres + npm build)
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes_analytics.py # 9 SQL view endpoints
│   │   │   ├── routes_health.py    # Liveness & metadata probes
│   │   │   └── routes_predict.py   # Live ML risk inference endpoint
│   │   ├── core/
│   │   │   ├── config.py           # Pydantic environment settings
│   │   │   └── database.py         # SQLAlchemy engine & session factory
│   │   ├── ml/
│   │   │   ├── features.py         # Feature engineering & transformation
│   │   │   ├── model.pkl           # Serialized scikit-learn model artifact
│   │   │   └── train.py            # Model training & serialization script
│   │   ├── schemas/
│   │   │   ├── analytics.py        # Pydantic schemas for SQL views
│   │   │   └── prediction.py       # Pydantic schemas for ML inference
│   │   ├── scripts/
│   │   │   ├── __init__.py
│   │   │   └── load_data.py        # Database schema initializer & CSV seeder
│   │   ├── services/
│   │   │   └── ml_service.py       # Prediction & XAI decomposition service
│   │   ├── sql/
│   │   │   ├── 01_schema.sql       # PostgreSQL employees table schema
│   │   │   └── 03_analytics_views.sql # 9 analytical SQL view definitions
│   │   └── main.py                 # FastAPI application factory & CORS configuration
│   ├── docs/
│   │   ├── findings.md             # Empirical business findings report
│   │   └── model_metrics.md        # ML performance, ROC-AUC, & recall metrics
│   ├── tests/
│   │   ├── test_analytics.py       # Unit & integration tests for SQL views
│   │   └── test_predict.py         # ML inference payload & edge case tests
│   ├── Dockerfile                  # Multi-stage Python 3.12 production container
│   ├── pyrightconfig.json          # Python type-checker configuration
│   ├── railway.json                # Railway deployment blueprint
│   └── requirements.txt            # Pinned backend dependencies
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Analytics dashboard view
│   │   ├── predict/
│   │   │   └── page.tsx            # Flight risk scanner tool
│   │   ├── favicon.ico
│   │   ├── globals.css             # Claymorphism CSS variables & lighting tokens
│   │   ├── layout.tsx              # Root layout & Google Font loaders
│   │   └── page.tsx                # Landing page with 3D Three.js hero
│   ├── components/
│   │   ├── clay/                   # Tactile Claymorphism UI component library
│   │   │   ├── clay-button.tsx
│   │   │   ├── clay-card.tsx
│   │   │   ├── clay-form-controls.tsx
│   │   │   ├── clay-panel.tsx
│   │   │   ├── dashboard-error.tsx
│   │   │   ├── dashboard-skeleton.tsx
│   │   │   ├── interactive-demo.tsx
│   │   │   ├── scanner-result.tsx
│   │   │   └── stat-counter.tsx
│   │   ├── three/
│   │   │   └── hero-scene.tsx      # R3F procedural deformable clay blob scene
│   │   ├── attrition-chart.tsx     # Recharts flat bar chart component
│   │   ├── department-breakdown.tsx# Recharts interactive donut component
│   │   ├── kpi-card.tsx            # Monospace animated count-up KPI card
│   │   └── risk-table.tsx          # High-risk cohort registry with sorting/filtering
│   ├── lib/
│   │   ├── api.ts                  # Typed client API layer
│   │   └── utils.ts                # Tailwind class utility helpers
│   ├── Dockerfile                  # Standalone Node.js 22 Alpine production container
│   ├── next.config.ts              # Next.js standalone build configuration
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml              # Turnkey local orchestration (DB + API + Web)
├── render.yaml                     # Render Infrastructure-as-Code blueprint
└── README.md                       # Comprehensive platform documentation
```

---

## ⚡ Quick Start & Installation

<details open>
<summary><b>Option A: One-Command Launch via Docker Compose (Recommended)</b></summary>

### Prerequisites
- [Docker Engine](https://docs.docker.com/engine/install/) ($20.10+$) and Docker Compose.

```bash
# 1. Clone repository
git clone https://github.com/[Your-GitHub-Username]/attrition-iq.git
cd attrition-iq

# 2. Build and launch all services
docker compose up --build
```

**Services will be initialized at:**
- **Web Application**: `http://localhost:3000`
- **FastAPI Backend**: `http://localhost:8000` (Interactive API Docs: `http://localhost:8000/docs`)
- **PostgreSQL Database**: `localhost:5432` (`attrition_iq`)

</details>

<details>
<summary><b>Option B: Manual Local Development (Without Docker)</b></summary>

### Prerequisites
- Python 3.12+
- Node.js 20+ and `npm`
- PostgreSQL 15+ running locally

### 1. Backend & Database Setup
```bash
cd backend

# Create virtual environment
python3.12 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Configure environment
export DATABASE_URL="postgresql://attrition:attrition@localhost:5432/attrition_iq"

# Initialize database schema & seed 1,470 employee records
python -m app.scripts.load_data

# Create analytics views
psql $DATABASE_URL -f app/sql/03_analytics_views.sql

# Start development server
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

</details>

---

## 🔐 Environment Variables

| Variable | Scope | Description | Default / Example Value |
|---|---|---|---|
| `DATABASE_URL` | Backend | PostgreSQL connection string | `postgresql://attrition:attrition@localhost:5432/attrition_iq` |
| `ALLOWED_ORIGINS` | Backend | Comma-separated list of allowed CORS origins | `http://localhost:3000,https://attrition-iq.vercel.app` |
| `NEXT_PUBLIC_API_URL` | Frontend | Base URL pointing to the deployed FastAPI backend | `https://attrition-iq-backend.onrender.com` |
| `PORT` | Backend/Frontend | Port for the respective web service | `8000` (Backend) / `3000` (Frontend) |
| `NEXT_TELEMETRY_DISABLED` | Frontend | Disables anonymous Next.js build telemetry | `1` |

---

## 📡 API Reference Catalog

### Health & Diagnostics
| Method | Endpoint | Description | Sample Output |
|---|---|---|---|
| `GET` | `/health` | Liveness probe & PostgreSQL connection test | `{"status": "ok", "db": "ok"}` |
| `GET` | `/info` | Metadata and registered SQL view directory | `{"version": "0.1.0", "views": [...]}` |

### Analytics Endpoints (`/analytics/*`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/analytics/overview` | Total headcount ($1,470$), departures ($237$), baseline attrition ($16.12\%$) |
| `GET` | `/analytics/by-department` | Turnover percentage and staff counts by department |
| `GET` | `/analytics/by-salary` | Attrition across 4 salary tiers ($<\$3\text{k}, \$3\text{k}\text{--}\$6\text{k}, \$6\text{k}\text{--}\$10\text{k}, \ge\$10\text{k}$) |
| `GET` | `/analytics/by-overtime` | OverTime attrition ($30.5\%$) vs Non-OverTime ($10.4\%$) |
| `GET` | `/analytics/by-satisfaction` | Attrition mapped across 4 satisfaction tiers |
| `GET` | `/analytics/by-worklife-balance` | Attrition mapped across Work-Life Balance levels (1 to 4) |
| `GET` | `/analytics/by-age-group` | Attrition across career stages (Under 25, 25–34, 35–44, 45+) |
| `GET` | `/analytics/by-promotion-gap` | Attrition by years since last promotion ($0\text{y}, 1\text{--}2\text{y}, 3\text{--}5\text{y}, 6+\text{y}$) |
| `GET` | `/analytics/high-risk-profiles` | Cross-tabulated high-risk cohorts ($N \ge 10$) sorted by risk |

### Risk Prediction Engine (`/predict/risk`)
- **Endpoint**: `POST /predict/risk`
- **Request Body**:
```json
{
  "age": 28,
  "department": "Sales",
  "job_role": "Sales Representative",
  "over_time": "Yes",
  "monthly_income": 3200,
  "business_travel": "Travel_Frequently",
  "distance_from_home": 15,
  "job_satisfaction": 1,
  "work_life_balance": 1,
  "years_since_last_promotion": 3,
  "years_at_company": 2,
  "marital_status": "Single",
  "total_working_years": 4,
  "environment_satisfaction": 2
}
```
- **Response Body (`200 OK`)**:
```json
{
  "risk_score": 0.9901,
  "risk_label": "High",
  "top_contributing_factors": [
    {
      "feature": "over_time_Yes",
      "importance": 1.5971
    },
    {
      "feature": "business_travel_Travel_Frequently",
      "importance": 1.4272
    },
    {
      "feature": "job_role_Sales Representative",
      "importance": 0.9381
    }
  ]
}
```

---

## 📊 Key Business Insights & Findings

From deep queries against the 1,470 employee records and model explanations:

1. **Overtime is the #1 Driver of Flight Risk**: Employees working consistent overtime experience a **$30.5\%$ attrition rate** compared to just **$10.4\%$** for non-overtime peers ($~3\times$ increase).
2. **Sales Representatives Are the Most Vulnerable Cohort**: The Sales division exhibits the highest departure rate (**$20.63\%$**), driven by frequent travel, lower base salaries, and low work-life balance scores.
3. **The $\$3,000/\text{month}$ Salary Cliff**: Attrition drops sharply above $\$3,000/\text{month}$. Above $\$6,000/\text{month}$, compensation increases yield diminishing retention returns compared to cultural/work-life factors.
4. **Promotion Stagnation Multiplier**: Employees with **3+ years without a promotion** show significant spikes in departure rates, underscoring the necessity of structured internal career mobility pathways.

---

## 🧪 Testing & Verification

```bash
# Run backend pytest suite (15 integration & unit tests)
cd backend
pytest -v

# Run frontend production build & TypeScript validation
cd frontend
npm run build
```

---

## 📄 License & Attribution

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Developed with precision for modern People Operations, HR Executives, and Engineering Leaders.
