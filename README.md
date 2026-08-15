# Nexus AI — Intelligent Career Acceleration Engine

Nexus AI is an end-to-end full-stack AI platform engineered for developers, AI engineers, and tech professionals. It analyzes user education, technical skills, portfolio projects, career goals, and resume content to provide actionable career roadmaps, real-time ATS compatibility scoring, skill gap analysis, job matching, and context-aware AI mentorship.

---

## 🚀 Key Features

* **Public SaaS Landing Page**: Modern visual design showcasing product vision, capabilities, and dashboard preview.
* **JWT Authentication**: Password hashing using bcryptjs, JWT token persistence, and protected workspace routes.
* **Guided Onboarding**: Multi-step setup wizard collecting background, skills, and target career domains.
* **Main Intelligence Dashboard**: Visualizing Career Readiness Index (0-100), Skill Strength, Resume ATS rating, and recent activity timeline.
* **AI Assistant Workspace**: Interactive chat workspace with thread history, suggested prompts, and live profile context integration.
* **Resume Intelligence Engine**: Upload PDF resumes to extract text, calculate visual ATS score, isolate missing keywords, and render actionable recommendations.
* **Skill Inventory & Gap Analyzer**: Group skills by category, edit proficiency levels, and perform live gap audits against target tech roles.
* **Career Path Progression**: Explore stage-by-stage learning timelines for AI Engineer, Full Stack Developer, Data Scientist, and Backend Developer.
* **AI Job Description Matcher**: Paste job postings to calculate match score %, strong vs missing skills, and custom preparation steps.
* **Personalized Learning Roadmap**: 4-phase milestone tracking with interactive checkmark completion toggles persisted to MongoDB.
* **Portfolio Project Intelligence**: Log projects with tech stack and GitHub/live links, and run AI quality audits for resume impact.
* **Recharts Analytics & Growth**: Data visualizations tracking readiness trends and skill category distribution.
* **Account Settings & Security**: Provider key override options, profile preference management, and confirmed account deletion.

---

## 🛠 Tech Stack

### Frontend
* **Core**: React 18, Vite
* **Styling**: Tailwind CSS, Custom Glassmorphism, CSS Micro-animations
* **Icons**: Lucide React
* **Data Visualization**: Recharts
* **Networking**: Axios
* **Routing**: React Router DOM v6

### Backend
* **Runtime**: Node.js, Express.js
* **Database**: MongoDB, Mongoose ORM
* **Authentication**: JSON Web Tokens (JWT), bcryptjs
* **File Processing**: Multer, pdf-parse
* **AI Service Layer**: Google Generative AI SDK (`@google/generative-ai` Gemini API) with smart deterministic fallback rule engine for 100% offline out-of-the-box reliability.

---

## 📁 Directory Structure

```
D:\Coding\nexus-ai
├── client/
│   ├── src/
│   │   ├── components/        # Reusable UI library (Button, Card, Input, Modal, StatCard, ChatMessage)
│   │   ├── context/           # AuthContext & state provider
│   │   ├── layouts/           # AppLayout, AuthLayout, PublicLayout
│   │   ├── pages/             # LandingPage, DashboardPage, AIAssistantPage, ResumePage, SkillsPage, etc.
│   │   ├── services/          # Axios API configuration
│   │   ├── App.jsx            # Router switchboard
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Tailwind CSS directives
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/            # MongoDB connection
│   │   ├── controllers/       # Auth, Profile, Skill, Project, Resume, Career, Job, Roadmap, Chat, Analytics
│   │   ├── middleware/        # JWT auth protection, multer file upload, central error handler
│   │   ├── models/            # User, Profile, Skill, Project, Resume, CareerGoal, Roadmap, JobAnalysis, Conversation, Activity
│   │   ├── routes/            # Express REST endpoint router files
│   │   ├── services/ai/       # Modular AI Service Layer (ai.service.js, prompt.service.js, context.service.js)
│   │   ├── utils/             # Database seed script (seed.js)
│   │   └── server.js          # Express app entry point
│   └── package.json
│
├── package.json               # Root workspace runner
└── README.md
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in `server/` with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nexus-ai
JWT_SECRET=nexus_ai_super_secret_jwt_key_2026
GEMINI_API_KEY=your_google_gemini_api_key_here
CLIENT_URL=http://localhost:5174
NODE_ENV=development
```

*(Note: If `GEMINI_API_KEY` is not provided, the modular AI service layer automatically runs its smart local fallback engine so all features remain functional out of the box).*

---

## 🚦 Quick Start Guide

### 1. Install Dependencies

From root (`D:\Coding\nexus-ai`):

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Seed Demo Data (Optional)

```bash
cd server
npm run seed
```
*Demo Login:*
* **Email**: `demo@nexusai.com`
* **Password**: `Password123!`

### 3. Run Backend Server

```bash
cd server
npm run dev
```
*Backend API running at http://localhost:5000*

### 4. Run Frontend Client

```bash
cd client
npm run dev
```
*Frontend App running at http://localhost:5174*

---

## 🔒 Security & Architecture Standards

* Password hashing via bcryptjs with 10 salt rounds.
* Bearer JWT token header authorization on protected routes.
* Express error handling returning consistent JSON responses `{ success: false, message: "..." }`.
* File upload validation restricting extensions to PDF and document text files up to 10MB.
* Modular AI Service abstraction isolating prompt creation, context aggregation, and LLM inference.
