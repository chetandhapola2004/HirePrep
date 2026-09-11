# HirePrep

HirePrep is an AI-powered interview preparation platform designed to help software engineers and technical candidates prepare effectively for job interviews. By analyzing a candidate's resume and target job description, HirePrep provides an objective match evaluation, role-specific technical questions, STAR-method behavioral questions, identified skill gaps, and a day-by-day preparation roadmap.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
  - [Authentication Routes](#authentication-routes)
  - [Interview Routes](#interview-routes)
  - [System Health](#system-health)
- [AI Engine and Prompt Pipeline](#ai-engine-and-prompt-pipeline)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

Modern technical interviews require candidates to demonstrate domain expertise, problem-solving, architectural decision-making, and behavioral leadership. HirePrep bridges the gap between candidate qualifications and employer expectations by analyzing job descriptions against candidate profiles using Google Gemini models with structured JSON schemas.

The system delivers:
- Calibrated match scores reflecting realistic alignment.
- Seniority-appropriate technical questions with comprehensive answers.
- Behavioral questions structured around the Situation, Task, Action, Result (STAR) framework.
- Prioritized skill gaps with severity ratings (low, medium, high).
- A step-by-step daily study roadmap tailored to the target role.

---

## Key Features

- Modern User Interface: Sleek dark-mode aesthetic with ambient lighting, glassmorphism cards, responsive typography, and micro-interactions.
- Real-Time File Feedback: Interactive drag-and-drop resume upload zone displaying file names, sizes, and quick removal controls.
- One-Click Sample Templates: Pre-configured role templates (Full Stack, Frontend React, Backend Cloud) for rapid testing.
- Dynamic AI Loading States: Multi-step animated progress indicators tracking qualification analysis, question generation, and roadmap synthesis.
- Resume Parsing: Extracts textual data from PDF resumes using pdf-parse with support for direct text self-descriptions.
- Intelligent Job Matching: Evaluates candidate experience, tech stack, and responsibilities against target job descriptions to produce a calibrated percentage match score (0 to 100).
- Scenario-Driven Technical Questions: Generates technical interview questions that test language internals, system architecture, trade-offs, scalability, and edge cases.
- STAR Behavioral Guidance: Provides situational questions addressing cross-functional teamwork, leadership, and conflict resolution, complete with structured model responses.
- Gap Identification: Flags missing or underrepresented tools, frameworks, and architectural concepts, labeled by severity.
- Actionable Daily Roadmap: Produces a progressive preparation schedule containing specific daily milestones, exercises, and interactive task checkboxes.
- Secure Authentication: Full authentication flow using bcryptjs password hashing, JSON Web Tokens (JWT), and HTTP-only cookies.
- Report History: Users can view, reopen, and manage all previously generated interview preparation reports from a persistent dashboard.

---

## Architecture

HirePrep operates as a decoupled client-server web application:

1. Client (Frontend): Built with React 19 and Vite. Manages user sessions, file uploads, interactive question accordions, checklist roadmaps, and match visualizations.
2. Server (Backend): Express.js REST API providing authentication, file upload processing via Multer, and report retrieval.
3. Database (MongoDB Atlas): Persists user credentials and structured interview reports via Mongoose.
4. AI Service: Interacts with Google Gemini via `@google/genai` utilizing structured output schemas (Zod and zod-to-json-schema) with automatic model fallback resilience.

---

## Technology Stack

### Frontend
- Library: React 19
- Build Tool: Vite
- Routing: React Router v7
- HTTP Client: Axios
- Styling: Custom CSS with dark aesthetic design tokens, glassmorphism, and Google Fonts (Plus Jakarta Sans)

### Backend
- Runtime: Node.js
- Framework: Express.js (v5)
- Database: MongoDB with Mongoose ODM
- Authentication: JSON Web Tokens (jsonwebtoken), bcryptjs, cookie-parser
- File Handling: Multer, pdf-parse
- AI Integration: `@google/genai` (Gemini models)
- Schema Validation: Zod, zod-to-json-schema
- CORS and Security: cors, cookie-based session management, trust-proxy support

---

## Project Structure

```text
HirePrep/
|-- Backend/
|   |-- src/
|   |   |-- config/
|   |   |   `-- database.js         # MongoDB connection configuration
|   |   |-- controllers/
|   |   |   |-- auth.controller.js      # Register, login, logout, user info
|   |   |   `-- interview.controller.js # Report generation, retrieval
|   |   |-- middlewares/
|   |   |   |-- auth.middleware.js      # JWT authentication middleware
|   |   |   `-- file.middleware.js      # Multer memory storage configuration
|   |   |-- models/
|   |   |   |-- interviewReport.model.js# Interview report MongoDB schema
|   |   |   `-- user.model.js           # User credentials schema
|   |   |-- routes/
|   |   |   |-- auth.routes.js          # Auth endpoint routing
|   |   |   `-- interview.routes.js     # Interview endpoint routing
|   |   |-- services/
|   |   |   `-- ai.service.js           # Gemini AI generation and prompt pipeline
|   |   `-- app.js                  # Express application configuration
|   |-- server.js                   # Backend entry point
|   `-- package.json
|-- Frontend/
|   |-- src/
|   |   |-- features/
|   |   |   |-- auth/               # Auth context, hooks, login/register pages
|   |   |   `-- interview/          # Interview context, hooks, home and report pages
|   |   |-- style/                  # Component and layout stylesheets
|   |   |-- App.jsx
|   |   |-- app.routes.jsx          # Client route definitions
|   |   |-- main.jsx                # Application mount point
|   |   `-- style.css               # Global design tokens and animations
|   |-- index.html
|   |-- vite.config.js
|   `-- package.json
`-- README.md
```

---

## Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (version 18.0.0 or higher)
- npm (version 9.0.0 or higher)
- MongoDB (local instance or MongoDB Atlas cluster connection string)
- Google Gemini API Key (obtained from Google AI Studio)

---

## Environment Variables

### Backend Configuration

Create a `.env` file in the `Backend` directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key_here
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
GEMINI_MODEL=gemini-3.6-flash
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (defaults to 3000) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key used for signing authentication tokens |
| `GOOGLE_GENAI_API_KEY` | Yes | Google Gemini API key for report generation |
| `FRONTEND_URL` | No | URL of the frontend for CORS origin handling |
| `GEMINI_MODEL` | No | Gemini model identifier (defaults to `gemini-3.6-flash`) |

### Frontend Configuration

Create a `.env` file in the `Frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend base URL for API requests |

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/chetandhapola2004/HirePrep.git
cd HirePrep
```

### 2. Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your `Backend/.env` file as shown in the [Environment Variables](#backend-configuration) section.

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will be available at `http://localhost:3000`.

### 3. Frontend Setup

1. From the repository root, navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your `Frontend/.env` file with `VITE_API_URL`.

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The client application will typically run at `http://localhost:5173`.

---

## API Reference

### Authentication Routes

All authentication routes are prefixed with `/api/auth`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user account |
| POST | `/login` | Public | Authenticate existing user and issue token |
| POST | `/logout` | Private | Clear session cookie |
| GET | `/me` | Private | Retrieve authenticated user profile |

#### POST `/api/auth/register`
Request Body:
```json
{
  "email": "developer@example.com",
  "password": "SecurePassword123",
  "name": "Jane Doe"
}
```

#### POST `/api/auth/login`
Request Body:
```json
{
  "email": "developer@example.com",
  "password": "SecurePassword123"
}
```

---

### Interview Routes

All interview routes are prefixed with `/api/interview` and require authentication.

| Method | Endpoint | Content-Type | Description |
|---|---|---|---|
| POST | `/` | `multipart/form-data` | Generate a new interview report |
| GET | `/report/:interviewId` | `application/json` | Fetch complete report by ID |
| GET | `/` | `application/json` | Fetch all reports for the logged-in user |

#### POST `/api/interview/`
Form Data Parameters:
- `jobDescription` (Text, Required): Full text of the target position description.
- `selfDescription` (Text, Optional): Candidate summary or background details.
- `resume` (File, Optional): Candidate resume in PDF format (Max 3MB).

*Note: At least one of `resume` or `selfDescription` must be provided.*

Sample Response:
```json
{
  "message": "Interview report generated successfully.",
  "interviewReport": {
    "_id": "664b19c2f451a92e18d9f102",
    "title": "Senior Backend Engineer (Node.js/Express)",
    "matchScore": 82,
    "technicalQuestions": [
      {
        "question": "How does the Node.js event loop handle asynchronous I/O operations, and how would you resolve a scenario where CPU-bound work blocks the event loop in Express?",
        "intention": "Evaluates architectural comprehension of Node.js concurrency, libuv worker pools, and clustering/worker threads.",
        "answer": "Explain the phases of the event loop, offloading compute tasks to Worker Threads or external queues like BullMQ."
      }
    ],
    "behavioralQuestions": [
      {
        "question": "Describe a scenario where you had to push back on a high-priority feature request due to technical debt.",
        "intention": "Assesses engineering maturity, communication with stakeholders, and trade-off analysis.",
        "answer": "STAR Format: Situation, Task, Action, Result detailing risk demonstration and incremental migration."
      }
    ],
    "skillGaps": [
      {
        "skill": "Redis Caching Strategies",
        "severity": "medium"
      }
    ],
    "preparationPlan": [
      {
        "day": 1,
        "focus": "Node.js Core Internals and Asynchronous Architecture",
        "tasks": [
          "Review event loop phases (timers, I/O callbacks, poll, check, close).",
          "Build a minimal cluster-mode API with PM2."
        ]
      }
    ],
    "createdAt": "2026-09-12T03:02:40.123Z"
  }
}
```

---

### System Health

- `GET /api/health`: Returns `{ "status": "ok" }` for monitoring and uptime checks.
- `GET /`: Returns confirmation that the backend service is running.

---

## AI Engine and Prompt Pipeline

The AI engine in `Backend/src/services/ai.service.js` employs several optimizations to ensure high-quality, reproducible output:

1. System Instruction Persona: Configures the model as a Principal Engineer and Technical Hiring Director to eliminate generic responses and calibrate ratings.
2. Strict JSON Schema Validation: Uses Zod definitions combined with `zod-to-json-schema` to enforce field types and constraints directly in the Gemini generation config (`responseMimeType: "application/json"`).
3. STAR Methodology: Requires behavioral questions to feature structured Situation, Task, Action, and Result guidelines.
4. Model Resilience and Fallback: Attempts generation using the primary model (`gemini-3.6-flash`) and automatically falls back to `gemini-3-flash-preview` if availability or quota issues arise.
5. Markdown Strip Parsing: Protects against occasional markdown-enclosed responses, ensuring reliable JSON parsing.

---

## Deployment

### Backend (Render, Railway, or VPS)
1. Ensure environment variables (`MONGO_URI`, `JWT_SECRET`, `GOOGLE_GENAI_API_KEY`, `FRONTEND_URL`) are set in the hosting provider dashboard.
2. Build and start command:
   ```bash
   npm install && npm start
   ```
3. Set `trust proxy` configuration (already enabled in `Backend/src/app.js`) for proper cookie transmission across secure HTTPS proxies.

### Frontend (Vercel, Netlify)
1. Set the root directory to `Frontend` if deploying from a monorepo.
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add the `VITE_API_URL` environment variable pointing to your deployed backend URL.

---
